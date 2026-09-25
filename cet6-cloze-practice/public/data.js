// Original demonstration corpus. Meanings checked against linked dictionary entries.
// Sentences, Chinese paraphrases, and feedback are authored for this trainer.
// This is not an official CET-6 past-paper corpus or a word-frequency ranking.
const Q = (sentence, translation, answer, meaning, clue, explanation, distractors) => ({
  sentence, translation, answer, clue, explanation,
  options: [{text: answer, meaning, reason: explanation}, ...distractors.map(([text, meaning, reason]) => ({text, meaning, reason}))]
});
const W = (word, pos, affix, affixNote, meaning, nuance, collocation, questions) => ({
  id: word, word, pos, affix, affixNote, meaning, nuance, collocation,
  example: questions[0].sentence.replace('___', questions[0].answer),
  translation: questions[0].translation,
  source: 'https://dictionary.cambridge.org/dictionary/english/' + word,
  questions: questions.map((q, i) => ({id: word + '-' + (i + 1), ...q}))
});

export const corpusInfo = {
  title: '语境辨义 · 原创示例词库',
  description: '32 个示例词，64 道原创单句选词题。用于练习语境辨义，不是历年真题，也不表示六级词频或完整考纲。',
  checkedAt: '2026-09-25',
  method: '释义参照 Cambridge Dictionary；例句、题目、译文与辨析独立编写。词缀作为记忆线索，具体词义以语境和搭配为准。',
  prefixSources: [
    {label: 'en-：使成为、置于', url: 'https://dictionary.cambridge.org/dictionary/english/en'},
    {label: 'im-：本示例组选用否定前缀', url: 'https://dictionary.cambridge.org/dictionary/learner-english/im'},
    {label: 're-：重新；部分词表示返回', url: 'https://dictionary.cambridge.org/dictionary/english/re'},
    {label: 'de-：去除、逆转、降低', url: 'https://dictionary.cambridge.org/dictionary/english/de'},
    {label: '词缀用法参考', url: 'https://dictionary.cambridge.org/grammar/british-grammar/prefixes'}
  ],
  affixCaution: '词缀筛选按构词家族标注，不等同于按开头字母匹配。本 im- 组选用否定意义及其派生词；不要把所有 im 开头的单词都理解为“不”，例如 improve。'
};

