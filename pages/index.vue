<template>
  <section class="container">
    <div>
      <!-- As a heading -->
      <b-navbar variant="faded" type="light">
        <b-navbar-brand tag="h1" class="mb-0">History Timeline</b-navbar-brand>
      </b-navbar>
    </div>

    <div>
      <b-container fluid>
        <h2>{{ areaStartYear }} ~ {{ areaEndYear }}</h2>
        <b-button class="button" v-on:click="renderChart">Render</b-button>
        <div id="svgArea" class=""></div>
      </b-container>
    </div>
  </section>
</template>

<script>
import * as d3 from "d3";
import { mapGetters, mapActions, mapMutations } from "vuex"

export default {
  data: function(){
    return {
      colorMapping: {
        people: "blue",
        organization: "green"
      }
    }
  },
  computed: {
    width: function(){
      return window.innerWidth - 40
    },
    height: function(){
      return window.innerHeight - 40
    },
    ...mapGetters(["chartData", "eventData", "areaStartYear", "areaEndYear", "areaPeriod"])
  },
  components: {
    // AppLogo
  },
  mounted: function(){
    this.renderChart()
  },
  methods: {
    renderChart: function(){
      // var vue = this;
      var $_this = this;
      var width = window.innerWidth - 40;
      var height = window.innerHeight - 40;

      // 以前のは消す
      d3.select(".svg").remove();

      var svg = d3.select("#svgArea").append("svg")
      .attr("class", "svg")
      .attr("width", width)
      .attr("height", height)

      // line
      svg.selectAll("line")
        .data(this.chartData)
        .enter()
        .append("line")
        .attr("x1", function(d){ return this.calcStartX(d); }.bind(this))
        .attr("y1", function(d, i){ return this.calcTopY(i); }.bind(this))
        .attr("x2", function(d){ return this.calcStartX(d); }.bind(this))
        .attr("y2", function(d, i){ return this.calcTopY(i); }.bind(this))
        .transition()
        .duration(1000)
        .attr("x1", function(d){ return this.calcStartX(d); }.bind(this))
        .attr("y1", function(d, i){ return this.calcTopY(i); }.bind(this))
        .attr("x2", function(d){ return this.calcEndX(d); }.bind(this))
        .attr("y2", function(d, i){ return this.calcTopY(i); }.bind(this))
        .attr("stroke-width", 3)
        .attr("stroke", function(d){ return this.colorMapping[d.category]; }.bind(this))

      // circle start
      svg.selectAll("startYear")
        .data(this.chartData)
        .enter()
        .append("circle")
        .attr("class", "startYear")
        .attr("r", 0)
        .attr("cx", function(d){ return this.calcStartX(d); }.bind(this))
        .attr("cy", function(d, i){ return this.calcTopY(i); }.bind(this))
        .transition()
        .duration(1500)
        .attr("r", 5)
        .attr("fill", function(d){ return this.colorMapping[d.category]; }.bind(this))
        .attr("cx", function(d){ return this.calcStartX(d); }.bind(this))
        .attr("cy", function(d, i){ return this.calcTopY(i); }.bind(this));
      
      // circle end
      svg.selectAll("endYear")
        .data(this.chartData)
        .enter()
        .append("circle")
        .attr("class", "endYear")
        .attr("r", 0)
        .attr("cx", function(d){ return this.calcEndX(d); }.bind(this))
        .attr("cy", function(d, i){ return this.calcTopY(i); }.bind(this))
        .transition()
        .duration(1500)
        .attr("r", 5)
        .attr("fill", function(d){ return this.colorMapping[d.category]; }.bind(this))
        .attr("cx", function(d){ return this.calcEndX(d); }.bind(this))
        .attr("cy", function(d, i){ return this.calcTopY(i); }.bind(this));

      // 誕生年にマウスオーバー
      svg.selectAll(".startYear")
        .on("mouseover", function(d, i){
          var coordinates = d3.mouse(this);
          svg.append("text")
            .text(d.birth)
            .attr("id", "startPoint")
            .attr("fill","gray")
            .attr("x", coordinates[0])
            .attr("y", _calcTopY(i) + 20)
            .attr("font-size", 12);
        })
        .on("mouseout", function(){
          svg.select("#startPoint").remove();
        });

      // 没年にマウスオーバー
      svg.selectAll(".endYear")
        .on("mouseover", function(d, i){
          var coordinates = d3.mouse(this);
          svg.append("text")
            .text(d.dead)
            .attr("id", "endPoint")
            .attr("fill","gray")
            .attr("x", coordinates[0])
            .attr("y", _calcTopY(i) + 20)
            .attr("font-size", 12);
        })
        .on("mouseout", function(){
          svg.select("#endPoint").remove();
        });

      // text
      svg.selectAll("text")
        .data(this.chartData)
        .enter()
        .append("text")
        .attr("x", function(d){ return this.calcStartX(d) - 30; }.bind(this))
        .attr("y", function(d, i){ return this.calcTopY(i) - 12; }.bind(this))
        .transition()
        .duration(1500)
        .text(function(d){ return d.title + " (" + d.start + " ~ " + d.end + ")"; })
        .attr("fill","black")
        .attr("x", function(d){ return this.calcStartX(d); }.bind(this))
        .attr("y", function(d, i){ return this.calcTopY(i) - 12; }.bind(this))
        .attr("font-size", 12);

      // thumbnail
      svg.selectAll("thumb")
        .data(this.chartData)
        .enter()
        .append("image")
        .attr("xlink:href", function(d){ return d.imageUrl; })
        .attr("x", function(d){ return this.calcStartX(d) - 50; }.bind(this))
        .attr("y", function(d, i){ return this.calcTopY(i) - 20; }.bind(this))
        .attr("width", "40")
        .attr("height", "40");

      // イベントポイントを描画する
      svg.selectAll("eventPoint")
        .data(this.eventData)
        .enter()
        .append("circle")
        .attr("class", "eventPoint")
        .attr("r", 0)
        .attr("cx", function(d){ return this.calcStartX(d); }.bind(this))
        .attr("cy", function(d, i){ return this.calcTopY(d.baseIndex); }.bind(this))
        .transition()
        .duration(2500)
        .attr("r", 5)
        .attr("fill", function(d){ return "red"; })
        .attr("cx", function(d){ return this.calcStartX(d); }.bind(this))
        .attr("cy", function(d, i){ return this.calcTopY(d.baseIndex); }.bind(this));

      // イベントポイントへのマウスオーバーイベント
      svg.selectAll(".eventPoint")
        .on("mouseover", function(d, i){
          var coordinates = d3.mouse(this);
          var baseIndex = d.baseIndex;
          svg.append("text")
            .text(d.start + " : " + d.content)
            .attr("id", "eventContent")
            .attr("fill","gray")
            .attr("x", coordinates[0])
            .attr("y", _calcTopY(baseIndex) - 10)
            .attr("font-size", 12);
        })
        .on("mouseout", function(){
          svg.select("#eventContent").remove();
        });

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
            .attr("stroke", "black");

          svg.selectAll(".circle2").remove();
          svg.selectAll("circle2")
            .data($_this.chartData)
            .enter()
            .append("circle")
            .attr("class", "circle2")
            .attr("r", 2.5)
            .attr("fill", "black")
            .attr("cx", coordinates[0])
            .attr("cy", function(d, i){ return _calcTopY(i); }.bind(this));
            
          svg.selectAll(".text2").remove();
          svg.selectAll("text2")
            .data($_this.chartData)
            .enter()
            .append("text")
            .attr("x", coordinates[0] - 30)
            .attr("y", function(d, i){ return _calcTopY(i) + 17; }.bind(this))
            .attr("fill","white")
            .transition()
            .duration(150)
            .attr("class", "text2")
            .attr("fill","grey")
            .text(function(d){
              if (d.category == "people"){
                var age = _calcAgeLineX(coordinates[0], d);
                return  "Age : " + age;
                // return "Age : ";
              }
              else {
                return "";
              }
            })
            .attr("x", coordinates[0] + 5)
            .attr("y", function(d, i){ return _calcTopY(i) + 17; }.bind(this))
            .attr("font-size", 12);
        })

        function _calcTopY(index){
          return (index + 1) * 60;
        }

        function _chartData(){
          return this.chartData;
        }

        // X座標とhistoryラインの交点におけるターゲットの年齢を算出する
        function _calcAgeLineX(latitude, d){
          // 描画開始点のX座標を求める
          var startX = Math.abs(width * (d.start - $nuxt.$store.getters.areaStartYear) / $nuxt.$store.getters.areaPeriod) + 5;
          var v = latitude - startX;
          var scale = $nuxt.$store.getters.areaPeriod / width;
          return Math.round(v * scale);
        }
    },
    // 描画開始点の座標を求める
    calcStartX: function(d){
      return Math.abs(this.width * (d.start - this.areaStartYear) / this.areaPeriod) + 5;
    },
    // 描画終了点の座標を求める
    calcEndX: function(d){
      return Math.abs(this.width * (d.end - this.areaStartYear) / this.areaPeriod) - 10;
    },
    // 各レコードを描画するY座標を算出する
    calcTopY: function(index){
      return (index + 1) * 60;
    },
    ...mapMutations(["getStartX"])
  }
}
</script>

<style>

</style>
