# Send polo shirt vendor outreach emails with Technijian logo attached
# Uses Microsoft Graph API via Azure AD app auth

# --- Auth ---
# Credentials stored in: c:\vscode\admin-job-postings\job-postings\Keys\keys.md
# App: HiringPipeline-Automation (Azure AD)
$secureSecret = ConvertTo-SecureString $env:AZURE_CLIENT_SECRET -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($env:AZURE_CLIENT_ID, $secureSecret)
Connect-MgGraph -TenantId $env:AZURE_TENANT_ID -ClientSecretCredential $credential -NoWelcome

# --- Logo attachments ---
$logoSvg = "C:\vscode\tech-branding\tech-branding\assets\logos\svg\technijian-logo-full-color.svg"
$logoPng = "C:\vscode\tech-branding\tech-branding\assets\logos\png\technijian-logo-full-color-2400x502.png"

$svgBytes = [System.IO.File]::ReadAllBytes($logoSvg)
$svgBase64 = [Convert]::ToBase64String($svgBytes)

$pngBytes = [System.IO.File]::ReadAllBytes($logoPng)
$pngBase64 = [Convert]::ToBase64String($pngBytes)

# --- Email body ---
$emailBodyFile = "C:\vscode\tech-branding\tech-branding\assets\corporate-merchandise\vendor-outreach-email.html"
$htmlBody = Get-Content -Path $emailBodyFile -Raw

# --- Vendors ---
$vendors = @(
    @{ Name = "Ajna Clothings";     Email = "ajnaclothingstirupur@gmail.com" }
    @{ Name = "Polos Inc";          Email = "info@polos.in" }
    @{ Name = "Uniform Bucket";     Email = "unifrombucket@gmail.com" }
)

Write-Host "Sending vendor outreach to $($vendors.Count) vendors...`n"

foreach ($vendor in $vendors) {
    $params = @{
        Message = @{
            Subject = "Technijian - Quote Request for 200 Custom Embroidered Corporate Polo Shirts"
            Body = @{
                ContentType = "HTML"
                Content = $htmlBody
            }
            ToRecipients = @(
                @{ EmailAddress = @{ Address = $vendor.Email } }
            )
            Attachments = @(
                @{
                    "@odata.type" = "#microsoft.graph.fileAttachment"
                    Name = "technijian-logo-full-color.svg"
                    ContentType = "image/svg+xml"
                    ContentBytes = $svgBase64
                }
                @{
                    "@odata.type" = "#microsoft.graph.fileAttachment"
                    Name = "technijian-logo-full-color-2400x502.png"
                    ContentType = "image/png"
                    ContentBytes = $pngBase64
                }
            )
        }
        SaveToSentItems = $true
    }

    try {
        Send-MgUserMail -UserId "RJain@technijian.com" -BodyParameter $params
        Write-Host "  Sent to $($vendor.Name) ($($vendor.Email))" -ForegroundColor Green
    }
    catch {
        Write-Host "  FAILED: $($vendor.Name) - $($_.Exception.Message)" -ForegroundColor Red
    }

    Start-Sleep -Seconds 2
}

Write-Host "`nDone! Outreach emails sent."
Write-Host "`nNOTE: Blue Wear Garments and Tirupur Brands do not have direct email addresses."
Write-Host "  - Blue Wear Garments: Contact via IndiaMART at https://www.indiamart.com/blueweargarments/"
Write-Host "  - Tirupur Brands: Contact via website form at https://tirupurbrands.in/"