export const words = [
  W('enable', 'v.', 'en', 'en- + able：使具备能力或条件。', '使能够；使成为可能', '重点是提供完成某事所需的条件，不直接表示劝说或强制。', 'enable somebody to do something', [
    Q('The ramp will ___ wheelchair users to enter the library without assistance.', '这条坡道将使轮椅使用者能够独立进入图书馆。', 'enable', '使能够', 'ramp 提供进入建筑的实际条件；后接人 + to do。', '坡道解决的是通行能力，enable 与 wheelchair users to enter 构成常见搭配。', [['persuade','说服','坡道提供物理通道，不承担劝说功能。'],['require','要求','句子说明获得通行条件，没有强制要求。'],['remind','提醒','坡道并非提醒用户进入图书馆的信息。']]),
    Q('The grant ___ the team to buy a sensor it could not previously afford.', '这笔资助使团队买到了之前买不起的传感器。', 'enabled', '使能够', 'could not previously afford 点明此前缺少资金条件。', '资助补足资金，使购买成为可能，因此用 enabled。', [['warned','警告','没有危险或告诫内容。'],['forced','迫使','资金支持不等于强迫购买。'],['invited','邀请','grant 指资金，不是发出邀请的人或组织。']])
  ]),
  W('encourage', 'v.', 'en', 'en- + courage 家族：给予勇气，引申为鼓励或促进。', '鼓励；促进', '强调增强意愿或信心，不保证行动一定发生。', 'encourage somebody to do something', [
    Q('To build her confidence, her tutor would ___ her to share even unfinished ideas.', '为了增强她的信心，导师会鼓励她分享尚未成熟的想法。', 'encourage', '鼓励', 'build her confidence 指向支持与鼓励。', '目标是增强表达意愿和信心，encourage 最贴切。', [['compel','强迫','compel 强调强制，与建立表达信心的支持性语境不符。'],['forbid','禁止','forbid 与允许分享的方向相反。'],['train','训练','没有系统技能训练，重点是给予表达的勇气。']]),
    Q('The teacher praised thoughtful questions because she wanted to ___ curiosity.', '老师表扬有思考的问题，因为她想激发并促进好奇心。', 'encourage', '促进；激发', 'praised questions 与 curiosity 形成正向支持关系。', 'encourage 也可接事物，表示促使某种行为或品质发展。', [['suppress','压制','压制好奇心与表扬提问相矛盾。'],['measure','测量','句子没有测试或量化好奇心的行为。'],['conceal','掩盖','表扬旨在让好奇心发展，不是隐藏它。']])
  ]),
  W('enforce', 'v.', 'en', 'en- 与 force 构词家族；现代常用义是使规则得到执行。', '执行；强制实施', '常以法律、规定、禁令为宾语，重点是使人遵守。', 'enforce a rule / a ban', [
    Q('Inspectors will ___ the safety rules by issuing penalties for violations.', '检查员将通过处罚违规行为来执行安全规定。', 'enforce', '强制执行', 'penalties for violations 表示对违规者采取执行措施。', '规则已经存在，检查员通过处罚落实规则，用 enforce。', [['revise','修订','修订涉及改变条文，处罚违规属于执行。'],['propose','提出','规则已经存在，不是在提出新规则。'],['withdraw','撤回','处罚违规说明规则仍在执行，没有撤回。']]),
    Q('Everyone knew about the ban, but nobody ___ it by stopping vehicles, so cars still entered the park.', '人人都知道这项禁令，但无人通过拦停车辆来执行，因此汽车仍然进入公园。', 'enforced', '执行了', 'by stopping vehicles 指使禁令得到落实的行动。', '禁令已为人知，缺少的是拦停车辆的执行措施，因此填 enforced。', [['announced','宣布了','前文已说人人知情；拦停车辆属于执行，不是宣布内容。'],['translated','翻译了','拦停车辆不是把禁令翻译成其他语言。'],['repealed','废除了','拦停车辆是在执行禁令，不是在废除。']])
  ]),
  W('ensure', 'v.', 'en', 'en- + sure 家族：使确定；记住现代搭配 ensure that。', '确保；保证', '强调结果得到保障。常接事情或 that 从句；assure 更常以人为宾语。', 'ensure that… / ensure accuracy', [
    Q('The automatic backup is designed to ___ that a copy survives if the laptop fails.', '自动备份旨在确保笔记本电脑故障时仍保留一份副本。', 'ensure', '确保', 'that 引出需要保障的结果。', '备份要保障副本存在，用 ensure that；结果是句子的重点。', [['assure','使某人放心','assure 通常需要人的宾语，如 assure users that，不能直接照搬此结构。'],['convince','使信服','convince 通常接人，且表示改变认识，不是保障副本。'],['predict','预测','备份执行保护措施，不是预测未来故障。']]),
    Q('The checklist helps ___ accuracy by requiring each result to be verified twice.', '这份清单要求每个结果都核实两次，从而帮助确保准确性。', 'ensure', '确保', 'by requiring each result to be verified twice 是保障措施。', '此处强调通过复核保障准确性，ensure accuracy 是合适搭配。', [['estimate','估计','估计准确性不等于通过检查保障它。'],['advertise','宣传','清单要求的是复核，并非对外宣传。'],['question','质疑','独立复核在此用于保障结果，句子并非表达对准确性的怀疑。']])
  ]),
  W('enrich', 'v.', 'en', 'en- + rich：使更丰富或更富有。', '丰富；充实；使富足', '常指通过添加有价值的内容提高质量，不仅是数量或尺寸变大。', 'enrich knowledge / enrich the soil', [
    Q('Interviews with residents can ___ the report by adding perspectives absent from the statistics.', '居民访谈可以补充统计数据中缺失的视角，使报告更充实。', 'enrich', '充实；丰富', 'adding perspectives 表示补充有价值的内容。', '新增视角提高内容质量，enrich 比单纯变长更准确。', [['shorten','缩短','增加视角不是缩短报告。'],['erase','抹去','补充内容与抹去报告相反。'],['authorize','授权','居民视角提升内容，不赋予报告法律许可。']]),
    Q('The compost is added to ___ the soil with nutrients, not to increase the size of the field.', '加入堆肥是为了增加土壤养分，而不是扩大田地面积。', 'enrich', '使肥沃；充实', 'with nutrients 指补充养分。', 'enrich the soil 表示提高土壤的养分含量与肥力。', [['enlarge','扩大','enlarge 指尺寸或规模扩大，句中排除了面积变化。'],['drain','排干','句子说补充养分，没有排水行为。'],['devalue','贬低','补充养分提高肥力，与降低价值不符。']])
  ]),
  W('enlarge', 'v.', 'en', 'en- + large：使变大。', '扩大；放大', '核心是尺寸或规模增大；不是增加内容深度。', 'enlarge an image / enlarge a room', [
    Q('Please ___ the diagram to twice its current width so the labels are easier to read.', '请把示意图放大到目前宽度的两倍，让标注更容易看清。', 'enlarge', '放大', 'twice its current width 明确指定尺寸变化。', '宽度变为两倍属于放大图像，用 enlarge。', [['enrich','丰富','enrich 强调内容或质量，不直接表示宽度变大。'],['rotate','旋转','旋转只改变方向，不实现指定的宽度放大。'],['compress','压缩','压缩通常缩小体积或数据量，与放大要求不同。']]),
    Q('The workshop was ___ by removing a wall and incorporating the room next door.', '拆除一面墙并并入隔壁房间后，工作室的面积扩大了。', 'enlarged', '扩大了', 'incorporating the room next door 增加空间。', '合并房间使工作室变大，因此用 enlarged。', [['enriched','丰富了','enriched 不直接表达建筑面积扩大。'],['evacuated','疏散了','移走人员是疏散，合并房间是扩建。'],['concealed','隐藏了','没有遮掩工作室的含义。']])
  ]),
  W('enclosure', 'n.', 'en', 'enclose 的名词家族；en- 有置于或围入之义。', '围起来的区域；信函附件', '既可指被围栏圈起的空间，也可指随纸质信件附寄的材料。', 'a fenced enclosure / an enclosure with a letter', [
    Q('The injured deer rested inside a fenced ___ while the rest of the park remained open.', '受伤的鹿在一处围栏圈起的区域内休息，公园其余部分仍然开放。', 'enclosure', '围起的区域', 'inside a fenced… 描写有边界的实体空间。', 'enclosure 在这里是围栏围起的区域，可用于安置动物。', [['expansion','扩张','expansion 是变化过程，不是鹿可以待在里面的围栏区域。'],['permission','许可','permission 是抽象的允许，不是空间。'],['delivery','递送','delivery 指递送行为，不能指围栏区域。']]),
    Q('The letter mentioned one ___: a printed map placed in the same envelope.', '信中提到一份附件：同一个信封里附寄的一张纸质地图。', 'enclosure', '信函附件', 'a printed map in the same envelope 是纸质信函的附寄物。', 'enclosure 在信函语境中指附寄文件或物品。', [['boundary','边界','地图是附寄材料，不是信封或区域的边界。'],['edition','版本','这里说明一份附寄材料，没有比较版本。'],['objection','异议','地图没有表达反对意见。']])
  ]),
  W('enrichment', 'n.', 'en', 'enrich + -ment：丰富、充实的过程或结果。', '丰富；充实；提升', '强调增加有价值的体验、内容或成分；注意 -ment 构成名词。', 'cultural enrichment / enrichment activities', [
    Q('The museum calls its free art workshops a form of cultural ___ for local children.', '博物馆将其免费艺术工作坊视为丰富当地儿童文化生活的一种方式。', 'enrichment', '丰富；充实', 'free art workshops 带来文化体验与学习。', '文化体验使生活和知识更丰富，cultural enrichment 搭配自然。', [['erosion','侵蚀','工作坊增加文化体验，不是使文化流失。'],['confinement','禁闭','文化学习不是限制人身活动。'],['repayment','偿还','免费工作坊在此不是偿还借款。']]),
    Q('The afternoon programme offers educational ___ through experiments beyond the regular syllabus.', '下午的课程通过常规教学大纲之外的实验来拓展学习体验。', 'enrichment', '拓展；充实', 'beyond the regular syllabus 指额外的有益学习内容。', '增加有益的学习体验可称 educational enrichment。', [['exclusion','排除','课程增加体验，而非排除学习者或内容。'],['deforestation','森林砍伐','语境属于教育，与砍伐森林无关。'],['devaluation','贬值','增加学习价值的方向与 devaluation 相反。']])
  ]),
  W('impossible', 'adj.', 'im', '否定 im- + possible：不可能的。', '不可能的；极难应付的', '基本义表示不能发生或完成，强于仅仅 difficult；也可形容难相处的人。', 'impossible to do / physically impossible', [
    Q('With no bridge, boat, or other crossing available, reaching the island by car was ___.', '在没有桥梁、船只或其他渡海方式的情况下，开车到岛上是不可能的。', 'impossible', '不可能的', 'no…or other crossing available 排除了通行方式。', '所有通行条件都被排除，因此是 impossible。', [['inevitable','不可避免的','没有通道意味着无法到达，不是必然到达。'],['optional','可选的','optional 表示有选择权，不表示缺少通行条件。'],['impartial','公正的','公正评价人或判断，不评价能否开车到岛上。']]),
    Q('The designer described the client as ___: he rejected every version yet refused to explain what he wanted.', '设计师说这位客户极难应付：他否定每个版本，却拒绝说明需求。', 'impossible', '极难应付的', '描述对象是人；冒号后解释其难以合作的行为。', 'impossible 可形容极难相处或应付的人，不必译为“不存在”。', [['cooperative','合作的','否定所有版本且不说明需求，与合作态度相反。'],['impartial','公正的','这里突出难以配合，没有比较对各方是否公平。'],['indecipherable','无法辨读的','通常形容字迹或信息难以解读，此处评价客户的行为。']])
  ]),
  W('impatient', 'adj.', 'im', '否定 im- + patient：缺乏耐心；也可引申为急切。', '不耐烦的；急切的', 'impatient with 常指不耐烦；impatient to do 可表示迫不及待。', 'impatient with somebody / impatient to begin', [
    Q('After checking the queue for the tenth time, he became ___ with the delay.', '第十次查看排队情况后，他开始对延误感到不耐烦。', 'impatient', '不耐烦的', '反复查看队列，且对象是 delay。', '等待导致的烦躁对应 impatient with the delay。', [['impartial','公正的','是否公正与等待中的烦躁无关。'],['grateful','感激的','反复查看及延误语境不支持感激。'],['indifferent','漠不关心的','持续关注排队进度说明并非不关心。']]),
    Q('She was ___ to try the new telescope and arrived an hour before the observing session.', '她迫不及待地想试用新望远镜，比观测活动提前一小时到场。', 'impatient', '急切的；迫不及待的', 'to try 与提前到场说明期待尽快开始。', 'impatient to do 在此表示急切期待，不一定含生气。', [['reluctant','不情愿的','提前一小时到场更符合积极期待，不符合不情愿。'],['unable','不能够的','句子没有说明能力或条件不足。'],['impartial','公正的','impartial 不表示想尽快尝试的愿望。']])
  ]),
  W('impartial', 'adj.', 'im', '否定 im- + partial；partial 此处指偏袒，不是“部分的”。', '公正的；不偏不倚的', '强调不偏袒任何一方，不等于冷漠或毫不关心。', 'an impartial judge / impartial advice', [
    Q('A reviewer who is ___ applies the same criteria to work by friends and strangers.', '一位公正的评审会用同样的标准评价朋友和陌生人的作品。', 'impartial', '公正的', 'the same criteria 与 friends and strangers 强调一视同仁。', '是否偏袒是核心，impartial 表示不因关系而偏向某一方。', [['indifferent','漠不关心的','一视同仁说明公平，不说明不关心工作。'],['impatient','不耐烦的','没有等待或烦躁的线索。'],['partial','偏袒的','partial 在此义上与同一标准的公平原则相反。']]),
    Q('The mediator was ___ toward both sides, applying exactly the same standards to each department.', '调解员对双方都不偏不倚，对每个部门使用完全相同的标准。', 'impartial', '不偏不倚的', 'exactly the same standards 指公平对待。', '对双方使用相同标准、无偏袒，因此填 impartial。', [['biased','有偏见的','使用完全相同的标准与偏袒一方的含义相反。'],['indifferent','漠不关心的','一视同仁体现公平，并不说明漠不关心。'],['immature','不成熟的','语境讨论公平性，没有说明成熟程度。']])
  ]),
  W('imbalance', 'n.', 'im', '否定 im- + balance：失去平衡的状态。', '失衡；不均衡', '强调本应协调的两方或多个部分在数量、力量或分配上不平衡。', 'an imbalance between A and B', [
    Q('An ___ in workload emerged: one group had twelve tasks while the other had only two.', '工作量出现了失衡：一组有十二项任务，另一组只有两项。', 'imbalance', '不均衡', 'twelve tasks 与 only two 形成数量差距。', '任务分配差距明显，imbalance 描述这种不均衡状态。', [['agreement','协议','数量对比描述分配状态，不是双方达成的协议。'],['incentive','激励','工作量差异并非文中设定的奖励或动机。'],['improvement','改善','没有前后比较证明情况改善，突出的是失衡。']]),
    Q('Moving some weight to the lighter side corrected the ___ in the loading.', '把一部分重量移到较轻的一侧，纠正了装载的不平衡。', 'imbalance', '失衡', 'lighter side 与 moving weight 指重新平衡两侧。', '重新分配重量解决的是装载失衡。', [['enclosure','围起的区域','搬移重量不能纠正一个实体区域。'],['sequence','顺序','强调两侧重量，不是装载先后次序。'],['permission','许可','操作调整不属于批准或授权问题。']])
  ]),
  W('imperfect', 'adj.', 'im', '否定 im- + perfect：不完美的、有缺陷的。', '有缺陷的；不完善的', '仍可有用或有效，不等于完全错误、无法使用。', 'imperfect information / an imperfect solution', [
    Q('The model is ___: it predicts the overall trend well but misses small fluctuations.', '这个模型并不完美：它能很好地预测总体趋势，却捕捉不到小幅波动。', 'imperfect', '不完善的', 'well but misses 表示部分有效、仍有局限。', '有价值但存在不足，imperfect 正好描述这种有限准确性。', [['flawless','无瑕疵的','misses small fluctuations 已给出缺陷。'],['impossible','不可能的','模型已经能预测总体趋势，不能说它不可能实现。'],['irrelevant','无关的','模型直接预测目标趋势，并非无关。']]),
    Q('Several surface scratches made the vase ___, so it was sold at a lower price.', '几道表面划痕使花瓶有了瑕疵，因此它以较低价格出售。', 'imperfect', '有瑕疵的', 'surface scratches 是明确的外观缺陷。', '划痕造成不完美，但花瓶仍可出售，用 imperfect。', [['immobile','不能移动的','划痕并不意味着花瓶不能移动。'],['impartial','公正的','公正形容判断或态度，不是花瓶外观。'],['immature','未成熟的','划痕是瑕疵，与生长成熟程度无关。']])
  ]),
  W('immature', 'adj.', 'im', '否定 im- + mature：尚未成熟。', '不成熟的；尚未发育完全的', '既可说行为不成熟，也可客观描述生物尚未发育完全。', 'immature behaviour / immature plants', [
    Q('His response to criticism was ___: he blamed a teammate for every small mistake.', '一受批评就把每个小错误都归咎于队友，是一种不成熟的反应。', 'immature', '不成熟的', 'blaming a teammate for every small mistake 指缺乏负责态度。', '处理批评的方式缺乏成熟度，因此用 immature。', [['impartial','公正的','把错误都推给同伴并不是公平评价。'],['constructive','建设性的','没有提出改进方法，只是归咎他人。'],['measured','审慎克制的','一味归咎他人不符合审慎克制。']]),
    Q('The biologist marked the birds as ___ because their adult feathers had not yet developed.', '生物学家将这些鸟标记为未成熟，因为它们的成年羽毛尚未长成。', 'immature', '尚未成熟的', 'adult feathers had not yet developed 指发育阶段。', '生物学语境中 immature 表示尚未发育完全，并非批评行为。', [['extinct','灭绝的','研究者正在观察这些鸟，不能说它们已灭绝。'],['artificial','人造的','没有人工制造鸟类的线索。'],['impartial','公正的','公正不描述羽毛发育阶段。']])
  ]),
  W('immobile', 'adj.', 'im', '否定 im- + mobile：不移动或无法移动。', '静止的；无法移动的', '描述位置不变或运动受限；不表示不成熟。', 'remain immobile / an immobile vehicle', [
    Q('With all four wheels locked, the trolley remained ___ even when pushed.', '四个轮子全部锁住后，即使被推，手推车也仍然无法移动。', 'immobile', '无法移动的', 'wheels locked 与 even when pushed 指运动被阻止。', '轮子锁死导致车不能移动，immobile 对应这一状态。', [['immature','不成熟的','手推车的运动状态与成熟度无关。'],['impartial','公正的','公正是态度或判断，不是车的状态。'],['flexible','灵活的','轮子锁住强调不能运动，不是灵活性。']]),
    Q('During the long exposure, the camera had to stay completely ___ to avoid a blurred image.', '长曝光过程中，相机必须保持完全静止，以免图像模糊。', 'immobile', '静止的', 'avoid a blurred image 要求拍摄时保持位置稳定。', '这里 immobile 表示没有移动，不必理解为永久丧失运动能力。', [['portable','便携的','便携描述方便携带，不表示曝光时保持静止。'],['visible','可见的','相机是否可见与长曝光防抖无关。'],['impatient','不耐烦的','相机没有等待中的心理情绪。']])
  ]),
  W('impartially', 'adv.', 'im', 'impartial + -ly；否定 im- 由形容词家族保留。', '公正地；不偏不倚地', '修饰评判、处理等动作；不要与表示漠不关心的 indifferently 混淆。', 'judge impartially / assess impartially', [
    Q('The judge scored each performance ___, without giving extra points to her own students.', '评委公正地为每场表演评分，没有给自己的学生额外加分。', 'impartially', '公正地', 'without giving extra points 排除偏袒。', '副词修饰 scored，强调评分无偏见，因此填 impartially。', [['partially','部分地；偏袒地','无论“部分”还是“偏袒”，都不能表达此处公平评分。'],['impatiently','不耐烦地','没有等待或烦躁的线索。'],['randomly','随机地','公平按标准评判不等于随机打分。']]),
    Q('To handle the dispute ___, the coordinator heard both accounts before making a decision.', '为公正处理争议，协调员在作决定前听取了双方的陈述。', 'impartially', '不偏不倚地', 'heard both accounts 说明兼顾双方。', '听取双方陈述体现处理过程的公平性，用 impartially。', [['secretly','秘密地','句子没有隐瞒处理过程的含义。'],['carelessly','粗心地','先听取双方意见体现认真处理，非粗心。'],['selectively','选择性地','这里强调兼顾双方，而不是只挑选部分立场。']])
  ]),
  W('renew', 'v.', 're', 're- + new 家族：使重新有效；可表示续期或重新开始。', '续期；重新开始；更新', '续合同或证件时强调延长有效期；不一定修改具体条款。', 'renew a licence / renew a contract', [
    Q('Her library card expires tomorrow, so she needs to ___ it for another year.', '她的借书证明天到期，因此需要续期一年。', 'renew', '续期', 'expires 与 for another year 指延长有效期。', '证件即将到期，需要继续有效，用 renew。', [['rewrite','重写','重写文字不能直接表示证件续期。'],['return','归还','归还卡片不表示延长一年有效期。'],['reject','拒绝','拒绝卡片与继续使用的目的相反。']]),
    Q('After a month of silence, the two teams ___ their negotiations and met again.', '沉寂一个月后，两个团队重新开始谈判，并再次会面。', 'renewed', '重新开始了', 'after a month of silence 与 met again 表示中断后恢复。', 'renew negotiations 可指恢复一度中断的谈判。', [['abandoned','放弃了','met again 表示重启接触，与放弃谈判不同。'],['concealed','隐瞒了','没有隐藏谈判的线索。'],['prevented','阻止了','双方再次会面支持恢复谈判，不是阻止。']])
  ]),
  W('rebuild', 'v.', 're', 're- + build：再次建造，也可重建系统或信任。', '重建；重新建立', '可指受损建筑的重建，也可用于信任、生活等抽象对象。', 'rebuild a bridge / rebuild trust', [
    Q('After the flood swept the bridge away, engineers had to ___ it before the road could reopen.', '洪水冲走桥梁后，工程师必须重建桥梁，道路才能重新开放。', 'rebuild', '重建', 'swept the bridge away 指原有桥梁已经毁坏。', '恢复被冲毁的桥需要重新建造，因此是 rebuild。', [['reconsider','重新考虑','重新考虑桥梁不等于恢复道路所需的实际施工。'],['decode','解码','桥梁不是待解码的信息。'],['devalue','降低价值','降低桥梁价值无法恢复道路通行。']]),
    Q('The organisation had lost public trust and spent years trying to ___ it through transparent reporting.', '这个组织失去了公众信任，随后花了数年通过透明报告努力重建信任。', 'rebuild', '重新建立', 'lost public trust 与 transparent reporting 指恢复信任。', 'rebuild 可接 trust，表示在信任受损后重新建立。', [['erase','消除','目标是恢复公众信任，不是进一步消除信任。'],['borrow','借用','信任在这里不是从他人暂借的物品。'],['postpone','推迟','postpone 不与 trust 表示恢复信任的行动。']])
  ]),
  W('reconsider', 'v.', 're', 're- + consider：再次考虑既有决定或看法。', '重新考虑', '重新评估是否需要改变，并不意味着最后一定改主意。', 'reconsider a decision / reconsider a proposal', [
    Q('The new evidence made the committee ___ its earlier decision before choosing whether to change it.', '新证据促使委员会在决定是否改变原决定之前，重新考虑了它。', 'reconsider', '重新考虑', 'earlier decision 与 whether to change 强调重新评估。', '重新思考原有决定、尚未确定改动，正是 reconsider。', [['announce','宣布','宣布只说明向外公布，不含重新评估。'],['enforce','执行','执行既定决定与重新判断是否改变不同。'],['conceal','隐藏','句子讨论评估而非隐藏决定。']]),
    Q('She agreed to ___ the offer, but said that reviewing it again did not amount to accepting it.', '她同意重新考虑这项提议，但表示再次审视不等于接受。', 'reconsider', '重新考虑', 'reviewing it again 明确重复思考；不等于接受。', 'reconsider 只说明再考虑，结果仍可能是拒绝。', [['accept','接受','后半句明确说并不等于接受。'],['implement','实施','提议尚在评估，未进入实施。'],['withdraw','撤回','再次审视不等于把提议撤回。']])
  ]),
  W('reuse', 'v.', 're', 're- + use：再次使用。动词末尾发 /z/。', '重复使用；再次利用', '强调物品再次投入使用；不必经过材料再加工。', 'reuse a container / reuse materials', [
    Q('Wash the glass jar and ___ it to store pencils instead of throwing it away.', '把玻璃罐洗干净，再用它来放铅笔，而不是扔掉。', 'reuse', '再次使用', '同一个罐子清洗后换用途，无需改变材料。', '保留物品本身并再次使用，是 reuse。', [['discard','丢弃','句子明确 instead of throwing it away。'],['melt','熔化','罐子要保留形状放铅笔，并非熔化材料。'],['purchase','购买','罐子已经在手边，无需再次购买。']]),
    Q('The workshop ___ last year\'s name badges by inserting new paper labels into the old holders.', '工作坊把新纸标签放进旧卡套，重复使用了去年的姓名牌。', 'reused', '重复使用了', 'old holders 与 new paper labels 指卡套再次使用。', '既有物品再次服务于同一用途，用 reused。', [['destroyed','销毁了','旧卡套仍在使用，没有销毁。'],['imported','进口了','没有跨境购买或运输的内容。'],['decomposed','分解了','卡套保留完整，未分解成材料。']])
  ]),
  W('rewrite', 'v.', 're', 're- + write：重新写；常伴随内容修改。', '重写；改写', '通常以新的文字表达替换原稿，不是仅再次阅读。', 'rewrite a paragraph / rewrite a draft', [
    Q('The editor asked me to ___ the introduction using simpler sentences and a clearer argument.', '编辑要求我用更简单的句子和更清楚的论证重写引言。', 'rewrite', '改写', 'using simpler sentences 要改变文字表达。', '需要产出经过修改的新版本，因此用 rewrite。', [['reread','重读','重读只是再次阅读，不能完成句子改写。'],['retain','保留','原样保留不满足简化表达的要求。'],['translate','翻译','没有改变语言，只是修改同一语言的表达。']]),
    Q('She ___ the ending so that the two characters reconciled instead of separating.', '她改写了结尾，让两个人物和好，而不是分开。', 'rewrote', '改写了', '结局从 separating 改为 reconciled，内容发生变化。', '故事结尾的文字与情节被修改，rewrite 的过去式是 rewrote。', [['reread','重读了','重读已有结尾不会改变人物结局。'],['memorised','记住了','记忆结尾不表示创作新的结局。'],['quoted','引用了','引用保留原文，不能表达改写结局。']])
  ]),
  W('reread', 'v.', 're', 're- + read：再次阅读。过去式拼写不变，读音变化。', '重读；再看一遍', '注意阅读动作重复；与产生新文本的 rewrite 不同。', 'reread a passage / reread instructions', [
    Q('I had already read the paragraph once, but had to ___ it because I had missed the contrast.', '这段话我已经读过一遍，但由于漏掉了其中的对比，我必须再读一遍。', 'reread', '重读', 'already read once 与 missed the contrast 指再次理解原文。', '为了找到原文中的关系再次阅读，而非改写，用 reread。', [['rewrite','重写','任务是理解现成段落，不是更改作者原文。'],['delete','删除','删除无法帮助找出漏掉的对比。'],['publish','发表','发表不表示再次阅读理解。']]),
    Q('Before pressing Submit, he ___ the instructions to check whether a title was required.', '点击提交之前，他重读了说明，以确认是否必须填写标题。', 'reread', '重读了', 'check whether…required 指回看现有说明。', '再次查看规则是 reread，过去式仍拼写为 reread。', [['rewrote','重写了','他需要遵守说明，没有修改说明的任务。'],['invented','编造了','要求已存在，需要查看而不是编造。'],['erased','擦除了','擦除说明不能帮助核对要求。']])
  ]),
  W('repayment', 'n.', 're', 'repay + -ment；re- 在 repay 中表示付回。', '偿还；还款', '核心是归还先前借入的钱；与初次支付、捐款不同。', 'loan repayment / a monthly repayment', [
    Q('The borrower made the final ___ and no longer owed the bank any money.', '借款人支付了最后一笔还款，不再欠银行任何钱。', 'repayment', '还款', 'borrower、owed the bank 指归还借款。', '借款人归还贷款的款项是 repayment。', [['donation','捐赠','归还债务并非无偿捐赠。'],['investment','投资','消除欠款说明是还贷，不是投入新资产。'],['salary','工资','借款人向银行付钱，不是领取劳动报酬。']]),
    Q('The agreement allows early ___ of the loan without an extra fee.', '这份协议允许提前偿还贷款，且不收额外费用。', 'repayment', '偿还', 'of the loan 指还清或归还借款。', 'early repayment of the loan 是“提前还贷”的常用表达。', [['enclosure','附件','附件不是偿还贷款的行为。'],['recruitment','招募','贷款不是待招募人员。'],['deforestation','森林砍伐','砍伐森林与归还贷款不是同一概念。']])
  ]),
  W('reusable', 'adj.', 're', 'reuse + -able：能够再次使用；保留 re- 家族关系。', '可重复使用的', '强调能多次使用；不自动意味着可生物降解或由再生材料制成。', 'a reusable bottle / reusable packaging', [
    Q('These cups are ___: wash them after the event and bring them to the next one.', '这些杯子可以重复使用：活动后清洗干净，下次活动再带来。', 'reusable', '可重复使用的', 'wash them 与 next one 描述多次使用。', '清洗后继续使用对应 reusable。', [['disposable','一次性的','下次继续用与一次性使用相反。'],['edible','可食用的','没有食用杯子的含义。'],['invisible','看不见的','可见性不是句子讨论的属性。']]),
    Q('The packaging is ___, even though it cannot be recycled: the same box can make many trips.', '这种包装可重复使用，即使它无法回收加工：同一个箱子可以多次周转。', 'reusable', '可重复使用的', 'same box can make many trips 指物品本体多次周转。', '多次使用与能否回收加工是两个概念，reusable 正确。', [['recyclable','可回收加工的','句子明确说 cannot be recycled。'],['single-use','一次性使用的','many trips 明确否定只使用一次。'],['biodegradable','可生物降解的','周转次数不能说明材料是否会被生物降解。']])
  ]),
  W('decode', 'v.', 'de', 'de- + code：逆转编码，解出含义。', '解码；破译；理解复杂信息', '核心是从编码或难懂的表达中还原意义，不是把信息变成代码。', 'decode a message / decode a signal', [
    Q('The receiver must ___ the coded signal before it can display readable text.', '接收器必须先对编码信号进行解码，才能显示可读文本。', 'decode', '解码', 'coded signal → readable text 是从代码还原信息。', '由编码转回可读内容的过程称 decode。', [['encode','编码','encode 是相反方向：把信息转成代码。'],['erase','擦除','擦除信号后无法显示其文本内容。'],['amplify','放大','放大只改变强度，不还原编码含义。']]),
    Q('Using the symbol key, the students ___ the message and discovered where the box was hidden.', '学生利用符号对照表破译了信息，发现了盒子的藏匿地点。', 'decoded', '破译了', 'symbol key 与 discovered where 表示解出了符号含义。', '符号被还原成有意义的信息，因此用 decoded。', [['encoded','编码了','这里是在读懂已有信息，不是把它重新编码。'],['concealed','隐藏了','结果是发现含义，而不是进一步隐藏信息。'],['deactivated','停用了','停用信息不能表达借助符号表解出含义。']])
  ]),
  W('deactivate', 'v.', 'de', 'de- + activate：使不再处于激活状态。', '停用；使失效', '强调功能停止或权限失效，不必等于永久删除对象。', 'deactivate an account / deactivate an alarm', [
    Q('Please ___ the old access card so it can no longer unlock the laboratory door.', '请停用旧门禁卡，让它不能再打开实验室的门。', 'deactivate', '停用', 'can no longer unlock 指取消有效功能。', '让门禁卡失去开门权限就是 deactivate。', [['renew','续期','续期延长有效时间，与停用方向相反。'],['duplicate','复制','复制卡片不会让旧卡失去权限。'],['validate','验证；使有效','确认或赋予有效性与失效目标相反。']]),
    Q('The account was ___ for a week, but its saved data remained available when it was reactivated.', '这个账号被停用了一周，但重新启用后，其保存的数据仍然可用。', 'deactivated', '停用了', 'reactivated 与 data remained 指状态改变而非数据消失。', 'deactivate 表示停止激活状态，账号可再次激活，数据不必删除。', [['deleted','删除了','这里保留账号并重新激活，语境不支持已经删除账号。'],['expanded','扩大了','没有容量或规模增大的内容。'],['advertised','宣传了','宣传不解释账号的停用和重新启用。']])
  ]),
  W('devalue', 'v.', 'de', 'de- + value：降低价值或评价。', '使贬值；贬低', '可指货币价值下降，也可指轻视贡献、降低其被认可的价值。', 'devalue a currency / devalue an achievement', [
    Q('Calling the volunteers\' careful work "just a hobby" can ___ their contribution.', '把志愿者的认真工作说成“只是爱好”，可能会贬低他们的贡献。', 'devalue', '贬低', 'just a hobby 弱化工作的重要性。', '这里降低的是对贡献价值的认可，用 devalue。', [['celebrate','赞扬','这种说法在弱化贡献，而不是赞扬。'],['repay','回报；偿还','一句轻视性的评价并非回报贡献。'],['quantify','量化','没有使用数字来衡量贡献。']]),
    Q('By formally lowering its exchange rate, the government chose to ___ the currency.', '政府正式调低汇率，选择让本币贬值。', 'devalue', '使贬值', 'formally lowering its exchange rate 指官方下调币值。', '货币相对外币的价值被正式调低，对应 devalue。', [['mint','铸造','铸造是制造货币，调整汇率并不制造货币。'],['appreciate','升值','appreciate 的货币义为升值，与降低相反。'],['counterfeit','伪造','调整汇率不是伪造货币。']])
  ]),
  W('deforestation', 'n.', 'de', 'de- 表去除；deforest 的名词家族。', '森林砍伐；毁林', '表示大面积树木被人为砍除或森林被破坏，不是季节性落叶。', 'prevent deforestation / widespread deforestation', [
    Q('Satellite images showed extensive ___ where forest had been cleared to create farmland.', '卫星图像显示，为开辟农田而清除森林的地区出现了大面积毁林。', 'deforestation', '森林砍伐；毁林', 'forest had been cleared to create farmland 是人为清除森林。', '森林被清除并转成农田，符合 deforestation。', [['reforestation','重新造林','重新造林增加树木，与清除森林相反。'],['irrigation','灌溉','图像描述森林清除，没有说明供水措施。'],['pollination','授粉','授粉不是大面积移除树木。']]),
    Q('The plan aims to stop ___ by protecting remaining woodland from large-scale clearing.', '这项计划通过保护剩余林地、禁止大规模清除，来阻止毁林。', 'deforestation', '毁林', 'protecting woodland from clearing 指阻止森林移除。', '保护林地、防止清除森林，针对的是 deforestation。', [['germination','发芽','保护林地不是阻止种子发芽。'],['enrichment','丰富；充实','计划阻止的是森林损失，不是有益充实。'],['reforestation','重新造林','保护剩余森林不应解释为阻止植树造林。']])
  ]),
  W('decompose', 'v.', 'de', 'de- 与 compose 家族：分开，分解。', '分解；腐烂', '可指有机物腐烂，也可指物质分解为更简单的组成部分。', 'decompose organic matter / decompose into…', [
    Q('In the compost bin, fallen leaves gradually ___ into simpler organic material.', '堆肥箱里的落叶逐渐分解成更简单的有机物质。', 'decompose', '分解；腐烂', 'fallen leaves 与 into simpler material 指自然分解。', '有机物逐渐腐解，用 decompose。', [['assemble','组装','assemble 是把部分组合为整体，与分解方向相反。'],['enlarge','变大','尺寸增大不表示物质组成被分解。'],['freeze','冻结','冻结是状态变化，此处描述腐解。']]),
    Q('The compound will ___ into simpler substances when heated under the specified conditions.', '在指定条件下加热时，这种化合物将分解成更简单的物质。', 'decompose', '分解', 'compound → simpler substances 指化合物发生分解。', '化学语境下 decompose 指分解成更简单的物质。', [['condense','凝结','凝结通常是相态变化，未必形成更简单的物质。'],['accumulate','积累','积累表示数量聚集，不是成分分解。'],['enclose','包围','包围对象不表示化合物分解。']])
  ]),
  W('defrost', 'v.', 'de', 'de- + frost：除霜，也可使冷冻物解冻。', '除霜；解冻', '既可处理设备上的冰霜，也可处理冷冻食物；不等于烹熟。', 'defrost a freezer / defrost frozen food', [
    Q('The freezer walls are covered with thick ice, so we need to ___ the appliance.', '冰箱冷冻室内壁积满厚冰，因此我们需要给设备除霜。', 'defrost', '除霜', 'covered with thick ice 指去除冰层。', '去掉冷冻设备上的霜冰，是 defrost。', [['refill','重新装满','积冰问题不靠再次装满解决。'],['repaint','重新涂漆','涂漆不能表达除去冰霜。'],['encode','编码','设备上的积冰不是信息编码问题。']]),
    Q('The recipe says to ___ the frozen fruit before blending it, so it should no longer be frozen solid.', '食谱要求搅打前先将冷冻水果解冻，使其不再冻得坚硬。', 'defrost', '解冻', 'no longer be frozen solid 直接定义所需状态变化。', '让冷冻物不再冻结，用 defrost；并不要求烹熟。', [['refreeze','重新冷冻','refreeze 让其再次冻结，与目标相反。'],['roast','烘烤','烘烤是烹饪方式，此处只要求解除冻结状态。'],['discard','丢弃','水果还要搅打，不能丢弃。']])
  ]),
  W('decentralize', 'v.', 'de', 'de- + centralize：改变集中于一处的组织方式。', '分散管理；下放权力', '核心是从单一中心分散到多个单位，不只是减少人数。', 'decentralize decision-making / decentralize operations', [
    Q('The organisation plans to ___ decision-making by allowing regional teams to approve their own budgets.', '这个组织计划允许地区团队自行批准预算，从而下放决策权。', 'decentralize', '分散；下放', 'regional teams approve their own budgets 表示权力分散。', '决策由总部移到地区团队，符合 decentralize。', [['centralize','集中','centralize 将决策收归中心，与地区自主相反。'],['conceal','隐藏','地区自主决策不等于隐藏决策。'],['postpone','推迟','没有说明推迟作决定的时间。']]),
    Q('Services were ___ so residents could use several local offices instead of one distant headquarters.', '服务被分散到多个地点，居民可以到当地办事处办理业务，而不必前往远处的唯一总部。', 'decentralized', '分散设置了', 'several local offices 与 one headquarters 对比。', '从单一中心转为多个地方服务点，是 decentralization 的具体体现。', [['centralized','集中设置了','集中与多个地方服务点的变化方向相反。'],['abolished','废除了','服务仍可在地方使用，没有废除。'],['privatized','私有化了','服务地点分散不能证明所有制变成私有。']])
  ]),
  W('devaluation', 'n.', 'de', 'devalue 的名词家族；de- 表示降低。', '贬值；价值被贬低', '在货币语境中常指官方下调币值；也可用于对贡献价值的贬低。', 'currency devaluation / devaluation of work', [
    Q('The official reduction in the currency\'s exchange value was described as a ___.', '这次对货币兑换价值的官方下调被称为贬值。', 'devaluation', '贬值', 'official reduction 与 currency exchange value 明确货币语境。', '官方调低币值可称 devaluation。', [['appreciation','升值','appreciation 在货币语境中指升值，与题目明确的下调方向相反。'],['repayment','偿还','调整汇率不等于偿还债务。'],['donation','捐赠','币值下调不是向他人无偿给付。']]),
    Q('The article criticised the ___ of care work when it is dismissed as requiring no skill.', '文章批评了把照护工作说成毫无技能要求时，对这种工作的价值贬低。', 'devaluation', '贬低', 'dismissed as requiring no skill 指低估工作价值。', '此处不是货币，而是对劳动价值的贬低，devaluation 仍适用。', [['celebration','赞扬；庆祝','认为无需技能是在贬低，而非赞扬。'],['enrichment','丰富；充实','语境描述降低认可，不是提升价值。'],['expansion','扩张','没有说明照护工作的数量或规模增大。']])
  ]),
];
