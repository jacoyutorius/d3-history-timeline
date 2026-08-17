import type { HistoryRecord } from '../types/timeline'

export const TIMELINE_MARGIN_YEARS = 10

/** 保存値の0を、描画時だけ現在年へ変換する。 */
export function resolveEndYear(end: number, currentYear: number): number {
  return end === 0 ? currentYear : end
}

export function calculateTimelineRange(
  records: HistoryRecord[],
  currentYear = new Date().getFullYear(),
): [startYear: number, endYear: number] | null {
  if (records.length === 0) return null

  const startYear = Math.min(...records.map(({ start }) => start))
  const endYear = Math.max(
    ...records.map(({ end }) => resolveEndYear(end, currentYear)),
  )

  return [startYear - TIMELINE_MARGIN_YEARS, endYear + TIMELINE_MARGIN_YEARS]
}
