import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    timelineTitle: "",
    chartData: [],
    histories: [],
    selectedPeoples: [],
    peoples: [],
    currentX: 0,
    currentY: 9,
    testAPIResult: [],
    sampleData: [
      {title: "Bauhaus", peoples: ["Walter Adolph Georg Gropius", "Johannes Itten", "Moholy-Nagy László", "Hannes Meyer"]},
      {title: "Japanese Anime Director", peoples:[ "手塚治虫", "宮崎駿", "高畑勲", "押井守", "富野由悠季", "庵野秀明", "永野護"]}
    ]
  },
  getters: {
    timelineTitle: state => state.timelineTitle,
    histories: state => state.histories,
    sampleData: state => state.sampleData,
    chartData: function(state){
      return state.chartData
    },
    selectedPeoples: state => state.selectedPeoples,
    peopleNames: function(state){
      return state.histories
        .filter((row)=>{
          if (row.category === "people"){ return true; }
        })
        .map((row) => {
          return {name: row.title}
        })
    },
    eventData: function(state){
      var list = state.chartData.map(function(row, i){
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
      return state.chartData.map(function(row){
        return {
          start: row.start,
          birth: row.birth
        };
      });
    },
    deadData: function(state){
      return state.chartData.map(function(row){
        return row.dead;
      });
    },
    areaStartYear: function(state){
      // 全データにおける歴史開始年の最小値を求める, -10ぶんをマージン
      return Math.min.apply(null, state.chartData.map(function(row){ return row.start })) - 10;
    },
    areaEndYear: function(state){
      // 全データにおける歴史終了年の最大値を求める. +10年ぶんをマージン
      return Math.max.apply(null, state.chartData.map(function(row){ return row.end })) + 10;;
    },
    areaPeriod: function(state, getters) {
      return getters.areaEndYear - getters.areaStartYear;
    }
  },
  mutations: {
    getHistories(state, histories){
      state.histories = histories
    },
    // addSelectedPeoples(state, people){
    //   state.selectedPeoples.push(people)
    // },
    getPeoples(state, peoples){
      // state.peoples = peoples
      // state.chartData = state.chartData.concat(state.peoples)
      state.chartData = peoples
    }
  },
  actions: {
    async nuxtServerInit({commit}){
      const res = await axios.get('https://api.myjson.com/bins/1cic7m')
      commit("getHistories", res.data)
    },
    // addSelectedPeoplesAsync({commit, state}, people){
    //   commit("addSelectedPeoples", people)
    //   this._actions.getPeoplesAsync({commit, state}, [people.name])
    // },
    getPeoplesAsync({commit, state}, peoples){
      var ret = peoples.map((peopleName) => {
        var index = state.histories.findIndex((row) => {
          if (row.title === peopleName){ return true }
        })
        return state.histories[index];
      })
      commit("getPeoples", ret)
    }
  }
})

export default store