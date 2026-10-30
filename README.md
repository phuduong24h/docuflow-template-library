# DocuFlow — Enterprise Template Library Platform

> **A high-performance Modular Monolith SaaS platform for previewing, cloning, and managing DOCX documents and PPTX presentations.**

DocuFlow is built with strict adherence to **Clean Architecture**, **SOLID principles**, and **OWASP Top 10 security standards**. The system provides enterprise-grade document governance: original templates are guaranteed to remain **strictly immutable**, while users can preview, customize metadata, instantiate independent physical OpenXML files, and download them seamlessly.

---

## 🌟 Key Highlights & Business Capabilities

### Product 1: Document Template Library (DOCX)
- **5 Validated Seeded Templates**:
  1. *Business Proposal* (Executive summary, project deliverables, cost investment table)
  2. *Employment Contract* (Compensation terms, duties, intellectual property rights, confidentiality)
  3. *Meeting Minutes* (Topic, attendee list, agenda discussion, action item deliverables)
  4. *Project Status Report* (Health metrics, milestones, delivery risks, roadmap)
  5. *Formal Business Letter* (Company header, recipient info, sign-off blocks)
- **Real-time Mammoth Preview**: Renders high-fidelity HTML preview within a paper document mockup without mutating the underlying file.
- **Physical Copy Isolation**: Generates a new file in `storage/generated/documents/` upon user selection, ensuring the original is never modified.
- **Direct Stream Download**: Streams `.docx` with secure `Content-Disposition` and `Content-Type` headers.

### Product 2: Presentation Template Library (PPTX)
- **3 Seeded PowerPoint Decks**:
  1. *Business Pitch Deck* (Cover, Problem & Solution, Market Opportunity & Roadmap)
  2. *Company Profile* (Corporate overview, Core services, Leadership values)
  3. *Project Presentation* (Architecture highlights, OpenXML standards, Deliverables)
- **Multi-Slide Deck Previewer**: Interactive 16:9 widescreen slide carousel with slide counter, next/previous controls, and bullet point breakdowns.
- **Atomic OpenXML Binary Cloning**: Preserves complete styling, backgrounds, and shapes compatible with Microsoft PowerPoint, Google Slides, and LibreOffice.
- **Safe Download Stream**: Instant download with unique filename generation.

---

## 🏗️ System Architecture

```
                          ┌───────────────────────────┐
                          │   Frontend (React + Vite)  │
                          │   Tailwind CSS / Lucide   │
                          └─────────────┬─────────────┘
                                        │ HTTP / REST
                                        ▼
                          ┌───────────────────────────┐
                          │    API Layer (Express)    │
                          │  Helmet / CORS / Zod Val  │
                          └─────────────┬─────────────┘
                                        │
                 ┌──────────────────────┼──────────────────────┐
                 ▼                      ▼                      ▼
        ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
        │ Template Module │    │ Document Module │    │ Pres. Module    │
        └────────┬────────┘    └────────┬────────┘    └────────┬────────┘
                 │                      │                      │
                 ▼                      ▼                      ▼
        ┌───────────────────────────────────────────────────────────────┐
        │                      Application Services                     │
        └───────────────────────┬───────────────────────────────┬───────┘
                                │                               │
                                ▼                               ▼
                 ┌─────────────────────────────┐  ┌─────────────────────────────┐
                 │    Database Layer (Prisma)  │  │    Storage Service (Local)  │
                 │      PostgreSQL Database    │  │    Path Traversal Prevention │
                 └─────────────────────────────┘  └─────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Lucide React, Axios |
| **Backend** | Node.js 20, Express 4, TypeScript 5, Prisma ORM 5, Zod 3, Helmet, Morgan |
| **Database** | PostgreSQL 16 (with connection pool & Prisma Client) |
| **Document Processing** | `docx` (OpenXML generation), `mammoth` (HTML preview), `pptxgenjs` (PPTX presentation engine) |
| **Testing** | Vitest 2, Supertest 7 |
| **DevOps** | Docker, Docker Compose, Multi-stage builds, Nginx |

---

## 📋 Prerequisites

- **Node.js**: `v20.x` or higher (verified with `v20.19.5`)
- **npm**: `v10.x` or higher
- **PostgreSQL**: PostgreSQL 16 running locally or via Docker
  - Default database: `template_library`
  - Connection string: `postgresql://postgres:123456@127.0.0.1:5432/template_library?schema=public`

---

## 🚀 Installation & Quick Start

