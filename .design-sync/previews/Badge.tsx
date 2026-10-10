import { Badge } from 'eol-poc-frontend';

export const Tones = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    <Badge tone="success">확인됨</Badge>
    <Badge tone="warning">검토 필요</Badge>
    <Badge tone="danger">지원 종료</Badge>
    <Badge tone="info">보안 지원만</Badge>
    <Badge tone="neutral">런타임</Badge>
  </div>
);
export const Category = () => <Badge tone="neutral">데이터베이스</Badge>;
export const Recommended = () => (
  <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', fontFamily: 'var(--lc-font-mono)', fontWeight: 500 }}>
    3.14 <Badge tone="accent">권장</Badge>
  </span>
);
