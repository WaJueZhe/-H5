<template>
  <div class="code"  @click="codeShow">
      <div class="box">
          <div class="title">
              <h4 v-if="codeType=='D'" >扫码签发</h4>
              <h4 v-if="codeType=='U'" >扫码签收</h4>
              <i class="iconfont icon-close" @click="codeShow"></i></div>
          <div class="main">
              <vue-q-art :config="config"></vue-q-art>
          </div>
      </div>
  </div>
</template>

<script>
import VueQArt from 'vue-qart';
export default {
  props: [
    "stopId",
    "codeType"
  ],
  watch: {
      stopId(){
          this.makeCode();
      }
  },
  data() {
    return {
      config: {
        value: "",
        imagePath: require("../../assets/img/code.jpg"),
        filter: 'skyblue',
        size:50
      }
    };
  },
  methods: {
    codeShow() {
        this.$emit('ievent',false);
    },
    makeCode(){
        if(this.codeType=="U"){
            this.config.value = this.api.baseURL+"/wx/wx_mpredirect?reurl=sign_begin&params=sign,"+this.stopId;
        }
        if(this.codeType=="D"){
            this.config.value = this.api.baseURL+"/wx/wx_mpredirect?reurl=sign_begin&params=lssue,"+this.stopId;
        }
        console.log(this.config.value);
    }
  },
  created() {
    // if(this.codeType=="U"){
    //     this.config.value = this.api.baseURL+"/wx/wx_mpredirect?reurl=sign_begin&params=sign,"+this.stopId;
    // }
    // if(this.codeType=="D"){
    //     this.config.value = this.api.baseURL+"/wx/wx_mpredirect?reurl=sign_begin&params=lssue,"+this.stopId;
    // }
    // console.log(this.config.value);
  },
  components:{
      'vue-q-art':VueQArt
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

.code {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.3);

    .box {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        width: px2rem(440px);
        height: px2rem(500px);
        border-radius: px2rem(30px);
        overflow: hidden;

        .title {
            height: px2rem(70px);
            line-height: px2rem(70px);
            text-align: center;
            background-color: #061128;
            color: #ffffff;
            box-sizing: border-box;

            h4 {
                color: #ffffff;
                display: inline-block;
                font-size: px2rem(36px);
                font-weight: normal;
            }

            i {
                float: right;
                margin-right: px2rem(30px);
                font-size: px2rem(36px);
            }
        }

        .main {
            width: 100%;
            height: px2rem(430px);
            padding 0 px2rem(26px)
            padding-top px2rem(10px)
            box-sizing: border-box;
            background-color: #ffffff;
        }
    }
}
</style>

