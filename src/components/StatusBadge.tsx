import { Badge } from './Badge';
import { statusMeta, type Status } from '../lib/eol';

export interface StatusBadgeProps {
  /**
   * Any API status; sets both the Korean label and the color.
   * EOL: `SUPPORTED` 지원 중, `EOL_SOON` 종료 임박, `EOL` 종료, `UNKNOWN` 미확인.
   * Validation: `APPROVED` 승인, `REVIEW_REQUIRED` 검토 필요, `REJECTED` 거부.
   * Collection: `SUCCESS` 성공, `FAILED` 실패.
   */
  status: Status;
  /** Native tooltip, such as the failure reason of a collection. */
  title?: string;
}

/** Badge for an EOL, validation or collection status as returned by the API. */
export function StatusBadge({ status, title }: StatusBadgeProps) {
  const { label, tone } = statusMeta[status];
  return (
    <Badge tone={tone} title={title}>
      {label}
    </Badge>
  );
}
