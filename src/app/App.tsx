import { useEffect, useState } from 'react';
import { AppShell, SideNav } from '../index';
import { DetailPage } from './DetailPage';
import { ListPage } from './ListPage';

// 상세는 /opensources/:slug, 그 외 경로는 목록. 운영 nginx가 모르는 경로를 index.html로 돌려줘 새로고침·직접 진입도 된다.
const slugFromPath = () => {
  const m = location.pathname.match(/^\/opensources\/([^/]+)/);
  return m ? decodeURIComponent(m[1]) : null;
};

export function App() {
  const [slug, setSlug] = useState(slugFromPath);

  useEffect(() => {
    const onPop = () => setSlug(slugFromPath());
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);

  const go = (next: string | null) => {
    if (next === slug) return;
    history.pushState(null, '', next ? `/opensources/${encodeURIComponent(next)}` : '/');
    setSlug(next);
  };

  return (
    <AppShell sidebar={<SideNav items={[{ label: '오픈소스', active: true, onClick: () => go(null) }]} footer="자동 수집 매일 03:00" />}>
      {slug ? <DetailPage slug={slug} onBack={() => go(null)} /> : <ListPage onOpen={go} />}
    </AppShell>
  );
}
