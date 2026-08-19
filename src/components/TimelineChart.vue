<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'

import { formatHistoricalDate, formatHistoricalPeriod } from '../domain/historicalDate'
import { calculateTimelineRange, resolveEndYear } from '../domain/timelineRange'
import {
  ageAtDate,
  calculateTimelineLayout,
  CHART_MARGIN,
  createYearScale,
  timelineRowHeight,
  yearFromX,
} from '../domain/timelineScale'
import type { HistoricalDate, HistoryRecord, TimelineEvent } from '../types/timeline'

const props = defineProps<{ records: HistoryRecord[] }>()
const emit = defineEmits<{
  deselectRecord: [recordId: string]
}>()
type DetailMode = 'panel' | 'dialog'

const RECORD_LABEL_X = 60
const REMOVE_BUTTON_SIZE = 14
const REMOVE_BUTTON_GAP = 14
const LABEL_TO_ACTION_GAP = 10
const currentYear = new Date().getFullYear()
const container = useTemplateRef<HTMLElement>('container')
const recordDetails = useTemplateRef<HTMLElement>('recordDetails')
const containerWidth = ref(0)
const selectedDate = ref<HistoricalDate | null>(null)
const activeRecord = ref<HistoryRecord | null>(null)
const detailMode = ref<DetailMode>('dialog')
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
const selectedYear = computed(() => selectedDate.value?.year ?? null)
const ticks = computed(() => yearScale.value?.ticks(8) ?? [])
const rowHeight = computed(() => timelineRowHeight(props.records.length))

function rowY(index: number): number {
  return CHART_MARGIN.top + index * rowHeight.value + rowHeight.value / 2
}

function removeButtonX(): number {
  return layout.value.plotLeft - REMOVE_BUTTON_SIZE - REMOVE_BUTTON_GAP
}

function labelClipWidth(): number {
  return Math.max(72, removeButtonX() - RECORD_LABEL_X - LABEL_TO_ACTION_GAP)
}

function recordLabelClipId(record: HistoryRecord): string {
  return `record-label-${record.id}`
}

function endYear(record: HistoryRecord): number {
  return resolveEndYear(record.period.end, currentYear)
}

function recordAgeLabel(record: HistoryRecord): string | null {
  if (selectedDate.value === null || record.category !== 'person') return null
  if (selectedDate.value.year > endYear(record)) return null
  const result = ageAtDate(record.period.start, selectedDate.value)
  if (!result) return null
  return result.exact ? `${result.age}歳` : `約${result.age}歳`
}

function hasImageCredit(record: HistoryRecord): boolean {
  return record.image?.sourceUrl !== undefined
    || record.image?.creator !== undefined
    || record.image?.license !== undefined
    || record.image?.modified !== undefined
}

function selectYear(event: MouseEvent): void {
  if (!yearScale.value) return
  const svg = event.currentTarget as SVGSVGElement
  const bounds = svg.getBoundingClientRect()
  const viewBoxX = (event.clientX - bounds.left) * (layout.value.width / bounds.width)
  selectedDate.value = { year: yearFromX(viewBoxX, yearScale.value) }
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
  selectedDate.value = timelineEvent.date
}

function showRecord(record: HistoryRecord): void {
  activeRecord.value = record
}

function closeRecord(): void {
  activeRecord.value = null
}

function deselectRecord(record: HistoryRecord): void {
  if (activeRecord.value?.id === record.id) closeRecord()
  emit('deselectRecord', record.id)
}

onMounted(() => {
  if (!container.value) return
  resizeObserver = new ResizeObserver(([entry]) => {
    if (entry) containerWidth.value = entry.contentRect.width
  })
  resizeObserver.observe(container.value)
})

onBeforeUnmount(() => resizeObserver?.disconnect())

watch([activeRecord, detailMode], async () => {
  if (!activeRecord.value || detailMode.value !== 'dialog') return
  await nextTick()
  recordDetails.value?.focus()
})
</script>

