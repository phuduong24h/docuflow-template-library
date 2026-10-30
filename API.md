# DocuFlow RESTful API Specification

Base URL: `/api/v1`

All responses follow a consistent envelope structure:

### Standard Success Envelope
```json
{
  "success": true,
  "message": "Templates retrieved successfully",
  "data": {},
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 5,
    "totalPages": 1
  }
}
```

### Standard Error Envelope
```json
{
  "success": false,
  "message": "Resource not found",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "details": []
  }
}
```

---

## 1. System Health

### `GET /api/v1/health`
Checks API uptime, database connectivity, and physical storage accessibility.

- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "System health check",
  "data": {
    "status": "ok",
    "timestamp": "2026-10-31T00:18:16.669Z",
    "uptime": 177.5,
    "services": {
      "database": "connected",
      "storage": "accessible"
    },
    "version": "1.0.0"
  }
}
```

---

## 2. Template Module

### `GET /api/v1/templates`
Retrieves a paginated list of active templates with optional search and category filters.

- **Query Parameters**:
  - `type` (optional): `DOCUMENT` | `PRESENTATION`
  - `category` (optional): string (e.g. `Business`, `Corporate`)
  - `search` (optional): string (searches `name`, `description`, `category`)
  - `page` (optional): integer, default `1`
  - `limit` (optional): integer, default `12`
  - `sortBy` (optional): `name` | `createdAt` | `category`, default `createdAt`
  - `sortOrder` (optional): `asc` | `desc`, default `desc`

- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Templates retrieved successfully",
  "data": [
    {
      "id": "e441d08d-8a7e-4001-9f93-02f5a6b7dcf1",
      "name": "Business Proposal",
      "slug": "business-proposal",
      "type": "DOCUMENT",
      "category": "Business",
      "description": "Comprehensive business proposal template...",
      "thumbnailUrl": "/thumbnails/business-proposal.svg",
      "storagePath": "templates/documents/business-proposal.docx",
      "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "fileSize": 10230,
      "version": 1,
      "isActive": true,
      "createdAt": "2026-10-30T17:00:00.000Z",
      "updatedAt": "2026-10-30T17:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 8,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### `GET /api/v1/templates/:id`
Retrieves single template metadata by UUID.

- **URL Parameters**:
  - `id`: Template UUID

- **Response `200 OK`** or **`404 RESOURCE_NOT_FOUND`**

### `GET /api/v1/templates/:id/preview`
Retrieves rich preview payload for a template (HTML preview for DOCX or slide structure array for PPTX).

- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Template preview retrieved successfully",
  "data": {
    "id": "...",
    "name": "Business Proposal",
    "type": "DOCUMENT",
    "previewData": {
      "html": "<h1>BUSINESS PROPOSAL</h1><p>Client: Acme Corp</p>..."
    }
  }
}
```

### `GET /api/v1/templates/categories`
Retrieves list of distinct categories.

- **Query Parameters**:
  - `type` (optional): `DOCUMENT` | `PRESENTATION`

- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": ["Business", "Communication", "Corporate", "Legal & HR", "Management", "Operations", "Pitch Decks", "Technology"]
}
```

---

## 3. Document Module (DOCX)

### `POST /api/v1/documents/from-template/:templateId`
Clones a DOCX template physically and generates a new document record.

- **URL Parameters**:
  - `templateId`: Source template UUID
- **Request Body (JSON)**:
```json
{
  "title": "Acme Corp Proposal - Q4",
  "metadata": {
    "client": "Acme Corporation",
    "budget": 50000,
    "notes": "Urgent deadline"
  }
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "message": "Document created successfully from template",
  "data": {
    "id": "a9317d6b-3cb8-4a47-a87d-8eb99a4e21dc",
    "title": "Acme Corp Proposal - Q4",
    "templateId": "e441d08d-8a7e-4001-9f93-02f5a6b7dcf1",
    "type": "DOCUMENT",
    "storagePath": "generated/documents/a9317d6b-3cb8-4a47-a87d-8eb99a4e21dc.docx",
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "fileSize": 10230,
    "metadata": { "client": "Acme Corporation" },
    "createdAt": "2026-10-30T17:15:00.000Z",
    "updatedAt": "2026-10-30T17:15:00.000Z"
  }
}
```

### `GET /api/v1/documents`
Lists all generated DOCX documents.

### `GET /api/v1/documents/:id`
Retrieves generated document metadata.

### `PATCH /api/v1/documents/:id`
Updates document title or metadata notes.

- **Request Body**:
```json
{
  "title": "Revised Proposal Title",
  "metadata": { "status": "approved" }
}
```

### `GET /api/v1/documents/:id/download`
Streams the physical `.docx` binary file.

- **Response Headers**:
  - `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `Content-Disposition: attachment; filename="Acme_Corp_Proposal.docx"`

### `DELETE /api/v1/documents/:id`
Deletes database metadata and physically unlinks the file from `storage/generated/documents/`.

---

## 4. Presentation Module (PPTX)

### `POST /api/v1/presentations/from-template/:templateId`
Clones a PPTX template physically into an independent presentation file.

- **Request Body (JSON)**:
```json
{
  "title": "Q4 Investor Pitch Deck",
  "metadata": { "audience": "Angel Investors" }
}
```
- **Response `201 Created`**

### `GET /api/v1/presentations`
Lists all generated PPTX presentations.

### `GET /api/v1/presentations/:id/download`
Streams the physical `.pptx` binary file.

- **Response Headers**:
  - `Content-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation`
  - `Content-Disposition: attachment; filename="Q4_Investor_Pitch_Deck.pptx"`

### `DELETE /api/v1/presentations/:id`
Deletes presentation database metadata and physically unlinks the file from `storage/generated/presentations/`.

---

## 5. Standard Error Codes Reference

| Error Code | HTTP Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Request parameters, query, or body failed Zod schema checks. |
| `BAD_REQUEST` | 400 | Generic business logic violation (e.g. attempting to clone PPTX from DOCX endpoint). |
| `RESOURCE_NOT_FOUND` | 404 | Template or Document record not found in database. |
| `FILE_NOT_FOUND` | 404 | Physical file does not exist on storage disk. |
| `FILE_ACCESS_DENIED` | 403 | Path traversal or unauthorized storage root escape attempt. |
| `FILE_STORAGE_ERROR` | 500 | Filesystem write or copy failure. |
| `INTERNAL_SERVER_ERROR` | 500 | Unhandled server exception. |
