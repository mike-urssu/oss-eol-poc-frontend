import { Badge, Button, PageHeader } from 'eol-poc-frontend';

export const ListHeader = () => (
  <PageHeader
    title="오픈소스 목록"
    description="AI가 공식 출처에서 버전별 EOL 일정을 자동으로 확인합니다. 이름을 누르면 상세를 볼 수 있습니다."
    actions={
      <>
        <Button>전체 다시 확인</Button>
        <Button variant="primary">오픈소스 등록</Button>
      </>
    }
  />
);
export const DetailHeader = () => (
  <PageHeader
    title="PostgreSQL"
    badge={<Badge tone="neutral">데이터베이스</Badge>}
    description="오픈소스 객체-관계형 데이터베이스."
    actions={
      <>
        <Button href="https://www.postgresql.org">공식 사이트</Button>
        <Button variant="primary">AI로 다시 확인</Button>
      </>
    }
  />
);
