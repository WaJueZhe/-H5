<template>
	<div class="home-page">
    <!-- 头部 -->
    <app-header></app-header>
    <transition name="move">
      <app-aside v-show="$store.state.toggleaside"></app-aside>
    </transition>
    <!-- 遮罩层 -->
    <div class="ceng" v-show="$store.state.toggleaside"></div>
    <div class="content">
      <!-- tab栏切换 -->
      <div class="tap">
        <a href="javascript:;" :class="{'active': actived === 'task0'}" @click="tabSelect('task0')">
          新任务
        </a>
        <a href="javascript:;" :class="{'active': actived === 'task1'}" @click="tabSelect('task1')">
          配送中
        </a>
        <a href="javascript:;" :class="{'active': actived === 'task2'}" @click="tabSelect('task2')">
          异常单
        </a>
      </div>
    </div>
    <!-- 主体内容区域 -->
    <div class="main">
      <!-- <keep-alive>
        <router-view></router-view>
      </keep-alive> -->
      <!-- <div class="group" ref="homeSwiper">
        <ul class="list swiper-wrapper">
          <li class="item swiper-slide"><task0></task0></li>
          <li class="item swiper-slide"><task1></task1></li>
          <li class="item swiper-slide"><task2></task2></li>
        </ul>
      </div> -->
      <mt-tab-container  v-model="actived" swipeable style="width:100%;height:100%" id="miTab">  
            <mt-tab-container-item id="task0" style="width:100%;height:100%">  
              <!-- cell组件 -->  
              <mt-cell style="width:100%;height:100%"><task0 v-if="actived === 'task0'"></task0></mt-cell>
            </mt-tab-container-item>  

          <mt-tab-container-item id="task1" style="width:100%;height:100%">
            <mt-cell style="width:100%;height:100%"><task1 v-if="actived === 'task1'"></task1> </mt-cell>
          </mt-tab-container-item>  

          <mt-tab-container-item id="task2" style="width:100%;height:100%">  
            <mt-cell style="width:100%;height:100%"> <task2 v-if="actived === 'task2'"></task2> </mt-cell>
          </mt-tab-container-item>  
      </mt-tab-container>


    </div>
    <!-- 引导组建 -->
    <indicate v-show="$store.state.isFirstLogin"></indicate>


    <app-footer></app-footer>

    <!-- 弹框提示 -->
    <div class="modalBox" v-show="modalBox">
      <div class="info-box">
        <div class="info-text">
          您已进入<span>模拟演示账号</span>该账号中显示的是模拟内容，希望可以有助于您了解云单平台。
        </div>
        <div class="btn" style="" @click="closemBox()">我知道了</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
// import "../../../node_modules/swiper/dist/css/swiper.css";
// import Swiper from "../../../node_modules/swiper";
import { TabContainer, TabContainerItem } from 'mint-ui';

Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);

import indicate from "../../components/indicate/indicate";
import task0 from "../task/task0";
import task1 from "../task/task1";
import task2 from "../task/task2";
export default {
  data() {
    return {
      actived: "task0",
      bgCol: "#383838",
      arr: ["新任务", "配送中", "异常单"],
      modalBox:false
    };
  },
  methods: {
    closemBox(){
      this.$store.showdemobox = false;
      this.modalBox = this.$store.showdemobox;
    },
    tabSelect(msg) {
      this.actived = msg;
      // this.swiper.activeIndex = msg == 'task0' ? 0 : msg == 'task1' ? 1 : msg == 'task2' ? 2 : 0;
      // if(msg=='task0'){
      //   this.swiper.activeIndex = 0;
      //   this.swiper.update()
      //   console.log(0)
      // }else if(msg=='task1'){
      //   this.swiper.activeIndex = 1;
      //   this.swiper.update()
      //   console.log(1)
      // }else{
      //   this.swiper.activeIndex = 2;
      //   this.swiper.update()
      //   console.log(2)
      // }
    }
  },
  components: {
    indicate,
    task0,
    task1,
    task2,
  },
  watch: {
    // $route() {
    //   this.navToggle();
    // }
  },
  mounted() {
    if(this.$store.showdemobox){
      this.modalBox = true;
    }else{
      this.modalBox = false;
    }
    document.getElementById('miTab').children[0].style.height='100%'
    // console.log(aa)
  }
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

// 头部tab栏
bg-col = #101a30;

.home-page {
  height: 100%;

  // .loading-layer {
  //   padding-bottom:px2rem(240px);
  // }

  .content {
    margin-top: px2rem(-2px);
    overflow: hidden;
    height: 100%;
    width: 100%;

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
        box-sizing: border-box;
        position: relative;
        top: 0;
        left: 0;
        color: #ffffff;
        font-size: px2rem(30px);
        display: inline-block;
        width: px2rem(122px);
        text-align: center;
      }

      // a span {
      // position: absolute;
      // bottom: px2rem(10px);
      // left: 0;
      // content: '';
      // background-color: #ffffff;
      // display: inline-block;
      // height: px2rem(8px);
      // width: 100%;
      // display: none;
      // }
      a:first-child {
        float: left;
      }

      .active {
        border-bottom: px2rem(8px) solid #fff;

        &:after {
          content: '';
          display: block;
          width: 100%;
          height: px2rem(8px);
          position: absolute;
          bottom: 0;
          left: 0;
          background-color: #fff;
        }
      }

      a:last-child {
        float: right;
      }
    }
  }

  .main {
    position: fixed;
    top: px2rem(150px);
    left: 0;
    z-index: 2;
    width: 100%;
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;

    .group {
      width: 100%;
      height: 100%;

      .list {
        width: 100%;
        height: 100%;

        .item {
          float: left;
          width: 100%;
          height: 100%;

          > img {
            width: 100%;
            height: 100%;
          }

          &:after {
            display: block;
            clear: both;
            content: ' ';
          }
        }
      }
    }
  }

  .ceng {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .modalBox {
    position:absolute;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.5);
    z-index:22222;
    box-sizing:border-box;

    .info-box {
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%, -50%);
      padding:px2rem(30px);
      width:px2rem(400px);
      height:px2rem(330px);
      background-color:#fff;
      border-radius:px2rem(10px);
      box-sizing:border-box;

      .info-text {
        font-size:px2rem(28px);

        > span {
          font-size:px2rem(36px);
          font-weight:bold;
          color:orange;
        }
      }

      .btn {
        position:absolute;
        bottom:px2rem(30px);
        width:px2rem(340px);
        height:px2rem(70px);
        line-height:px2rem(70px);
        text-align:center;
        font-size:px2rem(36px);
        color:#fff;
        border-radius:px2rem(10px);
        border:1px solid #2166ff;
        background-color:#2166ff;
      }
    }
  }

  .move-enter-active {
    transition: all 1s;
  }

  .move-leave-active {
    transition: all 1s;
  }

  .move-enter {
    transform: translateX(-100%);
  }

  .move-leave-to {
    transform: translateX(-100%);
  }
}

</style>

