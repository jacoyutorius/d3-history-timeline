<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

import { calculateTimelineRange, resolveEndYear } from '../domain/timelineRange'
import {
  ageAtYear,
  calculateTimelineLayout,
  CHART_MARGIN,
  CHART_ROW_HEIGHT,
  createYearScale,
  yearFromX,
} from '../domain/timelineScale'
import type { HistoryRecord } from '../types/timeline'

const props = defineProps<{ records: HistoryRecord[] }>()

const currentYear = new Date().getFullYear()
const container = useTemplateRef<HTMLElement>('container')
const containerWidth = ref(0)
const selectedYear = ref<number | null>(null)
let resizeObserver: ResizeObserver | undefined

const range = computed(() => calculateTimelineRange(props.records, currentYear))
const layout = computed(() => calculateTimelineLayout(containerWidth.value, props.records.length))
const yearScale = computed(() => {
  if (!range.value) return null
  return createYearScale(range.value[0], range.value[1], layout.value)
})
const ticks = computed(() => yearScale.value?.ticks(8) ?? [])

function rowY(index: number): number {
  return CHART_MARGIN.top + index * CHART_ROW_HEIGHT + CHART_ROW_HEIGHT / 2
}

function endYear(record: HistoryRecord): number {
  return resolveEndYear(record.end, currentYear)
}

function recordAge(record: HistoryRecord): number | null {
  if (selectedYear.value === null || record.category !== 'people') return null
  if (selectedYear.value > endYear(record)) return null
  return ageAtYear(record.start, selectedYear.value)
}

function selectYear(event: MouseEvent): void {
  if (!yearScale.value) return
  const svg = event.currentTarget as SVGSVGElement
  const bounds = svg.getBoundingClientRect()
  const viewBoxX = (event.clientX - bounds.left) * (layout.value.width / bounds.width)
  selectedYear.value = yearFromX(viewBoxX, yearScale.value)
}

onMounted(() => {
  if (!container.value) return
  resizeObserver = new ResizeObserver(([entry]) => {
    if (entry) containerWidth.value = entry.contentRect.width
  })
  resizeObserver.observe(container.value)
})

onBeforeUnmount(() => resizeObserver?.disconnect())
</script>

<template>
  <div ref="container" class="timeline-chart-container">
    <p class="chart-help">年表をクリックすると、その年と人物の年齢を表示します。</p>
    <svg
      v-if="yearScale && range"
      class="timeline-chart"
      :height="layout.height"
      role="img"
      :viewBox="`0 0 ${layout.width} ${layout.height}`"
      :width="layout.width"
      aria-labelledby="timeline-chart-title"
      @click="selectYear"
    >
      <title id="timeline-chart-title">選択した人物と組織の歴史年表</title>

      <g class="chart-axis">
        <line
          :x1="layout.plotLeft"
          :x2="layout.plotRight"
          :y1="CHART_MARGIN.top - 18"
          :y2="CHART_MARGIN.top - 18"
        />
        <g v-for="tick in ticks" :key="tick">
          <line
            class="grid-line"
            :x1="yearScale(tick)"
            :x2="yearScale(tick)"
            :y1="CHART_MARGIN.top - 18"
            :y2="layout.height - CHART_MARGIN.bottom"
          />
          <text :x="yearScale(tick)" :y="CHART_MARGIN.top - 26" text-anchor="middle">{{ tick }}</text>
        </g>
      </g>

      <g v-for="(record, index) in records" :key="record.id ?? record.title" class="timeline-row">
        <image
          v-if="record.imageUrl"
          :href="record.imageUrl"
          x="8"
          :y="rowY(index) - 22"
          width="44"
          height="44"
          preserveAspectRatio="xMidYMid slice"
        >
          <title>{{ record.title }}</title>
        </image>
        <text class="record-title" x="60" :y="rowY(index) - 4">{{ record.title }}</text>
        <text class="record-period" x="60" :y="rowY(index) + 16">
          {{ record.start }}〜{{ record.end || '現在' }}
        </text>

        <line
          class="history-line"
          :x1="yearScale(record.start)"
          :x2="yearScale(endYear(record))"
          :y1="rowY(index)"
          :y2="rowY(index)"
        />
        <circle class="endpoint" :cx="yearScale(record.start)" :cy="rowY(index)" r="5" />
        <circle class="endpoint" :cx="yearScale(endYear(record))" :cy="rowY(index)" r="5" />

        <circle
          v-for="event in record.events"
          :key="`${record.id ?? record.title}-${event.start}-${event.content}`"
          class="event-point"
          :cx="yearScale(event.start)"
          :cy="rowY(index)"
          r="5"
        >
          <title>{{ event.start }}：{{ event.content }}</title>
        </circle>

        <text
          v-if="recordAge(record) !== null"
          class="age-label"
          :x="yearScale(selectedYear ?? record.start) + 7"
          :y="rowY(index) + 20"
        >
          {{ recordAge(record) }}歳
        </text>
      </g>

      <g v-if="selectedYear !== null" class="selected-year" pointer-events="none">
        <line
          :x1="yearScale(selectedYear)"
          :x2="yearScale(selectedYear)"
          :y1="CHART_MARGIN.top - 18"
          :y2="layout.height - CHART_MARGIN.bottom"
        />
        <text :x="yearScale(selectedYear)" :y="layout.height - 8" text-anchor="middle">
          {{ selectedYear }}年
        </text>
      </g>
    </svg>
  </div>
</template>
