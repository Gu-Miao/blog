import { Component, createSignal, Switch, Match, For } from 'solid-js'
import dayjs from 'dayjs'
import { debounce } from 'es-toolkit'
import { MarkdownInstance } from 'astro'
import { Frontmatter } from '@/common/types'
import { plainTextAbstract } from '@/utils/utils'
import './index.less'

interface SearchProps {
  posts: MarkdownInstance<Frontmatter>[]
}

const Search: Component<SearchProps> = props => {
  const [value, setValue] = createSignal('')
  const filterdPosts = () =>
    props.posts.filter(post => {
      const q = value().trim().toLowerCase()
      const title = (post.frontmatter?.title ?? '').toLowerCase()
      if (q === '') return true
      return title.includes(q)
    })

  return (
    <div class="post-list">
      <input
        type="text"
        value={value()}
        onInput={debounce(
          (e: InputEvent & { currentTarget: HTMLInputElement }) => setValue(e.currentTarget.value),
          100,
        )}
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
                        {post.frontmatter?.title ?? '（无标题）'}
                      </a>
                    </h3>
                    <p>{plainTextAbstract(post.frontmatter?.abstract ?? '')}</p>
                    <p>
                      <For each={post.frontmatter?.tags ?? []}>
                        {tag => <span class="tag">{tag}</span>}
                      </For>
                    </p>
                    <p class="time">
                      {post.frontmatter?.updatedAt
                        ? dayjs(post.frontmatter.updatedAt).format('YYYY年M月D日')
                        : ''}
                    </p>
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
