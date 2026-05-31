import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import { integrityCheck } from './integrations/integrity-check';

// Site config. Deployed to the default GitHub Pages project URL:
//   https://krishna-fitavatar.github.io/realworlddsalgo/
// `base` is the subpath the project is served under; hand-written links use
// import.meta.env.BASE_URL so they resolve under it. (Custom apex domain is
// deferred — re-add `public/CNAME` and switch site/base when ready.)
export default defineConfig({
  site: 'https://krishna-fitavatar.github.io',
  base: '/realworlddsalgo',
  integrations: [preact(), integrityCheck()],
});
