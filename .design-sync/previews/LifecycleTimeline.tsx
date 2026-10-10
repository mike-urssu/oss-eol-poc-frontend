import { LifecycleTimeline } from 'eol-poc-frontend';

export const WithSecurityPhase = () => (
  <LifecycleTimeline
    today="2026-10-10"
    versions={[
      { version: '3.14', release: '2025-10-07', eol: '2027-10-01', securityEol: '2030-10-31', status: 'SUPPORTED' },
      { version: '3.13', release: '2024-10-07', eol: '2026-10-01', securityEol: '2029-10-31', status: 'EOL' },
      { version: '3.12', release: '2023-10-02', eol: '2025-04-02', securityEol: '2028-10-31', status: 'EOL' },
      { version: '3.10', release: '2021-10-04', eol: '2023-04-05', securityEol: '2026-10-31', status: 'EOL' },
      { version: '3.9', release: '2020-10-05', eol: '2022-05-17', securityEol: '2025-10-31', status: 'EOL' },
    ]}
  />
);

export const GeneralSupportOnly = () => (
  <LifecycleTimeline
    today="2026-10-10"
    versions={[
      { version: '18', release: '2025-09-25', eol: '2030-11-14', status: 'SUPPORTED' },
      { version: '14', release: '2021-09-30', eol: '2026-11-12', status: 'EOL_SOON' },
      { version: '13', release: '2020-09-24', eol: '2025-11-13', status: 'EOL' },
    ]}
  />
);

export const NoPublishedEol = () => (
  <LifecycleTimeline
    today="2026-10-10"
    versions={[
      { version: '19', release: '2024-12-05', eol: null, status: 'UNKNOWN' },
      { version: '18', release: '2022-03-29', eol: null, status: 'UNKNOWN' },
    ]}
  />
);
