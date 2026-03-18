# Send email signatures to SEO / Digital Marketing team
# Uses Microsoft Graph API via Azure AD app auth

# --- Auth ---
# Credentials stored in: c:\vscode\admin-job-postings\job-postings\Keys\keys.md
# App: HiringPipeline-Automation (Azure AD)
$secureSecret = ConvertTo-SecureString $env:AZURE_CLIENT_SECRET -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($env:AZURE_CLIENT_ID, $secureSecret)
Connect-MgGraph -TenantId $env:AZURE_TENANT_ID -ClientSecretCredential $credential -NoWelcome

$sigDir = "C:\vscode\tech-branding\tech-branding\assets\email\signatures\employees"

# --- SEO / Digital Marketing Team ---
$seoTeam = @(
    @{ Name = "Mohit Pandey";    Email = "Mpandey@technijian.com" }
    @{ Name = "Puneet Kumar";    Email = "pkumar@Technijian.com" }
    @{ Name = "Saroj Kumari";    Email = "skumari@technijian.com" }
    @{ Name = "Vaishali Rathor"; Email = "Vrathor@technijian.com" }
)

Write-Host "Sending email signatures to $($seoTeam.Count) SEO team members...`n"

foreach ($member in $seoTeam) {
    $firstName = ($member.Name -split " ")[0]
    $sigFile = Join-Path $sigDir "$($member.Name).html"

    if (-not (Test-Path $sigFile)) {
        Write-Host "  WARNING: No signature file for $($member.Name) - SKIPPED" -ForegroundColor Yellow
        continue
    }

    $sigBytes = [System.IO.File]::ReadAllBytes($sigFile)
    $sigBase64 = [Convert]::ToBase64String($sigBytes)

    $htmlBody = @"
<html><body style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;color:#333;">
<p>Hi $firstName,</p>

<p>We have a new standardized Technijian email signature for the team. Your personalized signature is attached to this email. Please follow the steps below to set it up.</p>

<h3 style="color:#006DB6;margin-bottom:4px;">Option 1 &mdash; Outlook Desktop App</h3>
<ol>
<li>Save the attached <b>$($member.Name).html</b> file to your computer</li>
<li>Open it in your web browser (Chrome, Edge, etc.)</li>
<li>Press <b>Ctrl+A</b> to select everything, then <b>Ctrl+C</b> to copy</li>
<li>In Outlook, go to <b>File &rarr; Options &rarr; Mail &rarr; Signatures</b></li>
<li>Click <b>New</b>, name it <b>Technijian</b></li>
<li>Click in the signature editor box and press <b>Ctrl+V</b> to paste</li>
<li>Under <b>Choose default signature</b>, set it for both <b>New messages</b> and <b>Replies/forwards</b></li>
<li>Click <b>OK</b> to save</li>
</ol>

<h3 style="color:#006DB6;margin-bottom:4px;">Option 2 &mdash; Outlook on the Web (outlook.office.com)</h3>
<ol>
<li>Save the attached <b>$($member.Name).html</b> file and open it in your browser</li>
<li>Press <b>Ctrl+A</b> then <b>Ctrl+C</b> to copy</li>
<li>Go to <a href="https://outlook.office.com">outlook.office.com</a></li>
<li>Click the <b>gear icon</b> (top right) &rarr; <b>View all Outlook settings</b></li>
<li>Go to <b>Mail &rarr; Compose and reply</b></li>
<li>Under <b>Email signature</b>, click in the editor and press <b>Ctrl+V</b> to paste</li>
<li>Check both boxes: <b>&quot;Automatically include my signature on new messages&quot;</b> and <b>&quot;on replies/forwards&quot;</b></li>
<li>Click <b>Save</b></li>
</ol>

<p><b>Important:</b> Your signature includes two booking buttons &mdash; a blue <b>&quot;Book a Meeting&quot;</b> button (your personal booking link) and an orange <b>&quot;Book SEO Meeting&quot;</b> button (SEO team booking page). Both are already configured with the correct links.</p>

<p style="color:#59595B;font-size:13px;">If you run into any issues setting this up, please reach out to IT support.</p>

<p>Thank you,<br><b>Technijian IT</b></p>
</body></html>
"@

    $params = @{
        Message = @{
            Subject = "Action Required: Set Up Your New Technijian Email Signature"
            Body = @{
                ContentType = "HTML"
                Content = $htmlBody
            }
            ToRecipients = @(
                @{ EmailAddress = @{ Address = $member.Email } }
            )
            Attachments = @(
                @{
                    "@odata.type" = "#microsoft.graph.fileAttachment"
                    Name = "$($member.Name).html"
                    ContentType = "text/html"
                    ContentBytes = $sigBase64
                }
            )
        }
        SaveToSentItems = $true
    }

    try {
        Send-MgUserMail -UserId "RJain@technijian.com" -BodyParameter $params
        Write-Host "  Sent to $($member.Name) ($($member.Email))" -ForegroundColor Green
    }
    catch {
        Write-Host "  FAILED: $($member.Name) - $($_.Exception.Message)" -ForegroundColor Red
    }

    Start-Sleep -Seconds 1
}

Write-Host "`nDone! All SEO team emails sent."
