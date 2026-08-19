import { scaleLinear, type ScaleLinear } from 'd3'

import type { HistoricalDate } from '../types/timeline'

export const CHART_MIN_WIDTH = 720
export const CHART_MARGIN = {
  top: 56,
  right: 24,
  bottom: 36,
  left: 220,
} as const
export const CHART_ROW_HEIGHT = 76
export const CHART_COMPACT_ROW_HEIGHT = 62
export const CHART_COMPACT_ROW_THRESHOLD = 8

export interface TimelineLayout {
  width: number
  height: number
  plotLeft: number
  plotRight: number
}

export function calculateTimelineLayout(
  containerWidth: number,
  rowCount: number,
): TimelineLayout {
  const width = Math.max(CHART_MIN_WIDTH, Math.floor(containerWidth))
  const rowHeight = rowCount >= CHART_COMPACT_ROW_THRESHOLD
    ? CHART_COMPACT_ROW_HEIGHT
    : CHART_ROW_HEIGHT

  return {
    width,
    height: CHART_MARGIN.top + Math.max(rowCount, 1) * rowHeight + CHART_MARGIN.bottom,
    plotLeft: CHART_MARGIN.left,
    plotRight: width - CHART_MARGIN.right,
  }
}

export function timelineRowHeight(rowCount: number): number {
  return rowCount >= CHART_COMPACT_ROW_THRESHOLD
    ? CHART_COMPACT_ROW_HEIGHT
    : CHART_ROW_HEIGHT
}

export function createYearScale(
  startYear: number,
  endYear: number,
  layout: TimelineLayout,
): ScaleLinear<number, number> {
  if (endYear <= startYear) {
    throw new RangeError('終了年は開始年より後である必要があります。')
  }

  return scaleLinear()
    .domain([startYear, endYear])
    .range([layout.plotLeft, layout.plotRight])
    .clamp(true)
}

export function yearFromX(
  x: number,
  scale: ScaleLinear<number, number>,
): number {
  return Math.round(scale.invert(x))
}

export interface AgeAtDateResult {
  age: number
  exact: boolean
}

function hasMonthAndDay(date: HistoricalDate): date is HistoricalDate & Required<Pick<HistoricalDate, 'month' | 'day'>> {
  return date.month !== undefined && date.day !== undefined
}

export function ageAtDate(birthDate: HistoricalDate, targetDate: HistoricalDate): AgeAtDateResult | null {
  if (targetDate.year < birthDate.year) return null

  if (!hasMonthAndDay(birthDate) || !hasMonthAndDay(targetDate)) {
    return {
      age: targetDate.year - birthDate.year,
      exact: false,
    }
  }

  const birthdayReached = targetDate.month > birthDate.month
    || (targetDate.month === birthDate.month && targetDate.day >= birthDate.day)
  if (targetDate.year === birthDate.year && !birthdayReached) return null

  return {
    age: targetDate.year - birthDate.year - (birthdayReached ? 0 : 1),
    exact: true,
  }
}

export function ageAtYear(birthYear: number, year: number): number | null {
  return ageAtDate({ year: birthYear }, { year })?.age ?? null
}
