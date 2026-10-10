import type { ReactNode } from 'react';

export interface SideNavItem {
  label: string;
  /** Marks the current section. */
  active?: boolean;
  href?: string;
  onClick?: () => void;
}

export interface SideNavProps {
  /** Product name next to the logo mark. */
  brand?: string;
  items: SideNavItem[];
  /** Muted text pinned to the bottom such as the schedule and last run. */
  footer?: ReactNode;
}

/** Dark left navigation with the Lifecycle logo mark. Pass to `AppShell`'s `sidebar`. */
export function SideNav({ brand = 'Lifecycle', items, footer }: SideNavProps) {
  return (
    <nav aria-label="주 메뉴" className="lc-sidenav">
      <div className="lc-sidenav__brand">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="26" height="26" rx="6" stroke="var(--lc-color-nav-fg)" strokeWidth="2" />
          <path d="M8 14h12M14 8v12" stroke="var(--lc-color-accent)" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        {brand}
      </div>
      <ul className="lc-sidenav__items">
        {items.map((it) => (
          <li key={it.label}>
            {it.href ? (
              <a className="lc-sidenav__item" href={it.href} aria-current={it.active ? 'page' : undefined}>
                {it.label}
              </a>
            ) : (
              <button type="button" className="lc-sidenav__item" onClick={it.onClick} aria-current={it.active ? 'page' : undefined}>
                {it.label}
              </button>
            )}
          </li>
        ))}
      </ul>
      {footer && <div className="lc-sidenav__footer">{footer}</div>}
    </nav>
  );
}

export interface AppShellProps {
  /** Usually a `<SideNav>`. */
  sidebar: ReactNode;
  /** Page content; stacked with 24px gaps. */
  children?: ReactNode;
}

/** Root page layout: sidebar + main column on the app background. Wrap every screen in it. */
export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="lc-shell">
      {sidebar}
      <main className="lc-shell__main">{children}</main>
    </div>
  );
}
