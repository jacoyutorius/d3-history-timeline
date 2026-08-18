import { computed, onMounted, ref } from 'vue'

import { isSampleSelected, setRecordSelected, setSampleSelected } from '../domain/timelineSelection'
import { loadTimelineData } from '../services/timelineApi'
import type { SelectableHistoryRecord, TimelineSample } from '../types/timeline'

export function useTimelineData() {
  const histories = ref<SelectableHistoryRecord[]>([])
  const samples = ref<TimelineSample[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const selectedRecords = computed(() => histories.value.filter(({ selected }) => selected))
  const people = computed(() => histories.value.filter(({ category }) => category === 'person'))
  const organizations = computed(() => histories.value.filter(({ category }) => category === 'organization'))
  const movements = computed(() => histories.value.filter(({ category }) => category === 'movement'))

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

  function toggleRecord(record: SelectableHistoryRecord): void {
    record.selected = !record.selected
  }

  function deselectRecord(recordId: string): void {
    setRecordSelected(histories.value, recordId, false)
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
    movements,
    organizations,
    people,
    deselectRecord,
    sampleIsSelected,
    samples,
    selectedRecords,
    toggleRecord,
    toggleSample,
  }
}
