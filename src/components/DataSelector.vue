<script setup lang="ts">
import { ref } from 'vue'

import type { HistoryRecord, TimelineSample } from '../types/timeline'

defineProps<{
  people: HistoryRecord[]
  organizations: HistoryRecord[]
  samples: TimelineSample[]
  sampleIsSelected: (sample: TimelineSample) => boolean
}>()

const emit = defineEmits<{
  close: []
  toggleRecord: [record: HistoryRecord]
  toggleSample: [sample: TimelineSample]
}>()

type Tab = 'people' | 'organizations' | 'samples'
const activeTab = ref<Tab>('people')
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
          人物（{{ people.length }}）
        </button>
        <button :class="{ active: activeTab === 'organizations' }" type="button" @click="activeTab = 'organizations'">
          組織（{{ organizations.length }}）
        </button>
        <button :class="{ active: activeTab === 'samples' }" type="button" @click="activeTab = 'samples'">
          サンプル（{{ samples.length }}）
        </button>
      </div>

      <div class="selection-list">
        <template v-if="activeTab !== 'samples'">
          <label v-for="record in activeTab === 'people' ? people : organizations"
                 :key="record.id ?? record.title"
                 class="selection-item">
            <input :checked="record.selected" type="checkbox" @change="emit('toggleRecord', record)">
            <img v-if="record.imageUrl" :src="record.imageUrl" :alt="`${record.title}の画像`">
            <span>
              <strong>{{ record.title }}</strong>
              <small>{{ record.start }}〜{{ record.end || '現在' }}</small>
            </span>
          </label>
        </template>

        <template v-else>
          <label v-for="sample in samples"
                 :key="sample.title"
                 class="selection-item sample-item">
            <input :checked="sampleIsSelected(sample)" type="checkbox" @change="emit('toggleSample', sample)">
            <span>
              <strong>{{ sample.title }}</strong>
              <small>{{ [...sample.peoples, ...sample.organizations].join('、') }}</small>
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
