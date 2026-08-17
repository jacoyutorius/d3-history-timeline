import { describe, expect, it } from 'vitest'

import type { SelectableHistoryRecord, TimelineSample } from '../types/timeline'
import { isSampleSelected, setSampleSelected } from './timelineSelection'

const record = (id: string, selected = false): SelectableHistoryRecord => ({
  id,
  title: id,
  category: 'person',
  description: '',
  period: { start: { year: 1900 }, end: { year: 1980 } },
  events: [],
  sources: [],
  selected,
})

const histories = [record('person-a'), record('organization-a'), record('other')]
const sample: TimelineSample = {
  id: 'sample',
  title: 'Sample',
  description: '',
  recordIds: ['person-a', 'organization-a'],
}

describe('timeline sample selection', () => {
  it('サンプルが参照するIDのデータだけを選択する', () => {
    const target = structuredClone(histories)
    setSampleSelected(target, sample, true)

    expect(target.map(({ selected }) => selected)).toEqual([true, true, false])
    expect(isSampleSelected(target, sample)).toBe(true)
  })

  it('サンプルを一括解除する', () => {
    const target = histories.map((history) => ({ ...history, selected: true }))
    setSampleSelected(target, sample, false)

    expect(target.map(({ selected }) => selected)).toEqual([false, false, true])
    expect(isSampleSelected(target, sample)).toBe(false)
  })

  it('参照先が欠けているサンプルを選択済みと判定しない', () => {
    expect(isSampleSelected([record('person-a', true)], sample)).toBe(false)
  })
})
