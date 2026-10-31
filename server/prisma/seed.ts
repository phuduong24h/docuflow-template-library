import { PrismaClient, TemplateType } from '@prisma/client';
import { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, Packer } from 'docx';
import PptxGenJS from 'pptxgenjs';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

const STORAGE_ROOT = path.resolve(process.cwd(), '../storage');

async function ensureDir(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

// Helper to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper to write SVG thumbnail
async function writeSvgThumbnail(filename: string, title: string, category: string, type: 'DOCUMENT' | 'PRESENTATION', accentColor: string) {
  const isDoc = type === 'DOCUMENT';
  const icon = isDoc
    ? `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="none" stroke="${accentColor}" stroke-width="2"/><polyline points="14 2 14 8 20 8" fill="none" stroke="${accentColor}" stroke-width="2"/><line x1="16" y1="13" x2="8" y2="13" stroke="#94a3b8" stroke-width="2"/><line x1="16" y1="17" x2="8" y2="17" stroke="#94a3b8" stroke-width="2"/><polyline points="10 9 9 9 8 9" stroke="#94a3b8" stroke-width="2"/>`
    : `<rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="${accentColor}" stroke-width="2"/><line x1="8" y1="21" x2="16" y2="21" stroke="${accentColor}" stroke-width="2"/><line x1="12" y1="17" x2="12" y2="21" stroke="${accentColor}" stroke-width="2"/><circle cx="9" cy="10" r="2" fill="${accentColor}" opacity="0.6"/><path d="M15 13v-3l-3 3" stroke="${accentColor}" stroke-width="1.5"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="100%" height="100%">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="400" height="260" rx="12" fill="url(#grad)" />
  <g transform="translate(30, 25)">
    <!-- Document Card Mockup -->
    <rect x="0" y="0" width="340" height="210" rx="8" fill="#ffffff" filter="url(#shadow)"/>
    <!-- Header band -->
    <rect x="0" y="0" width="340" height="36" rx="8" fill="${accentColor}"/>
    <rect x="0" y="24" width="340" height="12" fill="${accentColor}"/>
    
    <!-- Type Icon -->
    <g transform="translate(20, 52) scale(1.1)">
      ${icon}
    </g>

    <!-- Badge -->
    <rect x="220" y="52" width="100" height="22" rx="11" fill="#f1f5f9"/>
    <text x="270" y="67" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">${escapeXml(category.toUpperCase())}</text>

    <!-- Title -->
    <text x="20" y="112" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="bold" fill="#0f172a">${escapeXml(title.length > 28 ? title.slice(0, 25) + '...' : title)}</text>

    <!-- Content mock lines -->
    <rect x="20" y="130" width="280" height="6" rx="3" fill="#e2e8f0"/>
    <rect x="20" y="144" width="240" height="6" rx="3" fill="#e2e8f0"/>
    <rect x="20" y="158" width="200" height="6" rx="3" fill="#e2e8f0"/>

    <!-- Footer pill -->
    <rect x="20" y="180" width="80" height="16" rx="4" fill="${accentColor}" opacity="0.15"/>
    <text x="60" y="192" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="bold" fill="${accentColor}" text-anchor="middle">${isDoc ? 'DOCX TEMPLATE' : 'PPTX SLIDES'}</text>
  </g>
</svg>`;

  const filePath = path.join(STORAGE_ROOT, 'thumbnails', filename);
  await fs.writeFile(filePath, svg, 'utf-8');
  return `/thumbnails/${filename}`;
}

// 1. Generate Business Proposal DOCX
async function generateBusinessProposalDocx(): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'BUSINESS PROPOSAL',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Client: ', bold: true }),
              new TextRun('Acme Corporation\n'),
              new TextRun({ text: 'Prepared By: ', bold: true }),
              new TextRun('Nova Solutions Ltd.\n'),
              new TextRun({ text: 'Date: ', bold: true }),
              new TextRun(new Date().toLocaleDateString() + '\n'),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: '1. Executive Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: 'This business proposal outlines our strategic approach to delivering high-performance cloud migration, scalable architectures, and document workflow automation. Our proven delivery framework ensures minimal operational downtime while accelerating time-to-market.',
            spacing: { after: 180 },
          }),
          new Paragraph({
            text: '2. Project Scope & Deliverables',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            children: [
              new TextRun('• Cloud Architecture Assessment and Gap Analysis\n'),
              new TextRun('• Microservices and Modular Monolith Implementation\n'),
              new TextRun('• Automated CI/CD Pipelines and Observability Stack\n'),
              new TextRun('• Enterprise Document and File Processing Engine\n'),
            ],
            spacing: { after: 180 },
          }),
          new Paragraph({
            text: '3. Investment & Commercial Terms',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Milestone', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Duration', bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Cost (USD)', bold: true })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Phase 1: Architecture & Prototyping')] }),
                  new TableCell({ children: [new Paragraph('4 Weeks')] }),
                  new TableCell({ children: [new Paragraph('$15,000')] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph('Phase 2: Core Platform Delivery')] }),
                  new TableCell({ children: [new Paragraph('8 Weeks')] }),
                  new TableCell({ children: [new Paragraph('$30,000')] }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// 2. Generate Employment Contract DOCX
async function generateEmploymentContractDocx(): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'EMPLOYMENT CONTRACT',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'This Employment Agreement ("Agreement") is made between Nova Solutions Ltd. ("Employer") and the Employee ("Employee").',
            spacing: { after: 150 },
          }),
          new Paragraph({
            text: '1. Position & Duties',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: 'The Employee shall serve in the capacity of Senior Software Engineer, reporting to the Head of Engineering, and shall perform all duties commensurate with this role with professionalism and diligence.',
            spacing: { after: 150 },
          }),
          new Paragraph({
            text: '2. Compensation & Benefits',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: 'The Employee will receive a gross annual base salary of $85,000, payable in bi-weekly installments, along with comprehensive medical insurance, annual performance bonuses, and 20 days paid annual leave.',
            spacing: { after: 150 },
          }),
          new Paragraph({
            text: '3. Confidentiality & Intellectual Property',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            text: 'All inventions, software code, designs, and proprietary information developed during employment remain the sole intellectual property of the Employer.',
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// 3. Generate Meeting Minutes DOCX
async function generateMeetingMinutesDocx(): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'MEETING MINUTES',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 250 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Topic: ', bold: true }),
              new TextRun('Quarterly Architecture Review\n'),
              new TextRun({ text: 'Date & Time: ', bold: true }),
              new TextRun(new Date().toLocaleDateString() + ' 10:00 AM UTC\n'),
              new TextRun({ text: 'Attendees: ', bold: true }),
              new TextRun('Alex (Tech Lead), Sarah (Product Manager), David (DevOps Lead)\n'),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: '1. Agenda Discussion',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            text: 'The team reviewed the performance benchmarks of the modular document generation engine and finalized the storage migration plan.',
            spacing: { after: 150 },
          }),
          new Paragraph({
            text: '2. Action Items',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun('• Alex: Finalize OpenXML template validation scripts by Friday\n'),
              new TextRun('• Sarah: Review user acceptance testing criteria with QA team\n'),
              new TextRun('• David: Configure staging environment with automated health checks\n'),
            ],
            spacing: { after: 150 },
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// 4. Generate Project Report DOCX
async function generateProjectReportDocx(): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'PROJECT STATUS REPORT',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 250 },
          }),
          new Paragraph({
            text: 'Project: SaaS Template Library Platform Phase 1',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 150 },
          }),
          new Paragraph({
            text: '1. Executive Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            text: 'Overall project health is ON TRACK. Backend RESTful APIs, physical file clone mechanics, and database persistence have been verified with 100% test coverage on core flows.',
            spacing: { after: 150 },
          }),
          new Paragraph({
            text: '2. Key Milestones Completed',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun('✔ Modular Monolith architecture implemented with Clean separation\n'),
              new TextRun('✔ High-fidelity DOCX OpenXML generation & Mammoth HTML previewing\n'),
              new TextRun('✔ Multi-slide PPTX generator and atomic copy operations\n'),
              new TextRun('✔ Path traversal and input security validation\n'),
            ],
            spacing: { after: 150 },
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// 5. Generate Business Letter DOCX
async function generateBusinessLetterDocx(): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'FORMAL BUSINESS LETTER',
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Nova Solutions Ltd.\n', bold: true }),
              new TextRun('100 Innovation Way, Tech Park\n'),
              new TextRun(`Date: ${new Date().toLocaleDateString()}\n\n`),
              new TextRun({ text: 'To: Prospective Partner\n', bold: true }),
              new TextRun('Global Enterprise Alliance\n'),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Dear Sir / Madam,',
            spacing: { after: 150 },
          }),
          new Paragraph({
            text: 'We are pleased to introduce our enterprise document and template management solutions. Our platform provides centralized template governance, guaranteed immutable source files, and high-speed document generation.',
            spacing: { after: 150 },
          }),
          new Paragraph({
            text: 'We welcome the opportunity to discuss how our technological solutions can optimize your team productivity and operational efficiency.',
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun('Sincerely,\n\n'),
              new TextRun({ text: 'Jonathan Vance\n', bold: true }),
              new TextRun('Chief Executive Officer\nNova Solutions Ltd.'),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

// PPTX 1: Business Pitch Deck
async function generatePitchDeckPptx(): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  // Slide 1: Cover
  const slide1 = pptx.addSlide();
  slide1.background = { color: '0F172A' };
  slide1.addText('BUSINESS PITCH DECK', {
    x: 1.0,
    y: 2.2,
    w: 8.0,
    h: 1.2,
    fontSize: 40,
    color: 'FFFFFF',
    bold: true,
  });
  slide1.addText('Next-Generation SaaS Document Automation Platform', {
    x: 1.0,
    y: 3.5,
    w: 8.0,
    h: 0.8,
    fontSize: 20,
    color: '38BDF8',
  });
  slide1.addText('Presented by Founder & Tech Leadership', {
    x: 1.0,
    y: 5.5,
    w: 8.0,
    h: 0.5,
    fontSize: 14,
    color: '94A3B8',
  });

  // Slide 2: Problem & Solution
  const slide2 = pptx.addSlide();
  slide2.addText('The Problem & Our Solution', {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.8,
    fontSize: 28,
    color: '0F172A',
    bold: true,
  });
  slide2.addText(
    'Problem: Enterprises waste over 20% of engineering & administrative hours manually reformatting documents, managing broken slide decks, and risking template corruption.',
    {
      x: 0.8,
      y: 1.8,
      w: 8.4,
      h: 1.2,
      fontSize: 16,
      color: '475569',
    }
  );
  slide2.addText(
    'Solution: A centralized, high-performance Modular Monolith template platform that provides guaranteed immutable originals, instant cloning, and OpenXML compatibility.',
    {
      x: 0.8,
      y: 3.3,
      w: 8.4,
      h: 1.2,
      fontSize: 16,
      color: '0284C7',
      bold: true,
    }
  );

  // Slide 3: Market Size & Traction
  const slide3 = pptx.addSlide();
  slide3.addText('Market Opportunity & Roadmap', {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.8,
    fontSize: 28,
    color: '0F172A',
    bold: true,
  });
  slide3.addText(
    '• TAM: $14.5 Billion document workflow & office productivity software market\n• SAM: $3.2 Billion enterprise cloud template solutions\n• Q1 Target: 10,000 active document clones per month\n• Q2 Target: Slide editor integration & enterprise SSO',
    {
      x: 0.8,
      y: 1.8,
      w: 8.4,
      h: 3.2,
      fontSize: 18,
      color: '334155',
      bullet: true,
    }
  );

  const buffer = (await pptx.write({ outputType: 'nodebuffer' })) as Buffer;
  return buffer;
}

// PPTX 2: Company Profile
async function generateCompanyProfilePptx(): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  // Slide 1
  const slide1 = pptx.addSlide();
  slide1.background = { color: '1E293B' };
  slide1.addText('COMPANY PROFILE', {
    x: 1.0,
    y: 2.2,
    w: 8.0,
    h: 1.0,
    fontSize: 38,
    color: 'FFFFFF',
    bold: true,
  });
  slide1.addText('Nova Solutions Ltd. — Engineering Excellence', {
    x: 1.0,
    y: 3.3,
    w: 8.0,
    h: 0.8,
    fontSize: 20,
    color: '818CF8',
  });

  // Slide 2: About Us
  const slide2 = pptx.addSlide();
  slide2.addText('About Nova Solutions', {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.8,
    fontSize: 26,
    color: '1E293B',
    bold: true,
  });
  slide2.addText(
    'Founded with a mission to simplify enterprise document automation, Nova Solutions builds scalable cloud services, robust RESTful APIs, and responsive web platforms trusted by leading SaaS companies worldwide.',
    {
      x: 0.8,
      y: 1.8,
      w: 8.4,
      h: 1.6,
      fontSize: 16,
      color: '475569',
    }
  );

  // Slide 3: Core Services
  const slide3 = pptx.addSlide();
  slide3.addText('Core Competencies & Services', {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.8,
    fontSize: 26,
    color: '1E293B',
    bold: true,
  });
  slide3.addText(
    '1. High-Performance Template Management & Document Cloning\n2. Clean Architecture Cloud APIs (Node.js, Express, PostgreSQL)\n3. Modern React & TypeScript Web User Experiences\n4. Zero-Trust Storage Security & Path Traversal Prevention',
    {
      x: 0.8,
      y: 1.8,
      w: 8.4,
      h: 3.0,
      fontSize: 16,
      color: '334155',
    }
  );

  const buffer = (await pptx.write({ outputType: 'nodebuffer' })) as Buffer;
  return buffer;
}

