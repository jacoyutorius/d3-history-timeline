import type { HistoryRecord } from '../types/timeline'

export const TIMELINE_MARGIN_YEARS = 10

/** 保存値の0を、描画時だけ現在年へ変換する。 */
export function resolveEndYear(end: HistoryRecord['period']['end'], currentYear: number): number {
  return end?.year ?? currentYear
}

export function calculateTimelineRange(
  records: HistoryRecord[],
  currentYear = new Date().getFullYear(),
): [startYear: number, endYear: number] | null {
  if (records.length === 0) return null

  const startYear = Math.min(...records.map(({ period }) => period.start.year))
  const endYear = Math.max(
    ...records.map(({ period }) => resolveEndYear(period.end, currentYear)),
  )

  return [startYear - TIMELINE_MARGIN_YEARS, endYear + TIMELINE_MARGIN_YEARS]
}
