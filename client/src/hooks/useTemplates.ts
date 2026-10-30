import { useState, useEffect, useCallback, useRef } from 'react';
import { Template, TemplateType, PaginationMeta } from '../types/template.types.ts';
import { templateService } from '../services/template.service.ts';

interface UseTemplatesOptions {
  initialType?: TemplateType;
  initialCategory?: string;
  limit?: number;
}

export function useTemplates({ initialType = 'DOCUMENT', initialCategory = '', limit = 12 }: UseTemplatesOptions = {}) {
  const [type, setType] = useState<TemplateType>(initialType);
  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch categories when type changes
  const loadCategories = useCallback(async (currentType: TemplateType) => {
    try {
      const cats = await templateService.getCategories(currentType);
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  // Fetch templates list
  const loadTemplates = useCallback(
    async (targetType: TemplateType, targetCategory: string, targetSearch: string, targetPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const response = await templateService.getTemplates({
          type: targetType,
          category: targetCategory || undefined,
          search: targetSearch.trim() || undefined,
          page: targetPage,
          limit,
        });
        setTemplates(response.data);
        if (response.meta) {
          setPagination(response.meta);
        }
      } catch (err) {
        setError((err as Error).message || 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Trigger search with debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      loadTemplates(type, category, search, page);
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [type, category, search, page, loadTemplates]);

  // Update categories whenever type changes
  useEffect(() => {
    loadCategories(type);
    setCategory(''); // reset category on type switch
    setPage(1);
  }, [type, loadCategories]);

  const handleSetType = (newType: TemplateType) => {
    setType(newType);
  };

  const handleSetCategory = (newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSetSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleRetry = () => {
    loadTemplates(type, category, search, page);
    loadCategories(type);
  };

  return {
    templates,
    categories,
    pagination,
    loading,
    error,
    type,
    category,
    search,
    page,
    setType: handleSetType,
    setCategory: handleSetCategory,
    setSearch: handleSetSearch,
    setPage,
    retry: handleRetry,
  };
}
