import type { HistoryRecord, TimelineSample } from '../types/timeline'

interface TimelineDataFile {
  histories?: HistoryRecord[]
  samples?: TimelineSample[]
}

const timelineDataFiles = import.meta.glob<TimelineDataFile>('./*.json', {
  eager: true,
  import: 'default',
})

const mergedData = Object.entries(timelineDataFiles)
  .sort(([leftPath], [rightPath]) => leftPath.localeCompare(rightPath))
  .reduce(
    (result, [, data]) => ({
      histories: [...result.histories, ...(data.histories ?? [])],
      samples: [...result.samples, ...(data.samples ?? [])],
    }),
    {
      histories: [] as HistoryRecord[],
      samples: [] as TimelineSample[],
    },
  )

export const bundledHistories = mergedData.histories
export const bundledSamples = mergedData.samples
