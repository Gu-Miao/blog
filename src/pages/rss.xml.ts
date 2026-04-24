import rss from '@astrojs/rss'
import dayjs from 'dayjs'
import { TITLE, DESCRIPTION, LANGUAGE } from '@/common/constants'
import { APIContext, MarkdownInstance } from 'astro'
import { Frontmatter } from '@/common/types'
import { plainTextAbstract } from '@/utils/utils'

const postImportResult = import.meta.glob('./posts/**/*.md', { eager: true }) as Record<
  string,
  MarkdownInstance<Frontmatter>
>
const posts = Object.values(postImportResult)

export function GET(context: APIContext) {
  const site = context.site
  if (!site) {
    throw new Error('RSS requires astro.config site')
  }
  return rss({
    title: TITLE,
    description: DESCRIPTION,
    site,
    items: posts
      .filter(post => Boolean(post.url) && !post.frontmatter.draft)
      .map(post => ({
        link: post.url as string,
        title: post.frontmatter.title,
        description: plainTextAbstract(post.frontmatter.abstract),
        pubDate: dayjs(post.frontmatter.updatedAt).toDate(),
      }))
      .sort((p1, p2) => dayjs(p2.pubDate).unix() - dayjs(p1.pubDate).unix()),
    customData: `<language>${LANGUAGE}</language>`,
  })
}
