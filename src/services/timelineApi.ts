import { bundledHistories, bundledSamples } from '../data/bundledTimeline'
import type { HistoryRecord, TimelineSample } from '../types/timeline'

export interface TimelineData {
  histories: HistoryRecord[]
  samples: TimelineSample[]
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`${url} の取得に失敗しました（${response.status}）`)
  }
  return response.json() as Promise<T>
}

export async function loadTimelineData(): Promise<TimelineData> {
  const historyUrl = import.meta.env.VITE_HISTORY_API_URL
  const sampleUrl = import.meta.env.VITE_SAMPLE_API_URL

  // 接続先が未設定の開発環境やプレビューでは、再現可能な同梱データを使う。
  if (!historyUrl || !sampleUrl) {
    return {
      histories: structuredClone(bundledHistories),
      samples: structuredClone(bundledSamples),
    }
  }

  const [histories, samples] = await Promise.all([
    fetchJson<HistoryRecord[]>(historyUrl),
    fetchJson<TimelineSample[]>(sampleUrl),
  ])

  return { histories, samples }
}
