import dayjs from 'dayjs'

export function formatDate(date: string) {
  return dayjs(date).format('YYYY年M月D日')
}
