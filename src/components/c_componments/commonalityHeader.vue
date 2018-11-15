<template>
  <div class="comhed">
      <span v-if="back" @click="backnone"> <i class="iconfont icon-back"></i> {{ operation }}</span>
      <span v-if="!back" @click="$router.push('/c_page/receive/ownerHome')"> <i class="iconfont icon-back"></i> {{ operation }}</span>
      <h2>{{ name }}</h2>
      <slot name="right"></slot>
  </div>
</template>  

<script>
export default {
    props:['name','operation','flag','back'],
    methods: {
        backnone(){
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

// @import './iconfont.css'
bgCol = #061128;

.comhed {
  position: fixed;
  top: 0;
  left: 0; 
  width: 100%;
  height: px2rem(80px);
  line-height: px2rem(80px);
  background-color: bgCol;
  overflow: hidden;
  color: #ffffff;
  font-size:px2rem(30px);
  box-sizing:border-box;

  h2 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      font-size: px2rem(30px);
      font-weight: normal;
  }

  span:first-child {
      float: left;
  }

  span:last-child {
      float: right;
      margin-right: px2rem(20px);
      font-weight: bold;
  }

  .slot {
    float: right;
    display: inline-block;
    margin: auto;
    height: px2rem(80px);
    line-height: px2rem(80px);
    color: #fff;

    > a {
      display: block;
      color: #fff;
    }

    > span {
      vertical-align: middle;
    }
  }
}
</style>


