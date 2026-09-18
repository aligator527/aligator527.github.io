import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const RESUME_PDF_PATH = 'resume/ivan-dolgov-cv.pdf';

/**
 * The PDF is supplied manually, so pages check for it at build time: rendering a download link to
 * a missing file would ship a broken link.
 *
 * The directory is resolved from the project root rather than from `import.meta.url`, because this
 * module is bundled before it runs and its own URL no longer points inside `src/`.
 */
export function hasResumePdf(
  publicDir: URL = new URL('public/', pathToFileURL(`${process.cwd()}/`)),
): boolean {
  return existsSync(fileURLToPath(new URL(RESUME_PDF_PATH, publicDir)));
}
