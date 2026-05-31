import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * DATA LAYER (box 1 of 3: data / template / logic).
 *
 * Two collections, joined by slug:
 *
 *   structures/<slug>.md      ──slug──▶   references/<slug>.json
 *   (prose + metadata)                    (curated real-world links)
 *
 * The slug is the foreign key. Astro's glob loader derives an entry `id`
 * from the filename; the schema also carries an explicit `slug`. The
 * integrity-check integration (integrations/integrity-check.ts) asserts
 * `slug === id` so the two never drift, and that every reference file's
 * `structure` points at a real structure. Zod validates each file in
 * isolation; the integration validates the cross-collection joins.
 */

const CATEGORIES = [
  'linear',
  'tree',
  'graph',
  'hash',
  'sort',
  'search',
  'string',
  'other',
] as const;

const structures = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/structures' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    category: z.enum(CATEGORIES),
    summary: z.string().max(280),
    // time is a per-operation map ("search" -> "O(log n)"); space is a single
    // bound. Require at least one operation so a structure can't ship an empty
    // complexity table.
    complexity: z.object({
      time: z.record(z.string()).refine((m) => Object.keys(m).length > 0, {
        message: 'complexity.time must list at least one operation',
      }),
      space: z.string(),
    }),
    // Name of the viz island to mount, or null for a page with no animation.
    viz: z.string().nullable(),
    // Optional: language + path of the canonical source rendered on the page.
    source: z
      .object({
        lang: z.string(),
        module: z.string(), // path under src/lib/algorithms, e.g. "bst.ts"
      })
      .optional(),
  }),
});

const referenceEntry = z.object({
  type: z.enum(['implements', 'uses']),
  repo: z.string(), // owner/name
  url: z.string().url(),
  description: z.string(), // one line: why this is a good example
  path: z.string().optional(), // link to the specific file/dir
});

const references = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/references' }),
  // Each file is one entry (id = filename = slug). The glob loader needs
  // object-shaped data, so refs are wrapped in `{ structure, refs }` rather
  // than a bare top-level array. `structure` is the explicit foreign key.
  schema: z.object({
    structure: z.string(),
    refs: z.array(referenceEntry),
  }),
});

export const collections = { structures, references };
export { CATEGORIES };
