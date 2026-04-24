import dayjs from 'dayjs'

export function formatDate(date: Parameters<typeof dayjs>[0]) {
  return dayjs(date).format('YYYY年M月D日')
}

/** 列表/RSS 摘要：去掉 Markdown 内联链接，仅保留链接文字 */
export function plainTextAbstract(s: string): string {
  return s.replace(/\[([^\]]+)]\([^)]*\)/g, '$1')
}
