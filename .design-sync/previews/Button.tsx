import { Button } from 'eol-poc-frontend';

const back = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PageActions = () => (
  <div style={{ display: 'flex', gap: 10 }}>
    <Button>전체 다시 확인</Button>
    <Button variant="primary">오픈소스 등록</Button>
  </div>
);
export const Primary = () => <Button variant="primary">AI로 다시 확인</Button>;
export const ExternalLink = () => <Button href="https://www.python.org">공식 사이트</Button>;
export const BackLink = () => <Button variant="link" icon={back}>오픈소스 목록</Button>;
export const Disabled = () => <Button variant="primary" disabled>확인 중…</Button>;
