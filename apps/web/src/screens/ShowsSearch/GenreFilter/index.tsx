import { ToggleGroup, ToggleGroupItem } from '@tv-shows-explorer/ui-kit';
import { type GenreFilterProps, usePresenter } from './usePresenter';

export function GenreFilter(props: GenreFilterProps) {
  const { isHidden, chips, value, onValueChange } = usePresenter(props);

  if (isHidden) return null;

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      spacing={2}
      value={value}
      onValueChange={onValueChange}
      aria-label="Filter by genre"
      className="w-full flex-wrap"
    >
      {chips.map((chip) => (
        <ToggleGroupItem
          key={chip.value}
          value={chip.value}
          aria-label={chip.ariaLabel}
          className="h-10 border-foreground px-3 text-[0.8125rem] shadow-none hover:bg-muted hover:text-foreground"
        >
          {chip.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
