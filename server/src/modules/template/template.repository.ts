import { prisma } from '../../config/db.js';
import { Template, TemplateType, Prisma } from '@prisma/client';

export interface TemplateFilterParams {
  type?: TemplateType;
  category?: string;
  search?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export class TemplateRepository {
  async findMany(filters: TemplateFilterParams): Promise<{ items: Template[]; total: number }> {
    const where: Prisma.TemplateWhereInput = {
      isActive: true,
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.category ? { category: { equals: filters.category, mode: 'insensitive' } } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: 'insensitive' } },
              { description: { contains: filters.search, mode: 'insensitive' } },
              { category: { contains: filters.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const skip = (filters.page - 1) * filters.limit;

    const [items, total] = await Promise.all([
      prisma.template.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: { [filters.sortBy]: filters.sortOrder },
      }),
      prisma.template.count({ where }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<Template | null> {
    return prisma.template.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Template | null> {
    return prisma.template.findUnique({
      where: { slug },
    });
  }

  async getDistinctCategories(type?: TemplateType): Promise<string[]> {
    const results = await prisma.template.findMany({
      where: {
        isActive: true,
        ...(type ? { type } : {}),
      },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return results.map((r) => r.category);
  }

  async create(data: Prisma.TemplateCreateInput): Promise<Template> {
    return prisma.template.create({ data });
  }

  async update(id: string, data: Prisma.TemplateUpdateInput): Promise<Template> {
    return prisma.template.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Template> {
    return prisma.template.update({
      where: { id },
      data: { isActive: false },
    });
  }
}

export const templateRepository = new TemplateRepository();
