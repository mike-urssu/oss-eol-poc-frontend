import { Badge, DataTable, RowLink, StatusBadge } from 'eol-poc-frontend';

const products = [
  { slug: 'postgresql', name: 'PostgreSQL', latest: '18', count: 6, summary: [['EOL', 1], ['EOL_SOON', 1], ['SUPPORTED', 4]], collectedAt: '2026-10-11 03:00', status: 'SUCCESS' as const },
  { slug: 'spring-boot', name: 'Spring Boot', latest: '4.0', count: 4, summary: [['EOL', 3], ['EOL_SOON', 1]], collectedAt: '2026-10-11 03:00', status: 'SUCCESS' as const },
  { slug: 'openssh', name: 'OpenSSH', latest: '10.1', count: 3, summary: [['UNKNOWN', 3]], collectedAt: '2026-10-11 03:01', status: 'FAILED' as const },
];
const tone = { EOL: 'danger', EOL_SOON: 'warning', SUPPORTED: 'success', UNKNOWN: 'neutral' } as const;
const label = { EOL: '종료', EOL_SOON: '종료 임박', SUPPORTED: '지원 중', UNKNOWN: '미확인' } as const;

export const ProductList = () => (
  <DataTable
    minWidth={760}
    rows={products}
    rowKey={(r) => r.slug}
    columns={[
      { key: 'name', header: '오픈소스', render: (r) => <RowLink>{r.name}</RowLink> },
      { key: 'latest', header: '최신 확인 버전', mono: true, render: (r) => r.latest },
      { key: 'count', header: '관리 버전', mono: true, render: (r) => r.count },
      {
        key: 'eol',
        header: 'EOL 상태 요약',
        render: (r) => (
          <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6 }}>
            {r.summary.map(([s, n]) => (
              <Badge key={s} tone={tone[s as keyof typeof tone]}>
                {label[s as keyof typeof label]} {n}
              </Badge>
            ))}
          </span>
        ),
      },
      { key: 'at', header: '마지막 수집', mono: true, render: (r) => r.collectedAt },
      { key: 'status', header: '수집 상태', render: (r) => <StatusBadge status={r.status} title={r.status === 'FAILED' ? 'HTTP 503 (https://www.openssh.com/releasenotes.html)' : undefined} /> },
    ]}
  />
);

const versions = [
  { v: '18', release: '2025-09-25', eol: '2030-11-14', status: 'SUPPORTED' as const, valid: 'APPROVED' as const, remain: '약 4.1년' },
  { v: '16', release: '2023-09-14', eol: '2028-11-09', status: 'SUPPORTED' as const, valid: 'REVIEW_REQUIRED' as const, remain: '약 2.1년' },
  { v: '14', release: '2021-09-30', eol: '2026-11-12', status: 'EOL_SOON' as const, valid: 'APPROVED' as const, remain: 'D-33' },
  { v: '13', release: '2020-09-24', eol: '2025-11-13', status: 'EOL' as const, valid: 'APPROVED' as const, remain: '331일 경과' },
];

export const VersionList = () => (
  <DataTable
    minWidth={680}
    rows={versions}
    rowKey={(r) => r.v}
    columns={[
      { key: 'v', header: '버전', mono: true, render: (r) => r.v },
      { key: 'release', header: '릴리스일', mono: true, render: (r) => r.release },
      { key: 'eol', header: 'EOL 날짜', mono: true, render: (r) => r.eol },
      { key: 'status', header: 'EOL 상태', render: (r) => <StatusBadge status={r.status} /> },
      { key: 'valid', header: '검증 상태', render: (r) => <StatusBadge status={r.valid} /> },
      { key: 'remain', header: '남은 기간', mono: true, render: (r) => r.remain },
    ]}
  />
);

export const Empty = () => (
  <DataTable rows={[] as { id: string }[]} rowKey={(r) => r.id} empty="검색 결과가 없습니다." columns={[{ key: 'name', header: '오픈소스', render: (r) => r.id }]} />
);
