<script setup lang="ts">
import { computed, ref } from 'vue'

import DataSelector from '../components/DataSelector.vue'
import TimelineChart from '../components/TimelineChart.vue'
import { useTimelineData } from '../composables/useTimelineData'
import type { TimelineSample } from '../types/timeline'

const selectorOpen = ref(false)
const starterSampleIds = [
  'renaissance-to-baroque',
  'jazz-origins',
  'rock-and-roll-foundations',
  'bauhaus',
  'japanese-animation-directors',
  'modern-design-education',
]
const {
  applySample,
  error,
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
} = useTimelineData()

const starterSamples = computed<TimelineSample[]>(() => {
  const sampleById = new Map(samples.value.map((sample) => [sample.id, sample]))
  return starterSampleIds
    .map((id) => sampleById.get(id))
    .filter((sample): sample is TimelineSample => sample !== undefined)
})
</script>

<template>
  <section>
    <h1 class="visually-hidden">TimeLends</h1>

    <p v-if="loading" class="notice">データを読み込んでいます…</p>
    <p v-else-if="error" class="notice error-notice">{{ error }}</p>

    <template v-else>
      <section v-if="starterSamples.length" class="starter-samples" aria-labelledby="starter-samples-title">
        <div class="starter-samples-heading">
          <h2 id="starter-samples-title">サンプルから始める</h2>
          <button class="secondary-button" type="button" @click="selectorOpen = true">
            すべて見る
          </button>
        </div>
        <div class="starter-sample-list">
          <button
            v-for="sample in starterSamples"
            :key="sample.id"
            class="starter-sample-button"
            :class="{ active: sampleIsSelected(sample) }"
            type="button"
            @click="applySample(sample)"
          >
            <strong>{{ sample.title }}</strong>
            <span>{{ sample.recordIds.length }}件</span>
          </button>
        </div>
      </section>

      <div class="timeline-toolbar">
        <p>{{ selectedRecords.length }}件を選択中</p>
        <button class="primary-button" type="button" @click="selectorOpen = true">
          比較するデータを選ぶ
        </button>
      </div>

      <div v-if="selectedRecords.length === 0" class="empty-state">
        <h2>データが選択されていません</h2>
        <p>タイムラインに表示する人物・組織、またはサンプルを選択してください。</p>
        <button class="primary-button" type="button" @click="selectorOpen = true">選択する</button>
      </div>

      <section v-else aria-labelledby="selected-title">
        <h2 id="selected-title">選択したデータの年表</h2>
        <TimelineChart :records="selectedRecords" @deselect-record="deselectRecord" />
      </section>
    </template>

    <DataSelector
      v-if="selectorOpen"
      :movements="movements"
      :organizations="organizations"
      :people="people"
      :sample-is-selected="sampleIsSelected"
      :samples="samples"
      @close="selectorOpen = false"
      @toggle-record="toggleRecord"
      @toggle-sample="toggleSample"
    />
  </section>
</template>
