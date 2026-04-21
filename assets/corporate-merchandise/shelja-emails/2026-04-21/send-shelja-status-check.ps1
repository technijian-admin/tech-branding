# Status check to Shelja on sample payments.
# Replies to her 04-18 8:10 AM inbound message to keep the thread intact.
# Four-step pattern: create draft -> fetch back -> proofread 3x -> send if clean.
# ASCII-only source; non-ASCII via HTML entities.

$secureSecret = ConvertTo-SecureString $env:AZURE_CLIENT_SECRET -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($env:AZURE_CLIENT_ID, $secureSecret)
Connect-MgGraph -TenantId $env:AZURE_TENANT_ID -ClientSecretCredential $credential -NoWelcome

$UserId = "RJain@technijian.com"
$sigPath = "C:\vscode\tech-branding\tech-branding\assets\email\signatures\ravi-jain\ravi-jain.html"
$signature = Get-Content -Path $sigPath -Raw

# Shelja's 2026-04-18 8:10 AM inbound (last message from her on this thread)
$msgIdShelja = "AAMkAGNlYjM0OTA4LThjMjYtNGQ3My1iNDg1LTQ2MTI5NTg0NzFlOQBGAAAAAAC88IffM67WS4tSyVwwqYmJBwBhk-ls8ubYRazD3tGgncxCAAAAAAENAACgx7VhNWW1QYCgfGa-8kbOAAXYFmoqAAA="

$body = @"
<html>
<body style="font-family:'Open Sans','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#1A1A2E;line-height:1.55;">

<p>Hi Shelja,</p>

<p>Quick status check on the two sample payments. It&rsquo;s been a few days and I want to make sure nothing is stuck on your side.</p>

<h3 style="color:#006DB6;margin:18px 0 6px 0;font-size:15px;">Three questions</h3>

<ol>
  <li><strong>Tee Tops / Chandru</strong> (+91 80564 64646) &mdash; did he ever call you back as he promised on 04/18? Have you been able to reach him on your own attempt?</li>
  <li><strong>Sunstar / Munesh</strong> &mdash; were you able to reach him on the alternate WhatsApp I sent on 04/18 (<strong>+91 88665 00260</strong>) since the office landlines were out of service?</li>
  <li><strong>Payments transferred?</strong> Has either of the two sample amounts moved yet &mdash; &#8377;2,000 for Tee Tops (XL + XXL) or &#8377;1,000 for Sunstar (2XL)?</li>
</ol>

<h3 style="color:#006DB6;margin:18px 0 6px 0;font-size:15px;">Context from my side (so you know what to expect from the vendors)</h3>

<ul>
  <li><strong>Chandru:</strong> he said &ldquo;pro forma later today&rdquo; back on 04/18 but nothing has hit my inbox since. His thread is effectively stalled &mdash; I&rsquo;ll nudge him separately this week. Until he sends the pro forma and UPI/bank details, there is nothing for you to transfer on the Tee Tops side.</li>
  <li><strong>Munesh:</strong> he sent a polo mockup yesterday morning, but I had to ask for two changes before they start sample production &mdash; remove the contrast stripes from the collar and side slit (we want plain navy), and scale the embroidery to preserve the natural logo proportions. Their pro forma will follow once the updated mockup is approved, so we&rsquo;re on a short hold there too.</li>
</ul>

<p>Net-net: if you haven&rsquo;t transferred anything yet, that is expected &mdash; the vendors still owe us the pro formas. But if either of them has reached out to you directly with UPI or bank details outside the email thread, please loop me in so I have a clean record.</p>

<p>Thanks for staying on top of this.</p>

<p>Ravi</p>

$signature

</body>
</html>
"@

# STEP 1: create reply draft
Write-Host "[Shelja] Creating reply draft..."
$draft = Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/v1.0/users/$UserId/messages/$msgIdShelja/createReply" -Body (@{} | ConvertTo-Json)
$draftId = $draft.id
Write-Host "[Shelja] Draft id: $draftId"

$patch = @{ body = @{ contentType = 'HTML'; content = $body } } | ConvertTo-Json -Depth 5
Invoke-MgGraphRequest -Method PATCH -Uri "https://graph.microsoft.com/v1.0/users/$UserId/messages/$draftId" -Body $patch -ContentType 'application/json' | Out-Null
Write-Host "[Shelja] Body patched."

