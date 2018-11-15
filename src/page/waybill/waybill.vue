<template>
  <div class="waybill">
      <div class="hed">
        <i class="iconfont icon-back" @click="back"></i>
        <span>运单管理</span>
      </div>
      <!-- tab栏切换 -->
      <div class="tap">
          <router-link to="/wayall">
              全部<span></span>
          </router-link>
          <router-link to="/waynot">
              未签收<span></span>
          </router-link>
          <router-link to="/wayyes">
              已签收<span></span>
          </router-link>
      </div>
    <keep-alive>
        <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import CardCompontent from "../../components/waybill/card.vue";
export default {
  data() {
    return {
      headerName: "运单管理",
      operation: ""
    };
  },
  components: {
    "way-card": CardCompontent
  },
  methods: {
    // 通过路由判断显示下划线
    route() {
      let arr = document.querySelectorAll(".tap span");
      let arr1 = document.querySelectorAll(".tap a");
      if (this.$route.name == "wayall") {
        for (var i = 0; i < arr.length; i++) {
          arr[i].style.display = "none";
          arr1[i].style.fontWeight = "normal";
        }
        arr[0].style.display = "block";
        arr1[0].style.fontWeight = "bold";
      } else if (this.$route.name == "waynot") {
        for (var i = 0; i < arr.length; i++) {
          arr[i].style.display = "none";
          arr1[i].style.fontWeight = "normal";
        }
        arr[1].style.display = "block";
        arr1[1].style.fontWeight = "bold";
      } else {
        for (var i = 0; i < arr.length; i++) {
          arr[i].style.display = "none";
          arr1[i].style.fontWeight = "normal";
        }
        arr[2].style.display = "block";
        arr1[2].style.fontWeight = "bold";
      }
    },
    //点击返回首页
    back() {
      this.$router.push("/task0");
    }
  },
  watch: {
    $route: function() {
      this.route();
    }
  },
  mounted() {
    this.route();
  }
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

// 头部tab栏
bg-col = #101a30;

.waybill {
  width: 100%;
  height: 100%;
  padding-top: px2rem(150px);
  box-sizing: border-box;

  .hed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: px2rem(80px);
    line-height: px2rem(80px);
    text-align: center;
    background-color: bg-col;

    i {
      float: left;
      margin-left: px2rem(20px);
      font-size: px2rem(30px);
      color: #ffffff;
    }

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      color: #ffffff;
      font-size: px2rem(30px);
    }
  }
}

// tab栏切换
.tap {
  position: fixed;
  top: px2rem(70px);
  left: 0;
  z-index: 2;
  width: 100%;
  box-sizing: border-box;
  background-color: bg-col;
  height: px2rem(80px);
  line-height: px2rem(80px);
  text-align: center;
  padding: 0 px2rem(60px);
  overflow: hidden;

  a {
    position: relative;
    top: 0;
    left: 0;
    color: #ffffff;
    font-size: px2rem(30px);
    display: inline-block;
    width: px2rem(122px);
    text-align: center;
  }

  a span {
    position: absolute;
    bottom: px2rem(-1px);
    left: 0;
    content: '';
    background-color: #ffffff;
    display: inline-block;
    height: px2rem(8px);
    width: 100%;
    display: none;
  }

  a:first-child {
    float: left;

    span {
      display: block;
    }
  }

  a:last-child {
    float: right;
  }
}
</style>


