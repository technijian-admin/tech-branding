# Draft a threaded reply to Renee Gadberry (OETT) with the AI blueprint attached.
# App-only Graph. Secret read from the OneDrive keys vault at runtime (never hardcoded).
# Creates the draft only -- does NOT send.
import base64, pathlib, re, sys, requests

USER = "RJain@technijian.com"
TARGET = "rgadberry@oett.net"
KEYS = pathlib.Path(r"C:\Users\rjain\OneDrive - Technijian, Inc\Documents\VSCODE\keys\m365-graph.md")
SIG = pathlib.Path(r"c:\vscode\tech-branding\tech-branding\assets\email\signatures\ravi-jain\ravi-jain.html")
PDF = pathlib.Path(r"c:\vscode\tech-branding\tech-branding\Clients\OETT\Operating-Engineers-Training-Trust-AI-Blueprint.pdf")

def kv(label):
    m = re.search(r"\*\*" + re.escape(label) + r":\*\*\s*([^\r\n]+)", KEYS.read_text(encoding="utf-8"))
    return m.group(1).strip() if m else None

CID = kv("App Client ID"); TID = kv("Tenant ID"); SEC = kv("Client Secret")
assert CID and TID and SEC, "missing creds"

tok = requests.post(
    f"https://login.microsoftonline.com/{TID}/oauth2/v2.0/token",
    data={"client_id": CID, "client_secret": SEC,
          "scope": "https://graph.microsoft.com/.default", "grant_type": "client_credentials"},
    timeout=30).json()
assert "access_token" in tok, tok
H = {"Authorization": "Bearer " + tok["access_token"]}
print("auth OK")

# 1) find Renee's most recent message to Ravi
r = requests.get(
    f"https://graph.microsoft.com/v1.0/users/{USER}/messages",
    headers=H,
    params={"$search": f'"from:{TARGET}"', "$top": "10",
            "$select": "id,subject,from,receivedDateTime,conversationId"},
    timeout=30).json()
msgs = r.get("value", [])
if not msgs:
    # fallback: filter by sender address
    r = requests.get(
        f"https://graph.microsoft.com/v1.0/users/{USER}/messages",
        headers=H,
        params={"$filter": f"from/emailAddress/address eq '{TARGET}'",
                "$orderby": "receivedDateTime desc", "$top": "10",
                "$select": "id,subject,from,receivedDateTime,conversationId"},
        timeout=30).json()
    msgs = r.get("value", [])
if not msgs:
    print("NO MESSAGE FOUND from", TARGET, "->", r); sys.exit(1)
src = msgs[0]
print("found source msg:", src["subject"], "|", src["receivedDateTime"])

# 2) createReply -> draft
cr = requests.post(
    f"https://graph.microsoft.com/v1.0/users/{USER}/messages/{src['id']}/createReply",
    headers=H, timeout=30).json()
draft_id = cr["id"]
print("draft created:", draft_id)

# 3) compose body (ASCII source; HTML entity for the accent; no em-dashes)
sig = SIG.read_text(encoding="utf-8")
body = """<div style="font-family:'Open Sans','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#59595B;line-height:1.6;">
<p>Ren&eacute;e,</p>
<p>Thanks for the note, and fair enough, it sounds like you've got your IT covered, so I won't pitch you on that. I do want to put a different idea in front of you, though, one that sits a lot closer to your world as Curriculum Coordinator than to your IT Manager's.</p>
<p>The trades are heading into a real retirement wave. The industry needs hundreds of thousands of new workers over the next couple of years, and about 40% of today's construction workforce is projected to retire by 2031. For a training trust that's two problems at once: recruiting the next generation, and a quieter one, when a veteran master operator retires, decades of judgment that lives only in their head tends to walk out the door with them. Recruiting talent and capturing what your experts know are exactly where this generation of AI is genuinely useful, and neither one is your IT Manager's job.</p>
<p>So I put together a short blueprint, attached, on how AI could help OETT on both fronts: capturing a retiring operator's expertise into real curriculum, helping your coordinators build and update courses faster, giving apprentices modern study support before they're on a half-million-dollar machine, and reaching the next generation of apprentices where they actually look. It's built entirely from public information about OETT, it's honest about what we'd still need to learn from you, and the timing is good, the U.S. Department of Labor just started funding AI in registered apprenticeships this year.</p>
<p>It's a reading document, no obligation at all. If any of it is useful, I'd be glad to walk you and your team through it in about 20 minutes and share what we're seeing across other training organizations. You can grab a time with the Book a Meeting link below, or just reply and I'll work around your schedule.</p>
<p>Thank you,</p>
</div>
""" + sig

requests.patch(
    f"https://graph.microsoft.com/v1.0/users/{USER}/messages/{draft_id}",
    headers={**H, "Content-Type": "application/json"},
    json={"body": {"contentType": "HTML", "content": body}},
    timeout=30).raise_for_status()
print("body set")

# 4) attach the PDF (single-shot, <3MB)
data = base64.b64encode(PDF.read_bytes()).decode("ascii")
att = requests.post(
    f"https://graph.microsoft.com/v1.0/users/{USER}/messages/{draft_id}/attachments",
    headers={**H, "Content-Type": "application/json"},
    json={"@odata.type": "#microsoft.graph.fileAttachment",
          "name": "Operating-Engineers-Training-Trust-AI-Blueprint.pdf",
          "contentType": "application/pdf", "contentBytes": data},
    timeout=120)
att.raise_for_status()
print("attached PDF:", round(PDF.stat().st_size/1024,1), "KB")

# 5) fetch back for proofread
g = requests.get(
    f"https://graph.microsoft.com/v1.0/users/{USER}/messages/{draft_id}",
    headers=H,
    params={"$select": "subject,toRecipients,hasAttachments,isDraft,bodyPreview,webLink"},
    timeout=30).json()
print("--- DRAFT SUMMARY ---")
print("subject:", g.get("subject"))
print("to:", [t["emailAddress"]["address"] for t in g.get("toRecipients", [])])
print("isDraft:", g.get("isDraft"), "| hasAttachments:", g.get("hasAttachments"))
al = requests.get(
    f"https://graph.microsoft.com/v1.0/users/{USER}/messages/{draft_id}/attachments",
    headers=H, params={"$select": "name,size,contentType"}, timeout=30).json()
print("attachments:", [(a["name"], a.get("size")) for a in al.get("value", [])])
print("bodyPreview:", g.get("bodyPreview", "")[:400])
