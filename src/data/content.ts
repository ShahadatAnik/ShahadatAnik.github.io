// Profile and publication data for Md Shahadat Anik Sheikh (from CV and Google Scholar, 2026).
// `zh` holds the Korean (KR) text — see ko.ts. Add co-authors / full author lists in `authors` and `bibtex` as needed.

import { KO } from './ko'

const b = (en: string, ko: string = KO[en] ?? en) => ({ zh: ko, en })

type Bi = { zh: string; en: string }
export interface PublicationRecord {
  id: string
  title: string
  zhTitle: string
  authors: string
  correspondingAuthors: string[]
  authorship: Bi
  venue: string
  year: number
  type: 'article' | 'conference' | 'thesis'
  topics: string[]
  selected: boolean
  summary: Bi
  url: string
  doi?: string
  codeUrl?: string
  linkLabel?: Bi
  links?: { url: string; label: Bi }[]
  bibtex: string
}

const SCHOLAR = 'https://scholar.google.com/citations?user=vXBbmPIAAAAJ&hl=en'

// eslint-disable-next-line
export const PROFILE_DATA = {
  "profile": {
    "nameZh": "",
    "nameEn": "Md Shahadat Anik Sheikh",
    "email": "anik@khu.ac.kr",
    "github": "https://github.com/ShahadatAnik",
    "linkedin": "https://www.linkedin.com/in/shahadat-anik/",
    "scholar": SCHOLAR,
    "blog": "",
    "writing": ""
  },
  "publications": ([
    {
      "id": "requirement-diagrams",
      "title": "An Automated Tool to Generate Requirement Diagrams from Natural Language Requirements",
      "zhTitle": "An Automated Tool to Generate Requirement Diagrams from Natural Language Requirements",
      "authors": "SS Mistry, Md Shahadat Anik Sheikh, MH Chowdhury, TZS Alquraishy, SH Ripon",
      "correspondingAuthors": [] as string[],
      "authorship": b("Co-author"),
      "venue": "Intelligent Networks and Systems: Advanced Technologies and Applications, 191",
      "year": 2025,
      "type": "conference",
      "topics": ["medical"],
      "selected": true,
      "summary": b("An automated tool that generates software requirement diagrams from natural-language requirements."),
      "url": SCHOLAR,
      "linkLabel": b("Scholar"),
      "bibtex": "@inproceedings{mistry2025requirement,\n  title = {An Automated Tool to Generate Requirement Diagrams from Natural Language Requirements},\n  author = {Mistry, SS and Sheikh, MSA and Chowdhury, MH and Alquraishy, TZS and Ripon, SH},\n  booktitle = {Intelligent Networks and Systems: Advanced Technologies and Applications},\n  pages = {191},\n  year = {2025}\n}"
    },
    {
      "id": "rice-panicle",
      "title": "Comprehensive Dataset of Annotated Rice Panicle Image from Bangladesh",
      "zhTitle": "Comprehensive Dataset of Annotated Rice Panicle Image from Bangladesh",
      "authors": "MRA Rashid, MS Hossain, MD Fahim, MS Islam, RH Prito, Md Shahadat Anik Sheikh",
      "correspondingAuthors": [] as string[],
      "authorship": b("Co-author"),
      "venue": "Data in Brief 51, 109772",
      "year": 2023,
      "type": "article",
      "topics": ["nlp"],
      "selected": true,
      "summary": b("An annotated image dataset of rice panicles from Bangladesh, built as a resource for computer-vision research in agriculture."),
      "url": "https://doi.org/10.1016/j.dib.2023.109772",
      "doi": "10.1016/j.dib.2023.109772",
      "linkLabel": b("Paper"),
      "bibtex": "@article{sheikh2023rice,\n  title = {Comprehensive Dataset of Annotated Rice Panicle Image from Bangladesh},\n  author = {Sheikh, Md Shahadat Anik},\n  journal = {Data in Brief},\n  year = {2023},\n  doi = {10.1016/j.dib.2023.109772}\n}"
    },
    {
      "id": "biodegradable-cnn",
      "title": "Detecting Biodegradable and Non-biodegradable Images Using CNN and Deep Learning",
      "zhTitle": "Detecting Biodegradable and Non-biodegradable Images Using CNN and Deep Learning",
      "authors": "TA Ripa, M Ahmed, K Akter, Md Shahadat Anik Sheikh, SS Jennifer, MH Shamim",
      "correspondingAuthors": [] as string[],
      "authorship": b("Author"),
      "venue": "ICO 2023 · 7th International Conference on Intelligent Computing & Optimization, Phnom Penh, Cambodia",
      "year": 2023,
      "type": "conference",
      "topics": ["nlp", "medical"],
      "selected": true,
      "summary": b("A CNN-based deep-learning approach that classifies waste images as biodegradable or non-biodegradable."),
      "url": "https://doi.org/10.1007/978-3-031-73318-5_4",
      "doi": "10.1007/978-3-031-73318-5_4",
      "linkLabel": b("Paper"),
      "bibtex": "@inproceedings{sheikh2023biodegradable,\n  title = {Detecting Biodegradable and Non-biodegradable Images Using CNN and Deep Learning},\n  author = {Sheikh, Md Shahadat Anik},\n  booktitle = {7th International Conference on Intelligent Computing \\& Optimization (ICO 2023)},\n  year = {2023},\n  doi = {10.1007/978-3-031-73318-5_4}\n}"
    },
    {
      "id": "ewaste",
      "title": "A Sustainable E-Waste Management System For Bangladesh",
      "zhTitle": "A Sustainable E-Waste Management System For Bangladesh",
      "authors": "Md Shahadat Anik Sheikh, RB Rafsan, HAR Fahim, MT Khan, AW Reza",
      "correspondingAuthors": [] as string[],
      "authorship": b("Author"),
      "venue": "MIET 2022 · First International Conference on Machine Intelligence and Emerging Technologies, Noakhali, Bangladesh",
      "year": 2022,
      "type": "conference",
      "topics": ["medical"],
      "selected": false,
      "summary": b("A proposed system for sustainable electronic-waste management in Bangladesh."),
      "url": "https://doi.org/10.1007/978-3-031-34622-4_58",
      "doi": "10.1007/978-3-031-34622-4_58",
      "linkLabel": b("Paper"),
      "bibtex": "@inproceedings{sheikh2022ewaste,\n  title = {A Sustainable E-Waste Management System For Bangladesh},\n  author = {Sheikh, Md Shahadat Anik},\n  booktitle = {First International Conference on Machine Intelligence and Emerging Technologies (MIET 2022)},\n  year = {2022},\n  doi = {10.1007/978-3-031-34622-4_58}\n}"
    }
  ]) as PublicationRecord[],
  "education": [
    {
      "period": "2026–present",
      "school": b("Kyung Hee University, Yongin, South Korea"),
      "url": "https://www.khu.ac.kr",
      "degree": b("Combined M.S. + Ph.D. · Brain AI / BCI"),
      "detail": b("Industrial AI Lab, Big Data Analytics")
    },
    {
      "period": "2019–2023",
      "school": b("East West University, Dhaka, Bangladesh"),
      "url": "https://www.ewubd.edu",
      "degree": b("B.Sc. · Computer Science and Engineering"),
      "detail": b("CGPA 3.79")
    },
    {
      "period": "2016–2018",
      "school": b("Chittagong Port College, Chittagong, Bangladesh"),
      "url": "https://cpc.edu.bd/#/home",
      "degree": b("Higher Secondary Certificate · Science"),
      "detail": b("GPA 4.83")
    },
    {
      "period": "2011–2016",
      "school": b("Chittagong Port High School, Chittagong, Bangladesh"),
      "url": "https://cpahs.edu.bd/",
      "degree": b("Secondary School Certificate · Science"),
      "detail": b("GPA 5.00")
    }
  ],
  "honors": [
    { "year": 2025, "title": b("IELTS · Overall Band 7.0") },
    { "year": 2024, "title": b("Cum Laude · East West University (CGPA 3.7+ across 12 consecutive semesters, no retakes)") },
    { "year": 2022, "title": b("Merit Scholarship, 100% tuition · East West University (GPA 3.9+ across 3 consecutive semesters)") }
  ],
  "experience": [
    {
      "period": "2026.09–present",
      "title": b("Research Assistant · Industrial AI Lab, Kyung Hee University"),
      "detail": b("Developing a brain–AI interface and a brainwave-language model for non-verbal communication.")
    },
    {
      "period": "2023–present",
      "title": b("Software Engineer · SynapTech, Bangladesh"),
      "url": "https://synaptech.cloud/",
      "detail": b("Built scalable ERP systems across industries (inventory, production, work order and delivery modules); redesigned database architectures for performance, maintainability and scalability; led teams of up to six engineers through the Agile SDLC, from requirements to VPS-based deployment; delivered ERP solutions for zipper manufacturing, kitchen inventory and lighter-vessel transportation.")
    },
    {
      "period": "2022.09–2023.03",
      "title": b("Project Practice Trainee (Online) · Neusoft Corporation, Shenyang, China"),
      "detail": b("Trained in web application development with Java, Python and MVC architecture; built, debugged and tested scalable web apps in a virtual team.")
    },
    {
      "period": "Project",
      "title": b("Self-Driving Car Perception Using Sensor Fusion"),
      "detail": b("Perception pipeline fusing LiDAR point clouds and camera data, using PointNet++ and YOLOv7 for 3D object detection with Kalman filtering and SLAM for real-time state estimation.")
    },
    {
      "period": "Project",
      "title": b("Multimodal Human Activity Recognition (Vision + Wearables)"),
      "detail": b("Fused skeleton sequences with accelerometer and gyroscope signals using CNN + LSTM and transformer-based attention for modality fusion; applications in healthcare monitoring, sports analytics and assistive robotics.")
    }
  ],
  "skills": [
    { "name": "Python", "level": b("Languages") },
    { "name": "C / C++", "level": b("Languages") },
    { "name": "Java", "level": b("Languages") },
    { "name": "JavaScript", "level": b("Languages") },
    { "name": "SQL", "level": b("Languages") },
    { "name": "Spark", "level": b("Languages") },
    { "name": "React.js", "level": b("Languages") },
    { "name": "PyTorch", "level": b("Frameworks") },
    { "name": "TensorFlow", "level": b("Frameworks") },
    { "name": "Keras", "level": b("Frameworks") },
    { "name": "Scikit-learn", "level": b("Frameworks") },
    { "name": "OpenCV", "level": b("Frameworks") },
    { "name": "Hugging Face", "level": b("Frameworks") },
    { "name": "YOLO", "level": b("Frameworks") },
    { "name": "Django", "level": b("Tools") },
    { "name": "MongoDB", "level": b("Tools") },
    { "name": "Git", "level": b("Tools") },
    { "name": "Linux", "level": b("Tools") },
    { "name": "LaTeX", "level": b("Tools") }
  ],
  "interests": {
    "zh": ["뇌 AI", "BCI", "EEG", "빅데이터", "멀티모달 학습"],
    "en": ["Brain AI", "BCI", "EEG", "Big Data", "Multimodal learning"]
  },
  "research": [
    {
      "id": "eeg",
      "title": b("Brain-AI & BCI"),
      "detail": b("Brain–AI interfaces and a brainwave-language model for non-verbal communication."),
      "topics": ["eeg"]
    },
    {
      "id": "brain",
      "title": b("Multimodal learning"),
      "detail": b("Fusing vision, LiDAR and wearable-sensor signals with CNN, LSTM and transformer attention."),
      "topics": ["brain"]
    },
    {
      "id": "nlp",
      "title": b("Computer vision"),
      "detail": b("Image datasets, CNN classification, 3D object detection and perception for autonomous systems."),
      "topics": ["nlp"]
    },
    {
      "id": "medical",
      "title": b("Applied AI & systems"),
      "detail": b("Sustainability-oriented tools, requirements modelling and production ERP software."),
      "topics": ["medical"]
    }
  ]
}

export type ProfileData = typeof PROFILE_DATA
export type Publication = PublicationRecord
