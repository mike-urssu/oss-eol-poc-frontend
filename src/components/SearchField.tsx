import type { InputHTMLAttributes } from 'react';

export interface SearchFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Accessible name for the input (not shown visually). */
  label: string;
}

/** Search input with a magnifier icon. Controlled or uncontrolled like a native `<input>`. */
export function SearchField({ label, className, ...rest }: SearchFieldProps) {
  return (
    <label className={`lc-search${className ? ` ${className}` : ''}`}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="5" stroke="var(--lc-color-ink-muted)" strokeWidth="1.6" />
        <path d="M11 11l3.5 3.5" stroke="var(--lc-color-ink-muted)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <input type="search" aria-label={label} className="lc-search__input" {...rest} />
    </label>
  );
}
