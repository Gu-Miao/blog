import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import solidjs from '@astrojs/solid-js'
import rehypeExternalLinks from 'rehype-external-links'

export default defineConfig({
  site: 'https://guangwublog.vercel.app',
  integrations: [sitemap(), solidjs()],
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: 'external nofollow noopener noreferrer' }],
    ],
  },
})
