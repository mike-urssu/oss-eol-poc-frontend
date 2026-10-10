import type { ReactNode } from 'react';

export interface DescriptionListItem {
  label: ReactNode;
  value: ReactNode;
  /** Render the value in IBM Plex Mono (licenses, timestamps, versions). */
  mono?: boolean;
}

export interface DescriptionListProps {
  items: DescriptionListItem[];
}

/** Responsive label/value grid (`<dl>`) for key facts about an item. */
export function DescriptionList({ items }: DescriptionListProps) {
  return (
    <dl className="lc-dl">
      {items.map((it, i) => (
        <div key={i} className="lc-dl__item">
          <dt className="lc-dl__label">{it.label}</dt>
          <dd className={`lc-dl__value${it.mono ? ' lc-mono' : ''}`}>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}
