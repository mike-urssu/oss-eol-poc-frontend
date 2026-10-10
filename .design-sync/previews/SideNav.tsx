import { SideNav } from 'eol-poc-frontend';

export const Default = () => (
  <div style={{ display: 'flex', width: 240, height: 420 }}>
    <SideNav
      items={[{ label: '오픈소스', active: true }, { label: '검토 대기' }, { label: '수집 이력' }]}
      footer={"자동 수집 매일 03:00"}
    />
  </div>
);
