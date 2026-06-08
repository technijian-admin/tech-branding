Add-Type -AssemblyName 'Microsoft.Office.Interop.Outlook' 2>$null
try {
    $ol = [System.Runtime.InteropServices.Marshal]::GetActiveObject('Outlook.Application')
    $ns = $ol.GetNamespace('MAPI')

    # Find the rjain@Technijian.com store
    $store = $null
    foreach ($s in $ns.Stores) {
        if ($s.DisplayName -eq 'rjain@Technijian.com') {
            $store = $s
            break
        }
    }
    if (-not $store) { throw 'Could not find rjain@Technijian.com store' }

    # Get root folder of that store
    $root = $store.GetRootFolder()
    Write-Host ('Root folder: ' + $root.Name)

    # Create AI-Prepared folder if it doesn't exist
    $aiFolder = $null
    foreach ($f in $root.Folders) {
        if ($f.Name -eq 'AI-Prepared') { $aiFolder = $f; break }
    }
    if (-not $aiFolder) {
        $aiFolder = $root.Folders.Add('AI-Prepared')
        Write-Host 'Created folder: AI-Prepared'
    } else {
        Write-Host 'Folder AI-Prepared already exists'
    }

    # Find and move the ThriveWell draft from Drafts
    $drafts = $store.GetDefaultFolder(16)
    $found = $false
    foreach ($item in $drafts.Items) {
        if ($item.Subject -like '*ThriveWell*') {
            $item.Move($aiFolder) | Out-Null
            Write-Host ('Moved draft: ' + $item.Subject)
            $found = $true
            break
        }
    }
    if (-not $found) {
        Write-Host 'ThriveWell draft not found in Drafts — checking if already in AI-Prepared'
        foreach ($item in $aiFolder.Items) {
            Write-Host ('  Found in AI-Prepared: ' + $item.Subject)
        }
    }

    Write-Host ('AI-Prepared folder count: ' + $aiFolder.Items.Count)
    foreach ($item in $aiFolder.Items) {
        Write-Host ('  Item: ' + $item.Subject + ' | To: ' + $item.To)
    }
    Write-Host 'Done.'
} catch {
    Write-Host ('Error: ' + $_.Exception.Message)
}
