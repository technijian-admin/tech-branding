# Draft a removal-confirmation + goodwill reply to Franklin's unsubscribe, blueprint attached.
# Honors the opt-out (confirms removal), NO sales CTA. App-only Graph; secret from vault at runtime.
# Creates the draft only -- does NOT send.
import base64, pathlib, re, sys, requests
USER = "RJain@technijian.com"
TARGET = "franklinservices@franklined.com"
KEYS = pathlib.Path(r"C:\Users\rjain\OneDrive - Technijian, Inc\Documents\VSCODE\keys\m365-graph.md")
SIG = pathlib.Path(r"c:\vscode\tech-branding\tech-branding\assets\email\signatures\ravi-jain\ravi-jain.html")
PDF = pathlib.Path(r"c:\vscode\tech-branding\tech-branding\Clients\FES\Franklin-Educational-Services-AI-Blueprint.pdf")

def kv(l):
    m = re.search(r"\*\*"+re.escape(l)+r":\*\*\s*([^\r\n]+)", KEYS.read_text(encoding="utf-8")); return m.group(1).strip()
tok = requests.post(f"https://login.microsoftonline.com/{kv('Tenant ID')}/oauth2/v2.0/token",
    data={"client_id":kv("App Client ID"),"client_secret":kv("Client Secret"),
          "scope":"https://graph.microsoft.com/.default","grant_type":"client_credentials"},timeout=30).json()
H={"Authorization":"Bearer "+tok["access_token"]}
print("auth OK")

# find the unsubscribe message from Franklin
r=requests.get(f"https://graph.microsoft.com/v1.0/users/{USER}/messages",headers=H,
    params={"$search":f'"from:{TARGET}"',"$top":"5","$select":"id,subject,from,receivedDateTime"},timeout=30).json()
msgs=r.get("value",[])
if not msgs: print("NO MESSAGE FOUND",r); sys.exit(1)
src=msgs[0]
print("source:",src["subject"],"|",src["receivedDateTime"])

cr=requests.post(f"https://graph.microsoft.com/v1.0/users/{USER}/messages/{src['id']}/createReply",headers=H,timeout=30).json()
draft_id=cr["id"]; print("draft:",draft_id)

sig=SIG.read_text(encoding="utf-8")
body="""<div style="font-family:'Open Sans','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;color:#59595B;line-height:1.6;">
<p>Franklin team,</p>
<p>Done - I've removed this address from our outreach list, so you won't hear from us again. Apologies for the interruption.</p>
<p>Before I go, there's one thing I'd rather simply leave with you. After reading about Franklin Educational Services, I put together a short, no-strings analysis of how AI could help a practice like yours - mainly by giving your educators their time back from documentation, and helping more of the right families find Dr. Franklin's work - all while keeping children's information private and a person in the loop on anything a family sees. It's attached, yours to keep, with no expectation of anything in return.</p>
<p>If it's useful, wonderful. If not, no worries at all - and thank you for the work you do for kids who learn differently.</p>
<p>Thank you,</p>
</div>
"""+sig
requests.patch(f"https://graph.microsoft.com/v1.0/users/{USER}/messages/{draft_id}",
    headers={**H,"Content-Type":"application/json"},
    json={"body":{"contentType":"HTML","content":body}},timeout=30).raise_for_status()
print("body set")

data=base64.b64encode(PDF.read_bytes()).decode("ascii")
requests.post(f"https://graph.microsoft.com/v1.0/users/{USER}/messages/{draft_id}/attachments",
    headers={**H,"Content-Type":"application/json"},
    json={"@odata.type":"#microsoft.graph.fileAttachment",
          "name":"Franklin-Educational-Services-AI-Blueprint.pdf",
          "contentType":"application/pdf","contentBytes":data},timeout=120).raise_for_status()
print("attached:",round(PDF.stat().st_size/1024,1),"KB")

g=requests.get(f"https://graph.microsoft.com/v1.0/users/{USER}/messages/{draft_id}",headers=H,
    params={"$select":"subject,toRecipients,isDraft,hasAttachments,bodyPreview"},timeout=30).json()
print("--- DRAFT ---")
print("subject:",g.get("subject"))
print("to:",[t["emailAddress"]["address"] for t in g.get("toRecipients",[])])
print("isDraft:",g.get("isDraft"),"| hasAttachments:",g.get("hasAttachments"))
print("preview:",g.get("bodyPreview","")[:300])
