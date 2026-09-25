// Meanings checked against the linked dictionaries, 2026-09-25.
// Chinese explanations and all example sentences below are original.
// These are study examples, not CET-6 past-paper quotations or frequency claims.
const Q = (sentence, translation, answer, meaning, clue, explanation, distractors) => ({
  sentence, translation, answer, clue, explanation,
  options: [{text: answer, meaning, reason: explanation}, ...distractors.map(([text, meaning, reason]) => ({text, meaning, reason}))]
});
const W = (word, affixNote, meaning, nuance, collocation, senses, questions, source) => ({
  id: word, word, pos: 'v.', affix: 'em', affixNote, meaning, nuance, collocation, senses,
  example: questions[0].sentence.replace('___', questions[0].answer),
  translation: questions[0].translation,
  source,
  questions: questions.map((q, i) => ({id: word + '-' + (i + 1), ...q}))
});

export const emWords = [
  W('empower', 'em- + power：给予权力，也可指使人更能自主行动。', '授权；使有能力自主行动',
    '看主语提供了什么：法律可授予权限，教育或支持可增强自主能力。不是所有“鼓励”都包含授权。',
    'empower somebody to do something', [
      {label: '权限', meaning: '正式赋予某人做某事的权力。', pattern: 'be empowered to approve a request'},
      {label: '自主能力', meaning: '通过知识、资源或信心支持，使人更能掌握自己的处境。', pattern: 'empower people to make decisions'}
    ], [
      Q('The new policy will ___ branch managers to approve refunds without asking head office.', '新政策将授权分店经理自行批准退款，无须请示总部。', 'empower', '授权',
        'without asking head office 表示原来集中的批准权被授予分店经理。',
        'policy 改变的是决策权限，empower somebody to do something 表示授权某人做某事。',
        [['embolden','使更有胆量','增加胆量不能赋予批准退款的正式权限。'],['compel','强迫','句子给予自主批准权，没有要求经理必须退款。'],['remind','提醒','重点是权限变化，没有提醒已知事项。']]),
      Q('The course aims to ___ residents by giving them the skills and confidence to manage their own budgets.', '这门课程通过提供技能并增强信心，帮助居民自主安排预算。', 'empower', '使有能力自主行动',
        'skills and confidence 与 their own budgets 共同指向自主能力。',
        '这里的 empower 不必译成法律意义的“授权”，而是使居民有能力、有信心掌握自己的财务安排。',
        [['restrict','限制','提供自主理财能力与限制居民的方向相反。'],['embitter','使怨愤','课程的目标是增加能力和信心，没有制造怨恨。'],['replace','取代','居民仍是安排预算的人，并未被取代。']])
    ], 'https://dictionary.cambridge.org/dictionary/english/empower'),
  W('embody', 'em- + body 家族：使抽象内容具有可见的具体形式。', '体现；使具体化；包含',
    '人、行为或事物体现某种品质时用 embody；不是单纯把一个文件放进另一个文件。',
    'embody an idea / embody a principle', [
      {label: '具体体现', meaning: '使某种思想、品质或原则在具体的人或事物上表现出来。', pattern: 'embody the principle of fairness'},
      {label: '纳入', meaning: '把某项内容作为一个整体的组成部分。', pattern: 'embody a recommendation in a plan'}
    ], [
      Q('The rules ___ the principle of fairness: every applicant is assessed by the same criteria.', '这些规则体现了公平原则：每名申请者都按照同一标准接受评估。', 'embody', '体现',
        'every applicant 与 same criteria 给出公平原则的具体表现。',
        '公平是抽象原则，相同的评估标准把它具体体现出来，因此用 embody。',
        [['contradict','与……矛盾','相同标准支持公平，并非与公平冲突。'],['conceal','隐藏','后半句明确说明公平如何落实，不是在隐藏原则。'],['postpone','推迟','principle 是原则，不是可以推迟到某日的活动。']]),
      Q('By openly admitting her mistake, the team leader ___ the honesty she expected from everyone else.', '组长公开承认自己的错误，以行动体现了她要求其他成员做到的诚实。', 'embodied', '体现了',
        'openly admitting her mistake 是 honesty 的具体行为表现。',
        '组长用自身行为体现抽象品质，embodied the honesty 表达准确。',
        [['undermined','削弱了','公开认错符合诚实要求，没有削弱诚实。'],['concealed','隐藏了','公开行为展示了诚实，而非把它隐藏。'],['measured','测量了','没有量化他人的诚实程度。']])
    ], 'https://dictionary.cambridge.org/dictionary/english/embody'),
  W('embolden', 'em- + bold + -en：使更大胆、更有勇气。', '使有胆量；使更敢行动',
    '侧重心理上的胆量增加，也可能指错误行为被助长；不一定是褒义。',
    'embolden somebody to do something / be emboldened by…', [
      {label: '胆量增加', meaning: '使某人更有勇气，或更敢于采取行动。', pattern: 'be emboldened to speak up'}
    ], [
      Q('Seeing another student ask a basic question may ___ a shy classmate to speak up.', '看到别的同学提出基础问题，可能会让一名害羞的同学更敢于发言。', 'embolden', '使更有胆量',
        'shy 与 speak up 表示从不敢发言到更敢发言。',
        '他人的行动减轻了畏惧，改变的是发言的胆量，因此用 embolden。',
        [['authorize','授权','学生不缺法律或正式授权，缺少的是胆量。'],['silence','使沉默','后接 speak up 表示开口，方向与沉默相反。'],['embitter','使怨愤','语境没有受到不公对待或产生怨恨。']]),
      Q('The absence of penalties ___ the repeat offenders, who became even less afraid of breaking the rules.', '没有受到处罚使屡次违规者更加有恃无恐，他们更不怕违反规则了。', 'emboldened', '使更加大胆',
        'even less afraid 说明畏惧减少，而对象是违规者。',
        'embolden 只表示胆量增加，未必表示好的结果；此处是违规者被助长了气焰。',
        [['deterred','威慑了','威慑会使其有所顾忌，与 less afraid 相反。'],['reformed','改造了','他们继续违规，没有改过自新。'],['exhausted','使筋疲力尽','句子讨论对处罚的畏惧，不涉及体力消耗。']])
    ], 'https://dictionary.cambridge.org/dictionary/english/embolden'),
  W('embellish', '经法语词源形成；em- 与“使美丽”的词根家族相关。不要把 bell 当作现代英语“铃”。', '装饰；润饰；给叙述添油加醋',
    '接物品时通常是增加装饰；接故事时可能加入夸张或虚构细节，要看上下文。',
    'embellish something with… / embellish a story', [
      {label: '外观', meaning: '添加装饰，使物品更好看。', pattern: 'embellish a jacket with beads'},
      {label: '叙述', meaning: '添加吸引人的细节；在某些语境中含夸张或虚构。', pattern: 'embellish an account of an event'}
    ], [
      Q('The craft club will ___ the plain bags with small embroidered flowers.', '手工社将用小朵刺绣花装饰这些素色袋子。', 'embellish', '装饰',
        'plain bags 与 embroidered flowers 构成增加装饰的关系。',
        'embellish something with something 表示用某物装饰另一物，句中讨论的是袋子的外观。',
        [['enlarge','扩大','刺绣花改变装饰效果，不扩大袋子的尺寸。'],['decode','解码','没有需要破译的信息。'],['empty','清空','给袋子添加装饰不等于取出袋中物品。']]),
      Q('He tended to ___ his travel stories by adding dramatic incidents that had never happened.', '他常给旅行故事添油加醋，加入根本没有发生过的戏剧性事件。', 'embellish', '添油加醋',
        'incidents that had never happened 明确说明加入了虚构细节。',
        '此处 embellish 是润饰叙述并加入虚构内容，不能只机械地译为装饰物品。',
        [['verify','核实','加入未发生的事件与核实事实相反。'],['summarize','概括','概括提炼已有内容，不是增加虚构事件。'],['retract','撤回','撤回说法与继续添加细节不同。']])
    ], 'https://www.merriam-webster.com/dictionary/embellish'),
  W('embed', 'em- + bed 家族：牢固置于某物之内；由实体嵌入引申到内容嵌入。', '嵌入；使成为组成部分',
    '强调置入并成为所在环境的一部分。过去式、过去分词 embedded，进行时 embedding，双写 d。',
    'embed something in something / be embedded in…', [
      {label: '实体', meaning: '把物体牢固放入周围材料中。', pattern: 'embed a sensor in a surface'},
      {label: '内容', meaning: '把媒体或其他内容嵌入文档、网页等，使之成为其中一部分。', pattern: 'embed a video in a page'}
    ], [
      Q('The engineers will ___ a small sensor in the concrete before it hardens.', '工程师将在混凝土硬化前，把一个小型传感器嵌入其中。', 'embed', '嵌入',
        'in the concrete 与 before it hardens 表示让传感器固定在材料内部。',
        '把物体置入并固定在周围材料中用 embed，常见结构是 embed A in B。',
        [['extract','提取；取出','extract 表示向外取出，方向与放入相反。'],['enlarge','扩大','没有改变传感器尺寸的要求。'],['decode','解码','传感器是要安放的实体，不是要解码的信息。']]),
      Q('The editor lets teachers ___ a video in the lesson page so students can play it without leaving the page.', '这个编辑器允许教师将视频嵌入课程页面，学生不离开页面就能播放。', 'embed', '嵌入',
        'play it without leaving the page 表示视频在页面内部呈现。',
        'embed a video in a page 是把媒体放入网页内显示，不只是提到视频标题或删除文件。',
        [['erase','删除','删除视频后不能在页面内播放。'],['summarize','概述','文字概述不使视频本身在页面内播放。'],['embellish','装饰；润饰','这里是媒体插入功能，不是给视频添加装饰或虚构细节。']])
    ], 'https://www.merriam-webster.com/dictionary/embed'),
  W('embitter', 'em- + bitter：使内心产生苦涩、怨愤。', '使怨愤；使愤愤不平',
    '常指因不公、挫折等产生持续的怨恨，不只是短暂不高兴。常见过去分词 embittered。',
    'embitter somebody / be embittered by…', [
      {label: '怨愤', meaning: '使人因不好的经历而心怀怨恨或愤懑。', pattern: 'be embittered by unfair treatment'}
    ], [
      Q('Repeated unfair treatment can ___ employees, leaving them resentful long after the dispute ends.', '反复遭受不公对待可能让员工心怀怨愤，甚至在争端结束很久后仍难以释怀。', 'embitter', '使怨愤',
        'unfair treatment、resentful 和 long after 表明持续的怨恨。',
        'embitter 侧重经历带来的怨愤；句中不只是员工一时感到惊讶或失望。',
        [['reassure','使安心','持续怨恨与安心的方向相反。'],['embolden','使更有胆量','这里没有变得更敢行动，描述的是怨恨。'],['amuse','逗乐','resentful 表明不满，并非觉得有趣。']]),
      Q('Years of broken promises had ___ him; he now spoke of the organisation with lasting resentment.', '多年来一再落空的承诺使他满怀怨愤，如今他谈起这个组织时仍带着长期积累的怨恨。', 'embittered', '使怨愤',
        'broken promises 与 lasting resentment 给出原因和持久情绪。',
        '空前 had 需要过去分词；embittered 同时满足结构要求和“使心怀怨恨”的语义。',
        [['empowered','赋予权力了','没有授予权限或增强自主能力的内容。'],['delighted','使高兴了','lasting resentment 与高兴相反。'],['reassured','使安心了','反复失信导致怨恨，不是消除担忧。']])
    ], 'https://www.merriam-webster.com/dictionary/embitter')
];

