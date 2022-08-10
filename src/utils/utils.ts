import dayjs from 'dayjs'

export function formatDate(date: Parameters<typeof dayjs>[0]) {
  return dayjs(date).format('YYYY年M月D日')
}
