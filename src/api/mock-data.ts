// Fixture copied from the design canvas; read by mock.ts only.
interface VersionLifecycle {
  version: string;
  release: string;
  activeEnd: string | null;
  eol: string | null;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  desc: string;
  license: string;
  home: string;
  source: string;
  policy: string;
  latest: string;
  ai: 'ok' | 'review';
  checked: string;
  versions: VersionLifecycle[];
}

const v = (version: string, release: string, activeEnd: string | null, eol: string | null): VersionLifecycle => ({ version, release, activeEnd, eol });

export const catalog: Product[] = [
  { id: 'python', title: 'Python', category: '런타임', desc: '범용 프로그래밍 언어와 표준 인터프리터(CPython).', license: 'PSF-2.0', home: 'https://www.python.org', source: 'python.org — Status of Python versions', latest: '3.14', ai: 'ok', checked: '오늘 06:00',
    policy: '매년 10월 새 버전 · 2년 버그 수정 + 3년 보안 수정 (총 5년)',
    versions: [v('3.14', '2025-10-07', '2027-10-01', '2030-10-31'), v('3.13', '2024-10-07', '2026-10-01', '2029-10-31'), v('3.12', '2023-10-02', '2025-04-02', '2028-10-31'), v('3.11', '2022-10-24', '2024-04-01', '2027-10-31'), v('3.10', '2021-10-04', '2023-04-05', '2026-10-31'), v('3.9', '2020-10-05', '2022-05-17', '2025-10-31')] },
  { id: 'node', title: 'Node.js', category: '런타임', desc: '서버 측 JavaScript 런타임.', license: 'MIT', home: 'https://nodejs.org', source: 'nodejs.org — Release schedule', latest: '24 LTS', ai: 'ok', checked: '오늘 06:00',
    policy: '짝수 메이저가 LTS · 4월 출시, 약 30개월 지원',
    versions: [v('24', '2025-05-06', '2026-10-20', '2028-04-30'), v('22', '2024-04-24', '2025-10-21', '2027-04-30'), v('20', '2023-04-18', '2024-10-22', '2026-04-30'), v('18', '2022-04-19', '2023-10-18', '2025-04-30')] },
  { id: 'pg', title: 'PostgreSQL', category: '데이터베이스', desc: '오픈소스 객체-관계형 데이터베이스.', license: 'PostgreSQL', home: 'https://www.postgresql.org', source: 'postgresql.org — Versioning Policy', latest: '18', ai: 'ok', checked: '오늘 06:00',
    policy: '매년 메이저 1회 · 출시 후 5년 지원',
    versions: [v('18', '2025-09-25', null, '2030-11-14'), v('17', '2024-09-26', null, '2029-11-08'), v('16', '2023-09-14', null, '2028-11-09'), v('15', '2022-10-13', null, '2027-11-11'), v('14', '2021-09-30', null, '2026-11-12'), v('13', '2020-09-24', null, '2025-11-13')] },
  { id: 'spring', title: 'Spring Boot', category: '프레임워크', desc: 'Java 애플리케이션 프레임워크.', license: 'Apache-2.0', home: 'https://spring.io/projects/spring-boot', source: 'spring.io — Support Policy', latest: '4.0', ai: 'ok', checked: '오늘 06:00',
    policy: '6개월마다 마이너 · OSS 지원 약 13개월 (상용 지원 별도)',
    versions: [v('4.0', '2025-11-20', null, '2026-12-31'), v('3.5', '2025-05-22', null, '2026-06-30'), v('3.4', '2024-11-21', null, '2025-12-31'), v('3.3', '2024-05-23', null, '2025-06-30')] },
  { id: 'mysql', title: 'MySQL', category: '데이터베이스', desc: '관계형 데이터베이스.', license: 'GPL-2.0', home: 'https://www.mysql.com', source: 'Oracle — Lifetime Support Policy', latest: '8.4 LTS', ai: 'ok', checked: '오늘 06:00',
    policy: 'LTS 약 8년 지원 · Innovation 릴리스는 다음 릴리스까지',
    versions: [v('8.4', '2024-04-30', '2029-04-30', '2032-04-30'), v('8.0', '2018-04-19', '2023-04-30', '2026-04-30'), v('5.7', '2015-10-21', '2020-10-21', '2023-10-31')] },
  { id: 'django', title: 'Django', category: '프레임워크', desc: 'Python 웹 프레임워크.', license: 'BSD-3-Clause', home: 'https://www.djangoproject.com', source: 'djangoproject.com — Supported versions', latest: '6.0', ai: 'ok', checked: '오늘 06:00',
    policy: '8개월마다 기능 릴리스 · LTS는 3년 지원',
    versions: [v('6.0', '2025-12-03', '2026-08-31', '2027-04-30'), v('5.2 LTS', '2025-04-02', '2025-12-03', '2028-04-30'), v('5.1', '2024-08-07', '2025-04-02', '2025-12-31'), v('4.2 LTS', '2023-04-03', '2023-12-04', '2026-04-30')] },
  { id: 'k8s', title: 'Kubernetes', category: '플랫폼', desc: '컨테이너 오케스트레이션 플랫폼.', license: 'Apache-2.0', home: 'https://kubernetes.io', source: 'kubernetes.io — Releases', latest: '1.35', ai: 'ok', checked: '오늘 06:00',
    policy: '연 3회 마이너 릴리스 · 약 14개월 패치 지원',
    versions: [v('1.35', '2025-12-17', null, '2027-02-28'), v('1.34', '2025-08-27', null, '2026-10-27'), v('1.33', '2025-04-23', null, '2026-06-28'), v('1.32', '2024-12-11', null, '2026-02-28')] },
  { id: 'ubuntu', title: 'Ubuntu', category: 'OS', desc: 'Linux 배포판.', license: 'GPL 외 다수', home: 'https://ubuntu.com', source: 'ubuntu.com — Release cycle', latest: '24.04 LTS', ai: 'ok', checked: '오늘 06:00',
    policy: '2년마다 LTS · 표준 지원 5년, 이후 ESM(유료) 연장',
    versions: [v('24.04', '2024-04-25', null, '2029-05-31'), v('22.04', '2022-04-21', null, '2027-04-30'), v('20.04', '2020-04-23', null, '2025-05-31')] },
  { id: 'react', title: 'React', category: '라이브러리', desc: '웹 UI 라이브러리.', license: 'MIT', home: 'https://react.dev', source: 'react.dev — Versions (공식 EOL 일정 없음)', latest: '19', ai: 'review', checked: '오늘 06:00',
    policy: '공식 EOL 일정 없음 · 최신 메이저 중심으로 업데이트',
    versions: [v('19', '2024-12-05', null, null), v('18', '2022-03-29', null, null)] },
];
