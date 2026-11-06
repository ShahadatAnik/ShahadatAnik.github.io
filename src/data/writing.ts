export interface WritingArticle {
  title: string
  url: string
  source: string
}

export interface WritingCollection {
  id: string
  title: string
  articles: WritingArticle[]
}

export const writingCollections: WritingCollection[] = [
  {
    id: "writing-xixiaoyao",
    title: "夕小瑶科技说——Zicy",
    articles: [
      { title: "何恺明重提十年之争——模型表现好是源于能力提升还是捕获数据集偏置？", url: "https://mp.weixin.qq.com/s/zz_s0uhwS6tfni7K7_WERQ", source: "mp.weixin.qq.com" },
      { title: "Sora 究竟有多烧钱？Sora的推理与训练的计算成本被扒出来了", url: "https://mp.weixin.qq.com/s/obxJxZvIra1aiOSy3RkYzA", source: "mp.weixin.qq.com" },
      { title: "比阿里EMO抢先开源！蔡徐坤“复出”唱RAP，腾讯AniPortrait让照片变视频，鬼畜区UP狂喜！看看哪家效果好", url: "https://mp.weixin.qq.com/s/1qvWjAREFGNISGTmR87YbA", source: "mp.weixin.qq.com" },
      { title: "ChatGPT实体化了！手机变身ChatGPT实体机器人，只需一个配件，能说话还会做梦，真的牛！", url: "https://mp.weixin.qq.com/s/WL3pTa49ZuOT9fQwasriAw", source: "mp.weixin.qq.com" },
      { title: "突破！AI机器人拥有嗅觉！仿生嗅觉芯片研究登上Nature子刊", url: "https://mp.weixin.qq.com/s/Qj9nKUN7p_egY1qBrZlHXw", source: "mp.weixin.qq.com" },
      { title: "量子计算获重大突破！微软和Quantinuum将量子计算错误率降低800倍", url: "https://mp.weixin.qq.com/s/yN6hzZzxg-huhwAHY0qjMA", source: "mp.weixin.qq.com" },
      { title: "Scaling Laws 又失灵了？谷歌新研究：扩散模型不是越大越好", url: "https://mp.weixin.qq.com/s/OsYxoK1lq6Z_sUptyaIANQ", source: "mp.weixin.qq.com" },
      { title: "黑科技 ！AI届的“指环王”，已接入ChatGPT和Gemini！一个戒指可操控手机和智能家居，韩国公司研发", url: "https://mp.weixin.qq.com/s/kS3BufC2_KBzxQ7_ZkPAvQ", source: "mp.weixin.qq.com" },
      { title: "2023图灵奖得主揭晓！史上首位计算机和数学最高奖“双料王”诞生", url: "https://mp.weixin.qq.com/s/d4UiF7DMGz_5KdKBn4Bt5A", source: "mp.weixin.qq.com" },
      { title: "AI芯片竞争白热化！Meta官宣最新AI推理芯片！性能提升300%，支撑Llama高负载计算", url: "https://mp.weixin.qq.com/s/YDZCHdj3DN3gU0Fb7zAhdQ", source: "mp.weixin.qq.com" },
      { title: "李飞飞团队发布《2024年人工智能指数报告》，预测人工智能未来发展趋势", url: "https://mp.weixin.qq.com/s/c_7iX_GUbP60UW0aoFuwyw", source: "mp.weixin.qq.com" },
      { title: "波士顿动力抛弃液压机器人Atlas，推出全新电动化机器人，动作超灵活", url: "https://mp.weixin.qq.com/s/s-prTajnQzMTt1NFEM0gWg", source: "mp.weixin.qq.com" },
      { title: "最强开源大模型 Llama 3震撼发布！开源模型将追上GPT-4，4000亿参数模型也在路上", url: "https://mp.weixin.qq.com/s/0bHnV1g3z7_CJG_6deOyuQ", source: "mp.weixin.qq.com" },
      { title: "Llama 3 上线4天，井喷1000多个变种！中文版也有了！Groq上推理速度800token每秒", url: "https://mp.weixin.qq.com/s/oG0BrBudgxO8SgI4i4fk6w", source: "mp.weixin.qq.com" },
      { title: "2024 IEEE荣誉奖章揭晓！互联网之父，TCP/IP协议发明者Robert E. Kahn获奖", url: "https://mp.weixin.qq.com/s/zcq-4uFg2gnYtOc395WgHQ", source: "mp.weixin.qq.com" },
      { title: "老黄将世界上第一台英伟达H200亲手交付给OpenAI", url: "https://mp.weixin.qq.com/s/qALVhq5HMwxrpgQfPAB2SQ", source: "mp.weixin.qq.com" },
      { title: "OpenAI的搜索引擎要来了！", url: "https://mp.weixin.qq.com/s/rF2shS1Ke9XMUryFK2jgoA", source: "mp.weixin.qq.com" },
      { title: "ICLR 2024 杰出论文奖揭晓！两篇国内论文获荣誉提名", url: "https://mp.weixin.qq.com/s/mZLawbPU30h1oWvaSQ70Zg", source: "mp.weixin.qq.com" },
      { title: "Neuralink首个脑机接口患者：打游戏、搞研究两不误，重获自主能力", url: "https://mp.weixin.qq.com/s/FRA-NvgFG3LfbzQZQDg-lQ", source: "mp.weixin.qq.com" },
      { title: "终于！OpenAI首席科学家 Ilya 离职", url: "https://mp.weixin.qq.com/s/pkAcMpxOGoHqiZ7MHaVpaA", source: "mp.weixin.qq.com" },
      { title: "“AI届汪峰”谷歌的Astra是强势反击GPT-4o，还是又被抢了风头？", url: "https://mp.weixin.qq.com/s/tFsNWWY0yCg225ziOOjGPA", source: "mp.weixin.qq.com" },
      { title: "Mac不香啦？微软发布第一款GPT-4o加持的Windows", url: "https://mp.weixin.qq.com/s/MVQg0z9ZMfGLFXzFYP4-vA", source: "mp.weixin.qq.com" },
      { title: "微软开发者大会，Copilot Agents发布，掀起新一轮生产力革命！", url: "https://mp.weixin.qq.com/s/wJYFpY2ErQuMeT05d8_2Sw", source: "mp.weixin.qq.com" },
      { title: "马斯克xAI融资60亿美元，宣布打造世界第一超算中心，10万张H100GPU", url: "https://mp.weixin.qq.com/s/E50Z_gomCYQQXbXUB15Yvw", source: "mp.weixin.qq.com" },
      { title: "英雄联盟AI游戏伴侣来啦！实时提供对线策略，网红游戏主播陪练", url: "https://mp.weixin.qq.com/s/QuqNbxgxT6wEm5FQS22Qig", source: "mp.weixin.qq.com" },
      { title: "载入史册！马斯克第四次星际飞船试飞成功，首次实现海上软着陆", url: "https://mp.weixin.qq.com/s/6Cb6HEZV2pguOZczJl-Qcg", source: "mp.weixin.qq.com" },
      { title: "辟谣！Apple Intelligence背后的基础模型不是GPT-4o，而是苹果自研，仅3B，多模型", url: "https://mp.weixin.qq.com/s/joeCvQCQso5oQj9xsH5JLQ", source: "mp.weixin.qq.com" },
      { title: "落魄宗门里的绝世高手！中专女生逆袭拿下数学竞赛全球第12名，比大模型还强不少", url: "https://mp.weixin.qq.com/s/VmCPYHk6cS9Y0doHRO5xhg", source: "mp.weixin.qq.com" },
      { title: "复旦大学：一个小技巧探测大模型的知识边界，有效消除幻觉", url: "https://mp.weixin.qq.com/s/nrRZwvsxXW2TT_So2jlB-w", source: "mp.weixin.qq.com" },
    ],
  },
  {
    id: "writing-scir",
    title: "哈工大SCIR实验室公众号",
    articles: [
      { title: "赛尔笔记｜投机解码：解锁自回归推理速度上限", url: "https://mp.weixin.qq.com/s/536Gazk38Di4mmfRhpP_qg", source: "mp.weixin.qq.com" },
      { title: "哈工大九大AI模型登场 解锁千行百业智能新范式", url: "https://mp.weixin.qq.com/s/hxJx5XLne2UpM2BIFoHf9w", source: "mp.weixin.qq.com" },
      { title: "哈尔滨工业大学人工智能“生生不息奖”专项基金正式设立", url: "https://mp.weixin.qq.com/s/lHJg2n972gl1XtUHD0vugg", source: "mp.weixin.qq.com" },
      { title: "惊堂木：哈工大SCIR推出虚假信息检测系统，助力自媒体和AIGC时代下的虚假信息检测", url: "https://mp.weixin.qq.com/s/rvm0pdOqU3DslAfaqGASuQ", source: "mp.weixin.qq.com" },
      { title: "SmartBot 2025年第3期│综述│哈尔滨工业大学张伟男教授：具身智能：从感知智能到行为智能的发展概览", url: "https://mp.weixin.qq.com/s/cz3DoDFN3FiPhUv1CRN63A", source: "mp.weixin.qq.com" },
      { title: "哈工大SCIR刘铭教授主持CNCC 2025 “大模型驱动的多模态AI智能体技术演进与应用创新”分论坛", url: "https://mp.weixin.qq.com/s/yBJnpRyxDtIaMutG33jFzQ", source: "mp.weixin.qq.com" },
      { title: "赛尔原创@AAAI2026｜填补多语言语音幻觉检测空白，CCFQA基准助力评估大模型跨语言与跨模态事实一致性", url: "https://mp.weixin.qq.com/s/e1IBmtBq-18_unFnYLGtRQ", source: "mp.weixin.qq.com" },
      { title: "赛尔原创@ACM MM2025｜让模型学会“何时插图”：AMI 框架与 RID 数据集实现智能插图式对话回复", url: "https://mp.weixin.qq.com/s/hv2kD-GmugMp6gHyfZ8fLw", source: "mp.weixin.qq.com" },
      { title: "赛尔笔记｜大模型下的“文本为中心”多模态情感分析", url: "https://mp.weixin.qq.com/s/qrOLgvvPADVP75u0c4YEug", source: "mp.weixin.qq.com" },
      { title: "哈工大自然语言处理研究所官方网站正式上线", url: "https://mp.weixin.qq.com/s/3ljMDQkR2kt7ilPE0loe4w", source: "mp.weixin.qq.com" },
      { title: "思维链的“脆性”真相：哈工大赛尔ICLR 2026论文揭示输入扰动对推理的影响", url: "https://mp.weixin.qq.com/s/M8q4rcmbWQ_nJOtYdpaLFw", source: "mp.weixin.qq.com" },
      { title: "赛尔笔记｜从整体评分到结构化标准：LLM 发展全景下的 Rubric 综述", url: "https://mp.weixin.qq.com/s/2WgSmo02IXEiXe1RbqvSpg", source: "mp.weixin.qq.com" },
      { title: "AI驱动材料新范式，交叉催生变革强引擎 “仲荣”人工智能交叉学科论坛在校举行", url: "https://mp.weixin.qq.com/s/yZ6DTIKvjQ3HI1_r9w-PwA", source: "mp.weixin.qq.com" },
      { title: "哈工大计算社会科学协同创新中心算文论坛 第二十九期预告", url: "https://mp.weixin.qq.com/s/5xB2CiG3yJFD8nsGm9y2hg", source: "mp.weixin.qq.com" },
      { title: "哈工大SCIR 2026 开学动员会成功举办", url: "https://mp.weixin.qq.com/s/Ri_fk25tssKAGEQm6nFr9g", source: "mp.weixin.qq.com" },
    ],
  },
]
