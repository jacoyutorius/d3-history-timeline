import type { SelectableHistoryRecord, TimelineSample } from '../types/timeline'

export function setRecordSelected(
  histories: SelectableHistoryRecord[],
  recordId: string,
  selected: boolean,
): void {
  const record = histories.find((history) => history.id === recordId)
  if (record) record.selected = selected
}

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

export function applySampleSelection(
  histories: SelectableHistoryRecord[],
  sample: TimelineSample,
): void {
  const ids = new Set(sample.recordIds)
  histories.forEach((history) => {
    history.selected = ids.has(history.id)
  })
}
