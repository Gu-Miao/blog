import rss from '@astrojs/rss'
//@ts-ignore
import dayjs from 'dayjs'
import { TITLE, DESCRIPTION, LANGUAGE } from '@/common/constants'

const postImportResult = import.meta.globEager('./posts/**/*.md')
const posts = Object.values(postImportResult)

export const get = () =>
  rss({
    title: TITLE,
    description: DESCRIPTION,
    site: import.meta.env.SITE,
    items: posts.map(post => ({
      link: post.url,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      pubDate: dayjs(post.frontmatter.createdAt).toDate(),
    })),
    customData: `<language>${LANGUAGE}</language>`,
  })
