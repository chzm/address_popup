
@[TOC](目录)

### 前言
最近在学习开发H5产品，想用【mint-ui】的Picker和Popup组件去创建一个地址选择器。发现mint-ui官网只有一个简单的示例，要满足省/市/区三级联动的需求还需要做很多事情，也找了很多相关文档也没有一个比较系统的说明或demo。为此，在这里做了一个比较系统总结，上传一个实现的demo，方便以后使用。

### 一、构建项目
在写demo前，首先需要构建一个空项目，并做好局域网配置，还不懂的可以先看【[vue.js/nuxt.js:IP端口/局域网配置](https://blog.csdn.net/weixin_38633659/article/details/83619785)】这片文档，里面有完整的实现方法。

### 二、引入mint-ui
1、**在terminal上安装mint-ui**
```terminal
npm install mint-ui -save
```
![图一](https://img-blog.csdnimg.cn/20181101195137486.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODYzMzY1OQ==,size_16,color_FFFFFF,t_70)

2、**注册**
在【plugins】文件夹中创建【mint-ui.js】文件，并在改文件注册mint-ui:
```js
import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI)
```
见下图：
![图二](https://img-blog.csdnimg.cn/20181101195157442.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODYzMzY1OQ==,size_16,color_FFFFFF,t_70)

3、**配置**
在【nuxt.config.js】中作如下配置：
```js
  css: [
    'mint-ui/lib/style.css',
  ],
  
  plugins: [
    {src: '~plugins/mint-ui'},
  ],
```
见下图：
![图三](https://img-blog.csdnimg.cn/20181101195801726.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODYzMzY1OQ==,size_16,color_FFFFFF,t_70)


### 三、下载省/市/区的json数据
根据中华人民共和国行政区划分：省级（省份直辖市自治区）、 地级（城市）、 县级（区县）、 乡级（乡镇街道）、 村级（村委会居委会） ，可分**省市区镇村**三级四级五级联动，其地址数据可见
GitHub：https://github.com/modood/Administrative-divisions-of-China

这里我只获取省/市/区三个联动等级的地址文件,并将其导入【static.stRegion】的文件夹中：
![图四](https://img-blog.csdnimg.cn/20181101201526902.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODYzMzY1OQ==,size_16,color_FFFFFF,t_70)


### 四、省/市/区联动
#### 1、获取地址文件数据
以上是准备阶段，接下来才进入主题。这里先实现获取省市区的数据，首先创建一个叫【zmRegion.js】的文件类：
![图五](https://img-blog.csdnimg.cn/20181101201828793.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODYzMzY1OQ==,size_16,color_FFFFFF,t_70)

将实现方法写在【zmRegion.js】的文件中：
```js
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
```

#### 2、选择器组件化
获取数据后，就要想办法将其显示在页面上，考虑到地址选择器是一个比较独立的功能，将其写成一个组件，方便使用的时候直接引入。这里我在【components.compntTools】的文件夹中，创建了一个【addressPopupTool.vue】的文件：
![图六](https://img-blog.csdnimg.cn/20181101202506300.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODYzMzY1OQ==,size_16,color_FFFFFF,t_70)

其实现方法如下：
```html
<template>

  <div class="content">
    <label class="title">{{ region }}</label>
    <mt-picker :slots="myAddressSlots" valueKey="name" :visibleItemCount="5" @change="addressChange"
               :itemHeight="40"></mt-picker>
  </div>

</template>

<script>

  //引入省/市/区数据json文件
  import { zmGetProvincesArr,zmGetCitiesArr,zmGetAreaArr } from '../../plugins/jsTools/zmRegion'

  export default {
    name: "addressPopupTool",
    data() {
      return {
        region: '',//三级地址
        province: '',//省
        city: '',//市
        area: '',//县
        provinceCode: '',//省级代码
        cityCode: '', //市级代码
        areaCode: '',//县级代码

        regionInit: false,//禁止地区选择器自动初始化，picker组件会默认进行初始化，导致一进入页面就会默认选中一个初始3级地址

        myAddressSlots: [//省
          {
            flex: 1,
            values: zmGetProvincesArr(), //省份数组
            className: 'slot1',
            textAlign: 'center'
          },
          //分隔符
          {
            divider: true,
            content: '',
            className: 'slot2'
          },
          //市
          {
            flex: 1,
            values: zmGetCitiesArr('11'),
            className: 'slot3',
            textAlign: 'center'
          },
          {
            divider: true,
            content: '',
            className: 'slot4'
          },
          //县
          {
            flex: 1,
            values: zmGetAreaArr('1101'),
            className: 'slot5',
            textAlign: 'center'
          }
        ],
      }
    },

    methods: {

      addressChange(picker, values) {
        // console.table(picker);
        // console.table(values);
        if (this.regionInit) {
          //取值并赋值
          if (values[0] && values[1]  && values[2]) {

            this.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
            this.province = values[0]["name"];
            this.city = values[1]["name"];
            this.county = values[2]["name"];
            this.provinceCode = values[0]["code"];
            this.cityCode = values[1]["code"];
            this.countyCode = values[2]["code"];

            // console.log("省:")
            // console.table(picker.getSlotValues(0));
            // console.log("省/市/区:")
            // console.table(picker.getValues());

            //给市、县赋值
            picker.setSlotValues(1, zmGetCitiesArr(values[0]["code"]));
            picker.setSlotValues(2, zmGetAreaArr(values[1]["code"]));


            this.$emit("getRegion", this.region)
          }else {
            console.log("数据不全");
          }


        } else {
          this.regionInit = true;
        }
      },

    },
  }


</script>

<style scoped>

  div.content {
    text-align: center;
  }

  label.title {
    margin-left: 10px;
    margin-right: 10px;
    width: 80%;
    background: white;
    font-size: 1rem;
    color: #7f828b;
  }

</style>

```

#### 3、调用组件
基础准备都做好之后，接下来就是调用组件，实现地址选择器：
![图七](https://img-blog.csdnimg.cn/20181101202855348.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODYzMzY1OQ==,size_16,color_FFFFFF,t_70)

其实现方法如下：
```html
<template>

  <div class="content">
    <label class="title">{{ region }}</label>
    <mt-picker :slots="myAddressSlots" valueKey="name" :visibleItemCount="5" @change="addressChange"
               :itemHeight="40"></mt-picker>
  </div>

</template>

<script>

  //引入省/市/区数据json文件
  import { zmGetProvincesArr,zmGetCitiesArr,zmGetAreaArr } from '../../plugins/jsTools/zmRegion'

  export default {
    name: "addressPopupTool",
    data() {
      return {
        region: '',//三级地址
        province: '',//省
        city: '',//市
        area: '',//县
        provinceCode: '',//省级代码
        cityCode: '', //市级代码
        areaCode: '',//县级代码

        regionInit: false,//禁止地区选择器自动初始化，picker组件会默认进行初始化，导致一进入页面就会默认选中一个初始3级地址

        myAddressSlots: [//省
          {
            flex: 1,
            values: zmGetProvincesArr(), //省份数组
            className: 'slot1',
            textAlign: 'center'
          },
          //分隔符
          {
            divider: true,
            content: '',
            className: 'slot2'
          },
          //市
          {
            flex: 1,
            values: zmGetCitiesArr('11'),
            className: 'slot3',
            textAlign: 'center'
          },
          {
            divider: true,
            content: '',
            className: 'slot4'
          },
          //县
          {
            flex: 1,
            values: zmGetAreaArr('1101'),
            className: 'slot5',
            textAlign: 'center'
          }
        ],
      }
    },

    methods: {

      addressChange(picker, values) {
        // console.table(picker);
        // console.table(values);
        if (this.regionInit) {
          //取值并赋值
          if (values[0] && values[1]  && values[2]) {

            this.region = values[0]["name"] + values[1]["name"] + values[2]["name"];
            this.province = values[0]["name"];
            this.city = values[1]["name"];
            this.county = values[2]["name"];
            this.provinceCode = values[0]["code"];
            this.cityCode = values[1]["code"];
            this.countyCode = values[2]["code"];

            // console.log("省:")
            // console.table(picker.getSlotValues(0));
            // console.log("省/市/区:")
            // console.table(picker.getValues());

            //给市、县赋值
            picker.setSlotValues(1, zmGetCitiesArr(values[0]["code"]));
            picker.setSlotValues(2, zmGetAreaArr(values[1]["code"]));


            this.$emit("getRegion", this.region)
          }else {
            console.log("数据不全");
          }


        } else {
          this.regionInit = true;
        }
      },

    },
  }


</script>

<style scoped>

  div.content {
    text-align: center;
  }

  label.title {
    margin-left: 10px;
    margin-right: 10px;
    width: 80%;
    background: white;
    font-size: 1rem;
    color: #7f828b;
  }

</style>

```

做完上面的所有步骤之后，就大功告成了。让我们来看一下项目的运行结果：
![图八](https://img-blog.csdnimg.cn/20181101203942129.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3dlaXhpbl8zODYzMzY1OQ==,size_16,color_FFFFFF,t_70)


### 四、demo下载
1、[Gitee下载](https://gitee.com/chenzm_186/address_popup)
2、[GitHub下载](https://github.com/chzm/address_popup)
3、[CSDN资源下载](https://download.csdn.net/download/weixin_38633659/10759034)


啦啦啦～是不是很赞，喜欢的话**～～欢迎点赞～～**

**参考链接：**
1、[vue.js+mint-ui的Popup组件和Picker组件实现省市县三级联动功能](https://blog.csdn.net/lzw_1994/article/details/79981166)
