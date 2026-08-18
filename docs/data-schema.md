# 年表JSONデータ仕様

## 対象ファイル

`src/data/`配下の年表データは、同梱データとして`*.json`に保存する。アプリ側では`src/data/bundledTimeline.ts`が`src/data/*.json`をファイル名順に読み込み、`src/types/timeline.ts`の型に合わせて`histories`と`samples`をマージしたうえで、`bundledHistories`と`bundledSamples`として公開する。

テーマごとにJSONを分けられる。新しい同梱データを追加する場合は、`src/data/<topic>.json`を作成してこの仕様に合わせる。

外部APIから同じ形式のデータを返す場合も、この仕様に合わせる。

```json
{
  "histories": [],
  "samples": []
}
```

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `histories` | `HistoryRecord[]` | 必須 | 年表に表示する人物、組織、運動のレコード配列 |
| `samples` | `TimelineSample[]` | 必須 | まとめて選択するプリセット配列 |

`selected`などの画面状態はJSONに保存しない。読み込み後に`SelectableHistoryRecord`として付与する。

## HistoryRecord

`histories`の各要素は、年表上に1本の期間バーとして表示される。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `id` | `string` | 必須 | レコードを参照する一意な識別子 |
| `title` | `string` | 必須 | 画面に表示する名称 |
| `category` | `'person' \| 'organization' \| 'movement'` | 必須 | レコード種別 |
| `description` | `string` | 必須 | 対象を簡潔に説明する文章 |
| `period.start` | `HistoricalDate` | 必須 | 期間の開始日。人物では生年月日 |
| `period.end` | `HistoricalDate \| null` | 必須 | 期間の終了日。人物では没年月日。継続中は`null` |
| `events` | `TimelineEvent[]` | 必須 | 対象に関連する出来事の配列 |
| `image` | `TimelineImage` | 任意 | 詳細表示に使う画像情報 |
| `sources` | `SourceReference[]` | 必須 | レコード全体の根拠となる出典配列 |

### `id`

- `histories`内で重複しない値にする。
- サンプルの`recordIds`から参照されるため、表示名の変更に影響されない安定した値にする。
- URLやCSSセレクタで扱いやすいように、原則として小文字英数字とハイフンのkebab-caseを使う。
- 空文字は不可。

### `category`

| 値 | 用途 |
| --- | --- |
| `person` | 人物 |
| `organization` | 学校、会社、団体、拠点など |
| `movement` | 芸術運動、ジャンル、思想潮流など |

## HistoricalDate

日付は`year`のみ必須で、判明している精度までを記録する。分からない月日を推測で補完しない。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `year` | `number` | 必須 | 年。整数 |
| `month` | `number` | 任意 | 月。1から12の整数 |
| `day` | `number` | 任意 | 日。1から31の整数 |

```json
{ "year": 1919 }
```

```json
{ "year": 1919, "month": 4 }
```

```json
{ "year": 1933, "month": 7, "day": 20 }
```

`day`を指定する場合は`month`も必ず指定する。`{ "year": 1900, "day": 1 }`のような形式は不可。

期間やイベント日の比較では、月日が省略された日付を期間の端として扱う。開始側では省略月日を年初寄り、終了側では年末寄りに解釈するため、`{ "year": 1919 }`から`{ "year": 1925 }`までの期間内に`{ "year": 1925 }`のイベントを置ける。

## TimelineEvent

`events`の各要素は、親レコードの期間バー上に表示される出来事を表す。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `id` | `string` | 必須 | 親レコード内で一意なイベント識別子 |
| `date` | `HistoricalDate` | 必須 | 出来事の日付 |
| `title` | `string` | 必須 | 画面に表示する短い出来事名 |
| `description` | `string` | 任意 | 補足説明 |
| `sources` | `SourceReference[]` | 必須 | イベントの根拠となる出典配列 |

イベント日は親レコードの`period.start`以降、かつ`period.end`以前にする。`period.end`が`null`の継続中レコードでは、終了日側の制約はない。

イベントIDはレコードをまたいで重複してもよいが、同じ親レコード内では重複不可。

## TimelineImage

`image`は任意。画像を設定する場合は`url`と`alt`を必ず指定する。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `url` | `string` | 必須 | 画像URL |
| `alt` | `string` | 必須 | 画像の代替テキスト |
| `sourceUrl` | `string` | 任意 | 画像の出典URL |

## SourceReference

`sources`はレコード全体、またはイベント単位の根拠を表す。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `title` | `string` | 必須 | 出典名 |
| `url` | `string` | 必須 | 出典URL |

`title`と`url`は空文字不可。出典が未確認のデータを追加する場合でも、最終的にはレコード単位とイベント単位で根拠を持たせる。

## TimelineSample

`samples`の各要素は、複数の`HistoryRecord`をまとめて選択するプリセットを表す。

| フィールド | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `id` | `string` | 必須 | サンプルを識別する一意なID |
| `title` | `string` | 必須 | 画面に表示するサンプル名 |
| `description` | `string` | 必須 | サンプルの説明 |
| `recordIds` | `string[]` | 必須 | このサンプルで選択する`HistoryRecord.id`の配列 |

`recordIds`には`title`ではなく、必ず`HistoryRecord.id`を指定する。存在しないIDや同じサンプル内での重複IDは不可。

## 記述例

```json
{
  "histories": [
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
          "description": "必要な場合だけ補足説明を書く。",
          "sources": [
            { "title": "イベント出典", "url": "https://example.com/event" }
          ]
        }
      ],
      "image": {
        "url": "https://example.com/image.jpg",
        "alt": "Example Personの肖像",
        "sourceUrl": "https://example.com/image-source"
      },
      "sources": [
        { "title": "レコード出典", "url": "https://example.com/source" }
      ]
    }
  ],
  "samples": [
    {
      "id": "example-sample",
      "title": "Example Sample",
      "description": "例示用のサンプル。",
      "recordIds": ["example-person"]
    }
  ]
}
```

## 検証ルール

`src/domain/timelineDataValidation.ts`で次の整合性を検証している。

- `histories[].id`の重複がない。
- `samples[].id`の重複がない。
- 必須の文字列フィールドが空文字ではない。
- `HistoricalDate.year`、`month`、`day`が整数で、月日は範囲内にある。
- `day`だけを指定していない。
- `period.start`が`period.end`以前である。
- イベント日が親レコードの期間内にある。
- 同じ親レコード内で`events[].id`の重複がない。
- `samples[].recordIds`が存在するレコードIDを参照している。
- 同じサンプル内で`recordIds`の重複がない。
- `image.url`と`image.alt`が空文字ではない。
- `sources[].title`と`sources[].url`が空文字ではない。

データを変更したら、少なくとも次を実行する。

```sh
npm test -- src/domain/timelineDataValidation.test.ts
```

コミット前はプロジェクト標準の確認として、`npm run lint`、`npm run typecheck`、`npm test`も通す。
