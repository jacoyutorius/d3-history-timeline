import bundledTimeline from './bundledTimeline.json'
import type { HistoryRecord, TimelineSample } from '../types/timeline'

interface BundledTimelineData {
  histories: HistoryRecord[]
  samples: TimelineSample[]
}

const data = bundledTimeline as BundledTimelineData

export const bundledHistories = data.histories
export const bundledSamples = data.samples
