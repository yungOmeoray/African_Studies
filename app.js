const questions = QUESTION_BANK;
const labels={foundations:'Foundations & life cycles',processes:'Process groups',technical:'Technical processes',methods:'Analyses & methods',tailoring:'Tailoring & application',mixed:'Mixed handbook practice'};
const cram=[
 ['Need → stakeholder requirement → system requirement','A need expresses the desired outcome or problem in context. Stakeholder requirements formalize the stakeholder-oriented view. System requirements transform that view into the technical characteristics of a solution.','§2.3.5.1–2.3.5.3, pp. 103–118'],
 ['Architecture vs. design','Architecture defines concepts, structure, principles, properties, and relationships. Design adds enough detail to enable implementation in accordance with requirements and architecture.','§2.3.5.4–2.3.5.5, pp. 118–129'],
 ['Verification vs. validation','Verification asks whether specified requirements are fulfilled. Validation asks whether the system achieves intended use, mission/business objectives, and stakeholder needs in its operational environment.','§2.3.5.9 & §2.3.5.11, pp. 141–149'],
 ['MOE vs. MOP vs. TPM','MOEs address operational effectiveness; MOPs address system performance; TPMs track selected technical parameters and trends during development.','§2.3.4.7, pp. 93–98'],
 ['Iteration, recursion, concurrency','Iteration repeats activities to improve or resolve; recursion reapplies a process at successive system levels; concurrency means processes overlap and interact rather than forming one fixed sequence.','§2.3.1.2, pp. 42–44'],
 ['The four process groups','Agreement; Organizational Project-Enabling; Technical Management; Technical. The grouping is a framework—not a mandatory execution sequence.','§2.3.1, pp. 39–44'],
 ['Integration vs. transition','Integration combines elements and establishes their interactions. Transition places the verified system in its operational environment and establishes readiness for use.','§2.3.5.8 & §2.3.5.10, pp. 137–146'],
 ['Tailoring','Adapt process use to context, risk, complexity, system type, life cycle, standards, and agreements while retaining necessary outcomes and value-adding rigor.','§4.1, pp. 215–219'],
 ['Risk includes opportunity','Risk management addresses uncertain effects on objectives—both threats and opportunities—through planning, identification, analysis, treatment, and monitoring.','§2.3.4.4, pp. 81–87'],
 ['Six typical life-cycle stages','Concept, development, production, utilization, support, retirement. Organizations can adapt the model and decision gates to context.','§2.1.2, pp. 26–29']
];
const defaultState={attempts:0,correct:0,misses:[],confidence:{},domains:[],seen:[]};
let state=Object.assign({},defaultState,JSON.parse(localStorage.getItem('asep-sprint')||'{}'));
let quiz=[],index=0,current=null,answered=false,mode='mixed';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function save(){localStorage.setItem('asep-sprint',JSON.stringify(state));updateStats()}
function updateStats(){
 const accuracy=state.attempts?Math.round(state.correct/state.attempts*100):0;
 $('#answered-total').textContent=state.attempts;$('#miss-count').textContent=state.misses.length;$('#retry-total').textContent=state.misses.length;
 $('#accuracy').textContent=state.attempts?accuracy+'%':'—';$('#coverage').textContent=`${state.seen.length}/1000`;
 $('#mastery-value').textContent=accuracy+'%';$('#mastery-ring').style.background=`conic-gradient(#e7a060 ${accuracy*3.6}deg,#315b4d 0deg)`;
 $('#review-title').textContent=state.misses.length?`${state.misses.length} question${state.misses.length===1?'':'s'} ready to retry.`:'Your retry queue is clear.';
 $('#review-copy').textContent=state.misses.length?'Answer these again without notes. A correct, confident retry removes each item from the queue.':'Missed or low-confidence questions will collect here for a targeted second pass.';
 $('#review-action').innerHTML=state.misses.length?'Start retry session <span>→</span>':'Practice mixed questions <span>→</span>';
}
function showView(name){$$('.view').forEach(v=>v.classList.toggle('active',v.id===name));$$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===name));$('#view-title').textContent=name==='cram'?'Rapid review':name[0].toUpperCase()+name.slice(1);window.scrollTo(0,0);$('.sidebar').classList.remove('open')}
function shuffled(a){return [...a].sort(()=>Math.random()-.5)}
function startQuiz(topic='mixed',review=false){
 mode=review?'review':topic;const requested=Number($('#session-size').value)||25;
 let fullPool=review?questions.filter(q=>state.misses.includes(q.id)):(topic==='mixed'?questions:questions.filter(q=>q.d===topic));
 if(!fullPool.length){fullPool=questions;mode='mixed'}
 const unseen=fullPool.filter(q=>!state.seen.includes(q.id));
 const pool=review?fullPool:(unseen.length?unseen:fullPool);
 quiz=shuffled(pool).slice(0,Math.min(requested,pool.length));index=0;
 $('#quiz-title').textContent=review?'Retry your misses':labels[topic]||labels.mixed;$('#quiz-kicker').textContent=review?'TARGETED RETRIEVAL':'FOCUSED PRACTICE';showView('practice');renderQuestion();
}
function renderQuestion(){
 if(index>=quiz.length){finishQuiz();return}current=quiz[index];answered=false;$('#question-number').textContent=`${index+1} / ${quiz.length}`;$('#quiz-bar').style.width=`${(index+1)/quiz.length*100}%`;$('#question-domain').textContent=labels[current.d].toUpperCase();$('#question-text').textContent=current.q;$('#feedback').hidden=true;
 $('#answers').innerHTML=current.a.map((x,i)=>`<button class="answer" data-answer="${i}"><b>${String.fromCharCode(65+i)}</b><span>${x}</span></button>`).join('');$$('.answer').forEach(b=>b.addEventListener('click',()=>answer(+b.dataset.answer)));$$('.confidence button').forEach(b=>b.classList.remove('selected'));
}
function answer(choice){
 if(answered)return;answered=true;state.attempts++;const ok=choice===current.c;if(ok)state.correct++;else if(!state.misses.includes(current.id))state.misses.push(current.id);if(!state.domains.includes(current.d))state.domains.push(current.d);if(!state.seen.includes(current.id))state.seen.push(current.id);
 $$('.answer').forEach((b,i)=>{b.disabled=true;if(i===current.c)b.classList.add('correct');if(i===choice&&!ok)b.classList.add('wrong')});$('#feedback').hidden=false;$('#feedback-icon').textContent=ok?'✓':'!';$('#feedback-heading').textContent=ok?'Correct — lock in the distinction.':'Not quite — retrieve the rationale.';$('#feedback-icon').style.background=ok?'var(--mint)':'#fae4df';$('#feedback-icon').style.color=ok?'var(--green)':'var(--red)';$('#explanation').textContent=current.e;$('#reference').textContent=current.r;save();
}
function finishQuiz(){showView('dashboard');const hero=$('.hero');hero.animate([{transform:'scale(.99)',opacity:.75},{transform:'scale(1)',opacity:1}],{duration:400});}
$$('.nav-item').forEach(n=>n.addEventListener('click',()=>showView(n.dataset.view)));$('.menu').addEventListener('click',()=>$('.sidebar').classList.toggle('open'));$('#start-practice').addEventListener('click',()=>startQuiz('mixed'));$('#quit-quiz').addEventListener('click',()=>showView('dashboard'));$('#next-question').addEventListener('click',()=>{index++;renderQuestion()});
$$('[data-topic]').forEach(b=>b.addEventListener('click',()=>startQuiz(b.dataset.topic)));$$('[data-review]').forEach(b=>b.addEventListener('click',()=>state.misses.length?startQuiz('mixed',true):showView('review')));$$('[data-cram]').forEach(b=>b.addEventListener('click',()=>showView('cram')));$('#review-action').addEventListener('click',()=>startQuiz('mixed',state.misses.length>0));
$$('.confidence button').forEach(b=>b.addEventListener('click',()=>{const level=+b.dataset.confidence;state.confidence[current.id]=level;$$('.confidence button').forEach(x=>x.classList.toggle('selected',x===b));if(level===3&&current.c===+$('.answer.correct').dataset.answer)state.misses=state.misses.filter(id=>id!==current.id);else if(level<2&&!state.misses.includes(current.id))state.misses.push(current.id);save()}));
const domainCounts=Object.fromEntries(Object.keys(labels).filter(d=>d!=='mixed').map(d=>[d,questions.filter(q=>q.d===d).length]));
$('#bank-breakdown').innerHTML=Object.entries(domainCounts).map(([d,count],i)=>`<span><b>${count}</b>${labels[d]}${i<4?'<em>high yield</em>':''}</span>`).join('');
$('#cram-grid').innerHTML=cram.map(([q,a,r])=>`<article class="cram-card"><button>${q}<span>＋</span></button><div class="cram-answer">${a}<b>HANDBOOK ${r}</b></div></article>`).join('');$$('.cram-card button').forEach(b=>b.addEventListener('click',()=>{b.parentElement.classList.toggle('open');b.querySelector('span').textContent=b.parentElement.classList.contains('open')?'−':'＋'}));
updateStats();
