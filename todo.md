## todo

- [x] 画面デザインの修正
  - 棒線や背景の色を調整する
  - 2018.5.26 とりあえずdone

- [] モーダルウィンドウの配色が気に入らないので修正する
  - タブのテキスト色が水色
  - テーブルヘッダの背景色

- [] サンプルデータの追加
  - APIから返すデータに別のカテゴリのデータを追加する(ブリットポップムーブメントの歴史とか)

- [x] サンプル選択機能の実装
  - "Bauhause"や"日本のアニメ監督"といったサンプルを選択することで、それに関連したpeople, organizationのレコードが自動選択される機能
  - やや冗長な実装となっているが、とりあえず当初予定した動作はできるのでfixとする

- [] people, organizaiton以外の分類も追加する
  - peopleは人
  - organizaitonは団体、組織

- [x] 
  - people.stateの変更が、chartDataに伝搬させる前にrenderChart()が実行されてしまうのが原因と推察
  - チェック入力後、people.selectedの変更がgetters.chartDataに反映されるまで0.2秒待つように改修


--- 

※ このメモは[WEB+DB PRESS Vol.101 継続は力なり―大器晩成エンジニアを目指して
第9回ログのすすめ](http://gihyo.jp/dev/serial/01/continue-power/0009)を参考に書いている。


 