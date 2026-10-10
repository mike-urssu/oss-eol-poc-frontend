// ponytail: fixture-backed Api for `npm run dev:mock`; delete once the backend serves §6 of docs/design.md.
import { daysUntil, type EolStatus, type PreciseDate } from '../lib/eol';
import { catalog } from './mock-data';
import type { Api, OpensourceDetail, OpensourceSummary, VersionRow } from './types';

const day = (date: string | null): PreciseDate | null => (date ? { date, precision: 'DAY' } : null);
const judge = (eol: string | null): EolStatus => {
  if (!eol) return 'UNKNOWN';
  const d = daysUntil(eol);
  return d < 0 ? 'EOL' : d <= 90 ? 'EOL_SOON' : 'SUPPORTED';
};
const FAILED = new Set(['react']);
const COLLECTED_AT = '2026-10-10T18:00:00Z';

function detail(slug: string): OpensourceDetail | undefined {
  const p = catalog.find((c) => c.id === slug);
  if (!p) return undefined;
  const failed = FAILED.has(p.id);
  const versions: VersionRow[] = p.versions.map((v) => {
    // Fixture `activeEnd` = end of general support, `eol` = end of all support.
    const eol = v.activeEnd ?? v.eol ?? null;
    return {
      version: v.version,
      latestPatchVersion: null,
      releaseDate: day(v.release),
      eolDate: day(eol),
      securityEolDate: v.activeEnd ? day(v.eol ?? null) : null,
      eolStatus: judge(eol),
      validationStatus: p.ai === 'review' ? 'REVIEW_REQUIRED' : 'APPROVED',
      sourceUrls: [p.home],
    };
  });
  return {
    slug: p.id,
    name: p.title,
    homepageUrl: p.home,
    description: p.desc,
    latestVersion: p.latest,
    sources: [
      {
        id: 1,
        url: p.home,
        collectorType: 'WEB',
        trustLevel: 'OFFICIAL',
        active: true,
        lastCollection: { id: 31, status: failed ? 'FAILED' : 'SUCCESS', skippedUnchanged: !failed, finishedAt: COLLECTED_AT, error: failed ? `HTTP 503 (${p.home})` : null },
      },
    ],
    versions,
  };
}

function summary(d: OpensourceDetail): OpensourceSummary {
  const eolSummary: Record<EolStatus, number> = { EOL: 0, EOL_SOON: 0, SUPPORTED: 0, UNKNOWN: 0 };
  d.versions.forEach((v) => eolSummary[v.eolStatus]++);
  const last = d.sources[0].lastCollection!;
  return { slug: d.slug, name: d.name, latestVersion: d.latestVersion, versionCount: d.versions.length, eolSummary, lastCollectedAt: last.finishedAt, collectionStatus: last.status, collectionError: last.error };
}

const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 150));

export const mockApi: Api = {
  listOpensources: ({ q = '', eolStatus, collectionStatus }) =>
    delay(
      catalog
        .map((c) => summary(detail(c.id)!))
        .filter((s) => s.name.toLowerCase().includes(q.trim().toLowerCase()))
        .filter((s) => !eolStatus || s.eolSummary[eolStatus] > 0)
        .filter((s) => !collectionStatus || s.collectionStatus === collectionStatus),
    ),
  getOpensource: (slug) => {
    const d = detail(slug);
    return d ? delay(d) : Promise.reject(new Error(`'${slug}' 오픈소스를 찾을 수 없습니다.`));
  },
  recollect: () => delay({ collectionIds: [41] }),
};
