import { Notice } from 'eol-poc-frontend';

export const Info = () => <Notice>수집을 시작했습니다 (수집 ID 41). 완료 후 새로고침하면 반영됩니다.</Notice>;
export const Danger = () => <Notice tone="danger">재수집 요청 실패: 이미 수집이 실행 중입니다.</Notice>;
