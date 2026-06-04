# Compose Ravi -> Shane Beck (MBC Aquatic Sciences) outreach and SAVE to Outlook Drafts.
# Warm Vistage-peer note. Attaches the 5-page Executive Summary (NOT the full 33-page plan).
# NEVER calls .Send() - .Save() only. Strict 7-bit ASCII source; non-ASCII as HTML entities.

$ErrorActionPreference = 'Stop'
$base    = 'C:\vscode\tech-branding\tech-branding'
$sigPath = Join-Path $base 'assets\email\signatures\employees\Ravi Jain.html'
$pdfPath = Join-Path $base 'Clients\MBCA\MBC-AI-Growth-Summary.pdf'

if (-not (Test-Path $sigPath)) { throw "Signature not found: $sigPath" }
if (-not (Test-Path $pdfPath)) { throw "Summary PDF not found: $pdfPath" }

$sig = Get-Content -Raw -Encoding UTF8 $sigPath

$body = @'
<div style="font-family:'Open Sans','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#1A1A2E;line-height:1.6;">
<p>Shane,</p>
<p>I've been thinking about our Vistage conversations and where MBC is headed, and I put together a short strategy on how AI could help the firm grow and run leaner &mdash; the same way we're building it into Technijian and into the work we do for our clients. I've attached it as a five-page executive summary.</p>
<p>The thread that runs through it is the thing that makes MBC what it is: fifty-seven years of marine and environmental science, much of it living in the judgment of your most senior people. That's the moat &mdash; and as the bench gets more tenured, it's also the quiet risk. The first and highest-value move isn't marketing; it's capturing that institutional memory while Chuck and the senior team are here to inform it, and turning it into a queryable brain that also makes proposals faster and helps onboard the next generation. The same engine helps MBC get cited first when an agency project manager &mdash; or an AI search engine &mdash; asks who does eelgrass, 316(b), or toxicity work in Southern California.</p>
<p>The entry is small on purpose, about $32K for the first year, and it pays for itself on faster proposals and AI-search visibility alone, with no large build to begin. The memory brain and the proposal engine come later, once the entry proves the lift. And the line we hold throughout is the one that matters most to a science-first firm: AI drafts, indexes, and remembers, but your scientists still own and sign every determination. The full plan goes deeper &mdash; it maps the eight buyer segments from your own client list, the institutional-memory build, and the roadmap &mdash; and it's ready whenever you want it.</p>
<p>I'd love 30 minutes to walk you through it. Use book a meeting in my signature line to set up a time to discuss this and all the AI strategies Technijian is putting into place for itself and its clients.</p>
<p>Thank you,</p>
</div>
'@

$html = $body + $sig

$ol   = New-Object -ComObject Outlook.Application
$mail = $ol.CreateItem(0)   # 0 = olMailItem
$mail.Subject  = 'AI Growth & Integration Strategy for MBC Aquatic Sciences'
# To: intentionally left BLANK - Ravi adds Shane Beck's address (warm Vistage contact) before sending.
$mail.HTMLBody = $html
$null = $mail.Attachments.Add($pdfPath)
$mail.Save()    # -> Drafts. NEVER .Send().

Write-Host "Draft saved to Outlook Drafts."
Write-Host ("  Subject: " + $mail.Subject)
Write-Host ("  Attachment: " + (Split-Path $pdfPath -Leaf))
Write-Host "  To: (BLANK - add Shane Beck's email before sending)"

# Read back from Drafts to confirm
$ns = $ol.GetNamespace('MAPI')
$drafts = $ns.GetDefaultFolder(16)   # 16 = olFolderDrafts
$match = $drafts.Items | Where-Object { $_.Subject -eq $mail.Subject } | Select-Object -First 1
if ($match) {
  Write-Host ("CONFIRMED in Drafts: '" + $match.Subject + "' | attachments=" + $match.Attachments.Count + " | bodychars=" + $match.HTMLBody.Length)
} else {
  Write-Host "WARNING: could not find the draft on read-back."
}
