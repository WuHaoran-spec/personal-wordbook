// Dates are always study dates in China, independent of the device timezone.
export const AFFIX_ORDER = ['em', 'en', 'im', 're', 'de'];
export function studyDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const get = type => parts.find(p => p.type === type).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}
export function dayIndex(key) {
  const [y,m,d] = key.split('-').map(Number);
  return Math.floor(Date.UTC(y, m-1, d) / 86400000);
}
export function dailyPlan(anchor, today, examCount) {
  const elapsed = Math.max(0, dayIndex(today) - dayIndex(anchor));
  return { elapsed, affix: AFFIX_ORDER[elapsed % AFFIX_ORDER.length], round: Math.floor(elapsed / AFFIX_ORDER.length) + 1, position: elapsed % AFFIX_ORDER.length, examIndex: examCount ? elapsed % examCount : 0 };
}
export function nextReview(previous, known, today) {
  const level = known ? (previous?.lastDate === today && previous?.level > 0 ? previous.level : Math.min((previous?.level || 0) + 1, 5)) : 0;
  const days = known ? [0,1,3,7,14,30][level] : 0;
  return { level, due: dayIndex(today) + days, lastDate: today, seen: (previous?.seen || 0) + 1 };
}
