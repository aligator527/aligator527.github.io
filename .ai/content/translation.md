# Translation

Three locales: English (source), Russian, Japanese. English is where a fact is written first; the
other two say the same thing in their own language. A translation that is more confident, more
hedged, more specific or more vague than the English is a different claim, and
`.ai/content/claims.md` applies to it in full.

## What is translated, and what is not

| Kind | Rule |
|---|---|
| Prose, headings, labels, metadata values | Translated. |
| Technology names | Latin everywhere: `React`, `DynamoDB`, `Terraform`, `AWS AppSync`. |
| Project IDs, layer IDs, revision markers, dates | Never translated — `P01`, `L1`, `REV.`, `2026/09`. They are a coordinate system, and one that changes per locale is not one. |
| Job titles | Latin in English and Russian. Katakana in Japanese — see below. |
| Technology-area labels (`Frontend`, `Backend`, `Cloud & infrastructure`) | Latin in Russian, by Ivan's decision. Translated in Japanese. |
| Company names | Latin, unless the company publishes its own name in that language. Confirmed names are in `facts.md`; a company name is never guessed at. |
| Scope and responsibility items inside diagrams | Translated. They read as technology names but are prose, which is how `Frontend / Backend / Cloud / Security` stayed English on a Japanese page for one release. |
| `sourceNote` frontmatter | English in every file. It is internal provenance for whoever maintains the entry. |

## Russian

- **Register:** technical Russian written by an engineer for engineers. No канцелярит:
  «осуществлять», «данный», «в рамках», «производить работы», «являлся».
- **Rhythm:** the English is heavy with em dashes. Russian takes fewer — re-punctuate rather than
  transliterating the rhythm.
- **Case study / brief:** «кейс» and «справка».
- **Durations** are invariant abbreviations — «1 г. 11 мес.» — so Russian's three plural forms never
  arise. `наст. вр.` ends an open period.
- **Name:** «Иван Долгов» in the hidden full name and in `Person.alternateName`. The visible
  wordmark stays Latin.

## Japanese

- **Register:** です・ます for prose. 体言止め for labels, table headers and diagram layers.
- **Job titles in katakana:** テックリード, フルスタックエンジニア, プロジェクトリード. Never
  技術責任者, which reads as CTO. Never システムエンジニア or SE, which is a grade term and erases
  architecture scope. Never プロジェクトマネージャー for プロジェクトリード — Ivan reported *to*
  the PM.
- **Terminology:** 要件定義, アーキテクチャ標準化, 開発ガイドライン, 倉庫管理システム（WMS）,
  倉庫制御システム（WCS）, PoC（技術検証）, 新規立ち上げ for 0→1 (not the startup shorthand
  ゼロイチ), 梱包 for this client's industry (not 包装 — they pack and crate for shipment), 案件 for
  a job record, 募集人 for a licensed insurance salesperson, 業務委託 for contract work.
- **Punctuation:** 、。 and ASCII digits. Full-width brackets（）around a parenthetical.
  `・` inside compound nouns.
- **Uppercase does not exist** in kana or kanji, so the uppercase-mono metadata register is a no-op
  on `/ja/`. `.ai/design/typography.md` records what carries that distinction instead.
- **Name:** 「イワン・ドルゴフ」 in the hidden full name, the `<title>`, and `Person.alternateName`.

## How it is enforced

- **Type system.** A dictionary missing a key English has is an `astro check` error.
- **`assertWorkParity()`** fails the build when a translated entry disagrees with English about a
  date, team size, depth, capability set or diagram shape.
- **`assertTranslated()`** fails the build when a *published* locale is missing any translatable
  value in a data file. An unpublished locale falls back to English visibly, which is what makes a
  gap reviewable instead of hidden.
- **`e2e/locale.spec.ts`** fails when a text node on a translated page holds two Latin words in a
  row with no Cyrillic or kana — an untranslated string that a human reader skims past. This is what
  caught the chronology, the principles and the About prose still rendering in English.

## Review protocol

Two passes, kept separate, because a reader checking naturalness does not notice a missing hedge.

1. **Facts.** Against `facts.md`: numbers, dates, team sizes, every hedge («примерно», 約, "during
   the engagement"), every NDA disclaimer, and nothing present that `CLAUDE.local.md` holds back.
2. **Register, read aloud.** Russian: a sentence you could not say out loud is канцелярит.
   Japanese: if it reads like 社内資料 or 就活 copy, reject it.

A locale joins `INDEXABLE_LOCALES` only after both passes. One native proofread of the two long case
studies is worth more than any check in this file: N1 validates meaning and rejects bad register,
but 1,700 words of argued prose is where a non-native author is caught.
