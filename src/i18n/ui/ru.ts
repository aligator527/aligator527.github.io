import type { Dictionary } from './en';

/**
 * Russian UI chrome.
 *
 * Translation decisions worth knowing before editing, in the order they bite:
 *
 * - **Job titles stay Latin.** `Tech Lead`, `Full-Stack Engineer`, `Project Lead`. Russian
 *   engineers write them that way, and the Russian renderings available — «технический
 *   руководитель», «ведущий разработчик» — either inflate the role towards CTO or deflate it
 *   towards implementation. `.ai/content/voice.md` warns about exactly this.
 * - **Technology-area names stay Latin** (`Frontend`, `Backend`, `Cloud & infrastructure`), by the
 *   author's decision. They live in `src/data/profile.ts`, not here.
 * - **The annotation grammar is translated, the notation is not.** `Sheet 00` becomes «Лист 00»,
 *   `REV.` becomes «РЕД.», but numbers, project IDs (`P01`) and layer IDs (`L1`) are notation and
 *   stay as they are. `.ai/design/art-direction.md` treats them as a coordinate system, and a
 *   coordinate system that changes per locale is not one.
 * - **Case study / brief.** «Кейс» and «Справка». «Кейс» is what Russian-speaking engineers
 *   actually call it; «разбор» reads as a post-mortem, which these are not.
 * - **Durations are invariant abbreviations** («2 г.», «11 мес.»), so Russian's three plural forms
 *   never arise. See `dates` below.
 */
