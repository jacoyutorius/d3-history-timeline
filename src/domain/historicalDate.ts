import type { HistoricalDate } from '../types/timeline'

export function formatHistoricalDate(date: HistoricalDate): string {
  const month = date.month === undefined ? '' : `${date.month}月`
  const day = date.day === undefined ? '' : `${date.day}日`
  return `${date.year}年${month}${day}`
}

export function formatHistoricalPeriod(
  start: HistoricalDate,
  end: HistoricalDate | null,
): string {
  return `${formatHistoricalDate(start)}〜${end ? formatHistoricalDate(end) : '現在'}`
}
