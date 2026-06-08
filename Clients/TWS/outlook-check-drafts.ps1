Add-Type -AssemblyName 'Microsoft.Office.Interop.Outlook' 2>$null
try {
    $ol = [System.Runtime.InteropServices.Marshal]::GetActiveObject('Outlook.Application')
    Write-Host 'Got active Outlook instance'
    $ns = $ol.GetNamespace('MAPI')
    Write-Host '--- Accounts ---'
    foreach ($acct in $ns.Accounts) {
        Write-Host ('Account: ' + $acct.DisplayName + ' / ' + $acct.SmtpAddress)
    }
    Write-Host '--- All Stores + Drafts ---'
    foreach ($store in $ns.Stores) {
        Write-Host ('Store: ' + $store.DisplayName)
        try {
            $drafts = $store.GetDefaultFolder(16)
            Write-Host ('  Drafts path: ' + $drafts.FullFolderPath + ' | count: ' + $drafts.Items.Count)
            foreach ($item in $drafts.Items) {
                Write-Host ('    [' + $item.Class + '] Subject: ' + $item.Subject + ' | To: ' + $item.To)
            }
        } catch {
            Write-Host ('  (no drafts folder: ' + $_.Exception.Message + ')')
        }
    }
} catch {
    Write-Host ('Error connecting to Outlook: ' + $_.Exception.Message)
}
