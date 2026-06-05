"""
Build OXPLiveNG MCP Server — Client Approval Report (PDF).
Run: py -3.12 build-approval-report-ng.py
Output: OXPLiveNG-MCP-Server-Approval-Report.pdf
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64

OUT_DIR = Path(__file__).parent
OUT_PDF = OUT_DIR / "OXPLiveNG-MCP-Server-Approval-Report.pdf"
OUT_HTML = OUT_DIR / "_approval-report-ng.html"

LOGO_PATH = Path(r"C:\VSCode\tech-branding\tech-branding\assets\logos\Technijian Logo - white text.png")

# ─── Brand ───────────────────────────────────────────────────────────────────
B = {
    "blue":   "#006DB6",
    "orange": "#F67D4B",
    "teal":   "#1EAAC8",
    "dark":   "#1A2B3C",
    "light":  "#F5F7FA",
    "border": "#D0D7E2",
    "text":   "#2D3748",
    "muted":  "#718096",
    "code":   "#EEF2F7",
    "green":  "#276749",
    "gbg":    "#C6F6D5",
    "obg":    "#FEEBC8",
    "gray":   "#4A5568",
    "grybg":  "#E2E8F0",
}

# ─── Data ────────────────────────────────────────────────────────────────────
DOMAINS = [
    (1,  "Claims",                       25, 25, 25, "Claims dashboard, AR summary, transaction management, orphan matching, duplicate detection"),
    (2,  "Patient / Account",            25, 25, 25, "Patient demographics, insurance, medical info, service lines, guarantor, health plans, documents"),
    (3,  "Billing Dashboard",             3,  3,  3, "Billing job queue, patient info panel, document file-type resolution"),
    (4,  "Admin & Security",             22, 22, 22, "Roles, permissions, users, organizations, groups, IP whitelist, billing codes"),
    (5,  "Authorization",                 2,  2,  2, "PA request pre-population — patient and order details for prior authorization forms"),
    (6,  "Documents (Core)",              1,  1,  1, "System-wide document list for document management and attachment workflows"),
    (7,  "Groups / Risk Payers",          5,  5,  5, "Master groups, risk payer group configuration and assignments"),
    (8,  "Orders",                        5,  5,  5, "Order listing, detail, fulfillment tracking, cancellation, authorization status"),
    (9,  "Reconciliation",                8,  8,  8, "ERA/EOB payment vouchers, orphan matching, monthly close reporting, bulk ERA import"),
    (10, "Warehouse / Inventory",         8,  8,  8, "Warehouse locations, product catalog, stock management, inter-location transfers"),
    (11, "Document Storage (AWS/S3)",     3,  3,  3, "Patient file metadata after S3 upload — create, update, delete document records"),
]
TOTAL_STPS      = sum(d[2] for d in DOMAINS)
TOTAL_ENDPOINTS = sum(d[3] for d in DOMAINS)
TOTAL_TOOLS     = sum(d[4] for d in DOMAINS)

STPS = [
    # Domain 1 — Claims
    (1,"1.1","api.usp_Claim_Dashboard_Get","READ","GET","/api/v1/claims/dashboard","Paged claims dashboard with filtering by patient name, claim number, date range, status, or payer. Returns header rows with payer, status, and financial summary."),
    (1,"1.2","api.usp_AR_Summary_Get","READ","GET","/api/v1/claims/ar-summary","Rolled-up accounts receivable summary showing outstanding balances by payer and aging bucket. Core AR follow-up and denial management tool."),
    (1,"1.3","api.usp_AR_SummaryByPayerGroup_Get","READ","GET","/api/v1/claims/ar-summary/by-payer-group","AR Summary filtered to a specific Risk Payer Group. Lets managers analyze collections performance against a contracted group."),
    (1,"1.4","api.usp_ClaimTransaction_Unreconciled_List","READ","GET","/api/v1/claims/transactions/unreconciled","ERA/payment transactions imported but not yet matched to a claim service line. Used in reconciliation to identify open transactions."),
    (1,"1.5","api.usp_ClaimTransaction_Reconciled_List","READ","GET","/api/v1/claims/transactions/reconciled","Payment transactions already matched to claim service lines. Used for audit trails, dispute resolution, and confirming payment posting accuracy."),
    (1,"1.6","api.usp_ClaimTransaction_ForService_List","READ","GET","/api/v1/claims/services/{serviceId}/transactions","All transactions (reconciled and unreconciled) attached to a single claim service line. Shown in service-level detail panel."),
    (1,"1.7","crud.usp_ClaimTransaction_Update","WRITE","PUT","/api/v1/claims/transactions/{id}","Updates an existing claim transaction record — corrects payment amount, check number, or reconciliation status after payer correction."),
    (1,"1.8","crud.usp_ClaimTransaction_Delete","WRITE","DELETE","/api/v1/claims/transactions/{id}","Soft-deletes a claim transaction posted in error — duplicate ERA import, wrong payer, or test transaction."),
    (1,"1.9","api.usp_Claim_ServiceList_ByClaimId","READ","GET","/api/v1/claims/{claimId}/services","All service lines on a claim — procedure codes, modifiers, billed/paid amounts, and status per line."),
    (1,"1.10","api.usp_Claim_ServiceList_ByJobId","READ","GET","/api/v1/claims/services/by-job/{jobId}","Service lines linked to a Job (order). Pre-populates service line details from the job during billing workflow."),
    (1,"1.11","api.usp_Claim_ServiceList_ByClaimRef","READ","GET","/api/v1/claims/services/by-ref/{claimRef}","Service lines by external claim reference number (payer or clearinghouse). Used in ERA reconciliation."),
    (1,"1.12","api.usp_OrphanTransaction_List","READ","GET","/api/v1/claims/orphan-transactions","Unmatched ERA payment transactions not linked to any claim service line. Resolution requires manual matching or write-off."),
    (1,"1.13","api.usp_OrphanTransaction_MismatchFiltered_List","READ","GET","/api/v1/claims/orphan-transactions/mismatch","Orphan transactions where paying payer doesn't match claim payer — indicates routing errors or cross-payer postings."),
    (1,"1.14","crud.usp_OrphanTransaction_Delete","WRITE","DELETE","/api/v1/claims/orphan-transactions/{id}","Removes an orphan transaction that is a duplicate, test record, or otherwise invalid. Operator role or higher required."),
    (1,"1.15","crud.usp_OrphanTransaction_Process","WRITE","POST","/api/v1/claims/orphan-transactions/{id}/process","Matches an orphan transaction to a claim service line and posts payment atomically. Inserts ClaimTransaction and deactivates orphan."),
    (1,"1.16","crud.usp_OrphanTransaction_Transfer","WRITE","POST","/api/v1/claims/orphan-transactions/{id}/transfer","Transfers an orphan transaction to a different claim when ERA payment was posted under the wrong claim number."),
    (1,"1.17","crud.usp_Claim_WithServices_Create","WRITE","POST","/api/v1/claims","Creates a new claim header with one or more service lines in an atomic operation. Used in Billing for new claims not from orders."),
    (1,"1.18","api.usp_Claim_LevelData_ByClaimRef","READ","GET","/api/v1/claims/by-ref/{claimRef}/detail","Claim-level header data (patient, payer, dates, provider) for Claims Dashboard detail panel by claim reference."),
    (1,"1.19","api.usp_ClaimService_SummaryById","READ","GET","/api/v1/claims/services/{claimServiceId}/summary","Single service line summary with aggregated payment, adjustment, and balance figures. Shown in service-level detail panel."),
    (1,"1.20","api.usp_Claim_PayerList_Get","READ","GET","/api/v1/claims/payers","List of payers with Risk Payer Group names. Populates payer filter dropdowns and group-based reporting."),
    (1,"1.21","crud.usp_Claim_PayerGroup_Upsert","WRITE","POST","/api/v1/claims/payers/group","Creates or updates payer-to-group mapping. Assigns payers to Risk Payer Groups for AR reporting and filtering."),
    (1,"1.22","crud.usp_Claim_EditAndNote_Save","WRITE","POST","/api/v1/claims/{claimId}/edit","Saves edits to claim header (user, provider, risk payer, status, submit date) and appends status note atomically."),
    (1,"1.23","api.usp_Claim_OpenList_Get","READ","GET","/api/v1/claims/open","All open (unresolved, not closed/paid-in-full) claims. Gives billing staff an actionable queue."),
    (1,"1.24","api.usp_Claim_History_List","READ","GET","/api/v1/claims/{claimId}/history","Full audit and note history for a claim — all status changes, notes, and system events in chronological order."),
    (1,"1.25","api.usp_Claim_Duplicates_List","READ","GET","/api/v1/claims/duplicates","Claims identified as potential duplicates — same patient, payer, service date, and procedure code submitted multiple times. Used by billing QA."),
    # Domain 2 — Patient
    (2,"2.1","api.usp_Patient_Search","READ","GET","/api/v1/patients/search","Patient search by name, DOB, phone, address, or health plan. Returns matching records with demographic and insurance snapshot."),
    (2,"2.2","api.usp_Patient_Detail_GetById","READ","GET","/api/v1/patients/{patientJobId}","Full patient record with all demographic fields and primary health plan. Used on patient detail and edit pages."),
    (2,"2.3","crud.usp_Patient_Insert","WRITE","POST","/api/v1/patients","Creates new patient record (PatientJob) and optionally links to group. Foundational create for new patient intake."),
    (2,"2.4","crud.usp_Patient_Update","WRITE","PUT","/api/v1/patients/{patientJobId}","Updates existing patient's demographic and insurance information from the Patient Edit form."),
    (2,"2.5","crud.usp_Patient_SoftDelete","WRITE","DELETE","/api/v1/patients/{patientJobId}","Soft-deletes patient (sets PStatus=true). Removes from active lists while preserving all historical claims for compliance."),
    (2,"2.6","api.usp_Patient_MedicalInfo_GetByJobId","READ","GET","/api/v1/patients/{jobId}/medical-info","Injury details, body parts, and diagnosis codes for patient job. Drives the medical info section of Billing Dashboard."),
    (2,"2.7","crud.usp_Patient_MedicalInfo_Update","WRITE","PUT","/api/v1/patients/medical-info/{id}","Updates medical info fields (injury date, body part, diagnosis). Called from Billing Dashboard medical info edit panel."),
    (2,"2.8","api.usp_Patient_InsuranceInfo_GetByJobId","READ","GET","/api/v1/patients/{jobId}/insurance","Patient's insurance records (primary, secondary, tertiary) — payer name, member ID, group number, copay/deductible."),
    (2,"2.9","crud.usp_Patient_InsuranceInfo_Update","WRITE","PUT","/api/v1/patients/insurance/{id}","Updates insurance record when patient's payer, member ID, or coverage dates change. Critical for clean claim submission."),
    (2,"2.10","api.usp_Patient_JobServiceLine_GetByJobId","READ","GET","/api/v1/patients/{jobId}/service-lines","Product/service lines on patient job — HCPCS codes, modifiers, quantities, and prices that drive claim creation."),
    (2,"2.11","crud.usp_Patient_JobServiceLine_Upsert","WRITE","POST","/api/v1/patients/{jobId}/service-lines","Creates or updates a service line on patient job when billing staff adds or corrects a procedure before claim submission."),
    (2,"2.12","crud.usp_Patient_JobServiceLine_Delete","WRITE","DELETE","/api/v1/patients/service-lines/{id}","Soft-deletes a service line from patient job when billing staff removes a procedure entered in error."),
    (2,"2.13","api.usp_Patient_GuarantorInfo_GetByJobId","READ","GET","/api/v1/patients/{jobId}/guarantor","Guarantor (responsible party) information — name, relationship, contact, address. Required for patient-responsibility billing."),
    (2,"2.14","crud.usp_Patient_GuarantorInfo_Update","WRITE","PUT","/api/v1/patients/guarantor/{id}","Updates guarantor contact and demographic info when responsible party changes (e.g. patient turns 18, divorce)."),
    (2,"2.15","api.usp_Patient_HealthPlan_GetById","READ","GET","/api/v1/patients/{patientJobId}/health-plans","All health plan records for patient — plan name, effective/term dates, copay, deductible. Drives the health plan section."),
    (2,"2.16","crud.usp_Patient_HealthPlan_Insert","WRITE","POST","/api/v1/patients/{patientJobId}/health-plans","Adds one or more health plan records during new patient intake or plan change workflow."),
    (2,"2.17","crud.usp_Patient_HealthPlan_Delete","WRITE","DELETE","/api/v1/patients/health-plans/{healthPlanId}","Deletes a health plan record when added in error or patient terminates a secondary plan."),
    (2,"2.18","api.usp_Patient_Claim_InfoById","READ","GET","/api/v1/patients/{patientJobId}/claims/{orderId}","Patient's claim information for a specific order — claim header, payer info, and attached product/procedure details."),
    (2,"2.19","api.usp_Patient_OrderHistory_List","READ","GET","/api/v1/patients/{patientJobId}/orders","Order history — all orders, statuses, products, authorization info, and assigned staff. Shown in Patient Orders tab."),
    (2,"2.20","api.usp_Patient_ClaimHistory_List","READ","GET","/api/v1/patients/{patientJobId}/claim-history","Claim history for patient — all submitted claims, statuses, and dates. Shows the patient's complete claim lifecycle."),
    (2,"2.21","api.usp_Patient_Eligibility_GetByServiceType","READ","GET","/api/v1/patients/{patientJobId}/eligibility/plan","Health plan record for a specific service type. Pre-populates eligibility request form."),
    (2,"2.22","api.usp_Patient_Documents_List","READ","GET","/api/v1/patients/{patientJobId}/documents","All uploaded documents for patient — EOBs, authorization letters, insurance cards, referrals. Used in Patient Documents tab."),
    (2,"2.23","api.usp_Patient_NotificationPayMetrics_Get","READ","GET","/api/v1/patients/notification/pay-metrics","Payer payment metrics — average/max first and last payment days, 15 and 22-day payment sums. Used for notification thresholds."),
    (2,"2.24","api.usp_Dropdown_References","READ","GET","/api/v1/dropdowns/{type}","Nine type-ahead/select dropdown endpoints: Practitioner, Physician, Stat, Diagnosis, Modifier, AtRiskPayer, HCPCS, HealthPlan."),
    (2,"2.25","crud.usp_Claim_FromBilling_Insert","WRITE","POST","/api/v1/billing/claims/from-job","Creates a claim from a billing job — the core action when billing staff submits a claim. Bridges job/order world to claims world."),
    # Domain 3 — Billing
    (3,"3.1","api.usp_Billing_Dashboard_Get","READ","GET","/api/v1/billing/dashboard","Billing Dashboard grid — primary workspace for billing staff to view all patient jobs requiring claim preparation, by status."),
    (3,"3.2","api.usp_Billing_PatientInfo_GetByJobId","READ","GET","/api/v1/billing/{jobId}/patient-info","Patient demographic snapshot for job shown in Billing Dashboard detail panel. Pre-populates billing form header."),
    (3,"3.3","api.usp_Billing_FileTypeName_GetByFileId","READ","GET","/api/v1/billing/file-types/{fileId}","Resolves file type ID to a human-readable label (e.g. 'Authorization Letter', 'EOB'). Used in document chip rendering."),
    # Domain 4 — Admin
    (4,"4.1","api.usp_Admin_Role_List","READ","GET","/api/v1/admin/roles","All application roles (excluding Super Admin). Drives Role Management grid in Admin portal."),
    (4,"4.2","crud.usp_Admin_Role_CreatePermission","WRITE","POST","/api/v1/admin/roles/{roleId}/permissions","Creates permission assignments for role — maps role to page permissions (read/create/edit/delete flags per page)."),
    (4,"4.3","crud.usp_Admin_Role_Delete","WRITE","DELETE","/api/v1/admin/roles/{roleId}","Deletes an application role. Requires no users currently assigned to it."),
    (4,"4.4","api.usp_Admin_Role_PermissionList","READ","GET","/api/v1/admin/roles/{roleId}/permissions","Full permission matrix for role — each application page with current read/create/edit/delete flags."),
    (4,"4.5","crud.usp_Admin_Role_Update","WRITE","PUT","/api/v1/admin/roles/{roleId}","Updates role's name, user type, and permission assignments atomically from the Edit Role save action."),
    (4,"4.6","api.usp_Admin_User_GetByAspNetUserId","READ","GET","/api/v1/admin/users/by-aspnet-id/{id}","User profile — name, email, role, group, last login, org. Core user lookup for Admin User Management grid."),
    (4,"4.7","crud.usp_Admin_User_ProfileUpdate","WRITE","PUT","/api/v1/admin/users/{aspNetUserId}/profile","Updates user profile — name, phone, title, org assignment. Called from Admin User Edit or user's own profile page."),
    (4,"4.8","crud.usp_Admin_User_EmailUpdate","WRITE","PUT","/api/v1/admin/users/{userId}/email","Updates user's email address. Separate from profile update because email change requires ASP.NET Identity sync."),
    (4,"4.9","crud.usp_Admin_User_RoleUpdate","WRITE","PUT","/api/v1/admin/users/{userId}/role","Changes user's assigned role when promoting, demoting, or transferring a user in Admin User Management."),
    (4,"4.10","api.usp_Admin_User_Roles_List","READ","GET","/api/v1/admin/roles/assignable","All assignable roles for user assignment dropdown. Used in Admin User Create and Edit forms."),
    (4,"4.11","api.usp_Admin_SecurityQuestion_GetByEmail","READ","GET","/api/v1/admin/users/security-questions","Security questions configured for user by email. Used in Forgot Password / account recovery flow."),
    (4,"4.12","api.usp_Admin_Organization_List","READ","GET","/api/v1/admin/organizations","All organizations configured in system. Used in Admin Organization Management grid and user/group assignment dropdowns."),
    (4,"4.13","crud.usp_Admin_Organization_Upsert","WRITE","POST","/api/v1/admin/organizations","Creates or updates organization record from the Admin Organization form."),
    (4,"4.14","api.usp_Admin_Group_List","READ","GET","/api/v1/admin/groups","All user groups with filter support. Groups are the primary unit for assigning patients, orders, and permissions."),
    (4,"4.15","crud.usp_Admin_Group_Upsert","WRITE","POST","/api/v1/admin/groups","Creates or updates a group from the Admin Group Create and Edit forms."),
    (4,"4.16","crud.usp_Admin_Group_Delete","WRITE","DELETE","/api/v1/admin/groups/{groupId}","Permanently deletes group and all its member associations when the group is no longer needed."),
    (4,"4.17","crud.usp_Admin_Group_MemberInsert","WRITE","POST","/api/v1/admin/groups/{groupId}/members","Adds a user to a group when assigning new staff for patient/order access."),
    (4,"4.18","api.usp_Admin_WhitelistIP_List","READ","GET","/api/v1/admin/security/whitelist-ips","All whitelisted IP addresses allowed to access the system. Used in Admin Security IP Whitelist management page."),
    (4,"4.19","crud.usp_Admin_WhitelistIP_Upsert","WRITE","POST","/api/v1/admin/security/whitelist-ips","Adds or updates a whitelisted IP when adding an office location or updating a description."),
    (4,"4.20","crud.usp_Admin_WhitelistIP_Delete","WRITE","DELETE","/api/v1/admin/security/whitelist-ips/{id}","Removes IP from whitelist when an office location closes or IP range changes."),
    (4,"4.21","api.usp_Admin_BillingCode_List","READ","GET","/api/v1/admin/billing-codes","All billing codes configured in the system. Used in Admin Billing Code Management grid."),
    (4,"4.22","crud.usp_Admin_BillingCode_Delete","WRITE","DELETE","/api/v1/admin/billing-codes/{id}","Removes a billing code when it is retired or entered in error."),
    # Domain 5 — Authorization
    (5,"5.1","api.usp_Authorization_PatientDetails_Get","READ","GET","/api/v1/authorization/patient/{patientJobId}/details","Patient and insurance details needed to complete an order authorization request form. Pre-populates PA request to payers."),
    (5,"5.2","api.usp_Authorization_OrderDetails_Get","READ","GET","/api/v1/authorization/order/{orderId}/details","Order details for PA request — products, HCPCS codes, quantities, physician info. Complete prior authorization dataset."),
    # Domain 6 — Documents
    (6,"6.1","api.usp_Document_List","READ","GET","/api/v1/documents","All documents accessible to requesting user. Used on Documents management page and document attachment workflows."),
    # Domain 7 — Groups / Risk Payers
    (7,"7.1","api.usp_Group_MasterGroup_List","READ","GET","/api/v1/groups/master","All master groups — top-level organizational groupings containing sub-groups and users."),
    (7,"7.2","crud.usp_Group_MasterGroup_Upsert","WRITE","POST","/api/v1/groups/master","Creates or updates a master group from the Master Group Create and Edit forms."),
    (7,"7.3","crud.usp_Group_MasterGroup_Delete","WRITE","DELETE","/api/v1/groups/master/{id}","Deletes a master group from the Master Group Management admin page."),
    (7,"7.4","api.usp_Group_RiskPayer_GetByGroupId","READ","GET","/api/v1/groups/{groupId}/risk-payers","List of risk payers assigned to a group. Used in Group Risk Payer configuration page."),
    (7,"7.5","crud.usp_Group_RiskPayer_Save","WRITE","PUT","/api/v1/groups/{groupId}/risk-payers","Replaces full risk payer list for group (delete existing, insert new). Called when administrator updates tracked payers."),
    # Domain 8 — Orders
    (8,"8.1","api.usp_Order_List","READ","GET","/api/v1/orders","All orders in system. Used by Order Management grid for warehouse staff, coordinators, and billing staff."),
    (8,"8.2","api.usp_Order_GetById","READ","GET","/api/v1/orders/{orderId}","Full order detail including line items, authorization, diagnosis, and documents. Used in order detail views."),
    (8,"8.3","crud.usp_Order_DispatchReceived_Update","WRITE","PUT","/api/v1/orders/{orderId}/fulfillment-dates","Updates dispatch and/or received dates on order. Core warehouse fulfillment tracking action."),
    (8,"8.4","crud.usp_Order_Cancel","WRITE","POST","/api/v1/orders/{orderId}/cancel","Cancels order — sets status to Cancelled and triggers downstream notifications when patient cancels or authorization is denied."),
    (8,"8.5","crud.usp_Order_ProductAuthStatus_Update","WRITE","PUT","/api/v1/orders/items/{orderItemId}/authorization","Updates authorization status of a product line item when authorization response is received from payer."),
    # Domain 9 — Reconciliation
    (9,"9.1","crud.usp_Reconciliation_Payment_Add","WRITE","POST","/api/v1/reconciliation/payments","Creates a new reconciliation payment voucher — records payer payment (check/EFT) for matching against claim transactions."),
    (9,"9.2","api.usp_Reconciliation_Payment_GetById","READ","GET","/api/v1/reconciliation/payments/{paymentId}","Single reconciliation payment voucher by ID including matched/unmatched transaction totals."),
    (9,"9.3","api.usp_Reconciliation_OpenPayments_List","READ","GET","/api/v1/reconciliation/payments/open","All open (unmatched/partially matched) reconciliation payment vouchers. Main queue for Reconciliation workflow."),
    (9,"9.4","api.usp_Reconciliation_Transactions_ByServiceId","READ","GET","/api/v1/reconciliation/services/{serviceId}/unreconciled","Unreconciled transactions for a specific claim service line. Shows what payments are pending matching."),
    (9,"9.5","api.usp_Reconciliation_Transactions_ByPaymentId","READ","GET","/api/v1/reconciliation/payments/{paymentId}/transactions","All claim transactions matched to a specific payment voucher. Shows which claims the payment batch applied to."),
    (9,"9.6","api.usp_Reconciliation_VoucherSummary_ByMonth","READ","GET","/api/v1/reconciliation/summary/monthly","Monthly summary of payment vouchers — total received, matched, and unmatched amounts. Used for month-end close reporting."),
    (9,"9.7","api.usp_Reconciliation_Vouchers_ByDateRange","READ","GET","/api/v1/reconciliation/vouchers","All payment vouchers within a date range. Used in Reconciliation history view and audit reporting."),
    (9,"9.8","crud.usp_Reconciliation_BulkVoucher_Insert","WRITE","POST","/api/v1/reconciliation/vouchers/bulk","Bulk-inserts multiple payment vouchers in one call when importing an ERA 835 file with payments for multiple claims/payers."),
    # Domain 10 — Warehouse
    (10,"10.1","api.usp_Warehouse_Location_List","READ","GET","/api/v1/warehouse/locations","All warehouse locations. Used in Warehouse Management grid and product inventory management."),
    (10,"10.2","crud.usp_Warehouse_Location_Upsert","WRITE","POST","/api/v1/warehouse/locations","Creates a new warehouse location when a new physical storage facility or area is added."),
    (10,"10.3","api.usp_Product_List","READ","GET","/api/v1/warehouse/products","Product catalog with paging, sorting, and search. Used in Warehouse Product Management grid and order item selection."),
    (10,"10.4","api.usp_Product_GetById","READ","GET","/api/v1/warehouse/products/{productId}","Full product details including serial number and stock by warehouse location. Used in Product Detail view."),
    (10,"10.5","crud.usp_Product_Upsert","WRITE","POST","/api/v1/warehouse/products","Creates or updates a product in catalog from the Warehouse Product Create and Edit forms."),
    (10,"10.6","crud.usp_Product_Stock_Upsert","WRITE","POST","/api/v1/warehouse/products/{productId}/stock","Creates or updates stock record linking product to warehouse location with quantity and optional serial number."),
    (10,"10.7","crud.usp_Product_Stock_Transfer","WRITE","POST","/api/v1/warehouse/products/{productId}/stock/transfer","Moves product quantity from one warehouse location to another for inventory redistribution."),
    (10,"10.8","api.usp_Product_QuantityByLocation_Get","READ","GET","/api/v1/warehouse/products/{productId}/stock/by-location","Stock quantities for product broken down by warehouse location. Used in order fulfillment location selection."),
    # Domain 11 — Document Storage (AWS/S3)
    (11,"11.1","crud.usp_Document_PatientFile_Save","WRITE","POST","/api/v1/documents","Creates document metadata record after S3 upload — records patient link, file type, and S3 key for document discovery."),
    (11,"11.2","crud.usp_Document_PatientFile_Update","WRITE","PUT","/api/v1/documents/{documentId}","Updates document metadata — typically rename, re-categorization, or description update after upload."),
    (11,"11.3","crud.usp_Document_PatientFile_Delete","WRITE","DELETE","/api/v1/documents/{documentId}","Removes document metadata record, paired with S3 object deletion handled in the application layer."),
]

DOMAIN_NAMES = {d[0]: d[1] for d in DOMAINS}

# ─── CSS ─────────────────────────────────────────────────────────────────────
CSS = f"""
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
*, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 9.5pt;
  color: {B['text']};
  line-height: 1.55;
  background: #fff;
}}

