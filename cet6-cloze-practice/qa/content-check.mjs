import assert from 'node:assert/strict';
import { words } from '../public/data.js';
import { emWords, affixLessons } from '../public/affixes.js';
import { exams } from '../public/exams.js';
import { studyDate, dailyPlan, nextReview, dayIndex } from '../public/learning.js';
const all = [...words, ...emWords];
const ids = new Set(all.map(w => w.id));
assert.equal(ids.size, all.length);
for (const lesson of affixLessons) for (const id of lesson.wordIds) assert(ids.has(id));
for (const word of all) for (const q of word.questions) {
  assert.equal(q.options.length, 4);
  assert.equal(new Set(q.options.map(o=>o.text)).size, 4);
  assert.equal(q.options.filter(o=>o.text===q.answer).length,1);
  assert.equal(q.sentence.split('___').length,2);
}
for (const exam of exams) {
  assert.equal(exam.choices.length,15);
  assert.equal(new Set(exam.choices.map(c=>c.letter)).size,15);
  assert.deepEqual(exam.answers.map(a=>a.number),[26,27,28,29,30,31,32,33,34,35]);
  assert.equal(new Set(exam.answers.map(a=>a.letter)).size,10);
  for (const a of exam.answers) assert(exam.choices.some(c=>c.letter===a.letter));
}
assert.equal(studyDate(new Date('2026-09-25T15:59:59Z')),'2026-09-25');
assert.equal(studyDate(new Date('2026-09-25T16:00:00Z')),'2026-09-26');
assert.equal(dailyPlan('2026-09-25','2026-09-25',4).affix,'em');
assert.equal(dailyPlan('2026-09-25','2026-09-30',4).round,2);
assert.equal(dailyPlan('2026-09-25','2026-09-30',4).affix,'em');
const r=nextReview(null,true,'2026-09-25');
assert.equal(r.due,dayIndex('2026-09-25')+1);
assert.equal(nextReview(r,true,'2026-09-25').level,1);
assert.equal(nextReview(r,false,'2026-09-25').due,dayIndex('2026-09-25'));
console.log(`PASS: ${all.length} words, ${all.flatMap(w=>w.questions).length} short questions, ${exams.length} exam sets, study dates and review scheduling.`);
