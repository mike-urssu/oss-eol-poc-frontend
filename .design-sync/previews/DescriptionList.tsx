import { DescriptionList } from 'eol-poc-frontend';

export const ProductFacts = () => (
  <div style={{ width: 880 }}>
    <DescriptionList
      items={[
        { label: '릴리스 · 지원 정책', value: '매년 10월 새 버전 · 2년 버그 수정 + 3년 보안 수정 (총 5년)' },
        { label: '확인 출처', value: 'python.org — Status of Python versions' },
        { label: '라이선스', value: 'PSF-2.0', mono: true },
        { label: '마지막 확인', value: '2026-10-10 06:00', mono: true },
      ]}
    />
  </div>
);
