/*
 * Handbook-grounded concept catalog and deterministic question generator.
 * Each concept produces multiple retrieval directions and scenario phrasings.
 * Every item has one keyed answer, two nearby handbook concepts, and one
 * deliberately easy elimination. Stable IDs allow non-repeating progress.
 */
const CONCEPTS = [
  // Foundations, systems concepts, and life-cycle models
  {d:'foundations',n:'Systems engineering',cue:'a transdisciplinary and integrative approach that enables the successful realization, use, and retirement of engineered systems',near:['Systems analysis','Project management'],r:'§1.1, pp. 1–2'},
  {d:'foundations',n:'System of interest',cue:'the system whose life cycle is under consideration and to which systems engineering is applied',near:['Enabling system','Interfacing system'],r:'§1.2, pp. 2–12'},
  {d:'foundations',n:'Enabling system',cue:'a system that supports a life-cycle stage of the system of interest but does not necessarily contribute directly to its operational capability',near:['System of interest','Interoperating system'],r:'§1.2, pp. 8–11'},
  {d:'foundations',n:'Emergence',cue:'properties or behaviors of a whole that arise from interactions among elements and are not adequately understood by examining elements alone',near:['Decomposition','Traceability'],r:'§1.2, pp. 9–10'},
  {d:'foundations',n:'System boundary',cue:'the conceptual limit that separates the system of interest from its environment and helps identify external interactions',near:['Architecture viewpoint','Configuration baseline'],r:'§1.2, pp. 8–12'},
  {d:'foundations',n:'Life-cycle cost commitment',cue:'the principle that early decisions commit a large share of total life-cycle cost before the same share has actually been spent',near:['Sunk-cost accounting','Earned value'],r:'§1.4, pp. 21–23'},
  {d:'foundations',n:'Concept, development, production, utilization, support, retirement',cue:'the six typical stages in the handbook’s informative system life-cycle model',near:['Need, design, build, test, deploy, dispose','Plan, acquire, verify, validate, operate, close'],r:'§2.1.2, pp. 26–29'},
  {d:'foundations',n:'Decision gate',cue:'a governance point at which evidence and maturity are evaluated to decide whether and how work should proceed',near:['Technical audit','Configuration status accounting'],r:'§2.1.3, pp. 29–31'},
  {d:'foundations',n:'Technical review',cue:'an evaluation used to assess technical progress, maturity, risks, and readiness against defined criteria',near:['Decision gate','Quality audit'],r:'§2.1.4, pp. 31–33'},
  {d:'foundations',n:'Sequential life-cycle approach',cue:'a life-cycle approach in which major activities and stages generally progress in a planned sequence with limited overlap',near:['Incremental life-cycle approach','Evolutionary life-cycle approach'],r:'§2.2.1, pp. 35–36'},
  {d:'foundations',n:'Incremental life-cycle approach',cue:'a life-cycle approach that delivers capability in planned portions, with each increment adding to the system',near:['Sequential life-cycle approach','Evolutionary life-cycle approach'],r:'§2.2.2, pp. 36–38'},
  {d:'foundations',n:'Evolutionary life-cycle approach',cue:'a life-cycle approach in which the system evolves through repeated cycles as learning, feedback, and changing needs shape future versions',near:['Incremental life-cycle approach','Sequential life-cycle approach'],r:'§2.2.3, pp. 38–39'},
  {d:'foundations',n:'Iteration',cue:'repeating activities at the same system level to increase understanding, resolve issues, or improve an outcome',near:['Recursion','Concurrency'],r:'§2.3.1.2, pp. 42–44'},
  {d:'foundations',n:'Recursion',cue:'reapplying the same system life-cycle processes to successive levels of the system structure',near:['Iteration','Concurrency'],r:'§2.3.1.2, pp. 42–44'},
  {d:'foundations',n:'Concurrency',cue:'performing and coordinating interacting life-cycle processes with overlap rather than as one rigid sequence',near:['Iteration','Recursion'],r:'§2.3.1.2, pp. 42–44'},

  // Agreement, organizational enabling, and technical-management processes
  {d:'processes',n:'Acquisition process',cue:'preparing for, establishing, and monitoring an agreement to obtain a product or service from a supplier',near:['Supply process','Portfolio management process'],r:'§2.3.2.1, pp. 45–48'},
  {d:'processes',n:'Supply process',cue:'establishing and fulfilling an agreement to provide a product or service to an acquirer',near:['Acquisition process','Project planning process'],r:'§2.3.2.2, pp. 48–50'},
  {d:'processes',n:'Life-cycle model management process',cue:'establishing and maintaining organizational life-cycle models, processes, and tailoring guidance',near:['Portfolio management process','Project planning process'],r:'§2.3.3.1, pp. 51–54'},
  {d:'processes',n:'Infrastructure management process',cue:'providing and maintaining the facilities, tools, communications, and other infrastructure needed by projects',near:['Human resource management process','Information management process'],r:'§2.3.3.2, pp. 54–57'},
  {d:'processes',n:'Portfolio management process',cue:'initiating and sustaining projects that are necessary, sufficient, and suitable to meet organizational objectives',near:['Project assessment and control process','Life-cycle model management process'],r:'§2.3.3.3, pp. 57–60'},
  {d:'processes',n:'Human resource management process',cue:'providing the organization with personnel who have the competencies needed to perform life-cycle activities',near:['Knowledge management process','Infrastructure management process'],r:'§2.3.3.4, pp. 60–63'},
  {d:'processes',n:'Quality management process',cue:'assuring that organizational products, services, and process implementation meet quality objectives and stakeholder satisfaction goals',near:['Quality assurance process','Measurement process'],r:'§2.3.3.5, pp. 63–67'},
  {d:'processes',n:'Knowledge management process',cue:'creating, sharing, using, and maintaining knowledge so the organization benefits from experience and learning',near:['Information management process','Human resource management process'],r:'§2.3.3.6, pp. 67–70'},
  {d:'processes',n:'Project planning process',cue:'producing and coordinating effective, workable plans that direct project assessment, control, and execution',near:['Project assessment and control process','Decision management process'],r:'§2.3.4.1, pp. 70–75'},
  {d:'processes',n:'Project assessment and control process',cue:'assessing progress and directing corrective action when project performance differs from plans',near:['Project planning process','Measurement process'],r:'§2.3.4.2, pp. 75–78'},
  {d:'processes',n:'Decision management process',cue:'providing a structured, analytical framework for objectively identifying, evaluating, and selecting alternatives',near:['Risk management process','System analysis process'],r:'§2.3.4.3, pp. 78–81'},
  {d:'processes',n:'Risk management process',cue:'identifying, analyzing, treating, and monitoring uncertainty that can create threats or opportunities for objectives',near:['Decision management process','Project assessment and control process'],r:'§2.3.4.4, pp. 81–87'},
  {d:'processes',n:'Configuration management process',cue:'establishing and maintaining the integrity of identified system and project artifacts and controlling changes over time',near:['Information management process','Quality assurance process'],r:'§2.3.4.5, pp. 87–91'},
  {d:'processes',n:'Information management process',cue:'generating, obtaining, confirming, transforming, retaining, retrieving, disseminating, and disposing of information',near:['Knowledge management process','Configuration management process'],r:'§2.3.4.6, pp. 91–93'},
  {d:'processes',n:'Measurement process',cue:'collecting, analyzing, and reporting objective data to support management and demonstrate quality and performance',near:['Quality assurance process','Project assessment and control process'],r:'§2.3.4.7, pp. 93–98'},
  {d:'processes',n:'Quality assurance process',cue:'providing objective assurance that processes and products comply with established requirements, plans, and agreements',near:['Quality management process','Verification process'],r:'§2.3.4.8, pp. 98–101'},

  // Technical processes
  {d:'technical',n:'Business or mission analysis process',cue:'defining the problem or opportunity space and identifying and evaluating candidate solution classes',near:['Stakeholder needs and requirements definition process','System analysis process'],r:'§2.3.5.1, pp. 103–107'},
  {d:'technical',n:'Stakeholder needs and requirements definition process',cue:'eliciting and transforming stakeholder needs into an agreed stakeholder-oriented set of requirements in the operational context',near:['System requirements definition process','Business or mission analysis process'],r:'§2.3.5.2, pp. 107–112'},
  {d:'technical',n:'System requirements definition process',cue:'transforming the stakeholder and user-oriented view of desired capabilities into a technical view of a solution',near:['Stakeholder needs and requirements definition process','Design definition process'],r:'§2.3.5.3, pp. 112–118'},
  {d:'technical',n:'System architecture definition process',cue:'generating system architecture alternatives and selecting concepts, properties, structure, and relationships consistent with requirements',near:['Design definition process','System analysis process'],r:'§2.3.5.4, pp. 118–124'},
  {d:'technical',n:'Design definition process',cue:'providing sufficiently detailed data and information about the system and its elements to enable implementation',near:['System architecture definition process','Implementation process'],r:'§2.3.5.5, pp. 124–129'},
  {d:'technical',n:'System analysis process',cue:'providing a rigorous basis for resolving technical questions, evaluating alternatives, and supporting technical decisions',near:['Decision management process','Business or mission analysis process'],r:'§2.3.5.6, pp. 129–134'},
  {d:'technical',n:'Implementation process',cue:'realizing a specified system element in accordance with its design information and applicable constraints',near:['Integration process','Design definition process'],r:'§2.3.5.7, pp. 134–137'},
  {d:'technical',n:'Integration process',cue:'combining system elements and demonstrating that their interfaces and interactions form the intended configuration',near:['Implementation process','Transition process'],r:'§2.3.5.8, pp. 137–141'},
  {d:'technical',n:'Verification process',cue:'providing objective evidence that a system or system element fulfills its specified requirements and characteristics',near:['Validation process','Quality assurance process'],r:'§2.3.5.9, pp. 141–144'},
  {d:'technical',n:'Transition process',cue:'establishing the verified system in its operational environment and enabling readiness to provide intended services',near:['Integration process','Operation process'],r:'§2.3.5.10, pp. 144–146'},
  {d:'technical',n:'Validation process',cue:'providing objective evidence that the system in use fulfills business or mission objectives and stakeholder needs in its intended environment',near:['Verification process','Transition process'],r:'§2.3.5.11, pp. 146–149'},
  {d:'technical',n:'Operation process',cue:'using the system to deliver its intended services while monitoring operational performance and supporting users',near:['Transition process','Maintenance process'],r:'§2.3.5.12, pp. 149–154'},
  {d:'technical',n:'Maintenance process',cue:'sustaining the system’s capability to provide service through corrective, preventive, adaptive, and perfective actions',near:['Operation process','Disposal process'],r:'§2.3.5.13, pp. 154–156'},
  {d:'technical',n:'Disposal process',cue:'ending the existence of a system or system element while addressing health, safety, security, and environmental concerns',near:['Maintenance process','Transition process'],r:'§2.3.5.14, pp. 156–158'},
  {d:'technical',n:'Measure of effectiveness',cue:'a measure of how well a system achieves mission or operational outcomes from the stakeholder or user perspective',near:['Measure of performance','Technical performance measure'],r:'§2.3.4.7, pp. 93–98'},
  {d:'technical',n:'Measure of performance',cue:'a measure that characterizes a system’s performance attributes independent of a particular mission scenario',near:['Measure of effectiveness','Technical performance measure'],r:'§2.3.4.7, pp. 93–98'},
  {d:'technical',n:'Technical performance measure',cue:'a selected technical parameter tracked against planned values and thresholds to assess development progress and risk',near:['Measure of performance','Measure of effectiveness'],r:'§2.3.4.7, pp. 93–98'},

  // Quality characteristics, analyses, and methods
  {d:'methods',n:'Affordability analysis',cue:'balancing system performance, schedule, and risk against life-cycle resources and cost constraints',near:['Life-cycle cost analysis','Manufacturability analysis'],r:'§3.1.2, pp. 160–165'},
  {d:'methods',n:'Agility engineering',cue:'engineering the ability to respond effectively and efficiently to changing missions, threats, technologies, or environments',near:['Resilience engineering','Evolutionary development'],r:'§3.1.3, pp. 165–168'},
  {d:'methods',n:'Human systems integration',cue:'integrating human considerations, capabilities, and limitations into system definition and development across the life cycle',near:['Human resource management','System safety engineering'],r:'§3.1.4, pp. 168–171'},
  {d:'methods',n:'Interoperability analysis',cue:'evaluating the ability of systems or elements to exchange information or services and use what is exchanged',near:['Interface management','Integration analysis'],r:'§3.1.5, pp. 171–172'},
  {d:'methods',n:'Logistics engineering',cue:'planning and engineering the support resources and services needed to sustain system operation over its life cycle',near:['Maintenance process','Infrastructure management'],r:'§3.1.6, pp. 172–175'},
  {d:'methods',n:'Manufacturability and producibility analysis',cue:'evaluating whether a design can be produced consistently and economically using available production capabilities',near:['Affordability analysis','Implementation analysis'],r:'§3.1.7, pp. 175–176'},
  {d:'methods',n:'Reliability, availability, and maintainability engineering',cue:'engineering failure-free performance, readiness for use, and restoration or upkeep characteristics together',near:['Resilience engineering','Quality assurance'],r:'§3.1.8, pp. 176–180'},
  {d:'methods',n:'Resilience engineering',cue:'engineering the capacity to withstand, recover from, and adapt to disruptive events or conditions',near:['Agility engineering','Reliability engineering'],r:'§3.1.9, pp. 180–184'},
  {d:'methods',n:'Sustainability engineering',cue:'considering environmental, social, and economic effects so present needs are met without compromising future needs',near:['Affordability analysis','Disposal planning'],r:'§3.1.10, pp. 184–185'},
  {d:'methods',n:'System safety engineering',cue:'identifying and reducing hazards and accident risks to an acceptable level throughout the life cycle',near:['System security engineering','Risk management'],r:'§3.1.11, pp. 185–190'},
  {d:'methods',n:'System security engineering',cue:'addressing protection from intentional or accidental events that can compromise assets, functions, information, or services',near:['System safety engineering','Resilience engineering'],r:'§3.1.12, pp. 190–191'},
  {d:'methods',n:'Modeling, analysis, and simulation',cue:'using purposeful abstractions and analytical or executable representations to understand behavior and support decisions',near:['Prototyping','Architecture framework'],r:'§3.2.1, pp. 192–200'},
  {d:'methods',n:'Prototyping',cue:'creating a preliminary representation or realization to learn, reduce uncertainty, explore feasibility, or obtain feedback',near:['Modeling and simulation','Implementation'],r:'§3.2.2, pp. 200–201'},
  {d:'methods',n:'Traceability',cue:'recording relationships among needs, requirements, architecture, design, verification, and other artifacts to support consistency and impact analysis',near:['Configuration management','Interface management'],r:'§3.2.3, pp. 201–202'},
  {d:'methods',n:'Interface management',cue:'identifying, defining, controlling, and maintaining consistency of interactions across system and organizational boundaries',near:['Integration process','Traceability'],r:'§3.2.4, pp. 202–206'},
  {d:'methods',n:'Architecture framework',cue:'a set of conventions, principles, and practices for organizing architecture descriptions for stakeholder concerns',near:['Architecture pattern','System model'],r:'§3.2.5, pp. 206–208'},
  {d:'methods',n:'Pattern',cue:'a reusable arrangement or approach that captures a proven solution to a recurring problem in context',near:['Architecture framework','Reference model'],r:'§3.2.6, pp. 208–212'},
  {d:'methods',n:'Design thinking',cue:'a human-centered, iterative approach emphasizing empathy, problem framing, ideation, prototyping, and learning',near:['Decision analysis','Systems thinking'],r:'§3.2.7, pp. 212–213'},
  {d:'methods',n:'Biomimicry',cue:'seeking design insight from forms, processes, and strategies observed in living systems and nature',near:['Design thinking','Evolutionary development'],r:'§3.2.8, pp. 213–214'},

  // Tailoring and application considerations
  {d:'tailoring',n:'Tailoring',cue:'adapting life-cycle processes and activities to organizational, project, and system context while preserving necessary outcomes',near:['Process waiver','Process sequencing'],r:'§4.1, pp. 215–219'},
  {d:'tailoring',n:'Model-based systems engineering',cue:'the formalized application of modeling to support requirements, design, analysis, verification, and validation across the life cycle',near:['Modeling and simulation','Document-based engineering'],r:'§4.2.1, pp. 219–221'},
  {d:'tailoring',n:'Agile systems engineering',cue:'integrating iterative learning and incremental delivery with systems thinking and disciplined whole-system engineering',near:['Evolutionary life cycle','Lean systems engineering'],r:'§4.2.2, pp. 221–224'},
  {d:'tailoring',n:'Lean systems engineering',cue:'applying lean thinking to maximize stakeholder value, reduce waste, improve flow, and support continuous learning',near:['Agile systems engineering','Affordability analysis'],r:'§4.2.3, pp. 224–226'},
  {d:'tailoring',n:'Product line engineering',cue:'engineering a managed family of related products using shared assets and planned variation',near:['Portfolio management','Platform integration'],r:'§4.2.4, pp. 226–229'},
  {d:'tailoring',n:'Brownfield or legacy system',cue:'a system context shaped by existing capabilities, constraints, interfaces, technical debt, and operational continuity',near:['Greenfield system','Commercial off-the-shelf system'],r:'§4.3.2, pp. 230–231'},
  {d:'tailoring',n:'Commercial off-the-shelf based system',cue:'a system that incorporates available commercial items whose fixed capabilities, interfaces, roadmaps, and supplier decisions constrain engineering',near:['Brownfield system','Greenfield system'],r:'§4.3.3, pp. 231–232'},
  {d:'tailoring',n:'System of systems',cue:'a collection whose constituent systems retain operational and managerial independence while collaborating for broader capabilities',near:['Complex system','Enterprise system'],r:'§4.3.6, pp. 235–238'},
  {d:'tailoring',n:'Service system',cue:'a system in which people, processes, information, and technology interact to co-create and deliver value through services',near:['Enterprise system','Software-intensive system'],r:'§4.3.8, pp. 239–241'},
  {d:'tailoring',n:'Enterprise system',cue:'a system spanning organizational missions, resources, processes, people, information, and technologies to achieve enterprise outcomes',near:['Service system','System of systems'],r:'§4.3.9, pp. 241–244'}
];

