import { Component, createSignal, For } from 'solid-js'
import dayjs from 'dayjs'
import { MarkdownInstance } from 'astro'
import { Frontmatter } from '@/common/types'
import './index.less'

interface SearchProps {
  posts: MarkdownInstance<Frontmatter>[]
}

const Search: Component<SearchProps> = props => {
  const [value, setValue] = createSignal('')
  const filterdPosts = () =>
    props.posts.filter(post =>
      post.frontmatter.title.toLowerCase().includes(value().trim().toLowerCase()),
    )

  return (
    <div class="post-list">
      <input
        type="text"
        value={value()}
        onInput={e => {
          console.log(12123)
          setValue(e.currentTarget.value)
        }}
        placeholder="在此搜索..."
      />
      <ul>
        <For each={filterdPosts()}>
          {post => (
            <li>
              <h3>
                <a href={post.url}>{post.frontmatter.title}</a>
              </h3>
              <p>{post.frontmatter.description}</p>
              <p>
                {post.frontmatter.tags.map(tag => (
                  <span class="tag">{tag}</span>
                ))}
              </p>
              <p class="time">{dayjs(post.frontmatter.createdAt).format('YYYY年M月D日')}</p>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}

export default Search
