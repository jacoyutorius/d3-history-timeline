import { computed, onMounted, ref } from 'vue'

import { isSampleSelected, setSampleSelected } from '../domain/timelineSelection'
import { loadTimelineData } from '../services/timelineApi'
import type { HistoryRecord, TimelineSample } from '../types/timeline'

export function useTimelineData() {
  const histories = ref<HistoryRecord[]>([])
  const samples = ref<TimelineSample[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const selectedRecords = computed(() => histories.value.filter(({ selected }) => selected))
  const people = computed(() => histories.value.filter(({ category }) => category === 'people'))
  const organizations = computed(() => histories.value.filter(({ category }) => category === 'organization'))

  async function initialize(): Promise<void> {
    loading.value = true
    error.value = null
    try {
      const data = await loadTimelineData()
      histories.value = data.histories.map((history) => ({ ...history, selected: false }))
      samples.value = data.samples
    } catch (cause) {
      error.value = cause instanceof Error ? cause.message : 'データの取得に失敗しました。'
    } finally {
      loading.value = false
    }
  }

  function toggleRecord(record: HistoryRecord): void {
    record.selected = !record.selected
  }

  function sampleIsSelected(sample: TimelineSample): boolean {
    return isSampleSelected(histories.value, sample)
  }

  function toggleSample(sample: TimelineSample): void {
    setSampleSelected(histories.value, sample, !sampleIsSelected(sample))
  }

  onMounted(initialize)

  return {
    error,
    initialize,
    loading,
    organizations,
    people,
    sampleIsSelected,
    samples,
    selectedRecords,
    toggleRecord,
    toggleSample,
  }
}
