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
    selectedOrganizations: [],
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
    selectedOrganizations: state => state.selectedOrganizations,
    peopleNames: function(state){
      return state.histories
        .filter((row)=>{
          if (row.category === "people"){ return true; }
        })
        .map((row) => {
          return {name: row.title}
        })
    },
    organizationNames: (state) => {
      return state.histories
        .filter((row) => {
          return (row.category === "organization")
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
    getPeoples(state, peoples){
      state.chartData = peoples
    },
    getOrganizations(state, organizations){
      state.chartData = organizations
    }
  },
  actions: {
    async nuxtServerInit({commit}){
      const res = await axios.get('https://api.myjson.com/bins/1cic7m').catch((e) => { console.dir(e) })
      var data = res.data.map((row) => { row["selected"] = false; return row; })
      commit("getHistories", data)
    },
    getPeoplesAsync({commit, state}, peoples){
      var ret = peoples.map((peopleName) => {
        var index = state.histories.findIndex((row) => {
          if (row.title === peopleName){ return true }
        })
        return state.histories[index];
      })
      commit("getPeoples", ret)
    },
    getOrganizationsAsync({commit, state}, organizations){
      var ret = organizations.map((organizationName) => {
        var index = state.histories.findIndex((row) => {
          if (row.title === organizationName){ return true }
        })
        return state.histories[index];
      })
      commit("getOrganizations", ret)
    }
  }
})

export default store