/* ── Cover ── */
.cover {{
  width: 100%; min-height: 100vh;
  display: flex; flex-direction: column;
  background: {B['dark']};
  padding: 56px 64px 48px;
  page-break-after: always;
  overflow: hidden;
}}
.cover-logo {{ font-size: 11pt; font-weight: 700; letter-spacing: 1.5px; color: {B['orange']}; margin-bottom: 56px; }}
.cover-logo img {{ height: 38px; display: block; }}
.cover h1 {{ font-size: 28pt; font-weight: 700; color: #fff; line-height: 1.2; border-bottom: none !important; }}
.cover .sub {{ font-size: 12pt; color: {B['teal']}; font-weight: 600; margin-top: 10px; }}
.cover-divider {{ width: 60px; height: 3px; background: {B['orange']}; margin: 28px 0; border-radius: 2px; }}
.cover-meta-table {{ border: none !important; background: transparent; width: auto; margin-top: 8px; }}
.cover-meta-table td {{ border: none !important; padding: 4px 40px 4px 0; background: transparent !important; color: #aabbcc; font-size: 9pt; }}
.cover-meta-table tr:nth-child(even) td {{ background: transparent !important; }}
.cover-meta-table strong {{ color: #fff; }}
.cover-kpis {{ display: flex; gap: 20px; margin-top: 48px; flex-wrap: wrap; }}
.kpi {{ background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,.1);
        border-radius: 10px; padding: 18px 28px; text-align: center; min-width: 100px; }}
.kpi .num {{ font-size: 26pt; font-weight: 700; color: {B['teal']}; line-height: 1; }}
.kpi .lbl {{ font-size: 7.5pt; color: #8899aa; margin-top: 6px; text-transform: uppercase; letter-spacing: 0.5px; }}
.cover-companion {{
  margin-top: 40px; padding: 18px 24px;
  background: rgba(0,109,182,.15); border-left: 3px solid {B['blue']};
  border-radius: 0 6px 6px 0; max-width: 560px;
}}
.cover-companion p {{ color: #c8d8e8; font-size: 8.5pt; line-height: 1.6; }}
.cover-companion strong {{ color: #fff; }}
.cover-footer {{ margin-top: auto; padding-top: 32px; border-top: 1px solid rgba(255,255,255,.08); display: flex; justify-content: space-between; align-items: center; }}
.cover-footer span {{ color: #667788; font-size: 7.5pt; }}

/* ── Sections ── */
.page {{ page-break-before: always; padding: 48px 64px 40px; min-height: 100vh; display: flex; flex-direction: column; }}
.page-content {{ flex: 1; }}
h1 {{ font-size: 15pt; font-weight: 700; color: {B['blue']}; border-bottom: 2.5px solid {B['blue']};
      padding-bottom: 8px; margin-bottom: 20px; }}
.section-num {{ color: {B['orange']}; margin-right: 8px; }}
h2 {{ font-size: 11pt; font-weight: 600; color: {B['dark']}; margin: 24px 0 8px; }}
h3 {{ font-size: 10pt; font-weight: 600; color: {B['blue']}; margin: 16px 0 6px; }}
p {{ margin-bottom: 10px; }}
ul {{ margin: 6px 0 10px 20px; }}
li {{ margin-bottom: 4px; }}

/* ── Tables ── */
table {{ border-collapse: collapse; width: 100%; margin: 8px 0 16px; font-size: 8.5pt; }}
th {{ background: {B['blue']}; color: #fff; padding: 7px 10px; text-align: left;
     font-weight: 600; border: 1px solid {B['blue']}; }}
td {{ padding: 6px 10px; border: 1px solid {B['border']}; vertical-align: top; }}
tr:nth-child(even) td {{ background: {B['light']}; }}
tr:hover td {{ background: #e4eff9; }}

/* ── Domain header bars ── */
.domain-header {{
  display: flex; align-items: center; gap: 14px;
  margin: 28px 0 8px;
  padding: 12px 16px;
  background: {B['light']}; border-left: 4px solid {B['blue']};
  border-radius: 0 6px 6px 0;
}}
.domain-num {{ font-size: 11pt; font-weight: 700; color: {B['blue']}; min-width: 32px; }}
.domain-title {{ font-size: 10.5pt; font-weight: 600; color: {B['dark']}; }}
.domain-count {{ margin-left: auto; font-size: 8pt; color: {B['muted']}; }}

/* ── Badges ── */
.badge {{
  display: inline-block; padding: 2px 8px; border-radius: 4px;
  font-size: 7.5pt; font-weight: 700; letter-spacing: 0.3px;
}}
.badge-read  {{ background: {B['gbg']}; color: {B['green']}; }}
.badge-write {{ background: {B['obg']}; color: #B35210; }}
.badge-int   {{ background: {B['grybg']}; color: {B['gray']}; }}

/* ── Architecture diagram ── */
.arch-box {{
  font-family: 'Consolas', monospace; font-size: 8pt;
  background: {B['dark']}; color: #c8d8e8;
  padding: 24px 28px; border-radius: 8px; line-height: 1.7;
  margin: 12px 0 20px;
}}
.arch-label {{ color: {B['teal']}; font-weight: 700; }}
.arch-arrow {{ color: {B['orange']}; }}

/* ── KPI row ── */
.kpi-row {{ display: flex; gap: 16px; margin: 16px 0; }}
.kpi-card {{
  flex: 1; padding: 16px 20px; border-radius: 8px;
  background: {B['light']}; border: 1px solid {B['border']};
  text-align: center;
}}
.kpi-card .num {{ font-size: 20pt; font-weight: 700; color: {B['blue']}; line-height: 1; }}
.kpi-card .lbl {{ font-size: 7.5pt; color: {B['muted']}; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.4px; }}

/* ── Callout ── */
.callout {{
  padding: 14px 18px; border-radius: 6px; margin: 12px 0;
  border-left: 4px solid {B['teal']}; background: #EBF8FF;
}}
.callout p {{ margin: 0; color: {B['dark']}; font-size: 9pt; }}
.callout strong {{ color: {B['blue']}; }}

/* ── Signature block ── */
.sig-block {{
  border: 1px solid {B['border']}; border-radius: 8px;
  padding: 24px 28px; margin: 16px 0;
}}
.sig-line {{ border-bottom: 1px solid {B['border']}; margin: 24px 0 6px; }}
.sig-label {{ font-size: 8pt; color: {B['muted']}; }}

/* ── Print ── */
@media print {{
  @page {{ size: letter portrait; margin: 0; }}
}}
"""

# ─── Logo ────────────────────────────────────────────────────────────────────
def logo_tag() -> str:
    if LOGO_PATH.exists():
        data = base64.b64encode(LOGO_PATH.read_bytes()).decode()
        return f'<img src="data:image/png;base64,{data}" class="cover-logo" />'
    return '<span class="cover-logo">TECHNIJIAN</span>'


# ─── Section helpers ─────────────────────────────────────────────────────────
def section(num: str, title: str, content: str) -> str:
    return f"""<div class="page">
<div class="page-content">
<h1><span class="section-num">{num}</span>{title}</h1>
{content}
</div></div>"""


def kpi_row(items: list[tuple]) -> str:
    cards = "".join(
        f'<div class="kpi-card"><div class="num">{v}</div><div class="lbl">{l}</div></div>'
        for v, l in items
    )
    return f'<div class="kpi-row">{cards}</div>'


def badge(rw: str) -> str:
    if rw == "READ":  return '<span class="badge badge-read">READ</span>'
    if rw == "WRITE": return '<span class="badge badge-write">WRITE</span>'
    return '<span class="badge badge-int">INT</span>'


# ─── Cover ───────────────────────────────────────────────────────────────────
def cover() -> str:
    logo = logo_tag()
    return f"""<div class="cover">
  {logo}
  <div>
    <h1>OXPLiveNG Modernization</h1>
    <div class="sub">MCP Server — Client Approval Report</div>
    <div class="cover-divider"></div>
    <table class="cover-meta-table">
      <tr><td><strong>Client</strong></td><td>OrthoKinetix (ORX)</td></tr>
      <tr><td><strong>System</strong></td><td>OXPLiveNG Claims &amp; Billing Dashboard — Modernization to .NET 8 / React 18</td></tr>
      <tr><td><strong>Document</strong></td><td>MCP Server Architecture &amp; API Coverage — Client Approval</td></tr>
      <tr><td><strong>Date</strong></td><td>June 2026</td></tr>
      <tr><td><strong>Status</strong></td><td>Pending Client Approval — Phase B Deliverable</td></tr>
      <tr><td><strong>Classification</strong></td><td>Confidential — OrthoKinetix / Technijian Use Only</td></tr>
    </table>
  </div>
  <div class="cover-kpis">
    <div class="kpi"><div class="num">{TOTAL_STPS}</div><div class="lbl">Stored Procedures</div></div>
    <div class="kpi"><div class="num">{TOTAL_ENDPOINTS}</div><div class="lbl">API Endpoints</div></div>
    <div class="kpi"><div class="num">{TOTAL_TOOLS}</div><div class="lbl">MCP Tools</div></div>
    <div class="kpi"><div class="num">{len(DOMAINS)}</div><div class="lbl">Domains</div></div>
    <div class="kpi"><div class="num">4</div><div class="lbl">Architecture Layers</div></div>
    <div class="kpi"><div class="num">100%</div><div class="lbl">DB Call Coverage</div></div>
  </div>
  <div class="cover-companion">
    <p><strong>Companion documents</strong><br/>
    STP-API-MCP Catalog: <code>docs/oxpliveng-sp-api-mcp-catalog.md</code> (11-file series)<br/>
    System Specification: <code>docs/oxpliveng-mcp-server-specification.md</code></p>
  </div>
  <div class="cover-footer">
    <span>Technijian, Inc. — technology as a solution</span>
    <span>949.379.8499 &nbsp;|&nbsp; technijian.com</span>
  </div>
</div>"""


# ─── 01 Executive Summary ────────────────────────────────────────────────────
def exec_summary() -> str:
    body = f"""
<p>OXPLiveNG is OrthoKinetix's active claims and billing management system — a SQL Server database
with 457 tables, 31 business views, and 11.9 million rows in the Claims History table, currently
accessed by a legacy ASP.NET Web Forms application through Entity Framework 6 over raw tables and views
with no stored-procedure layer.</p>

<p>This document defines Technijian's plan to build a <strong>four-layer MCP infrastructure</strong>
on top of OXPLiveNG that exposes all claims, billing, patient, reconciliation, and warehouse operations
to AI agents (including Claude) through the Model Context Protocol — while enforcing strict
data-access governance, HIPAA compliance, and a single auditable data path.</p>

{kpi_row([(TOTAL_STPS, "Stored Procedures"), (TOTAL_ENDPOINTS, "API Endpoints"), (TOTAL_TOOLS, "MCP Tools"), (len(DOMAINS), "Business Domains")])}

<h2>What This Enables</h2>
<ul>
  <li><strong>AI-assisted claims management</strong> — Claude reviews open claims, identifies orphan transactions, and surfaces denial patterns across the AR summary</li>
  <li><strong>Automated reconciliation</strong> — AI matches ERA 835 payments to claim service lines, flags mismatches, and posts bulk vouchers</li>
  <li><strong>Billing workflow automation</strong> — AI navigates the Billing Dashboard queue, creates claims from jobs, and corrects service lines before submission</li>
  <li><strong>Patient data accuracy</strong> — AI reviews insurance coverage, guarantor info, and service lines before claim creation to reduce rejections</li>
  <li><strong>Admin & compliance operations</strong> — AI manages roles, IP whitelist, groups, and generates audit-ready activity reports</li>
</ul>

<div class="callout"><p>All AI access flows through the MCP server, which calls only the REST API, which calls only stored procedures.
<strong>No direct table access from any application layer — ever.</strong> Every call is audited with actor, target, and PHI-redacted details.</p></div>
"""
    return section("01", "Executive Summary", body)


# ─── 02 Current State Gap ────────────────────────────────────────────────────
def current_state() -> str:
    body = """
<p>A direct review of the OXPLiveNG codebase and live database (conducted May 2026) found the following gaps
between the current state and the target MCP-ready architecture:</p>

<table>
  <thead><tr><th>Finding</th><th>Evidence</th><th>Implication</th></tr></thead>
  <tbody>
    <tr><td><strong>No business stored-procedure layer</strong></td>
        <td>OXPLiveNG has only 6 stored procedures — all are SQL Server auto-generated diagram helpers (<code>sp_creatediagram</code> etc.)</td>
        <td>The entire SP encapsulation layer must be built from scratch (~107 SPs)</td></tr>
    <tr><td><strong>Direct EF6 / LINQ over tables</strong></td>
        <td>Data access uses Entity Framework 6 Database-First (<code>OXPModel.edmx</code>), primarily direct LINQ over entities</td>
        <td>Confirms the SP layer gap — every query bypasses the intended data contract</td></tr>
    <tr><td><strong>31 business views carry logic</strong></td>
        <td><code>vw_ClaimDashboard</code>, <code>vw_ARSummaryPRBalance</code>, <code>vw_ClaimTransaction</code>, 8 Notification views, 3 chetuSA views</td>
        <td>These are the primary read targets for Phase 1 SP wrapping — high-value, well-tested view logic</td></tr>
    <tr><td><strong>Credentials hardcoded</strong></td>
        <td>SQL login <code>chetuSA</code> with plaintext password in <code>Web.config:26-27</code></td>
        <td>Must be remediated before Phase 3 — service account with Azure Key Vault reference only</td></tr>
    <tr><td><strong>Schema noise</strong></td>
        <td>457 tables including <code>*_Backup_*</code>, <code>Temp_*</code>, and <code>*_Consolidated</code> duplicates</td>
        <td>The SP/API layer provides a clean, versioned contract — backup/temp tables excluded by config-driven allow-list</td></tr>
    <tr><td><strong>No MCP server or REST API</strong></td>
        <td>No <code>/api</code> project, no OpenAPI spec, no MCP tooling exists</td>
        <td>All four layers (DB SPs → REST API → MCP Server → Admin Portal) must be built</td></tr>
  </tbody>
</table>
"""
    return section("02", "Current State — What Needs to Be Built", body)


# ─── 03 Architecture ─────────────────────────────────────────────────────────
def architecture() -> str:
    body = f"""
<p>The OXPLiveNG MCP infrastructure follows a strict four-layer design. This is the same
reference architecture used for the existing <code>orx-mcp-daisybill837</code> integration,
ensuring consistent operations, deployment (IIS), and developer onboarding across all ORX MCP servers.</p>

<div class="arch-box">
<span class="arch-label">┌───────────────────────────────────────────────────────────────────────────────────┐</span>
<span class="arch-label">│  L4 — MCP Admin Portal (.NET 8 + React/TypeScript)                                │</span>
<span class="arch-label">│  Manages: tool registry · connections · users/roles · audit · schedules · health   │</span>
<span class="arch-label">└─────────────────────────────────────────────────────────────────────────────────── ┘</span>
          <span class="arch-arrow">↑</span> reads/writes mcpadmin.* schema
<span class="arch-label">┌──────────────┐</span>   MCP (stdio / HTTP+SSE)   <span class="arch-label">┌───────────────┐</span>   HTTPS/OpenAPI   <span class="arch-label">┌────────────────┐</span>   EXEC only   <span class="arch-label">┌──────────────┐</span>
<span class="arch-label">│  AI Agent /  │</span> <span class="arch-arrow">─────────────────────────►</span> <span class="arch-label">│  MCP Server   │</span> <span class="arch-arrow">────────────────►</span> <span class="arch-label">│  REST API      │</span> <span class="arch-arrow">────────────►</span> <span class="arch-label">│  OXPLiveNG   │</span>
<span class="arch-label">│  Claude      │</span>                            <span class="arch-label">│  L3 (.NET 8)  │</span>                  <span class="arch-label">│  L2 (.NET 8)   │</span>               <span class="arch-label">│  api.usp_*   │</span>
<span class="arch-label">└──────────────┘</span>                            <span class="arch-label">└───────────────┘</span>                  <span class="arch-label">└────────────────┘</span>               <span class="arch-label">│  crud.usp_*  │</span>
                                                                                No SQL string.             <span class="arch-label">└──────────────┘</span>
                                                                                No direct DB access.
</div>

<table>
  <thead><tr><th>Layer</th><th>Tech Stack</th><th>Responsibility</th></tr></thead>
  <tbody>
    <tr><td><strong>L1 — Database SP Layer</strong></td>
        <td>T-SQL on OXPLiveNG · <code>api</code> schema (reads) · <code>crud</code> schema (writes) · SSDT migrations</td>
        <td>All reads/writes encapsulated as stored procedures. <code>api.*</code> wraps 31 views; <code>crud.*</code> provides full CRUD per core entity. Zero inline SQL anywhere above this layer.</td></tr>
    <tr><td><strong>L2 — REST API</strong></td>
        <td>ASP.NET Core 8 Web API · Dapper · OpenAPI/Swagger · <code>Microsoft.Data.SqlClient</code></td>
        <td>Calls SPs only; exposes OpenAPI contract; handles auth (Entra ID), validation, paging, and PHI-redacted audit logging. Routes are generated from the DB catalog — adding an SP adds an endpoint without a code deploy.</td></tr>
    <tr><td><strong>L3 — MCP Server</strong></td>
        <td>.NET 8 · Official <code>ModelContextProtocol</code> C# SDK · stdio + HTTP/SSE transports</td>
        <td>Exposes MCP tools derived from the OpenAPI catalog. <strong>Has no SQL connection string.</strong> Calls L2 only. Tool definitions, rate limits, and feature flags are all DB-resident configuration.</td></tr>
    <tr><td><strong>L4 — Admin Portal</strong></td>
        <td>ASP.NET Core 8 + React/TypeScript · Entra SSO · <code>mcpadmin.*</code> schema</td>
        <td>Manages the MCP server without code changes: enable/disable tools, manage connections, view audit logs, configure schedules, set retention policies, run test queries. Mirrors <code>OrxDaisyBillMcp.admin</code>.</td></tr>
  </tbody>
</table>

<div class="callout"><p><strong>Key principle (non-negotiable):</strong> The MCP Server (L3) has no <code>Microsoft.Data.SqlClient</code> reference — it cannot access the database directly. All data flows through L2. This is enforced at the project level and verified by CI.</p></div>
"""
    return section("03", "Architecture — Four-Layer Design", body)


# ─── 04 Domain Coverage Matrix ───────────────────────────────────────────────
def domain_matrix() -> str:
    rows = ""
    for num, name, stps, eps, tools, desc in DOMAINS:
        rows += f"""<tr>
          <td>{num}</td><td><strong>{name}</strong></td>
          <td style="text-align:center">{stps}</td>
          <td style="text-align:center">{eps}</td>
          <td style="text-align:center">{tools}</td>
          <td>{desc}</td>
        </tr>"""

    body = f"""
<p>The table below lists all {len(DOMAINS)} business domains covered by the OXPLiveNG MCP server,
with stored procedure, API endpoint, and MCP tool counts per domain.
Every database operation in OXPLiveNG is reachable through this contract.</p>

{kpi_row([(TOTAL_STPS,"Stored Procedures"),(TOTAL_ENDPOINTS,"API Endpoints"),(TOTAL_TOOLS,"MCP Tools"),(len(DOMAINS),"Domains")])}

<table>
  <thead>
    <tr>
      <th style="width:3%">#</th><th style="width:18%">Domain</th>
      <th style="width:5%;text-align:center">STPs</th>
      <th style="width:5%;text-align:center">APIs</th>
      <th style="width:5%;text-align:center">Tools</th>
      <th>What It Covers</th>
    </tr>
  </thead>
  <tbody>{rows}</tbody>
  <tfoot>
    <tr style="font-weight:700;background:#1A2B3C;color:#fff">
      <td colspan="2">TOTAL</td>
      <td style="text-align:center">{TOTAL_STPS}</td>
      <td style="text-align:center">{TOTAL_ENDPOINTS}</td>
      <td style="text-align:center">{TOTAL_TOOLS}</td>
      <td>100% of OXPLiveNG database operations</td>
    </tr>
  </tfoot>
</table>
"""
    return section("04", "Domain Coverage Matrix", body)


# ─── 05 Detailed Capability Reference ────────────────────────────────────────
def detailed_capability() -> str:
    from itertools import groupby

    read_count  = sum(1 for s in STPS if s[3] == "READ")
    write_count = sum(1 for s in STPS if s[3] == "WRITE")

    tables = ""
    for domain_num, rows in groupby(STPS, key=lambda s: s[0]):
        rows = list(rows)
        rcount = sum(1 for r in rows if r[3] == "READ")
        wcount = sum(1 for r in rows if r[3] == "WRITE")
        badge_counts = f'<span style="font-size:8pt;color:{B["muted"]}">{rcount} read · {wcount} write</span>'

        tables += f"""
<div class="domain-header">
  <span class="domain-num">{domain_num:02d}</span>
  <span class="domain-title">{DOMAIN_NAMES[domain_num]}</span>
  <span class="domain-count">{badge_counts}</span>
</div>
<table>
  <thead>
    <tr>
      <th style="width:4%">#</th>
      <th style="width:22%">Stored Procedure</th>
      <th style="width:6%">R/W</th>
      <th style="width:26%">API Endpoint</th>
      <th>What It Does</th>
    </tr>
  </thead>
  <tbody>
"""
        for i, (_, ref, sp, rw, method, endpoint, desc) in enumerate(rows):
            bg = B['light'] if i % 2 == 0 else "#fff"
            ep_text = f'<code style="font-size:8pt;color:{B["blue"]}">{method} {endpoint}</code>' if method else '<span style="color:#999;font-size:8pt">internal</span>'
            sp_color = B['blue'] if rw in ("READ","WRITE") else B['muted']
            tables += f"""<tr style="background:{bg}">
      <td style="font-size:8pt;color:{B['muted']}">{ref}</td>
      <td><code style="font-size:8pt;color:{sp_color}">{sp}</code></td>
      <td>{badge(rw)}</td>
      <td>{ep_text}</td>
      <td style="font-size:8.5pt">{desc}</td>
    </tr>"""
        tables += "</tbody></table>"

    body = f"""
<p>Every stored procedure in the OXPLiveNG MCP server is listed below, grouped by domain.
Each row shows whether the operation reads data or modifies it, the API endpoint it maps to,
and a plain-English description of what billing staff and AI assistants can do with it.
Total: <strong>{read_count} read operations</strong>, <strong>{write_count} write operations</strong>.</p>

{tables}
"""
    return section("05", "Detailed Capability Reference", body)


# ─── 06 Security & HIPAA ─────────────────────────────────────────────────────
def security_section() -> str:
    body = """
<p>OXPLiveNG holds Protected Health Information (PHI) — patient demographics, insurance coverage,
diagnosis codes, and EOB/claim data. The MCP infrastructure applies defense-in-depth controls
at every layer.</p>

<table>
  <thead><tr><th style="width:20%">Control</th><th style="width:40%">Mechanism</th><th>Where Enforced</th></tr></thead>
  <tbody>
    <tr><td><strong>Least-privilege DB access</strong></td>
        <td>Service account <code>oxp_api_executor</code> holds only <code>EXECUTE</code> on <code>api</code> and <code>crud</code> schemas — no <code>SELECT</code>, no direct table access</td>
        <td>SQL Server GRANT; CI greps for inline SQL in API project</td></tr>
    <tr><td><strong>No direct DB from MCP</strong></td>
        <td>MCP Server (L3) has zero <code>Microsoft.Data.SqlClient</code> reference — enforced at project level</td>
        <td>csproj dependency check in CI pipeline</td></tr>
    <tr><td><strong>PHI column flagging</strong></td>
        <td>Catalog marks <code>ContainsPhi=1</code> per SP; MCP redacts PHI fields unless caller holds <code>phi:read</code> scope</td>
        <td>L2 API middleware + L3 tool response filter</td></tr>
    <tr><td><strong>Entra ID authentication</strong></td>
        <td>OIDC via Microsoft Entra ID for Admin Portal; client_credentials flow for AI agent access</td>
        <td>L2 API + L4 Admin Portal auth middleware</td></tr>
    <tr><td><strong>HIPAA audit trail</strong></td>
        <td>Every tool call / API call / SP execution logged to <code>mcpadmin.AuditLog</code> with actor, target, correlation ID, and PHI-redacted details</td>
        <td>L2 API middleware (always on, cannot be disabled)</td></tr>
    <tr><td><strong>IP whitelist</strong></td>
        <td>Allowed source IPs stored in DB (<code>api.usp_Admin_WhitelistIP_*</code>); checked at API gateway for non-Entra callers</td>
        <td>L2 middleware; managed via Admin Portal (Domain 4)</td></tr>
    <tr><td><strong>Role-based access control</strong></td>
        <td>Tools/endpoints enabled per role; <code>IsEnabled=0</code> makes tool invisible to all callers regardless of auth</td>
        <td>L3 MCP tool registry + L2 route authorization</td></tr>
    <tr><td><strong>Secrets management</strong></td>
        <td>DB connection string and API keys stored as Azure Key Vault references — never plaintext in config files</td>
        <td>Remediates current <code>chetuSA</code> hardcoded credential (Web.config:26-27)</td></tr>
    <tr><td><strong>TLS 1.2+ in transit</strong></td>
        <td>All L2↔L3 and L3↔AI traffic over HTTPS; no HTTP fallback in production</td>
        <td>IIS binding configuration + HSTS</td></tr>
  </tbody>
</table>
"""
    return section("06", "Security, HIPAA & Governance", body)


# ─── 07 What Gets Built ───────────────────────────────────────────────────────
def what_gets_built() -> str:
    body = f"""
<p>The engagement delivers four layers of infrastructure across five implementation phases:</p>

<table>
  <thead><tr><th>Phase</th><th>Deliverable</th><th>Key Work</th></tr></thead>
  <tbody>
    <tr><td><strong>Phase 0</strong><br/>Foundations</td>
        <td>DB schemas, catalog tables, service account</td>
        <td>Create <code>api</code> and <code>crud</code> schemas. Create <code>mcpadmin.*</code> catalog database. Provision <code>oxp_api_executor</code> SQL login with EXECUTE-only grant. Remediate hardcoded <code>chetuSA</code> credential via Azure Key Vault.</td></tr>
    <tr><td><strong>Phase 1</strong><br/>Read SPs</td>
        <td>{sum(1 for s in STPS if s[3]=="READ")} <code>api.*</code> read stored procedures</td>
        <td>Wrap all 31 OXPLiveNG business views in explicit-column-set SPs. Add catalog rows (<code>api.SpCatalog</code>, <code>api.SpParameter</code>, <code>api.SpResultColumn</code>). Each SP is an idempotent <code>CREATE OR ALTER</code> in SSDT.</td></tr>
    <tr><td><strong>Phase 2</strong><br/>REST API</td>
        <td>.NET 8 Web API with OpenAPI/Swagger</td>
        <td>Routes materialized from <code>api.SpCatalog</code> — adding an SP row adds an endpoint, no code deploy. Dapper for SP calls, Serilog for structured logging, Entra ID for auth, OpenAPI contract published.</td></tr>
    <tr><td><strong>Phase 3</strong><br/>MCP Server + Admin Portal MVP</td>
        <td>MCP Server (L3) + Admin Portal (L4)</td>
        <td>MCP tools auto-generated from OpenAPI catalog. stdio + HTTP/SSE transports. Admin Portal with tool registry, connection manager, role management, and audit log viewer. Mirrors <code>orx-mcp-daisybill837</code> architecture.</td></tr>
    <tr><td><strong>Phase 4</strong><br/>Write SPs + Full CRUD</td>
        <td>{sum(1 for s in STPS if s[3]=="WRITE")} <code>crud.*</code> write stored procedures</td>
        <td>CRUD SPs for core entities (Claims, Patients, Jobs, Insurance, Reconciliation, Warehouse). CRUD generator automates boilerplate from <code>api.EntityCatalog</code>. All write SPs run inside transactions with typed <code>THROW</code> error handling.</td></tr>
    <tr><td><strong>Phase 5</strong><br/>Hardening</td>
        <td>Production-ready system</td>
        <td>Retention policies, notification rules, rate limiting, E2E test suite, HIPAA compliance review, pen-test remediation, Entra CA policy. Schedules and feature flags configured via Admin Portal.</td></tr>
  </tbody>
</table>

<h2>Project Outputs</h2>
<ul>
  <li>107 stored procedures in <code>api</code> and <code>crud</code> schemas (SSDT + migrations)</li>
  <li><code>OxpLiveNg.Api</code> — .NET 8 REST API project with OpenAPI spec</li>
  <li><code>MCPServer</code> + <code>MCPHttpServer</code> — .NET 8 MCP server (stdio + HTTP/SSE)</li>
  <li><code>MCPAdminPortal</code> + <code>Client</code> — .NET 8 + React/TS admin application</li>
  <li>Azure Key Vault wiring for all secrets (remediates current plaintext credentials)</li>
  <li>CI/CD pipeline (inline SQL guard, schema validation, OpenAPI diff check)</li>
</ul>
"""
    return section("07", "What Gets Built", body)


# ─── 08 Delivery Plan ─────────────────────────────────────────────────────────
def delivery_plan() -> str:
    body = """
<table>
  <thead>
    <tr><th style="width:12%">Phase</th><th style="width:22%">Duration</th><th style="width:22%">Milestone Gate</th><th>Deliverables</th></tr>
  </thead>
  <tbody>
    <tr><td>Phase 0</td><td>Week 1</td><td>DB schemas + service account provisioned</td>
        <td><code>api</code>/<code>crud</code>/<code>mcpadmin</code> schemas · Key Vault wiring · <code>oxp_api_executor</code> login</td></tr>
    <tr><td>Phase 1</td><td>Weeks 2–4</td><td>All 58 read SPs deployed + catalog populated</td>
        <td>58 <code>api.*</code> SPs · <code>api.SpCatalog</code> rows · SSDT project</td></tr>
    <tr><td>Phase 2</td><td>Weeks 4–6</td><td>REST API live + Swagger published</td>
        <td><code>OxpLiveNg.Api</code> project · OpenAPI spec · Entra auth · Serilog audit</td></tr>
    <tr><td>Phase 3</td><td>Weeks 6–9</td><td>MCP server operational + Admin Portal MVP</td>
        <td><code>MCPServer</code> · <code>MCPHttpServer</code> · <code>MCPAdminPortal</code> · <code>claude_desktop_config.json</code> snippet</td></tr>
    <tr><td>Phase 4</td><td>Weeks 9–12</td><td>All 49 write SPs + CRUD tools live</td>
        <td>49 <code>crud.*</code> SPs · CRUD generator · full tool suite (107 tools)</td></tr>
    <tr><td>Phase 5</td><td>Weeks 12–16</td><td>Hardened, HIPAA-reviewed, production-ready</td>
        <td>E2E tests · retention/notification config · pen-test sign-off · Entra CA policy</td></tr>
  </tbody>
</table>

<div class="callout">
<p><strong>Reference implementation:</strong> The <code>orx-mcp-daisybill837</code> server (already live in ORX environment) validates
this architecture and toolchain. OXPLiveNG builds on the same proven pattern with the same .NET 8 / Dapper / Serilog /
ModelContextProtocol SDK stack — reducing technical risk significantly.</p>
</div>
"""
    return section("08", "Delivery Plan", body)


# ─── 09 Next Steps ────────────────────────────────────────────────────────────
def next_steps() -> str:
    body = """
<p>Upon client approval of this document, work begins on Phase 0. The following items are needed from OrthoKinetix:</p>

<table>
  <thead><tr><th style="width:5%">#</th><th style="width:40%">Item</th><th>Owner</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Written approval of this document (sign below or email to Technijian project lead)</td><td>ORX</td></tr>
    <tr><td>2</td><td>SQL Server access for Technijian developer account on <code>ORX-DC-SQL-02</code> (10.100.106.72) — <code>db_owner</code> on <code>OXPLiveNG</code> for development, least-privilege in production</td><td>ORX IT</td></tr>
    <tr><td>3</td><td>Azure tenant access for Entra ID application registration (or ORX registers the app, shares Client ID)</td><td>ORX IT / Technijian</td></tr>
    <tr><td>4</td><td>Azure Key Vault access (or create new vault) for storing DB connection string and API keys</td><td>ORX IT</td></tr>
    <tr><td>5</td><td>Git repo access (or create new repo in ORX Azure DevOps / GitHub organization)</td><td>ORX IT</td></tr>
    <tr><td>6</td><td>IIS host and server for deploying the REST API and MCP server in development</td><td>ORX IT</td></tr>
  </tbody>
</table>
"""
    return section("09", "Next Steps — What We Need From You", body)


# ─── 10 Approval ─────────────────────────────────────────────────────────────
def approval_page() -> str:
    body = """
<p>By signing below, OrthoKinetix approves the scope, architecture, and capability list defined in this document
and authorizes Technijian to begin Phase 0 (Foundations). Changes to scope after approval require a written amendment.</p>

<h2>OrthoKinetix Authorization</h2>
<div class="sig-block">
  <p><strong>Approved by:</strong></p>
  <br/><div class="sig-line"></div>
  <div class="sig-label">Printed Name &amp; Title</div>
  <br/><div class="sig-line"></div>
  <div class="sig-label">Signature</div>
  <br/><div class="sig-line"></div>
  <div class="sig-label">Date</div>
</div>

<h2>Technijian Project Lead</h2>
<div class="sig-block">
  <p><strong>Acknowledged by:</strong> Rohit Jain, Technijian Inc.</p>
  <br/><div class="sig-line"></div>
  <div class="sig-label">Signature</div>
  <br/><div class="sig-line"></div>
  <div class="sig-label">Date</div>
</div>

<div class="callout" style="margin-top:32px">
<p>Questions? Contact your Technijian account team at <strong>949.379.8499</strong> or <strong>rjain@technijian.com</strong></p>
</div>
"""
    return section("10", "Approval &amp; Sign-Off", body)


# ─── Appendix ─────────────────────────────────────────────────────────────────
def appendix() -> str:
    rows = ""
    for num, name, stps, eps, tools, desc in DOMAINS:
        rows += f"<tr><td>{num}</td><td><strong>{name}</strong></td><td style='text-align:center'>{stps}</td><td>{desc}</td></tr>"

    body = f"""
<h2>A — Domain Quick Reference</h2>
<table>
  <thead><tr><th>#</th><th>Domain</th><th style="text-align:center">SPs</th><th>Scope</th></tr></thead>
  <tbody>{rows}</tbody>
</table>

<h2>B — Architecture Constraints (Non-Negotiable)</h2>
<ul>
  <li><strong>SP-only DB access (P1):</strong> The API executes only stored procedures in <code>api</code>/<code>crud</code> schemas. No <code>SELECT</code>/<code>INSERT</code> against tables from application code.</li>
  <li><strong>API-first contract (P2):</strong> The OpenAPI document is the contract. The MCP server is derived from it — no tool definition exists outside the catalog.</li>
  <li><strong>MCP fronts the API, never the DB (P3):</strong> The MCP server has no SQL connection string and no <code>Microsoft.Data.SqlClient</code> reference.</li>
  <li><strong>Nothing hardcoded (P4):</strong> Endpoints, SP mappings, tool definitions, connections, roles, schedules, and feature flags live in DB tables. Secrets live in Azure Key Vault.</li>
  <li><strong>Everything audited (P5):</strong> Every tool call / API call / SP execution logged with actor, target, correlation ID, and PHI-redacted details.</li>
  <li><strong>Least privilege, deny-by-default (P6):</strong> A tool/endpoint/SP is unavailable unless explicitly enabled and the caller's role permits it.</li>
</ul>

<h2>C — Companion Documents</h2>
<ul>
  <li><code>docs/oxpliveng-mcp-server-specification.md</code> — Full 16-section system specification (v0.1, May 2026)</li>
  <li><code>docs/oxpliveng-sp-api-mcp-catalog.md</code> — Catalog index + Domain 1 (Claims)</li>
  <li><code>docs/oxpliveng-sp-api-mcp-catalog-d2-patient.md</code> — Domain 2 (Patient)</li>
  <li><code>docs/oxpliveng-sp-api-mcp-catalog-d3-d6.md</code> — Domains 3–6 (Billing, Admin, Auth, Documents)</li>
  <li><code>docs/oxpliveng-sp-api-mcp-catalog-d7-d11.md</code> — Domains 7–11 (Groups, Orders, Reconciliation, Warehouse, AWS)</li>
</ul>
"""
    return section("A", "Appendix", body)


# ─── Build ─────────────────────────────────────────────────────────────────────
def build_html() -> str:
    sections = (
        cover() + exec_summary() + current_state() + architecture()
        + domain_matrix() + detailed_capability()
        + security_section() + what_gets_built() + delivery_plan()
        + next_steps() + approval_page() + appendix()
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>OXPLiveNG MCP Server — Client Approval Report</title>
<style>{CSS}</style>
</head>
<body>{sections}</body>
</html>"""


def main():
    print("Building HTML...")
    html = build_html()
    OUT_HTML.write_text(html, encoding="utf-8")
    print(f"HTML: {OUT_HTML}")

    print("Rendering PDF via Playwright...")
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1400, "height": 1080})
        page.goto(OUT_HTML.as_uri(), wait_until="networkidle")
        page.pdf(
            path=str(OUT_PDF),
            format="Letter",
            landscape=False,
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
        )
        browser.close()

    size_kb = OUT_PDF.stat().st_size // 1024
    print(f"PDF: {OUT_PDF}  ({size_kb} KB)")

    # Quick verify — cover screenshot
    ss = OUT_DIR / "_ng-cover-check.png"
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page(viewport={"width": 1400, "height": 1080})
        page.goto(OUT_HTML.as_uri(), wait_until="networkidle")
        page.screenshot(path=str(ss), full_page=False)
        browser.close()
    print(f"Cover screenshot: {ss}")


if __name__ == "__main__":
    main()
