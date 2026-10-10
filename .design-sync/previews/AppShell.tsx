import { AppShell, Button, PageHeader, Panel, SideNav, StatusBadge } from 'eol-poc-frontend';

export const ListScreen = () => (
  <AppShell sidebar={<SideNav items={[{ label: '오픈소스', active: true }]} footer="자동 수집 매일 03:00" />}>
    <PageHeader
      title="오픈소스 목록"
      description="공식 출처에서 수집·검증한 버전별 EOL 정보입니다."
      actions={<Button variant="primary">오픈소스 등록</Button>}
    />
    <Panel title="종료 임박" count={1}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        Kubernetes 1.34 <StatusBadge status="EOL_SOON" />
      </div>
    </Panel>
  </AppShell>
);
