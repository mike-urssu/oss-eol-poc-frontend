import type { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Accessible name for the select (not shown visually); make the first option's label say what it filters. */
  label: string;
  options: SelectOption[];
}

/** Compact dropdown for list filters; sits next to SearchField in a Panel's `actions`. */
export function Select({ label, options, className, ...rest }: SelectProps) {
  return (
    <select aria-label={label} className={`lc-select${className ? ` ${className}` : ''}`} {...rest}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
