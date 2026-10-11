// GHCR 이미지 버전을 생성일 기준으로 정렬해 최신 KEEP_IMAGES개만 남기고 지운다(Jenkins 'Clean up registry' 단계).
// 백엔드 build.gradle.kts의 ghcrCleanup 태스크와 같은 동작. Node 18+ 내장 fetch만 쓴다.
// 필요한 환경 변수: GHCR_PACKAGE, REG_PASS(delete:packages 권한 PAT), KEEP_IMAGES(기본 10)
// 지우지 않고 대상만 보려면: DRY_RUN=true GHCR_PACKAGE=oss-eol-poc-frontend REG_PASS=<PAT> node deploy/ghcr-cleanup.mjs
const { GHCR_PACKAGE, REG_PASS, KEEP_IMAGES = '10', DRY_RUN } = process.env;
if (!GHCR_PACKAGE || !REG_PASS) throw new Error('GHCR_PACKAGE, REG_PASS가 필요하다');
const keep = Number(KEEP_IMAGES);
const dryRun = DRY_RUN === 'true';
const api = `https://api.github.com/user/packages/container/${GHCR_PACKAGE}/versions`;
const headers = { Authorization: `Bearer ${REG_PASS}`, Accept: 'application/vnd.github+json' };

const list = await fetch(`${api}?per_page=100`, { headers });
if (list.status !== 200) throw new Error(`버전 목록 조회 실패: HTTP ${list.status} ${await list.text()}`);
const versions = await list.json();

const expired = versions.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)).slice(keep);
console.log(`버전 ${versions.length}개 중 ${expired.length}개 삭제 (최신 ${keep}개 유지)`);
for (const v of expired) {
  console.log(`${dryRun ? '[dry-run] ' : ''}삭제: ${v.id} ${v.created_at} ${JSON.stringify(v.metadata?.container?.tags ?? [])}`);
  if (dryRun) continue;
  const deleted = await fetch(`${api}/${v.id}`, { method: 'DELETE', headers });
  if (deleted.status !== 204) throw new Error(`버전 ${v.id} 삭제 실패: HTTP ${deleted.status} ${await deleted.text()}`);
}
