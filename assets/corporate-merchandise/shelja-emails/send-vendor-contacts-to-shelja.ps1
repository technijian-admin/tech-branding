# Send vendor contact info (Tee Tops + Sunstar) to Shelja
# Context: Shelja asked Sunstar for contact info on 04/17. Proactively sending
# what we already have for BOTH vendors so she can coordinate India-side
# sample payments without making the same ask to Tee Tops.

# --- Auth ---
# Credentials via env vars (see: c:\vscode\admin-job-postings\job-postings\Keys\keys.md)
# App: HiringPipeline-Automation (Azure AD)
$secureSecret = ConvertTo-SecureString $env:AZURE_CLIENT_SECRET -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($env:AZURE_CLIENT_ID, $secureSecret)
Connect-MgGraph -TenantId $env:AZURE_TENANT_ID -ClientSecretCredential $credential -NoWelcome

# --- Ravi signature ---
$sigPath = "C:\vscode\tech-branding\tech-branding\assets\email\signatures\ravi-jain\ravi-jain.html"
$signature = Get-Content -Path $sigPath -Raw

# --- Email body (ASCII-only; unicode expressed as HTML entities) ---
# Rupee: &#8377;  |  em-dash: &mdash;  |  right-single-quote: &rsquo;
$htmlBody = @"
<html>
<body style="font-family:'Open Sans','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#1A1A2E;line-height:1.55;">

<p>Hi Shelja,</p>

<p>Saw your note on the Sunstar thread asking Munesh for his contact info. To save a round-trip, here is what we already have on file for <strong>both</strong> vendors you&rsquo;ll be coordinating sample payments with. Please feel free to reach out to either directly for UPI / IMPS details.</p>

<h3 style="color:#006DB6;margin:18px 0 6px 0;font-size:15px;">1. Tee Tops &mdash; Sample: XL + XXL (&#8377;2,000 total)</h3>
<table cellpadding="4" cellspacing="0" border="0" style="font-size:13px;color:#1A1A2E;border-collapse:collapse;">
  <tr><td style="padding-right:12px;color:#59595B;">Contact:</td><td><strong>Chandru</strong> (Managing Director)</td></tr>
  <tr><td style="padding-right:12px;color:#59595B;">Phone:</td><td><a href="tel:+918056464646" style="color:#006DB6;text-decoration:none;">+91 80564 64646</a></td></tr>
  <tr><td style="padding-right:12px;color:#59595B;">Email:</td><td><a href="mailto:info@onlinetshirts.in" style="color:#006DB6;text-decoration:none;">info@onlinetshirts.in</a></td></tr>
  <tr><td style="padding-right:12px;color:#59595B;">Website:</td><td><a href="https://www.onlinetshirts.in" style="color:#006DB6;text-decoration:none;">www.onlinetshirts.in</a></td></tr>
  <tr><td style="padding-right:12px;color:#59595B;vertical-align:top;">Address:</td><td>17 Muthusamy Street, Thiruvallur Nagar, Odakkadu,<br>Tirupur 641603, Tamil Nadu</td></tr>
</table>

<h3 style="color:#006DB6;margin:18px 0 6px 0;font-size:15px;">2. Sunstar Apparels Pvt. Ltd. &mdash; Sample: 2XL = USA XL (&#8377;1,000)</h3>
<table cellpadding="4" cellspacing="0" border="0" style="font-size:13px;color:#1A1A2E;border-collapse:collapse;">
  <tr><td style="padding-right:12px;color:#59595B;">Contact:</td><td><strong>Munesh Joshi</strong></td></tr>
  <tr><td style="padding-right:12px;color:#59595B;">Mobile:</td><td><a href="tel:+919099962272" style="color:#006DB6;text-decoration:none;">+91 90999 62272</a></td></tr>
  <tr><td style="padding-right:12px;color:#59595B;">Office (Ahmedabad):</td><td><a href="tel:+917940300787" style="color:#006DB6;text-decoration:none;">+91 79 4030 0787</a></td></tr>
  <tr><td style="padding-right:12px;color:#59595B;">Email:</td><td><a href="mailto:sales@sunstar.co.in" style="color:#006DB6;text-decoration:none;">sales@sunstar.co.in</a></td></tr>
  <tr><td style="padding-right:12px;color:#59595B;">Website:</td><td><a href="https://www.sunstarapparel.com" style="color:#006DB6;text-decoration:none;">sunstarapparel.com</a> / <a href="https://www.sunstartirupur.com" style="color:#006DB6;text-decoration:none;">sunstartirupur.com</a></td></tr>
  <tr><td style="padding-right:12px;color:#59595B;vertical-align:top;">Corporate office:</td><td>201, SG Mall, Opp. Home Town, Thaltej,<br>Ahmedabad 380015, Gujarat</td></tr>
  <tr><td style="padding-right:12px;color:#59595B;">Manufacturing:</td><td>New Tirupur, Tamil Nadu</td></tr>
</table>

<p style="margin-top:18px;">Both samples are being shipped to our Panchkula office. Once either vendor replies with UPI / IMPS / bank details, please transfer the sample amount from the India entity and reply-all confirming. If anything else comes up on either thread, I&rsquo;ll loop you in.</p>

<p>Thanks!</p>

<p>Ravi</p>

$signature

</body>
</html>
"@

$params = @{
    Message = @{
        Subject = "Polo shirt vendor contacts (Tee Tops + Sunstar) for sample payment coordination"
        Body = @{
            ContentType = "HTML"
            Content = $htmlBody
        }
        ToRecipients = @(
            @{ EmailAddress = @{ Address = "smehta@technijian.com" } }
        )
    }
    SaveToSentItems = $true
}

try {
    Send-MgUserMail -UserId "RJain@technijian.com" -BodyParameter $params
    Write-Host "  Sent to Shelja (smehta@technijian.com)" -ForegroundColor Green
}
catch {
    Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
