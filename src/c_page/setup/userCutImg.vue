<template>
  <div class="cut">
    <div class="header">
      <i @click="$router.push('/c_page/usersetting')" class="iconfont icon-back"></i>
      <span>{{ $store.state.pcuser.opertain }}</span>
      <button @click="cutImg">保存</button>
    </div>
    <div class="cavs">
       <croppa class="int" :width="200" :height="200" v-model="myCroppa" placeholder="请选择你要上传的头像"
    :show-remove-button="false" canvas-color="#fff" initial-position="center" :zoom-speed="5" :reverse-scroll-to-zoom="true" :prevent-white-space="true" initial-size="natural">
      <img crossOrigin="anonymous" :src="dataUrl"
         slot="initial" :width="200">
    </croppa>
    </div>

  </div>
</template>

<script>
import VueCropper from "vue-cropper";
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      myCroppa: {},
      dataUrl: ""
    };
  },
  methods: {
    //保存按钮事件
    cutImg() {  
      Indicator.open();
      // 获取用户裁切的图片
      this.dataUrl = this.myCroppa.generateDataUrl();
      let param = {
        "imgData": this.dataUrl
        };
      this.axios
        .post(`${this.api.baseURL}/user/updateUserInfh5`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {  
            Toast("头像保存成功");
            //调回设置页面
            this.$router.replace("/c_page/usersetting");
          } else {
            Toast(res.data.message);
          }
        });
    }
  },
  created () {
    this.dataUrl = this.$store.state.imgUrl
    console.log(this.dataUrl)
  }
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.cut {
  // position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  // padding: 0 px2rem(20px);
  box-sizing: border-box;
  overflow: hidden;

  // 头部
  .header {
    position: relative;
    width: 100%;
    height: px2rem(90px);
    line-height: px2rem(90px);
    background-color: #061128;
    font-size: px2rem(32px);
    color: #ffffff;

    span {
      margin-left: px2rem(20px);
    }

    button {
      position: absolute;
      top: 50%;
      right: px2rem(20px);
      transform: translateY(-50%);
      background-color: #5a83dc;
      height: px2rem(60px);
      color: #ffffff;
      width: px2rem(120px);
      border-radius: px2rem(10px);
    }
  }

  .int {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    border: 1px solid #ffffff;
    box-sizing: border-box;
  }
}

.croppa-container {
  background-color: #fff;
  border: 2px solid grey;
  border-radius: 8px;
}

.cavs {
  width: 100%;
  height: px2rem(2000px);
  background-color: rgba(0, 0, 0, 0.3);
}
</style>


