import type { HistoryRecord, TimelineSample } from '../types/timeline'

export function sampleTitles(sample: TimelineSample): Set<string> {
  return new Set([...sample.peoples, ...sample.organizations])
}

export function isSampleSelected(
  histories: HistoryRecord[],
  sample: TimelineSample,
): boolean {
  const titles = sampleTitles(sample)
  return titles.size > 0 && histories
    .filter(({ title }) => titles.has(title))
    .every(({ selected }) => selected === true)
}

export function setSampleSelected(
  histories: HistoryRecord[],
  sample: TimelineSample,
  selected: boolean,
): void {
  const titles = sampleTitles(sample)
  histories.forEach((history) => {
    if (titles.has(history.title)) history.selected = selected
  })
}
