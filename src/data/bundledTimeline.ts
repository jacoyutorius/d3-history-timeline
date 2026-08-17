import type { HistoryRecord, TimelineSample } from '../types/timeline'

export const bundledHistories: HistoryRecord[] = [
  {
    id: 'bauhaus-weimar',
    title: 'Bauhaus Weimar',
    category: 'organization',
    start: 1919,
    end: 1925,
    events: [{ start: 1919, content: 'ヴァイマルで開校' }],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Van-de-Velde-Bau_in_Weimar_%28Draufsicht%29.jpg',
  },
  {
    id: 'bauhaus-dessau',
    title: 'Bauhaus Dessau',
    category: 'organization',
    start: 1925,
    end: 1932,
    events: [{ start: 1926, content: 'デッサウ校舎が完成' }],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Bauhaus.JPG',
  },
  {
    id: 'walter-gropius',
    title: 'Walter Adolph Georg Gropius',
    category: 'people',
    start: 1883,
    end: 1969,
    birth: '1883.5.18',
    dead: '1969.7.5',
    events: [
      { start: 1919, content: 'バウハウス初代校長に就任' },
      { start: 1928, content: 'バウハウス校長を退任' },
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/61/1955_01-Oct_HansGConrad_Portrait-WalterGropius_HfGUlm-Opening.jpg',
  },
  {
    id: 'johannes-itten',
    title: 'Johannes Itten',
    category: 'people',
    start: 1888,
    end: 1967,
    birth: '1888.11.11',
    dead: '1967.5.27',
    events: [
      { start: 1919, content: 'バウハウスのマイスターに就任' },
      { start: 1926, content: 'イッテン・シューレを設立' },
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Itten001.jpg',
  },
  {
    id: 'hayao-miyazaki',
    title: '宮崎駿',
    category: 'people',
    start: 1941,
    end: 0,
    birth: '1941.1.5',
    events: [
      { start: 1979, content: 'ルパン三世 カリオストロの城' },
      { start: 2001, content: '千と千尋の神隠し' },
      { start: 2023, content: '君たちはどう生きるか' },
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Hayao_Miyazaki.jpg',
  },
  {
    id: 'isao-takahata',
    title: '高畑勲',
    category: 'people',
    start: 1935,
    end: 2018,
    birth: '1935.10.29',
    dead: '2018.4.5',
    events: [
      { start: 1968, content: '太陽の王子 ホルスの大冒険' },
      { start: 1988, content: '火垂るの墓' },
      { start: 2013, content: 'かぐや姫の物語' },
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Isao_Takahata.jpg',
  },
]

export const bundledSamples: TimelineSample[] = [
  {
    title: 'Bauhaus',
    peoples: ['Walter Adolph Georg Gropius', 'Johannes Itten'],
    organizations: ['Bauhaus Weimar', 'Bauhaus Dessau'],
  },
  {
    title: '日本のアニメーション監督',
    peoples: ['宮崎駿', '高畑勲'],
    organizations: [],
  },
]
