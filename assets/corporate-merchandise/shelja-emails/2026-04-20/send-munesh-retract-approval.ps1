# Retract the "Approved" email sent at 2026-04-20 15:27 UTC and request
# two specific mockup changes before Sunstar proceeds with sample production.
#
# Thread: "Re: Sunstar polo shirts - sample order (2XL) + payment coordination"
# Reply to Munesh's mockup message from 04-20 10:55 AM (ID: ...AAXYFms4AAA=)
# Reply-all preserves team CC (sales@sunstar, Shelja, shipha@sunstar, sk@sunstar).
#
# Four-step pattern: create draft -> fetch back -> proofread 3x -> send if clean.
# ASCII-only source; non-ASCII via HTML entities.

$secureSecret = ConvertTo-SecureString $env:AZURE_CLIENT_SECRET -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($env:AZURE_CLIENT_ID, $secureSecret)
Connect-MgGraph -TenantId $env:AZURE_TENANT_ID -ClientSecretCredential $credential -NoWelcome

$UserId = "RJain@technijian.com"
$sigPath = "C:\vscode\tech-branding\tech-branding\assets\email\signatures\ravi-jain\ravi-jain.html"
$signature = Get-Content -Path $sigPath -Raw

# Munesh's mockup email (the one we reply to)
$msgIdMunesh = "AAMkAGNlYjM0OTA4LThjMjYtNGQ3My1iNDg1LTQ2MTI5NTg0NzFlOQBGAAAAAAC88IffM67WS4tSyVwwqYmJBwBhk-ls8ubYRazD3tGgncxCAAAAAAENAACgx7VhNWW1QYCgfGa-8kbOAAXYFms4AAA="

$body = @"
<html>
<body style="font-family:'Open Sans','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#1A1A2E;line-height:1.55;">

<p>Hi Munesh,</p>

<p>I need to walk back my short reply from earlier today &mdash; that &ldquo;Approved&rdquo; note was sent in error, before I had taken a proper look at the mockup. Apologies for the back-and-forth. <strong>Please treat the earlier approval as rescinded and do NOT start sample production yet.</strong></p>

<p>On a closer review, the fabric spec, Pantone 19-3939 &ldquo;Blueprint,&rdquo; logo placement, Bio Wash, and overall construction all look great. Two items need to be addressed before we green-light the sample:</p>

<h3 style="color:#006DB6;margin:18px 0 6px 0;font-size:15px;">1. Contrast stripes on collar edge + side slit</h3>

<p>The mockup shows red and teal accent stripes on the collar edge and at the side slit. Our existing corporate polos (the Lands&rsquo; End reference photos we attached to the earlier email) are plain navy with no contrast details. <strong>Our preference is plain navy with no contrast stripes</strong> &mdash; a clean corporate aesthetic matching the reference.</p>

<p>Can you confirm whether:</p>

<ul>
  <li>These stripes are a standard feature of the &ldquo;Standard AC Size&rdquo; polo style (i.e. integral to the pattern and cannot be removed), or</li>
  <li>They can be removed so the finished polo is plain navy with only the embroidered logo?</li>
</ul>

<h3 style="color:#006DB6;margin:18px 0 6px 0;font-size:15px;">2. Embroidery sizing</h3>

<p>The mockup specifies 8 cm &times; 1.5 cm. Our logo&rsquo;s natural aspect ratio is about 4.78:1 (source PNG is 2400 &times; 502), so at 8 cm wide the natural height is closer to <strong>1.67 cm</strong>. At 1.5 cm height, the small &ldquo;technology as a solution&rdquo; tagline below the wordmark risks losing legibility.</p>

<p>Please scale the embroidery to <strong>8 cm &times; 1.67 cm</strong> (preserves the natural proportions of the logo) and ensure the digitization test run still reads crisply on the strike-off before production.</p>

<h3 style="color:#006DB6;margin:18px 0 6px 0;font-size:15px;">Next steps</h3>

<p>Once the above two items are addressed, please share an updated mockup or a short confirmation note and then proceed with the 2XL (= USA XL) sample as planned. We&rsquo;re still looking forward to receiving it in Panchkula so Shelja can coordinate the pro forma and onward shipment.</p>

<p>Thanks, and sorry again for the mixed signal.</p>

<p>Ravi</p>

$signature

</body>
</html>
"@

# STEP 1: create reply-all draft
Write-Host "[Munesh] Creating reply-all draft..."
$draft = Invoke-MgGraphRequest -Method POST -Uri "https://graph.microsoft.com/v1.0/users/$UserId/messages/$msgIdMunesh/createReplyAll" -Body (@{} | ConvertTo-Json)
$draftId = $draft.id
Write-Host "[Munesh] Draft id: $draftId"

# Patch body
$patch = @{ body = @{ contentType = 'HTML'; content = $body } } | ConvertTo-Json -Depth 5
Invoke-MgGraphRequest -Method PATCH -Uri "https://graph.microsoft.com/v1.0/users/$UserId/messages/$draftId" -Body $patch -ContentType 'application/json' | Out-Null
Write-Host "[Munesh] Body patched."

# STEP 2: fetch back from server (what Outlook will render)
Start-Sleep -Seconds 2
$fetched = Get-MgUserMessage -UserId $UserId -MessageId $draftId -Property "id,subject,toRecipients,ccRecipients,body"
$tos = ($fetched.ToRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
$ccs = ($fetched.CcRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
Write-Host ""
Write-Host "=== Fetched draft ==="
Write-Host "SUBJ: $($fetched.Subject)"
Write-Host "TO:   $tos"
Write-Host "CC:   $ccs"
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
  # Retraction-specific required phrases
  if ($Html -notmatch '(?i)walk back|rescind|in error') { $issues += "Missing retraction language" }
  if ($Html -notmatch '(?i)do NOT start sample production|do not start sample production') { $issues += "Missing explicit 'do not start production' instruction" }
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
  $ok = Test-DraftBody -Label 'Munesh' -Pass $pass -Html $fetched.Body.Content
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
Write-Host "[Munesh] SENT."

Start-Sleep -Seconds 3
Write-Host ""
Write-Host "=== SENT ITEMS verify ==="
$sent = Get-MgUserMailFolderMessage -UserId $UserId -MailFolderId 'sentitems' -Top 3 -Property 'id,subject,toRecipients,ccRecipients,sentDateTime' -OrderBy 'sentDateTime desc'
foreach ($m in $sent | Select-Object -First 3) {
  $tt = ($m.ToRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
  $cc = ($m.CcRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
  Write-Host "$($m.SentDateTime) | TO: $tt | CC: $cc"
  Write-Host "  SUBJ: $($m.Subject)"
}