### 1. Clone & Setup Workspace
```bash
# Navigate to repository root
cd d:/test

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables
In `server/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:123456@127.0.0.1:5432/template_library?schema=public"
STORAGE_ROOT="../storage"
CLIENT_URL="http://localhost:5173"
```
*(An accompanying `server/.env.example` is also provided in the repository).*

### 3. Database Migration & Seed Data
Run database synchronization and generate all seeded OpenXML files (`.docx` & `.pptx`) and thumbnails:
```bash
# From server/ directory
npx prisma db push
npm run seed
```

Output:
```
🚀 Starting Seed Process...
  ✔ Seeded DOCX Template: Business Proposal (10230 bytes)
  ✔ Seeded DOCX Template: Employment Contract (10002 bytes)
  ✔ Seeded DOCX Template: Meeting Minutes (9932 bytes)
  ✔ Seeded DOCX Template: Project Status Report (9911 bytes)
  ✔ Seeded DOCX Template: Formal Business Letter (9891 bytes)
  ✔ Seeded PPTX Template: Business Pitch Deck (59441 bytes)
  ✔ Seeded PPTX Template: Company Profile (57821 bytes)
  ✔ Seeded PPTX Template: Project Presentation (52084 bytes)
✅ Seed data completed successfully!
```

---

## 💻 Running the Application

### Method A: Local Development (Recommended)

In terminal 1 (Backend API):
```bash
cd server
npm run dev
# Server listening on http://localhost:5000
# Health check: http://localhost:5000/api/v1/health
```

In terminal 2 (Frontend Client):
```bash
cd client
npm run dev
# Vite dev server listening on http://localhost:5173
```

Open your browser at **`http://localhost:5173/`**.

### Method B: Docker Compose Deployment

```bash
docker-compose up --build -d
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- PostgreSQL: `localhost:5432`

---

## 🧪 Testing & Quality Assurance

Run the comprehensive integration test suite (18 automated tests covering health checks, template retrieval, category filtering, search, cloning, streaming downloads, immutability, and path traversal prevention):

```bash
cd server
npm run test
```

Results:
```
 ✓ src/__tests__/api.test.ts (18 tests) 482ms
 Test Files  1 passed (1)
      Tests  18 passed (18)
```

Run TypeScript compilation verification:
```bash
# Server typecheck & build
cd server && npm run build

# Client typecheck & build
cd ../client && npm run build
```

---

## 🛡️ Security Architecture

1. **Path Traversal Guard**:
   - `StorageService.resolveSafePath` resolves relative paths against `STORAGE_ROOT`.
   - Explicitly rejects null bytes (`\0`), traversal markers (`..`), and ensures `path.relative` never starts with `..`.
2. **Template Immutability**:
   - Source templates in `storage/templates/` are treated as strictly Read-Only.
   - User creation triggers physical copy streaming with unique UUIDs in `storage/generated/`.
3. **Rollback & Anti-Orphan Cleanup**:
   - If database insertion fails during document creation, the freshly cloned physical file is automatically unlinked and cleaned up.
4. **Input Validation**:
   - Zod validation middleware strictly validates all request parameters, query strings, and body payloads with structured 400 error codes.
5. **Secure Headers**:
   - `helmet` security middleware, controlled CORS origin whitelist, and safe `Content-Disposition` header encoding.

---

## 📁 Repository Directory Structure

```
d:/test/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Presentation layer (Navbar, Sidebar, Modals, Cards)
│   │   ├── hooks/              # Application layer (useTemplates, useDocuments)
│   │   ├── services/           # Data layer (Axios API services)
│   │   ├── types/              # Domain & DTO interfaces
│   │   ├── App.tsx             # Main application shell
│   │   └── main.tsx            # DOM root
│   ├── Dockerfile
│   └── package.json
├── server/                     # Backend API & Storage Engine
│   ├── src/
│   │   ├── config/             # Environment & constants
│   │   ├── modules/            # Domain modules (Template, Document, Presentation, Health)
│   │   ├── shared/             # Error handling, response utilities, middlewares
│   │   ├── storage/            # File Storage Service
│   │   ├── __tests__/          # Vitest integration test suite
│   │   ├── app.ts              # Express application factory
│   │   └── index.ts            # Entrypoint
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema & indexes
│   │   └── seed.ts             # OpenXML generator & seed script
│   ├── Dockerfile
│   └── package.json
├── storage/                    # Physical File Storage Root
│   ├── templates/              # Immutable source templates
│   │   ├── documents/          # 5 DOCX files
│   │   └── presentations/      # 3 PPTX files
│   ├── generated/              # User-generated cloned files
│   └── thumbnails/             # High-res SVG thumbnails
├── ARCHITECTURE.md             # Detailed Architectural Document
├── API.md                      # RESTful API Reference
├── THIRD_PARTY_LICENSES.md     # Third-Party Dependencies & Licenses
├── AI_USAGE.md                 # AI Disclosure & Verification Record
├── LIMITATIONS.md              # Limitations & Future Roadmap
├── docker-compose.yml          # Containerized Orchestration
└── package.json                # Monorepo root scripts
```

---

## 📄 License
This project is licensed under the MIT License.
