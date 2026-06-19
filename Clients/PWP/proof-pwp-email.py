# Fetch the PWP goodwill draft back, save + render the body for proofreading. Read-only (no send).
import pathlib, re, sys, asyncio, requests
USER="RJain@technijian.com"; TARGET="carolanne@prosperitywealthplanning.com"
KEYS=pathlib.Path(r"C:\Users\rjain\OneDrive - Technijian, Inc\Documents\VSCODE\keys\m365-graph.md")
HERE=pathlib.Path(__file__).parent
def kv(l):
    m=re.search(r"\*\*"+re.escape(l)+r":\*\*\s*([^\r\n]+)",KEYS.read_text(encoding="utf-8")); return m.group(1).strip()
tok=requests.post(f"https://login.microsoftonline.com/{kv('Tenant ID')}/oauth2/v2.0/token",
    data={"client_id":kv("App Client ID"),"client_secret":kv("Client Secret"),
          "scope":"https://graph.microsoft.com/.default","grant_type":"client_credentials"},timeout=30).json()
H={"Authorization":"Bearer "+tok["access_token"]}
r=requests.get(f"https://graph.microsoft.com/v1.0/users/{USER}/mailFolders/drafts/messages",headers=H,
    params={"$top":"15","$orderby":"lastModifiedDateTime desc",
            "$select":"id,subject,toRecipients,hasAttachments,body,bodyPreview"},timeout=30).json()
draft=None
for m in r.get("value",[]):
    tos=[t["emailAddress"]["address"].lower() for t in m.get("toRecipients",[])]
    if TARGET in tos: draft=m; break
if not draft: print("NO DRAFT TO TARGET FOUND"); sys.exit(1)
print("subject:",draft["subject"]); print("to:",[t["emailAddress"]["address"] for t in draft["toRecipients"]])
print("hasAttachments:",draft["hasAttachments"])
# attachments
a=requests.get(f"https://graph.microsoft.com/v1.0/users/{USER}/messages/{draft['id']}/attachments",headers=H,
    params={"$select":"name,size,contentType"},timeout=30).json()
print("attachments:",[(x.get("name"),round(x.get("size",0)/1024,1)) for x in a.get("value",[])])
html=draft["body"]["content"]
(HERE/"email-preview.html").write_text(html,encoding="utf-8")
# mojibake scan on the visible text
import html as _h
text=_h.unescape(re.sub("<[^>]+>"," ",html))
bad=[p for p in ["Ã","Â","â€","�"," Â","a,,","A--"] if p in text]
print("MOJIBAKE MARKERS:", bad if bad else "none")
print("---- BODY TEXT (first 1200) ----")
print(re.sub(r"[ \t]+"," ",text).strip()[:1200])
async def shot():
    from playwright.async_api import async_playwright
    async with async_playwright() as pw:
        b=await pw.chromium.launch(); ctx=await b.new_context(device_scale_factor=2); pg=await ctx.new_page()
        await pg.set_content(html,wait_until="networkidle")
        await pg.wait_for_timeout(1500)
        await pg.screenshot(path=str(HERE/"email-preview.png"),full_page=True)
        await b.close()
    print("rendered -> email-preview.png")
asyncio.run(shot())
