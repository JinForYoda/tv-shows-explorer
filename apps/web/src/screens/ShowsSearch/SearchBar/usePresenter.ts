import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

export const SEARCH_DEBOUNCE_MS = 400;

export type SearchBarProps = {
  onSearch: (text: string) => void;
};

export function usePresenter({ onSearch }: SearchBarProps) {
  const [draft, setDraft] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  const cancelPendingSearch = () => clearTimeout(timerRef.current);

  useEffect(() => {
    const timer = timerRef;
    return () => clearTimeout(timer.current);
  }, []);

  const onDraftChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setDraft(text);
    cancelPendingSearch();
    timerRef.current = setTimeout(() => onSearch(text), SEARCH_DEBOUNCE_MS);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    cancelPendingSearch();
    onSearch(draft);
  };

  const onClear = () => {
    cancelPendingSearch();
    setDraft('');
    onSearch('');
    inputRef.current?.focus();
  };

  return {
    draft,
    canClear: draft !== '',
    inputRef,
    onDraftChange,
    onSubmit,
    onClear,
  };
}
