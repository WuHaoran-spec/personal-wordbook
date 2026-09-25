const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const src=fs.readFileSync(new URL('../public/data.js','file://'+__filename),'utf8');
 const {words,corpusInfo}=await import('data:text/javascript;base64,'+Buffer.from(src).toString('base64'));
 assert(words.length>=32,'expected complete example corpus');
 const ids=new Set(),qids=new Set(),affixes=new Set(),pos=new Set();
 let questions=0;
 for(const w of words){
  assert(!ids.has(w.id),'duplicate word '+w.id);ids.add(w.id);affixes.add(w.affix);pos.add(w.pos);
  assert(w.source.startsWith('https://dictionary.cambridge.org/'),'missing source '+w.id);
  assert(w.meaning&&w.nuance&&w.collocation&&w.affixNote,'missing explanation '+w.id);
  assert(w.questions.length>=2,'missing repeat question '+w.id);
  for(const q of w.questions){
   questions++;
   assert(!qids.has(q.id),'duplicate question '+q.id);qids.add(q.id);
   assert.equal((q.sentence.match(/___/g)||[]).length,1,'one blank expected '+q.id);
   assert.equal(q.options.length,4,'expected four choices '+q.id);
   assert.equal(q.options.filter(o=>o.text===q.answer).length,1,'answer mapping '+q.id);
   assert.equal(new Set(q.options.map(o=>o.text)).size,q.options.length,'duplicate choice '+q.id);
   assert(q.options.every(o=>o.meaning&&o.reason),'missing option feedback '+q.id);
   assert(q.explanation&&q.clue&&q.translation,'missing context feedback '+q.id);
  }
 }
 for(const a of ['en','im','re','de'])assert(affixes.has(a),'missing affix '+a);
 for(const p of ['v.','n.','adj.','adv.'])assert(pos.has(p),'missing part of speech '+p);
 console.log(JSON.stringify({pass:true,words:words.length,questions,affixes:[...affixes],partsOfSpeech:[...pos],corpus:corpusInfo.title},null,2));
})();
