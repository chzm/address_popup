<template>

  <div>

    <div>
      <mt-button style="width: 50px;height: 50px;margin-top: 100px" v-on:click="showAddressPicker">按钮</mt-button>
    </div>

    <div class="region-popup">
      <mt-popup v-model="regionVisible" position="bottom" class="region-popup">
        <address-popup-tool @getRegion="getRegion" ></address-popup-tool>
      </mt-popup>
    </div>

  </div>


</template>

<script>

  import addressPopupTool from "../components/compntTools/addressPopupTool"
  import { Toast } from 'mint-ui'

  export default {
    name: "addressPopup",
    data() {
      return {
        regionVisible: false,
      };
    },

    components: {
      addressPopupTool,
    },

    methods: {

      //打开地址选择器
      showAddressPicker() {
        this.regionVisible = true;
      },

      getRegion(region){
        Toast(region)
      }

    }

  }
</script>

<style scoped>
  .region-popup {
    width: 100%;
  }
</style>
