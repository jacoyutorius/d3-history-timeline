import { describe, expect, it } from 'vitest'

import {
  ageAtYear,
  calculateTimelineLayout,
  createYearScale,
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
})

describe('ageAtYear', () => {
  it('指定年時点の年齢を返す', () => {
    expect(ageAtYear(1883, 1919)).toBe(36)
  })

  it('誕生前の年には年齢を返さない', () => {
    expect(ageAtYear(1883, 1800)).toBeNull()
  })
})
