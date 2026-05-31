import type { AstroIntegration } from 'astro';
import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

/**
 * LOGIC LAYER — cross-collection integrity.
 *
 * Zod validates each content file in isolation. It cannot see that a reference
 * file points at a structure that doesn't exist, or that a `viz` name has no
 * component. This integration walks the filesystem and asserts the joins,
 * failing the build (and dev) on any violation. It runs in `astro:config:done`
 * so a broken join is caught locally AND in CI — it cannot be bypassed by a CI
 * step that calls `astro build` directly.
 *
 * Checks:
 *   1. structure frontmatter `slug` === filename id   (no two-sources-of-truth drift)
 *   2. no duplicate structure slugs
 *   3. every reference file's `structure` === its filename id, and points at a real structure
 *   4. every non-null `viz` resolves to src/components/viz/<Name>.{tsx,jsx}
 *   5. (warning) structure with no reference file
 *
 * The frontmatter parse here is intentionally minimal — it reads only the two
 * scalar keys it needs (`slug`, `viz`). Full schema validation is Zod's job.
 */

const STRUCT_DIR = 'src/content/structures';
const REF_DIR = 'src/content/references';
const VIZ_DIR = 'src/components/viz';

function frontmatterScalar(md: string, key: string): string | undefined {
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return undefined;
  for (const line of fm[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (m && m[1] === key) {
      return m[2].trim().replace(/^["']|["']$/g, '');
    }
  }
  return undefined;
}

async function listFiles(dir: string, ext: string): Promise<string[]> {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter((e) => e.isFile() && e.name.endsWith(ext)).map((e) => e.name);
}

async function runIntegrityCheck(root: string): Promise<{ errors: string[]; warnings: string[] }> {
  const errors: string[] = [];
  const warnings: string[] = [];

  const structDir = path.join(root, STRUCT_DIR);
  const refDir = path.join(root, REF_DIR);
  const vizDir = path.join(root, VIZ_DIR);

  // 1 + 2: structures
  const slugs = new Set<string>();
  const vizByStructure = new Map<string, string>(); // slug -> viz name
  for (const file of await listFiles(structDir, '.md')) {
    const id = file.replace(/\.md$/, '');
    const body = await readFile(path.join(structDir, file), 'utf8');
    const slug = frontmatterScalar(body, 'slug');
    if (slug === undefined) {
      errors.push(`${STRUCT_DIR}/${file}: missing "slug" in frontmatter.`);
    } else if (slug !== id) {
      errors.push(`${STRUCT_DIR}/${file}: frontmatter slug "${slug}" must equal filename "${id}".`);
    }
    const key = slug ?? id;
    if (slugs.has(key)) errors.push(`Duplicate structure slug "${key}".`);
    slugs.add(key);

    const viz = frontmatterScalar(body, 'viz');
    if (viz && viz !== 'null') vizByStructure.set(key, viz);
  }

  // 3: references join back to a real structure
  const haveRefs = new Set<string>();
  for (const file of await listFiles(refDir, '.json')) {
    const id = file.replace(/\.json$/, '');
    let data: { structure?: string };
    try {
      data = JSON.parse(await readFile(path.join(refDir, file), 'utf8'));
    } catch (e) {
      errors.push(`${REF_DIR}/${file}: invalid JSON (${(e as Error).message}).`);
      continue;
    }
    if (data.structure !== id) {
      errors.push(`${REF_DIR}/${file}: "structure" is "${data.structure}" but filename is "${id}".`);
    }
    if (data.structure && !slugs.has(data.structure)) {
      errors.push(`${REF_DIR}/${file}: references unknown structure "${data.structure}" (orphan).`);
    }
    if (data.structure) haveRefs.add(data.structure);
  }

  // 4: viz component exists
  for (const [slug, viz] of vizByStructure) {
    const tsx = path.join(vizDir, `${viz}.tsx`);
    const jsx = path.join(vizDir, `${viz}.jsx`);
    if (!existsSync(tsx) && !existsSync(jsx)) {
      errors.push(`Structure "${slug}" sets viz "${viz}" but ${VIZ_DIR}/${viz}.tsx does not exist.`);
    }
  }

  // 5: warn on missing references
  for (const slug of slugs) {
    if (!haveRefs.has(slug)) {
      warnings.push(`Structure "${slug}" has no reference file (${REF_DIR}/${slug}.json).`);
    }
  }

  return { errors, warnings };
}

export function integrityCheck(): AstroIntegration {
  return {
    name: 'realworlddsalgo:integrity-check',
    hooks: {
      'astro:config:done': async ({ config, logger }) => {
        const root = config.root.pathname;
        const { errors, warnings } = await runIntegrityCheck(root);
        for (const w of warnings) logger.warn(w);
        if (errors.length) {
          for (const e of errors) logger.error(e);
          throw new Error(
            `Content integrity check failed with ${errors.length} error(s). See above.`,
          );
        }
        logger.info('Content integrity check passed.');
      },
    },
  };
}

// Exposed for unit tests so the join logic can be exercised against fixtures
// without spinning up Astro.
export { runIntegrityCheck };
