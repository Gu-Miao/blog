export interface Frontmatter {
  title: string
  abstract: string
  author: {
    name: string
    link: string
  }
  image: string
  createdAt: string
  updatedAt: string
  category: string
  tags: string[]
  serials?: string
  reprint: {
    description: string
    link: string
  }
}