// PPTX 3: Project Presentation
async function generateProjectPresentationPptx(): Promise<Buffer> {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  // Slide 1
  const slide1 = pptx.addSlide();
  slide1.background = { color: '047857' };
  slide1.addText('PROJECT PRESENTATION', {
    x: 1.0,
    y: 2.2,
    w: 8.0,
    h: 1.0,
    fontSize: 38,
    color: 'FFFFFF',
    bold: true,
  });
  slide1.addText('Architecture, Deliverables & Roadmap', {
    x: 1.0,
    y: 3.3,
    w: 8.0,
    h: 0.8,
    fontSize: 20,
    color: 'A7F3D0',
  });

  // Slide 2: Architecture Highlights
  const slide2 = pptx.addSlide();
  slide2.addText('System Architecture Highlights', {
    x: 0.8,
    y: 0.6,
    w: 8.4,
    h: 0.8,
    fontSize: 26,
    color: '065F46',
    bold: true,
  });
  slide2.addText(
    '• Modular Monolith: Routes -> Controllers -> Services -> Repositories -> Storage\n• Zero Template Mutation: Originals are strictly read-only and preserved\n• Fast Physical Copying: Sub-millisecond stream cloning\n• Full OpenXML Compatibility: Works seamlessly in MS Office and LibreOffice',
    {
      x: 0.8,
      y: 1.8,
      w: 8.4,
      h: 3.0,
      fontSize: 16,
      color: '334155',
    }
  );

  const buffer = (await pptx.write({ outputType: 'nodebuffer' })) as Buffer;
  return buffer;
}

