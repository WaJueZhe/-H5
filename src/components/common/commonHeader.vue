<template>
  <div class="comhed">
      <span v-if="back" @click="backnone"> <i class="iconfont icon-back"></i> {{ operation }}</span>
      <span v-if="!back" @click="toIndexPage"> <i class="iconfont icon-back"></i> {{ operation }}</span>
      <h2>{{ name }}</h2>
      <span v-if="flag"><i class="iconfont icon-more"></i></span>
  </div>
</template>  

<script>
import { delCookie, setCookie, getCookie } from "../../js/cookie.js";
export default {
    props:['name','operation','flag','back'],
    data () {
        return {
            identityType:''
        }
    },
    methods: {
        backnone(){
            this.$router.go(-1);
        },
        toIndexPage(){
            switch (this.identityType) {
                case 'pcuser':
                    this.$router.push('/c_page/deliver/deliverHome');
                break;
                case 'customer':
                    this.$router.push('/c_page/deliver/deliverHome');
                break;  
                case 'driver':
                    this.$router.push('/task0');
                break;                     
                default:
                break;
            }
        }
    },
    created () {
        this.identityType = getCookie("identityType");
    }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

// @import './iconfont.css'
bgCol = #061128;

.comhed {
    position: fixed;
    top 0
    left 0 
    z-index 22
    width: 100%;
    height: px2rem(80px);
    line-height: px2rem(80px);
    background-color: bgCol;
    overflow: hidden;
    color: #ffffff;
    font-size:px2rem(30px);

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
}
</style>


