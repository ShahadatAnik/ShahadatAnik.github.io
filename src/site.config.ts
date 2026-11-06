/**
 * ONE FILE FOR ALL YOUR INFO.
 *
 * Edit the values below; everything on the site (hero, education, experience, publications, links, SEO)
 * reads from here. Text that is shown in two languages is `{ en: '…', ko: '…' }`; if you leave `ko` out,
 * the English text is used in the Korean version too. TypeScript will flag typos and missing fields.
 *
 * Other places you may still edit:
 *   - src/data/i18n.ts       generic UI wording (buttons, section headings)
 *   - vite.config.ts         `paperIds` must list every publication `id` (so each page is prerendered)
 *   - public/sitemap.xml     keep in sync with the publication ids
 *   - public/assets/         portrait.jpg, favicon.svg
 */

export type Text = { en: string; ko?: string }

/** Research topic ids; a publication's `topics` link it to a research area below. */
export type TopicId = 'eeg' | 'brain' | 'nlp' | 'medical'

export interface Publication {
  /** URL slug: /publications/<id>/ — also add it to `paperIds` in vite.config.ts and to the sitemap. */
  id: string
  title: string
  /** Optional Korean title; the English title is used if omitted. */
  titleKo?: string
  /** Author names in order. Your own name must match `profile.name` exactly to be shown in bold. */
  authors: string[]
  correspondingAuthors?: string[]
  /** e.g. “Co-author”, “First author”. */
  authorship: Text
  /** Journal or conference name (shown as-is). */
  venue: string
  year: number
  type: 'article' | 'conference' | 'thesis'
  topics: TopicId[]
  /** Shown first / highlighted. */
  selected?: boolean
  summary: Text
  /** Main link (usually the DOI URL). */
  url: string
  doi?: string
  codeUrl?: string
  /** Publication date, YYYY-MM-DD (shown on the paper page). */
  date?: string
  publisher?: string
  volume?: string
  pages?: string
  /** Google Scholar citation count (update occasionally). */
  citations?: number
  /** Full abstract (shown on the paper page and in the overview dialog). */
  abstract?: Text
  /** Link to this paper's Google Scholar entry, if you want one. */
  scholarUrl?: string
  /** Label of the main link, e.g. “Paper” or “Scholar”. */
  linkLabel?: Text
  /** Extra links, if any. */
  links?: { url: string; label: Text }[]
}

export interface Education {
  period: string
  school: Text
  /** School website; leave undefined for plain text. */
  url?: string
  degree: Text
  detail: Text
}

export interface Experience {
  /** e.g. “2023–present”, or “Project”. */
  period: string
  title: Text
  url?: string
  detail: Text
}

export interface Affiliation {
  /** Letters in the badge, and the small word under it. */
  mark: string
  markSub: string
  name: Text
  detail: Text
  url?: string
}

const SCHOLAR = 'https://scholar.google.com/citations?user=vXBbmPIAAAAJ&hl=en'

