'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, cn } from '@/shared/components/ui/button';

interface PaginationProps {
  total: number;
  limit: number;
  skip: number;
  onPageChange: (newSkip: number) => void;
  className?: string;
}

export const Pagination = ({ total, limit, skip, onPageChange, className }: PaginationProps) => {
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 1;

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);

    if (rangeStart > 2) pages.push('ellipsis');

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) pages.push('ellipsis');

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <p className="text-sm text-dashsuba-secondary">
        Showing{' '}
        <span className="font-semibold text-dashsuba-primary">{skip + 1}–{Math.min(skip + limit, total)}</span>
        {' '}of{' '}
        <span className="font-semibold text-dashsuba-primary">{total}</span>{' '}products
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => onPageChange(skip - limit)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {getPageNumbers().map((page, idx) =>
          page === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-sm text-dashsuba-secondary"
            >
              …
            </span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? 'secondary' : 'ghost'}
              size="icon"
              className={cn(
                'h-8 w-8 text-sm cursor-pointer',
                page === currentPage && 'font-bold',
              )}
              onClick={() => onPageChange((page - 1) * limit)}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Button>
          ),
        )}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 cursor-pointer"
          onClick={() => onPageChange(skip + limit)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
