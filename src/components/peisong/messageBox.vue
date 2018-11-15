<template>
<div class="box" >
    <div class="message">
        <div class="header">
            <h3>发货实际信息</h3>
        </div>
        <div class="main">
            <input type="text" v-model="piece">件
            <input type="text" v-model="square">方
            <input type="text" v-model="weight">吨
        </div>
        <div class="but">
            <button>取消</button>
            <button>确认修改</button>
        </div>
    </div>
</div>

</template>

<script>
export default {
  data() {
    return {
      piece: 999,
      square: 999,
      weight: 999
    };
  },
  methods: {
      //点击阴影部分取消
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

.box {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
}

.message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: px2rem(400px);
    height: px2rem(200px);
}
</style>


