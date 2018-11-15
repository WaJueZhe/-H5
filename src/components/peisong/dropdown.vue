<template>
  <div class="drop">
      <div style="width:100%;height:100%;" @click="$store.state.dropBox = false"></div>
      <ul>
          <li>拍摄</li>
          <li>从手机相册选择</li>
          <li @click="$store.state.dropBox = false">取消</li>
      </ul>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

.drop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index 222

    ul {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 55;
        width: 100%;
        box-sizing: border-box;
        background-color: #ffffff;

        li {
            height: px2rem(120px);
            line-height: px2rem(120px);
            font-size: px2rem(36px);
            text-align: center;
            color: #383838;
        }
    }
}
</style>

