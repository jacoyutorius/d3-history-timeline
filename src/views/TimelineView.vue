<script setup lang="ts">
import { ref } from 'vue'

import DataSelector from '../components/DataSelector.vue'
import TimelineChart from '../components/TimelineChart.vue'
import { useTimelineData } from '../composables/useTimelineData'

const selectorOpen = ref(false)
const {
  error,
  loading,
  organizations,
  people,
  sampleIsSelected,
  samples,
  selectedRecords,
  toggleRecord,
  toggleSample,
} = useTimelineData()
</script>

<template>
  <section>
    <h1>History Timeline</h1>

    <p v-if="loading" class="notice">データを読み込んでいます…</p>
    <p v-else-if="error" class="notice error-notice">{{ error }}</p>

    <template v-else>
      <div class="timeline-toolbar">
        <p>{{ selectedRecords.length }}件を選択中</p>
        <button class="primary-button" type="button" @click="selectorOpen = true">
          表示データを選択
        </button>
      </div>

      <div v-if="selectedRecords.length === 0" class="empty-state">
        <h2>データが選択されていません</h2>
        <p>タイムラインに表示する人物・組織、またはサンプルを選択してください。</p>
        <button class="primary-button" type="button" @click="selectorOpen = true">選択する</button>
      </div>

      <section v-else aria-labelledby="selected-title">
        <h2 id="selected-title">選択したデータの年表</h2>
        <TimelineChart :records="selectedRecords" />
      </section>
    </template>

    <DataSelector
      v-if="selectorOpen"
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
