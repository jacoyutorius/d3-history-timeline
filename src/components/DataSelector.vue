<script setup lang="ts">
import { computed, ref } from 'vue'

import { formatHistoricalPeriod } from '../domain/historicalDate'
import type { SelectableHistoryRecord, TimelineSample } from '../types/timeline'

const props = defineProps<{
  people: SelectableHistoryRecord[]
  organizations: SelectableHistoryRecord[]
  movements: SelectableHistoryRecord[]
  samples: TimelineSample[]
  sampleIsSelected: (sample: TimelineSample) => boolean
}>()

const emit = defineEmits<{
  close: []
  toggleRecord: [record: SelectableHistoryRecord]
  toggleSample: [sample: TimelineSample]
}>()

type Tab = 'people' | 'organizations' | 'movements' | 'samples'
const activeTab = ref<Tab>('people')
const searchQuery = ref('')

const normalizedSearchQuery = computed(() => searchQuery.value.trim().toLowerCase())

const filteredPeople = computed(() => filterRecords(props.people))
const filteredOrganizations = computed(() => filterRecords(props.organizations))
const filteredMovements = computed(() => filterRecords(props.movements))
const allRecords = computed(() => [
  ...props.people,
  ...props.organizations,
  ...props.movements,
])
const recordById = computed(() => new Map(allRecords.value.map((record) => [record.id, record])))
const filteredSamples = computed(() => {
  if (!normalizedSearchQuery.value) return props.samples

  return props.samples.filter((sample) => (
    includesSearchQuery(sample.title)
    || includesSearchQuery(sample.description)
    || sample.recordIds.some(includesSearchQuery)
    || sampleRecords(sample).some((record) => includesSearchQuery(record.title))
  ))
})

const activeRecords = computed(() => {
  if (activeTab.value === 'people') return filteredPeople.value
  if (activeTab.value === 'organizations') return filteredOrganizations.value
  return filteredMovements.value
})

const activeListIsEmpty = computed(() => (
  activeTab.value === 'samples'
    ? filteredSamples.value.length === 0
    : activeRecords.value.length === 0
))

function includesSearchQuery(value: string): boolean {
  return value.toLowerCase().includes(normalizedSearchQuery.value)
}

function filterRecords(records: SelectableHistoryRecord[]): SelectableHistoryRecord[] {
  if (!normalizedSearchQuery.value) return records

  return records.filter((record) => (
    includesSearchQuery(record.title)
    || includesSearchQuery(record.description)
    || includesSearchQuery(formatHistoricalPeriod(record.period.start, record.period.end))
    || record.events.some((event) => includesSearchQuery(event.title))
  ))
}

function sampleRecords(sample: TimelineSample): SelectableHistoryRecord[] {
  return sample.recordIds
    .map((recordId) => recordById.value.get(recordId))
    .filter((record): record is SelectableHistoryRecord => record !== undefined)
}

function samplePreview(sample: TimelineSample): string {
  return sampleRecords(sample).slice(0, 4).map(({ title }) => title).join('、')
}

function sampleCategorySummary(sample: TimelineSample): string {
  const counts = sampleRecords(sample).reduce<Record<string, number>>((result, record) => {
    result[record.category] = (result[record.category] ?? 0) + 1
    return result
  }, {})
  const labels = [
    ['person', '人物'],
    ['organization', '組織'],
    ['movement', '運動'],
  ] as const

  return labels
    .filter(([category]) => counts[category])
    .map(([category, label]) => `${label}${counts[category]}`)
    .join(' / ')
}
</script>

<template>
  <div class="dialog-backdrop" @click.self="emit('close')">
    <section class="selector-dialog" role="dialog" aria-modal="true" aria-labelledby="selector-title">
      <header class="dialog-header">
        <h2 id="selector-title">表示するデータを選択</h2>
        <button class="icon-button" type="button" aria-label="閉じる" @click="emit('close')">×</button>
      </header>

      <div class="tabs" role="tablist" aria-label="データ種別">
        <button :class="{ active: activeTab === 'people' }" type="button" @click="activeTab = 'people'">
          人物（{{ filteredPeople.length }}/{{ people.length }}）
        </button>
        <button :class="{ active: activeTab === 'organizations' }" type="button" @click="activeTab = 'organizations'">
          組織（{{ filteredOrganizations.length }}/{{ organizations.length }}）
        </button>
        <button :class="{ active: activeTab === 'movements' }" type="button" @click="activeTab = 'movements'">
          運動（{{ filteredMovements.length }}/{{ movements.length }}）
        </button>
        <button :class="{ active: activeTab === 'samples' }" type="button" @click="activeTab = 'samples'">
          サンプル（{{ filteredSamples.length }}/{{ samples.length }}）
        </button>
      </div>

      <div class="selection-search">
        <label for="selection-search-input">検索</label>
        <input
          id="selection-search-input"
          v-model="searchQuery"
          autocomplete="off"
          placeholder="名前、説明、イベントで絞り込み"
          type="search"
        >
      </div>

      <div class="selection-list">
        <p v-if="activeListIsEmpty" class="selection-empty">該当するデータはありません。</p>

        <template v-else-if="activeTab !== 'samples'">
          <label v-for="record in activeRecords"
                 :key="record.id ?? record.title"
                 class="selection-item">
            <input :checked="record.selected" type="checkbox" @change="emit('toggleRecord', record)">
            <img v-if="record.image" :src="record.image.url" :alt="record.image.alt">
            <span>
              <strong>{{ record.title }}</strong>
              <small>{{ formatHistoricalPeriod(record.period.start, record.period.end) }}</small>
            </span>
          </label>
        </template>

        <template v-else>
          <label v-for="sample in filteredSamples"
                 :key="sample.id"
                 class="selection-item sample-item">
            <input :checked="sampleIsSelected(sample)" type="checkbox" @change="emit('toggleSample', sample)">
            <span>
              <strong>{{ sample.title }}</strong>
              <small>{{ sample.description }}（{{ sample.recordIds.length }}件）</small>
              <small v-if="samplePreview(sample)">含む：{{ samplePreview(sample) }}</small>
              <small v-if="sampleCategorySummary(sample)" class="sample-meta">{{ sampleCategorySummary(sample) }}</small>
            </span>
          </label>
        </template>
      </div>

      <footer class="dialog-footer">
        <button class="primary-button" type="button" @click="emit('close')">選択を完了</button>
      </footer>
    </section>
  </div>
</template>
