/** EOL status computed by the backend from the general-support end date (90-day threshold for `EOL_SOON`). */
export type EolStatus = 'SUPPORTED' | 'EOL_SOON' | 'EOL' | 'UNKNOWN';
/** Validation result of the latest extracted candidate for a version. */
export type ValidationStatus = 'APPROVED' | 'REVIEW_REQUIRED' | 'REJECTED';
/** Result of the most recent collection run. */
export type CollectionStatus = 'SUCCESS' | 'FAILED';
export type Status = EolStatus | ValidationStatus | CollectionStatus;

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export const statusMeta: Record<Status, { label: string; tone: Tone }> = {
  SUPPORTED: { label: '지원 중', tone: 'success' },
  EOL_SOON: { label: '종료 임박', tone: 'warning' },
  EOL: { label: '종료', tone: 'danger' },
  UNKNOWN: { label: '미확인', tone: 'neutral' },
  APPROVED: { label: '승인', tone: 'success' },
  REVIEW_REQUIRED: { label: '검토 필요', tone: 'warning' },
  REJECTED: { label: '거부', tone: 'danger' },
  SUCCESS: { label: '성공', tone: 'success' },
  FAILED: { label: '실패', tone: 'danger' },
};

export type DatePrecision = 'DAY' | 'MONTH' | 'YEAR';
/** A date as the API sends it: `date` is `yyyy-MM-dd` (last day of the period when less precise). */
export interface PreciseDate {
  date: string;
  precision: DatePrecision;
}

/** Shows a date at its known precision: `2028-11-09`, `2027-11` or `2027`; `empty` when missing. */
export function formatDate(d: PreciseDate | null | undefined, empty = '-'): string {
  if (!d) return empty;
  return d.precision === 'YEAR' ? d.date.slice(0, 4) : d.precision === 'MONTH' ? d.date.slice(0, 7) : d.date;
}

/** UTC ISO timestamp → `yyyy-MM-dd HH:mm` in KST; `empty` when missing. */
export function formatDateTime(iso: string | null | undefined, empty = '-'): string {
  if (!iso) return empty;
  return new Date(iso).toLocaleString('sv-SE', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const DAY = 86_400_000;

export function parseDate(s: string): number {
  const [y, m, d] = s.split('-').map(Number);
  return Date.UTC(y, (m ?? 1) - 1, d ?? 1);
}

export function todayUTC(now = new Date()): number {
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Whole days from `today` until `date` (negative once passed). */
export function daysUntil(date: string, today = todayUTC()): number {
  return Math.round((parseDate(date) - today) / DAY);
}

/** Human remaining-time label: `D-42`, `약 2.3년`, `12일 경과`, or `—`. */
export function remainingLabel(eol: string | null | undefined, today = todayUTC()): string {
  if (!eol) return '—';
  const days = daysUntil(eol, today);
  if (days < 0) return `${-days}일 경과`;
  return days > 365 ? `약 ${(days / 365).toFixed(1)}년` : `D-${days}`;
}
