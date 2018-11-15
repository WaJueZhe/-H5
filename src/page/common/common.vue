<template>
  <div class="com">
      <img src="static/timg.png" alt="">
      <p @click="$router.push('/task0')">程序正在建设中,请点我返回主页</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.com {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }

    p {
        position absolute
        top 70%
        left 50%
        transform: translateX(-50%) translateY(-50%);
        background-color #5d8fff
        padding px2rem(20px)
        border-radius px2rem(10px)
        color: #ffffff;
        font-size:px2rem(36px);
        
    }
}
</style>


