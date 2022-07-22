import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import solidjs from '@astrojs/solid-js'

export default defineConfig({
  site: 'https://guangwublog.vercel.app',
  integrations: [sitemap(), solidjs()],
})
