# Repository Guidelines

## プロジェクト構成とモジュール

このリポジトリは、Vue 3とD3で歴史年表を可視化するVite製SPAへ移行中です。新規実装は`src/`に置き、画面は`src/views/`、型は`src/types/`、計算ロジックは`src/domain/`で管理します。`pages/`、`components/`、`layouts/`、`store/`は比較用の旧Nuxt実装です。移植対象を確認する場合を除き、新機能を追加しないでください。`api/app.rb`はローカル用のSinatraサンプルAPI、`base_html/`は初期のD3単体プロトタイプです。

## ビルド・テスト・開発コマンド

- `npm install`：ロックファイルに従って依存関係を導入します。
- `npm run dev`：開発サーバーを`http://localhost:4000`で起動します。
- `npm run lint`：新しいVue 3／TypeScript実装をESLintで検査します。
- `npm run typecheck`：`vue-tsc`で型を検査します。
- `npm test`：Vitestの単体テストを実行します。
- `npm run build`：型検査後に本番用バンドルを生成します。
- `npm run preview`：本番用バンドルをローカルで確認します。
- `bundle install --path .bundle`：Sinatraの依存関係をローカルに導入します。
- `bundle exec ruby api/app.rb`：サンプルAPIをポート4567で起動します。`curl localhost:4567/data`で確認できます。

移行後のAPI接続先には`VITE_HISTORY_API_URL`と`VITE_SAMPLE_API_URL`を使用します。詳細は`docs/modernization-plan.md`を参照してください。

## コーディング規約と命名

`.editorconfig`に従い、インデントは半角スペース2個、改行はLF、文字コードはUTF-8とします。Markdown以外では行末空白を削除し、ファイル末尾に改行を入れてください。VueではComposition APIと`<script setup lang="ts">`を使用し、コミット前に`npm run lint`を実行してください。

VueコンポーネントはPascalCase（`HistoryForm.vue`）、ページはルートに対応する小文字名（`about.vue`）を使います。既存モジュールに合わせ、JavaScriptヘルパーには説明的なsnake_case（`chart_helper.js`）を使用します。D3の描画処理は、可能な限りフォーム処理やAPI通信から分離してください。

## テスト方針

単体テストにはVitestを使用し、対象ファイルと同じディレクトリに`*.test.ts`として置きます。すべての変更で`npm run lint`、`npm run typecheck`、`npm test`を通してください。年表の変更では、イベントなし、継続中のレコード（`end: 0`）、人物と組織の混在、日本語表示を確認します。API変更では対象ルートを`curl`で呼び出し、JSONの構造を検証してください。

## コミットとプルリクエスト

最近の履歴では、`add About page`や`expand modal width`のような短い命令形の件名が使われています。1コミットを1つの目的に絞り、ファイル名ではなく変更内容を示してください。プルリクエストには変更概要、確認コマンド、設定やAPIへの影響、関連Issueを記載します。年表やフォームなど表示が変わる場合は、変更前後のスクリーンショットまたは短い録画を添付してください。
