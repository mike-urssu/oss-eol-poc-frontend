import { Badge, DataTable, DescriptionList, Panel, SearchField } from 'eol-poc-frontend';

export const WithContent = () => (
  <Panel title="AI 확인 결과" titleAddon={<Badge tone="success">확인됨</Badge>}>
    <DescriptionList
      items={[
        { label: '릴리스 · 지원 정책', value: '매년 메이저 1회 · 출시 후 5년 지원' },
        { label: '확인 출처', value: 'postgresql.org — Versioning Policy' },
        { label: '라이선스', value: 'PostgreSQL', mono: true },
      ]}
    />
  </Panel>
);

const rows = [
  { id: 'k8s', name: 'Kubernetes', latest: '1.35' },
  { id: 'python', name: 'Python', latest: '3.14' },
  { id: 'pg', name: 'PostgreSQL', latest: '18' },
];

export const FlushWithTable = () => (
  <Panel
    flush
    title="전체"
    count={rows.length}
    actions={<SearchField label="오픈소스 검색" placeholder="이름으로 검색" />}
    footer="PoC 예시 데이터입니다. 실제 값은 AI가 각 프로젝트의 공식 지원 정책 페이지에서 확인합니다."
  >
    <DataTable
      rows={rows}
      rowKey={(r) => r.id}
      columns={[
        { key: 'name', header: '오픈소스', render: (r) => r.name },
        { key: 'latest', header: '최신 버전', mono: true, render: (r) => r.latest },
      ]}
    />
  </Panel>
);
