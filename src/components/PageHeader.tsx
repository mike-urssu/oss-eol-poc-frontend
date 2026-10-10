import type { ReactNode } from 'react';

export interface PageHeaderProps {
  /** Page title (rendered as `<h1>`). */
  title: ReactNode;
  /** One-line muted description under the title. */
  description?: ReactNode;
  /** Badge(s) placed right after the title, such as a category. */
  badge?: ReactNode;
  /** Page-level Buttons, right-aligned; put the `primary` one last. */
  actions?: ReactNode;
}

/** Top of a page: title, description and page actions. */
export function PageHeader({ title, description, badge, actions }: PageHeaderProps) {
  return (
    <header className="lc-pageheader">
      <div className="lc-pageheader__text">
        <div className="lc-pageheader__titlerow">
          <h1 className="lc-pageheader__title">{title}</h1>
          {badge}
        </div>
        {description && <p className="lc-pageheader__desc">{description}</p>}
      </div>
      {actions && <div className="lc-pageheader__actions">{actions}</div>}
    </header>
  );
}
