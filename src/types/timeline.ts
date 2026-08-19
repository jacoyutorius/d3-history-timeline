export type HistoryCategory = 'person' | 'organization' | 'movement'

export interface HistoricalDate {
  year: number
  month?: number
  day?: number
}

export interface SourceReference {
  title: string
  url: string
}

export interface TimelineImage {
  url: string
  alt: string
  sourceUrl: string
  creator: string
  license: string
  licenseUrl: string
  modified: boolean
}

export interface TimelineEvent {
  id: string
  date: HistoricalDate
  title: string
  description?: string
  sources: SourceReference[]
}

export interface HistoryRecord {
  id: string
  title: string
  category: HistoryCategory
  description: string
  period: {
    start: HistoricalDate
    /** nullは現在も継続中であることを表す。 */
    end: HistoricalDate | null
  }
  events: TimelineEvent[]
  image?: TimelineImage
  sources: SourceReference[]
}

/** 画面上の選択状態。永続化する年表データには含めない。 */
export interface SelectableHistoryRecord extends HistoryRecord {
  selected: boolean
}

export interface TimelineSample {
  id: string
  title: string
  description: string
  recordIds: string[]
}