export const ru: Dictionary = {
  // Chrome
  skipToContent: 'К содержимому',
  navLanguage: 'Язык',
  navPrimary: 'Основная навигация',
  navWork: 'Проекты',
  navLab: 'Лаборатория',
  navExperience: 'Опыт',
  navNotes: 'Заметки',
  navAbout: 'Обо мне',
  navResume: 'Резюме',
  revision: (month: string) => `Ред. ${month}`,

  siteTitle: (name: string, descriptor: string) => `${name} (Иван Долгов) — ${descriptor}`,

  // Footer
  footerMark: 'КОНЕЦ / КОНТАКТЫ',
  footerHeading:
    'Если у вас есть система, которую нужно спроектировать или довести до продакшена, напишите мне.',
  footerEmail: 'Почта',
  footerGithub: 'GitHub',
  footerLinkedin: 'LinkedIn',
  footerBase: 'Город',
  footerColophon: 'Статический HTML · Astro · без клиентского JavaScript',
  footerCopyright: (year: number, name: string) => `© ${year} ${name}`,

  organizationNote: (note: string) => ` (${note})`,

  // Shared metadata labels
  labelRole: 'Роль',
  labelOrganization: 'Организация',
  labelOrganizationShort: 'Орг.',
  labelPeriod: 'Период',
  labelStatus: 'Статус',
  labelEngagement: 'Формат',
  labelTeam: 'Команда',
  labelDomain: 'Область',
  labelStack: 'Стек',
  labelId: 'ID',
  labelProject: 'Проект',
  selectedWork: 'Избранные проекты',

  // Work vocabulary
  workStatus: { active: 'В работе', complete: 'Завершён' },
  workDepth: { brief: 'Справка', 'case-study': 'Кейс' },
  workRead: { brief: 'Открыть справку', 'case-study': 'Читать кейс' },
  engagement: { contract: 'Контракт', freelance: 'Фриланс' },

  /*
   * «наст. вр.» is how a Russian CV ends an open-ended period. The year and month abbreviations are
   * invariant by design: «1 г.», «2 г.», «5 г.» are all correct as abbreviations, which is how
   * Russian's one/few/many forms are avoided without a plural-rule library.
   */
  dates: {
    present: 'наст. вр.',
    year: (count: number) => `${count} г.`,
    month: (count: number) => `${count} мес.`,
    separator: ' ',
  },

  // Home
  homeDescription: (descriptor: string, promise: string) => `${descriptor}, Токио. ${promise}`,
  heroSheet: 'Лист 00 / Профиль',
  heroProfileSummary: 'Краткий профиль',
  heroCurrent: 'Сейчас',
  heroExperience: 'Опыт',
  heroBase: 'Город',
  heroLanguages: 'Языки',
  heroStatus: 'Статус',
  homeWorkNote:
    'Сначала недавнее. Кейсы объясняют решения; справки излагают только роль, объём работ и факты о системе, которые можно публиковать.',
  homeAllWork: 'Все проекты',
  homeChronology: 'Полная хронология',
  homeCapabilitiesTitle: 'Компетенции и подтверждения',
  homeCapabilitiesNote:
    'Каждая отметка указывает на проект, где эта зона ответственности документирована. Отсутствие отметки не означает неумения — только то, что здесь это не показано.',
  homePrinciplesTitle: 'Принципы работы',
  homePractice: (evidence: string) => `На практике: ${evidence}`,

  // Work index
  workDescription:
    'Профессиональные проекты: архитектура системы управления складом, запуск платформы AI-чат-игры с нуля, промышленный SaaS для упаковочной отрасли и пять клиентских проектов в пяти отраслях.',
  workSheet: 'Лист 01 / Проекты',
  workTitle: 'Проекты',
  workLead:
    'Профессиональные проекты, сначала недавние. Кейсы описывают контекст, решения, ход работы и то, что я сделал бы иначе. Справки излагают только роль, объём работ и факты о системе, которые можно публиковать, и дополняются по мере того, как что-то ещё удаётся согласовать.',
  workIndexHeading: 'Указатель проектов',

  // Case study
  studyDetails: 'Детали проекта',
  studySections: 'Разделы',
  studyContents: 'Содержание',
  studyMoreWork: 'Другие проекты',
  studyBriefNote:
    'Эта страница содержит только проверенные факты о роли, объёме работ и системе. Решения и результаты здесь не публикуются.',
  pagerPrevious: (code: string) => `← Предыдущий · ${code}`,
  pagerNext: (code: string) => `Следующий · ${code} →`,

  // Experience
  experienceDescription: (name: string) =>
    `Хронология карьеры: ${name} — Tech Lead, руководитель проектов и full-stack инженер с 2021 года, образование и сертификаты.`,
  experienceSheet: 'Лист 02 / Опыт',
  experienceTitle: 'Опыт',
  experienceLead: (experience: string, location: string) =>
    `${experience} технического руководства, продуктовой работы по контракту, клиентской разработки и самостоятельной практики. Город: ${location}.`,
  chronologyTitle: 'Хронология',
  chronologyNote: 'Объём работ — как он указан в моём текущем резюме.',
  credentialsTitle: 'Образование и сертификаты',
  educationLabel: 'Образование',
  certificationsLabel: 'Сертификаты',
  languagesLabel: 'Языки',
  timelineFigure: 'Рис. 1',
  timelineCaption:
    'Проекты во времени. Контрактная работа пересекалась с другими ролями; хронология ниже перечисляет каждую полностью.',
  timelineNow: 'Сейчас',

  // About
  aboutDescription: (name: string) =>
    `${name} — Tech Lead и full-stack инженер в Токио; работает на русском, японском и английском.`,
  aboutSheet: 'Лист 03 / Обо мне',
  aboutTitle: 'Обо мне',
  aboutLead:
    'Tech Lead и full-stack инженер в Токио. Работаю на всём пути: требования, архитектура, реализация, релиз.',
  aboutBackgroundTitle: 'Путь',
  aboutLanguagesTitle: 'Языки',
  aboutLanguagesNote:
    'Моя повседневная рабочая среда — японская корпоративная разработка; техническую работу я так же веду на английском или русском.',
  aboutEngageTitle: 'Как поработать вместе',

  // Résumé
  resumeDescription: (name: string) =>
    `Резюме: ${name}, Tech Lead и full-stack инженер в Токио — опыт, технологии, образование, сертификаты и языки.`,
  resumeSheet: (revision: string) => `Резюме · Ред. ${revision}`,
  resumeDownload: 'Скачать PDF (англ.)',
  resumeSummaryHeading: 'Кратко',
  resumeSummary: (experience: string) =>
    `Tech Lead и full-stack инженер, опыт — ${experience}. Техническое планирование и архитектура, определение требований, код-ревью и выпуск веб-систем на React, TypeScript, Go и AWS, в основном в корпоративном контексте. Сейчас — Tech Lead системы управления складом в логистике.`,
  resumeExperienceHeading: 'Опыт',
  resumeTechnologiesHeading: 'Технологии',
  resumeCredentialsHeading: 'Образование и сертификаты',
  resumeLanguagesHeading: 'Языки',

  // Lab and Notes
  labDescription: (name: string) => `Открытый код, прототипы и эксперименты: ${name}.`,
  labSheet: 'Лаборатория / Не опубликовано',
  labTitle: 'Лаборатория',
  labLead: 'Открытый код, прототипы и эксперименты.',
  labEntriesHeading: 'Записи',
  labStatus: { active: 'В работе', complete: 'Завершён', archived: 'В архиве' },
  labRepository: 'Репозиторий',
  labDemo: 'Демо',
  labEmpty: 'Пока нет публичных записей.',
  notesDescription: (name: string) => `Тексты об инженерии и архитектуре: ${name}.`,
  notesSheet: 'Заметки / Не опубликовано',
  notesTitle: 'Заметки',
  notesLead: 'Тексты об инженерии и архитектуре.',
  notesArticlesHeading: 'Статьи',
  notesEmpty: 'Пока нет опубликованных заметок.',

  // 404
  notFoundTitle: 'Страница не найдена',
  notFoundDescription: 'Запрошенной страницы не существует.',
  notFoundStatus: 'Статус 404 / Маршрут не найден',
  notFoundHeading: 'По этому адресу страницы нет.',
  notFoundLead: 'Возможно, ссылка устарела или страница переехала.',
  notFoundRoutes: 'Куда перейти',
  notFoundHome: 'Главная',

  /* Wording of the profile; the facts are in `src/data/profile.ts`. Institution names take their
     established Russian forms, and the two IPA examinations keep their English names in brackets —
     that is how a Russian-language CV cites a Japanese national certification. */
  profile: {
    nameReading: 'Иван Долгов',
    supportingLine: 'Веб-системы · архитектура · облако · корпоративное ПО',
    promise:
      'Проектирую и довожу до продакшена сложные веб-системы — от требований и архитектуры до эксплуатации.',
    experience: '5+ лет',
    location: 'Токио, Япония',
    availability:
      'Рассматриваю отдельные проекты — консалтинг и работа по контракту: удалённо из Токио или с зарубежными командами.',
    languages: {
      RU: { name: 'Русский', level: 'Родной' },
      JA: { name: 'Японский', level: 'Свободный рабочий уровень (JLPT N1)' },
      EN: { name: 'Английский', level: 'Свободный рабочий уровень' },
    },
    education: {
      mba: { title: 'MBA', institution: 'Бизнес-школа GLOBIS', status: 'Учусь сейчас' },
      gci: {
        title: 'Программа Global Consumer Intelligence',
        institution: 'Лаборатория Мацуо–Ивасавы, Токийский университет',
        status: 'Учусь сейчас',
      },
    },
    certifications: {
      fe: {
        title: 'Экзамен на базового ИТ-инженера (Fundamental Information Technology Engineer)',
      },
      ism: {
        title:
          'Экзамен по управлению информационной безопасностью (Information Security Management)',
      },
      jlpt: { title: 'Экзамен по японскому языку JLPT N1' },
    },
  },

  /* Этапы потока работ; ключи — из `src/data/delivery-flow.ts`. */
  deliveryFlow: {
    requirements: {
      stage: 'Требования',
      detail: 'Определить и зафиксировать вместе с клиентом, что система должна делать',
    },
    architecture: {
      stage: 'Архитектура',
      detail: 'Выбрать технический подход и сначала проверить рискованные места',
    },
    implementation: {
      stage: 'Реализация',
      detail: 'Собрать клиентские приложения, сервисы и инфраструктуру',
    },
    release: {
      stage: 'Релиз',
      detail: 'Код-ревью, инженерные стандарты и выпуск в продакшен',
    },
    operation: {
      stage: 'Эксплуатация',
      detail: 'Держать систему живой: производительность, миграции, поддержка в продакшене',
    },
  },

  /* Словарь компетенций; ключи — из `src/data/capabilities.ts`. */
  capabilities: {
    requirements: {
      label: 'Требования и работа с клиентом',
      detail: 'Определить и задокументировать вместе с клиентом, что система должна делать',
    },
    architecture: {
      label: 'Архитектура и выбор технологий',
      detail: 'Техническое планирование и технологические решения',
    },
    leadership: {
      label: 'Руководство проектом',
      detail: 'Планирование и координация команд разработки',
    },
    frontend: { label: 'Фронтенд-разработка', detail: 'Веб- и мобильные клиентские приложения' },
    backend: { label: 'Бэкенд и API', detail: 'Серверные сервисы и API' },
    cloud: { label: 'Облачная инфраструктура', detail: 'Инфраструктура и развёртывание в AWS' },
    security: {
      label: 'Аутентификация и безопасность',
      detail: 'Аутентификация, авторизация и безопасность как часть архитектуры',
    },
    integration: { label: 'Системная интеграция', detail: 'Планирование интеграции WMS/WCS' },
    standards: {
      label: 'Стандарты и код-ревью',
      detail: 'Инженерные гайдлайны, архитектурные стандарты и код-ревью',
    },
    release: {
      label: 'Релизы и поддержка продакшена',
      detail: 'Довести изменения до продакшена и поддерживать их там',
    },
  },

  flowFigure: 'Рис. 1',
  flowCaption: 'Где я работаю в жизненном цикле системы и какие проекты это показывают.',
  flowEvidence: 'Подтверждение: ',
  matrixCaption: 'Компетенции и проекты, которые их подтверждают',
  matrixCapability: 'Компетенция',
  matrixYes: 'Да',
  matrixNo: 'Нет',

  annotationAbout: (term: string) => `Подробнее: ${term}`,

  /* Формулировки пояснений; источники — в `src/data/glossary.ts`. Утверждения, которые организация
     публикует о себе сама без указания метрики («крупнейший застройщик Японии», «ведущий поставщик
     WMS», «крупнейшая бизнес-школа Японии»), сознательно не используются. */
  glossary: {
    'daiwa-house':
      'Японская строительная и девелоперская группа: чистые продажи ¥5,58 трлн, 17 лет подряд в списке Fortune Global 500.',
    frameworx:
      'Компания группы Daiwa House, основана в 2007 году. Специализация — логистические системы: ПО для управления складом и консалтинг.',
    wms: 'Система управления складом ведёт работу внутри склада — приёмка, проверка, хранение, инвентаризация, отгрузка — и выдаёт задания людям.',
    wcs: 'Система управления складским оборудованием управляет техникой напрямую, тогда как WMS управляет процессами и людьми.',
    'logistics-shortage':
      'Минтранс Японии оценил, что без мер провозная способность грузовиков может недобрать 14,2% в 2024 году и 34,1% к 2030-му.',
    'ipa-exams':
      'Государственный экзамен Японии: проводится агентством IPA под эгидой министерства экономики и подтверждает уровень ИТ-знаний и навыков.',
    'jlpt-n1':
      'Высший уровень экзамена по японскому языку JLPT: способность понимать японский язык в самых разных ситуациях.',
    globis:
      'Бизнес-школа в Токио; на её программах MBA на японском и английском учились или учатся около 13 180 человек.',
    'matsuo-lab':
      'Лаборатория глубокого обучения Токийского университета. Её курс Global Consumer Intelligence обучает основам ИИ и работе с данными.',
  },

  studyContext: 'Контекст',
  /* Как термин назван в тексте; само пояснение — в `glossary`. */
  glossaryTerm: {
    'daiwa-house': 'Группа Daiwa House',
    frameworx: 'Frameworx',
    wms: 'WMS',
    wcs: 'WCS',
    'logistics-shortage': 'Логистика Японии',
    'ipa-exams': 'Экзамены IPA',
    'jlpt-n1': 'JLPT N1',
    globis: 'Бизнес-школа GLOBIS',
    'matsuo-lab': 'Лаборатория Мацуо–Ивасавы',
  },

  // Diagrams
  environmentsInOrder: (unit: string) => `${unit}: окружения в порядке продвижения`,
};
