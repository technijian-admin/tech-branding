Add-Type -AssemblyName 'Microsoft.Office.Interop.Outlook' 2>$null
try {
    # Try GetActiveObject first, fall back to CreateObject
    try {
        $ol = [System.Runtime.InteropServices.Marshal]::GetActiveObject('Outlook.Application')
        Write-Host 'Connected to running Outlook'
    } catch {
        $ol = New-Object -ComObject Outlook.Application
        Write-Host 'Launched new Outlook instance'
    }

    $ns = $ol.GetNamespace('MAPI')
    $ns.Logon($null, $null, $false, $false)

    # Find the rjain@Technijian.com store
    $store = $null
    foreach ($s in $ns.Stores) {
        if ($s.DisplayName -eq 'rjain@Technijian.com') { $store = $s; break }
    }
    if (-not $store) { throw 'Could not find rjain@Technijian.com store' }

    # Find AI-Prepared folder
    $aiFolder = $null
    foreach ($f in $store.GetRootFolder().Folders) {
        if ($f.Name -eq 'AI-Prepared') { $aiFolder = $f; break }
    }
    if (-not $aiFolder) { throw 'AI-Prepared folder not found' }
    Write-Host ('Found AI-Prepared folder: ' + $aiFolder.FullFolderPath)

    # Get the active explorer and add to Favorites
    $explorer = $ol.ActiveExplorer()
    if (-not $explorer) {
        # Open an explorer window
        $ol.Explorers.Add($aiFolder, 0) | Out-Null
        Start-Sleep -Milliseconds 800
        $explorer = $ol.ActiveExplorer()
    }

    if ($explorer) {
        $navPane = $explorer.NavigationPane
        foreach ($mod in $navPane.Modules) {
            if ($mod.NavigationModuleType -eq 1) {  # olModuleMail = 1
                foreach ($grp in $mod.NavigationGroups) {
                    if ($grp.GroupType -eq 1) {  # olGroupMailFavorites = 1
                        try {
                            $grp.NavigationFolders.Add($aiFolder)
                            Write-Host 'Added AI-Prepared to Favorites!'
                        } catch {
                            Write-Host ('Add to favorites error (may already exist): ' + $_.Exception.Message)
                        }
                    }
                }
                break
            }
        }
    } else {
        Write-Host 'No explorer window available — open Outlook and manually right-click AI-Prepared > Add to Favorites'
    }
} catch {
    Write-Host ('Error: ' + $_.Exception.Message)
}