const STEMS = [
  'A team needs to identify the handbook concept described below. Which answer is most precise?',
  'Which handbook term best fits this situation?',
  'An ASEP candidate is given the following description. What should they select?',
  'Which option is the strongest match, using the handbook’s terminology?',
  'A review board asks which concept directly owns the following purpose. What is the best answer?',
  'Which answer preserves the most important distinction in the handbook?',
  'A project applies the following activity. Which concept is being used?',
  'Which term would be least ambiguous in an engineering plan for this purpose?',
  'Select the process, method, or concept that most directly addresses this need.',
  'Two answers may look related, but which one is the direct handbook match?'
];
const REVERSE_STEMS = [
  'Which description most accurately defines',
  'Which purpose belongs most directly to',
  'Which statement would be correct in a handbook-grounded review of',
  'A project plan invokes this concept. Which activity should reviewers expect from',
  'Which outcome is the best evidence that a team is applying',
  'Which explanation best distinguishes',
  'Which statement is most defensible for',
  'What is the primary emphasis of',
  'Which scenario best demonstrates',
  'Which description should an ASEP candidate associate with'
];
const THROWAWAY_NAMES = ['Cafeteria menu approval','Office parking allocation','Corporate holiday scheduling','Desktop wallpaper management'];
const THROWAWAY_CUES = [
  'choosing office decorations without reference to system objectives or stakeholders',
  'scheduling a social event unrelated to the system life cycle',
  'approving cafeteria options as a substitute for technical evidence',
  'tracking personal preferences with no connection to an engineered system'
];
const domainOrder=['foundations','processes','technical','methods','tailoring'];
const domainGroups=Object.fromEntries(domainOrder.map(d=>[d,CONCEPTS.filter(c=>c.d===d)]));
function hash(text){let h=2166136261;for(const ch of text){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
function rotate(items,amount){const n=amount%items.length;return items.slice(n).concat(items.slice(0,n))}
function reversePeers(concept){
  const chosen=[];
  for(const name of concept.near){
    const exact=CONCEPTS.find(c=>c.n===name);
    if(exact&&exact.n!==concept.n&&!chosen.some(c=>c.n===exact.n))chosen.push(exact);
  }
  if(chosen.length>=2)return chosen.slice(0,2);
  for(const candidate of domainGroups[concept.d]){
    if(candidate.n!==concept.n&&!chosen.some(c=>c.n===candidate.n))chosen.push(candidate);
    if(chosen.length>=2)break;
  }
  return chosen.slice(0,2);
}
function buildQuestion(concept,variant,id){
  const reverse=variant>=10;const local=variant%10;const seed=hash(`${concept.n}:${variant}`);
  let q,options,correct;
  if(!reverse){
    q=`${STEMS[local]}\n\n${concept.cue.charAt(0).toUpperCase()+concept.cue.slice(1)}.`;
    options=[concept.n,...concept.near,THROWAWAY_NAMES[seed%THROWAWAY_NAMES.length]];correct=0;
  }else{
    q=`${REVERSE_STEMS[local]} “${concept.n}”?`;
    const peers=reversePeers(concept);
    options=[concept.cue,...peers.map(p=>p.cue),THROWAWAY_CUES[seed%THROWAWAY_CUES.length]];correct=0;
  }
  const shift=seed%4;options=rotate(options,shift);correct=(correct-shift+4)%4;
  return {id,d:concept.d,q,a:options,c:correct,e:`${concept.n} is ${concept.cue}. The nearby alternatives are related, but they do not directly satisfy the wording of this question.`,r:`INCOSE SE Handbook, Fifth Edition, ${concept.r}`,concept:concept.n};
}
function buildQuestionBank(){
  const bank=[];let cycle=0;
  // Round-robin generation ensures every concept is represented before a second
  // variant is added. The catalog distribution weights the first four domains.
  while(bank.length<1000){
    for(const concept of CONCEPTS){
      if(bank.length===1000)break;
      bank.push(buildQuestion(concept,cycle%20,bank.length+1));
    }
    cycle++;
  }
  return bank;
}
const QUESTION_BANK=buildQuestionBank();
