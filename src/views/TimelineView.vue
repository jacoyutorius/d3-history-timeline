<script setup lang="ts">
import type { HistoryRecord } from '../types/timeline'

const selectedRecords: HistoryRecord[] = []
</script>

<template>
  <section>
    <h1>History Timeline</h1>
    <p v-if="selectedRecords.length === 0" class="empty-state">
      タイムラインに表示するデータを選択してください。
    </p>
  </section>
</template>
