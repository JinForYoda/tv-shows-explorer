import {
  Button,
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@tv-shows-explorer/ui-kit';
import { type PagerProps, usePresenter } from './usePresenter';

const pageButton =
  'border-foreground bg-transparent tabular-nums shadow-none aria-[current=page]:border-primary aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground dark:bg-transparent';

export function Pager(props: PagerProps) {
  const { isHidden, items, isFirst, isLast, onPrevious, onNext } =
    usePresenter(props);

  if (isHidden) return null;

  return (
    <Pagination aria-label="Pages">
      <PaginationContent className="flex-wrap justify-center gap-1.5">
        <PaginationItem>
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Previous page"
            disabled={isFirst}
            onClick={onPrevious}
            className={pageButton}
          >
            <span aria-hidden="true">‹</span>
          </Button>
        </PaginationItem>
        {items.map((item) => (
          <PaginationItem key={item.page}>
            <Button
              variant="outline"
              size="icon-lg"
              aria-label={item.label}
              aria-current={item.ariaCurrent}
              onClick={item.onSelect}
              className={pageButton}
            >
              {item.page}
            </Button>
          </PaginationItem>
        ))}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Next page"
            disabled={isLast}
            onClick={onNext}
            className={pageButton}
          >
            <span aria-hidden="true">›</span>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
