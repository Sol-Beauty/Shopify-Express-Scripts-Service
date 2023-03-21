const { country } = require("../helpers/ShopifyApi");

const CO_SIZES = [
  { waist: "00", size: 6, id: 1, t: 10, cm: 1 }, //0
  { waist: "0", size: 6, id: 2, t: 11, cm: 2 }, //1
  { waist: "0", size: 8, id: 3, t: 12, cm: 2 }, //2
  { waist: "2", size: 8, id: 4, t: 13, cm: 3 }, //3
  { waist: "2", size: 10, id: 5, t: 14, cm: 3 }, //4
  { waist: "2", size: 12, id: 6, t: 15, cm: 3 }, //5
  { waist: "4", size: 10, id: 7, t: 16, cm: 4 }, //6
  { waist: "4", size: 12, id: 8, t: 17, cm: 4 }, //7
  { waist: "4", size: 14, id: 9, t: 18, cm: 4 }, //8
  { waist: "6", size: 14, id: 10, t: 19, cm: 5 }, //9
  { waist: "8", size: 14, id: 11, t: 20, cm: 6 }, //10
  { waist: "10", size: 16, id: 12, t: 21, cm: 7 }, //11
  { waist: "12", size: 16, id: 13, t: 22, cm: 8 }, //12
  { waist: "10", size: 18, id: 14, t: 23, cm: 7 }, //13
  { waist: "12", size: 18, id: 15, t: 24, cm: 8 }, //14
  { waist: "16", size: 20, id: 16, t: 25, cm: 9 }, //15
];

const HIPS = [
    {
      mexico: 3,
      usa: 0,
      europa: 24,
      euz: 32,
      id:1,
    },
    {
      mexico: 5,
      usa: 2,
      europa: 26,
      euz: 34,
      id:2
    },
    {
      mexico: 7,
      usa: 4,
      europa: 28,
      euz: 36,
      id:3,
    },
    {
      mexico: 9,
      usa: 6,
      europa: 30,
      euz: 38,
      id:4,
    },
    {
      mexico: 11,
      usa: 8,
      europa: 32,
      euz: 40,
      id:5,
    },
    {
      mexico: 13,
      usa: 10,
      europa: 34,
      euz: 42,
      id:6,
    },
    {
      mexico: 15,
      usa: 12,
      europa: 36,
      euz: 44,
      id:7,
    },
    {
      mexico: 17,
      usa: 14,
      europa: 38,
      euz: 46,
      id:8,
    },
  ];

const WAIST = {
  cm: [
    { min: 53, max: 68, id: 1 },
    { min: 60, max: 72, id: 2 },
    { min: 67, max: 77, id: 3 },
    { min: 73, max: 87, id: 4 },
    { min: 79, max: 90, id: 5 },
    { min: 86, max: 99, id: 6 },
    { min: 95, max: 110, id: 7 },
    { min: 107, max: 118, id: 8 },
    { min: 114, max: 128, id: 9 },
  ],
  in: [
    { min: 20.8, max: 26.7, id: 1 },
    { min: 23.6, max: 28.3, id: 2 },
    { min: 26.3, max: 30.3, id: 3 },
    { min: 28.7, max: 34.2, id: 4 },
    { min: 31.1, max: 35.4, id: 5 },
    { min: 33.8, max: 38.9, id: 6 },
    { min: 37.4, max: 43.3, id: 7 },
    { min: 42.1, max: 46.4, id: 8 },
    { min: 44.8, max: 50.3, id: 9 },
  ],
};

