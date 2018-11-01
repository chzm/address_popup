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
