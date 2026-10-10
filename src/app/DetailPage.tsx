import { useState } from 'react';
import { Badge, Button, DataTable, LifecycleLegend, LifecycleTimeline, Notice, PageHeader, Panel, StatusBadge } from '../index';
import { formatDate, formatDateTime, remainingLabel } from '../lib/eol';
import { api } from '../api/client';
import { useApi } from '../api/useApi';

const back = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function DetailPage({ slug, onBack }: { slug: string; onBack: () => void }) {
  const { data: p, error, loading } = useApi(() => api.getOpensource(slug), [slug]);
  const [collect, setCollect] = useState<{ busy?: boolean; ok?: string; error?: string }>({});

  const recollect = async () => {
    setCollect({ busy: true });
    try {
      const { collectionIds } = await api.recollect(slug);
      setCollect({ ok: `수집을 시작했습니다 (수집 ID ${collectionIds.join(', ')}). 완료 후 새로고침하면 반영됩니다.` });
    } catch (e) {
      setCollect({ error: (e as Error).message });
    }
  };

  const backLink = (
    <Button variant="link" icon={back} onClick={onBack}>
      오픈소스 목록
    </Button>
  );
  if (!p) return <>{backLink}<Notice tone={error ? 'danger' : 'info'}>{error ? `상세를 불러오지 못했습니다: ${error.message}` : loading && '불러오는 중…'}</Notice></>;

  // Recommended = the supported version whose general support lasts longest.
  const rec = p.versions.filter((v) => v.eolStatus === 'SUPPORTED' && v.eolDate).sort((a, b) => b.eolDate!.date.localeCompare(a.eolDate!.date))[0];

  return (
    <>
      {backLink}
      <PageHeader
        title={p.name}
        badge={p.latestVersion && <Badge tone="info">최신 {p.latestVersion}</Badge>}
        description={p.description ?? p.homepageUrl}
        actions={
          <>
            <Button href={p.homepageUrl}>공식 사이트</Button>
            <Button variant="primary" onClick={recollect} disabled={collect.busy}>
              {collect.busy ? '요청 중…' : '다시 수집'}
            </Button>
          </>
        }
      />
      {collect.ok && <Notice>{collect.ok}</Notice>}
      {collect.error && <Notice tone="danger">재수집 요청 실패: {collect.error}</Notice>}

      <Panel flush title="출처" count={p.sources.length}>
        <DataTable
          minWidth={760}
          rows={p.sources}
          rowKey={(s) => String(s.id)}
          columns={[
            { key: 'url', header: '출처 URL', render: (s) => <a href={s.url} target="_blank" rel="noreferrer" style={{ wordBreak: 'break-all' }}>{s.url}</a> },
            { key: 'type', header: '수집 방식', mono: true, render: (s) => s.collectorType },
            { key: 'trust', header: '신뢰 등급', render: (s) => (s.trustLevel === 'OFFICIAL' ? <Badge tone="info">공식</Badge> : <Badge tone="neutral">보조</Badge>) },
            {
              key: 'last',
              header: '최근 수집',
              render: (s) =>
                s.lastCollection ? (
                  <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    <StatusBadge status={s.lastCollection.status} title={s.lastCollection.error ?? undefined} />
                    <span className="lc-mono lc-muted" style={{ fontSize: 13 }}>{formatDateTime(s.lastCollection.finishedAt)}</span>
                    {s.lastCollection.skippedUnchanged && <span className="lc-muted" style={{ fontSize: 13 }}>변경 없음</span>}
                  </span>
                ) : (
                  '-'
                ),
            },
          ]}
        />
      </Panel>

      <Panel title="버전별 지원 기간" actions={<LifecycleLegend />}>
        <LifecycleTimeline
          versions={p.versions.map((v) => ({ version: v.version, release: v.releaseDate?.date, eol: v.eolDate?.date, securityEol: v.securityEolDate?.date, status: v.eolStatus }))}
        />
      </Panel>

      <Panel flush title="버전 목록" count={p.versions.length}>
        <DataTable
          minWidth={980}
          rows={p.versions}
          rowKey={(v) => v.version}
          columns={[
            {
              key: 'v',
              header: '버전',
              render: (v) => (
                <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', whiteSpace: 'nowrap' }}>
                  <span className="lc-mono" style={{ fontWeight: 500 }}>{v.version}</span>
                  {v.latestPatchVersion && <span className="lc-mono lc-muted" style={{ fontSize: 13 }}>{v.latestPatchVersion}</span>}
                  {v === rec && <Badge tone="accent">권장</Badge>}
                </span>
              ),
            },
            { key: 'release', header: '릴리스 날짜', mono: true, render: (v) => formatDate(v.releaseDate) },
            { key: 'eol', header: 'EOL 날짜', mono: true, render: (v) => formatDate(v.eolDate) },
            { key: 'sec', header: '보안 지원 종료일', mono: true, render: (v) => formatDate(v.securityEolDate) },
            { key: 'status', header: 'EOL 상태', render: (v) => <StatusBadge status={v.eolStatus} /> },
            { key: 'valid', header: '검증 상태', render: (v) => (v.validationStatus ? <StatusBadge status={v.validationStatus} /> : '-') },
            { key: 'remain', header: '남은 기간', mono: true, render: (v) => remainingLabel(v.eolDate?.date) },
            {
              key: 'src',
              header: '근거',
              render: (v) => (
                <span style={{ display: 'inline-flex', gap: 8 }}>
                  {v.sourceUrls.map((u, i) => (
                    <a key={u} href={u} target="_blank" rel="noreferrer">
                      출처 {i + 1}
                    </a>
                  ))}
                </span>
              ),
            },
          ]}
        />
      </Panel>
    </>
  );
}