export const siteConfig = {
  site: {
    /** Public address of the site (no trailing slash). */
    url: 'https://shahadatanik.github.io',
    /** Issued by Google Search Console; leave empty until you have it. */
    googleVerification: '',
  },

  profile: {
    name: 'Md Shahadat Anik Sheikh',
    /** Short / called name, used in the header and hero. */
    shortName: 'Anik',
    email: 'anik@khu.ac.kr',
    github: 'https://github.com/ShahadatAnik',
    linkedin: 'https://www.linkedin.com/in/shahadat-anik/',
    scholar: SCHOLAR,
  },

  hero: {
    eyebrow: { en: 'MS+PhD researcher · Brain-AI & BCI', ko: '석박통합과정 연구원 · 뇌-AI & BCI' } satisfies Text,
    status: { en: 'Open to research collaboration', ko: '공동 연구 환영' } satisfies Text,
    bio: {
      en: 'I am a combined M.S.+Ph.D. student and Research Assistant at the Industrial AI Lab (Big Data Analytics), Kyung Hee University. I work on brain–AI interfaces and a brainwave-language model for non-verbal communication, with a background in deep learning, computer vision and ERP software engineering.',
      ko: '경희대학교 산업AI연구실(빅데이터 분석) 연구조교이자 석박사 통합과정 학생입니다. 비언어 의사소통을 위한 뇌-AI 인터페이스와 뇌파-언어 모델을 연구하며, 딥러닝, 컴퓨터 비전, ERP 소프트웨어 엔지니어링 경험이 있습니다.',
    } satisfies Text,
    /** Line under the portrait. */
    role: { en: 'RESEARCHER / ENGINEER', ko: '연구자 / 엔지니어' } satisfies Text,
    /** Small chips next to the affiliations. */
    keywords: ['Brain-AI', 'BCI', 'Computer vision', 'Multimodal learning'],
  },

  /** The two organisations shown under the hero. */
  affiliations: [
    {
      mark: 'KHU',
      markSub: 'SEOUL',
      name: { en: 'Kyung Hee University', ko: '경희대학교' },
      detail: { en: 'M.S.+Ph.D. · Industrial AI Lab · 2026–present', ko: '석박통합과정 · 산업AI연구실 · 2026–현재' },
    },
    {
      mark: 'ST',
      markSub: 'DHAKA',
      name: { en: 'SynapTech', ko: 'SynapTech' },
      detail: { en: 'Software Engineer & Team Lead · 2023.06–2026.08', ko: '소프트웨어 엔지니어 겸 팀 리드 · 2023.06–2026.08' },
      url: 'https://synaptech.cloud/',
    },
  ] satisfies Affiliation[],

  /** Search-engine / social preview text. */
  seo: {
    title: {
      en: 'Md Shahadat Anik Sheikh (Anik) | Kyung Hee University | Brain-AI & BCI',
      ko: 'Md Shahadat Anik Sheikh (Anik) | 경희대학교 | 뇌-AI & BCI',
    } satisfies Text,
    description: {
      en: 'Anik (Md Shahadat Anik Sheikh) is an M.S.+Ph.D. student and Research Assistant at the Industrial AI Lab, Kyung Hee University, working on brain–AI interfaces, brainwave-language models, computer vision and multimodal learning.',
      ko: 'Anik(Md Shahadat Anik Sheikh)은 경희대학교 산업AI연구실 연구조교이자 석박사 통합과정 학생으로, 뇌-AI 인터페이스, 뇌파-언어 모델, 컴퓨터 비전, 멀티모달 학습을 연구합니다.',
    } satisfies Text,
    jobTitle: 'Research Assistant, M.S.+Ph.D. student',
    organization: 'Kyung Hee University',
    knowsAbout: ['Brain–computer interfaces', 'Brain-AI', 'Computer vision', 'Multimodal learning'],
  },

  interests: [
    { en: 'Brain AI', ko: '뇌 AI' },
    { en: 'BCI', ko: 'BCI' },
    { en: 'EEG', ko: 'EEG' },
    { en: 'Big Data', ko: '빅데이터' },
    { en: 'Multimodal learning', ko: '멀티모달 학습' },
  ] satisfies Text[],

  /** The four research areas (ids must stay as they are; edit the text). */
  research: [
    {
      id: 'eeg',
      title: { en: 'Brain-AI & BCI', ko: '뇌-AI & BCI' },
      detail: {
        en: 'Brain–AI interfaces and a brainwave-language model for non-verbal communication.',
        ko: '비언어 의사소통을 위한 뇌-AI 인터페이스와 뇌파-언어 모델.',
      },
    },
    {
      id: 'brain',
      title: { en: 'Multimodal learning', ko: '멀티모달 학습' },
      detail: {
        en: 'Fusing vision, LiDAR and wearable-sensor signals with CNN, LSTM and transformer attention.',
        ko: 'CNN, LSTM, 트랜스포머 어텐션으로 비전·LiDAR·웨어러블 센서 신호를 융합.',
      },
    },
    {
      id: 'nlp',
      title: { en: 'Computer vision', ko: '컴퓨터 비전' },
      detail: {
        en: 'Image datasets, CNN classification, 3D object detection and perception for autonomous systems.',
        ko: '이미지 데이터셋, CNN 분류, 3D 객체 검출, 자율 시스템 인지.',
      },
    },
    {
      id: 'medical',
      title: { en: 'Applied AI & systems', ko: '응용 AI & 시스템' },
      detail: {
        en: 'Sustainability-oriented tools, requirements modelling and production ERP software.',
        ko: '지속가능성 지향 도구, 요구사항 모델링, 실무 ERP 소프트웨어.',
      },
    },
  ] satisfies { id: TopicId; title: Text; detail: Text }[],

  publications: [
    {
      id: 'requirement-diagrams',
      title: 'An Automated Tool to Generate Requirement Diagrams from Natural Language Requirements',
      authors: ['Sumit Shuvro Mistry', 'Md Shahadat Anik Sheikh', 'Maksudul Haque Chowdhury', 'Talha Zubaer Siddique Alquraishy', 'Shamim H Ripon'],
      authorship: { en: 'Co-author', ko: '공저자' },
      venue: 'Intelligent Networks and Systems: Advanced Technologies and Applications',
      year: 2025,
      date: '2025-09-30',
      publisher: 'CRC Press',
      pages: '191',
      abstract: {
        en: 'It has always been challenging to handle the numerous requirements while gathering the correct requirements to create software; hence, automating the feature extraction and requirements elicitation processes is essential. Bridging the gap between consumer expectations and the given product, which might be pretty broad, is difficult. Clients commonly communicate their requirements in non-technical language, which is confusing to engineers. The operating technique and tool for automatically extracting and analyzing characteristics from textual requirements specifications provided by users are presented in this study. Using NLP approaches, the program extracts features from user stories and verifies them against a predetermined set of target domain attributes. The extracted characteristics may then create a diagram that provides clients with quick and straightforward input on the intended product. Point of Sales (POS) has been used as a case study to conduct experiments and show the applicability of the proposed method.',
        ko: '소프트웨어를 만들기 위해 정확한 요구사항을 파악하고 수많은 요구사항을 다루는 일은 늘 어려웠으며, 따라서 특징 추출과 요구사항 도출 과정을 자동화하는 것이 중요합니다. 소비자의 기대와 주어진 제품 사이의 간극은 상당히 넓을 수 있어 메우기 어렵습니다. 고객은 보통 비전문적인 언어로 요구사항을 설명하는데, 이는 엔지니어에게 혼란스럽습니다. 이 연구는 사용자가 제공한 텍스트 요구사항 명세에서 특성을 자동으로 추출·분석하는 기법과 도구를 제시합니다. NLP 접근법을 사용해 프로그램이 사용자 스토리에서 특징을 추출하고 미리 정해진 대상 도메인 속성과 대조해 검증합니다. 추출된 특성으로 다이어그램을 만들면 고객이 의도한 제품에 대해 빠르고 간단하게 의견을 줄 수 있습니다. 제안 방법의 적용 가능성을 보이기 위해 POS(Point of Sales)를 사례 연구로 실험했습니다.',
      },
      type: 'conference',
      topics: ['medical'],
      selected: true,
      summary: {
        en: 'An automated tool that generates software requirement diagrams from natural-language requirements.',
        ko: '자연어 요구사항으로부터 소프트웨어 요구사항 다이어그램을 자동 생성하는 도구.',
      },
      url: 'https://doi.org/10.1201/9781032659770-15',
      doi: '10.1201/9781032659770-15',
      linkLabel: { en: 'Paper', ko: '논문' },
    },
    {
      id: 'rice-panicle',
      title: 'Comprehensive Dataset of Annotated Rice Panicle Image from Bangladesh',
      authors: ['Mohammad Rifat Ahmmad Rashid', 'Md Shafayat Hossain', 'MD Fahim', 'Md Shajibul Islam', 'Rizvee Hassan Prito', 'Md Shahadat Anik Sheikh', 'Md Sawkat Ali', 'Mahamudul Hasan', 'Maheen Islam'],
      authorship: { en: 'Co-author', ko: '공저자' },
      venue: 'Data in Brief',
      year: 2023,
      date: '2023-12-01',
      publisher: 'Elsevier',
      volume: '51',
      pages: '109772',
      citations: 14,
      abstract: {
        en: 'Bangladesh\'s economy is primarily driven by the agriculture sector. Rice is one of the staple food of Bangladesh. The count of panicles per unit area serves as a widely used indicator for estimating rice yield, facilitating breeding efforts, and conducting phenotypic analysis. By calculating the number of panicles within a given area, researchers and farmers can assess crop density, plant health, and prospective production. The conventional method of estimating rice yields in Bangladesh is time-consuming, inaccurate, and inefficient. To address the challenge of detecting rice panicles, this article provides a comprehensive dataset of annotated rice panicle images from Bangladesh. Data collection was done by a drone equipped with a 4 K resolution camera, and it took place on April 25, 2023, in Bonkhoria Gazipur, Bangladesh. During the day, the drone captured the rice field from various heights and perspectives …',
        ko: '방글라데시 경제는 주로 농업 부문이 이끌며, 쌀은 방글라데시의 주식 중 하나입니다. 단위 면적당 벼 이삭 수는 쌀 수확량을 추정하고 육종과 표현형 분석을 돕는 데 널리 쓰이는 지표입니다. 일정 면적 내 이삭 수를 계산하면 연구자와 농민은 작물 밀도, 식물 건강, 예상 생산량을 평가할 수 있습니다. 방글라데시의 기존 수확량 추정 방식은 시간이 많이 들고 부정확하며 비효율적입니다. 벼 이삭 검출 문제를 해결하기 위해 이 논문은 방글라데시에서 수집한 주석이 달린 벼 이삭 이미지의 포괄적인 데이터셋을 제공합니다. 데이터는 4K 해상도 카메라를 장착한 드론으로 2023년 4월 25일 방글라데시 가지푸르의 본코리아에서 수집했으며, 낮 동안 드론이 다양한 높이와 시점에서 논을 촬영했습니다 …',
      },
      type: 'article',
      topics: ['nlp'],
      selected: true,
      summary: {
        en: 'An annotated image dataset of rice panicles from Bangladesh, built as a resource for computer-vision research in agriculture.',
        ko: '농업 컴퓨터 비전 연구를 위해 구축한, 방글라데시 벼 이삭 주석 이미지 데이터셋.',
      },
      url: 'https://doi.org/10.1016/j.dib.2023.109772',
      doi: '10.1016/j.dib.2023.109772',
      linkLabel: { en: 'Paper', ko: '논문' },
    },
    {
      id: 'biodegradable-cnn',
      title: 'Detecting Biodegradable and Non-biodegradable Images Using CNN and Deep Learning',
      authors: ['Tanjina Akter Ripa', 'Mahade Ahmed', 'Khadija Akter', 'Md Shahadat Anik Sheikh', 'Sanjeda Sara Jennifer', 'Mahbub Hasan Shamim', 'Ahmed Wasif Reza'],
      authorship: { en: 'Author', ko: '저자' },
      venue: 'ICO 2023 · 7th International Conference on Intelligent Computing & Optimization, Phnom Penh, Cambodia',
      year: 2023,
      date: '2023-10-27',
      publisher: 'Springer Nature Switzerland',
      pages: '31–39',
      abstract: {
        en: 'To distinguish between biodegradable and non-biodegradables, different methodologies and models are implemented in this study using image processing. We experimented with Convolutional Neural Networks (CNN), U-Net, and Support Vector Machines (SVM). CNN outperformed the other models obtaining a training accuracy of 0.9397, which is approximately 94%, and a validation accuracy of 0.9165, which can be rounded off to 92%. SVM on the other hand obtained an accuracy of 92%. We assessed our model\'s accuracy and our approach was able to predict well whether the object is biodegradable or not based on the input of a single image. To make sure that it can recognize the primary objective from a single image, we went through our models extensively. The identification, tracking, sorting, and processing of biodegradable and non-biodegradable items might be aided by our model when it will be …',
        ko: '생분해성과 비생분해성을 구별하기 위해 이 연구에서는 이미지 처리를 이용한 다양한 방법론과 모델을 구현했습니다. 합성곱 신경망(CNN), U-Net, 서포트 벡터 머신(SVM)을 실험했으며, CNN이 다른 모델보다 우수해 훈련 정확도 0.9397(약 94%), 검증 정확도 0.9165(약 92%)를 얻었습니다. 반면 SVM의 정확도는 92%였습니다. 모델의 정확도를 평가한 결과, 우리의 접근법은 단일 이미지 입력만으로 물체가 생분해성인지 여부를 잘 예측했습니다. 단일 이미지에서 주요 대상을 인식할 수 있도록 모델을 폭넓게 검증했습니다. 생분해성 및 비생분해성 품목의 식별, 추적, 분류, 처리에 이 모델이 도움이 될 수 있습니다 …',
      },
      type: 'conference',
      topics: ['nlp', 'medical'],
      selected: true,
      summary: {
        en: 'A CNN-based deep-learning approach that classifies waste images as biodegradable or non-biodegradable.',
        ko: 'CNN 기반 딥러닝으로 폐기물 이미지를 생분해성/비생분해성으로 분류하는 방법.',
      },
      url: 'https://doi.org/10.1007/978-3-031-73318-5_4',
      doi: '10.1007/978-3-031-73318-5_4',
      linkLabel: { en: 'Paper', ko: '논문' },
    },
    {
      id: 'ewaste',
      title: 'A Sustainable E-Waste Management System For Bangladesh',
      authors: ['Md Shahadat Anik Sheikh', 'Rashik Buksh Rafsan', 'Hasib Ar Rafiul Fahim', 'Md Tabib Khan', 'Ahmed Wasif Reza'],
      authorship: { en: 'Author', ko: '저자' },
      venue: 'MIET 2022 · First International Conference on Machine Intelligence and Emerging Technologies, Noakhali, Bangladesh',
      year: 2022,
      date: '2022-09-23',
      publisher: 'Springer Nature Switzerland',
      pages: '739–753',
      citations: 1,
      abstract: {
        en: 'The use of electronic devices is increasing rapidly as it is an essential part of our life in today\'s world. Shown in numbers, it has grown from zero to 7.2 billion in only three decades. There is a 5–10% annual rise in the quantity of used electronic equipment, which, if not correctly disposed of, can result in environmental dangers that harm human health, marine life, and soil fertility. For developing countries like Bangladesh, managing this massive stream of electrical and electronic garbage is challenging due to the lack of solid organizational and governmental e-waste management infrastructure. Lack of public knowledge, policies, and funding in waste management are only a few of the significant causes driving this situation. In this study, a majority of the adopted E-waste management systems and their limitations, along with the proposal of a new and sustainable E-waste management system, have been discussed …',
        ko: '전자기기는 오늘날 삶의 필수 요소로 사용이 빠르게 늘고 있으며, 수치로 보면 불과 30년 만에 0에서 72억 대로 증가했습니다. 사용한 전자 장비의 양은 매년 5–10%씩 늘어나는데, 올바르게 폐기하지 않으면 인간의 건강, 해양 생물, 토양 비옥도를 해치는 환경 위험을 초래할 수 있습니다. 방글라데시와 같은 개발도상국에서는 견고한 조직적·정부적 전자 폐기물 관리 인프라가 부족해 이 방대한 전기·전자 쓰레기를 관리하기 어렵습니다. 폐기물 관리에 대한 대중의 지식, 정책, 재원 부족은 이런 상황을 낳는 여러 주요 원인 중 일부일 뿐입니다. 이 연구에서는 채택된 대부분의 전자 폐기물 관리 시스템과 그 한계를 논의하고, 새롭고 지속 가능한 전자 폐기물 관리 시스템을 제안합니다 …',
      },
      type: 'conference',
      topics: ['medical'],
      selected: false,
      summary: {
        en: 'A proposed system for sustainable electronic-waste management in Bangladesh.',
        ko: '방글라데시의 지속 가능한 전자 폐기물 관리 시스템 제안.',
      },
      url: 'https://doi.org/10.1007/978-3-031-34622-4_58',
      doi: '10.1007/978-3-031-34622-4_58',
      linkLabel: { en: 'Paper', ko: '논문' },
    },
  ] satisfies Publication[],

  education: [
    {
      period: '2026–present',
      school: { en: 'Kyung Hee University, Yongin, South Korea', ko: '경희대학교, 대한민국 용인' },
      url: 'https://www.khu.ac.kr/kor/user/main/view.do',
      degree: { en: 'Combined M.S. + Ph.D. · Brain AI / BCI', ko: '석박사 통합과정 · 뇌 AI / BCI' },
      detail: { en: 'Industrial AI Lab, Big Data Analytics', ko: '산업AI연구실, 빅데이터 분석' },
    },
    {
      period: '2019–2023',
      school: { en: 'East West University, Dhaka, Bangladesh', ko: '이스트웨스트대학교, 방글라데시 다카' },
      url: 'https://www.ewubd.edu',
      degree: { en: 'B.Sc. · Computer Science and Engineering', ko: '학사 · 컴퓨터공학' },
      detail: { en: 'CGPA 3.79' },
    },
    {
      period: '2016–2018',
      school: { en: 'Chittagong Port College, Chittagong, Bangladesh', ko: '치타공 항만 칼리지, 방글라데시 치타공' },
      url: 'https://cpc.edu.bd/#/home',
      degree: { en: 'Higher Secondary Certificate · Science', ko: '고등학교 졸업증(HSC) · 이과' },
      detail: { en: 'GPA 4.83' },
    },
    {
      period: '2011–2016',
      school: { en: 'Chittagong Port High School, Chittagong, Bangladesh', ko: '치타공 항만 고등학교, 방글라데시 치타공' },
      url: 'https://cpahs.edu.bd/',
      degree: { en: 'Secondary School Certificate · Science', ko: '중등학교 졸업증(SSC) · 이과' },
      detail: { en: 'GPA 5.00' },
    },
  ] satisfies Education[],

  honors: [
    { year: 2025, title: { en: 'IELTS · Overall Band 7.0', ko: 'IELTS · 종합 밴드 7.0' } },
    {
      year: 2024,
      title: {
        en: 'Cum Laude · East West University',
        ko: 'Cum Laude · 이스트웨스트대학교',
      },
    },
    {
      year: 2022,
      title: {
        en: 'Merit Scholarship, 100% tuition · East West University',
        ko: '성적우수 장학금(등록금 100%) · 이스트웨스트대학교',
      },
    },
  ] satisfies { year: number; title: Text }[],

  experience: [
    {
      period: '2026.09–present',
      title: { en: 'Research Assistant · Industrial AI Lab, Kyung Hee University', ko: '연구조교 · 경희대학교 산업AI연구실' },
      detail: {
        en: 'Developing a brain–AI interface and a brainwave-language model for non-verbal communication.',
        ko: '비언어 의사소통을 위한 뇌-AI 인터페이스와 뇌파-언어 모델을 개발합니다.',
      },
    },
    {
      period: '2023.06–2026.08',
      title: { en: 'Software Engineer & Team Lead · SynapTech, Bangladesh', ko: '소프트웨어 엔지니어 겸 팀 리드 · SynapTech, 방글라데시' },
      url: 'https://synaptech.cloud/',
      detail: {
        en: 'Built scalable ERP systems across industries (inventory, production, work order and delivery modules); redesigned database architectures for performance, maintainability and scalability; led teams of up to six engineers through the Agile SDLC, from requirements to VPS-based deployment; delivered ERP solutions for zipper manufacturing, kitchen inventory and lighter-vessel transportation.',
        ko: '다양한 산업을 위한 확장 가능한 ERP 시스템(재고, 생산, 작업지시, 배송 모듈)을 구축하고, 성능·유지보수성·확장성을 높이도록 데이터베이스 구조를 재설계했습니다. 최대 6명의 엔지니어 팀을 이끌며 요구사항 수집부터 VPS 배포까지 애자일 SDLC를 총괄했고, 지퍼 제조, 주방 재고, 소형 선박 운송 분야의 ERP 솔루션을 납품했습니다.',
      },
    },
    {
      period: '2022.09–2023.03',
      title: {
        en: 'Project Practice Trainee (Online) · Neusoft Corporation, Shenyang, China',
        ko: '프로젝트 실습생(온라인) · Neusoft Corporation, 선양, 중국',
      },
      detail: {
        en: 'Trained in web application development with Java, Python and MVC architecture; built, debugged and tested scalable web apps in a virtual team.',
        ko: 'Java, Python, MVC 아키텍처 기반 웹 애플리케이션 개발을 교육받고, 가상 팀에서 확장 가능한 웹 앱을 개발·디버깅·테스트했습니다.',
      },
    },
    {
      period: 'Project',
      title: { en: 'Self-Driving Car Perception Using Sensor Fusion', ko: '센서 융합 기반 자율주행 인지' },
      detail: {
        en: 'Perception pipeline fusing LiDAR point clouds and camera data, using PointNet++ and YOLOv7 for 3D object detection with Kalman filtering and SLAM for real-time state estimation.',
        ko: 'LiDAR 포인트 클라우드와 카메라 데이터를 융합한 인지 파이프라인. PointNet++와 YOLOv7로 3D 객체를 검출하고, 칼만 필터와 SLAM으로 실시간 상태를 추정합니다.',
      },
    },
    {
      period: 'Project',
      title: { en: 'Multimodal Human Activity Recognition (Vision + Wearables)', ko: '멀티모달 인간 행동 인식 (비전 + 웨어러블)' },
      detail: {
        en: 'Fused skeleton sequences with accelerometer and gyroscope signals using CNN + LSTM and transformer-based attention for modality fusion; applications in healthcare monitoring, sports analytics and assistive robotics.',
        ko: '스켈레톤 시퀀스와 가속도계·자이로스코프 신호를 CNN+LSTM과 트랜스포머 어텐션으로 융합했으며, 헬스케어 모니터링, 스포츠 분석, 보조 로봇에 응용할 수 있습니다.',
      },
    },
  ] satisfies Experience[],

  /** Skills, grouped (the group name shows when a chip is clicked). */
  skills: [
    { group: { en: 'Languages', ko: '언어' }, items: ['Python', 'C / C++', 'Java', 'JavaScript', 'SQL', 'Spark', 'React.js'] },
    { group: { en: 'Frameworks', ko: '프레임워크' }, items: ['PyTorch', 'TensorFlow', 'Keras', 'Scikit-learn', 'OpenCV', 'Hugging Face', 'YOLO'] },
    { group: { en: 'Tools', ko: '도구' }, items: ['Django', 'MongoDB', 'Git', 'Linux', 'LaTeX'] },
  ] satisfies { group: Text; items: string[] }[],
}

export type SiteConfig = typeof siteConfig
