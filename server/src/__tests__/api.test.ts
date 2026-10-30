import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { prisma } from '../config/db.js';
import { storageService } from '../storage/storage.service.js';
import { Express } from 'express';

describe('Template Library Platform API Tests', () => {
  let app: Express;
  let testDocxTemplateId: string;
  let testPptxTemplateId: string;
  let createdDocumentId: string;
  let createdPresentationId: string;
  let initialTemplateSize: number;

  beforeAll(async () => {
    app = createApp();

    // Query seeded templates
    const docxTemplate = await prisma.template.findFirst({
      where: { type: 'DOCUMENT' },
    });
    const pptxTemplate = await prisma.template.findFirst({
      where: { type: 'PRESENTATION' },
    });

    expect(docxTemplate).not.toBeNull();
    expect(pptxTemplate).not.toBeNull();

    testDocxTemplateId = docxTemplate!.id;
    testPptxTemplateId = pptxTemplate!.id;

    // Record initial physical file size of the template to assert immutability
    const stats = await storageService.getFileStats(docxTemplate!.storagePath);
    initialTemplateSize = stats.size;
  });

  afterAll(async () => {
    // Clean up created test document and presentation
    if (createdDocumentId) {
      await request(app).delete(`/api/v1/documents/${createdDocumentId}`);
    }
    if (createdPresentationId) {
      await request(app).delete(`/api/v1/presentations/${createdPresentationId}`);
    }
    await prisma.$disconnect();
  });

  describe('Health Check API', () => {
    it('GET /api/v1/health should return 200 with database and storage status', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('ok');
      expect(res.body.data.services.database).toBe('connected');
      expect(res.body.data.services.storage).toBeDefined();
    });
  });

  describe('Template API', () => {
    it('GET /api/v1/templates should list all active templates with pagination meta', async () => {
      const res = await request(app).get('/api/v1/templates');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(8);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.total).toBeGreaterThanOrEqual(8);
    });

    it('GET /api/v1/templates?type=DOCUMENT should filter only document templates', async () => {
      const res = await request(app).get('/api/v1/templates?type=DOCUMENT');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
      res.body.data.forEach((tpl: { type: string }) => {
        expect(tpl.type).toBe('DOCUMENT');
      });
    });

    it('GET /api/v1/templates?type=PRESENTATION should filter only presentation templates', async () => {
      const res = await request(app).get('/api/v1/templates?type=PRESENTATION');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
      res.body.data.forEach((tpl: { type: string }) => {
        expect(tpl.type).toBe('PRESENTATION');
      });
    });

    it('GET /api/v1/templates?search=Proposal should return matching templates', async () => {
      const res = await request(app).get('/api/v1/templates?search=Proposal');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].name).toContain('Proposal');
    });

    it('GET /api/v1/templates/categories should return unique categories', async () => {
      const res = await request(app).get('/api/v1/templates/categories');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/templates/:id should return template details', async () => {
      const res = await request(app).get(`/api/v1/templates/${testDocxTemplateId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(testDocxTemplateId);
      expect(res.body.data.name).toBeDefined();
    });

    it('GET /api/v1/templates/:id/preview should return rich preview data', async () => {
      const res = await request(app).get(`/api/v1/templates/${testDocxTemplateId}/preview`);
      expect(res.status).toBe(200);
      expect(res.body.data.previewData).toBeDefined();
    });

    it('GET /api/v1/templates/:id with invalid UUID should return 400 validation error', async () => {
      const res = await request(app).get('/api/v1/templates/not-a-uuid');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('GET /api/v1/templates/:id with non-existent UUID should return 404', async () => {
      const res = await request(app).get('/api/v1/templates/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('RESOURCE_NOT_FOUND');
    });
  });

  describe('Document Creation & Immutability Flow', () => {
    it('POST /api/v1/documents/from-template/:templateId should clone document and create metadata', async () => {
      const res = await request(app)
        .post(`/api/v1/documents/from-template/${testDocxTemplateId}`)
        .send({
          title: 'My Custom Business Proposal',
          metadata: { client: 'Global Tech Corp', budget: 50000 },
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('My Custom Business Proposal');
      expect(res.body.data.storagePath).toContain('generated/documents');

      createdDocumentId = res.body.data.id;

      // Assert physical file exists
      const fileExists = await storageService.fileExists(res.body.data.storagePath);
      expect(fileExists).toBe(true);

      // Verify original template file was NOT modified (immutability check)
      const template = await prisma.template.findUnique({ where: { id: testDocxTemplateId } });
      const statsAfterClone = await storageService.getFileStats(template!.storagePath);
      expect(statsAfterClone.size).toBe(initialTemplateSize);
    });

    it('GET /api/v1/documents/:id should retrieve created document', async () => {
      const res = await request(app).get(`/api/v1/documents/${createdDocumentId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdDocumentId);
      expect(res.body.data.title).toBe('My Custom Business Proposal');
    });

    it('PATCH /api/v1/documents/:id should update document metadata', async () => {
      const res = await request(app)
        .patch(`/api/v1/documents/${createdDocumentId}`)
        .send({ title: 'Updated Business Proposal Title' });

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Updated Business Proposal Title');
    });

    it('GET /api/v1/documents/:id/download should stream the DOCX file', async () => {
      const res = await request(app)
        .get(`/api/v1/documents/${createdDocumentId}/download`)
        .responseType('blob');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('wordprocessingml.document');
      expect(res.headers['content-disposition']).toContain('attachment');
      expect(res.headers['content-disposition']).toContain('.docx');
      expect(res.body).toBeDefined();
      expect((res.body as Buffer).length).toBeGreaterThan(0);
    });
  });

  describe('Presentation Creation & Download Flow', () => {
    it('POST /api/v1/presentations/from-template/:templateId should clone PPTX and create metadata', async () => {
      const res = await request(app)
        .post(`/api/v1/presentations/from-template/${testPptxTemplateId}`)
        .send({
          title: 'Q4 Investor Presentation',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe('Q4 Investor Presentation');
      expect(res.body.data.type).toBe('PRESENTATION');
      expect(res.body.data.storagePath).toContain('generated/presentations');

      createdPresentationId = res.body.data.id;

      const fileExists = await storageService.fileExists(res.body.data.storagePath);
      expect(fileExists).toBe(true);
    });

    it('GET /api/v1/presentations/:id/download should stream the PPTX file', async () => {
      const res = await request(app)
        .get(`/api/v1/presentations/${createdPresentationId}/download`)
        .responseType('blob');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('presentationml.presentation');
      expect(res.headers['content-disposition']).toContain('attachment');
      expect(res.headers['content-disposition']).toContain('.pptx');
      expect(res.body).toBeDefined();
      expect((res.body as Buffer).length).toBeGreaterThan(0);
    });
  });

  describe('Security & Path Traversal Prevention', () => {
    it('Storage service should block path traversal attempts with dot-dot syntax', () => {
      expect(() => {
        storageService.resolveSafePath('../../etc/passwd');
      }).toThrow('Path traversal sequence detected');
    });

    it('Storage service should block null byte injections', () => {
      expect(() => {
        storageService.resolveSafePath('templates/documents/\0malicious.docx');
      }).toThrow('Invalid path characters detected');
    });
  });
});
