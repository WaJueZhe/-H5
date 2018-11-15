<template>
  <div class="address-page">
    <app-comhed :name="headerName" :operation = "operation" :flag = "false" :back="true"></app-comhed>
    <div class="site">
      <div class="shipments" :class="{ active:activeIndex == 1 }" @click="site(1)">装货地址</div>
      <div class="shipments" :class="{ active:activeIndex == 2 }" @click="site(2)">卸货地址</div>
    </div>
    
      <Deliver v-if="activeIndex == 1"></Deliver>
      <Unload v-if="activeIndex == 2"></Unload>
  </div>
</template>
<script>
import Deliver from '../../components/deliver/deliver'
import Unload from '../../components/unload/unload'
export default {
  data () {
    return {
      headerName:'常用地址',
      operation:'',
      activeIndex:1,
    }
  },
  methods: {
    site(index){
      this.activeIndex = index;
    },
  },
  mounted () {
    // this.activeIndex = this.$route.params.activeIndex || 1;
    // console.log(this.$route.params)
  },
  created () {
    
  },
  components: {
    Deliver,
    Unload
  }
}
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.address-page {
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color: #eee;

  .site {
    position: fixed;
    top:0;
    left:0;
    margin-top:px2rem(80px);
    padding:0 px2rem(60px);
    width:100%;
    height:px2rem(80px);
    line-height:px2rem(80px);
    display:flex;
    justify-content:space-between;
    z-index:9999;
    background-color:#ccc;

    .shipments {
      flex:1;
      text-align:center;
      font-size:px2rem(32px);

      &:last-child {
        margin-left:px2rem(40px);
      }
    }

    .active {
      color:#2166ff;
      border-bottom:px2rem(6px) solid #2166ff;
    }
  }

  .content {
    // position: fixed;
    // top:px2rem(310px);
    // left:0;
    width:100%;
    height:100%;
  }
}
</style>