export const affixLessons = [
  {
    id: 'em', title: 'em- · 使成为、置于其中',
    summary: '先记 empower 的“授予权力”、embody 的“具体体现”和 embed 的“嵌入”，再比较 embolden 与 embitter 的情绪变化。',
    warning: 'em- 常是 en- 在 b、m、p 前的变体；并非所有 em 开头的词都能这样拆。emergency、empirical 不归入本课。',
    wordIds: ['empower','embody','embolden','embellish','embed','embitter'],
    distinctions: [
      {words: 'empower / embolden', explanation: 'empower 可给予正式权限或自主能力；embolden 只突出更有胆量。敢做与有权做是两回事。'},
      {words: 'embody / embed', explanation: 'embody an idea：具体体现思想；embed a video：把视频嵌入页面。先看宾语是抽象品质还是被放入的内容。'},
      {words: 'embellish / embitter', explanation: 'embellish 是增加装饰或润饰细节；embitter 是使人心怀怨愤。不要只凭词形接近选答案。'}
    ],
    source: 'https://www.merriam-webster.com/dictionary/en-'
  },
  {
    id: 'en', title: 'en- · 使具有某种状态',
    summary: '先区分“能做、愿意做、规则落实、结果有保证”，再看变化发生在内容、尺寸还是空间边界上。',
    warning: '词缀只提示方向。看到 en- 不能把 enable、encourage、ensure 都译成笼统的“促进”。',
    wordIds: ['enable','encourage','enforce','ensure','enrich','enlarge','enclosure','enrichment'],
    distinctions: [
      {words: 'enable / encourage / ensure', explanation: 'enable 提供条件使能做到；encourage 增强意愿或促进发展；ensure 保障某个结果。'},
      {words: 'enforce / ensure', explanation: 'enforce 常接 law、rule、ban，落实规定；ensure 可接 accuracy、safety 或 that 从句，保障结果。'},
      {words: 'enrich / enlarge', explanation: 'enrich 增加有价值的内容或成分；enlarge 增大尺寸或规模。图放大用 enlarge，内容更充实用 enrich。'}
    ],
    source: 'https://www.merriam-webster.com/dictionary/en-'
  },
  {
    id: 'im', title: 'im- · 本轮学习否定家族',
    summary: '先还原 possible、patient、partial 等基础词，再核对派生词的词性。重点看 impatient 的两种语气。',
    warning: '本课收录否定 im- 家族。improve 不能按“不改善”理解；partial 在 impartial 中指“偏袒的”，不是“部分的”。',
    wordIds: ['impossible','impatient','impartial','imbalance','imperfect','immature','immobile','impartially'],
    distinctions: [
      {words: 'impatient with / impatient to', explanation: 'impatient with somebody 常表示对人不耐烦；impatient to do something 可表示急切想做。'},
      {words: 'impartial / impartially', explanation: 'impartial 是形容词，说明人或评判公正；impartially 是副词，修饰 assess、judge 等动作。'},
      {words: 'imperfect / impossible', explanation: 'imperfect 表示不完善，仍可能有用；impossible 表示不可能完成或发生，程度不同。'}
    ],
    source: 'https://dictionary.cambridge.org/dictionary/learner-english/im'
  },
  {
    id: 're', title: 're- · 再次、重新、返回',
    summary: '判断重复的是阅读、写作、考虑还是使用；遇到 repay，注意方向是把钱“还回去”。',
    warning: '重新考虑不等于一定改主意；重复使用不等于回收加工。词缀不能替代句中的动作和对象。',
    wordIds: ['renew','rebuild','reconsider','reuse','rewrite','reread','repayment','reusable'],
    distinctions: [
      {words: 'reread / rewrite', explanation: 'reread 再次读已有文本；rewrite 重新写或改写文本。看是否产生了新版本。'},
      {words: 'reuse / reusable', explanation: 'reuse 在本词库中是动词“再次使用”；reusable 是形容词“可重复使用的”。'},
      {words: 'renew / reconsider', explanation: 'renew a contract 通常是续约；reconsider a decision 是重新评估决定，可能维持原决定。'}
    ],
    source: 'https://dictionary.cambridge.org/dictionary/english/re'
  },
  {
    id: 'de', title: 'de- · 去除、逆转、降低',
    summary: '找清楚被去除或逆转的对象：编码、激活状态、冰霜、中心控制；devalue 则是使价值降低。',
    warning: 'deactivate 是停用，不必删除；defrost 是除霜或解冻，不表示已经烹熟。',
    wordIds: ['decode','deactivate','devalue','deforestation','decompose','defrost','decentralize','devaluation'],
    distinctions: [
      {words: 'decode / deactivate', explanation: 'decode 还原信息的含义；deactivate 关闭功能或让权限失效。'},
      {words: 'devalue / devaluation', explanation: 'devalue 是动作；devaluation 是过程或结果的名词。都可用于货币，也可用于价值被轻视。'},
      {words: 'deforestation / decompose', explanation: 'deforestation 是森林被清除；decompose 是物质分解或有机物腐烂。两者的作用对象和过程不同。'}
    ],
    source: 'https://dictionary.cambridge.org/dictionary/english/de'
  }
];

