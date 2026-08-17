import { describe, expect, it } from 'vitest'

import type { HistoryRecord } from '../types/timeline'
import { calculateTimelineRange, resolveEndYear } from './timelineRange'

const record = (start: number, end: number): HistoryRecord => ({
  title: `${start}-${end}`,
  category: 'people',
  start,
  end,
  events: [],
})

describe('resolveEndYear', () => {
  it('継続中を表す0を現在年へ変換する', () => {
    expect(resolveEndYear(0, 2026)).toBe(2026)
  })

  it('終了年がある場合はその値を維持する', () => {
    expect(resolveEndYear(1969, 2026)).toBe(1969)
  })
})

describe('calculateTimelineRange', () => {
  it('前後10年の余白を持つ表示期間を返す', () => {
    expect(calculateTimelineRange([record(1919, 1933), record(1883, 0)], 2026))
      .toEqual([1873, 2036])
  })

  it('データが空なら表示期間を返さない', () => {
    expect(calculateTimelineRange([])).toBeNull()
  })
})
