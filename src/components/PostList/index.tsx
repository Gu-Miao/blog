import { Component, createSignal, For } from 'solid-js'
import dayjs from 'dayjs'
import { debounce } from 'lodash-es'
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
        onInput={debounce(e => setValue(e.target.value))}
        placeholder="在此搜索..."
      />
      <ul>
        <For each={filterdPosts()}>
          {post => (
            <li>
              <h3>
                <a href={post.url}>{post.frontmatter.title}</a>
              </h3>
              <p>{post.frontmatter.abstract}</p>
              <p>
                {post.frontmatter.tags.map(tag => (
                  <span class="tag">{tag}</span>
                ))}
              </p>
              <p class="time">{dayjs(post.frontmatter.updatedAt).format('YYYY年M月D日')}</p>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}

export default Search
