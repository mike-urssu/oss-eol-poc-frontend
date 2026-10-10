import type { ReactNode } from 'react';

export interface NoticeProps {
  /** `info` blue for progress and results · `danger` red for errors. */
  tone?: 'info' | 'danger';
  children: ReactNode;
}

/** One-line inline message for loading failures and action results, such as "수집을 시작했습니다". */
export function Notice({ tone = 'info', children }: NoticeProps) {
  return (
    <p className={`lc-notice lc-notice--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}
