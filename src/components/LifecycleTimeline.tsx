import { parseDate, todayUTC, type EolStatus } from '../lib/eol';

export interface TimelineVersion {
  version: string;
  /** Release date `yyyy-MM-dd`; versions without one show an empty track. */
  release?: string | null;
  /** End of general support (EOL date); `null` = not published, the bar runs to the chart's end. */
  eol?: string | null;
  /** End of security-only support, when the project publishes one beyond `eol`. */
  securityEol?: string | null;
  /** EOL status from the API; colors the general-support bar. */
  status: EolStatus;
}

export interface LifecycleTimelineProps {
  /** Versions to draw, newest first. */
  versions: TimelineVersion[];
  /** Reference date `yyyy-MM-dd` for the "today" marker; defaults to the current date. */
  today?: string;
}

const yearOf = (t: number) => new Date(t).getUTCFullYear();

/**
 * Gantt-style support timeline: one row per version, green during general support,
 * blue for the security-only period, grey once ended, with a black "today" line. Pair with `LifecycleLegend`.
 */
export function LifecycleTimeline({ versions, today }: LifecycleTimelineProps) {
  const now = today ? parseDate(today) : todayUTC();
  const dates = (pick: (v: TimelineVersion) => string | null | undefined) => versions.map(pick).filter((d): d is string => !!d).map(parseDate);
  const rel = dates((v) => v.release);
  const startY = rel.length ? Math.min(...rel.map(yearOf)) : yearOf(now) - 1;
  const endY = Math.max(yearOf(now) + 1, ...[...dates((v) => v.eol), ...dates((v) => v.securityEol)].map(yearOf)) + 1;
  const t0 = Date.UTC(startY, 0, 1);
  const t1 = Date.UTC(endY, 0, 1);
  const pct = (t: number) => Math.max(0, Math.min(100, ((t - t0) / (t1 - t0)) * 100));
  const step = endY - startY > 12 ? 2 : 1;
  const years = Array.from({ length: endY - startY + 1 }, (_, i) => startY + i);
  const grid = years.map((y) => pct(Date.UTC(y, 0, 1)));
  const bar = (from: number, to: number, cls: string, color: string) => (
    <span className={`lc-timeline__bar ${cls}`} style={{ left: `${pct(from)}%`, width: `${pct(to) - pct(from)}%`, background: color }} />
  );

  return (
    <div className="lc-timeline-wrap">
      <div className="lc-timeline" role="img" aria-label="버전별 지원 기간 타임라인">
        <div className="lc-timeline__row">
          <div className="lc-timeline__label" />
          <div className="lc-timeline__axis">
            {years.map((y, i) =>
              (y - startY) % step === 0 && y < endY ? (
                <span key={y} className="lc-timeline__year" style={{ left: `${grid[i]}%` }}>
                  {y}
                </span>
              ) : null,
            )}
          </div>
        </div>
        {versions.map((v) => {
          const start = v.release ? parseDate(v.release) : null;
          const end = v.eol ? parseDate(v.eol) : t1;
          const sec = v.eol && v.securityEol ? parseDate(v.securityEol) : null;
          const general = v.status === 'EOL' ? 'var(--lc-timeline-ended)' : v.status === 'UNKNOWN' ? 'var(--lc-timeline-unknown)' : 'var(--lc-timeline-active)';
          return (
            <div key={v.version} className="lc-timeline__row">
              <div className="lc-timeline__label">{v.version}</div>
              <div className="lc-timeline__track">
                {grid.map((g, gi) => (
                  <span key={gi} className="lc-timeline__grid" style={{ left: `${g}%` }} aria-hidden="true" />
                ))}
                {start !== null && bar(start, end, sec ? 'lc-timeline__bar--active' : 'lc-timeline__bar--full', general)}
                {start !== null && sec !== null && bar(end, sec, 'lc-timeline__bar--security', sec < now ? 'var(--lc-timeline-ended-tail)' : 'var(--lc-timeline-security)')}
                <span className="lc-timeline__today" style={{ left: `${pct(now)}%` }} aria-hidden="true" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Color key for `LifecycleTimeline`; place in the surrounding Panel's `actions`. */
export function LifecycleLegend() {
  const items = [
    ['일반 지원', 'var(--lc-timeline-active)'],
    ['보안 지원만', 'var(--lc-timeline-security)'],
    ['지원 종료됨', 'var(--lc-timeline-ended)'],
  ];
  return (
    <ul className="lc-legend">
      {items.map(([label, color]) => (
        <li key={label} className="lc-legend__item">
          <span className="lc-legend__swatch" style={{ background: color }} aria-hidden="true" />
          {label}
        </li>
      ))}
      <li className="lc-legend__item">
        <span className="lc-legend__swatch lc-legend__swatch--today" aria-hidden="true" />
        오늘
      </li>
    </ul>
  );
}
