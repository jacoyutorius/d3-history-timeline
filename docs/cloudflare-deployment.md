# Cloudflare Workersデプロイ手順

## 方針

このアプリはサーバー処理を持たないVue 3製SPAとして、Cloudflare Workers Static Assetsへ配信する。Cloudflareが新規の静的サイトとSPAに推奨しているWorkers Static Assetsを使用し、Pagesは使用しない。

GitHub連携にはWorkers Buildsを使用する。`main`への更新を本番デプロイ、その他のブランチとプルリクエストをプレビュー用バージョンとして扱う。

Vue RouterはHTML5 Historyモードを使用している。`wrangler.jsonc`の`assets.not_found_handling`に`single-page-application`を指定し、`/about`や`/disclaimer`を直接開いた場合も`index.html`へフォールバックさせる。

## Wrangler設定

リポジトリ直下の`wrangler.jsonc`でWorker名、互換日、静的アセットの出力先、SPAフォールバックを管理する。

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "d3-history-timeline",
  "compatibility_date": "2026-08-19",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  }
}
```

Worker名はCloudflare Dashboard上のプロジェクト名と一致させる。アカウント固有のIDやAPIトークンは設定ファイルへ記録しない。

## Workers Buildsの設定

Cloudflare Dashboardの「Workers & Pages」から「Import a repository」を選び、GitHubの`jacoyutorius/d3-history-timeline`を接続する。

| 項目 | 値 |
| --- | --- |
| Worker name | `d3-history-timeline` |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command | `npx wrangler versions upload` |
| Root directory | `/`（未指定） |

Node.jsは`.node-version`により24系を使用する。Dashboardで上書きする場合は、ProductionとPreviewの両方にビルド変数`NODE_VERSION=24`を設定する。

本番ブランチではビルド後に新しいバージョンを有効化する。その他のブランチではバージョンをアップロードするだけに留め、プレビューURLで確認してから`main`へマージする。

## 環境変数

APIを使用しない場合、追加設定は不要で、アプリは同梱データを利用する。外部APIを使用する場合は、ProductionとPreviewそれぞれのビルド変数に次を設定する。

- `VITE_HISTORY_API_URL`：新スキーマの履歴配列を返すURL
- `VITE_SAMPLE_API_URL`：新スキーマのサンプル配列を返すURL

`VITE_`で始まる値はViteのビルド成果物へ埋め込まれ、ブラウザから参照できる。APIトークンなどの秘密情報は設定しないこと。Workerの実行時変数ではなく、ビルド時に参照できるBuild variablesへ設定する。

## デプロイ前確認

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

ローカルでは`/`、`/about`、`/disclaimer`を直接開き、人物・組織・運動・サンプルの選択、イベントツールチップ、詳細パネル、外部画像を確認する。

Wrangler導入後は、認証済みの環境から次のコマンドで手動デプロイも実行できる。

```bash
npx wrangler login
npm run build
npx wrangler deploy
```

通常の本番デプロイにはWorkers Buildsを使用し、手動デプロイは初期設定や障害対応に限定する。

## 初回デプロイ後の確認

1. 発行された`*.workers.dev`のトップページを開く。
2. `https://<worker>.workers.dev/about`と`https://<worker>.workers.dev/disclaimer`をアドレスバーから直接開く。
3. 非本番ブランチのプレビューURLでも同梱データと年表が表示されることを確認する。
4. APIを設定した場合は、ブラウザの開発者ツールでCORSエラーがないことを確認する。
5. GitHubの`main`へpushしたときだけ本番が更新されることを確認する。
6. 問題がなければカスタムドメインを追加する。

Cloudflare側のキャッシュ設定はWorkers Static Assetsの既定値を使用する。独自のCache Rulesは、更新後に古いアセットが残る原因になるため、必要性が確認できるまで追加しない。

## ロールバック

本番デプロイに問題がある場合は、Cloudflare DashboardのWorkerにある「Deployments」から直前の安定したバージョンを選び、Rollbackを実行する。ロールバック後は原因を修正し、通常のGitHub連携経由で再デプロイする。

## 参考資料

- [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Workers rollbacks](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)
