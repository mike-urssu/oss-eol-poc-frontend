import { StatusBadge } from 'eol-poc-frontend';

const row = { display: 'flex', flexWrap: 'wrap', gap: 8 } as const;

export const EolStatuses = () => (
  <div style={row}>
    <StatusBadge status="SUPPORTED" />
    <StatusBadge status="EOL_SOON" />
    <StatusBadge status="EOL" />
    <StatusBadge status="UNKNOWN" />
  </div>
);
export const ValidationStatuses = () => (
  <div style={row}>
    <StatusBadge status="APPROVED" />
    <StatusBadge status="REVIEW_REQUIRED" />
    <StatusBadge status="REJECTED" />
  </div>
);
export const CollectionStatuses = () => (
  <div style={row}>
    <StatusBadge status="SUCCESS" />
    <StatusBadge status="FAILED" title="HTTP 503 (https://www.postgresql.org/support/versioning/)" />
  </div>
);