const SIZES = [
  {
    waist: 1,
    hip:1,
    co: { waist: "00", size: 6 },
    lvl: 0.1,
  },
  {
    waist: 2,
    hip:1,
    co: { waist: "0", w: 0, size: 6 },
    lvl: 0,
  },
  {
    waist: 2,
    hip:2,
    co: { waist: "0", w: 0, size: 8 },
    lvl: 0,
  },
  {
    waist: 3,
    hip:2,
    co: { waist: "2", w: 2, size: 8 },
    lvl: 2,
  },
  {
    waist: 3,
    hip: 3,
    co: { waist: "2", w: 2, size: 10 },
    lvl: 2,
  },
  {
    waist: 3,
    hip:4,
    co: { waist: "2", w: 2, size: 12 },
    lvl: 2,
  },
  {
    waist: 4,
    hip:3,
    co: { waist: "4", w: 4, size: 10 },
    lvl: 4,
  },
  {
    waist: 4,
    hip:4,
    co: { waist: "4", w: 4, size: 12 },
    lvl: 4,
  },
  {
    waist: 4,
    hip:5,
    co: { waist: "4", w: 4, size: 14 },
    lvl: 4,
  },
  {
    waist: 5,
    hip:5,
    co: { waist: "6", w: 6, size: 14 },
    lvl: 6,
  },
  {
    waist: 6,
    hip:5,
    co: { waist: "8", w: 8, size: 14 },
    lvl: 8,
  },
  {
    waist: 7,
    hip:6,
    co: { waist: "10", w: 10, size: 16 },
    lvl: 10,
  },
  {
    waist: 6,
    hip:7,
    co: { waist: "10", w: 10, size: 18 },
    lvl: 10,
  },
  {
    waist: 7,
    hip:6,
    co: { waist: "12", w: 12, size: 16 },
    lvl: 12,
  },
  {
    waist: 8,
    hip:7,
    co: { waist: "12", w: 12, size: 18 },
    lvl: 12,
  },
  {
    waist: 9,
    hip:8,
    co: { waist: "16", w: 16, size: 20 },
    lvl: 16
  },
];

var rep = {};
/**
 * Calculator Repository
 */

 rep.findWaists = (waist, cm) => {
  let ws = cm ? WAIST.cm : WAIST.in;
  let data = ws.filter((s) => {
    let okW = s.min <= waist && s.max >= waist;
    return okW;
  });
  return data ? data.map((d)=> { return d.id;}) : [];
};

rep.findHips = (hip, country)=> {
  let hs = HIPS;
  let data = hs.filter((s) => {
    // console.log('country '+ country, s[country], hip);
    let okS = s[country] === hip;
    return okS;
  });
  return data ? data.map((d)=> { return d.id;}) : [];
}

rep.filterSize = (hipsIds, waistIds)=> {
  let data = SIZES.filter((s) => {
    // console.log('waist ', s.waist, waistIds, 'hip ', s.hip, hipsIds);
    let okW = rep.helpById(s.waist, waistIds);
    let okS = rep.helpById(s.hip, hipsIds);
    // console.log(okW, okS);
    return okS && okW;
  });
  return data;
}

rep.helpById = (key, data) =>{
  for (k in data ) {
    // console.log(data[k], key, data[k] === key);
    if (data[k] === key) {
      return true;
    }
  }
  return false;
};

rep.error = () => {
  throw Error(404);
}
rep.filterSizeByLvl = (lvl, hipsIds) => {
 
  let data = SIZES.filter((s) => {
    // console.log('waist ', s.waist, waistIds, 'hip ', s.hip, hipsIds);
    let okW = lvl == s.lvl;
    let okS = rep.helpById(s.hip, hipsIds);
    // console.log(okW, okS);
    return okS && okW;
  });
  return data;
};
rep.findComfort = (lvl, hip, hipsIds) => {
  console.log(lvl);
  var hips =  hipsIds ? [hipsIds[0], hipsIds[0]+1,  hipsIds[0]+2] : hipsIds;

  if(lvl == 0.1) {
    var ss = rep.filterSizeByLvl(0, hips);
  } else {
    var ss = rep.filterSizeByLvl(lvl + 2, hips);
  }
  return ss[0];
  // if(data.length > 0 && recursive) {
  //   return  data[0];
  // } else if (data.length > 1) {`

  //   return data[1];
  // } else {
  //   var waistIds = rep.findWaists(waist + 4, cm);
  //   var ss = rep.findSizes(hipsIds, waistIds);
  //   var sizeCo = ss.length > 0 ? ss[0] : rep.findComfort(data,waist,cm, hipsIds, 1);
  //   return sizeCo;
  // }
}

rep.findSize = (data) => {
  const { waist, cm, hip, tight, country} = data;
  var waistIds = rep.findWaists(waist, cm);
  var hipsIds = rep.findHips(hip, country, cm);
  var ss = rep.filterSize(hipsIds, waistIds);
  console.log("log waistIds", waistIds);
  console.log("log hipsIds", hipsIds);
  // console.log("log sizes", ss);
  if (ss.length > 0 ) {
    var sizeCo = tight ? ss[0]: rep.findComfort(ss[0].lvl, hip, hipsIds);
    sizeCo.co.tight = tight;
  } else {
    return rep.error();
  }
  return sizeCo;
}

module.exports = rep;
