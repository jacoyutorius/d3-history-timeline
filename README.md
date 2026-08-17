# d3-history-timeline

Vue 3とD3で、歴史上の人物や組織の関係を年表として可視化するSPAです。

Visualize History.

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

Vue 3への段階的な移行方針は[`docs/modernization-plan.md`](docs/modernization-plan.md)、データ形式は[`docs/data-schema.md`](docs/data-schema.md)を参照してください。旧Nuxt実装は機能移植が完了するまで比較用に残しています。

## テストデータ

同梱データは`src/data/bundledTimeline.ts`にあります。レコード形式、ID、日付、出典の規約は[`docs/data-schema.md`](docs/data-schema.md)を参照してください。


ローカルAPIが必要な場合は、Sinatraサーバーを起動します。

```bash
bundle install --path .bundle
bundle exec ruby api/app.rb
curl localhost:4567/data
```
