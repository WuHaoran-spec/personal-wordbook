// Exam identifiers, word banks and answer mappings are factual study metadata.
// No examination passage or third-party explanation is redistributed here.
// Definitions, examples, translations and explanations below are independently written.
const choice = (letter, word, pos, meaning, example, translation, affix = 'other', affixNote = '') => ({ letter, word, pos, meaning, example, translation, affix, affixNote });
const answer = (number, letter, explanation, clue) => ({ number, letter, explanation, clue });

export const exams = [
  {
    id: 'cet6-2025-06-herbicide',
    title: '校园除草剂与环境',
    date: '2025-06', year: 2025, month: 6,
    setLabel: '第 1 套（按新东方标注）',
    topic: '大学生推动校园减少化学除草剂的使用。',
    sourceUrl: 'https://www.guojiya.cn/exam/cet6_2025_06_1/reading-cloze',
    answerSourceUrl: 'https://cet4-6.xdf.cn/202506/14531041.html',
    sourceLabel: '过级鸭原题页 / 新东方参考答案',
    verificationNote: '15 个选项与原题页核对；10 个答案与新东方 2025-06-14 发布的参考答案逐项核对。为机构参考答案，非官方标准答案。释义、例句和本站解析为独立编写。',
    verified: true,
    sources: [
      { label: '原题与选项', url: 'https://www.guojiya.cn/exam/cet6_2025_06_1/reading-cloze' },
      { label: '新东方参考答案', url: 'https://cet4-6.xdf.cn/202506/14531041.html' },
      { label: '欧路交叉核对', url: 'https://dict.eudic.net/Examination/cetexam?mediaid=179cf856-d5a7-11f0-8131-005056866eda' }
    ],
    choices: [
      choice('A', 'aesthetic', 'adj.', '与审美、美感有关的；本题指校园外观是否美观。', 'The change was made for aesthetic reasons.', '做出这项改动是出于美观考虑。'),
      choice('B', 'chronic', 'adj.', '长期存在、反复发生且难以消除的；描述疾病时译作“慢性的”。', 'The town faces a chronic shortage of housing.', '这座城镇长期住房短缺。'),
      choice('C', 'contaminated', 'adj./v-ed', '受到有害物质污染的；是 contaminate 的过去分词。', 'The laboratory disposed of the contaminated water safely.', '实验室安全处理了受污染的水。'),
      choice('D', 'conventionally', 'adv.', '按照惯例或常规方法地。', 'The vegetables were conventionally grown.', '这些蔬菜采用常规方式种植。'),
      choice('E', 'emissions', 'n.', '排放物；排放量，常指气体排放，复数形式。', 'The new buses produce fewer exhaust emissions.', '新公交车的尾气排放更少。', 'other', '来自 emit，不是表示“使……”的 em- + 名词结构。'),
      choice('F', 'environment', 'n.', '环境；这里指人、生物赖以生活的自然环境。', 'Small changes can make the learning environment quieter.', '一些小改动能让学习环境更安静。', 'other', '不要仅凭 en 开头就套用“使……”的词缀释义。'),
      choice('G', 'hampering', 'v-ing', '阻碍、妨碍，使进展或能力受限；hamper 的现在分词。', 'The broken sensor is hampering our experiments.', '损坏的传感器妨碍了我们的实验。'),
      choice('H', 'incidentally', 'adv.', '顺便说一句；另一个常见义项是“偶然地、附带地”。', 'Incidentally, the library stays open late on Fridays.', '顺便说一句，图书馆周五会开到很晚。'),
      choice('I', 'infringement', 'n.', '对法律、规则或权利的违反、侵犯。', 'Using the image without permission may be an infringement of copyright.', '未经许可使用这张图片可能侵犯著作权。'),
      choice('J', 'intrigued', 'adj./v-ed', '感到好奇、被激起兴趣的；常用于 be intrigued by。', 'She was intrigued by the unusual result.', '这个不同寻常的结果激起了她的好奇心。'),
      choice('K', 'juvenile', 'adj.', '青少年的；动物语境中指幼年的；也可表示幼稚的。', 'The study tracked the movement of juvenile fish.', '这项研究追踪了幼鱼的活动。'),
      choice('L', 'outlet', 'n.', '出口；情绪、精力或才能的表达途径。此题用后一义。', 'Painting gives him an outlet for stress.', '绘画给了他一个释放压力的途径。'),
      choice('M', 'rotating', 'v-ing/adj.', '旋转着的；或轮流、轮换的。', 'A rotating platform carries the samples past the camera.', '旋转平台把样本依次送到相机前。'),
      choice('N', 'vibrations', 'n.', '振动；连续快速的往复运动，复数形式。', 'The rubber feet reduce vibrations from the machine.', '橡胶支脚减少了机器产生的振动。'),
      choice('O', 'weeding', 'v-ing/n.', '除杂草；是 weed 的动名词或现在分词。', 'We spent an hour weeding the vegetable patch.', '我们花了一小时给菜地除草。')
    ],
    answers: [
      answer(26, 'J', '系动词后写学生发现这项行动后的感受，应是兴趣被激起，选 intrigued。', '判断人物感受'),
      answer(27, 'B', '焦虑对应持续存在的恐惧；chronic 在此强调时间长，不只用于疾病。', '长期性'),
      answer(28, 'L', '下文找到可以投入的行动，说明她在寻找释放焦虑、付诸行动的途径。', '一词多义：途径'),
      answer(29, 'F', '健康、安全、清洁共同修饰大家所生活的环境，名词选 environment。', '并列形容词'),
      answer(30, 'A', '后文用草坪和花坛解释校园美观，限定了目标的审美属性。', '下文举例'),
      answer(31, 'D', '空格修饰校园被管理的方式，需要副词；这里延续常规化学养护方式。', '副词修饰过去分词'),
      answer(32, 'C', '水道承受污染，需过去分词表示受到的影响；contaminated 不是现在分词。', '被动含义'),
      answer(33, 'E', '石油基成分与气候问题相连，所增加的是排放，选复数名词 emissions。', '环境语境'),
      answer(34, 'G', '土壤生物减少会削弱吸碳和蓄水能力，分词 hampering 表示这种不利结果。', '结果与作用方向'),
      answer(35, 'O', '介词后用动名词；学生替代化学除草剂所做的工作是人工除草。', '介词后的动名词')
    ]
  },
  {
    id: 'cet6-2025-06-representation',
    title: '女性参政与代表性',
    date: '2025-06', year: 2025, month: 6,
    setLabel: '第 2 套（按新东方标注）',
    topic: '讨论女性在民选机构中的代表性及其影响。',
    sourceUrl: 'https://dict.eudic.net/Examination/cetexam?mediaid=223cc8ee-d5a9-11f0-8131-005056866eda',
    answerSourceUrl: 'https://cet4-6.xdf.cn/202506/14530640.html',
    sourceLabel: '欧路原题页 / 新东方参考答案',
    verificationNote: '15 个选项与欧路、过级鸭核对；10 个答案与新东方参考答案一致。部分网站将此文标为第 3 套，请以文章主题及备选词核对。参考答案非官方发布。',
    verified: true,
    sources: [
      { label: '原题与选项', url: 'https://dict.eudic.net/Examination/cetexam?mediaid=223cc8ee-d5a9-11f0-8131-005056866eda' },
      { label: '新东方参考答案', url: 'https://cet4-6.xdf.cn/202506/14530640.html' },
      { label: '选项交叉核对', url: 'https://www.guojiya.cn/exam/cet6_2025_06_2/reading-cloze' }
    ],
    choices: [
      choice('A', 'bolsters', 'v.', '支持、加强，使信心或力量更强；bolster 的第三人称单数。', 'The successful trial bolsters our confidence in the design.', '成功的试验增强了我们对设计的信心。'),
      choice('B', 'consequences', 'n.', '结果、影响、后果；可好可坏，复数形式。', 'Consider the consequences before changing the settings.', '更改设置前先考虑可能产生的影响。'),
      choice('C', 'credentials', 'n.', '能证明资格或能力的资历、资格证明；通常用复数。', 'The committee checked each applicant’s credentials.', '委员会核查了每位申请人的资历。'),
      choice('D', 'dramatically', 'adv.', '显著地、大幅度地；也可表示戏剧性地。', 'The error rate fell dramatically after the update.', '更新后，错误率大幅下降。'),
      choice('E', 'enact', 'v.', '正式制定、通过（法律）；也可指表演出某个情节。', 'The city plans to enact stricter building rules.', '市政府计划制定更严格的建筑规定。', 'en', 'en- + act：使成为行动或法令；法律语境记“制定、通过”。'),
      choice('F', 'equity', 'n.', '公平、公正；金融语境另有股权义，本题取公平义。', 'The scholarship aims to improve equity in education.', '这项奖学金旨在促进教育公平。'),
      choice('G', 'especially', 'adv.', '尤其、特别是；从一组对象中突出一个。', 'This method is useful, especially for beginners.', '这个方法很实用，尤其适合初学者。'),
      choice('H', 'evasively', 'adv.', '闪烁其词地、回避直接回答地。', 'He replied evasively when asked about the missing records.', '被问到缺失的记录时，他回答得闪烁其词。'),
      choice('I', 'formidable', 'adj.', '难以对付或克服的、令人畏惧的；也可形容实力强大。', 'Repairing the old bridge will be a formidable task.', '修复这座老桥将是一项艰巨的任务。'),
      choice('J', 'impetus', 'n.', '推动事情发展的动力、促进因素。', 'The prize gave fresh impetus to her research.', '这个奖项为她的研究带来了新的动力。', 'other', '不是 im- 否定前缀；不能据 im 开头推成相反词义。'),
      choice('K', 'lavish', 'adj./v.', '奢华的、丰厚的；作动词时指大量给予。', 'They held a lavish dinner for their guests.', '他们为客人举办了一场丰盛奢华的晚宴。'),
      choice('L', 'prioritize', 'v.', '优先考虑或处理；按重要程度排序。', 'We need to prioritize the most urgent repairs.', '我们需要优先处理最紧急的维修事项。'),
      choice('M', 'suffices', 'v.', '足够、足以满足需要；suffice 的第三人称单数。', 'One clear example suffices to explain the rule.', '一个清晰的例子就足以解释这条规则。'),
      choice('N', 'sustained', 'adj./v-ed', '持续一段时间而不减弱的；sustain 的过去分词。', 'The project needs sustained support from the team.', '这个项目需要团队持续的支持。'),
      choice('O', 'tenured', 'adj.', '享有终身职位保障的，常形容大学教师。', 'She became a tenured professor after years of research and teaching.', '经过多年科研和教学，她获得了教授职位的终身聘任。')
    ],
    answers: [
      answer(26, 'B', '议员构成会影响政策，形容词后所需的名词是 consequences，表示带来的影响。', '名词与影响关系'),
      answer(27, 'E', '从句说明政府对政策做什么；enact 表示正式制定或通过，与立法语境吻合。', '谓语与宾语'),
      answer(28, 'F', '段落列举女性权益相关议题，薪酬方面所谈的是公平，而非股权。', 'equity 的具体义项'),
      answer(29, 'A', '主语为单数，且后面接某种认知；bolsters 既符合形式，也表示增强这种感受。', '主谓一致与搭配'),
      answer(30, 'I', '名词前需形容词，这里强调代表不足的问题难以解决，选 formidable。', '问题的严重程度'),
      answer(31, 'D', '副词用于加强代表不足的程度；dramatically 在这里不表示戏剧表演。', '程度副词'),
      answer(32, 'C', '比较男女候选人时控制的是相近资历，名词 credentials 指资格与经历。', '比较双方的条件'),
      answer(33, 'G', '前文比较两党人数，接着特别强调其中一党，需用 especially 突出重点。', '突出特定对象'),
      answer(34, 'L', '不定式后接动词原形，表达把招募女性列为优先事项，选 prioritize。', '优先处理某事'),
      answer(35, 'N', '与只做一个选举周期相对，要求的是长期持续推进，选 sustained。', '时间上的对照')
    ]
  },
  {
    id: 'cet6-2024-12-thrift',
    title: '消费观念与节俭',
    date: '2024-12', year: 2024, month: 12,
    setLabel: '第 1 套（按欧路标注）',
    topic: '经济变化背景下，人们对节俭、借贷与消费的不同看法。',
    sourceUrl: 'https://dict.eudic.net/Examination/cetexam?mediaid=427502fa-2a28-11f0-8114-005056866eda',
    answerSourceUrl: 'https://english-exam.lazynote.cn/cet6/sections/2024-12-1/part3-section-a/',
    sourceLabel: '欧路原题页 / 懒笔记参考答案',
    verificationNote: '词表与欧路原题页核对；10 个答案经欧路与懒笔记交叉核对。不同站点可能使用不同套次，按主题核对。答案来自第三方题库，非官方标准答案。',
    verified: true,
    sources: [
      { label: '原题与选项', url: 'https://dict.eudic.net/Examination/cetexam?mediaid=427502fa-2a28-11f0-8114-005056866eda' },
      { label: '参考答案交叉核对', url: 'https://english-exam.lazynote.cn/cet6/sections/2024-12-1/part3-section-a/' }
    ],
    choices: [
      choice('A', 'appeal', 'n./v.', '吸引力；作动词时可表示吸引、呼吁、申诉。本题为名词。', 'The quiet location adds to the house’s appeal.', '安静的地段使这所房子更有吸引力。'),
      choice('B', 'extravagantly', 'adv.', '奢侈地、挥霍地，超出必要程度地花费或使用。', 'He spent extravagantly during the holiday.', '假期里他花钱大手大脚。'),
      choice('C', 'intrinsically', 'adv.', '本质上、内在地；强调事物自身具有的性质。', 'The activity is intrinsically rewarding.', '这项活动本身就能带来满足感。'),
      choice('D', 'irony', 'n.', '反讽；事情与预期或表面情况相反而产生的讽刺意味。', 'The irony is that the time-saving tool took hours to set up.', '讽刺的是，这件节省时间的工具光安装就花了好几个小时。'),
      choice('E', 'layman', 'n.', '某个专业领域的外行、非专业人士。', 'The report explains the result in terms a layman can understand.', '报告用外行也能理解的语言解释了结果。'),
      choice('F', 'literally', 'adv.', '按字面意思地；确实地。口语中也用于夸张强调。', 'The sign should not be interpreted literally.', '不应按字面意思理解这个标志。'),
      choice('G', 'majestic', 'adj.', '雄伟的、庄严的；常描写景观或建筑。', 'A majestic mountain rose behind the village.', '村庄后方耸立着一座雄伟的山。'),
      choice('H', 'malicious', 'adj.', '怀有恶意的，意图伤害他人或事物的。', 'The message contained a malicious link.', '这条消息包含一个恶意链接。'),
      choice('I', 'meadow', 'n.', '草地、草甸，常指长草和野花的开阔地。', 'A narrow path crosses the meadow.', '一条小路穿过草地。'),
      choice('J', 'mingle', 'v.', '混合；与人交往、融入人群，常接 with。', 'The event gave new students a chance to mingle.', '这次活动让新生有机会相互交流。'),
      choice('K', 'predator', 'n.', '捕食者；比喻利用或掠夺弱者的人。', 'The fox is a predator of small mammals.', '狐狸是小型哺乳动物的捕食者。'),
      choice('L', 'rage', 'n./v.', '狂怒；本题语境中指狂热、风潮。作动词可指猛烈持续。', 'There was a sudden rage for the new toy.', '这种新玩具突然掀起了一股热潮。'),
      choice('M', 'scrape', 'v./n.', '刮、擦；在谋生搭配中指勉强维持。', 'They scrape a living from seasonal work.', '他们靠季节性工作勉强维持生计。'),
      choice('N', 'shrewd', 'adj.', '精明的，善于判断并作出有利决定的。', 'She made a shrewd assessment of the risks.', '她对风险作出了精明的判断。'),
      choice('O', 'thrifty', 'adj.', '节俭的，谨慎使用金钱和资源的。', 'A thrifty cook finds uses for leftovers.', '节俭的厨师会设法利用剩余食材。')
    ],
    answers: [
      answer(26, 'O', '段落围绕存钱与消费展开，being 后需形容词；传统节俭观念是这里的讨论对象。', '篇章主题与表语'),
      answer(27, 'B', '空格修饰花钱行为，且与积攒相对，选表示挥霍地的副词。', '副词与对照关系'),
      answer(28, 'A', '作者仍喜欢朴素乡村生活，因此这种生活没有失去的是吸引力。', 'appeal 作名词'),
      answer(29, 'J', '表示有机会与新富群体来往，mingle 与后面的介词构成社交意义。', '交往的搭配'),
      answer(30, 'L', '此处描写借贷消费成为热潮，rage 取狂热义，不能机械套成愤怒。', '熟词生义'),
      answer(31, 'D', '富裕国家却向他人借钱，被作者视为带有讽刺意味的反差。', '前后反差'),
      answer(32, 'E', '作者先承认自己不懂经济，再说至少知道一件事；layman 表示外行。', '让步与自谦'),
      answer(33, 'K', '与后面正直友善的出借人对照，所需名词带负面比喻色彩，选 predator。', '人物角色的对照'),
      answer(34, 'N', '这里形容能通过交易获利的人；shrewd 表示判断和经营上的精明。', '人物特征'),
      answer(35, 'M', '父母经济拮据却坚持教育投入，scrape 与谋生搭配，表示艰难维持生活。', '固定搭配与让步')
    ]
  },
  {
    id: 'cet6-2024-12-charity',
    title: '慈善与道德责任',
    date: '2024-12', year: 2024, month: 12,
    setLabel: '第 3 套（按欧路标注）',
    topic: '贫富差距背景下，慈善捐赠是否属于道德责任。',
    sourceUrl: 'https://dict.eudic.net/Examination/cetexam?mediaid=3e099973-45ce-11f0-8116-005056866eda',
    answerSourceUrl: 'https://english-exam.lazynote.cn/cet6/sections/2024-12-3/part3-section-a/',
    sourceLabel: '欧路原题页 / 懒笔记参考答案',
    verificationNote: '15 个选项及 10 个答案经欧路与懒笔记核对。套次按欧路标注。答案来自第三方题库，非官方标准答案；文章中的统计属于原文背景，不代表现时数据。',
    verified: true,
    sources: [
      { label: '原题与选项', url: 'https://dict.eudic.net/Examination/cetexam?mediaid=3e099973-45ce-11f0-8116-005056866eda' },
      { label: '参考答案交叉核对', url: 'https://english-exam.lazynote.cn/cet6/sections/2024-12-3/part3-section-a/' }
    ],
    choices: [
      choice('A', 'applaud', 'v.', '鼓掌；赞许、称赞某个行为或决定。', 'We applaud her decision to share the research openly.', '我们赞许她公开分享研究成果的决定。'),
      choice('B', 'casualty', 'n.', '事故或战争中的死伤者；也可比喻受损、被牺牲的事物。', 'The injured driver was the only casualty of the crash.', '受伤的司机是这次撞车事故中唯一的伤者。'),
      choice('C', 'exclude', 'v.', '排除在外、不包括；也可指排除某种可能。', 'The price excludes delivery costs.', '这个价格不含配送费。'),
      choice('D', 'extent', 'n.', '程度、范围；回答影响有多大或要求到何种程度。', 'We do not yet know the extent of the damage.', '我们还不知道损坏的程度。'),
      choice('E', 'group', 'n./v.', '一组、群体；作动词指把若干对象归成一类。本题用动词义。', 'Group the words according to their meanings.', '按词义把这些词归类。'),
      choice('F', 'hierarchical', 'adj.', '等级分明的、按层级组织的。', 'The company has a hierarchical management structure.', '这家公司采用分层级的管理结构。'),
      choice('G', 'immediate', 'adj.', '立即的；也指最近的、紧邻的。本题修饰身边的社区。', 'The noise disturbed residents in the immediate area.', '噪声打扰了周边地区的居民。', 'im', 'im- 是否定前缀，与 mediate 的“中间介入”有关；由无间隔引出“直接、紧邻、立即”，不要译成“不重要”。'),
      choice('H', 'incredibly', 'adv.', '难以置信地；常作程度副词，表示极其、非常。', 'The instructions were incredibly clear.', '这份说明非常清楚。'),
      choice('I', 'moderate', 'adj./v.', '中等的、适度的；作动词时指使缓和。本题描述收入水平。', 'The plants need moderate amounts of water.', '这些植物需要适量的水。'),
      choice('J', 'mortality', 'n.', '死亡；死亡率。与 rate 连用时仍译“死亡率”。', 'Researchers examined mortality among older patients.', '研究人员考察了老年患者的死亡率。'),
      choice('K', 'overt', 'adj.', '公开的、明显不加掩饰的；与 covert 相对。', 'There was no overt sign of disagreement.', '没有明显的反对迹象。'),
      choice('L', 'praiseworthy', 'adj.', '值得赞扬的。', 'Their patience during the repairs was praiseworthy.', '他们在维修期间表现出的耐心值得赞扬。'),
      choice('M', 'probe', 'v./n.', '深入调查、探查；作名词可指调查或探测器。', 'The researchers will probe the cause of the failure.', '研究人员将深入调查失败的原因。'),
      choice('N', 'sceptically', 'adv.', '怀疑地、持不轻信态度地；美式也拼作 skeptically。', 'She examined the surprising claim sceptically.', '她以怀疑的态度审视这个惊人的说法。'),
      choice('O', 'unequal', 'adj.', '不相等的、不平等的；也可指不胜任的。', 'The two groups received unequal amounts of funding.', '两组获得的经费数额不等。')
    ],
    answers: [
      answer(26, 'J', '这里需要表示死亡这一统计指标的名词；casualty 指死伤者，不能替代 mortality。', '死亡率与死伤者'),
      answer(27, 'H', '空格加强富裕程度，应选程度副词 incredibly，而非怀疑地。', '副词修饰形容词'),
      answer(28, 'O', '前面穷困与富裕的对照指向财富分配不均，需形容词 unequal。', '上下文对照'),
      answer(29, 'A', '主语后缺谓语，富人捐赠引出公众的赞许反应，选 applaud。', '行为与反应'),
      answer(30, 'I', '本地收入不算特别高，放到全球比较却很高，因此形容的是中等水平。', '比较范围发生变化'),
      answer(31, 'L', '系动词后对慈善作正面道德评价，praiseworthy 表示值得称赞。', '表语与评价'),
      answer(32, 'G', '此处从援助远方转向服务身边社区，immediate 取邻近义而非立即义。', '熟词生义：紧邻'),
      answer(33, 'C', '仅够维持生计的人不承担同样的捐赠要求，需要从要求范围中排除。', '要求的适用范围'),
      answer(34, 'E', '情态动词后需动词原形，作者要把具有共同主张的论点归到一起。', 'group 作动词'),
      answer(35, 'D', '各方争议的是责任应达到多大程度，extent 指范围或程度。', '抽象名词的精确含义')
    ]
  }
];