// Optional focused sense cards for words already present in data.js.
export const senseNotes = {
  enable: [
    {label: '条件与能力', meaning: '提供条件，使人能够完成某事；也可使某事成为可能。', pattern: 'enable somebody to do something'}
  ],
  encourage: [
    {label: '人', meaning: '给予支持，增强行动意愿或信心。', pattern: 'encourage somebody to speak'},
    {label: '行为或发展', meaning: '促使某种行为或趋势发生、发展。', pattern: 'encourage curiosity / encourage investment'}
  ],
  ensure: [
    {label: '结果', meaning: '采取措施，让希望的结果得到保障。', pattern: 'ensure accuracy / ensure that a copy is saved'}
  ],
  enforce: [
    {label: '规则', meaning: '使法律、规则或禁令得到遵守和落实。', pattern: 'enforce a law / enforce a ban'}
  ],
  enrich: [
    {label: '内容', meaning: '增加有价值的内容或体验，使其更充实。', pattern: 'enrich a report / enrich experience'},
    {label: '成分', meaning: '加入所需物质，提高品质。', pattern: 'enrich soil with nutrients'}
  ],
  enclosure: [
    {label: '空间', meaning: '被围栏、墙等围起来的区域。', pattern: 'a fenced enclosure'},
    {label: '信函', meaning: '随信附寄的文件或物品。', pattern: 'an enclosure with a letter'}
  ],
  impatient: [
    {label: '不耐烦', meaning: '等待或应对人、事时缺少耐心。', pattern: 'be impatient with somebody'},
    {label: '急切', meaning: '非常想尽快做某事。', pattern: 'be impatient to begin'}
  ],
  impartial: [
    {label: '公正', meaning: '判断或处理事情时不偏袒任何一方。', pattern: 'an impartial judge / impartial advice'}
  ],
  renew: [
    {label: '有效期', meaning: '使合同、证件等在原期限之后继续有效。', pattern: 'renew a licence / renew a contract'},
    {label: '再次开始', meaning: '停止之后重新开始某种行动或关系。', pattern: 'renew efforts / renew contact'}
  ],
  reconsider: [
    {label: '再次评估', meaning: '重新思考先前的决定或看法；结果未必改变。', pattern: 'reconsider a decision'}
  ],
  deactivate: [
    {label: '停止功能', meaning: '使设备、账号或权限不再处于启用状态；数据不必被删除。', pattern: 'deactivate an account / deactivate an alarm'}
  ],
  devalue: [
    {label: '货币', meaning: '使货币相对外币的价值降低。', pattern: 'devalue a currency'},
    {label: '评价', meaning: '降低某件事或某种贡献被认可的价值。', pattern: 'devalue an achievement / devalue a contribution'}
  ]
};
