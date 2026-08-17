<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

import { formatHistoricalDate, formatHistoricalPeriod } from '../domain/historicalDate'
import { calculateTimelineRange, resolveEndYear } from '../domain/timelineRange'
import {
  ageAtYear,
  calculateTimelineLayout,
  CHART_MARGIN,
  CHART_ROW_HEIGHT,
  createYearScale,
  yearFromX,
} from '../domain/timelineScale'
import type { HistoryRecord, TimelineEvent } from '../types/timeline'

const props = defineProps<{ records: HistoryRecord[] }>()

const currentYear = new Date().getFullYear()
const container = useTemplateRef<HTMLElement>('container')
const containerWidth = ref(0)
const selectedYear = ref<number | null>(null)
const activeRecord = ref<HistoryRecord | null>(null)
const eventTooltip = ref<{
  event: TimelineEvent
  record: HistoryRecord
  x: number
  y: number
} | null>(null)
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
  return resolveEndYear(record.period.end, currentYear)
}

function recordAge(record: HistoryRecord): number | null {
  if (selectedYear.value === null || record.category !== 'person') return null
  if (selectedYear.value > endYear(record)) return null
  return ageAtYear(record.period.start.year, selectedYear.value)
}

function selectYear(event: MouseEvent): void {
  if (!yearScale.value) return
  const svg = event.currentTarget as SVGSVGElement
  const bounds = svg.getBoundingClientRect()
  const viewBoxX = (event.clientX - bounds.left) * (layout.value.width / bounds.width)
  selectedYear.value = yearFromX(viewBoxX, yearScale.value)
}

function showEventTooltip(
  record: HistoryRecord,
  timelineEvent: TimelineEvent,
  domEvent: Event,
): void {
  if (!container.value) return
  const target = domEvent.currentTarget as SVGCircleElement
  const targetBounds = target.getBoundingClientRect()
  const containerBounds = container.value.getBoundingClientRect()
  eventTooltip.value = {
    event: timelineEvent,
    record,
    x: targetBounds.left - containerBounds.left + container.value.scrollLeft,
    y: targetBounds.bottom - containerBounds.top + container.value.scrollTop + 8,
  }
}

function hideEventTooltip(): void {
  eventTooltip.value = null
}

function selectEventYear(timelineEvent: TimelineEvent): void {
  selectedYear.value = timelineEvent.date.year
}

function showRecord(record: HistoryRecord): void {
  activeRecord.value = record
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
  <div class="timeline-chart-shell">
    <p class="chart-help">年表をクリックすると年齢を表示します。名称を選ぶと詳細を確認できます。</p>
    <div ref="container" class="timeline-chart-container">
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

      <g
        v-for="(record, index) in records"
        :key="record.id"
        class="timeline-row"
        :class="`category-${record.category}`"
      >
        <g
          class="record-summary"
          role="button"
          tabindex="0"
          :aria-label="`${record.title}の詳細を表示`"
          @click.stop="showRecord(record)"
          @keydown.enter.prevent="showRecord(record)"
          @keydown.space.prevent="showRecord(record)"
        >
          <image
            v-if="record.image"
            :href="record.image.url"
            x="8"
            :y="rowY(index) - 22"
            width="44"
            height="44"
            preserveAspectRatio="xMidYMid slice"
          >
            <title>{{ record.image.alt }}</title>
          </image>
          <text class="record-title" x="60" :y="rowY(index) - 4">{{ record.title }}</text>
          <text class="record-period" x="60" :y="rowY(index) + 16">
            {{ formatHistoricalPeriod(record.period.start, record.period.end) }}
          </text>
        </g>

        <line
          class="history-line"
          :x1="yearScale(record.period.start.year)"
          :x2="yearScale(endYear(record))"
          :y1="rowY(index)"
          :y2="rowY(index)"
        />
        <circle class="endpoint" :cx="yearScale(record.period.start.year)" :cy="rowY(index)" r="5" />
        <circle class="endpoint" :cx="yearScale(endYear(record))" :cy="rowY(index)" r="5" />

        <circle
          v-for="event in record.events"
          :key="event.id"
          class="event-point"
          :cx="yearScale(event.date.year)"
          :cy="rowY(index)"
          r="5"
          tabindex="0"
          role="button"
          :aria-label="`${record.title}、${formatHistoricalDate(event.date)}、${event.title}`"
          @click.stop="selectEventYear(event)"
          @mouseenter="showEventTooltip(record, event, $event)"
          @mouseleave="hideEventTooltip"
          @focus="showEventTooltip(record, event, $event)"
          @blur="hideEventTooltip"
        >
          <title>{{ event.date.year }}：{{ event.title }}</title>
        </circle>

        <text
          v-if="recordAge(record) !== null"
          class="age-label"
          :x="yearScale(selectedYear ?? record.period.start.year) + 7"
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

      <aside
        v-if="eventTooltip"
        class="event-tooltip"
        :style="{ left: `${eventTooltip.x}px`, top: `${eventTooltip.y}px` }"
        role="tooltip"
      >
        <strong>{{ formatHistoricalDate(eventTooltip.event.date) }}：{{ eventTooltip.event.title }}</strong>
        <span>{{ eventTooltip.record.title }}</span>
        <p v-if="eventTooltip.event.description">{{ eventTooltip.event.description }}</p>
      </aside>
    </div>

    <aside v-if="activeRecord" class="record-details" aria-live="polite">
      <div class="record-details-heading">
        <div>
          <span class="detail-category">{{ activeRecord.category }}</span>
          <h3>{{ activeRecord.title }}</h3>
        </div>
        <button class="icon-button" type="button" aria-label="詳細を閉じる" @click="activeRecord = null">×</button>
      </div>
      <p>{{ activeRecord.description }}</p>
      <dl>
        <dt>期間</dt>
        <dd>{{ formatHistoricalPeriod(activeRecord.period.start, activeRecord.period.end) }}</dd>
        <dt>イベント</dt>
        <dd>{{ activeRecord.events.length }}件</dd>
      </dl>
      <div v-if="activeRecord.sources.length">
        <h4>出典</h4>
        <ul>
          <li v-for="source in activeRecord.sources" :key="source.url">
            <a :href="source.url" target="_blank" rel="noreferrer">{{ source.title }}</a>
          </li>
        </ul>
      </div>
    </aside>
  </div>
</template>
