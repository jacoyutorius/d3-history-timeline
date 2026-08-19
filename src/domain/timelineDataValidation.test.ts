import { describe, expect, it } from 'vitest'

import { bundledHistories, bundledSamples } from '../data/bundledTimeline'
import type { HistoryRecord, TimelineSample } from '../types/timeline'
import { validateTimelineData } from './timelineDataValidation'

const baseRecord = (overrides: Partial<HistoryRecord> = {}): HistoryRecord => ({
  id: 'record-a',
  title: 'Record A',
  category: 'person',
  description: '説明',
  period: { start: { year: 1900 }, end: { year: 1950 } },
  events: [
    {
      id: 'record-a-event',
      date: { year: 1920 },
      title: 'Event',
      sources: [{ title: 'Source', url: 'https://example.com/event' }],
    },
  ],
  sources: [{ title: 'Source', url: 'https://example.com/record' }],
  ...overrides,
})

const baseSample = (overrides: Partial<TimelineSample> = {}): TimelineSample => ({
  id: 'sample-a',
  title: 'Sample A',
  description: '説明',
  recordIds: ['record-a'],
  ...overrides,
})

describe('validateTimelineData', () => {
  it('同梱データがスキーマ上の参照整合性を満たしている', () => {
    expect(validateTimelineData(bundledHistories, bundledSamples)).toEqual([])
  })

  it('重複したレコードIDとサンプルIDを検出する', () => {
    const issues = validateTimelineData(
      [baseRecord(), baseRecord({ title: 'Record A Duplicate' })],
      [baseSample(), baseSample({ title: 'Sample A Duplicate' })],
    )

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'histories', message: 'レコードID "record-a" が重複しています。' }),
      expect.objectContaining({ path: 'samples', message: 'サンプルID "sample-a" が重複しています。' }),
    ]))
  })

  it('参照先が存在しないサンプルのrecordIdsを検出する', () => {
    const issues = validateTimelineData(
      [baseRecord()],
      [baseSample({ recordIds: ['record-a', 'missing-record'] })],
    )

    expect(issues).toContainEqual({
      path: 'samples[0].recordIds[1]',
      message: '参照先レコードID "missing-record" が存在しません。',
    })
  })

  it('レコード期間の逆転と期間外イベントを検出する', () => {
    const issues = validateTimelineData(
      [
        baseRecord({
          period: { start: { year: 1950 }, end: { year: 1900 } },
          events: [
            {
              id: 'before-record',
              date: { year: 1949 },
              title: 'Before',
              sources: [],
            },
            {
              id: 'after-record',
              date: { year: 1951 },
              title: 'After',
              sources: [],
            },
          ],
        }),
      ],
      [baseSample()],
    )

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'histories[0].period', message: '開始日は終了日以前にしてください。' }),
      expect.objectContaining({ path: 'histories[0].events[0].date', message: 'イベント日はレコードの終了日以前にしてください。' }),
      expect.objectContaining({ path: 'histories[0].events[1].date', message: 'イベント日はレコードの終了日以前にしてください。' }),
    ]))
  })

  it('日だけ指定された不正な日付を検出する', () => {
    const issues = validateTimelineData(
      [baseRecord({ period: { start: { year: 1900, day: 1 }, end: null } })],
      [baseSample()],
    )

    expect(issues).toContainEqual({
      path: 'histories[0].period.start.day',
      message: '日を指定する場合は月も指定してください。',
    })
  })

  it('画像メタデータの不備を検出する', () => {
    const issues = validateTimelineData(
      [
        baseRecord({
          image: {
            url: 'https://example.com/image.jpg',
            alt: '画像',
            sourceUrl: '',
            creator: '',
            license: '',
            licenseUrl: '',
          } as HistoryRecord['image'],
        }),
      ],
      [baseSample()],
    )

    expect(issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ path: 'histories[0].image.sourceUrl', message: '画像の出典URLを指定してください。' }),
      expect.objectContaining({ path: 'histories[0].image.creator', message: '画像の作者を指定してください。' }),
      expect.objectContaining({ path: 'histories[0].image.license', message: '画像ライセンスを指定してください。' }),
      expect.objectContaining({ path: 'histories[0].image.licenseUrl', message: '画像ライセンスURLを指定してください。' }),
      expect.objectContaining({ path: 'histories[0].image.modified', message: '画像の改変有無をtrueまたはfalseで指定してください。' }),
    ]))
  })
})
