# Résumé PDF

Place the PDF résumé at `public/resume/ivan-dolgov-cv.pdf`.

The `/resume` page checks for that exact path at build time (`src/utils/resume.ts`) and renders the
download link only when the file exists, so a missing PDF never ships as a broken link.

This note lives outside `public/` because everything in `public/` is copied verbatim into the
published site.
