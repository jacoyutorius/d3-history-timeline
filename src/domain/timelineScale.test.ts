import { describe, expect, it } from 'vitest'

import {
  ageAtDate,
  ageAtYear,
  CHART_COMPACT_ROW_HEIGHT,
  CHART_MARGIN,
  CHART_ROW_HEIGHT,
  calculateTimelineLayout,
  createYearScale,
  timelineRowHeight,
  yearFromX,
} from './timelineScale'

describe('timeline scale', () => {
  const layout = calculateTimelineLayout(1000, 2)
  const scale = createYearScale(1900, 2000, layout)

  it('開始年と終了年を描画領域の両端へ割り当てる', () => {
    expect(scale(1900)).toBe(layout.plotLeft)
    expect(scale(2000)).toBe(layout.plotRight)
  })

  it('X座標を同じスケールで年へ逆変換する', () => {
    const targetYear = 1957
    expect(yearFromX(scale(targetYear), scale)).toBe(targetYear)
  })

  it('描画領域外の座標を期間内へ制限する', () => {
    expect(yearFromX(-100, scale)).toBe(1900)
    expect(yearFromX(2000, scale)).toBe(2000)
  })

  it('狭い画面でも最小描画幅を維持する', () => {
    expect(calculateTimelineLayout(320, 1).width).toBe(720)
  })

  it('件数が多い場合は行間を詰める', () => {
    expect(timelineRowHeight(7)).toBe(CHART_ROW_HEIGHT)
    expect(timelineRowHeight(8)).toBe(CHART_COMPACT_ROW_HEIGHT)
    expect(calculateTimelineLayout(1000, 8).height)
      .toBe(CHART_MARGIN.top + 8 * CHART_COMPACT_ROW_HEIGHT + CHART_MARGIN.bottom)
  })
})

describe('ageAtYear', () => {
  it('指定年時点の年齢を返す', () => {
    expect(ageAtYear(1883, 1919)).toBe(36)
  })

  it('誕生前の年には年齢を返さない', () => {
    expect(ageAtYear(1883, 1800)).toBeNull()
  })
})

describe('ageAtDate', () => {
  it('年月日が揃っている場合は満年齢を返す', () => {
    expect(ageAtDate(
      { year: 1883, month: 12, day: 18 },
      { year: 1919, month: 4, day: 1 },
    )).toEqual({ age: 35, exact: true })
    expect(ageAtDate(
      { year: 1883, month: 12, day: 18 },
      { year: 1919, month: 12, day: 18 },
    )).toEqual({ age: 36, exact: true })
  })

  it('年月日が不足している場合は概算年齢を返す', () => {
    expect(ageAtDate(
      { year: 1883, month: 12, day: 18 },
      { year: 1919 },
    )).toEqual({ age: 36, exact: false })
    expect(ageAtDate(
      { year: 1883 },
      { year: 1919, month: 12, day: 18 },
    )).toEqual({ age: 36, exact: false })
  })

  it('誕生前の日付には年齢を返さない', () => {
    expect(ageAtDate({ year: 1883 }, { year: 1800 })).toBeNull()
    expect(ageAtDate(
      { year: 1883, month: 12, day: 18 },
      { year: 1883, month: 12, day: 17 },
    )).toBeNull()
  })
})
