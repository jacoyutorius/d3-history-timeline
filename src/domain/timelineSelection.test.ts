import { describe, expect, it } from 'vitest'

import type { HistoryRecord, TimelineSample } from '../types/timeline'
import { isSampleSelected, setSampleSelected } from './timelineSelection'

const histories: HistoryRecord[] = [
  { title: 'Person A', category: 'people', start: 1900, end: 1980, events: [] },
  { title: 'Organization A', category: 'organization', start: 1920, end: 1950, events: [] },
  { title: 'Other', category: 'people', start: 2000, end: 0, events: [] },
]

const sample: TimelineSample = {
  title: 'Sample',
  peoples: ['Person A'],
  organizations: ['Organization A'],
}

describe('timeline sample selection', () => {
  it('サンプルに含まれるデータだけを選択する', () => {
    const target = structuredClone(histories)
    setSampleSelected(target, sample, true)

    expect(target.map(({ selected }) => selected)).toEqual([true, true, undefined])
    expect(isSampleSelected(target, sample)).toBe(true)
  })

  it('サンプルを一括解除する', () => {
    const target = structuredClone(histories).map((history) => ({ ...history, selected: true }))
    setSampleSelected(target, sample, false)

    expect(target.map(({ selected }) => selected)).toEqual([false, false, true])
    expect(isSampleSelected(target, sample)).toBe(false)
  })
})
