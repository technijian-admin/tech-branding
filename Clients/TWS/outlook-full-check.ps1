Add-Type -AssemblyName 'Microsoft.Office.Interop.Outlook' 2>$null

$ol = $null

# Try GetActiveObject first
try {
    $ol = [System.Runtime.InteropServices.Marshal]::GetActiveObject('Outlook.Application')
    Write-Host 'Connected via GetActiveObject'
} catch {
    Write-Host ('GetActiveObject failed: ' + $_.Exception.Message)
}

# Fall back to CreateObject (attaches to running instance or launches new)
if (-not $ol) {
    try {
        $ol = New-Object -ComObject Outlook.Application
        Write-Host 'Connected via CreateObject'
    } catch {
        Write-Host ('CreateObject also failed: ' + $_.Exception.Message)
        exit 1
    }
}

$ns = $ol.GetNamespace('MAPI')
Write-Host ('MAPI session user: ' + $ns.CurrentUser.Name)

# Check rjain store
$store = $null
foreach ($s in $ns.Stores) {
    if ($s.DisplayName -eq 'rjain@Technijian.com') { $store = $s; break }
}
if (-not $store) { Write-Host 'rjain@Technijian.com store NOT found'; exit 1 }
Write-Host ('Found store: ' + $store.DisplayName)

# Check Drafts
$drafts = $store.GetDefaultFolder(16)
Write-Host ('Drafts count: ' + $drafts.Items.Count)
foreach ($item in $drafts.Items) {
    Write-Host ('  DRAFT: ' + $item.Subject + ' | To: ' + $item.To)
}

# Check AI-Prepared folder
Write-Host '--- Root folders ---'
foreach ($f in $store.GetRootFolder().Folders) {
    Write-Host ('  Folder: ' + $f.Name + ' (' + $f.Items.Count + ' items)')
    if ($f.Name -eq 'AI-Prepared') {
        foreach ($item in $f.Items) {
            Write-Host ('    ITEM: ' + $item.Subject + ' | To: ' + $item.To)
        }
    }
}
