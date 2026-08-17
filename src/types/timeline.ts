export type HistoryCategory = 'people' | 'organization'

export interface TimelineEvent {
  id?: string
  start: number
  content: string
}

export interface HistoryRecord {
  id?: string
  title: string
  category: HistoryCategory
  start: number
  /** 0は現在も継続中であることを表す。 */
  end: number
  events: TimelineEvent[]
  birth?: string
  dead?: string
  imageUrl?: string
  selected?: boolean
}

export interface TimelineSample {
  title: string
  peoples: string[]
  organizations: string[]
  selected?: boolean
}
