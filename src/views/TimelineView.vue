<script setup lang="ts">
import { ref } from 'vue'

import DataSelector from '../components/DataSelector.vue'
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
        <h2 id="selected-title">選択したデータ</h2>
        <p class="migration-note">D3年表を移植するまで、選択結果を一覧で表示しています。</p>
        <ul class="record-grid">
          <li v-for="record in selectedRecords" :key="record.id ?? record.title" class="record-card">
            <img v-if="record.imageUrl" :src="record.imageUrl" :alt="`${record.title}の画像`">
            <div>
              <span class="category-label">{{ record.category === 'people' ? '人物' : '組織' }}</span>
              <h3>{{ record.title }}</h3>
              <p>{{ record.start }}〜{{ record.end || '現在' }}</p>
              <p>{{ record.events.length }}件のイベント</p>
            </div>
          </li>
        </ul>
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
