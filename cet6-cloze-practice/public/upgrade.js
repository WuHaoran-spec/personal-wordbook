import { exams } from './exams.js';
import { affixLessons, senseNotes } from './affixes.js';
import { AFFIX_ORDER, studyDate, dayIndex, dailyPlan, nextReview } from './learning.js';

export function initUpgrade({ words, esc, icon, toast, activateNav, startSession }) {
  const $ = s => document.querySelector(s);
  const KEY = 'cet6-point-practice-v2';
  const today = studyDate();
  let saved;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { saved = null; }
  const state = { version: 2, anchor: today, learning: {}, logs: {}, exams: {}, passages: {}, ...(saved?.version === 2 ? saved : {}) };
  for (const k of ['learning','logs','exams','passages']) if (!state[k] || typeof state[k] !== 'object' || Array.isArray(state[k])) state[k] = {};
  if (!/^\d{4}-\d{2}-\d{2}$/.test(state.anchor)) state.anchor = today;
  const plan = dailyPlan(state.anchor, today, exams.length);
  let activeExam = exams[plan.examIndex];
  let examAnswers = {}, examSubmitted = false, activeBlank = 26;
  let studyMode = 'affix', studyExam = activeExam, cards = [], cardIndex = 0, revealed = false, studyFinished = false;
  let sessionRatings = {}, repeatIds = null;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { toast('浏览器存储已满或不可用，当前记录未保存。'); } };
  const examDate = ex => `${ex.year} 年 ${ex.month} 月`;
  const currentLesson = () => affixLessons.find(a => a.id === plan.affix);
  const wordById = Object.fromEntries(words.map(w => [w.id, w]));
  function cardFromWord(w) { return { key: `word:${w.id}`, ...w, kind: '词缀专题', detail: w.nuance, senses: senseNotes[w.id] || w.senses || [] }; }
  function cardFromChoice(exam, c) { return { key: `exam:${exam.id}:${c.letter}`, ...c, id: c.word, kind: `${examDate(exam)} · ${exam.title} · ${c.letter}`, detail: c.affixNote || '先记住这个备选词的词性和基本义，再结合原题判断。', source: `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(c.word)}`, senses: [] }; }
  const allCards = [...words.map(cardFromWord), ...exams.flatMap(e => e.choices.map(c => cardFromChoice(e,c)))];
  const cardMap = Object.fromEntries(allCards.map(c => [c.key,c]));
  function dueCards() { return Object.entries(state.learning).filter(([key,r]) => cardMap[key] && Number(r.due) <= dayIndex(today)).map(([key])=>cardMap[key]); }
  function setView(view, scroll = false) {
    const sections = { practice: $('#practice'), review: $('#practice'), library: $('#library'), daily: $('#daily-section'), exam: $('#exam-section') };
    new Set(Object.values(sections)).forEach(s => { if (s) s.hidden = s !== sections[view]; });
    activateNav(view);
    if (scroll) sections[view]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.addEventListener('show-training-view', e => setView(e.detail));
  const daily = document.createElement('section');
  daily.id = 'daily-section'; daily.className = 'daily-section';
  const examSection = document.createElement('section');
  examSection.id = 'exam-section'; examSection.className = 'exam-section'; examSection.hidden = true;
  $('#library').before(daily,examSection);
  const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = './upgrade.css'; document.head.append(css);

  function resetStudy(mode = studyMode, exam = studyExam, ids = null) {
    studyMode = mode; studyExam = exam; repeatIds = ids;
    const pool = mode === 'affix' ? (currentLesson()?.wordIds || []).map(id => wordById[id]).filter(Boolean).map(cardFromWord)
      : mode === 'exam' ? exam.choices.map(c => cardFromChoice(exam,c)) : dueCards();
    cards = ids ? pool.filter(c => ids.includes(c.key)) : pool;
    cardIndex = 0; revealed = false; studyFinished = false; sessionRatings = {};
    renderDaily();
  }
  function renderDaily() {
    const lesson = currentLesson();
    const card = cards[cardIndex];
    const reviewed = Object.keys(state.logs[today] || {}).length;
    const scopeIds = cards.map(c=>c.key);
    const completed = scopeIds.filter(id => (state.logs[today] || {})[id]).length;
    daily.innerHTML = `<div class="section-heading"><div><span class="section-number">今日</span><h2>每日背词</h2><span class="section-subtitle">${esc(today)} · 按北京时间更新</span></div><span class="count-badge">今天已过 ${reviewed} 个词</span></div>
      <div class="daily-plan"><div><span class="small-label">第 ${plan.round} 轮 · 第 ${plan.position+1} / 5 天</span><h3>今日词缀：${esc(plan.affix)}-</h3><p>每天一个专题，五天一轮。隔天自动轮换，没记牢的词另进复习。</p></div><div class="rotation-track" aria-label="词缀轮换顺序">${AFFIX_ORDER.map((a,i)=>`<span class="${i===plan.position?'today-affix':''}"><b>${a}-</b><small>${i===plan.position?'今天':i<plan.position?'本轮已过':`${i+1} / 5`}</small></span>`).join('')}</div></div>
      <div class="study-tabs" role="tablist" aria-label="背诵类型"><button role="tab" data-study-mode="affix" aria-selected="${studyMode==='affix'}">词缀专题 · ${esc(plan.affix)}-</button><button role="tab" data-study-mode="exam" aria-selected="${studyMode==='exam'}">真题备选词 · 15 词</button><button role="tab" data-study-mode="review" aria-selected="${studyMode==='review'}">到期复习 · ${dueCards().length}</button></div>
      <div class="study-grid"><div class="flashcard-panel">
      <div class="flash-head"><span>${studyMode==='affix'?esc(lesson?.title):studyMode==='exam'?esc(examDate(studyExam))+' · '+esc(studyExam.title):'按记忆情况安排的到期词'}</span><span>${studyFinished?'完成':cards.length?`${cardIndex+1} / ${cards.length}`:'0 / 0'}</span></div>
      ${!cards.length?`<div class="study-empty"><h3>今天没有到期词</h3><p>在背词时点击“记住了”或“还不熟”，这里就会按时间安排复习。</p><button class="btn" data-study-mode="affix">背今日词缀</button></div>`:studyFinished?`<div class="study-empty"><h3>本组背诵完成</h3><p>记住 ${Object.values(sessionRatings).filter(Boolean).length} 个 · 还不熟 ${Object.values(sessionRatings).filter(v=>!v).length} 个。<br>记住的词会在 1、3、7、14、30 天后逐步复习。</p><div class="complete-buttons"><button class="btn" data-study-action="again-all">再过一遍</button>${Object.values(sessionRatings).some(v=>!v)?'<button class="btn btn-secondary" data-study-action="again-weak">只背不熟的词</button>':''}<button class="btn btn-secondary" data-study-action="today-exam">做今日真题</button></div></div>`:`<div class="flash-front"><span class="small-label">${esc(card.kind)}</span><h3 lang="en">${esc(card.word)}</h3><span class="pos-tag">${esc(card.pos)}</span><p class="flash-example" lang="en">${esc(card.example)}</p>${!revealed?'<p class="recall-prompt">先说出词义，再查看释义。</p><button class="btn" data-study-action="reveal">查看释义与用法</button>':`<div class="flash-back"><h4>${esc(card.meaning)}</h4><p>${esc(card.translation)}</p>${card.collocation?`<p class="collocation-line"><b>常见搭配</b><span lang="en">${esc(card.collocation)}</span></p>`:''}<p class="meaning-detail">${esc(card.detail)}</p>${card.senses.map(s=>`<div class="sense-row"><strong>${esc(s.label)}</strong><p>${esc(s.meaning)}</p><code>${esc(s.pattern)}</code></div>`).join('')}<a class="dictionary-link" href="${esc(card.source)}" target="_blank" rel="noopener noreferrer">核对词典释义 ↗</a></div>`}</div><div class="rating-actions"><button class="btn btn-secondary" data-rate="again" ${!revealed?'disabled':''}>还不熟 · 今天再看</button><button class="btn" data-rate="known" ${!revealed?'disabled':''}>记住了 ${icon('arrow')}</button></div>`}
      <div class="study-bottom">本组今日已过 ${completed} / ${cards.length} 词 · 记录保存在此浏览器</div></div>
      <aside class="lesson-panel"><span class="small-label">${studyMode==='exam'?'这组词来自真实试卷':'构词与辨义'}</span><h3>${studyMode==='exam'?esc(studyExam.title):esc(lesson?.title)}</h3><p>${studyMode==='exam'?'按原题 A—O 顺序收录全部备选词，包括五个未选词。例句为原创，释义是学习参考。':esc(lesson?.summary)}</p>${studyMode==='exam'?`<a href="${esc(studyExam.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看真题来源 ↗</a><button class="btn btn-secondary" data-study-action="source-exam">练习这套真题</button>`:`<div class="lesson-warning">${esc(lesson?.warning)}</div>${(lesson?.distinctions||[]).map(d=>`<div class="distinction"><strong>${esc(d.words)}</strong><p>${esc(d.explanation)}</p></div>`).join('')}`}<div class="lesson-footer">词缀只辅助记忆。做题时仍需看词性、搭配和上下文。</div></aside></div>`;
  }
  daily.addEventListener('click',e=>{
    const mode=e.target.closest('[data-study-mode]')?.dataset.studyMode;
    if(mode){resetStudy(mode,exams[plan.examIndex]);return;}
    const action=e.target.closest('[data-study-action]')?.dataset.studyAction;
    if(action==='reveal'){revealed=true;renderDaily();return;}
    if(action==='again-all'){resetStudy(studyMode,studyExam);return;}
    if(action==='again-weak'){resetStudy(studyMode,studyExam,Object.keys(sessionRatings).filter(id=>!sessionRatings[id]));return;}
    if(action==='today-exam'||action==='source-exam'){selectExam(action==='today-exam'?exams[plan.examIndex].id:studyExam.id);setView('exam',true);return;}
    const rate=e.target.closest('[data-rate]')?.dataset.rate;
    if(rate&&revealed&&cards[cardIndex]&&!studyFinished){const card=cards[cardIndex],known=rate==='known';state.learning[card.key]=nextReview(state.learning[card.key],known,today);state.logs[today]||={};state.logs[today][card.key]={known};sessionRatings[card.key]=known;save();revealed=false;cardIndex++;if(cardIndex>=cards.length)studyFinished=true;renderDaily();}
  });

  function selectExam(id) { activeExam = exams.find(e=>e.id===id) || activeExam; examAnswers={};examSubmitted=false;activeBlank=26;renderExam(); }
  function renderExam() {
    const ex=activeExam;
    const filled=Object.keys(examAnswers).length;
    const score=ex.answers.filter(a=>examAnswers[a.number]===a.letter).length;
    const history=state.exams[ex.id];
    const text=state.passages[ex.id] || '';
    examSection.innerHTML=`<div class="section-heading"><div><span class="section-number">真题</span><h2>选词填空题库</h2><span class="section-subtitle">${exams.length} 套 · 备选词、答案、讲解</span></div><button class="text-button" data-exam-action="today">今日推荐</button></div>
      <div class="exam-catalog" role="group" aria-label="选择真题">${exams.map(x=>`<button class="exam-entry ${x.id===ex.id?'active':''}" data-exam-id="${esc(x.id)}"><small>${esc(examDate(x))}</small><strong>${esc(x.title)}</strong><span>${x.id===exams[plan.examIndex].id?'今日推荐 · ':''}${state.exams[x.id]?`上次 ${state.exams[x.id].score}/10`:'10 空 / 15 词'}</span></button>`).join('')}</div>
      <div class="exam-workspace"><div class="exam-intro"><div><span class="small-label">${esc(examDate(ex))} · ${esc(ex.setLabel)}</span><h3>${esc(ex.title)}</h3><p>${esc(ex.verificationNote)}</p></div><button class="btn btn-secondary" data-exam-action="learn">背本套 15 词 ${icon('arrow')}</button></div>
      <div class="source-strip"><a href="${esc(ex.sourceUrl)}" target="_blank" rel="noopener noreferrer">打开真题原文 ↗</a><a href="${esc(ex.answerSourceUrl)}" target="_blank" rel="noopener noreferrer">答案出处 ↗</a><span>答案为机构参考答案；讲解为本站编写。</span></div>
      <div class="exam-body"><div class="passage-column"><div class="passage-top"><h4>阅读原文</h4><span>${text?'已保存到此浏览器':'使用来源页或粘贴原文'}</span></div>${text?`<div class="imported-passage" lang="en">${esc(text).replace(/\b(2[6-9]|3[0-5])\b/g,'<button class="inline-blank" data-blank="$1">$1</button>')}</div>`:`<div class="passage-empty"><span class="paper-icon">Aa</span><h4>从原文开始做题</h4><p>打开来源页阅读，在右侧填写答案。你也可以把持有的题目粘贴到下方，之后直接在本站练习。</p><a class="btn" href="${esc(ex.sourceUrl)}" target="_blank" rel="noopener noreferrer">打开真题原文 ↗</a><small>来源页可能附有答案，阅读时请先停留在题目部分。</small></div>`}
      <details class="paste-details" ${text?'':'open'}><summary>${text?'编辑或清除已保存的原文':'粘贴原文到本机'}</summary><label for="passage-input">保留原题的 26—35 题号；文本仅存当前浏览器。</label><textarea id="passage-input" rows="7" maxlength="30000" placeholder="在这里粘贴你持有的这套题目原文…">${esc(text)}</textarea><div class="paste-actions"><button class="btn btn-small" data-exam-action="save-passage">保存原文</button>${text?'<button class="text-button" data-exam-action="clear-passage">清除本套原文</button>':''}</div></details>
      <div class="exam-record">${history?`上次得分 ${history.score}/10 · ${esc(history.date)} · 已做 ${history.attempts} 次`:'尚未提交这套练习。'}</div></div>
      <div class="answer-column"><div class="passage-top"><h4>备选词 A—O</h4><span>每词最多使用一次</span></div><div class="word-bank">${ex.choices.map(c=>`<button data-bank-letter="${c.letter}" class="bank-word ${Object.values(examAnswers).includes(c.letter)?'used':''}" ${examSubmitted?'disabled':''}><span>${c.letter}</span>${esc(c.word)}</button>`).join('')}</div><p class="answer-tip">先点击题号，再点备选词；也可直接用下拉框选词。</p><div class="answer-grid">${ex.answers.map(a=>`<label class="answer-slot ${activeBlank===a.number?'focused':''} ${examSubmitted?(examAnswers[a.number]===a.letter?'right':'incorrect'):''}" data-slot="${a.number}"><span>${a.number}</span><select aria-label="第${a.number}题答案" data-answer-number="${a.number}" ${examSubmitted?'disabled':''}><option value="">选择</option>${ex.choices.map(c=>`<option value="${c.letter}" ${examAnswers[a.number]===c.letter?'selected':''} ${Object.entries(examAnswers).some(([n,l])=>Number(n)!==a.number&&l===c.letter)?'disabled':''}>${c.letter}. ${esc(c.word)}</option>`).join('')}</select></label>`).join('')}</div><div class="exam-submit-row"><span>${examSubmitted?`本次 ${score} / 10`:`已填 ${filled} / 10`}</span>${examSubmitted?'<button class="btn" data-exam-action="retry">重新练习</button>':`<button class="btn" data-exam-action="submit" ${filled!==10?'disabled':''}>提交并看讲解</button>`}</div></div></div>
      ${examSubmitted?`<div class="exam-feedback"><div class="section-heading"><h3>逐空讲解 · ${score}/10</h3><span class="count-badge">${score===10?'全部正确':`${10-score} 个空需要复习`}</span></div>${ex.answers.map(a=>{const correct=examAnswers[a.number]===a.letter,c=ex.choices.find(c=>c.letter===a.letter),selected=ex.choices.find(c=>c.letter===examAnswers[a.number]);return `<article class="answer-explanation"><span class="answer-number ${correct?'right':'incorrect'}">${a.number}</span><div><h4>${a.letter}. ${esc(c.word)} <small>${esc(c.pos)} · ${esc(c.meaning)}</small></h4>${!correct?`<p class="your-choice">你的答案：${esc(selected?.letter)}. ${esc(selected?.word)}</p>`:''}<p>${esc(a.explanation)}</p><p class="clue-line">判断线索：${esc(a.clue)}</p></div></article>`}).join('')}</div>`:''}</div>`;
  }
  examSection.addEventListener('change',e=>{
    const n=e.target.dataset.answerNumber;if(!n||examSubmitted)return;
    if(e.target.value)examAnswers[n]=e.target.value;else delete examAnswers[n];activeBlank=Number(n);renderExam();
    examSection.querySelector(`[data-answer-number="${n}"]`)?.focus({preventScroll:true});
  });
  examSection.addEventListener('click',e=>{
    const id=e.target.closest('[data-exam-id]')?.dataset.examId;if(id){selectExam(id);return;}
    const blank=e.target.closest('[data-blank]')?.dataset.blank;
    const slot=e.target.closest('[data-slot]')?.dataset.slot;
    if(blank||slot){activeBlank=Number(blank||slot);examSection.querySelectorAll('[data-slot]').forEach(el=>el.classList.toggle('focused',Number(el.dataset.slot)===activeBlank));if(blank)examSection.querySelector(`[data-answer-number="${activeBlank}"]`)?.focus();}
    const letter=e.target.closest('[data-bank-letter]')?.dataset.bankLetter;
    if(letter&&!examSubmitted){const assigned=Object.entries(examAnswers).find(([,l])=>l===letter);if(assigned&&Number(assigned[0])!==activeBlank){toast(`该词已用于第 ${assigned[0]} 空，请先修改那一空。`);return;}examAnswers[activeBlank]=letter;activeBlank=activeExam.answers.find(a=>!examAnswers[a.number])?.number||activeBlank;renderExam();return;}
    const action=e.target.closest('[data-exam-action]')?.dataset.examAction;
    if(action==='today'){selectExam(exams[plan.examIndex].id);return;}
    if(action==='learn'){resetStudy('exam',activeExam);setView('daily',true);return;}
    if(action==='retry'){examAnswers={};examSubmitted=false;activeBlank=26;renderExam();return;}
    if(action==='save-passage'){const input=$('#passage-input').value.trim();if(input.length<60){toast('请粘贴完整的题目原文后再保存。');return;}state.passages[activeExam.id]=input;save();renderExam();toast('原文已保存在当前浏览器。');return;}
    if(action==='clear-passage'){delete state.passages[activeExam.id];save();renderExam();toast('已清除本套原文，答题记录仍保留。');return;}
    if(action==='submit'&&!examSubmitted&&Object.keys(examAnswers).length===10&&new Set(Object.values(examAnswers)).size===10){examSubmitted=true;const score=activeExam.answers.filter(a=>examAnswers[a.number]===a.letter).length;state.exams[activeExam.id]={score,date:today,attempts:(state.exams[activeExam.id]?.attempts||0)+1};for(const a of activeExam.answers){if(examAnswers[a.number]!==a.letter){const c=activeExam.choices.find(c=>c.letter===a.letter),key=cardFromChoice(activeExam,c).key;state.learning[key]=nextReview(state.learning[key],false,today);}}save();renderExam();renderDaily();}
  });
  document.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>{const v=b.dataset.nav;if(v==='daily')renderDaily();if(v==='exam')renderExam();setView(v,true);}));
  // Existing primary action remains a short context exercise; make its panel visible.
  $('#daily-start').addEventListener('click',()=>setView('practice',true));
  const quick=document.createElement('div');quick.className='daily-shortcuts';quick.innerHTML=`<button data-open-daily="affix"><span>今日词缀</span><strong>${plan.affix}- · 第 ${plan.round} 轮</strong>${icon('arrow')}</button><button data-open-daily="words"><span>今日真题词</span><strong>${esc(exams[plan.examIndex].title)} · 15 词</strong>${icon('arrow')}</button><button data-open-daily="exam"><span>每日真题</span><strong>${esc(examDate(exams[plan.examIndex]))} · 10 空</strong>${icon('arrow')}</button>`;
  $('.overview').append(quick);
  quick.addEventListener('click',e=>{const v=e.target.closest('[data-open-daily]')?.dataset.openDaily;if(v==='affix'){resetStudy('affix');setView('daily',true);}if(v==='words'){resetStudy('exam',exams[plan.examIndex]);setView('daily',true);}if(v==='exam'){selectExam(exams[plan.examIndex].id);setView('exam',true);}});
  resetStudy('affix');renderExam();setView('daily');save();
}
