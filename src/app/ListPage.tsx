import { useState } from 'react';
import { Badge, DataTable, Notice, PageHeader, Panel, RowLink, SearchField, Select, StatusBadge } from '../index';
import { formatDateTime, statusMeta, type CollectionStatus, type EolStatus } from '../lib/eol';
import { api } from '../api/client';
import { useApi } from '../api/useApi';

const EOL_ORDER: EolStatus[] = ['EOL', 'EOL_SOON', 'SUPPORTED', 'UNKNOWN'];

export function ListPage({ onOpen }: { onOpen: (slug: string) => void }) {
  const [q, setQ] = useState('');
  const [eolStatus, setEolStatus] = useState<EolStatus | ''>('');
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatus | ''>('');
  const { data, error, loading } = useApi(() => api.listOpensources({ q, eolStatus, collectionStatus }), [q, eolStatus, collectionStatus]);

  return (
    <>
      <PageHeader title="오픈소스 목록" description="공식 출처에서 수집·검증한 버전별 EOL 정보입니다. 이름을 누르면 상세를 볼 수 있습니다." />
      {error && <Notice tone="danger">목록을 불러오지 못했습니다: {error.message}</Notice>}
      <Panel
        flush
        title="전체"
        count={data?.length ?? '-'}
        actions={
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Select
              label="EOL 상태 필터"
              value={eolStatus}
              onChange={(e) => setEolStatus(e.target.value as EolStatus | '')}
              options={[{ value: '', label: 'EOL 상태 전체' }, ...EOL_ORDER.map((s) => ({ value: s, label: statusMeta[s].label }))]}
            />
            <Select
              label="수집 상태 필터"
              value={collectionStatus}
              onChange={(e) => setCollectionStatus(e.target.value as CollectionStatus | '')}
              options={[
                { value: '', label: '수집 상태 전체' },
                { value: 'SUCCESS', label: '수집 성공' },
                { value: 'FAILED', label: '수집 실패' },
              ]}
            />
            <SearchField label="오픈소스 검색" placeholder="이름으로 검색" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        }
      >
        <DataTable
          minWidth={860}
          rows={data ?? []}
          rowKey={(r) => r.slug}
          empty={loading ? '불러오는 중…' : error ? '-' : '조건에 맞는 오픈소스가 없습니다.'}
          columns={[
            { key: 'name', header: '오픈소스', render: (r) => <RowLink onClick={() => onOpen(r.slug)}>{r.name}</RowLink> },
            { key: 'latest', header: '최신 확인 버전', mono: true, render: (r) => r.latestVersion ?? '-' },
            { key: 'count', header: '관리 버전', mono: true, render: (r) => r.versionCount },
            {
              key: 'eol',
              header: 'EOL 상태 요약',
              render: (r) => (
                <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 6 }}>
                  {EOL_ORDER.filter((s) => r.eolSummary[s] > 0).map((s) => (
                    <Badge key={s} tone={statusMeta[s].tone}>
                      {statusMeta[s].label} {r.eolSummary[s]}
                    </Badge>
                  ))}
                </span>
              ),
            },
            { key: 'collected', header: '마지막 수집', mono: true, render: (r) => formatDateTime(r.lastCollectedAt) },
            {
              key: 'collection',
              header: '수집 상태',
              render: (r) => (r.collectionStatus ? <StatusBadge status={r.collectionStatus} title={r.collectionError ?? undefined} /> : '-'),
            },
          ]}
        />
      </Panel>
    </>
  );
}
