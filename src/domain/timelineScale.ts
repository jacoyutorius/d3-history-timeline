import { scaleLinear, type ScaleLinear } from 'd3'

export const CHART_MIN_WIDTH = 720
export const CHART_MARGIN = {
  top: 56,
  right: 36,
  bottom: 36,
  left: 190,
} as const
export const CHART_ROW_HEIGHT = 76

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
  return {
    width,
    height: CHART_MARGIN.top + Math.max(rowCount, 1) * CHART_ROW_HEIGHT + CHART_MARGIN.bottom,
    plotLeft: CHART_MARGIN.left,
    plotRight: width - CHART_MARGIN.right,
  }
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

export function ageAtYear(birthYear: number, year: number): number | null {
  return year < birthYear ? null : year - birthYear
}
