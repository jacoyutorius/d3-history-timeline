# Cloudflare Pagesデプロイ手順

## 方針

このアプリはサーバー処理を持たないVue 3製SPAとしてCloudflare Pagesへ配信する。GitHub連携を利用し、`master`への更新を本番、その他のブランチとプルリクエストをプレビューとして扱う。

Cloudflare Pagesは、出力のトップ階層に`404.html`がない場合、存在しないパスをSPAのルートへフォールバックする。そのため、Vue Routerの`/about`を直接開くための独自リダイレクトは追加しない。

## Pagesプロジェクトの設定

Cloudflare Dashboardの「Workers & Pages」から既存Gitリポジトリを接続し、次の値を設定する。

| 項目 | 値 |
| --- | --- |
| Production branch | `master` |
| Framework preset | Vue、またはNone |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/`（未指定） |

Node.jsは`.node-version`により24系を使用する。Dashboardで上書きする場合は、ProductionとPreviewの両方に`NODE_VERSION=24`を設定する。

## 環境変数

APIを使用しない場合、追加設定は不要で、アプリは同梱データを利用する。外部APIを使用する場合は、ProductionとPreviewそれぞれに次を設定する。

- `VITE_HISTORY_API_URL`：新スキーマの履歴配列を返すURL
- `VITE_SAMPLE_API_URL`：新スキーマのサンプル配列を返すURL

`VITE_`で始まる値はビルド成果物へ埋め込まれ、ブラウザから参照できる。APIトークンなどの秘密情報は設定しないこと。

## デプロイ前確認

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

ローカルでは`/`と`/about`を直接開き、人物・組織・運動・サンプルの選択、イベントツールチップ、詳細パネル、外部画像を確認する。

## 初回デプロイ後の確認

1. 発行された`*.pages.dev`のトップページを開く。
2. `https://<project>.pages.dev/about`をアドレスバーから直接開く。
3. プレビューURLでも同梱データと年表が表示されることを確認する。
4. APIを設定した場合は、ブラウザの開発者ツールでCORSエラーがないことを確認する。
5. 問題がなければカスタムドメインを追加する。

Cloudflare側のキャッシュ設定は、Pagesの既定値を使用する。独自のCache Rulesは、更新後に古いアセットが残る原因になるため必要性が確認できるまで追加しない。
