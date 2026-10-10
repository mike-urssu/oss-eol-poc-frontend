import { useState } from 'react';
import { AppShell, SideNav } from '../index';
import { DetailPage } from './DetailPage';
import { ListPage } from './ListPage';

export function App() {
  const [slug, setSlug] = useState<string | null>(null);
  return (
    <AppShell sidebar={<SideNav items={[{ label: '오픈소스', active: true, onClick: () => setSlug(null) }]} footer="자동 수집 매일 03:00" />}>
      {slug ? <DetailPage slug={slug} onBack={() => setSlug(null)} /> : <ListPage onOpen={setSlug} />}
    </AppShell>
  );
}
