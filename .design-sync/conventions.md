# Lifecycle UI — conventions

Korean-language admin UI for tracking open-source versions and their EOL (end-of-life) dates. All UI copy is Korean; product names, versions and dates stay as-is.

## Setup

- **Every screen goes inside `AppShell`** with a `SideNav` as `sidebar`. AppShell supplies the page background (`--lc-color-bg`), the IBM Plex Sans KR font, ink color and the 24px vertical rhythm of the main column. Without it, your own text falls back to the browser serif font.
- Standalone fragments (no AppShell) → wrap them in `<div className="lc-root">`, which sets the font, size and ink color.
- Fonts load from Google Fonts via `styles.css`; nothing else to set up. No provider or theme object.

## Styling idiom

Components carry their own styling. Don't restyle them with classes. For your own layout glue, use inline `style` with flex/grid + `gap`, and colors **only** from these CSS variables:

| Use | Tokens |
|---|---|
| Surfaces | `--lc-color-bg` (page), `--lc-color-surface` (cards) |
| Text | `--lc-color-ink`, `--lc-color-ink-soft`, `--lc-color-ink-muted` |
| Lines | `--lc-color-border`, `--lc-color-border-strong`, `--lc-color-divider` |
| Brand | `--lc-color-primary`, `--lc-color-primary-hover`, `--lc-color-accent` |
| Status | `--lc-tone-{success,warning,danger,info,neutral}-{bg,fg}` |
| Type | `--lc-font-sans`, `--lc-font-mono` |
| Radius | `--lc-radius-sm` 6, `--lc-radius-md` 8, `--lc-radius-lg` 12, `--lc-radius-pill` |

Helper classes: `lc-mono` (IBM Plex Mono, for versions, dates, counts and licenses) and `lc-muted` (secondary text).

## Composition rules

- Page = `PageHeader` (title, description, actions with one `variant="primary"` Button, placed last), then one `Panel` per section.
- Tables go in `<Panel flush>` → `<DataTable>`. The first column is usually a `RowLink` that opens the detail view. Set `mono: true` on version/date columns.
- Statuses from the API → `<StatusBadge status=... />`; never hand-pick colors for them. EOL: `SUPPORTED` 지원 중, `EOL_SOON` 종료 임박, `EOL` 종료, `UNKNOWN` 미확인. Validation: `APPROVED`, `REVIEW_REQUIRED`, `REJECTED`. Collection: `SUCCESS`, `FAILED` (pass the failure reason as `title`). Other short labels → `<Badge tone=...>`: `neutral` category, `info` 최신 버전 / 공식 출처, `accent` 권장.
- List filters → `Select` + `SearchField` side by side in the Panel's `actions`. Loading errors and action results → `<Notice tone="danger|info">` above the affected Panel.
- Support-period chart → `<LifecycleTimeline versions={...} />` in a Panel whose `actions` is `<LifecycleLegend />`. Each version: `{ version, release, eol, securityEol?, status }`; dates are `yyyy-MM-dd` strings, `eol` = end of general support (may be `null`), `securityEol` = end of security-only support.
- Dates display as `yyyy-MM-dd` (or `yyyy-MM` / `yyyy` when only that precision is known); timestamps as `yyyy-MM-dd HH:mm` KST; missing values as `-`.
- Back navigation → `<Button variant="link">` with a 16px chevron SVG `icon`. External links → `<Button href>`.

## Where the truth lives

`styles.css` → `_ds_bundle.css` holds every token and component rule. Per-component API and examples: `components/<group>/<Name>/<Name>.prompt.md`.

## Example

```jsx
const { AppShell, SideNav, PageHeader, Panel, DataTable, RowLink, StatusBadge, Button } = window.LifecycleUI;

<AppShell sidebar={<SideNav items={[{ label: '오픈소스', active: true }]} footer="자동 수집 매일 03:00" />}>
  <PageHeader title="PostgreSQL" description="오픈소스 객체-관계형 데이터베이스."
    actions={<><Button href="https://www.postgresql.org">공식 사이트</Button><Button variant="primary">다시 수집</Button></>} />
  <Panel flush title="버전 목록" count={2}>
    <DataTable rowKey={(v) => v.v} rows={[{ v: '18', eol: '2030-11-14', s: 'SUPPORTED' }, { v: '14', eol: '2026-11-12', s: 'EOL_SOON' }]}
      columns={[
        { key: 'v', header: '버전', render: (v) => <RowLink>{v.v}</RowLink> },
        { key: 'eol', header: 'EOL 날짜', mono: true, render: (v) => v.eol },
        { key: 's', header: 'EOL 상태', render: (v) => <StatusBadge status={v.s} /> },
      ]} />
  </Panel>
</AppShell>
```
