# ================================================================
# Send three replies:
#   1) Create each as a DRAFT in Outlook (not sent)
#   2) Pull each draft body back from Graph (what Outlook actually renders)
#   3) Proofread each draft THREE TIMES for mojibake / placeholders / signature
#   4) Only if ALL passes clean, send. Otherwise abort and leave drafts.
#
# Thread 1: Shelja - ship samples to Irvine via India Post EMS + customs declaration
# Thread 2: Munesh (Sunstar) - vector logo attachments + spec confirmations
# Thread 3: Chandru (Tee Tops) - push back on blended Rs 475, ask for per-size breakdown
#
# Proofread rule (feedback memory): ASCII-only source; non-ASCII via HTML entities.
# Rupee: &#8377;  |  em-dash: &mdash;  |  right-single-quote: &rsquo;  |  times: &times;
# ================================================================

# --- Auth (env-var pattern; do NOT hardcode) ---
$secureSecret = ConvertTo-SecureString $env:AZURE_CLIENT_SECRET -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($env:AZURE_CLIENT_ID, $secureSecret)
Connect-MgGraph -TenantId $env:AZURE_TENANT_ID -ClientSecretCredential $credential -NoWelcome

$UserId = "RJain@technijian.com"
$sigPath = "C:\vscode\tech-branding\tech-branding\assets\email\signatures\ravi-jain\ravi-jain.html"
$signature = Get-Content -Path $sigPath -Raw

# Message IDs to reply to (captured from mailbox listing 2026-04-18)
$msgIdShelja  = "AAMkAGNlYjM0OTA4LThjMjYtNGQ3My1iNDg1LTQ2MTI5NTg0NzFlOQBGAAAAAAC88IffM67WS4tSyVwwqYmJBwBhk-ls8ubYRazD3tGgncxCAAAAAAENAACgx7VhNWW1QYCgfGa-8kbOAAXYFmoqAAA="
$msgIdMunesh  = "AAMkAGNlYjM0OTA4LThjMjYtNGQ3My1iNDg1LTQ2MTI5NTg0NzFlOQBGAAAAAAC88IffM67WS4tSyVwwqYmJBwBhk-ls8ubYRazD3tGgncxCAAAAAAENAACgx7VhNWW1QYCgfGa-8kbOAAXYFmotAAA="
$msgIdChandru = "AAMkAGNlYjM0OTA4LThjMjYtNGQ3My1iNDg1LTQ2MTI5NTg0NzFlOQBGAAAAAAC88IffM67WS4tSyVwwqYmJBwBhk-ls8ubYRazD3tGgncxCAAAAAAENAACgx7VhNWW1QYCgfGa-8kbOAAXYFmo0AAA="

# Logo attachments (for Munesh)
$svgPath = "C:\vscode\tech-branding\tech-branding\assets\logos\svg\technijian-logo-full-color.svg"
$aiPath  = "C:\vscode\tech-branding\tech-branding\assets\logos\print\technijian-logo-reverse-white.ai"
$pngPath = "C:\vscode\tech-branding\tech-branding\assets\logos\png\technijian-logo-full-color-2400x502.png"

# ================================================================
# BODY 1 -- to Shelja
# ================================================================
$body1 = @"
<html>
<body style="font-family:'Open Sans','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#1A1A2E;line-height:1.55;">

<p>Hi Shelja,</p>

<p>Two things &mdash; one short, one detailed.</p>

<h3 style="color:#006DB6;margin:18px 0 6px 0;font-size:15px;">1. Sunstar alternate WhatsApp</h3>

<p>Munesh replied last night (04/17 ~11:18 PM) with a working WhatsApp number since their office lines are out of service: <strong>+91 88665 00260</strong>. Please use that for payment coordination. He is also asking for the vector logo &mdash; I will send it to him directly on the Sunstar thread.</p>

<h3 style="color:#006DB6;margin:18px 0 6px 0;font-size:15px;">2. Ship ALL samples to me in Irvine &mdash; consolidated, lowest-cost, zero tariff</h3>

<p>Plan for when samples arrive at Panchkula:</p>