<template>
  <div class="timeline-chart-shell">
    <div class="chart-header">
      <p class="chart-help">年表をクリックすると年を選択できます。名称で詳細を開き、イベント点で出来事の年に移動できます。</p>
      <fieldset class="detail-mode-control">
        <legend>詳細表示</legend>
        <div class="segmented-control">
          <label :class="{ active: detailMode === 'panel' }">
            <input v-model="detailMode" type="radio" value="panel">
            下部
          </label>
          <label :class="{ active: detailMode === 'dialog' }">
            <input v-model="detailMode" type="radio" value="dialog">
            モーダル
          </label>
        </div>
      </fieldset>
    </div>

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

      <defs>
        <clipPath v-for="record in records" :id="recordLabelClipId(record)" :key="record.id">
          <rect
            :x="RECORD_LABEL_X"
            y="0"
            :width="labelClipWidth()"
            :height="layout.height"
          />
        </clipPath>
      </defs>

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
          <g :clip-path="`url(#${recordLabelClipId(record)})`">
            <text class="record-title" :x="RECORD_LABEL_X" :y="rowY(index) - 4">
              {{ record.title }}
            </text>
            <text class="record-period" :x="RECORD_LABEL_X" :y="rowY(index) + 16">
              {{ formatHistoricalPeriod(record.period.start, record.period.end) }}
            </text>
          </g>
        </g>

        <g
          class="record-remove-button"
          role="button"
          tabindex="0"
          :aria-label="`${record.title}を年表から外す`"
          @click.stop="deselectRecord(record)"
          @keydown.enter.prevent.stop="deselectRecord(record)"
          @keydown.space.prevent.stop="deselectRecord(record)"
        >
          <rect
            :x="removeButtonX()"
            :y="rowY(index) - REMOVE_BUTTON_SIZE / 2"
            :width="REMOVE_BUTTON_SIZE"
            :height="REMOVE_BUTTON_SIZE"
            rx="5"
          />
          <line
            :x1="removeButtonX() + 4"
            :x2="removeButtonX() + 10"
            :y1="rowY(index) - 3"
            :y2="rowY(index) + 3"
          />
          <line
            :x1="removeButtonX() + 10"
            :x2="removeButtonX() + 4"
            :y1="rowY(index) - 3"
            :y2="rowY(index) + 3"
          />
          <title>{{ record.title }}を年表から外す</title>
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
          v-if="recordAgeLabel(record) !== null"
          class="age-label"
          :x="yearScale(selectedYear ?? record.period.start.year) + 7"
          :y="rowY(index) + 20"
        >
          {{ recordAgeLabel(record) }}
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

    <aside
      v-if="activeRecord"
      ref="recordDetails"
      class="record-details"
      :class="{ 'record-details-dialog': detailMode === 'dialog' }"
      :role="detailMode === 'dialog' ? 'dialog' : undefined"
      :aria-modal="detailMode === 'dialog' ? 'true' : undefined"
      aria-live="polite"
      aria-labelledby="record-details-title"
      tabindex="-1"
      @click.self="detailMode === 'dialog' && closeRecord()"
      @keydown.esc="closeRecord"
    >
      <div class="record-details-content">
        <div class="record-details-heading">
          <div>
            <span class="detail-category">{{ activeRecord.category }}</span>
            <h3 id="record-details-title">{{ activeRecord.title }}</h3>
          </div>
          <button class="icon-button" type="button" aria-label="詳細を閉じる" @click="closeRecord">×</button>
        </div>
        <figure v-if="activeRecord.image" class="record-detail-image">
          <img :src="activeRecord.image.url" :alt="activeRecord.image.alt">
          <figcaption v-if="hasImageCredit(activeRecord)">
            <span v-if="activeRecord.image.creator">画像: {{ activeRecord.image.creator }}</span>
            <a
              v-if="activeRecord.image.license && activeRecord.image.licenseUrl"
              :href="activeRecord.image.licenseUrl"
              target="_blank"
              rel="noreferrer"
            >
              {{ activeRecord.image.license }}
            </a>
            <span v-else-if="activeRecord.image.license">{{ activeRecord.image.license }}</span>
            <a
              v-if="activeRecord.image.sourceUrl"
              :href="activeRecord.image.sourceUrl"
              target="_blank"
              rel="noreferrer"
            >
              出典
            </a>
            <span v-if="activeRecord.image.modified !== undefined">
              {{ activeRecord.image.modified ? '変更あり' : '変更なし' }}
            </span>
          </figcaption>
        </figure>
        <p>{{ activeRecord.description }}</p>
        <dl>
          <dt>期間</dt>
          <dd>{{ formatHistoricalPeriod(activeRecord.period.start, activeRecord.period.end) }}</dd>
          <dt>イベント</dt>
          <dd>{{ activeRecord.events.length }}件</dd>
        </dl>
        <div v-if="activeRecord.events.length">
          <h4>イベント</h4>
          <ol class="detail-event-list">
            <li v-for="event in activeRecord.events" :key="event.id">
              <span>{{ formatHistoricalDate(event.date) }}</span>
              <strong>{{ event.title }}</strong>
              <p v-if="event.description">{{ event.description }}</p>
              <ul v-if="event.sources.length" class="inline-source-list">
                <li v-for="source in event.sources" :key="source.url">
                  <a :href="source.url" target="_blank" rel="noreferrer">{{ source.title }}</a>
                </li>
              </ul>
            </li>
          </ol>
        </div>
        <div v-if="activeRecord.sources.length">
          <h4>出典</h4>
          <ul>
            <li v-for="source in activeRecord.sources" :key="source.url">
              <a :href="source.url" target="_blank" rel="noreferrer">{{ source.title }}</a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  </div>
</template>
