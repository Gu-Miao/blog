import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import solidjs from '@astrojs/solid-js'
import compress from 'astro-compress'

const HeadingIconHast = {
  type: 'element',
  tagName: 'svg',
  properties: {
    viewBox: '0 0 16 16',
    version: '1.1',
  },
  children: [
    {
      type: 'element',
      tagName: 'path',
      properties: {
        'fill-rule': 'evenodd',
        d: 'M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z',
      },
    },
  ],
}

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.gutianhuang.red/',
  integrations: [
    sitemap(),
    solidjs(),
    compress({ HTML: true, CSS: false, JavaScript: false, Image: false }),
  ],
  markdown: {
    remarkPlugins: ['remark-gfm', 'remark-smartypants', 'remark-math'],
    rehypePlugins: [
      [
        'rehype-external-links',
        {
          target: '_blank',
          rel: 'external nofollow noopener noreferrer',
        },
      ],
      'rehype-slug',
      [
        'rehype-autolink-headings',
        {
          content: HeadingIconHast,
        },
      ],
      'rehype-plugin-image-native-lazy-loading',
      'rehype-katex',
      'rehype-plugin-image-alt-extends',
    ],
    shikiConfig: {
      theme: 'dark-plus',
    },
  },
})
