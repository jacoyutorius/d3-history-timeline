import { describe, expect, it } from 'vitest'

import { formatHistoricalDate, formatHistoricalPeriod } from './historicalDate'

describe('formatHistoricalDate', () => {
  it('年だけが判明している日付を表示する', () => {
    expect(formatHistoricalDate({ year: 1919 })).toBe('1919年')
  })

  it('判明している月日まで表示する', () => {
    expect(formatHistoricalDate({ year: 1883, month: 5, day: 18 })).toBe('1883年5月18日')
  })
})

describe('formatHistoricalPeriod', () => {
  it('継続中の期間を表示する', () => {
    expect(formatHistoricalPeriod({ year: 1941 }, null)).toBe('1941年〜現在')
  })
})
