# Third-Party Dependencies & Licenses

All third-party libraries integrated into DocuFlow are permissible under permissive open-source licenses (MIT, Apache-2.0, BSD-3-Clause).

---

## 1. Backend Dependencies (`server/`)

| Package | Version | License | Purpose |
|---|---|---|---|
| **express** | `^4.21.1` | MIT | Core HTTP web framework and routing engine |
| **@prisma/client** | `^5.22.0` | Apache-2.0 | Typesafe database client for PostgreSQL |
| **prisma** | `^5.22.0` | Apache-2.0 | Database migration, schema modeling, and client generation CLI |
| **docx** | `^9.0.3` | MIT | Generation of valid OpenXML Word documents (`.docx`) with tables and formatting |
| **mammoth** | `^1.8.0` | BSD-2-Clause | Conversion of OpenXML `.docx` files to HTML for client-side paper preview |
| **pptxgenjs** | `^3.12.0` | MIT | Multi-slide PowerPoint (`.pptx`) generation with layouts, typography, and colors |
| **jszip** | `^3.10.1` | MIT | Compression and low-level OpenXML archive handling |
| **zod** | `^3.23.8` | MIT | Runtime schema validation for API request bodies, queries, and environment configs |
| **helmet** | `^8.0.0` | MIT | HTTP security headers configuration (HSTS, CORP, X-Frame-Options) |
| **cors** | `^2.8.5` | MIT | Cross-Origin Resource Sharing control |
| **morgan** | `^1.10.0` | MIT | HTTP request access logging |
| **dotenv** | `^16.4.5` | BSD-2-Clause | Environment variables loading from `.env` |
| **uuid** | `^11.0.2` | MIT | Cryptographically strong Version-4 UUID generation |
| **vitest** | `^2.1.3` | MIT | High-performance unit and integration test runner |
| **supertest** | `^7.0.0` | MIT | HTTP assertion library for integration testing against Express app |
| **tsx** | `^4.19.2` | MIT | TypeScript execution engine for development and seeding |
| **typescript** | `^5.6.3` | Apache-2.0 | Static type checking and compiler |

---

## 2. Frontend Dependencies (`client/`)

| Package | Version | License | Purpose |
|---|---|---|---|
| **react** | `^18.3.1` | MIT | Core UI component rendering library |
| **react-dom** | `^18.3.1` | MIT | DOM rendering layer for React |
| **vite** | `^5.4.10` | MIT | Next-generation frontend build tool and development server |
| **tailwindcss** | `^3.4.14` | MIT | Utility-first CSS styling framework |
| **postcss** | `^8.4.47` | MIT | CSS transformation tooling |
| **autoprefixer** | `^10.4.20` | MIT | Vendor prefixing for cross-browser CSS |
| **lucide-react** | `^0.454.0` | ISC | Modern, accessible vector icon library |
| **axios** | `^1.7.7` | MIT | Promise-based HTTP client for browser API requests |
| **clsx** | `^2.1.1` | MIT | Utility for constructing `className` strings conditionally |
| **tailwind-merge** | `^2.5.4` | MIT | Utility to merge Tailwind CSS classes without style conflicts |
