// Self-check for the formatting helpers: `node --experimental-strip-types src/lib/eol.check.ts`
import assert from 'node:assert/strict';
import { formatDate, formatDateTime, parseDate, remainingLabel } from './eol.ts';

const today = parseDate('2026-10-10');
assert.equal(remainingLabel('2026-10-31', today), 'D-21');
assert.equal(remainingLabel('2025-10-31', today), '344일 경과');
assert.equal(remainingLabel('2028-10-10', today), '약 2.0년');
assert.equal(remainingLabel(null, today), '—');
assert.equal(formatDate({ date: '2027-11-30', precision: 'MONTH' }), '2027-11');
assert.equal(formatDate({ date: '2027-12-31', precision: 'YEAR' }), '2027');
assert.equal(formatDate({ date: '2028-11-09', precision: 'DAY' }), '2028-11-09');
assert.equal(formatDate(null), '-');
assert.equal(formatDateTime('2026-10-11T03:00:12Z'), '2026-10-11 12:00');
console.log('eol.check ok');
