# Content Model

Use Astro Content Collections with schema validation.

## Work item

Required fields:

```yaml
title:
slug:
summary:
role:
engagementType:
startDate:
endDate:
status:
domains: []
capabilities: []
technologies: []
featured: false
publicVisibility: public | anonymized | private
heroVariant:
```

Optional fields:

```yaml
organization:
teamSize:
links:
metrics:
ndaNotes:
```

The body follows the case-study model in `.ai/content/case-study-template.md`.

## Lab item

```yaml
title:
slug:
summary:
status: active | complete | archived
technologies: []
repository:
demo:
date:
featured: false
```

## Note

```yaml
title:
slug:
summary:
publishedAt:
updatedAt:
topics: []
draft: true
```

## Content rules

- Validate every entry at build time.
- Store dates as ISO values; format them in the presentation layer.
- Keep data and layout separate.
- Support anonymized case studies without fake company names.
- Do not put secrets or private NDA notes into a public repository.
- Any metric must carry an internal source note during drafting, even if the source note is removed from public output.

