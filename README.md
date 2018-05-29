# d3-history-timeline

> Nuxt.js project

Visualize History.

![https://s3-ap-northeast-1.amazonaws.com/public.jacoyutorius.com/d3-history-timeline.gif](https://s3-ap-northeast-1.amazonaws.com/public.jacoyutorius.com/d3-history-timeline.gif)

![https://s3-ap-northeast-1.amazonaws.com/public.jacoyutorius.com/d3-history-timeline.jpg](https://s3-ap-northeast-1.amazonaws.com/public.jacoyutorius.com/d3-history-timeline.jpg)

## Build Setup

``` bash
# install dependencies
$ yarn install # Or yarn install

# serve with hot reload at localhost:3000
$ yarn dev
```

## Test data

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


動作に必要なAPIサーバーを用意するには2種類の方法がある。


1. use [myjson](http://myjson.com/) to create test data.

[myjson](http://myjson.com/)でサンプルデータを登録したAPIを作成する。

[https://api.myjson.com/bins/1cic7m](https://api.myjson.com/bins/1cic7m)

2. use Ruby script

[Sinatra](http://sinatrarb.com/intro.html) でローカルAPIサーバーを立てる。

```
bundle install --path .bundle
bundle exec ruby api/app.rb

=> curl localhost:4567/data
```