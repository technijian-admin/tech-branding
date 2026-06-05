"""
Build OXPLive MCP Server — Client Approval Report (DOCX + PDF).
Run: py -3.12 build-approval-report.py
Output:
  OXP-Live-MCP-Server-Approval-Report.pdf
  OXP-Live-MCP-Server-Approval-Report.docx
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT_DIR  = Path(__file__).parent
OUT_PDF  = OUT_DIR / "OXP-Live-MCP-Server-Approval-Report.pdf"
OUT_HTML = OUT_DIR / "_approval-report.html"

LOGO_PATH = Path(r"C:\VSCode\tech-branding\tech-branding\assets\logos\Technijian Logo - white text.png")

B = {
    "blue":   "#006DB6",
    "orange": "#F67D4B",
    "teal":   "#1EAAC8",
    "dark":   "#1A2B3C",
    "light":  "#F5F7FA",
    "border": "#D0D7E2",
    "text":   "#2D3748",
    "muted":  "#718096",
    "white":  "#FFFFFF",
}

# ─── Detailed STP list (all 116, from STP-API-MCP-MATRIX.md) ────────────────
# Fields: (domain_num, sp_ref, sp_name, rw, method, endpoint, client_description)
# rw: "READ" | "WRITE" | "INT" (internal, not exposed)

STPS = [
    # ── Domain 1 — Auth & Session ───────────────────────────────────────────
    (1,"1.1","usp_Auth_EnsureUser",      "INT","","",           "INTERNAL — confirms/creates the Azure AD user on first login; called by API middleware only"),
    (1,"1.2","usp_Auth_GetCurrentUser",  "READ","GET","/api/me","Returns the logged-in user's name, email, roles, division, and territory to populate the app shell"),
    (1,"1.3","usp_Auth_GetIdpConfig",    "INT","","",           "INTERNAL — returns MSAL configuration for the SPA; agents use client_credentials instead"),
    (1,"1.4","usp_Auth_LogSessionHistory","INT","","",          "INTERNAL — records every page navigation for the Admin activity log; called by request pipeline"),
    (1,"1.5","usp_Auth_RefreshToken",    "INT","","",           "INTERNAL — silently rotates access/refresh token pair when the SPA token expires; MSAL-managed"),
    # ── Domain 2 — Patient / Account ────────────────────────────────────────
    (2,"2.1","usp_Patient_Search",       "READ","GET","/api/patients/search",                    "Find patients by name, account number, DOB, SSN-last-4, or phone — powers the global search bar"),
    (2,"2.2","usp_Patient_GetDetail",    "READ","GET","/api/patients/{jobId}",                   "Pull the complete patient record: demographics, insurance, medical info, referring doctor, current status, assigned reps"),
    (2,"2.3","usp_Patient_Create",       "WRITE","POST","/api/patients",                         "Create a new patient account with demographics, insurance, and medical intake data in a single transaction"),
    (2,"2.4","usp_Patient_Update",       "WRITE","PUT","/api/patients/{jobId}",                  "Save edits to an existing patient record; changes are audited before/after"),
    (2,"2.5","usp_Patient_GetSnapshot",  "READ","GET","/api/patients/{jobId}/snapshot",          "Retrieve a complete printable snapshot: all products, billing codes, insurance, clinical notes in one call"),
    (2,"2.6","usp_Patient_GetCoverage",  "READ","GET","/api/patients/{jobId}/coverage",          "Get payer name, policy number, group number, coverage type, and current auth numbers"),
    (2,"2.7","usp_Patient_UpdateCoverage","WRITE","PUT","/api/patients/{jobId}/coverage",        "Update primary or secondary insurance coverage without touching demographics"),
    (2,"2.8","usp_Patient_GetOrigRep",   "READ","GET","/api/patients/{jobId}/orig-rep",          "Get the original rep assigned at intake — used to preserve commission origination credit"),
    (2,"2.9","usp_Patient_SetOrigRep",   "WRITE","PUT","/api/patients/{jobId}/orig-rep",         "Set or update the originating rep when first assigned during intake"),
    (2,"2.10","usp_Patient_ListProducts","READ","GET","/api/patients/{jobId}/products",          "List all product/equipment line items on the account with HCPCS codes, billing status, and auth notes"),
    (2,"2.11","usp_Patient_AddProduct",  "WRITE","POST","/api/patients/{jobId}/products",        "Add a new product line item to the account; validates HCPCS code mapping"),
    (2,"2.12","usp_Patient_UpdateProduct","WRITE","PUT","/api/patients/{jobId}/products/{id}",   "Update quantity or notes on a product line item"),
    (2,"2.13","usp_Patient_RemoveProduct","WRITE","DELETE","/api/patients/{jobId}/products/{id}","Remove a product line item; blocked if a claim has already been submitted for it"),
    (2,"2.14","usp_Patient_ListNotes",   "READ","GET","/api/patients/{jobId}/notes",             "Read all free-text notes on the account in chronological order"),
    (2,"2.15","usp_Patient_AddNote",     "WRITE","POST","/api/patients/{jobId}/notes",           "Append a note to the account; notes are immutable once created"),
    (2,"2.16","usp_Patient_GetAgreement","READ","GET","/api/patients/{jobId}/agreement",         "Check whether the patient has accepted the service agreement and on what date"),
    (2,"2.17","usp_Medical_UpdateDiagnosis","WRITE","PUT","/api/patients/{jobId}/medical/diagnosis","Update ICD-10 diagnosis codes, referring doctor, body part, and procedure code"),
    (2,"2.18","usp_Patient_Cancel",      "WRITE","POST","/api/patients/{jobId}/cancel",          "Cancel the account with a required reason code and notes; writes a final status history entry"),
    # ── Domain 3 — Insurance Authorization ───────────────────────────────────
    (3,"3.1","usp_Auth_ListByPatient",   "READ","GET","/api/patients/{jobId}/authorizations",    "List all insurance authorizations on the account: auth numbers, dates, payer, status, and linked products"),
    (3,"3.2","usp_Auth_Create",          "WRITE","POST","/api/patients/{jobId}/authorizations",  "Create a new insurance authorization record with auth number, dates, payer, and notes"),
    (3,"3.3","usp_Auth_Update",          "WRITE","PUT","/api/authorizations/{authId}",           "Update an existing authorization — correct dates, extend, or change status"),
    (3,"3.4","usp_Auth_AddItem",         "WRITE","POST","/api/authorizations/{authId}/items",    "Link a product line item to an authorization; required for billing to confirm each line is covered"),
    (3,"3.5","usp_Auth_RemoveItem",      "WRITE","DELETE","/api/authorizations/{authId}/items/{id}","Remove a product from an authorization; blocked if the claim has been submitted"),
    # ── Domain 4 — Queue & Workflow ──────────────────────────────────────────
    (4,"4.1","usp_Queue_List",           "READ","GET","/api/queues",                             "List all 13 workflow queues visible to the current user with current job counts"),
    (4,"4.2","usp_Queue_GetJobs",        "READ","GET","/api/queues/{queueId}/jobs",              "Get all patient accounts currently in a specific queue — paged, with name, status age, and rep"),
    (4,"4.3","usp_Queue_TransitionJob",  "WRITE","POST","/api/queues/transition",                "Move a patient account from one queue to another; validates the transition is permitted, writes status history"),
    (4,"4.4","usp_Queue_GetStatusHistory","READ","GET","/api/patients/{jobId}/status-history",   "Get the complete queue-transition history for an account — every move ever made with user and timestamp"),
    (4,"4.5","usp_Queue_GetActions",     "READ","GET","/api/queues/{queueId}/actions",           "List the permitted moves out of a queue — used to render the correct action buttons"),
    (4,"4.6","usp_Queue_GetBillingStatus","READ","GET","/api/patients/{jobId}/billing-status",   "Get the billing status badge for an account: Unbilled / Partially Billed / Fully Billed / Cash"),
    (4,"4.7","usp_Queue_GetCounts",      "READ","GET","/api/queues/counts",                      "Get the count of accounts in each of the 13 queues in one call — powers the sidebar badges and dashboard"),
    # ── Domain 5 — Billing & Claims ──────────────────────────────────────────
    (5,"5.1","usp_Billing_ListEntities", "READ","GET","/api/billing/entities",                   "List all billing entities (insurance companies, payers) — used in billing forms and patient intake"),
    (5,"5.2","usp_Billing_Search",       "READ","GET","/api/billing/search",                     "Search billable records by account number, payer, or status — returns line items with charge and collection data"),
    (5,"5.3","usp_Billing_GetFeeSchedules","READ","GET","/api/billing/fee-schedules",            "Get contracted fee schedule amounts for a HCPCS code and billing entity — used to calculate expected reimbursement"),
    (5,"5.4","usp_Billing_GetProductValuation","READ","GET","/api/billing/valuations/{productId}","Get pricing and rental term options (capped rental, rent-to-own, purchase) for a product"),
    (5,"5.5","usp_Billing_GetReBillData","READ","GET","/api/patients/{jobId}/rebill",            "Get previously billed line items flagged for re-billing due to denial, partial payment, or correction"),
    # ── Domain 6 — Scheduling ────────────────────────────────────────────────
    (6,"6.1","usp_Schedule_GetByRange",  "READ","GET","/api/schedules",                          "List scheduled appointments filtered by date range, territory, or rep — powers the calendar view"),
    (6,"6.2","usp_Schedule_Create",      "WRITE","POST","/api/schedules",                        "Create a new appointment for a patient — type, date/time, assigned rep, and notes"),
    (6,"6.3","usp_Schedule_Update",      "WRITE","PUT","/api/schedules/{scheduleId}",            "Reschedule an appointment or update its type or notes"),
    (6,"6.4","usp_Schedule_Delete",      "WRITE","DELETE","/api/schedules/{scheduleId}",         "Cancel and remove a scheduled appointment; also removes the Exchange calendar sync record"),
    (6,"6.5","usp_Schedule_GetUnscheduled","READ","GET","/api/schedules/unscheduled",            "Find accounts in the scheduling queue with no upcoming appointment — lets dispatchers fill the calendar"),
    (6,"6.6","usp_Schedule_GetTypes",    "READ","GET","/api/lookups/schedule-types",             "Get appointment type dropdown (delivery, follow-up, fitting, re-evaluation, etc.)"),
    (6,"6.7","usp_Schedule_GetExchangeSync","READ","GET","/api/schedules/{scheduleId}/exchange-sync","Get the Outlook calendar sync status for an appointment — shows whether it has been pushed to Exchange"),
    (6,"6.8","usp_Schedule_SetExchangeSync","WRITE","PUT","/api/schedules/{scheduleId}/exchange-sync","Link an appointment to an Outlook calendar event after it has been pushed to Exchange"),
    (6,"6.9","usp_Schedule_DeleteExchangeSync","WRITE","DELETE","/api/schedules/{scheduleId}/exchange-sync","Remove the Exchange calendar link when an appointment is cancelled or the sync breaks"),
    (6,"6.10","usp_Scheduler_Get48HourAlerts","READ","GET","/api/schedules/alerts",              "Get all deliveries and follow-ups due within the next 48 hours for the user's territory — same-day alert panel"),
    # ── Domain 7 — Patient Experience (PSR) ─────────────────────────────────
    (7,"7.1","usp_PatientExperience_List","READ","GET","/api/patients/{jobId}/experiences",      "List all patient contacts on the account — calls, inquiries, complaints — in chronological order"),
    (7,"7.2","usp_PatientExperience_Create","WRITE","POST","/api/patients/{jobId}/experiences",  "Log a patient contact: call attempt, inquiry, complaint, or scheduling contact with outcome"),
    (7,"7.3","usp_PatientExperience_Update","WRITE","PUT","/api/patient-experiences/{peId}",     "Update the status, follow-up date, or notes on a patient contact record (close out or escalate)"),
    (7,"7.4","usp_PatientExperience_GetTypes","READ","GET","/api/lookups/patient-experience-types","Get contact type dropdown (inquiry, scheduling, complaint, satisfaction, etc.)"),
    (7,"7.5","usp_PatientExperience_GetStatuses","READ","GET","/api/lookups/patient-experience-statuses","Get contact status dropdown (open, resolved, escalated, etc.)"),
    (7,"7.6","usp_PatientExperience_GetComplaintTypes","READ","GET","/api/lookups/complaint-types","Get complaint type dropdown — used when logging a formal patient complaint"),
    (7,"7.7","usp_PatientExperience_GetTemplates","READ","GET","/api/lookups/patient-experience-templates","Get message templates that pre-populate contact notes for common contact types"),
    # ── Domain 8 — Collector Actions ─────────────────────────────────────────
    (8,"8.1","usp_CollectorAction_List", "READ","GET","/api/collector-actions",                  "List collector actions for an account or by rep — calls made, voicemails, payment arrangements"),
    (8,"8.2","usp_CollectorAction_Create","WRITE","POST","/api/collector-actions",               "Log a new collection activity: call made, voicemail left, payment plan set, referral to agency"),
    (8,"8.3","usp_CollectorAction_Update","WRITE","PUT","/api/collector-actions/{actionId}",     "Update a collector action — revise the follow-up date or add resolution notes"),
    (8,"8.4","usp_CollectorAction_GetReasonCodes","READ","GET","/api/lookups/collector-action-reasons","Get reason code dropdown (called/no answer, payment plan set, referred to agency, etc.)"),
    (8,"8.5","usp_CollectorAction_GetDailyTotals","READ","GET","/api/collector-actions/totals",  "Get aggregated collector performance stats — actions, follow-ups completed, accounts touched — by user and date range"),
    # ── Domain 9 — Products & Inventory ──────────────────────────────────────
    (9,"9.1","usp_Product_List",         "READ","GET","/api/products",                           "Browse the product catalog filtered by category or active status"),
    (9,"9.2","usp_Product_Create",       "WRITE","POST","/api/products",                         "Add a new product to the catalog with pricing and vendor info (admin only)"),
    (9,"9.3","usp_Product_Update",       "WRITE","PUT","/api/products/{productId}",              "Update product name, part number, pricing, or active status (admin only)"),
    (9,"9.4","usp_Product_GetBillingCodes","READ","GET","/api/products/{productId}/billing-codes","Get HCPCS billing code mappings for a product — used in billing validation"),
    (9,"9.5","usp_Product_GetBodyParts", "READ","GET","/api/lookups/body-parts",                 "Get body part dropdown (Left Knee, Right Ankle, etc.) for the medical intake section"),
    (9,"9.6","usp_Product_GetCategories","READ","GET","/api/lookups/product-categories",         "Get product category dropdown (AFO, KAFO, TLSO, etc.)"),
    (9,"9.7","usp_Product_GetManufacturers","READ","GET","/api/lookups/manufacturers",           "Get vendor/manufacturer dropdown for product assignment"),
    (9,"9.8","usp_Inventory_ListLocations","READ","GET","/api/inventory/locations",              "List warehouse and storage locations by site — where stock is physically held"),
    (9,"9.9","usp_Inventory_ListSites",  "READ","GET","/api/inventory/sites",                   "List inventory sites (warehouses and offices) — parent lookup for inventory locations"),
    (9,"9.10","usp_Inventory_Assign",    "WRITE","PUT","/api/inventory/{equipmentId}/assign",    "Assign a specific piece of serialized equipment to a patient — records serial number, model, and assignment date for stock-and-bill compliance"),
    # ── Domain 10 — Orders & Purchasing ──────────────────────────────────────
    (10,"10.1","usp_Order_ListByPatient","READ","GET","/api/patients/{jobId}/orders",            "List all orders and purchase orders linked to the patient account with status and item count"),
    (10,"10.2","usp_Order_GetDetail",    "READ","GET","/api/orders/{orderId}",                   "Get full order detail including all line items with SKU, description, quantity, and price"),
    (10,"10.3","usp_Purchasing_GetByPatient","READ","GET","/api/patients/{jobId}/purchasing",    "Get the sales order number, PO number, and invoice number for the account's purchasing record"),
    # ── Domain 11 — Documents / Files ────────────────────────────────────────
    (11,"11.1","usp_Document_ListByPatient","READ","GET","/api/patients/{jobId}/documents",      "List all documents attached to the account: type, filename, upload date, and uploader"),
    (11,"11.2","usp_Document_GetMeta",   "INT","","",                                            "INTERNAL — retrieves blob path for signed URL generation; raw path never returned to client (HIPAA)"),
    (11,"11.3","usp_Document_CreateRecord","WRITE","POST","/api/patients/{jobId}/documents",     "Attach an uploaded file to the patient account; blob is stored in Azure, metadata recorded in the database"),
    (11,"11.4","usp_Document_GetViewUrl","READ","GET","/api/documents/{documentId}/view",        "Get a 5-minute signed URL to view a patient document; access is logged to the HIPAA audit trail automatically"),
    # ── Domain 12 — Directory, Users & Reps ──────────────────────────────────
    (12,"12.1","usp_Directory_GetList",  "READ","GET","/api/directory",                          "Browse the staff directory filtered by division or territory — used for rep assignment pickers"),
    (12,"12.2","usp_Directory_GetReps",  "READ","GET","/api/lookups/reps",                       "Get the sales rep list, optionally filtered by territory — populates rep assignment dropdowns"),
    (12,"12.3","usp_Directory_GetTerritories","READ","GET","/api/lookups/territories",           "Get the territory lookup (regions and territories) — used in scheduling, intake, and queue filtering"),
    (12,"12.4","usp_Directory_GetDivisions","READ","GET","/api/lookups/divisions",               "Get the division/business-unit lookup"),
    (12,"12.5","usp_Directory_GetDoctors","READ","GET","/api/doctors",                           "Browse the physician directory filtered by specialty — used on the referring doctor picker"),
    (12,"12.6","usp_Directory_GetPractitioners","READ","GET","/api/practitioners",               "List clinical practitioners (PTs, OTs, RNs) — used on clinical assignment pickers"),
    (12,"12.7","usp_User_ListAll",       "READ","GET","/api/admin/users",                        "List all user accounts with roles, division, and territory (admin only — User Management screen)"),
    (12,"12.8","usp_User_GetSecurity",   "READ","GET","/api/admin/users/{userId}/security",      "Get role assignments and territory access for a specific user (admin only)"),
    (12,"12.9","usp_User_GetRoleTypes",  "READ","GET","/api/admin/roles",                        "Get all defined role types (Admin, Billing, Clinical, etc.) — used in user role assignment"),
    # ── Domain 13 — Time Records (HR) ────────────────────────────────────────
    (13,"13.1","usp_TimeRecord_List",    "READ","GET","/api/time-records",                       "List time record submissions filtered by employee, pay period, or approval status"),
    (13,"13.2","usp_TimeRecord_GetDetail","READ","GET","/api/time-records/{timeRecordId}",       "Get a specific time record with all hourly or salaried line items"),
    (13,"13.3","usp_TimeRecord_Create",  "WRITE","POST","/api/time-records",                     "Create a new time record header for a pay period"),
    (13,"13.4","usp_TimeRecord_Update",  "WRITE","PUT","/api/time-records/{timeRecordId}",       "Submit, approve, or reject a time record — workflow status update"),
    (13,"13.5","usp_TimeRecord_GetSalariedData","READ","GET","/api/time-records/{id}/salaried-data","Get daily salaried entries and PTO allocations (included in GetDetail response)"),
    (13,"13.6","usp_TimeRecord_GetHourlyData","READ","GET","/api/time-records/{id}/hourly-data", "Get hourly shift entries with start/end times and OT hours (included in GetDetail response)"),
    (13,"13.7","usp_TimeRecord_GetPTOTypes","READ","GET","/api/lookups/pto-types",               "Get PTO type dropdown (Vacation, Sick, Personal, Holiday, Bereavement)"),
    (13,"13.8","usp_TimeRecord_GetPaymentCalendar","READ","GET","/api/time-records/payment-calendar","Get pay period dates for a given year — used to validate week ranges on timecard entry"),
    (13,"13.9","usp_TimeRecord_GetHolidayCalendar","READ","GET","/api/time-records/holiday-calendar","Get company holidays for a year — used in timecard calculations for days that count as worked"),
    # ── Domain 14 — Lookups (Generic) ────────────────────────────────────────
    (14,"14.1","usp_Lookup_GetValues",   "READ","GET","/api/lookups/{tableName}",                "Get dropdown values for any lookup table by name — cancellation reasons, document types, regions, etc. One SP covers all reference lists"),
    (14,"14.2","usp_Lookup_Create",      "WRITE","POST","/api/admin/lookups/{tableName}",        "Add a new value to a lookup table (admin only); change is audit-logged"),
    (14,"14.3","usp_Lookup_Update",      "WRITE","PUT","/api/admin/lookups/{tableName}/{id}",    "Update a lookup table value (admin only); change is audit-logged"),
    (14,"14.4","usp_Lookup_Delete",      "INT","","",                                            "INTERNAL — soft-deletes a lookup value; blocked if value is in use; admin UI action only, not an MCP tool"),
    # ── Domain 15 — Config ───────────────────────────────────────────────────
    (15,"15.1","usp_Config_GetIdp",      "INT","","",                                            "INTERNAL — returns MSAL configuration for the SPA; agents use client_credentials, not IDP config"),
    (15,"15.2","usp_Config_GetAll",      "READ","GET","/api/config",                             "Get all system configuration values: session timeout, max file size, feature flags, runtime settings"),
    (15,"15.3","usp_Config_GetCompany",  "READ","GET","/api/config/company",                     "Get company name, address, and branding for display in reports and print views"),
    # ── Domain 16 — Reporting ────────────────────────────────────────────────
    (16,"16.1","usp_Report_BillingCollections","READ","GET","/api/reports/billing-collections",  "Billing and collections report: outstanding balances, collection performance by payer, aging buckets"),
    (16,"16.2","usp_Report_DepartmentDeliverables","READ","GET","/api/reports/department-deliverables","Department productivity report: deliverables completed, time logged, productivity score by division"),
    (16,"16.3","usp_Report_PSR",         "READ","GET","/api/reports/psr",                        "Patient Satisfaction (PSR) report: contact outcomes, complaint resolution, rep performance by date range"),
    (16,"16.4","usp_Report_Variance",    "READ","GET","/api/reports/variance",                   "Pricing variance report: billed amounts vs contracted rates — surfaces underbilling, overbilling, and margin issues"),
    # ── Domain 17 — Audit & Activity Logs ────────────────────────────────────
    (17,"17.1","usp_AuditLog_Insert",    "INT","","",                                            "INTERNAL — writes HIPAA audit events (PHI access, data change, security); called by API middleware only"),
    (17,"17.2","usp_AuditLog_GetList",   "READ","GET","/api/admin/audit-logs",                   "Search the HIPAA audit log: PHI access events, data changes, security events (admin/auditor only)"),
    (17,"17.3","usp_ActivityLog_Insert", "INT","","",                                            "INTERNAL — records page views, logins, and logouts; called by request pipeline middleware only"),
    (17,"17.4","usp_ActivityLog_GetList","READ","GET","/api/admin/activity-logs",                "Search the user activity log: login, logout, and page-view events by user and date range (admin only)"),
    # ── Domain 18 — Compliance / Scheduled ───────────────────────────────────
    (18,"18.1","usp_Compliance_GetPendingJobs","READ","GET","/api/admin/compliance/pending",     "List patient accounts awaiting compliance review that are overdue — used for the daily compliance sweep"),
    (18,"18.2","usp_Compliance_MassMoveJobs","WRITE","POST","/api/admin/compliance/mass-move",   "Bulk-move accounts that have exceeded the compliance hold period to the next queue; returns count of accounts moved"),
    # ── Domain 19 — Yes/No Module ────────────────────────────────────────────
    (19,"19.1","usp_YesNo_Update",       "WRITE","PUT","/api/patients/{jobId}/yesno",            "Update the three compliance gates in one call: PA authorization status, CMN receipt confirmation, and EDF sign-off. PA Denied blocks the account from advancing to Billing"),
    # ── Domain 20 — Dashboard ────────────────────────────────────────────────
    (20,"20.1","usp_Dashboard_GetActivity","READ","GET","/api/dashboard/activity",              "Get six headline dashboard KPIs in one call: new intakes today, queue transitions, scheduled deliveries, documents uploaded, open collector follow-ups, overdue compliance. Territory-filtered for non-admin users"),
]

DOMAIN_NAMES = {
    1: "Auth & Session",
    2: "Patient / Account",
    3: "Insurance Authorization",
    4: "Queue & Workflow",
    5: "Billing & Claims",
    6: "Scheduling",
    7: "Patient Experience (PSR)",
    8: "Collector Actions",
    9: "Products & Inventory",
    10: "Orders & Purchasing",
    11: "Documents / Files",
    12: "Directory, Users & Reps",
    13: "Time Records (HR)",
    14: "Lookups (Generic)",
    15: "Config",
    16: "Reporting",
    17: "Audit & Activity Logs",
    18: "Compliance / Scheduled",
    19: "Yes/No Module (PA/CMN/EDF)",
    20: "Dashboard",
}

# ─── Domain data (from STP-API-MCP-MATRIX.md Summary) ───────────────────────

DOMAINS = [
    (1,  "Auth & Session",                5,   4,   2,  "User authentication, token lifecycle, session management. Most SPs are internal; one tool surfaces current-user context to AI assistants."),
    (2,  "Patient / Account",             18,  16,  16, "Core patient record — demographics, insurance, job creation, medical history, diagnosis updates, status, and cancellation. Largest domain in the system."),
    (3,  "Insurance Authorization",        5,   5,   5,  "Auth request creation, line-item management, status tracking, and approval workflow for DME insurance authorizations."),
    (4,  "Queue & Workflow",               7,   7,   6,  "13-stage workflow queue (Intake → Billing → Collections). Job transitions, queue-level counts, and routing rules for DME order progression."),
    (5,  "Billing & Claims",               5,   5,   5,  "Fee schedule lookup, billing search, claims processing, and remittance management for OrthoKinetix revenue cycle."),
    (6,  "Scheduling",                    10,   9,   9,  "Appointment creation, calendar search, therapist scheduling, and 48-hour delivery alert monitoring for field operations."),
    (7,  "Patient Experience",             7,   6,   5,  "PSAT surveys, post-delivery call-back tracking, satisfaction scores, and patient-outcome follow-up."),
    (8,  "Collector Actions",              5,   5,   4,  "Daily collector call logs, AR action tracking, daily-total summaries, and collection queue management."),
    (9,  "Products & Inventory",          10,  10,   9,  "Equipment catalog, SKU management, inventory levels, and assignment of equipment to specific patients at delivery."),
    (10, "Orders & Purchasing",            3,   3,   3,  "Purchase-order listing, vendor ordering, and reorder tracking to maintain equipment supply."),
    (11, "Documents / Files",              4,   4,   3,  "Document metadata lookup and HIPAA-compliant signed download URLs for CMN, EDF, and other PHI-attached files."),
    (12, "Directory, Users & Reps",        9,   8,   6,  "Doctor and facility directory, sales representative management, referring physician lookup, and staff-user directory."),
    (13, "Time Records (HR)",              9,   9,   6,  "Timecard entry, manager approval workflow, and payroll-ready time export for field and office staff."),
    (14, "Lookups (Generic)",              4,   4,   2,  "Shared reference data — insurance payer names, territories, status codes, and all system dropdown values."),
    (15, "Config",                         3,   3,   2,  "System-wide configuration and company-settings retrieval for runtime behavior and multi-tenant configuration."),
    (16, "Reporting",                      4,   4,   4,  "Billing collections report, PSR (physician summary), variance analysis, and KPI dashboard data."),
    (17, "Audit & Activity Logs",          4,   4,   3,  "HIPAA-compliant audit trail — user access log, data-change history, and compliance event recording."),
    (18, "Compliance / Scheduled",         2,   2,   2,  "Mass job-move operations and compliance batch processing for regulatory workflows."),
    (19, "Yes/No Module (PA/CMN/EDF)",     1,   1,   1,  "Three compliance gates that block queue progression: Prior Authorization status, CMN receipt confirmation, and EDF sign-off."),
    (20, "Dashboard",                      1,   1,   1,  "Real-time territory and user activity dashboard — session-aware, role-filtered activity feed."),
]

TOTAL_STPS      = sum(d[2] for d in DOMAINS)  # 116
TOTAL_ENDPOINTS = sum(d[3] for d in DOMAINS)  # 110
TOTAL_TOOLS     = sum(d[4] for d in DOMAINS)  # 94

# ─── Logo as data URI ────────────────────────────────────────────────────────

def logo_src() -> str:
    if LOGO_PATH.exists():
        import base64
        data = base64.b64encode(LOGO_PATH.read_bytes()).decode()
        return f"data:image/png;base64,{data}"
    return ""


# ─── CSS ─────────────────────────────────────────────────────────────────────

CSS = f"""
@page {{
  size: A4 portrait;
  margin: 20mm 18mm 22mm 18mm;
  @bottom-center {{
    content: "Technijian · OXPLive Modernization · Confidential";
    font-size: 7pt; color: {B['muted']};
    font-family: 'Segoe UI', Arial, sans-serif;
  }}
  @bottom-right {{
    content: counter(page) " of " counter(pages);
    font-size: 7pt; color: {B['muted']};
    font-family: 'Segoe UI', Arial, sans-serif;
  }}
}}

