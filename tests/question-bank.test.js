const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const source=fs.readFileSync('question-bank.js','utf8')+'\n;globalThis.__bank=QUESTION_BANK;globalThis.__concepts=CONCEPTS;globalThis.__throwaways=[...THROWAWAY_NAMES,...THROWAWAY_CUES];';
const context={};vm.createContext(context);vm.runInContext(source,context);
const bank=context.__bank;const concepts=context.__concepts;const throwaways=new Set(context.__throwaways);
assert.strictEqual(bank.length,1000,'bank must contain exactly 1,000 questions');
assert.strictEqual(new Set(bank.map(q=>q.id)).size,1000,'question IDs must be unique');
assert.strictEqual(new Set(bank.map(q=>q.q)).size,1000,'question stems must be unique');
assert.strictEqual(new Set(bank.map(q=>q.concept)).size,concepts.length,'every concept must appear');
for(const q of bank){
  assert.ok(['foundations','processes','technical','methods','tailoring'].includes(q.d),`invalid domain ${q.d}`);
  assert.strictEqual(q.a.length,4,`question ${q.id} must have four options`);
  assert.strictEqual(new Set(q.a).size,4,`question ${q.id} options must be unique`);
  assert.strictEqual(q.a.filter(a=>throwaways.has(a)).length,1,`question ${q.id} must have exactly one easy elimination`);
  assert.ok(Number.isInteger(q.c)&&q.c>=0&&q.c<4,`question ${q.id} must have one valid key`);
  assert.ok(q.e.length>80,`question ${q.id} needs a useful rationale`);
  assert.ok(q.r.includes('Fifth Edition'),`question ${q.id} needs a handbook reference`);
}
const highYield=bank.filter(q=>q.d!=='tailoring').length;
assert.ok(highYield/bank.length>=0.85,'at least 85% of questions should cover the first four domains');
const positions=[0,1,2,3].map(i=>bank.filter(q=>q.c===i).length);
positions.forEach((count,i)=>assert.ok(count>180,`correct position ${i} is underrepresented`));
const counts=Object.fromEntries(['foundations','processes','technical','methods','tailoring'].map(d=>[d,bank.filter(q=>q.d===d).length]));
console.log(JSON.stringify({questions:bank.length,concepts:concepts.length,highYield,counts,correctPositions:positions},null,2));
