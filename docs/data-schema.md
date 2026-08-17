# 年表データスキーマ

## 基本方針

年表データは、表示文言ではなく安定した`id`で関連付ける。年の座標計算に必要な情報と、出典・画像などの表示情報を分離し、人物以外にも同じ構造を利用する。TypeScript上の正式な定義は`src/types/timeline.ts`を参照すること。

## HistoryRecord

| フィールド | 必須 | 説明 |
| --- | --- | --- |
| `id` | 必須 | URLで安全に扱える一意なkebab-case識別子 |
| `title` | 必須 | 画面に表示する名称 |
| `category` | 必須 | `person`、`organization`、`movement`のいずれか |
| `description` | 必須 | 対象を簡潔に説明する文章 |
| `period.start` | 必須 | 活動開始日。人物の場合は生年月日 |
| `period.end` | 必須 | 活動終了日。人物の場合は没年月日。継続中は`null` |
| `events` | 必須 | 対象に関連する出来事の配列 |
| `image` | 任意 | 画像URL、代替テキスト、任意の出典URL |
| `sources` | 必須 | レコード全体の根拠となる出典の配列 |

日付は`{ year, month?, day? }`形式とする。分からない月日を推測で補完せず、判明している精度まで記録する。

## TimelineEvent

イベントには一意な`id`、`date`、短い`title`、任意の`description`、`sources`を持たせる。原則として、イベント日は親レコードの期間内に収める。

## TimelineSample

サンプルは`id`、`title`、`description`、`recordIds`を持つ。`recordIds`にはタイトルではなく`HistoryRecord.id`を指定する。これにより、表示名を変更してもサンプル選択が壊れない。

## 記述例

```json
{
  "id": "example-person",
  "title": "Example Person",
  "category": "person",
  "description": "人物の簡潔な説明。",
  "period": {
    "start": { "year": 1900, "month": 1, "day": 1 },
    "end": null
  },
  "events": [
    {
      "id": "example-person-first-work",
      "date": { "year": 1925 },
      "title": "最初の作品を発表",
      "sources": []
    }
  ],
  "sources": [
    { "title": "出典名", "url": "https://example.com/source" }
  ]
}
```

`selected`などの画面状態は永続データへ保存しない。読み込み後に`SelectableHistoryRecord`として付与する。
