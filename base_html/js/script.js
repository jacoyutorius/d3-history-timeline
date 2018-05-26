var width = window.innerWidth - 40;
var height = window.innerHeight - 40;
var svg = d3.select("#svgArea").append("svg")
  .attr("class", "svg")
  .attr("width", width)
  .attr("height", height)
var data = [
    { title: "Bauhaus Weimarer", category: "organization", start: 1919, end: 1923, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/Van-de-Velde-Bau_in_Weimar_%28Draufsicht%29.jpg" },
    { title: "Bauhaus Dessau",   category: "organization", start: 1925, end: 1932, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Bauhaus.JPG" },
    { title: "Bauhaus Berlin",   category: "organization", start: 1932, end: 1933, events: [], imageUrl: "" },
    // { title: "Nationalsozialistische Deutsche Arbeiterpartei",   category: "organization", start: 1920, end: 1945, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/NSDAP-Logo.svg"},
    { title: "Walter Adolph Georg Gropius", category: "people",start: 1883, end: 1969,
      events: [
        {start: 1919, content: "Become the first principal of Bauhaus"},
        {start: 1925, content: "『国際建築』"},
        {start: 1926, content: "Dessau's school building"},
        {start: 1928, content: "Leave the principal position of Bauhaus"}
      ], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/1955_01-Oct_HansGConrad_Portrait-WalterGropius_HfGUlm-Opening.jpg" },
    { title: "Johannes Itten", category: "people", start: 1888, end: 1967, 
      events: [
        {start: 1919, content: "Become a Meister of Bauhaus"},
        {start: 1923, content: "Fired from Bauhaus"},
        {start: 1926, content: "'Itten Schule' established"}
      ], 
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/Itten001.jpg"},
    { title: "Moholy-Nagy László", category: "people", start: 1895, end: 1946,
      events: [
        {start: 1923, content: "Become professor of Bauhaus"},
        {start: 1925, content: "'Malerei, Fotografie, Film' released"},
        {start: 1937, content: "Exile to USA"}
      ], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/82/Laszlo_Moholy-Nagy_-_photography_from_NARA_-_281845.jpg" },
    { title: "Hannes Meyer", category: "people", start: 1889, end: 1954, events: [], imageUrl: ""},
    // { title: "Hirobumi Itou", category: "people", start: 1841, end: 1909, events: [
    //   {start: 1909, content: "Assassinated by An Jung-geun"}
    // ], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c8/It%C5%8D_Hirobumi.jpg"},
    // { title: "Yuto Ogi", category: "people", start: 1983, end: 2100, events: [], imageUrl: ""},
    // { title: "FOURIER.Inc", category: "organization", start: 2006, end: 2100, events: [], imageUrl: ""}
  ]

var eventData = getEventList(data);
var areaStartYear = getMinimumStartYear(data);
var areaEndYear = getMaximumEndYear(data);
var areaPeriod = areaEndYear - areaStartYear;
var colorMapping = {
  people: "blue",
  organization: "green"
}
var scale = areaPeriod / width; //倍率

// line
svg.selectAll("line")
  .data(data)
  .enter()
  .append("line")
  .attr("x1", function(d){ return calcStartX(d); })
  .attr("y1", function(d, i){ return calcTopY(i); })
  .attr("x2", function(d){ return calcStartX(d); })
  .attr("y2", function(d, i){ return calcTopY(i); })
  .transition()
  .duration(1000)
  .attr("x1", function(d){ return calcStartX(d); })
  .attr("y1", function(d, i){ return calcTopY(i); })
  .attr("x2", function(d){ return calcEndX(d); })
  .attr("y2", function(d, i){ return calcTopY(i); })
  .attr("stroke-width", 3)
  .attr("stroke", function(d){ return colorMapping[d.category]; })

// circle
svg.selectAll("startYear")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", 0)
  .attr("cx", function(d){ return calcStartX(d); })
  .attr("cy", function(d, i){ return calcTopY(i); })
  .transition()
  .duration(1500)
  .attr("r", 5)
  .attr("fill", function(d){ return colorMapping[d.category]; })
  .attr("cx", function(d){ return calcStartX(d); })
  .attr("cy", function(d, i){ return calcTopY(i); });

svg.selectAll("endYear")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", 0)
  .attr("cx", function(d){ return calcEndX(d); })
  .attr("cy", function(d, i){ return calcTopY(i); })
  .transition()
  .duration(1500)
  .attr("r", 5)
  .attr("fill", function(d){ return colorMapping[d.category]; })
  .attr("cx", function(d){ return calcEndX(d); })
  .attr("cy", function(d, i){ return calcTopY(i); });

// イベントポイントを描画する
svg.selectAll("eventPoint")
  .data(eventData)
  .enter()
  .append("circle")
  .attr("class", "eventPoint")
  .attr("r", 0)
  .attr("cx", function(d){ return calcStartX(d); })
  .attr("cy", function(d, i){ return calcTopY(d.baseIndex); })
  .transition()
  .duration(2500)
  .attr("r", 5)
  .attr("fill", function(d){ return "red"; })
  .attr("cx", function(d){ return calcStartX(d); })
  .attr("cy", function(d, i){ return calcTopY(d.baseIndex); });

// イベントポイントへのマウスオーバーイベント
svg.selectAll(".eventPoint")
  .on("mouseover", function(d, i){
    var coordinates = d3.mouse(this);
    svg.append("text")
      .text(d.start + " : " + d.content)
      .attr("id", "eventContent")
      .attr("fill","gray")
      .attr("x", coordinates[0])
      .attr("y", calcTopY(d.baseIndex) - 10)
      .attr("font-size", 12);
  })
  .on("mouseout", function(){
    svg.select("#eventContent").remove();
  });

// image
svg.selectAll("thumb")
  .data(data)
  .enter()
  .append("image")
  .attr("xlink:href", function(d){ return d.imageUrl; })
  .attr("x", function(d){ return calcStartX(d) - 50; })
  .attr("y", function(d, i){ return calcTopY(i) - 20; })
  .attr("width", "40")
  .attr("height", "40");

// text
svg.selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .attr("x", function(d){ return calcStartX(d) - 30; })
  .attr("y", function(d, i){ return calcTopY(i) - 12; })
  .transition()
  .duration(1500)
  .text(function(d){ return d.title + " (" + d.start + " ~ " + d.end + ")"; })
  .attr("fill","black")
  .attr("x", function(d){ return calcStartX(d); })
  .attr("y", function(d, i){ return calcTopY(i) - 12; })
  .attr("font-size", 12);

// クリックイベント
d3.select("svg")
  .on("click", function(p){
    svg.select(".latitudeLine").remove();
    var coordinates = d3.mouse(this) ;
    svg.append("line")
      .attr("class", "latitudeLine")
      .attr("x1", coordinates[0])
      .attr("y1", 0)
      .attr("x2", coordinates[0])
      .attr("y2", height)
      .style("stroke-opacity", .2)
      .attr("stroke-width", 0.3)
      .attr("stroke", "black")

    svg.selectAll(".circle2").remove();
    svg.selectAll("circle2")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "circle2")
      .attr("r", 2.5)
      .attr("fill", "black")
      .attr("cx", coordinates[0])
      .attr("cy", function(d, i){ return calcTopY(i); });
      
    svg.selectAll(".text2").remove();
    svg.selectAll("text2")
      .data(data)
      .enter()
      .append("text")
      .attr("x", coordinates[0] - 30)
      .attr("y", function(d, i){ return calcTopY(i) + 17; })
      .attr("fill","white")
      .transition()
      .duration(150)
      .attr("class", "text2")
      .attr("fill","grey")
      .text(function(d){
        if (d.category == "people"){
          var age = calcAgeLineX(coordinates[0], d);
          return  "Age : " + age;
        }
        else {
          return "";
        }
      })
      .attr("x", coordinates[0] + 5)
      .attr("y", function(d, i){ return calcTopY(i) + 17; })
      .attr("font-size", 12);
  })

// 各レコードを描画するY座標を算出する
function calcTopY(index){
  return (index + 1) * 60;
}

// X座標とhistoryラインの交点におけるターゲットの年齢を算出する
function calcAgeLineX(latitude, d){
  var startX = calcStartX(d);
  var v = latitude - startX;
  return Math.floor(v * scale);
}

// 描画開始点の座標を求める
function calcStartX(d){
  return Math.abs(width * (d.start - areaStartYear)/areaPeriod) + 5;
}

// 描画終了点の座標を求める
function calcEndX(d){
  return Math.abs(width * (d.end - areaStartYear)/areaPeriod) - 10;
}

// 全データにおける歴史開始年の最小値を求める
// -10ぶんをマージン
function getMinimumStartYear(data){
  return Math.min.apply(null, data.map(function(row){ return row.start })) - 10;
}

// 全データにおける歴史終了年の最大値を求める
// +10年ぶんをマージン
function getMaximumEndYear(data){
  return Math.max.apply(null, data.map(function(row){ return row.end })) + 10;
}

// 全データより、イベントに関するデータのみを抽出
function getEventList(data){
  var list = data.map(function(row, i){
    return row.events.map(function(event){
      return {
        title: row.title,
        content: event.content,
        top: row.top,
        start: event.start,
        baseIndex: i
      }
    });
  })
  // flatten Array
  return Array.prototype.concat.apply([], list);
}