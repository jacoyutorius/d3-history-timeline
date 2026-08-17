import type { SelectableHistoryRecord, TimelineSample } from '../types/timeline'

export function isSampleSelected(
  histories: SelectableHistoryRecord[],
  sample: TimelineSample,
): boolean {
  const ids = new Set(sample.recordIds)
  const targets = histories.filter(({ id }) => ids.has(id))
  return targets.length === ids.size && targets.every(({ selected }) => selected)
}

export function setSampleSelected(
  histories: SelectableHistoryRecord[],
  sample: TimelineSample,
  selected: boolean,
): void {
  const ids = new Set(sample.recordIds)
  histories.forEach((history) => {
    if (ids.has(history.id)) history.selected = selected
  })
}
