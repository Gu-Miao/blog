import { Component, createSignal, Switch, Match, For } from 'solid-js'
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
      <Switch fallback={<p style={{ 'text-align': 'center', padding: '5em 0' }}>未匹配到文章</p>}>
        <Match when={filterdPosts().length > 0}>
          <ul>
            <For each={filterdPosts()}>
              {post => {
                return (
                  <li>
                    <h3>
                      <a href={post.url} target="_blank">
                        {post.frontmatter.title}
                      </a>
                    </h3>
                    <p>{post.frontmatter.abstract}</p>
                    <p>
                      <For each={post.frontmatter.tags}>
                        {tag => <span class="tag">{tag}</span>}
                      </For>
                    </p>
                    <p class="time">{dayjs(post.frontmatter.updatedAt).format('YYYY年M月D日')}</p>
                  </li>
                )
              }}
            </For>
          </ul>
        </Match>
      </Switch>
    </div>
  )
}

export default Search
