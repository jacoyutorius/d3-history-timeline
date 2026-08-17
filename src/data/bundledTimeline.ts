import type { HistoryRecord, TimelineSample } from '../types/timeline'

const wikipedia = (title: string, url: string) => [{ title, url }]

export const bundledHistories: HistoryRecord[] = [
  {
    id: 'bauhaus-weimar',
    title: 'Bauhaus Weimar',
    category: 'organization',
    description: '1919年にヴァイマルで開校したバウハウスの最初の拠点。',
    period: { start: { year: 1919 }, end: { year: 1925 } },
    events: [
      {
        id: 'bauhaus-weimar-founded',
        date: { year: 1919 },
        title: 'ヴァイマルで開校',
        sources: [],
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Van-de-Velde-Bau_in_Weimar_%28Draufsicht%29.jpg',
      alt: 'ヴァイマルの旧バウハウス校舎',
    },
    sources: wikipedia('Bauhaus（Wikipedia）', 'https://ja.wikipedia.org/wiki/バウハウス'),
  },
  {
    id: 'bauhaus-dessau',
    title: 'Bauhaus Dessau',
    category: 'organization',
    description: '1925年にデッサウへ移転したバウハウス。',
    period: { start: { year: 1925 }, end: { year: 1932 } },
    events: [
      {
        id: 'bauhaus-dessau-building',
        date: { year: 1926 },
        title: 'デッサウ校舎が完成',
        sources: [],
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Bauhaus.JPG',
      alt: 'デッサウのバウハウス校舎',
    },
    sources: wikipedia('Bauhaus（Wikipedia）', 'https://ja.wikipedia.org/wiki/バウハウス'),
  },
  {
    id: 'walter-gropius',
    title: 'Walter Adolph Georg Gropius',
    category: 'person',
    description: 'バウハウスの創設者であり、初代校長を務めた建築家。',
    period: {
      start: { year: 1883, month: 5, day: 18 },
      end: { year: 1969, month: 7, day: 5 },
    },
    events: [
      {
        id: 'gropius-bauhaus-director',
        date: { year: 1919 },
        title: 'バウハウス初代校長に就任',
        sources: [],
      },
      {
        id: 'gropius-leaves-bauhaus',
        date: { year: 1928 },
        title: 'バウハウス校長を退任',
        sources: [],
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/1955_01-Oct_HansGConrad_Portrait-WalterGropius_HfGUlm-Opening.jpg',
      alt: 'ヴァルター・グロピウスの肖像',
    },
    sources: wikipedia('ヴァルター・グロピウス（Wikipedia）', 'https://ja.wikipedia.org/wiki/ヴァルター・グロピウス'),
  },
  {
    id: 'johannes-itten',
    title: 'Johannes Itten',
    category: 'person',
    description: 'バウハウスの予備課程を担当した画家・教育者。',
    period: {
      start: { year: 1888, month: 11, day: 11 },
      end: { year: 1967, month: 5, day: 27 },
    },
    events: [
      {
        id: 'itten-bauhaus-master',
        date: { year: 1919 },
        title: 'バウハウスのマイスターに就任',
        sources: [],
      },
      {
        id: 'itten-school',
        date: { year: 1926 },
        title: 'イッテン・シューレを設立',
        sources: [],
      },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Itten001.jpg',
      alt: 'ヨハネス・イッテンの肖像',
    },
    sources: wikipedia('ヨハネス・イッテン（Wikipedia）', 'https://ja.wikipedia.org/wiki/ヨハネス・イッテン'),
  },
  {
    id: 'hayao-miyazaki',
    title: '宮崎駿',
    category: 'person',
    description: '日本のアニメーション監督・映画監督。',
    period: { start: { year: 1941, month: 1, day: 5 }, end: null },
    events: [
      { id: 'miyazaki-cagliostro', date: { year: 1979 }, title: 'ルパン三世 カリオストロの城', sources: [] },
      { id: 'miyazaki-spirited-away', date: { year: 2001 }, title: '千と千尋の神隠し', sources: [] },
      { id: 'miyazaki-boy-and-heron', date: { year: 2023 }, title: '君たちはどう生きるか', sources: [] },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Hayao_Miyazaki.jpg',
      alt: '宮崎駿の肖像',
    },
    sources: wikipedia('宮崎駿（Wikipedia）', 'https://ja.wikipedia.org/wiki/宮崎駿'),
  },
  {
    id: 'isao-takahata',
    title: '高畑勲',
    category: 'person',
    description: '日本のアニメーション監督・映画監督。',
    period: {
      start: { year: 1935, month: 10, day: 29 },
      end: { year: 2018, month: 4, day: 5 },
    },
    events: [
      { id: 'takahata-horus', date: { year: 1968 }, title: '太陽の王子 ホルスの大冒険', sources: [] },
      { id: 'takahata-grave-fireflies', date: { year: 1988 }, title: '火垂るの墓', sources: [] },
      { id: 'takahata-kaguya', date: { year: 2013 }, title: 'かぐや姫の物語', sources: [] },
    ],
    image: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Isao_Takahata.jpg',
      alt: '高畑勲の肖像',
    },
    sources: wikipedia('高畑勲（Wikipedia）', 'https://ja.wikipedia.org/wiki/高畑勲'),
  },
]

export const bundledSamples: TimelineSample[] = [
  {
    id: 'bauhaus',
    title: 'Bauhaus',
    description: 'バウハウスの主要人物と拠点',
    recordIds: ['walter-gropius', 'johannes-itten', 'bauhaus-weimar', 'bauhaus-dessau'],
  },
  {
    id: 'japanese-animation-directors',
    title: '日本のアニメーション監督',
    description: '日本のアニメーション史を代表する監督',
    recordIds: ['hayao-miyazaki', 'isao-takahata'],
  },
]
