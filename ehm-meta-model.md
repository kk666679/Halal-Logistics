# Enterprise Halal Management (EHM) – Meta‑Model

This document defines the core entities and relationships that support Halal compliance, traceability, and AI‑driven decision‑making. The model is inspired by classic enterprise resource planning (ERP) data structures.

## Core Entities

### 1. Halal Product (Material Master)
Represents any product or ingredient subject to Halal certification.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `MATNR` | String (PK) | Unique product identifier | `P-001-CHICKEN` |
| `MEINS` | String | Unit of measure | `KG` |
| `MTART` | String | Material type | `MEAT`, `DAIRY`, `COSMETIC` |
| `HALAL_STATUS` | String | Current status | `PERMITTED`, `SUSPENDED`, `REVOKED` |
| `CERT_EXPIRY_DATE` | Date | When the current certificate expires | `2027-06-01` |
| `INGREDIENTS` | Text | List of ingredients with E‑numbers | `100% chicken, no additives` |

### 2. Supplier (Vendor Master)
An entity that provides raw materials or products.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `LIFNR` | String (PK) | Supplier ID | `V-0001-FARM` |
| `NAME` | String | Company name | `Farm Fresh Poultry Sdn Bhd` |
| `BPJPH_ID` | String | BPJPH registration number | `BPJPH-2024-00987` |
| `ESG_SCORE` | Integer | Tayyib/ESG rating (0‑100) | `85` |
| `COUNTRY` | String | Country of origin | `Malaysia` |

### 3. Certification (Purchasing Info Record)
Halal certificate issued by a recognised body.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `CERT_ID` | String (PK) | Certificate ID | `CERT-JAKIM-2024-056` |
| `BODY` | String | Issuing authority | `BPJPH`, `JAKIM`, `ESMA`, `SMIIC` |
| `VALID_FROM` | Date | Start date | `2024-01-01` |
| `VALID_TO` | Date | Expiry date | `2026-12-31` |
| `REVOKED_FLAG` | Boolean | Is the certificate revoked? | `false` |

### 4. Batch Trace (Batch Master)
Represents a specific production lot with immutable provenance.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `BATCH_ID` | String (PK) | Batch number | `BATCH-2026-06-28-001` |
| `BLOCKCHAIN_HASH` | String | Immutable hash on ledger | `0x9f86...` |
| `PRODUCTION_DATE` | DateTime | Slaughter/production timestamp | `2026-06-28T08:00:00Z` |
| `FARM_LAT` | Float | Latitude of source farm | `3.139` |
| `FARM_LONG` | Float | Longitude of source farm | `101.686` |
| `TEMP_LOG_CID` | String | IPFS hash of IoT temperature logs | `QmXoy...` |

### 5. Facility (Plant/Storage)
Physical location where products are processed or stored.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `WERKS` | String (PK) | Facility ID | `PLANT-KL-01` |
| `NAME` | String | Facility name | `Kuala Lumpur Processing Hub` |
| `SEGREGATION_LEVEL` | String | Halal segregation level | `DEDICATED`, `SHARED`, `RISK` |
| `ISO_CERT` | String | Environmental/quality certifications | `ISO 14001, ISO 45001` |

### 6. Production Process (Order)
A specific manufacturing or processing job.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `AUFNR` | String (PK) | Order number | `ORD-2026-06-28-001` |
| `START_TIME` | DateTime | Process start | `2026-06-28T06:00:00Z` |
| `END_TIME` | DateTime | Process end | `2026-06-28T10:00:00Z` |
| `CLEANING_CIP_ID` | String | Cleaning validation ID | `CIP-2026-06-28-03` |

### 7. Audit Record (Quality Info)
Record of inspections and findings.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `AUDIT_ID` | String (PK) | Audit ID | `AUD-2026-Q2-001` |
| `DATE` | Date | Audit date | `2026-06-15` |
| `FINDING_SEVERITY` | String | Severity level | `CRITICAL`, `MAJOR`, `MINOR`, `NONE` |
| `REMEDIATION_ACTION` | Text | Corrective action | `Update supplier training` |

### 8. Blockchain Transaction
Immutable record of a product’s journey.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `DOC_NUM` | String (PK) | Transaction ID | `TX-0x7a9fe1` |
| `TRANSACTION_HASH` | String | On‑chain hash | `0x7a9fe1...` |
| `TIMESTAMP` | DateTime | When mined | `2026-06-28T08:15:00Z` |
| `GAS_USED` | String | Gas cost | `21000` |

### 9. GenAI Call (OCI Log)
Log of every interaction with the Generative AI service.

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `PROMPT_ID` | String (PK) | Unique prompt ID | `GENAI-2026-06-28-001` |
| `MODEL_USED` | String | Model name | `cohere.command-r-plus` |
| `INPUT_TEXT` | Text | The prompt sent | `Audit batch BATCH-...` |
| `OUTPUT_TEXT` | Text | The response | `Batch is compliant...` |
| `GUARDRAIL_PASSED` | Boolean | Did it pass safety checks? | `true` |

## Core Relationships

| From Entity | To Entity | Relation | Meaning |
|-------------|-----------|----------|---------|
| HalalProduct | Supplier | `IS_SOURCED_FROM` | The product is supplied by a vendor. |
| HalalProduct | Certification | `HAS_CERTIFICATION` | The product is covered by a certificate. |
| Supplier | Certification | `HAS_CERTIFICATION` | Supplier holds a certificate. |
| Supplier | AuditRecord | `UNDERGOES_AUDIT` | Supplier has been audited. |
| HalalProduct | BatchTrace | `IS_PRODUCED_IN_BATCH` | Product batch is linked. |
| Facility | HalalProduct | `STORES_PRODUCT` | Facility holds the product. |
| Facility | ProductionProcess | `EXECUTES_PROCESS` | Process occurs at facility. |
| ProductionProcess | BatchTrace | `PRODUCES_BATCH` | Order produces a batch. |
| BatchTrace | BlockchainTransaction | `IS_LINKED_TO_TX` | Batch is recorded on blockchain. |
| GenAICall | AuditRecord | `ASSISTS_AUDIT` | AI helped in the audit. |
| GenAICall | ProductionProcess | `OPTIMIZES_PROCESS` | AI optimised the process. |

## Additional Concepts (Taxonomy)
- **Tayyib** – an ethical/wholesome attribute that suppliers/products may align with.
- **ESG** – Environmental, Social, Governance score.
- **Regulation** – mandatory rules (e.g., BPJPH, JAKIM, SMIIC).

