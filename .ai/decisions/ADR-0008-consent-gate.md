# ADR-0008: Nothing third-party loads before consent

Status: Accepted
Date: 2026-10-24
Amends: ADR-0007

## Context

ADR-0007 shipped GA4 and recorded the obligation it opened: the tag sets `_ga` cookies, the site had
no consent gate and no privacy page, and under ePrivacy and the GDPR that is a real duty towards EU
and UK visitors rather than a nicety. Recording an open obligation is not discharging one, and Ivan
asked for it closed.

Two things constrain the answer. The site's own claim — `.ai/engineering/architecture.md`, and until
now the footer colophon — is zero client JavaScript; a consent gate is script by definition. And the
privacy page is the one page on this site where a translation that hedges differently from the
English is a different legal statement, which `.ai/content/translation.md` already treats as a
build-breaking class of error.

## Decision

**Nothing loads before consent.** The gtag.js loader is not in the page waiting for a signal; it is
injected by `grant()` and by nothing else. `src/components/core/ConsentNotice.astro` owns the choice,
the loader and the cookie cleanup.

**Advertising is refused permanently.** The default consent call denies `ad_storage`, `ad_user_data`
and `ad_personalization` and never updates them, so "measurement, not advertising" is a property of
this repository rather than a promise made on Google's behalf.

**The notice is in flow, at the top of `<body>`, before the header.** Not fixed to the bottom: a
keyboard reader reaches the choice immediately, nothing is obscured at 320px or 200% zoom, and a
notice at the head of the sheet is this site's grammar rather than the floating bar every other site
has. Both buttons are the same control, differing only in label — declining has to be as easy as
allowing.

**The answer lives in `localStorage` under `analytics-consent`**, not in a cookie: remembering a
consent decision is covered by the strictly-necessary exemption, and a key that never leaves the
browser is easier to say that about.

**`/privacy/` exists in all three locales**, states what is collected and for how long, and carries
the control that withdraws consent — which deletes the `_ga` cookies and reloads without the script.
Withdrawal has to be as easy as consent, so it is a button on a page the footer links from every
page, not an email request.

**The gate installs one global, `window.__consentGate`.** The frontend rules ask for an ADR before a
global client store; this is it. The privacy page's control reads and writes through that object
instead of keeping its own copy of the key and the loader, because the page offering to withdraw
consent must not be able to disagree with the gate about what consent means.

## Alternatives

- **Consent Mode v2 with `wait_for_update`.** The documented Google pattern: load gtag.js
  immediately, default every category to denied, update on consent. It still loads a third-party
  script and still measures in a cookieless, modelled mode before anyone agrees. Defensible, and
  arguably compliant since nothing is stored — but it costs a paragraph of explanation that the
  privacy page would then owe the reader, and "your browser makes no request to Google until you
  allow it" is a sentence worth more than the modelled traffic.
- **A third-party consent platform.** A CMP is a dependency, a second third party, and usually its
  own tracking. For one vendor and one category, it is more surface than the thing it governs.
- **Cookieless analytics instead (Plausible, Umami).** Still the fallback ADR-0007 named, and it
  removes the obligation rather than discharging it. Rejected for now because the GA4 property
  exists and the gate is a day's work; revisit if a banner proves to cost more traffic than the data
  is worth.
- **A fixed bottom bar.** The default, and the reason it is the default is that it is easy, not that
  it is good: it overlays content, it is last in tab order, and at 320px it eats a third of the
  viewport.
- **Leaving it as ADR-0007 left it.** Measurement without consent, documented. Not a defensible
  position for a site whose own pitch is that its author makes deliberate decisions.

## Consequences

- The site ships client JavaScript for the first time: one inline script, no bundle, only in a build
  with `ANALYTICS=on`. The footer colophon changed from "no client JavaScript" to "no script without
  consent" in all three locales, because the old line is no longer true of the deployed site.
- Measurement now covers consenting visitors only. Every number in the property is a floor, not a
  count, and comparing it with anything from before 2026-10-24 compares two different populations.
- The Playwright build is now `ANALYTICS=on`, so the tested shape is the deployed shape, and the
  notice is covered by axe, the locale leak check and all three viewports. `e2e/consent.spec.ts`
  aborts Google's loader in every test: a suite that granted consent for real would send a hit from
  every CI run into the live property.
- `requests no script, from anywhere, before consent` keeps the strict empty-list assertion it had
  as the zero-bundle test, and now carries the gate's promise as well.
- The retention period on the privacy page (14 months, confirmed by Ivan on 2026-10-24) is a setting
  that can be changed in the GA4 admin without touching this repository. `RETENTION_MONTHS` in
  `src/data/analytics.ts` is the single place the page reads it from, and a unit test rejects any
  value GA4 cannot be set to.
- Without JavaScript there is no gate, no loader and no measurement. The privacy page says so, and
  the notice stays hidden rather than offering a choice nothing can record.

## Revisit when

- The GA4 retention setting changes, or the property is replaced.
- A second script needs to load. The gate assumes one vendor and one category.
- Google changes the snippet or the consent API.
- EU and UK traffic grows enough that the measured share matters: that is the point at which
  cookieless analytics stops being a fallback and starts being the better instrument.