<ul>
  <li>Tee Tops (XL + XXL) and Sunstar (2XL) will arrive at different times &mdash; <strong>please wait until BOTH have arrived, then ship together in one parcel.</strong> One international parcel is roughly half the cost of two.</li>
  <li>Before shipping, photograph all three polos (front / back / close-up of the embroidered logo) and email the photos to me with a quick note on fit, fabric feel, and any visible issues. That way we have a record in case anything gets damaged in transit.</li>
</ul>

<p><strong>Carrier &mdash; use India Post EMS (Speed Post International).</strong> Cheapest option by a wide margin (~&#8377;2,500&ndash;3,500 for a ~1 kg parcel), 5&ndash;8 business days. If EMS is not available at our local post office for any reason, Aramex is the next-best (~&#8377;4,000&ndash;6,000). Please avoid DHL/FedEx for samples &mdash; they charge &#8377;8,000&ndash;12,000 which is not justified for three sample shirts.</p>

<p><strong>Customs declaration &mdash; these exact entries to get zero US import duty:</strong></p>

<table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;font-size:13px;color:#1A1A2E;margin:6px 0 12px 0;">
  <tr style="background:#F5F7FA;">
    <th align="left" style="border:1px solid #D6DDE4;padding:6px 10px;">Field</th>
    <th align="left" style="border:1px solid #D6DDE4;padding:6px 10px;">Exact value</th>
  </tr>
  <tr><td style="border:1px solid #D6DDE4;padding:6px 10px;">Description</td><td style="border:1px solid #D6DDE4;padding:6px 10px;">Commercial sample &mdash; men&rsquo;s cotton polo shirt, 3 pcs</td></tr>
  <tr><td style="border:1px solid #D6DDE4;padding:6px 10px;">Declared value</td><td style="border:1px solid #D6DDE4;padding:6px 10px;">USD 20 total (sample value, not for resale)</td></tr>
  <tr><td style="border:1px solid #D6DDE4;padding:6px 10px;">HS / Schedule B code</td><td style="border:1px solid #D6DDE4;padding:6px 10px;">6105.10.00</td></tr>
  <tr><td style="border:1px solid #D6DDE4;padding:6px 10px;">Purpose</td><td style="border:1px solid #D6DDE4;padding:6px 10px;">Sample for product approval, not for resale</td></tr>
  <tr><td style="border:1px solid #D6DDE4;padding:6px 10px;">Contents</td><td style="border:1px solid #D6DDE4;padding:6px 10px;">Men&rsquo;s knit polo shirts, 60/40 cotton-poly</td></tr>
</table>

<p>Why this works: US Customs has a &ldquo;Section 321 de minimis&rdquo; rule that lets any commercial shipment under USD 800 enter duty-free with minimal paperwork. At USD 20 declared value we are nowhere near the threshold, so zero tariff and no customs delay. <strong>Do NOT declare them as &ldquo;gift&rdquo;</strong> &mdash; they are samples, and the &ldquo;sample&rdquo; declaration is specifically what unlocks the duty-free treatment.</p>

<p><strong>Ship to:</strong></p>

<table cellpadding="2" cellspacing="0" border="0" style="font-size:13px;color:#1A1A2E;margin:6px 0 12px 12px;">
  <tr><td>Ravi Jain</td></tr>
  <tr><td>Technijian</td></tr>
  <tr><td>18 Technology Dr., Ste 141</td></tr>
  <tr><td>Irvine, CA 92618</td></tr>
  <tr><td>USA</td></tr>
  <tr><td>Phone: +1 714 402 3164</td></tr>
</table>

<p>Please keep the tracking numbers and email them to me once the parcel is picked up by India Post. I will confirm receipt when it arrives in Irvine so you can close the loop with accounting.</p>

<p>Chandru sent a revised quote this morning for USA sizing (&#8377;475/pc blended for the bulk 200). The &#8377;2,000 sample cost is unchanged; pro forma is coming later today &mdash; please transfer as soon as he shares UPI/bank.</p>

<p>Thanks for driving this end-to-end.</p>

<p>Ravi</p>

$signature

</body>
</html>
"@

# ================================================================
# BODY 2 -- to Munesh (Sunstar) -- reply-all to preserve team CC
# ================================================================
$body2 = @"
<html>
<body style="font-family:'Open Sans','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#1A1A2E;line-height:1.55;">

<p>Hi Munesh,</p>

<p>Attaching the vector files your team asked for:</p>

<ul>
  <li><strong>SVG</strong> (scalable vector, full-color) &mdash; primary source for embroidery digitization</li>
  <li><strong>AI</strong> (Adobe Illustrator, reverse-white version) &mdash; for reference</li>
  <li><strong>High-res PNG</strong> (2400&times;502) &mdash; fallback if the above do not open cleanly</li>
</ul>

<p>A few confirmations on the sample spec you shared with your team:</p>

<table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;font-size:13px;color:#1A1A2E;margin:6px 0 12px 0;">
  <tr style="background:#F5F7FA;">
    <th align="left" style="border:1px solid #D6DDE4;padding:6px 10px;">Item</th>
    <th align="left" style="border:1px solid #D6DDE4;padding:6px 10px;">Confirmed</th>
  </tr>
  <tr><td style="border:1px solid #D6DDE4;padding:6px 10px;">Fabric</td><td style="border:1px solid #D6DDE4;padding:6px 10px;">AC357 Blue Print, 230 GSM, Lot 744</td></tr>
  <tr><td style="border:1px solid #D6DDE4;padding:6px 10px;">Style</td><td style="border:1px solid #D6DDE4;padding:6px 10px;">Men&rsquo;s polo, no pocket, Standard AC Size</td></tr>
  <tr><td style="border:1px solid #D6DDE4;padding:6px 10px;">Size</td><td style="border:1px solid #D6DDE4;padding:6px 10px;">2XL (= USA XL, 46&ndash;48&quot; chest)</td></tr>
  <tr><td style="border:1px solid #D6DDE4;padding:6px 10px;">Embroidery</td><td style="border:1px solid #D6DDE4;padding:6px 10px;">Full-color Technijian logo on left chest, ~3 inches (7.6 cm) wide</td></tr>
</table>

<p>Looking forward to the mockup by Monday. Once Shelja signs off on it, please proceed with the sample.</p>

<p><strong>For the pro forma invoice:</strong> Shelja will share the billing GSTIN for the Technijian India entity directly. Ship-to address for the sample:</p>

<table cellpadding="2" cellspacing="0" border="0" style="font-size:13px;color:#1A1A2E;margin:6px 0 12px 12px;">
  <tr><td>Technijian</td></tr>
  <tr><td>Plot No. 07, 1st Floor, Panchkula IT Park</td></tr>
  <tr><td>Panchkula, Haryana 134109</td></tr>
  <tr><td>India</td></tr>
</table>

<p>Thanks,</p>

<p>Ravi</p>

$signature

</body>
</html>
"@

# ================================================================
# BODY 3 -- to Chandru (Tee Tops) -- push back on Rs 475 blend
# ================================================================
$body3 = @"
<html>
<body style="font-family:'Open Sans','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#1A1A2E;line-height:1.55;">

<p>Hi Chandru,</p>

<p>Thanks for the revised quote and for confirming the 10-day sample timeline. Looking forward to the pro forma later today.</p>

<p>Before we finalize the bulk pricing, I need a size-by-size breakdown rather than a blended average. Can you share:</p>

<ol>
  <li><strong>Base price</strong> for sizes at or below 46&quot; chest (our USA M 38&ndash;40 and L 42&ndash;44) &mdash; should this hold at &#8377;395/pc?</li>
  <li><strong>Upcharge</strong> for the two sizes above 46&quot; &mdash; USA XL (46&ndash;48&quot;) and USA XXL (50&ndash;52&quot;) &mdash; specified per size, not averaged</li>
  <li><strong>Threshold</strong> &mdash; at exactly what chest measurement does the upcharge kick in?</li>
  <li><strong>Ratio assumption</strong> in your blended &#8377;475 &mdash; was it our 1:2:2:1 mix (M=33, L=67, XL=67, XXL=33) or something else?</li>
</ol>

<p>Reason for the detail: with a transparent per-size price, I can compare apples-to-apples against the other shortlisted vendor and commit the bulk PO right after the samples clear inspection.</p>

<p>Sample order (XL + XXL, &#8377;2,000 total) proceeds as planned regardless &mdash; please send UPI/bank details and the pro forma so Shelja can transfer from the Panchkula entity.</p>

<p>Thanks,</p>

<p>Ravi</p>

$signature

</body>
</html>
"@

# ================================================================
# STEP 1 -- Create all three as DRAFTS (do not send yet)
# ================================================================

function New-ThreadedReplyDraft {
  param(
    [string]$Label,
    [string]$ReplyToMessageId,
    [string]$BodyHtml,
    [bool]$ReplyAll,
    [array]$AttachmentPaths = @()
  )

  Write-Host "[$Label] Creating reply draft..."
  $replyEndpoint = if ($ReplyAll) { 'createReplyAll' } else { 'createReply' }
  $draft = Invoke-MgGraphRequest `
    -Method POST `
    -Uri "https://graph.microsoft.com/v1.0/users/$UserId/messages/$ReplyToMessageId/$replyEndpoint" `
    -Body (@{} | ConvertTo-Json)

  $draftId = $draft.id

  $patch = @{
    body = @{
      contentType = 'HTML'
      content     = $BodyHtml
    }
  } | ConvertTo-Json -Depth 5

  Invoke-MgGraphRequest `
    -Method PATCH `
    -Uri "https://graph.microsoft.com/v1.0/users/$UserId/messages/$draftId" `
    -Body $patch `
    -ContentType 'application/json' | Out-Null

  foreach ($ap in $AttachmentPaths) {
    if (-not (Test-Path $ap)) { throw "Attachment not found: $ap" }
    $bytes = [System.IO.File]::ReadAllBytes($ap)
    $b64   = [System.Convert]::ToBase64String($bytes)
    $name  = [System.IO.Path]::GetFileName($ap)
    $mime  = switch -regex ($name) {
      '\.svg$' { 'image/svg+xml' ; break }
      '\.ai$'  { 'application/postscript' ; break }
      '\.png$' { 'image/png' ; break }
      default  { 'application/octet-stream' }
    }
    $att = @{
      '@odata.type' = '#microsoft.graph.fileAttachment'
      name          = $name
      contentType   = $mime
      contentBytes  = $b64
    } | ConvertTo-Json -Depth 5

    Invoke-MgGraphRequest `
      -Method POST `
      -Uri "https://graph.microsoft.com/v1.0/users/$UserId/messages/$draftId/attachments" `
      -Body $att `
      -ContentType 'application/json' | Out-Null
  }

  Write-Host "[$Label] Draft ready: $draftId"
  return $draftId
}

Write-Output "========== STEP 1: CREATE DRAFTS =========="
$draftIdShelja  = New-ThreadedReplyDraft -Label 'Shelja'  -ReplyToMessageId $msgIdShelja  -BodyHtml $body1 -ReplyAll $false
$draftIdMunesh  = New-ThreadedReplyDraft -Label 'Munesh'  -ReplyToMessageId $msgIdMunesh  -BodyHtml $body2 -ReplyAll $true -AttachmentPaths @($svgPath, $aiPath, $pngPath)
$draftIdChandru = New-ThreadedReplyDraft -Label 'Chandru' -ReplyToMessageId $msgIdChandru -BodyHtml $body3 -ReplyAll $false
Write-Output ""

# ================================================================
# STEP 2 -- Fetch each draft BACK from Graph (what Outlook will render)
# ================================================================
Write-Output "========== STEP 2: FETCH DRAFTS FROM SERVER =========="
Start-Sleep -Seconds 2

function Get-DraftContent {
  param([string]$Label, [string]$DraftId)
  $m = Get-MgUserMessage -UserId $UserId -MessageId $DraftId -Property "id,subject,toRecipients,ccRecipients,body,hasAttachments" -ExpandProperty 'attachments'
  $tos = ($m.ToRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
  $ccs = ($m.CcRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
  $atts = ($m.Attachments | ForEach-Object {$_.Name}) -join '; '
  [PSCustomObject]@{
    Label       = $Label
    Subject     = $m.Subject
    To          = $tos
    Cc          = $ccs
    Attachments = $atts
    HtmlBody    = $m.Body.Content
  }
}

$drafts = @(
  (Get-DraftContent -Label 'Shelja'  -DraftId $draftIdShelja),
  (Get-DraftContent -Label 'Munesh'  -DraftId $draftIdMunesh),
  (Get-DraftContent -Label 'Chandru' -DraftId $draftIdChandru)
)

foreach ($d in $drafts) {
  Write-Output "--- [$($d.Label)] ---"
  Write-Output "SUBJ: $($d.Subject)"
  Write-Output "TO:   $($d.To)"
  Write-Output "CC:   $($d.Cc)"
  Write-Output "ATT:  $($d.Attachments)"
  Write-Output ""
}

# ================================================================
# STEP 3 -- Proofread each draft body THREE TIMES, before sending
# ================================================================

function Test-DraftBody {
  param([string]$Label, [int]$Pass, [string]$Html)

  $issues = @()

  # Build mojibake detection strings from char codes (keeps source 7-bit ASCII,
  # avoids mojibake-in-mojibake file-encoding bug).
  # Pattern: UTF-8 bytes of a char, re-read as cp1252.
  $a_hat = [char]0x00E2  # 'a with circumflex'
  $euro  = [char]0x20AC  # euro
  $rdq   = [char]0x201D  # right double quote
  $ldq   = [char]0x0153  # oe ligature
  $tm    = [char]0x2122  # trademark
  $hat_a_tilde = [char]0x00C3  # capital A with tilde
  $emdash      = [char]0x2014  # em dash
  $slq9        = [char]0x201A  # single low-9 quote
  $sup1        = [char]0x00B9  # superscript one
  $nbsp_hat    = [char]0x00C2  # capital A with circumflex
  $nbsp        = [char]0x00A0  # nbsp
  $stilde      = [char]0x02DC  # small tilde

  $mojibake = @(
    ($a_hat.ToString() + $euro + $rdq),          # em-dash mojibake (a-hat, euro, right-dq)
    ($a_hat.ToString() + $euro + $ldq),          # left double quote mojibake
    ($a_hat.ToString() + $euro + $tm),           # right single quote mojibake
    ($a_hat.ToString() + $euro + $stilde),       # left single quote mojibake
    ($hat_a_tilde.ToString() + $emdash),         # times (x) mojibake
    ($a_hat.ToString() + $slq9 + $sup1),         # rupee mojibake
    ($nbsp_hat.ToString() + $nbsp)               # nbsp mojibake (A-hat + nbsp)
  )
  foreach ($m in $mojibake) {
    if ($m -and $Html.Contains($m)) { $issues += ("Mojibake detected (code pts: " + (($m.ToCharArray() | ForEach-Object { '{0:X4}' -f [int]$_ }) -join ' ') + ")") }
  }

  # Placeholders
  $placeholders = @('TODO','TBD','[Your Name]','XXX','PLACEHOLDER','{{','}}','[YOUR','YOUR_NAME','CLIENT_SECRET_HERE','APP_CLIENT_ID','TENANT_ID')
  foreach ($p in $placeholders) {
    if ($Html.Contains($p)) { $issues += "Placeholder: '$p'" }
  }

  # Structure + signature
  if ($Html -notmatch '(?i)Ravi Jain') { $issues += "Missing 'Ravi Jain' - signature broken" }
  if ($Html -notmatch '(?i)technijian') { $issues += "Missing 'Technijian' - signature broken" }
  if ($Html -notmatch '(?i)CEO') { $issues += "Missing 'CEO' - signature broken" }
  if ($Html -notmatch '(?i)949\.379\.8499') { $issues += "Missing main phone - signature broken" }

  # Double-spaces / stray whitespace in visible text (strip tags first)
  $txt = $Html -replace '<[^>]+>','' -replace '&[a-z]+;',' ' -replace '&#\d+;',' '
  if ($txt -match '  +') { $issues += "Double spaces in visible text" }
  if ($txt -match '\.\s*,') { $issues += "Period immediately followed by comma" }
  if ($txt -match ',\s*\.') { $issues += "Comma immediately followed by period" }

  if ($issues.Count -gt 0) {
    Write-Output "  [Pass $Pass][$Label] FAIL: $($issues -join '; ')"
    return $false
  }
  Write-Output "  [Pass $Pass][$Label] PASS"
  return $true
}

Write-Output "========== STEP 3: PROOFREAD DRAFTS (3 PASSES) =========="
$allPass = $true
for ($pass = 1; $pass -le 3; $pass++) {
  Write-Output ""
  Write-Output "-- Pass $pass --"
  foreach ($d in $drafts) {
    $ok = Test-DraftBody -Label $d.Label -Pass $pass -Html $d.HtmlBody
    if (-not $ok) { $allPass = $false }
  }
}

Write-Output ""
if (-not $allPass) {
  Write-Output "========== ABORT: PROOFREAD FAILED =========="
  Write-Output "Three drafts remain in Drafts folder for manual review:"
  Write-Output "  Shelja:  $draftIdShelja"
  Write-Output "  Munesh:  $draftIdMunesh"
  Write-Output "  Chandru: $draftIdChandru"
  Write-Output "Not sending."
  exit 1
}

# ================================================================
# STEP 4 -- All three passed 3x proofread. Send.
# ================================================================
Write-Output "========== STEP 4: ALL CLEAN. SENDING NOW =========="

function Send-DraftNow {
  param([string]$Label, [string]$DraftId)
  Write-Host "[$Label] Sending draft $DraftId..."
  Invoke-MgGraphRequest `
    -Method POST `
    -Uri "https://graph.microsoft.com/v1.0/users/$UserId/messages/$DraftId/send" | Out-Null
  Write-Host "[$Label] SENT."
}

Send-DraftNow -Label 'Shelja'  -DraftId $draftIdShelja
Send-DraftNow -Label 'Munesh'  -DraftId $draftIdMunesh
Send-DraftNow -Label 'Chandru' -DraftId $draftIdChandru

Write-Output ""
Write-Output "========== STEP 5: POST-SEND VERIFY =========="
Start-Sleep -Seconds 3
$sent = Get-MgUserMailFolderMessage -UserId $UserId -MailFolderId 'sentitems' -Top 5 -Property 'id,subject,toRecipients,ccRecipients,sentDateTime,body' -OrderBy 'sentDateTime desc'
foreach ($m in $sent | Select-Object -First 5) {
  $tos = ($m.ToRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
  $ccs = ($m.CcRecipients | ForEach-Object {$_.EmailAddress.Address}) -join '; '
  Write-Output "--- $($m.SentDateTime) ---"
  Write-Output "SUBJ: $($m.Subject)"
  Write-Output "TO:   $tos"
  Write-Output "CC:   $ccs"
  $a_hat2 = [char]0x00E2; $euro2 = [char]0x20AC; $rdq2 = [char]0x201D
  $ldq2 = [char]0x0153; $tm2 = [char]0x2122; $stilde2 = [char]0x02DC
  $hat_a_t2 = [char]0x00C3; $emdash2 = [char]0x2014
  $slq92 = [char]0x201A; $sup12 = [char]0x00B9
  $moj = @(
    ($a_hat2.ToString() + $euro2 + $rdq2),
    ($a_hat2.ToString() + $euro2 + $ldq2),
    ($a_hat2.ToString() + $euro2 + $tm2),
    ($a_hat2.ToString() + $euro2 + $stilde2),
    ($hat_a_t2.ToString() + $emdash2),
    ($a_hat2.ToString() + $slq92 + $sup12)
  )
  $hit = @()
  foreach ($p in $moj) { if ($m.Body.Content.Contains($p)) { $hit += ('U+' + (($p.ToCharArray() | ForEach-Object { '{0:X4}' -f [int]$_ }) -join '+U+')) } }
  if ($hit.Count -gt 0) {
    Write-Output "!! MOJIBAKE IN SENT: $($hit -join ', ')"
  } else {
    Write-Output "Clean"
  }
  Write-Output ""
}

Write-Output "DONE."
