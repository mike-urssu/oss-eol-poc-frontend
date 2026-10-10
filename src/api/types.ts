// Response shapes from eol-poc-backend docs/design.md §6.
import type { CollectionStatus, EolStatus, PreciseDate, ValidationStatus } from '../lib/eol';

export interface OpensourceSummary {
  slug: string;
  name: string;
  latestVersion: string | null;
  versionCount: number;
  eolSummary: Record<EolStatus, number>;
  lastCollectedAt: string | null;
  collectionStatus: CollectionStatus | null;
  collectionError: string | null;
}

export interface OpensourceFilter {
  q?: string;
  eolStatus?: EolStatus | '';
  collectionStatus?: CollectionStatus | '';
}

export interface Source {
  id: number;
  url: string;
  collectorType: 'API' | 'WEB' | 'GITHUB';
  trustLevel: 'OFFICIAL' | 'SECONDARY';
  active: boolean;
  lastCollection: {
    id: number;
    status: CollectionStatus;
    skippedUnchanged: boolean;
    finishedAt: string | null;
    error: string | null;
  } | null;
}

export interface VersionRow {
  version: string;
  latestPatchVersion: string | null;
  releaseDate: PreciseDate | null;
  eolDate: PreciseDate | null;
  securityEolDate: PreciseDate | null;
  eolStatus: EolStatus;
  validationStatus: ValidationStatus | null;
  sourceUrls: string[];
}

export interface OpensourceDetail {
  slug: string;
  name: string;
  homepageUrl: string;
  description?: string | null;
  latestVersion: string | null;
  sources: Source[];
  versions: VersionRow[];
}

export interface Api {
  listOpensources(filter: OpensourceFilter): Promise<OpensourceSummary[]>;
  getOpensource(slug: string): Promise<OpensourceDetail>;
  /** Starts collection asynchronously (202). Rejects with ApiError 409 while one is running. */
  recollect(slug: string, sourceId?: number): Promise<{ collectionIds: number[] }>;
}
