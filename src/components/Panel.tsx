import { useId, type ReactNode } from 'react';

export interface PanelProps {
  /** Section heading (rendered as `<h2>`). */
  title: ReactNode;
  /** Optional count shown in mono after the title, such as the number of rows. */
  count?: ReactNode;
  /** Content placed after the title in the heading row (a Badge). */
  titleAddon?: ReactNode;
  /** Right side of the heading row: a SearchField, a LifecycleLegend, buttons. */
  actions?: ReactNode;
  /** Small muted footnote under the body, separated by a rule. */
  footer?: ReactNode;
  /** `true` removes body padding and divides the header - use for full-bleed content like DataTable. */
  flush?: boolean;
  children?: ReactNode;
}

/** White bordered card that groups one section of a page. */
export function Panel({ title, count, titleAddon, actions, footer, flush, children }: PanelProps) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={`lc-panel${flush ? ' lc-panel--flush' : ''}`}>
      <div className="lc-panel__header">
        <h2 id={id} className="lc-panel__title">
          <span>
            {title}
            {count !== undefined && <span className="lc-panel__count"> {count}</span>}
          </span>
          {titleAddon}
        </h2>
        {actions}
      </div>
      <div className="lc-panel__body">{children}</div>
      {footer && <div className="lc-panel__footer">{footer}</div>}
    </section>
  );
}
