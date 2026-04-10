"""Generate NotebookLM infographics for Nexus Assess and Nexus Pulse."""
import asyncio
import sys
from pathlib import Path
from notebooklm import NotebookLMClient

ASSESS_NB_ID = "2d1d1923-9253-42d6-9a58-1e8cca0087a3"

ASSESS_CONTENT = """# Technijian Nexus - Assess Module
## IT Risk & Compliance Platform

Technijian Nexus Assess is a comprehensive IT environment scanning, risk scoring, and compliance reporting platform.

### Key Capabilities

**Discovery & Scanning**
- Non-intrusive scans on Windows, macOS, and Linux
- Remote data collectors and lightweight discovery agents
- Automated scheduling with continuous 24/7 monitoring
- Real-time data analysis and risk prioritization
- SQL Server database security assessments

**Cloud & Microsoft 365**
- Microsoft 365, Teams, SharePoint, OneDrive, Exchange audits
- Azure AD and Active Directory security assessments
- AWS infrastructure evaluation and configuration review
- Cloud permission analysis and misconfiguration detection

**Risk Intelligence**
- Dual scoring: proprietary risk scores + CVSS + Microsoft Secure Score
- Severity-based prioritization with remediation guidance
- Dark web monitoring and credential exposure detection
- Vulnerability scanning with CVE correlation

**Reporting & Compliance**
- 100+ report types: executive infographics, risk management plans, technical details
- IT change comparison and end-user activity reports
- Compliance readiness: HIPAA, SOC 2, CJIS, PCI-DSS, HPH CPGs, NIST CSF, CIS Controls, GDPR
- Branded client-facing reports with your company logo

### How It Works
1. Deploy: Install lightweight agents or run agentless scans
2. Assess: Automated scans evaluate security posture, vulnerabilities, and compliance gaps
3. Report: Generate executive and technical reports with prioritized remediation

### Risk Reduction Metrics
- 85% faster assessments vs manual audits
- $4.45M average breach cost avoided
- 70% reduction in compliance audit prep time
- 100+ automated report types
"""

PULSE_CONTENT = """# Technijian Nexus - Assess > Pulse
## AI-Enhanced Penetration Testing Platform

Nexus Pulse is a cloud-based penetration testing and vulnerability assessment platform with 20+ integrated security tools.

### Key Capabilities

**Reconnaissance & Discovery**
- Subdomain finder with deep DNS enumeration
- TCP/UDP port scanning powered by Nmap engine
- URL fuzzer for hidden paths, directories, and endpoints
- Technology fingerprinting and service identification
- SSL/TLS certificate analysis and configuration audit

**Vulnerability Scanning**
- Website scanner with AI-enhanced authentication handling
- SQL injection, XSS, SSRF, and OWASP Top 10 detection
- CMS scanning: WordPress (WPScan), Drupal, Joomla
- Network vulnerability scanning via OpenVAS engine

**AI & Automation**
- ML Classifier: auto-categorize findings as HIT / MISS / PARTIAL / INCONCLUSIVE
- Pentest Robots: reusable automated testing sequences mimicking real adversary workflows
- AI fallback for complex dynamic login page authentication
- Smart noise filtering eliminates false positives automatically

**Exploitation & Proof**
- SQLMap automated exploitation for SQL injection proof-of-concept
- Sniper auto-exploiter for validated risk demonstration
- Safe, controlled exploitation with evidence capture for reports
- Screenshot and payload logging for stakeholder buy-in

### Efficiency Metrics
- 90% faster than manual pentesting (40 hrs to 4 hrs)
- 95% signal accuracy with ML classifier (vs noise)
- $15K saved by consolidating 5+ tools into one platform
- 20+ integrated security tools in a single cloud platform

### Integrations
AWS, Vanta, Nucleus Security, Jira, Microsoft Teams, webhooks
Export formats: PDF, HTML, CSV, XLSX with aggregated multi-scan reports
"""

OUTPUT_DIR = Path(r"c:\vscode\tech-branding\tech-branding\Services")

async def main():
    client = await NotebookLMClient.from_storage()
    async with client:
        # --- ASSESS ---
        print("=== Nexus Assess ===")
        print("Adding source content...")
        src = await client.sources.add_text(ASSESS_NB_ID, "Nexus Assess Product Overview", ASSESS_CONTENT, wait=True)
        print(f"  Source added: {src.id}")

        print("Generating infographic...")
        status = await client.artifacts.generate_infographic(
            ASSESS_NB_ID,
            instructions="Create a professional infographic for Technijian Nexus Assess IT Risk & Compliance Platform. Focus on: the 4 key capability areas (Discovery, Cloud/M365, Risk Intelligence, Reporting), the 3-step workflow (Deploy, Assess, Report), and the key metrics (85% faster, $4.45M saved, 70% less audit prep, 100+ reports). Use a clean corporate style.",
        )
        print(f"  Task ID: {status.task_id}, Status: {status.status}")

        print("Waiting for completion...")
        final = await client.artifacts.wait_for_completion(ASSESS_NB_ID, status.task_id, timeout=300)
        print(f"  Final status: {final.status}")

        out_path = str(OUTPUT_DIR / "Nexus Assess" / "Nexus Assess Infographic.png")
        dl = await client.artifacts.download_infographic(ASSESS_NB_ID, out_path)
        print(f"  Downloaded to: {dl}")

        # --- PULSE ---
        print("\n=== Nexus Pulse ===")
        print("Creating notebook...")
        pulse_nb = await client.notebooks.create("Technijian Nexus Pulse - Marketing")
        pulse_id = pulse_nb.id
        print(f"  Notebook ID: {pulse_id}")

        print("Adding source content...")
        src2 = await client.sources.add_text(pulse_id, "Nexus Pulse Product Overview", PULSE_CONTENT, wait=True)
        print(f"  Source added: {src2.id}")

        print("Generating infographic...")
        status2 = await client.artifacts.generate_infographic(
            pulse_id,
            instructions="Create a professional infographic for Technijian Nexus Pulse AI-Enhanced Penetration Testing Platform. Focus on: the 4 capability areas (Recon, Vuln Scanning, AI/Automation, Exploitation), the unique AI ML Classifier (HIT/MISS/PARTIAL/INCONCLUSIVE), Pentest Robots automation, and key metrics (20+ tools, 90% faster, 95% signal accuracy, $15K saved). Use a clean cybersecurity-themed style.",
        )
        print(f"  Task ID: {status2.task_id}, Status: {status2.status}")

        print("Waiting for completion...")
        final2 = await client.artifacts.wait_for_completion(pulse_id, status2.task_id, timeout=300)
        print(f"  Final status: {final2.status}")

        out_path2 = str(OUTPUT_DIR / "Nexus Pulse" / "Nexus Pulse Infographic.png")
        dl2 = await client.artifacts.download_infographic(pulse_id, out_path2)
        print(f"  Downloaded to: {dl2}")

        print("\n=== DONE ===")

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
asyncio.run(main())
