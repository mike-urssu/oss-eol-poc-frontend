import { SearchField } from 'eol-poc-frontend';

export const Empty = () => <SearchField label="오픈소스 검색" placeholder="이름으로 검색" />;
export const WithQuery = () => <SearchField label="오픈소스 검색" placeholder="이름으로 검색" defaultValue="postgres" />;