@page cover {{ margin: 0; @bottom-center {{ content: none; }} @bottom-right {{ content: none; }} }}

*, *::before, *::after {{ box-sizing: border-box; }}

body {{
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 9.5pt;
  color: {B['text']};
  line-height: 1.55;
  margin: 0; padding: 0;
}}

/* ── Cover ────────────────────────────────────── */
.cover {{
  page: cover;
  width: 210mm; height: 297mm;
  display: flex; flex-direction: column;
  background: {B['dark']};
  page-break-after: always;
  overflow: hidden;
  position: relative;
}}

.cover-top-bar {{
  background: {B['orange']};
  height: 6px;
  width: 100%;
  flex-shrink: 0;
}}

.cover-header {{
  padding: 36px 48px 0;
  flex-shrink: 0;
}}

.cover-logo-img {{
  height: 38px;
  width: auto;
  display: block;
}}

.cover-logo-text {{
  font-size: 16pt;
  font-weight: 800;
  color: {B['orange']};
  letter-spacing: 2px;
  display: block;
}}

.cover-body {{
  padding: 60px 48px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}}

.cover-eyebrow {{
  font-size: 8.5pt;
  font-weight: 600;
  color: {B['teal']};
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 16px;
}}

.cover h1 {{
  font-size: 32pt;
  font-weight: 800;
  color: {B['white']};
  margin: 0 0 6px;
  line-height: 1.15;
}}

