import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
Vue.use(Vuex)

let apiUrl = "https://api.myjson.com/bins/1cic7m"

const store = () => new Vuex.Store({
  state: {
    timelineTitle: "",
    chartData: [],
    histories: [],
    currentX: 0,
    currentY: 9,
    sampleData: [
      {title: "Bauhaus", peoples: ["Walter Adolph Georg Gropius", "Johannes Itten", "Moholy-Nagy László", "Hannes Meyer"]},
      {title: "Japanese Anime Director", peoples:[ "手塚治虫", "宮崎駿", "高畑勲", "押井守", "富野由悠季", "庵野秀明", "永野護"]}
    ]
  },
  getters: {
    timelineTitle: state => state.timelineTitle,
    histories: state => state.histories,
    sampleData: state => state.sampleData,
    chartData: (state) => {
      return state.histories.filter((row) => { return row.selected })
    },
    peoples: (state) => {
      return state.histories
        .filter((row) => { 
          return (row.category === "people") 
        })
    },
    organizations: (state) => {
      return state.histories
        .filter((row) => {
          return (row.category === "organization")
        })
    },
    eventData: function(state){
      var list = state.histories.filter((row) => { return row.selected }).map(function(row, i){
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
    },
    birthData: function(state){
      return state.histories.filter((row) => { return row.selected }).map(function(row){
        return {
          start: row.start,
          birth: row.birth
        };
      });
    },
    deadData: function(state){
      return state.histories.filter((row) => { return row.selected }).map(function(row){
        return row.dead;
      });
    },
    areaStartYear: function(state){
      // 全データにおける歴史開始年の最小値を求める, -10ぶんをマージン
      var v = state.histories.filter((row) => { return row.selected }).map((row) => { return row.start })
      return v.length > 0 ? Math.min.apply(null, v) - 10 : 0
    },
    areaEndYear: function(state){
      // 全データにおける歴史終了年の最大値を求める. +10年ぶんをマージン
      var v = state.histories.filter((row) => { return row.selected }).map((row) => { return row.end })
      return v.length > 0 ?  Math.max.apply(null, v) + 10 : 0
    },
    areaPeriod: function(state, getters) {
      return getters.areaEndYear - getters.areaStartYear;
    }
  },
  mutations: {
    getHistories(state, histories){
      state.histories = histories
    },
    onSelectStateChanged(state, people) {
      people.selected = !people.selected
    }
  },
  actions: {
    async nuxtServerInit({commit}){
      const res = await axios.get(apiUrl).catch((e) => { console.dir(e) })
      var data = res.data.map((row) => { 
        row["selected"] = false
        return row
      })
      commit("getHistories", data)
    }
  }
})

export default store