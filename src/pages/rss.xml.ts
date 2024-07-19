import rss from '@astrojs/rss'
import dayjs from 'dayjs'
import { TITLE, DESCRIPTION, LANGUAGE } from '@/common/constants'
import { APIContext, MarkdownInstance } from 'astro'
import { Frontmatter } from '@/common/types'

const postImportResult = import.meta.glob('./posts/**/*.md', { eager: true }) as Record<
  string,
  MarkdownInstance<Frontmatter>
>
const posts = Object.values(postImportResult)

export function GET(context: APIContext) {
  console.log('context', Object.keys(context).toString())
  return rss({
    title: TITLE,
    description: DESCRIPTION,
    site: context.site,
    items: posts
      .filter(post => !post.frontmatter.draft)
      .map(post => ({
        link: post.url,
        title: post.frontmatter.title,
        description: post.frontmatter.abstract,
        pubDate: dayjs(post.frontmatter.updatedAt).toDate(),
      }))
      .sort((p1, p2) => dayjs(p2.pubDate).unix() - dayjs(p1.pubDate).unix()),
    customData: `<language>${LANGUAGE}</language>`,
  })
}
