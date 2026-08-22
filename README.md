# TimeLends

Vue 3とD3で、歴史上の人物や組織の関係を年表として可視化するSPAです。

Visualize connected histories.

![https://s3-ap-northeast-1.amazonaws.com/public.jacoyutorius.com/d3-history-timeline.gif](https://s3-ap-northeast-1.amazonaws.com/public.jacoyutorius.com/d3-history-timeline.gif)

![https://s3-ap-northeast-1.amazonaws.com/public.jacoyutorius.com/d3-history-timeline.jpg](https://s3-ap-northeast-1.amazonaws.com/public.jacoyutorius.com/d3-history-timeline.jpg)

## 開発環境

Node.js 24以降を使用してください。

```bash
npm install
npm run dev
```

開発サーバーは`http://localhost:4000`で起動します。

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm test           # Vitest
npm run build      # 型検査と本番ビルド
```

Vue 3への段階的な移行方針は[`docs/modernization-plan.md`](docs/modernization-plan.md)、データ形式は[`docs/data-schema.md`](docs/data-schema.md)、データ拡充の進め方は[`docs/data-expansion-guide.md`](docs/data-expansion-guide.md)、公開方法は[`docs/cloudflare-deployment.md`](docs/cloudflare-deployment.md)を参照してください。旧Nuxt実装は機能移植が完了するまで比較用に残しています。

## データ

同梱データは`src/data/bundledTimeline.json`にあります。レコード形式、ID、日付、出典の規約は[`docs/data-schema.md`](docs/data-schema.md)を参照してください。

通常は同梱データを使用します。外部APIへ接続する場合は、`VITE_HISTORY_API_URL`と`VITE_SAMPLE_API_URL`に現行スキーマのJSONを返すURLを設定してください。
