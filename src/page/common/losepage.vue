<template>
  <div class="loser">
      <img src="static/pic_wifi.png" alt="">
      <p>超人很忙，稍后重试~</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.loser {
    width: 100%;
    height: 100%;
    position: relative;

    img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }

    p {
      position: absolute;
      top: 70%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      color: #d9d9d9
      font-size px2rem(32px);
    }
}
</style>


