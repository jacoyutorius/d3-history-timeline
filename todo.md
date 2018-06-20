## todo

- [x] 画面デザインの修正

  - 棒線や背景の色を調整する
  - 2018.5.26 とりあえず done

- [] モーダルウィンドウの配色が気に入らないので修正する

  - タブのテキスト色が水色
  - テーブルヘッダの背景色

- [x] サンプルデータの追加

  - API から返すデータ  に別のカテゴリのデータを追加する(ブリットポップムーブメントの歴史とか)

- [x] サンプル選択機能の実装

  - "Bauhause"や"日本のアニメ監督"といったサンプルを選択することで、それに関連した people, organization のレコードが自動選択される機能
  - やや冗長な実装となっているが、とりあえず当初予定した動作はできるので fix とする

- [] people, organizaiton 以外の  分類も追加する

  - people は人
  - organizaiton は団体、組織

- [x] - people.state の変更が、chartData に伝搬させる前に renderChart()が実行されてしまうのが原因と推察
  - チェック入力後、people.selected の変更が getters.chartData に反映されるまで 0.2 秒待つように改修

- AWS SAM Local / DynaomDB Local をでのデータ操作
  - 登録機能の実装
    - 登録フォーム
    - DynamoDB へ更新
