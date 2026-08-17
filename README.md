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

Vue 3への段階的な移行方針は[`docs/modernization-plan.md`](docs/modernization-plan.md)を参照してください。旧Nuxt実装は機能移植が完了するまで比較用に残しています。

## テストデータ

レコードのフォーマットは以下の通り。

**format**

```json
{ 
  title: "Walter Adolph Georg Gropius",
  category: "people",
  start: 1883,
  end: 1969,
  events: [
    {start: 1919, content: "Become the first principal of Bauhaus"},
  ], 
  birth: "1883.5.18",
  dead: "1969.7.5",
  imageUrl: "" 
},
```


ローカルAPIが必要な場合は、Sinatraサーバーを起動します。

```bash
bundle install --path .bundle
bundle exec ruby api/app.rb
curl localhost:4567/data
```