.cover-subtitle {{
  font-size: 14pt;
  font-weight: 600;
  color: {B['teal']};
  margin: 0 0 40px;
}}

.cover-meta-table {{
  border-collapse: collapse;
  margin-bottom: 40px;
}}
.cover-meta-table td {{
  padding: 5px 40px 5px 0;
  font-size: 9pt;
  color: #aabbcc;
  border: none;
  background: transparent;
  vertical-align: top;
}}
.cover-meta-table td:first-child {{
  color: {B['white']};
  font-weight: 600;
  white-space: nowrap;
}}
.cover-meta-table tr:nth-child(even) td {{
  background: transparent !important;
  color: #aabbcc;
}}
.cover h1 {{
  border-bottom: none !important;
}}

.cover-kpis {{
  display: flex;
  gap: 14px;
  margin-top: 4px;
  flex-wrap: wrap;
}}
.kpi {{
  background: rgba(255,255,255,.07);
  border: 1px solid rgba(255,255,255,.14);
  border-radius: 8px;
  padding: 14px 20px;
  text-align: center;
  min-width: 90px;
}}
.kpi .num {{
  font-size: 22pt;
  font-weight: 700;
  color: {B['teal']};
  display: block;
  line-height: 1.1;
}}
.kpi .lbl {{
  font-size: 7pt;
  color: #aabbcc;
  margin-top: 3px;
  display: block;
}}

