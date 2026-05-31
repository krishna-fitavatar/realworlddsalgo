# TODOS — realworlddsalgo

## Deferred from eng review (2026-05-31)

### Validate the "curated references" moat + define a v2 path for `uses`
- **What:** Before (or alongside) building the v2 auto-suggest pipeline, cheaply validate that people actually want curated real-world references, and design an acquisition path for the `uses` reference type — not just `implements`.
- **Why:** v1 hand-curates references, which is indistinguishable from a gist or markdown list. The differentiator ("here are 5 production codebases where a B-tree earns its keep") is the `uses` type. The current design only has an automation path for `implements` (the commodity half — already covered by repos like TheAlgorithms). The moat half has no scaling story.
- **Pros:** Avoids building a v2 pipeline that automates the low-value half; confirms demand before heavy infra.
- **Cons:** Product-strategy work, not coding — easy to skip while heads-down building.
- **Context:** Surfaced by the eng-review outside voice (#1, #2). User chose to proceed with the build (learning project) and capture this rather than pause. `/plan-ceo-review` is the right venue to pressure-test the thesis. Cheapest validation: a single seeded page or README + a form, shared where DSA learners hang out.
- **Depends on:** Nothing. Best done before committing to v2 auto-suggest.

### Land the Playwright E2E suite as the FIRST v2 task
- **What:** Stand up the Playwright smoke suite (page renders desc+refs, viz island hydrates and advances a step, `viz: null` page renders cleanly, unknown slug 404s) before backfilling content past ~15-20 structures.
- **Why:** E2E was deferred from v1 to keep v1 lean. But v2 is also when content scales to 60-80 pages. If backfill happens first, you're manually clicking 60 viz pages per deploy because the automated test layer hasn't caught up.
- **Pros:** Prevents the test burden and page count from exploding simultaneously; catches hydration / page-generation failures that unit tests can't.
- **Cons:** Front-loads test setup before the "fun" content work in v2.
- **Context:** Surfaced by eng-review outside voice (#8). v1 stopgap is manual click-through of one viz page + one `viz: null` page before each deploy.
- **Depends on:** v1 shipped.