export async function seed() {
  console.log('🚀 Starting Seed Process...');

  await ensureDir(path.join(STORAGE_ROOT, 'templates', 'documents'));
  await ensureDir(path.join(STORAGE_ROOT, 'templates', 'presentations'));
  await ensureDir(path.join(STORAGE_ROOT, 'generated', 'documents'));
  await ensureDir(path.join(STORAGE_ROOT, 'generated', 'presentations'));
  await ensureDir(path.join(STORAGE_ROOT, 'thumbnails'));

  // 1. Seed DOCX Templates
  const docxList = [
    {
      name: 'Business Proposal',
      slug: 'business-proposal',
      category: 'Business',
      description: 'Comprehensive business proposal template featuring executive summary, project scope, and commercial investment tables.',
      accent: '#2563eb',
      generate: generateBusinessProposalDocx,
    },
    {
      name: 'Employment Contract',
      slug: 'employment-contract',
      category: 'Legal & HR',
      description: 'Standard employment agreement template outlining compensation, duties, intellectual property rights, and confidentiality terms.',
      accent: '#7c3aed',
      generate: generateEmploymentContractDocx,
    },
    {
      name: 'Meeting Minutes',
      slug: 'meeting-minutes',
      category: 'Operations',
      description: 'Clean meeting minutes layout for capturing agenda discussions, attendee lists, actionable decisions, and task deadlines.',
      accent: '#059669',
      generate: generateMeetingMinutesDocx,
    },
    {
      name: 'Project Status Report',
      slug: 'project-report',
      category: 'Management',
      description: 'Executive project status report summarizing milestone achievements, key health metrics, delivery risks, and roadmap updates.',
      accent: '#ea580c',
      generate: generateProjectReportDocx,
    },
    {
      name: 'Formal Business Letter',
      slug: 'business-letter',
      category: 'Communication',
      description: 'Professional correspondence template with formal company header, recipient metadata, body text formatting, and sign-off blocks.',
      accent: '#0891b2',
      generate: generateBusinessLetterDocx,
    },
  ];

  for (const item of docxList) {
    const filename = `${item.slug}.docx`;
    const relPath = `templates/documents/${filename}`;
    const absPath = path.join(STORAGE_ROOT, relPath);

    const buffer = await item.generate();
    await fs.writeFile(absPath, buffer);
    const { size } = await fs.stat(absPath);

    // Extract HTML preview using mammoth
    const { value: html } = await mammoth.convertToHtml({ buffer });

    // Generate SVG thumbnail
    const thumbUrl = await writeSvgThumbnail(
      `${item.slug}.svg`,
      item.name,
      item.category,
      'DOCUMENT',
      item.accent
    );

    await prisma.template.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        category: item.category,
        description: item.description,
        thumbnailUrl: thumbUrl,
        storagePath: relPath,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileSize: size,
        previewData: { html },
        isActive: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        type: TemplateType.DOCUMENT,
        category: item.category,
        description: item.description,
        thumbnailUrl: thumbUrl,
        storagePath: relPath,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileSize: size,
        previewData: { html },
        isActive: true,
      },
    });

    console.log(`  ✔ Seeded DOCX Template: ${item.name} (${size} bytes)`);
  }

  // 2. Seed PPTX Templates
  const pptxList = [
    {
      name: 'Business Pitch Deck',
      slug: 'business-pitch-deck',
      category: 'Pitch Decks',
      description: 'High-impact investor pitch presentation slides highlighting problem statement, market opportunity, solution, and growth roadmap.',
      accent: '#0284c7',
      generate: generatePitchDeckPptx,
      slides: [
        {
          slideNumber: 1,
          title: 'BUSINESS PITCH DECK',
          subtitle: 'Next-Generation SaaS Document Automation Platform',
          bullets: ['Executive presentation for investors & stakeholders'],
        },
        {
          slideNumber: 2,
          title: 'The Problem & Our Solution',
          subtitle: 'Enterprise productivity challenges solved',
          bullets: [
            'Over 20% of hours lost to document reformatting',
            'Template corruption risks eliminated with immutable storage',
            'Full OpenXML standard fidelity',
          ],
        },
        {
          slideNumber: 3,
          title: 'Market Opportunity & Roadmap',
          subtitle: 'Total Addressable Market & Growth Drivers',
          bullets: [
            'TAM: $14.5 Billion document workflow software market',
            'SAM: $3.2 Billion enterprise cloud template solutions',
            'Roadmap: Slide editor integration & collaborative cloud storage',
          ],
        },
      ],
    },
    {
      name: 'Company Profile',
      slug: 'company-profile',
      category: 'Corporate',
      description: 'Corporate overview slide deck detailing organization mission, leadership background, service competencies, and client case studies.',
      accent: '#6366f1',
      generate: generateCompanyProfilePptx,
      slides: [
        {
          slideNumber: 1,
          title: 'COMPANY PROFILE',
          subtitle: 'Nova Solutions Ltd. — Engineering Excellence',
          bullets: ['Overview of leadership, values, and client portfolio'],
        },
        {
          slideNumber: 2,
          title: 'About Nova Solutions',
          subtitle: 'Building Scalable Enterprise SaaS',
          bullets: ['Specialized in document automation & cloud APIs', 'Clean Architecture & modular microservices'],
        },
        {
          slideNumber: 3,
          title: 'Core Competencies',
          subtitle: 'What We Deliver',
          bullets: [
            'High-speed document cloning without template mutation',
            'Clean Architecture RESTful APIs',
            'Zero-trust storage security',
          ],
        },
      ],
    },
    {
      name: 'Project Presentation',
      slug: 'project-presentation',
      category: 'Technology',
      description: 'Engineering and architecture presentation deck for technical reviews, system highlights, and roadmap milestones.',
      accent: '#059669',
      generate: generateProjectPresentationPptx,
      slides: [
        {
          slideNumber: 1,
          title: 'PROJECT PRESENTATION',
          subtitle: 'Architecture, Deliverables & Roadmap',
          bullets: ['Technical review of Template Library Platform'],
        },
        {
          slideNumber: 2,
          title: 'System Architecture Highlights',
          subtitle: 'Modular Monolith Principles',
          bullets: [
            'Clean separation: Routes, Controllers, Services, Repositories',
            'Zero template mutation: originals are strictly read-only',
            'Sub-millisecond stream cloning and safe download',
          ],
        },
      ],
    },
  ];

  for (const item of pptxList) {
    const filename = `${item.slug}.pptx`;
    const relPath = `templates/presentations/${filename}`;
    const absPath = path.join(STORAGE_ROOT, relPath);

    const buffer = await item.generate();
    await fs.writeFile(absPath, buffer);
    const { size } = await fs.stat(absPath);

    const thumbUrl = await writeSvgThumbnail(
      `${item.slug}.svg`,
      item.name,
      item.category,
      'PRESENTATION',
      item.accent
    );

    await prisma.template.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        category: item.category,
        description: item.description,
        thumbnailUrl: thumbUrl,
        storagePath: relPath,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        fileSize: size,
        previewData: { slides: item.slides },
        isActive: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        type: TemplateType.PRESENTATION,
        category: item.category,
        description: item.description,
        thumbnailUrl: thumbUrl,
        storagePath: relPath,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        fileSize: size,
        previewData: { slides: item.slides },
        isActive: true,
      },
    });

    console.log(`  ✔ Seeded PPTX Template: ${item.name} (${size} bytes)`);
  }

  console.log('✅ Seed data completed successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
