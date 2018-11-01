//引入省市区数据json文件
import provinces from '../../static/stcRegion/provinces';
import cities from '../../static/stcRegion/cities';
import areas from '../../static/stcRegion/areas';


export function zmGetProvincesArr() {

  let provinceArr = [];
  provinces.forEach(function (item) {
    let obj = {};
    obj.name = item.name;
    obj.code = item.code;
    provinceArr.push(obj);
  });
  return provinceArr;
}

export function zmGetCitiesArr(provinceCode) {
  console.log("省：" + provinceCode);
  if (!provinceCode){
    provinceCode = '11'
  }
  let cityArr = [];
  cities.forEach(function (item) {
    if (item.provinceCode == provinceCode) {
      let obj = {};
      obj.name = item.name;
      obj.code = item.code;
      obj.provinceCode = item.provinceCode;
      cityArr.push(obj);
    }
  });
  return cityArr;
}

export function zmGetAreaArr(cityCode) {
  console.log("市：" + cityCode);
  if (!cityCode){
    cityCode = '1101'
  }
  let areaArr = [];
  areas.forEach(function (item) {
    if (item.cityCode == cityCode) {
      let obj = {};
      obj.name = item.name;
      obj.code = item.code;
      obj.provinceCode = item.provinceCode;
      obj.cityCode = item.cityCode;
      areaArr.push(obj);
    }
  });
  return areaArr;
}
