export type PagerProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export type PagerItem = {
  page: number;
  label: string;
  ariaCurrent: 'page' | undefined;
  onSelect: () => void;
};

export function usePresenter({ page, pageCount, onPageChange }: PagerProps) {
  const items: PagerItem[] = Array.from({ length: pageCount }, (_, index) => {
    const itemPage = index + 1;
    return {
      page: itemPage,
      label: `Page ${itemPage}`,
      ariaCurrent: itemPage === page ? 'page' : undefined,
      onSelect: () => onPageChange(itemPage),
    };
  });

  return {
    isHidden: pageCount <= 1,
    items,
    isFirst: page <= 1,
    isLast: page >= pageCount,
    onPrevious: () => onPageChange(page - 1),
    onNext: () => onPageChange(page + 1),
  };
}
