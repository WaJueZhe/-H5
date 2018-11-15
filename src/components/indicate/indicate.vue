
<template>
  <div class="indicate" v-show="isShow">
    <div class="one" v-show="one">
      <div class="btn" @click="two = true"></div>
    </div>
    <div class="two" v-show="two">
      <div class="btn" @click="three = true"></div>
    </div>
    <div class="three" v-show="three">
      <div class="btn" @click="four = true"></div>
    </div>
    <div class="four" v-show="four">
      <div class="btn" @click="close"></div>
    </div>
  </div>
</template>

<script>
export default {
 data() {
    return {
      one:true,
      two:false,
      three:false,
      four:false,
      isShow:true,
    };
  },
  methods:{
    close(){
      this.isShow = false;
      this.$store.state.isFirstLogin=false;
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.indicate {
  width:100%;
  height:100%;

  .one {
    position:absolute;
    top: 0;
    left:0;
    width:100%;
    height:100%;
    background:url('../../assets/images/1.png') no-repeat;
    background-size:100% 100%;
    z-index:2222;

    .btn {
      position: absolute;
      top:56%;
      left:50%;
      transform:translate(-50%,-50%);
      width:px2rem(260px);
      height:px2rem(80px);
      border-radius:px2rem(30px);
    }
  }
  .two {
    position:absolute;
    top: 0;
    left:0;
    width:100%;
    height:100%;
    background:url('../../assets/images/2.png') no-repeat;
    background-size:100% 100%;
    z-index:2222;

    .btn {
      position: absolute;
      top:56%;
      left:50%;
      transform:translate(-50%,-50%);
      width:px2rem(260px);
      height:px2rem(80px);
      border-radius:px2rem(30px);
    }
  }
  .three {
    position:absolute;
    top: 0;
    left:0;
    width:100%;
    height:100%;
    background:url('../../assets/images/3.png') no-repeat;
    background-size:100% 100%;
    z-index:2222;

    .btn {
      position: absolute;
      top:56%;
      left:50%;
      transform:translate(-50%,-50%);
      width:px2rem(260px);
      height:px2rem(80px);
      border-radius:px2rem(30px);
    }
  }
  .four {
    position:absolute;
    top: 0;
    left:0;
    width:100%;
    height:100%;
    background:url('../../assets/images/4.png') no-repeat;
    background-size:100% 100%;
    z-index:2222;

    .btn {
      position: absolute;
      top:56%;
      left:50%;
      transform:translate(-50%,-50%);
      width:px2rem(260px);
      height:px2rem(80px);
      border-radius:px2rem(30px);
    }
  }
}

</style>

