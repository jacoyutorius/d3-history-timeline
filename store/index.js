import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    chartData: [
      { title: "Bauhaus Weimarer", category: "organization", start: 1919, end: 1923, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/Van-de-Velde-Bau_in_Weimar_%28Draufsicht%29.jpg" },
      { title: "Bauhaus Dessau",   category: "organization", start: 1925, end: 1932, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Bauhaus.JPG" },
      { title: "Bauhaus Berlin",   category: "organization", start: 1932, end: 1933, events: [], imageUrl: "http://via.placeholder.com/90x100" },
      // { title: "Nationalsozialistische Deutsche Arbeiterpartei",   category: "organization", start: 1920, end: 1945, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/NSDAP-Logo.svg"},
      { title: "Walter Adolph Georg Gropius", category: "people", start: 1883, end: 1969,
        events: [
          {start: 1919, content: "Become the first principal of Bauhaus"},
          {start: 1925, content: "『国際建築』"},
          {start: 1926, content: "Dessau's school building"},
          {start: 1928, content: "Leave the principal position of Bauhaus"}
        ], 
        birth: "1883.5.18",
        dead: "1969.7.5",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/1955_01-Oct_HansGConrad_Portrait-WalterGropius_HfGUlm-Opening.jpg" },
      { title: "Johannes Itten", category: "people", start: 1888, end: 1967, 
        events: [
          {start: 1919, content: "Become a Meister of Bauhaus"},
          {start: 1923, content: "Fired from Bauhaus"},
          {start: 1926, content: "'Itten Schule' established"}
        ],
        birth: "1888.11.11",
        dead: "1967.5.27",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/Itten001.jpg"},
      { title: "Moholy-Nagy László", category: "people", start: 1895, end: 1946,
        events: [
          {start: 1923, content: "Become professor of Bauhaus"},
          {start: 1925, content: "'Malerei, Fotografie, Film' released"},
          {start: 1937, content: "Exile to USA"}
        ],
        birth: "1895.7.20",
        dead: "1946.11.24",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/82/Laszlo_Moholy-Nagy_-_photography_from_NARA_-_281845.jpg" },
      { title: "Hannes Meyer", category: "people", start: 1889, end: 1954, 
        events: [],
        birth: "1889.11.18",
        dead: "1954.7.19",
        imageUrl: "http://via.placeholder.com/90x100"},
    ],
    currentX: 0,
    currentY: 9
  },
  getters: {
    chartData: state => state.chartData,
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
    deatData: function(state){
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
  },
  actions: {
  }
})

export default store