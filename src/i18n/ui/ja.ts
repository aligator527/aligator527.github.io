import type { Dictionary } from './en';

/**
 * Japanese UI chrome.
 *
 * Decisions, confirmed by Ivan on 2026-10-08:
 *
 * - **Register.** です・ます for sentences; 体言止め for labels, table headers and diagram layers.
 *   A portfolio read by a hiring manager is a polite document, not a specification.
 * - **Job titles in katakana.** テックリード, フルスタックエンジニア, プロジェクトリード. The kanji
 *   alternatives misstate the role in opposite directions: 技術責任者 reads as CTO, and
 *   システムエンジニア／SE is a grade term that erases architecture scope.
 * - **The name stays Latin in the wordmark**, with 「イワン・ドルゴフ」 in the page's hidden full
 *   name so that a reader searching in katakana finds the site.
 * - **Notation is not translated.** `P01`, `L1`, `REV.`, `2026/09` are a coordinate system; a
 *   coordinate system that changes per locale is not one.
 * - **Uppercase does nothing in Japanese.** The metadata register that English sets in uppercase
 *   mono is distinguished here by the mono face and the rules around it, not by letter case —
 *   `.ai/design/typography.md` records what replaces it.
 */
export const ja: Dictionary = {
  // Chrome
  skipToContent: '本文へスキップ',
  navLanguage: '言語',
  navPrimary: 'メインナビゲーション',
  navWork: '実績',
  navLab: 'ラボ',
  navExperience: '経歴',
  navNotes: 'ノート',
  navAbout: 'プロフィール',
  navResume: 'Résumé',
  revision: (month: string) => `REV. ${month}`,

  /* Latin wordmark, Japanese title: this is where a katakana search finds the page. */
  siteTitle: (name: string) => `${name}（イワン・ドルゴフ）— テックリード / フルスタックエンジニア`,

  // Footer
  footerMark: 'END / CONTACT',
  footerHeading: '設計や開発が必要なシステムがあれば、ご連絡ください。',
  footerEmail: 'メール',
  footerGithub: 'GitHub',
  footerLinkedin: 'LinkedIn',
  footerBase: '拠点',
  footerColophon: '静的HTML · Astro · クライアントJavaScriptなし',
  footerCopyright: (year: number, name: string) => `© ${year} ${name}`,

  // Shared metadata labels
  labelRole: '役割',
  labelOrganization: '所属',
  labelOrganizationShort: '所属',
  labelPeriod: '期間',
  labelStatus: '状況',
  labelEngagement: '契約形態',
  labelTeam: '体制',
  labelDomain: '領域',
  labelStack: '技術',
  labelId: 'ID',
  labelProject: 'プロジェクト',
  selectedWork: '主な実績',

  // Work vocabulary
  workStatus: { active: '進行中', complete: '完了' },
  workDepth: { brief: '概要', 'case-study': 'ケーススタディ' },
  workRead: { brief: '概要を読む', 'case-study': 'ケーススタディを読む' },
  engagement: { contract: '業務委託', freelance: 'フリーランス' },

  /* 現在 for an open period; counters are invariant, so no plural rules anywhere. */
  dates: {
    present: '現在',
    year: (count: number) => `${count}年`,
    month: (count: number) => `${count}か月`,
    /** Japanese runs the parts together: 1年11か月, not 1年 11か月. */
    separator: '',
  },

  // Home
  homeDescription: (descriptor: string, promise: string) => `東京在住の${descriptor}。${promise}`,
  heroSheet: 'SHEET 00 / プロフィール',
  heroProfileSummary: 'プロフィール概要',
  heroCurrent: '現職',
  heroExperience: '経験年数',
  heroBase: '拠点',
  heroLanguages: '言語',
  heroStatus: '状況',
  homeWorkNote:
    '新しいプロジェクトから順に並べています。ケーススタディでは判断の理由まで、概要では公開できる役割・担当範囲・システムの事実のみを記載しています。',
  homeAllWork: 'すべての実績',
  homeChronology: '経歴の全体',
  homeCapabilitiesTitle: '担当領域と根拠',
  homeCapabilitiesNote:
    '印は、その責任範囲を実際に担当したプロジェクトを示します。印がないのは能力がないという意味ではなく、ここでは示していないという意味です。',
  homePrinciplesTitle: '仕事の原則',
  homePractice: (evidence: string) => `実例：${evidence}`,

  // Work index
  workDescription:
    '担当プロジェクト：次世代WMSのアーキテクチャ、AIチャットゲームの0→1開発、梱包業界向けSaaS、5業種のクライアント案件。',
  workSheet: 'SHEET 01 / 実績',
  workTitle: '実績',
  workLead:
    '担当したプロジェクトを、新しいものから順に掲載しています。ケーススタディでは背景・技術判断・進め方・今なら変える点まで、概要では公開できる役割・担当範囲・システムの事実のみを記載し、公開可能な範囲が広がり次第、追記しています。',
  workIndexHeading: 'プロジェクト一覧',

  // Case study
  studyDetails: 'プロジェクト情報',
  studySections: 'セクション',
  studyContents: '目次',
  studyContext: '補足',
  studyMoreWork: 'ほかの実績',
  studyBriefNote:
    'このページには、公開できる役割・担当範囲・システムの事実のみを記載しています。技術判断や成果は掲載していません。',
  pagerPrevious: (code: string) => `← 前 · ${code}`,
  pagerNext: (code: string) => `次 · ${code} →`,

  // Experience
  experienceDescription: (name: string) =>
    `${name}の経歴：2021年以降のテックリード、プロジェクトリード、フルスタックエンジニアとしての実績、学歴と資格。`,
  experienceSheet: 'SHEET 02 / 経歴',
  experienceTitle: '経歴',
  experienceLead: (experience: string, location: string) =>
    `テックリード、業務委託でのプロダクト開発、クライアント案件、個人での受託を通じて${experience}。拠点は${location}。`,
  chronologyTitle: '時系列',
  chronologyNote: '担当範囲は現行の職務経歴書の記載に基づきます。',
  credentialsTitle: '学歴と資格',
  educationLabel: '学歴',
  certificationsLabel: '資格',
  languagesLabel: '言語',
  timelineFigure: 'FIG. 1',
  timelineCaption:
    'プロジェクトの時系列。業務委託の案件はほかの役割と並行しており、詳細は下の一覧に記載しています。',
  timelineNow: '現在',

  // About
  aboutDescription: (name: string) =>
    `${name}は東京を拠点とするテックリード兼フルスタックエンジニア。ロシア語・日本語・英語で業務を行っています。`,
  aboutSheet: 'SHEET 03 / プロフィール',
  aboutTitle: 'プロフィール',
  aboutLead:
    '東京を拠点とするテックリード兼フルスタックエンジニア。要件定義、アーキテクチャ、実装、リリースまで一貫して担当しています。',
  aboutBackgroundTitle: 'これまで',
  aboutLanguagesTitle: '言語',
  aboutLanguagesNote:
    '普段は日本企業の開発現場で日本語を使って仕事をしています。英語とロシア語でも、同じように技術的な業務を進められます。',
  aboutEngageTitle: 'ご相談について',

  // Résumé
  resumeDescription: (name: string) =>
    `${name}の経歴書：東京を拠点とするテックリード兼フルスタックエンジニアの実績、技術、学歴、資格、言語。`,
  resumeSheet: (revision: string) => `経歴書 · REV. ${revision}`,
  /* The published PDF is English; saying so is the first thing a Japanese recruiter needs to know. */
  resumeDownload: 'CV（英語）をダウンロード',
  resumeSummaryHeading: '概要',
  resumeSummary: (experience: string) =>
    `テックリード兼フルスタックエンジニア（経験${experience}）。React、TypeScript、Go、AWSを用いたWebシステムについて、技術計画とアーキテクチャ、要件定義、コードレビュー、リリースまでを主に企業システムの文脈で担当。現在は物流分野の倉庫管理システムでテックリードを務めています。`,
  resumeExperienceHeading: '経歴',
  resumeTechnologiesHeading: '技術',
  resumeCredentialsHeading: '学歴と資格',
  resumeLanguagesHeading: '言語',

  // Lab and Notes
  labDescription: (name: string) => `${name}による公開コード、プロトタイプ、実験。`,
  labSheet: 'LAB / 未公開',
  labTitle: 'ラボ',
  labLead: '公開しているコード、プロトタイプ、実験。',
  labEntriesHeading: '一覧',
  labStatus: { active: '進行中', complete: '完了', archived: 'アーカイブ' },
  labRepository: 'リポジトリ',
  labDemo: 'デモ',
  labEmpty: '公開中の項目はまだありません。',
  notesDescription: (name: string) => `${name}によるエンジニアリングとアーキテクチャに関する記事。`,
  notesSheet: 'NOTES / 未公開',
  notesTitle: 'ノート',
  notesLead: 'エンジニアリングとアーキテクチャについて。',
  notesArticlesHeading: '記事',
  notesEmpty: '公開中の記事はまだありません。',

  // 404
  notFoundTitle: 'ページが見つかりません',
  notFoundDescription: 'お探しのページは存在しません。',
  notFoundStatus: 'STATUS 404 / ルートが見つかりません',
  notFoundHeading: 'このアドレスにページはありません。',
  notFoundLead: 'リンクが古いか、ページが移動した可能性があります。',
  notFoundRoutes: '次に進む',
  notFoundHome: 'ホーム',

  // Diagrams
  flowFigure: 'FIG. 1',
  flowCaption: 'システムのライフサイクルのどこを担当してきたか、そしてそれを示すプロジェクト。',
  flowEvidence: '該当プロジェクト：',
  matrixCaption: '担当領域と、それを示す主な実績',
  matrixCapability: '担当領域',
  matrixYes: 'あり',
  matrixNo: 'なし',

  /* Delivery-flow stages, keyed by `src/data/delivery-flow.ts` ids. */
  deliveryFlow: {
    requirements: {
      stage: '要件定義',
      detail: 'システムが何をすべきかをクライアントと定義し、文書化する',
    },
    architecture: {
      stage: 'アーキテクチャ',
      detail: '技術方針を決め、リスクの高い部分を先に検証する',
    },
    implementation: {
      stage: '実装',
      detail: 'クライアント、サービス、インフラを構築する',
    },
    release: {
      stage: 'リリース',
      detail: 'コードレビュー、開発標準の整備、リリースの実行',
    },
    operation: {
      stage: '運用',
      detail: '動かし続ける：パフォーマンス、マイグレーション、本番サポート',
    },
  },

  /* Capability vocabulary, keyed by `src/data/capabilities.ts` ids. */
  capabilities: {
    requirements: {
      label: '要件定義とクライアント折衝',
      detail: 'システムが何をすべきかをクライアントと定義し、文書化する',
    },
    architecture: {
      label: 'アーキテクチャと技術選定',
      detail: '技術計画と技術選定の判断',
    },
    leadership: {
      label: 'プロジェクト推進',
      detail: '開発チームの計画と調整',
    },
    frontend: { label: 'フロントエンド開発', detail: 'Webおよびモバイルのクライアント開発' },
    backend: { label: 'バックエンドとAPI', detail: 'サーバーサイドのサービスとAPI' },
    cloud: { label: 'クラウドインフラ', detail: 'AWS上のインフラ構築とデプロイ' },
    security: {
      label: '認証とセキュリティ',
      detail: '認証・認可・セキュリティをアーキテクチャの一部として扱う',
    },
    integration: { label: 'システム連携', detail: 'WMS／WCS連携の設計' },
    standards: {
      label: '開発標準とコードレビュー',
      detail: '開発ガイドライン、アーキテクチャ標準、コードレビュー',
    },
    release: {
      label: 'リリースと本番サポート',
      detail: '変更を本番へ届け、そこで支え続ける',
    },
  },

  annotationAbout: (term: string) => `${term}について`,

  /* Glossary wording; sources are in `src/data/glossary.ts`. */
  glossary: {
    'daiwa-house':
      '日本の建設・不動産グループ。売上高5兆5,768億円、Fortune Global 500に17年連続で選出。',
    frameworx:
      '大和ハウスグループの企業。2007年設立で、物流システム（倉庫管理・倉庫制御）と物流コンサルティングを手がける。',
    wms: '倉庫管理システム。入荷・検品・保管・棚卸・出荷といった倉庫内の作業を管理し、作業者に指示を出す。',
    wcs: '倉庫制御システム。物流センター内の自動化設備や機械を直接制御する。作業と人を管理するWMSとは役割が異なる。',
    'logistics-shortage':
      '国土交通省の試算では、対策を取らない場合、営業用トラックの輸送能力が2024年に14.2％、2030年に34.1％不足する可能性がある。',
    'ipa-exams':
      '情報処理推進機構（IPA）が実施する国家試験。経済産業省のもとで、情報処理技術者としての知識・技能の水準を認定する。',
    'jlpt-n1':
      '日本語能力試験の最上位レベル。幅広い場面で使われる日本語を理解できることを認定する。',
    globis: '東京のビジネススクール。日本語・英語のMBAプログラムの在校生と修了生は約13,180名。',
    'matsuo-lab':
      '東京大学のディープラーニング研究室。寄付講座「グローバル消費インテリジェンス（GCI）」でデータサイエンスとAIの基礎を扱う。',
  },

  /* How each glossary term is named in running text; the gloss itself is in `glossary`. */
  glossaryTerm: {
    'daiwa-house': '大和ハウスグループ',
    frameworx: 'フレームワークス',
    wms: 'WMS',
    wcs: 'WCS',
    'logistics-shortage': '物流の輸送能力',
    'ipa-exams': 'IPA試験',
    'jlpt-n1': 'JLPT N1',
    globis: 'グロービス経営大学院',
    'matsuo-lab': '松尾・岩澤研究室',
  },

  environmentsInOrder: (unit: string) => `${unit}の環境（デプロイ順）`,

  /* Wording of the profile; the facts are in `src/data/profile.ts`. */
  profile: {
    nameReading: 'イワン・ドルゴフ',
    supportingLine: 'Webシステム · アーキテクチャ · クラウド · 企業システム',
    promise: '複雑なWebシステムを、要件定義とアーキテクチャから本番運用まで設計し、形にします。',
    experience: '5年以上',
    location: '東京',
    availability:
      '個別のコンサルティング・業務委託のご相談を承ります。東京からのリモート、または海外チームとの協働。',
    languages: {
      RU: { name: 'ロシア語', level: 'ネイティブ' },
      JA: { name: '日本語', level: 'ビジネスレベル（JLPT N1）' },
      EN: { name: '英語', level: 'ビジネスレベル' },
    },
    education: {
      mba: { title: 'MBA', institution: 'グロービス経営大学院', status: '在学中' },
      gci: {
        title: 'グローバル消費インテリジェンス寄付講座（GCI）',
        institution: '東京大学 松尾・岩澤研究室',
        status: '受講中',
      },
    },
    certifications: {
      fe: { title: '基本情報技術者試験' },
      ism: { title: '情報セキュリティマネジメント試験' },
      jlpt: { title: '日本語能力試験 N1' },
    },
  },
};
