import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    chartData: [],
    peoples: [],
    currentX: 0,
    currentY: 9,
    testAPIResult: [
      { title: "Bauhaus Weimarer", category: "organization", start: 1919, end: 1923, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/Van-de-Velde-Bau_in_Weimar_%28Draufsicht%29.jpg" },
      { title: "Bauhaus Dessau",   category: "organization", start: 1925, end: 1932, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Bauhaus.JPG" },
      { title: "Bauhaus Berlin",   category: "organization", start: 1932, end: 1933, events: [], imageUrl: "http://via.placeholder.com/90x100" },
      { title: "Nationalsozialistische Deutsche Arbeiterpartei",   category: "organization", start: 1920, end: 1945, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/NSDAP-Logo.svg"},
      { title: "Walter Adolph Georg Gropius", category: "people", start: 1883, end: 1969,
        events: [
          {start: 1919, content: "Become the first principal of Bauhaus"},
          {start: 1925, content: "『国際建築』"},
          {start: 1926, content: "Dessau's school building"},
          {start: 1928, content: "Leave the principal position of Bauhaus"},
          {start: 1911, content: "Married with Alma Maria Mahler-Werfel"}
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
      {
        title: "Wassily Kandinsky", category: "people", start: 1866, end: 1944,
        events: [
          {start: 1911, content: "『青騎士』結成"},
          {start: 1922, content: "instructor at Bauhaus"},
        ],
        birth: "1866.12.4",
        dead: "1944.12.13",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Vassily-Kandinsky.jpeg"
      },
      {
        title: "Alma Maria Mahler-Werfel", category: "people", start: 1879, end: 1964,
        events: [
          {start: 1902, content: "Married with Gustav Mahler"},
          {start: 1911, content: "Married with Walter Adolph Georg Gropius"}
        ],
        birth: "1879.8.31",
        dead: "1964.12.11",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Alma_Mahler_1899.jpg" 
      },
      {
        title: "Gustav Mahler", category: "people", start: 1860, end: 1911,
        events: [
          {start: 1902, content: "Married with Alma Maria Mahler-Werfel"}
        ],
        birth: "1860.7.7",
        dead: "1911.5.18",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Gustav_Mahler_1909.jpg/800px-Gustav_Mahler_1909.jpg"
      },
      {
        title: "Le Corbusier", category: "people", start: 1887, end: 1965, 
        events: [
          {start: 1931, content: "Villa Savoye"}
        ],
        birth: "1887.10.6",
        dead: "1965.8.27",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Le_Corbusier_1933.JPG"
      }
    ]
  },
  getters: {
    chartData: state => state.chartData,
    // chartData: function(state){
    //   return state.chartData.concat(state.peoples)
    // },
    peopleNames: function(state){
      return state.testAPIResult
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
    getPeoples(state, peoples){
      state.peoples = peoples
      // state.chartData = state.chartData.concat(state.peoples)
      state.chartData = peoples
    }
  },
  actions: {
    getPeoplesAsync({commit, state}, peoples){
      var ret = peoples.map((peopleName) => {
        var index = state.testAPIResult.findIndex((row) => {
          if (row.title === peopleName){ return true }
        })
        return state.testAPIResult[index];
      })
      commit("getPeoples", ret)
    }
  }
})

export default store