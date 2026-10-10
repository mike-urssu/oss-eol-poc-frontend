import { Select } from 'eol-poc-frontend';

export const EolStatusFilter = () => (
  <Select
    label="EOL 상태 필터"
    defaultValue=""
    options={[
      { value: '', label: 'EOL 상태 전체' },
      { value: 'EOL', label: '종료' },
      { value: 'EOL_SOON', label: '종료 임박' },
      { value: 'SUPPORTED', label: '지원 중' },
      { value: 'UNKNOWN', label: '미확인' },
    ]}
  />
);
export const Selected = () => (
  <Select
    label="수집 상태 필터"
    defaultValue="FAILED"
    options={[
      { value: '', label: '수집 상태 전체' },
      { value: 'SUCCESS', label: '수집 성공' },
      { value: 'FAILED', label: '수집 실패' },
    ]}
  />
);