.cover-footer {{
  padding: 24px 48px;
  border-top: 1px solid rgba(255,255,255,.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}}
.cover-footer span {{
  font-size: 7.5pt;
  color: #778899;
}}

/* ── Body sections ────────────────────────────── */
.section {{
  page-break-before: always;
}}

.section:first-child {{
  page-break-before: avoid;
}}

h1 {{
  font-size: 14pt;
  font-weight: 700;
  color: {B['blue']};
  border-bottom: 2.5px solid {B['blue']};
  padding-bottom: 6px;
  margin: 0 0 14px;
}}

h2 {{
  font-size: 10.5pt;
  font-weight: 700;
  color: {B['dark']};
  margin: 20px 0 8px;
}}

h3 {{
  font-size: 9.5pt;
  font-weight: 600;
  color: {B['blue']};
  margin: 14px 0 6px;
}}

p {{ margin: 6px 0 10px; }}

ul, ol {{ margin: 4px 0 10px; padding-left: 22px; }}
li {{ margin-bottom: 4px; }}

/* ── Info box ─────────────────────────────────── */
.infobox {{
  background: {B['light']};
  border-left: 3.5px solid {B['teal']};
  border-radius: 0 6px 6px 0;
  padding: 12px 16px;
  margin: 12px 0;
  font-size: 9pt;
  color: {B['text']};
}}

.callout {{
  background: #EBF5FF;
  border: 1px solid #BEE0F7;
  border-radius: 6px;
  padding: 12px 16px;
  margin: 12px 0;
  font-size: 9pt;
}}

/* ── Architecture diagram ─────────────────────── */
.arch-diagram {{
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  margin: 16px 0 20px;
}}
.arch-layer {{
  display: flex;
  align-items: center;
  gap: 12px;
}}
.arch-box {{
  background: {B['blue']};
  color: {B['white']};
  font-weight: 600;
  font-size: 9pt;
  padding: 10px 20px;
  border-radius: 6px;
  min-width: 200px;
  text-align: center;
}}
.arch-box.orange {{ background: {B['orange']}; }}
.arch-box.teal {{ background: {B['teal']}; }}
.arch-box.dark {{ background: {B['dark']}; }}
.arch-label {{
  font-size: 8pt;
  color: {B['muted']};
  font-style: italic;
}}
.arch-arrow {{
  font-size: 14pt;
  color: {B['teal']};
  line-height: 1;
  margin: 2px 0 2px 30px;
}}

/* ── Tables ───────────────────────────────────── */
table {{
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0 16px;
  font-size: 8.5pt;
}}
thead tr {{
  background: {B['blue']};
  color: {B['white']};
}}
th {{
  padding: 7px 10px;
  font-weight: 600;
  text-align: left;
  border: 1px solid {B['blue']};
}}
td {{
  padding: 6px 10px;
  border: 1px solid {B['border']};
  vertical-align: top;
}}
tr:nth-child(even) td {{ background: {B['light']}; }}

/* ── Domain table column widths ───────────────── */
.domain-table th:nth-child(1), .domain-table td:nth-child(1) {{ width: 3%; text-align: center; }}
.domain-table th:nth-child(2), .domain-table td:nth-child(2) {{ width: 21%; font-weight: 600; }}
.domain-table th:nth-child(3), .domain-table td:nth-child(3) {{ width: 5%; text-align: center; }}
.domain-table th:nth-child(4), .domain-table td:nth-child(4) {{ width: 5%; text-align: center; }}
.domain-table th:nth-child(5), .domain-table td:nth-child(5) {{ width: 5%; text-align: center; }}
.domain-table th:nth-child(6), .domain-table td:nth-child(6) {{ width: 61%; }}

/* ── Signature block ──────────────────────────── */
.sig-block {{
  border: 1.5px solid {B['border']};
  border-radius: 8px;
  padding: 20px 24px;
  margin: 16px 0;
}}
.sig-block h3 {{
  margin-top: 0;
  color: {B['dark']};
}}
.sig-line {{
  border-top: 1.5px solid {B['dark']};
  margin-top: 36px;
  padding-top: 4px;
  font-size: 8.5pt;
  color: {B['muted']};
  display: flex;
  justify-content: space-between;
}}
.sig-grid {{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 16px;
}}

/* ── Phase table ──────────────────────────────── */
.phase-table th:nth-child(1) {{ width: 10%; }}
.phase-table th:nth-child(2) {{ width: 22%; }}
.phase-table th:nth-child(3) {{ width: 48%; }}
.phase-table th:nth-child(4) {{ width: 20%; }}

/* ── Badge ────────────────────────────────────── */
.badge {{
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 7.5pt;
  font-weight: 600;
}}
.badge-blue   {{ background: #DBEEFF; color: #004F8A; }}
.badge-teal   {{ background: #D0F4FA; color: #0B7A91; }}
.badge-orange {{ background: #FEEBD9; color: #B3521E; }}
.badge-green  {{ background: #C6F6D5; color: #276749; }}

/* ── Security table ───────────────────────────── */
.sec-table th:nth-child(1) {{ width: 22%; }}
.sec-table th:nth-child(2) {{ width: 78%; }}
"""


# ─── Section helpers ─────────────────────────────────────────────────────────

def cover(logo_src_val: str) -> str:
    logo_html = (f'<img src="{logo_src_val}" class="cover-logo-img">'
                 if logo_src_val else
                 '<span class="cover-logo-text">TECHNIJIAN</span>')
    return f"""
<div class="cover">
  <div class="cover-top-bar"></div>
  <div class="cover-header">
    {logo_html}
  </div>
  <div class="cover-body">
    <div class="cover-eyebrow">Client Approval Report</div>
    <h1>OXPLive<br>MCP Server</h1>
    <div class="cover-subtitle">Secure AI Access to the OXPLive Platform</div>
    <table class="cover-meta-table">
      <tr><td>Prepared for</td><td>OrthoKinetix (ORX)</td></tr>
      <tr><td>Prepared by</td><td>Technijian</td></tr>
      <tr><td>Project</td><td>OXPLive Modernization — Phase B Deliverable</td></tr>
      <tr><td>Date</td><td>June 2026</td></tr>
      <tr><td>Status</td><td>Pending Client Approval — Phase F (Build)</td></tr>
      <tr><td>Classification</td><td>Confidential — OrthoKinetix / Technijian Use Only</td></tr>
    </table>
    <div class="cover-kpis">
      <div class="kpi"><span class="num">{TOTAL_STPS}</span><span class="lbl">Stored Procedures</span></div>
      <div class="kpi"><span class="num">{TOTAL_ENDPOINTS}</span><span class="lbl">API Endpoints</span></div>
      <div class="kpi"><span class="num">{TOTAL_TOOLS}</span><span class="lbl">MCP Tools</span></div>
      <div class="kpi"><span class="num">20</span><span class="lbl">Functional Domains</span></div>
      <div class="kpi"><span class="num">100%</span><span class="lbl">DB Call Coverage</span></div>
    </div>
  </div>
  <div style="flex:1;"></div>
  <div style="padding:0 48px 32px;">
    <div style="border-left:3px solid {B['orange']};padding:12px 18px;background:rgba(255,255,255,.04);border-radius:0 6px 6px 0;">
      <div style="font-size:8pt;color:#aabbcc;line-height:1.7;">
        <span style="color:{B['teal']};font-weight:600;">Companion document:</span>
        STP-API-MCP Coverage Matrix (A3 landscape) — all 116 stored procedures, API endpoints,
        and MCP tool definitions. Available on request.
      </div>
    </div>
  </div>
  <div class="cover-footer">
    <span>Technijian · technology as a solution</span>
    <span>949.379.8499 · technijian.com</span>
    <span>Confidential — OrthoKinetix / Technijian Only</span>
  </div>
</div>
"""


def exec_summary() -> str:
    return f"""
<div class="section">
  <h1>01 &nbsp; Executive Summary</h1>

  <p>OrthoKinetix operates the <strong>OXPLive</strong> practice management platform — a mature SQL Server system
  running the full DME order lifecycle: intake, benefits verification, insurance authorization, shipping,
  billing, re-billing, and collections across 13 workflow queues.</p>

  <p>Technijian proposes to make that data safely available to AI assistants (Claude) through a purpose-built
  <strong>Model Context Protocol (MCP) server</strong>. The server connects Claude directly to the OXPLive
  database via a set of {TOTAL_STPS} curated stored procedures across {len(DOMAINS)} functional domains —
  without granting the AI any direct table access.</p>

  <div class="infobox">
    <strong>The governing rule:</strong> every AI request follows a single, auditable path —
    Claude calls a documented MCP tool → the tool executes an approved stored procedure →
    the stored procedure reads or writes the database. No exceptions. No inline SQL.
    No table-level permissions for the AI service account.
  </div>

  <p>This document presents the complete scope of what will be built, the {TOTAL_STPS}-procedure coverage matrix,
  the security and HIPAA controls in place, the delivery plan, and the approval request to begin
  Phase F (Build).</p>

  <p>The full engineering specification — including every stored procedure, its parameters, return schema,
  API endpoint, and MCP tool definition — is documented in the companion
  <em>STP-API-MCP Coverage Matrix</em>, provided as a separate deliverable.</p>
</div>
"""


def current_state() -> str:
    return f"""
<div class="section">
  <h1>02 &nbsp; Why Now — The Current-State Gap</h1>

  <p>Technijian has been the active IT and development partner for OrthoKinetix since approximately 2015.
  As part of the ongoing <strong>OXPLive Modernization</strong> project (migrating from ColdFusion to
  .NET 8 / React 18 under Technijian SDLC v6.0), a complete database-call inventory was conducted in
  early 2026.</p>

  <h2>What Was Found</h2>
  <p>The legacy OXPLive ColdFusion frontend makes hundreds of direct database calls across 13 workflow queues.
  These calls are not governed — they bypass stored procedures in many places, embed business logic in the UI
  layer, and contain hardcoded credentials. This creates three gaps that block safe AI access today:</p>

  <ul>
    <li><strong>No single governed access path.</strong> The application reaches the database through
    a mix of stored procedures, inline SQL, and direct table reads. An AI assistant granted the same
    access would have uncontrolled write access to production data.</li>
    <li><strong>No audit trail by design.</strong> Direct database calls leave no application-level
    record of who accessed what, when, or why — a HIPAA audit requirement.</li>
    <li><strong>No semantic boundary.</strong> Without a procedure layer, there is no clean way to expose
    only what the AI should see while hiding raw PHI fields, financial data, and operational tables.</li>
  </ul>

  <h2>The Solution</h2>
  <p>The OXPLive Modernization addresses all three gaps by establishing a complete, SP-Only database access
  pattern. Every frontend interaction — and every AI tool call — must go through a named, documented,
  version-controlled stored procedure. This is both a modernization best practice and the prerequisite for
  safe AI integration.</p>
</div>
"""


def architecture() -> str:
    return f"""
<div class="section">
  <h1>03 &nbsp; Architecture — DB-Direct Design</h1>

  <p>The OXPLive MCP server uses a <strong>DB-Direct</strong> architecture: Claude connects to the MCP server
  via Streamable HTTP, and the server executes stored procedures directly against SQL Server via a secure
  connection pool. There is no intermediate REST API layer for MCP access.</p>

  <div class="arch-diagram">
    <div class="arch-layer">
      <div class="arch-box orange">Claude (Desktop / Code / API)</div>
      <span class="arch-label">AI assistant — your staff or automated workflows</span>
    </div>
    <div class="arch-arrow">&#8595;</div>
    <div class="arch-layer">
      <div class="arch-box">Streamable HTTP &nbsp;<span style="font-weight:400;font-size:8pt">POST /mcp</span></div>
      <span class="arch-label">MCP 2025-03-26 spec · session-keyed · optional API-key auth</span>
    </div>
    <div class="arch-arrow">&#8595;</div>
    <div class="arch-layer">
      <div class="arch-box teal">OXPLive MCP Server &nbsp;<span style="font-weight:400;font-size:8pt">Node.js + mssql</span></div>
      <span class="arch-label">{TOTAL_TOOLS} MCP tools · dispatches to named stored procedures</span>
    </div>
    <div class="arch-arrow">&#8595;</div>
    <div class="arch-layer">
      <div class="arch-box dark">SQL Server — oxadmin schema &nbsp;<span style="font-weight:400;font-size:8pt">oxadmin.usp_*</span></div>
      <span class="arch-label">Service account with EXECUTE-only on oxadmin schema · no table permissions</span>
    </div>
    <div class="arch-arrow">&#8595;</div>
    <div class="arch-layer">
      <div class="arch-box" style="background:{B['muted']}">OXPLive Tables · Views · Functions</div>
      <span class="arch-label">Production OrthoXpressDB — never directly accessible to the MCP service account</span>
    </div>
  </div>

  <h2>Why DB-Direct</h2>
  <p>The OXPLive Modernization Phase F will build a .NET 8 REST API, but the stored procedures are being
  designed now as part of Phase B. DB-Direct lets the MCP server go live the moment the stored procedures
  are tested — before the full API layer is complete — giving OrthoKinetix early AI access while the
  broader modernization continues.</p>

  <div class="callout">
    <strong>Security posture is unchanged</strong> from an API-first design. The SQL Server service account
    (<code>oxplive_mcp_svc</code>) holds only <code>EXECUTE</code> on the <code>oxadmin</code> schema.
    It cannot read tables directly, run dynamic SQL, or access any object outside the curated procedure set.
  </div>

  <h2>Transport — Streamable HTTP</h2>
  <p>The server implements the <strong>MCP 2025-03-26 Streamable HTTP</strong> transport specification:</p>
  <ul>
    <li><strong>POST /mcp</strong> — creates or resumes a session; handles all JSON-RPC tool calls</li>
    <li><strong>GET /mcp</strong> — SSE stream for server-initiated messages (session-keyed)</li>
    <li><strong>DELETE /mcp</strong> — gracefully closes a session</li>
    <li><strong>GET /health</strong> — returns <code>&#123; status: "ok", sessions: N &#125;</code></li>
  </ul>
  <p>Sessions are identified by the <code>mcp-session-id</code> header, enabling multiple concurrent
  Claude sessions against the same server without interference.</p>
</div>
"""


def domain_matrix() -> str:
    rows = ""
    for d in DOMAINS:
        num, name, stps, endpoints, tools, biz = d
        rows += f"""
        <tr>
          <td>{num}</td>
          <td>{name}</td>
          <td>{stps}</td>
          <td>{endpoints}</td>
          <td>{tools}</td>
          <td>{biz}</td>
        </tr>"""
    total_row = f"""
        <tr style="background:{B['dark']};color:{B['white']};font-weight:700;">
          <td colspan="2">TOTAL</td>
          <td>{TOTAL_STPS}</td>
          <td>{TOTAL_ENDPOINTS}</td>
          <td>{TOTAL_TOOLS}</td>
          <td style="color:#aabbcc;font-weight:400;">100% of OXPLive database calls covered</td>
        </tr>"""
    return f"""
<div class="section">
  <h1>04 &nbsp; Domain Coverage Matrix</h1>

  <p>The table below summarises the complete stored-procedure coverage across all {len(DOMAINS)} functional
  domains of the OXPLive system. Every domain corresponds to a distinct area of the OXPLive workflow UI.
  The full {TOTAL_STPS}-row matrix — with individual SP parameters, return schemas, API endpoint definitions,
  and MCP tool specifications — is provided in the companion <em>STP-API-MCP Coverage Matrix</em> document.</p>

  <table class="domain-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Domain</th>
        <th>STPs</th>
        <th>API<br>Endpoints</th>
        <th>MCP<br>Tools</th>
        <th>Business Purpose</th>
      </tr>
    </thead>
    <tbody>
      {rows}
      {total_row}
    </tbody>
  </table>

  <p style="font-size:8pt;color:{B['muted']}">
    STPs = Stored Procedures. API Endpoints = planned .NET 8 REST endpoints (Phase F).
    MCP Tools = tools exposed to Claude today via the DB-Direct MCP server.
    Some STPs are INTERNAL (called by other SPs) and are not exposed as MCP tools.
  </p>
</div>
"""


def detailed_capability() -> str:
    """Section 05 — full per-SP capability table grouped by domain."""
    read_count  = sum(1 for s in STPS if s[3] == "READ")
    write_count = sum(1 for s in STPS if s[3] == "WRITE")

    # build per-domain blocks
    from itertools import groupby
    domain_blocks = ""
    for domain_num, rows in groupby(STPS, key=lambda s: s[0]):
        rows = list(rows)
        dname = DOMAIN_NAMES[domain_num]
        row_html = ""
        for i, (_, ref, sp, rw, method, endpoint, desc) in enumerate(rows):
            bg = f'background:{B["light"]}' if i % 2 == 0 else ''
            if rw == "READ":
                badge = f'<span style="background:#C6F6D5;color:#276749;border-radius:3px;padding:1px 6px;font-size:7pt;font-weight:600">READ</span>'
            elif rw == "WRITE":
                badge = f'<span style="background:#FEEBD9;color:#B3521E;border-radius:3px;padding:1px 6px;font-size:7pt;font-weight:600">WRITE</span>'
            else:
                badge = f'<span style="background:#EEF2F7;color:#718096;border-radius:3px;padding:1px 6px;font-size:7pt;font-weight:600">INTERNAL</span>'

            ep_html = (f'<span style="font-family:monospace;font-size:7.5pt;color:{B["blue"]}">'
                       f'{method}&nbsp;{endpoint}</span>' if endpoint else
                       '<span style="color:#718096;font-size:7.5pt;font-style:italic">not exposed</span>')

            row_html += f"""
            <tr style="{bg}">
              <td style="width:3%;text-align:center;font-size:7.5pt;color:{B['muted']}">{ref}</td>
              <td style="width:17%;font-family:monospace;font-size:7.5pt;color:{B['blue']};word-break:break-all">{sp}</td>
              <td style="width:7%;text-align:center">{badge}</td>
              <td style="width:28%">{ep_html}</td>
              <td style="width:45%;font-size:8pt">{desc}</td>
            </tr>"""

        domain_blocks += f"""
        <div style="margin-bottom:24px">
          <div style="font-size:10pt;font-weight:700;color:{B['dark']};
                      border-left:4px solid {B['blue']};padding:6px 12px;
                      background:{B['light']};margin-bottom:6px">
            Domain {domain_num} — {dname}
          </div>
          <table style="border-collapse:collapse;width:100%;font-size:8pt">
            <thead>
              <tr style="background:{B['blue']};color:#fff">
                <th style="padding:5px 8px;text-align:left;width:3%">#</th>
                <th style="padding:5px 8px;text-align:left;width:17%">Stored Procedure</th>
                <th style="padding:5px 8px;text-align:center;width:7%">R / W</th>
                <th style="padding:5px 8px;text-align:left;width:28%">API Endpoint</th>
                <th style="padding:5px 8px;text-align:left;width:45%">What It Does</th>
              </tr>
            </thead>
            <tbody>{row_html}</tbody>
          </table>
        </div>"""

    return f"""
<div class="section">
  <h1>05 &nbsp; Detailed Capability Reference</h1>
  <p>Every stored procedure the OXPLive MCP server exposes is listed below, grouped by functional domain.
  Each row shows whether the operation <strong>reads</strong> data or <strong>writes / updates</strong> it,
  the API endpoint that will map to this procedure in Phase F, and a plain-English description of what
  OrthoKinetix staff and AI assistants can do with it.</p>

  <div style="display:flex;gap:20px;margin:12px 0 20px;flex-wrap:wrap">
    <div style="background:{B['light']};border:1px solid {B['border']};border-radius:6px;padding:10px 18px;text-align:center">
      <div style="font-size:18pt;font-weight:700;color:{B['blue']}">{read_count}</div>
      <div style="font-size:8pt;color:{B['muted']}">Read Operations</div>
    </div>
    <div style="background:{B['light']};border:1px solid {B['border']};border-radius:6px;padding:10px 18px;text-align:center">
      <div style="font-size:18pt;font-weight:700;color:{B['orange']}">{write_count}</div>
      <div style="font-size:8pt;color:{B['muted']}">Write / Update Operations</div>
    </div>
    <div style="background:{B['light']};border:1px solid {B['border']};border-radius:6px;padding:10px 18px;text-align:center">
      <div style="font-size:18pt;font-weight:700;color:{B['muted']}">{len(STPS)-read_count-write_count}</div>
      <div style="font-size:8pt;color:{B['muted']}">Internal (not exposed)</div>
    </div>
  </div>

  {domain_blocks}
</div>
"""


def security_section() -> str:
    return f"""
<div class="section">
  <h1>06 &nbsp; Security, HIPAA &amp; Governance</h1>

  <p>OXPLive contains protected health information — patient demographics, insurance details, DME order data,
  and EDI 835/837 claims. Security controls are designed into every layer of this architecture, not added
  afterward. The following table summarises each control.</p>

  <table class="sec-table">
    <thead>
      <tr><th>Control</th><th>Implementation</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Service Account Isolation</strong></td>
          <td>The <code>oxplive_mcp_svc</code> SQL Server login holds only <code>GRANT EXECUTE ON SCHEMA::oxadmin</code>.
          No table-level SELECT, INSERT, UPDATE, or DELETE permissions are granted. No dynamic SQL is possible.</td></tr>
      <tr><td><strong>SP-Only Access Pattern</strong></td>
          <td>Every AI request resolves to a named, version-controlled stored procedure.
          Inline SQL from AI-generated queries is architecturally impossible.</td></tr>
      <tr><td><strong>Audit Logging</strong></td>
          <td>Domain 17 exposes audit-log procedures. HIPAA-sensitive SPs
          (<code>usp_Document_GetViewUrl</code>, all patient-record writers) trigger server-side
          audit entries recording user, action, timestamp, and affected record ID.</td></tr>
      <tr><td><strong>PHI Field Masking</strong></td>
          <td>SSN and other PHI identifiers are masked at the stored-procedure level before
          they reach the MCP response payload. Patient-data fields require explicit role clearance
          (enforced in the procedure's parameter validation).</td></tr>
      <tr><td><strong>Document URLs</strong></td>
          <td>File access (<code>usp_Document_GetViewUrl</code>) returns HIPAA-compliant signed URLs
          with short-lived expiry. No raw file paths or permanent links are returned.</td></tr>
      <tr><td><strong>Transport Security</strong></td>
          <td>Streamable HTTP runs over HTTPS in production. An optional <code>MCP_API_KEY</code>
          header provides HTTP-level bearer auth. Network access to the MCP server port is restricted
          by firewall to authorised client IP ranges.</td></tr>
      <tr><td><strong>Session Isolation</strong></td>
          <td>Each Claude session receives a unique <code>mcp-session-id</code>.
          Sessions are server-memory-scoped; one session cannot access another session's state or results.</td></tr>
      <tr><td><strong>Compliance Domains</strong></td>
          <td>Domain 19 (Yes/No Module) enforces the three compliance gates — PA Status, CMN receipt,
          and EDF sign-off — that must be satisfied before a job can progress in the queue.
          Domain 18 handles mass-move and scheduled compliance batch operations.</td></tr>
    </tbody>
  </table>

  <div class="infobox">
    This design supports OrthoKinetix's HIPAA compliance posture. It does not replace the organisation's
    existing policies, Business Associate Agreements, or staff training, which remain in place.
  </div>
</div>
"""


def what_gets_built() -> str:
    return f"""
<div class="section">
  <h1>07 &nbsp; What Gets Built</h1>

  <h2>MCP Server — Node.js Application</h2>
  <p>The OXPLive MCP server is a <strong>Node.js / TypeScript</strong> application built on the
  official <code>@modelcontextprotocol/sdk</code> package. It uses the <code>mssql</code> library for
  SQL Server connectivity and <code>Express</code> for the Streamable HTTP transport. Key components:</p>

  <ul>
    <li><strong>DB Client</strong> — singleton <code>mssql</code> connection pool; <code>executeSP()</code>,
    <code>querySP()</code>, and <code>querySPSingle()</code> helpers that auto-prefix <code>oxadmin.</code>
    to every procedure name</li>
    <li><strong>20 Domain Tool Files</strong> — one TypeScript file per domain, each exporting its MCP
    tool definitions and request handlers</li>
    <li><strong>Server Core</strong> — <code>createOxpliveMcpServer()</code> registers all {TOTAL_TOOLS} tools
    and dispatches calls to the matching domain handler</li>
    <li><strong>Streamable HTTP Transport</strong> — Express app with session map; supports multiple
    concurrent Claude sessions</li>
  </ul>

  <h2>SQL Server Service Account</h2>
  <p>A dedicated, least-privilege SQL Server login is created specifically for the MCP server:</p>
  <div class="infobox" style="font-family:monospace;font-size:8.5pt;line-height:1.6">
    CREATE LOGIN oxplive_mcp_svc WITH PASSWORD = '&lt;vault-managed password&gt;';<br>
    CREATE USER  oxplive_mcp_svc FOR LOGIN oxplive_mcp_svc;<br>
    GRANT EXECUTE ON SCHEMA::oxadmin TO oxplive_mcp_svc;
  </div>
  <p>No further permissions are required. The service account cannot read, write, or alter any table,
  view, or function directly.</p>

  <h2>Configuration &amp; Deployment</h2>
  <p>All connection strings and secrets are managed via environment variables (never committed to source
  control). The server ships with a <code>.env.example</code> file and a
  <code>config/claude-code.mcp.json</code> snippet for immediate Claude Code integration.</p>

  <h2>What Is NOT in Scope</h2>
  <ul>
    <li>The .NET 8 REST API layer (Phase F — planned, not yet approved)</li>
    <li>An admin portal or management dashboard</li>
    <li>Changes to the existing OXPLive ColdFusion application</li>
    <li>Changes to the OrthoXpressDB schema or existing stored procedures</li>
  </ul>
</div>
"""


def delivery_plan() -> str:
    return f"""
<div class="section">
  <h1>08 &nbsp; Delivery Plan</h1>

  <p>The MCP server delivery is structured in three phases. Each phase ends with a clear, demonstrable result
  that OrthoKinetix can test before the next phase begins.</p>

  <table class="phase-table">
    <thead>
      <tr><th>Phase</th><th>Deliverable</th><th>Scope</th><th>Exit Criteria</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="badge badge-blue">Phase 1</span></td>
        <td><strong>Stored Procedure Foundation</strong></td>
        <td>All {TOTAL_STPS} stored procedures authored, reviewed, and deployed to the OXPLive test database.
        Includes read-only procedures for all 20 domains plus write procedures for core entities.</td>
        <td>All SPs pass unit tests against test DB; naming convention compliant; HIPAA-sensitive fields verified</td>
      </tr>
      <tr>
        <td><span class="badge badge-teal">Phase 2</span></td>
        <td><strong>MCP Server — Build &amp; Test</strong></td>
        <td>Node.js MCP server with all {TOTAL_TOOLS} tools, DB-Direct wiring, Streamable HTTP transport, service
        account provisioning, and Claude Code integration.</td>
        <td>Claude can invoke all {TOTAL_TOOLS} tools against the test database; audit log confirms all calls recorded</td>
      </tr>
      <tr>
        <td><span class="badge badge-green">Phase 3</span></td>
        <td><strong>Production Deployment</strong></td>
        <td>Production environment setup, credential vault integration, firewall rules, HTTPS,
        staff training session, and final sign-off from OrthoKinetix IT.</td>
        <td>Server running in production; OrthoKinetix team can connect Claude and execute representative queries</td>
      </tr>
    </tbody>
  </table>

  <p>Detailed timeline and effort estimates are confirmed during the kick-off session and provided in a
  companion Statement of Work upon approval of this document.</p>
</div>
"""


def next_steps() -> str:
    return f"""
<div class="section">
  <h1>09 &nbsp; What We Need From You</h1>

  <p>Approval of this document authorises Technijian to begin Phase 1. A short kick-off session is
  scheduled immediately afterward to confirm the items below. None of these decisions block approval —
  they shape the detailed plan.</p>

  <ul>
    <li><strong>Domain priority order.</strong> Which of the 20 domains should be built first?
    (Suggested default: Domains 1–5 — Auth, Patient, Insurance Auth, Queue, Billing.)</li>
    <li><strong>Test database access.</strong> Confirmation that Technijian may continue working against
    the existing test/UAT environment for Phase 1 and Phase 2.</li>
    <li><strong>Service account provisioning.</strong> Authorisation to create the <code>oxplive_mcp_svc</code>
    login and grant it EXECUTE on the <code>oxadmin</code> schema.</li>
    <li><strong>Credential vault.</strong> Preferred secret-management approach (Azure Key Vault, Windows
    Credential Manager, or Technijian-managed vault) for the service account password and API key.</li>
    <li><strong>Hosting location.</strong> Where the MCP server will run — on-premises IIS, Windows service,
    Docker container, or Technijian-hosted.</li>
    <li><strong>Internal users.</strong> Who at OrthoKinetix will use Claude with the MCP tools, and at
    what initial permission level (read-only vs. read/write access to write-capable domains).</li>
  </ul>
</div>
"""


def approval_page() -> str:
    return f"""
<div class="section">
  <h1>10 &nbsp; Approval &amp; Sign-Off</h1>

  <p>By signing below, OrthoKinetix authorises Technijian to proceed with the OXPLive MCP Server project
  as described in this document, beginning with Phase 1 (Stored Procedure Foundation). This approval
  covers the technical approach, domain scope, and phased delivery plan.</p>

  <p>Specific timeline, effort hours, and fees are confirmed in a companion Statement of Work,
  which will be issued within five (5) business days of receiving this signed approval.</p>

  <div class="sig-grid">
    <div class="sig-block">
      <h3>OrthoKinetix</h3>
      <p style="font-size:8.5pt;color:{B['muted']}">
        Authorised on behalf of OrthoKinetix / OrthoXpress
      </p>
      <div class="sig-line">
        <span>Signature</span>
        <span>Date</span>
      </div>
      <div class="sig-line" style="margin-top:20px;">
        <span>Name (print)</span>
        <span>Title</span>
      </div>
    </div>

    <div class="sig-block">
      <h3>Technijian</h3>
      <p style="font-size:8.5pt;color:{B['muted']}">
        Prepared and submitted by Technijian Inc.
      </p>
      <div class="sig-line">
        <span>Rohit Jain, Technijian</span>
        <span>June 2026</span>
      </div>
      <div class="sig-line" style="margin-top:20px;">
        <span>949.379.8499 · rjain@technijian.com</span>
        <span>&nbsp;</span>
      </div>
    </div>
  </div>

  <div class="infobox" style="margin-top:24px;">
    <strong>Questions?</strong> Contact Technijian at 949.379.8499 (main) or rjain@technijian.com.
    The full engineering specification, STP-API-MCP Coverage Matrix, and Statement of Work
    are available on request.
  </div>
</div>
"""


def appendix() -> str:
    rows = ""
    for d in DOMAINS:
        num, name, stps, endpoints, tools, _ = d
        rows += f"<tr><td>{num}</td><td>{name}</td><td>{stps}</td><td>{endpoints}</td><td>{tools}</td></tr>"
    return f"""
<div class="section">
  <h1>A &nbsp; Appendix — Full Domain Reference</h1>

  <h2>A.1 &nbsp; Domain Summary (authoritative counts)</h2>
  <table>
    <thead>
      <tr><th>#</th><th>Domain</th><th>STPs</th><th>API Endpoints</th><th>MCP Tools</th></tr>
    </thead>
    <tbody>
      {rows}
      <tr style="font-weight:700;background:{B['dark']};color:{B['white']}">
        <td colspan="2">TOTAL</td>
        <td>{TOTAL_STPS}</td>
        <td>{TOTAL_ENDPOINTS}</td>
        <td>{TOTAL_TOOLS}</td>
      </tr>
    </tbody>
  </table>

  <h2>A.2 &nbsp; The 13 Workflow Queues</h2>
  <p>The OXPLive platform routes DME orders through 13 named queues. Domain 4 (Queue &amp; Workflow)
  provides the stored procedures that govern job transitions between queues.</p>

  <table>
    <thead><tr><th>#</th><th>Queue</th><th>Purpose</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Intake</td><td>New DME orders received; initial eligibility check</td></tr>
      <tr><td>2</td><td>Benefits</td><td>Insurance benefit verification in progress</td></tr>
      <tr><td>3</td><td>Auth</td><td>Prior authorisation requested or under review</td></tr>
      <tr><td>4</td><td>Pending</td><td>Awaiting patient or clinical information</td></tr>
      <tr><td>5</td><td>Shipping</td><td>Order approved; equipment dispatch in progress</td></tr>
      <tr><td>6</td><td>Billing</td><td>Delivered; claim submitted to payer</td></tr>
      <tr><td>7</td><td>Re-Bill</td><td>Claim denied or adjusted; re-submission in progress</td></tr>
      <tr><td>8</td><td>EDF</td><td>Equipment Delivery Form outstanding — compliance hold</td></tr>
      <tr><td>9</td><td>Collections</td><td>Overdue balance; active collector follow-up</td></tr>
      <tr><td>10</td><td>Yes/No</td><td>PA Status / CMN / EDF compliance gates pending</td></tr>
      <tr><td>11</td><td>Inactive</td><td>Order on hold; no active work</td></tr>
      <tr><td>12</td><td>Cancelled</td><td>Order cancelled; record retained for audit</td></tr>
      <tr><td>13</td><td>Collector Actions</td><td>Collector daily-action tracking and totals</td></tr>
    </tbody>
  </table>

  <h2>A.3 &nbsp; Companion Documents</h2>
  <ul>
    <li><strong>STP-API-MCP Coverage Matrix</strong> (A3 landscape PDF) —
    All {TOTAL_STPS} stored procedures with full parameter lists, return schemas, API endpoint mappings,
    and MCP tool definitions. Provided as a separate deliverable.</li>
    <li><strong>Statement of Work</strong> — Issued within 5 business days of approval.
    Covers phased timeline, effort hours, and fees.</li>
  </ul>
</div>
"""


# ─── Build HTML ───────────────────────────────────────────────────────────────

def build_html() -> str:
    logo = logo_src()
    sections = (
        cover(logo)
        + exec_summary()
        + current_state()
        + architecture()
        + domain_matrix()
        + detailed_capability()
        + security_section()
        + what_gets_built()
        + delivery_plan()
        + next_steps()
        + approval_page()
        + appendix()
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>OXPLive MCP Server — Client Approval Report</title>
<style>{CSS}</style>
</head>
<body>
{sections}
</body>
</html>"""


# ─── Render PDF via Playwright ────────────────────────────────────────────────

def render_pdf(html_path: Path, out_path: Path) -> None:
    print("Rendering PDF via Playwright …")
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page()
        page.goto(html_path.as_uri(), wait_until="networkidle")
        page.pdf(
            path=str(out_path),
            format="A4",
            landscape=False,
            print_background=True,
            margin={"top": "20mm", "bottom": "22mm", "left": "18mm", "right": "18mm"},
        )
        browser.close()
    size_kb = out_path.stat().st_size // 1024
    print(f"PDF: {out_path}  ({size_kb} KB)")


def screenshot_cover(html_path: Path, out_path: Path) -> None:
    print("Screenshotting cover page …")
    ss = out_path.with_name("_cover-check.png")
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 794, "height": 1123})
        page.goto(html_path.as_uri(), wait_until="networkidle")
        page.screenshot(path=str(ss), full_page=False)
        browser.close()
    print(f"Cover screenshot: {ss}")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    html = build_html()
    OUT_HTML.write_text(html, encoding="utf-8")
    print(f"HTML: {OUT_HTML}")

    render_pdf(OUT_HTML, OUT_PDF)
    screenshot_cover(OUT_HTML, OUT_PDF)

    print(f"\nDone. Review _cover-check.png then send {OUT_PDF.name} to ORX for approval.")


if __name__ == "__main__":
    main()
