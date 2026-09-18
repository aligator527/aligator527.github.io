import { existsSync } from 'node:fs';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { RESUME_PDF_PATH, hasResumePdf } from '../../src/utils/resume';

async function publicDir(): Promise<URL> {
  const dir = await mkdtemp(join(tmpdir(), 'resume-'));
  return pathToFileURL(`${dir}/`);
}

describe('hasResumePdf', () => {
  it('reports false while the PDF has not been supplied', async () => {
    expect(hasResumePdf(await publicDir())).toBe(false);
  });

  it('reports true once the expected file exists', async () => {
    const dir = await publicDir();
    await mkdir(new URL('resume/', dir), { recursive: true });
    await writeFile(new URL(RESUME_PDF_PATH, dir), 'pdf');
    expect(hasResumePdf(dir)).toBe(true);
  });

  it('looks for the exact filename the résumé page links to', () => {
    expect(RESUME_PDF_PATH).toBe('resume/ivan-dolgov-cv.pdf');
  });
});

describe('hasResumePdf default location', () => {
  it('resolves against the project root, not this module', () => {
    // Regression guard: resolving from `import.meta.url` silently failed in the bundled build,
    // so the download link never appeared even when the file was present.
    const publicDir = new URL('public/', pathToFileURL(`${process.cwd()}/`));
    expect(hasResumePdf(publicDir)).toBe(
      existsSync(fileURLToPath(new URL(RESUME_PDF_PATH, publicDir))),
    );
  });
});