# STEP 2: fetch back
Start-Sleep -Seconds 2
$fetched = Get-MgUserMessage -UserId $UserId -MessageId $draftId -Property "id,subject,toRecipients,ccRecipients,body"
$tos = ($fetched.ToRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
$ccs = ($fetched.CcRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
Write-Host ""
Write-Host "=== Fetched draft ==="
Write-Host "SUBJ: $($fetched.Subject)"
Write-Host "TO:   $tos"
if ($ccs) { Write-Host "CC:   $ccs" }
Write-Host "BODY LEN: $($fetched.Body.Content.Length)"

# STEP 3: proofread 3x
function Test-DraftBody {
  param([string]$Label, [int]$Pass, [string]$Html)
  $issues = @()
  $a_hat = [char]0x00E2; $euro = [char]0x20AC; $rdq = [char]0x201D
  $ldq = [char]0x0153; $tm = [char]0x2122; $stilde = [char]0x02DC
  $hat_a_tilde = [char]0x00C3; $emdash = [char]0x2014
  $slq9 = [char]0x201A; $sup1 = [char]0x00B9
  $nbsp_hat = [char]0x00C2; $nbsp = [char]0x00A0
  $mojibake = @(
    ($a_hat.ToString() + $euro + $rdq),
    ($a_hat.ToString() + $euro + $ldq),
    ($a_hat.ToString() + $euro + $tm),
    ($a_hat.ToString() + $euro + $stilde),
    ($hat_a_tilde.ToString() + $emdash),
    ($a_hat.ToString() + $slq9 + $sup1),
    ($nbsp_hat.ToString() + $nbsp)
  )
  foreach ($mo in $mojibake) {
    if ($mo -and $Html.Contains($mo)) { $issues += ("Mojibake @ " + (($mo.ToCharArray() | ForEach-Object { '{0:X4}' -f [int]$_ }) -join ',')) }
  }
  $placeholders = @('TODO','TBD','[Your Name]','XXX','PLACEHOLDER','{{','}}','CLIENT_SECRET_HERE','APP_CLIENT_ID','TENANT_ID')
  foreach ($p in $placeholders) { if ($Html.Contains($p)) { $issues += "Placeholder: '$p'" } }
  if ($Html -notmatch '(?i)Ravi Jain') { $issues += "Missing 'Ravi Jain'" }
  if ($Html -notmatch '(?i)technijian') { $issues += "Missing 'Technijian'" }
  if ($Html -notmatch '(?i)CEO') { $issues += "Missing 'CEO' in signature" }
  if ($Html -notmatch '949\.379\.8499') { $issues += "Missing main phone" }
  if ($Html -notmatch '88665 00260') { $issues += "Missing alt Sunstar WhatsApp number" }
  if ($Html -notmatch '80564 64646') { $issues += "Missing Chandru phone number" }
  if ($issues.Count -gt 0) {
    Write-Host ("  [Pass " + $Pass + "][" + $Label + "] FAIL: " + ($issues -join '; '))
    return $false
  }
  Write-Host ("  [Pass " + $Pass + "][" + $Label + "] PASS")
  return $true
}

Write-Host ""
Write-Host "=== PROOFREAD 3x ==="
$allPass = $true
for ($pass = 1; $pass -le 3; $pass++) {
  Write-Host ""
  Write-Host "-- Pass $pass --"
  $ok = Test-DraftBody -Label 'Shelja' -Pass $pass -Html $fetched.Body.Content
  if (-not $ok) { $allPass = $false }
}

Write-Host ""
if (-not $allPass) {
  Write-Host "ABORT: proofread failed. Draft remains in Drafts folder."
  Write-Host "  Id: $draftId"
  exit 1
}

# STEP 4: send
Write-Host "All clean. Sending..."
Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/v1.0/users/$UserId/messages/$draftId/send" | Out-Null
Write-Host "[Shelja] SENT."

Start-Sleep -Seconds 3
Write-Host ""
Write-Host "=== SENT ITEMS verify ==="
$sent = Get-MgUserMailFolderMessage -UserId $UserId -MailFolderId 'sentitems' -Top 2 -Property 'id,subject,toRecipients,sentDateTime' -OrderBy 'sentDateTime desc'
foreach ($m in $sent | Select-Object -First 2) {
  $tt = ($m.ToRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
  Write-Host "$($m.SentDateTime) | TO: $tt"
  Write-Host "  SUBJ: $($m.Subject)"
}
