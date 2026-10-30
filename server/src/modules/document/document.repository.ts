import { prisma } from '../../config/db.js';
import { Document, TemplateType, Prisma } from '@prisma/client';

export interface DocumentFilterParams {
  type?: TemplateType;
  search?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class DocumentRepository {
  async findMany(filters: DocumentFilterParams): Promise<{ items: (Document & { template: { name: string; category: string } | null })[]; total: number }> {
    const where: Prisma.DocumentWhereInput = {
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.search
        ? {
            OR: [
              { title: { contains: filters.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const skip = (filters.page - 1) * filters.limit;

    const [items, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { [filters.sortBy]: filters.sortOrder },
        include: {
          template: {
            select: { name: true, category: true },
          },
        },
      }),
      prisma.document.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: {
        template: {
          select: { name: true, category: true, description: true, thumbnailUrl: true },
        },
      },
    });
  }

  async create(data: Prisma.DocumentCreateInput): Promise<Document> {
    return prisma.document.create({ data });
  }

  async update(id: string, data: Prisma.DocumentUpdateInput): Promise<Document> {
    return prisma.document.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Document> {
    return prisma.document.delete({
      where: { id },
    });
  }
}

export const documentRepository = new DocumentRepository();
