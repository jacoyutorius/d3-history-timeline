import type { HistoricalDate, HistoryRecord, SourceReference, TimelineSample } from '../types/timeline'

export interface TimelineDataValidationIssue {
  path: string
  message: string
}

type PeriodPoint = 'start' | 'end'

function issue(path: string, message: string): TimelineDataValidationIssue {
  return { path, message }
}

function dateToComparableValue(date: HistoricalDate, point: PeriodPoint): number {
  const month = date.month ?? (point === 'start' ? 1 : 12)
  const day = date.day ?? (point === 'start' ? 1 : 31)
  return date.year * 10_000 + month * 100 + day
}

function validateDate(date: HistoricalDate, path: string): TimelineDataValidationIssue[] {
  const issues: TimelineDataValidationIssue[] = []

  if (!Number.isInteger(date.year)) {
    issues.push(issue(`${path}.year`, '年は整数で指定してください。'))
  }

  if (date.month !== undefined && (!Number.isInteger(date.month) || date.month < 1 || date.month > 12)) {
    issues.push(issue(`${path}.month`, '月は1から12の整数で指定してください。'))
  }

  if (date.day !== undefined && (!Number.isInteger(date.day) || date.day < 1 || date.day > 31)) {
    issues.push(issue(`${path}.day`, '日は1から31の整数で指定してください。'))
  }

  if (date.day !== undefined && date.month === undefined) {
    issues.push(issue(`${path}.day`, '日を指定する場合は月も指定してください。'))
  }

  return issues
}

function validateSources(sources: SourceReference[], path: string): TimelineDataValidationIssue[] {
  const issues: TimelineDataValidationIssue[] = []

  sources.forEach((source, index) => {
    if (source.title.trim() === '') {
      issues.push(issue(`${path}[${index}].title`, '出典タイトルを指定してください。'))
    }

    if (source.url.trim() === '') {
      issues.push(issue(`${path}[${index}].url`, '出典URLを指定してください。'))
    }
  })

  return issues
}

function hasDuplicateIds(items: readonly { id: string }[]): string[] {
  const seen = new Set<string>()
  const duplicates = new Set<string>()

  items.forEach(({ id }) => {
    if (seen.has(id)) duplicates.add(id)
    seen.add(id)
  })

  return [...duplicates]
}

function validateRecord(record: HistoryRecord, index: number): TimelineDataValidationIssue[] {
  const path = `histories[${index}]`
  const issues: TimelineDataValidationIssue[] = []

  if (record.id.trim() === '') issues.push(issue(`${path}.id`, 'レコードIDを指定してください。'))
  if (record.title.trim() === '') issues.push(issue(`${path}.title`, 'タイトルを指定してください。'))
  if (record.description.trim() === '') issues.push(issue(`${path}.description`, '説明を指定してください。'))

  issues.push(...validateDate(record.period.start, `${path}.period.start`))
  if (record.period.end !== null) {
    issues.push(...validateDate(record.period.end, `${path}.period.end`))

    if (
      dateToComparableValue(record.period.start, 'start')
      > dateToComparableValue(record.period.end, 'end')
    ) {
      issues.push(issue(`${path}.period`, '開始日は終了日以前にしてください。'))
    }
  }

  hasDuplicateIds(record.events).forEach((id) => {
    issues.push(issue(`${path}.events`, `イベントID "${id}" が重複しています。`))
  })

  record.events.forEach((event, eventIndex) => {
    const eventPath = `${path}.events[${eventIndex}]`

    if (event.id.trim() === '') issues.push(issue(`${eventPath}.id`, 'イベントIDを指定してください。'))
    if (event.title.trim() === '') issues.push(issue(`${eventPath}.title`, 'イベントタイトルを指定してください。'))

    issues.push(...validateDate(event.date, `${eventPath}.date`))
    issues.push(...validateSources(event.sources, `${eventPath}.sources`))

    if (
      dateToComparableValue(event.date, 'end')
      < dateToComparableValue(record.period.start, 'start')
    ) {
      issues.push(issue(`${eventPath}.date`, 'イベント日はレコードの開始日以降にしてください。'))
    }

    if (
      record.period.end !== null
      && dateToComparableValue(event.date, 'start')
      > dateToComparableValue(record.period.end, 'end')
    ) {
      issues.push(issue(`${eventPath}.date`, 'イベント日はレコードの終了日以前にしてください。'))
    }
  })

  issues.push(...validateSources(record.sources, `${path}.sources`))

  if (record.image !== undefined) {
    if (record.image.url.trim() === '') issues.push(issue(`${path}.image.url`, '画像URLを指定してください。'))
    if (record.image.alt.trim() === '') issues.push(issue(`${path}.image.alt`, '画像の代替テキストを指定してください。'))
    if (record.image.sourceUrl !== undefined && record.image.sourceUrl.trim() === '') {
      issues.push(issue(`${path}.image.sourceUrl`, '画像の出典URLを指定してください。'))
    }
    if (record.image.creator !== undefined && record.image.creator.trim() === '') {
      issues.push(issue(`${path}.image.creator`, '画像の作者を指定してください。'))
    }
    if (record.image.license !== undefined && record.image.license.trim() === '') {
      issues.push(issue(`${path}.image.license`, '画像ライセンスを指定してください。'))
    }
    if (record.image.licenseUrl !== undefined && record.image.licenseUrl.trim() === '') {
      issues.push(issue(`${path}.image.licenseUrl`, '画像ライセンスURLを指定してください。'))
    }
  }

  return issues
}

export function validateTimelineData(
  histories: readonly HistoryRecord[],
  samples: readonly TimelineSample[],
): TimelineDataValidationIssue[] {
  const issues: TimelineDataValidationIssue[] = []
  const recordIds = new Set(histories.map(({ id }) => id))

  hasDuplicateIds(histories).forEach((id) => {
    issues.push(issue('histories', `レコードID "${id}" が重複しています。`))
  })

  histories.forEach((record, index) => {
    issues.push(...validateRecord(record, index))
  })

  hasDuplicateIds(samples).forEach((id) => {
    issues.push(issue('samples', `サンプルID "${id}" が重複しています。`))
  })

  samples.forEach((sample, sampleIndex) => {
    const path = `samples[${sampleIndex}]`

    if (sample.id.trim() === '') issues.push(issue(`${path}.id`, 'サンプルIDを指定してください。'))
    if (sample.title.trim() === '') issues.push(issue(`${path}.title`, 'サンプルタイトルを指定してください。'))
    if (sample.description.trim() === '') issues.push(issue(`${path}.description`, 'サンプル説明を指定してください。'))

    hasDuplicateIds(sample.recordIds.map((id) => ({ id }))).forEach((id) => {
      issues.push(issue(`${path}.recordIds`, `参照レコードID "${id}" が重複しています。`))
    })

    sample.recordIds.forEach((recordId, recordIndex) => {
      if (!recordIds.has(recordId)) {
        issues.push(issue(`${path}.recordIds[${recordIndex}]`, `参照先レコードID "${recordId}" が存在しません。`))
      }
    })
  })

  return issues
}
