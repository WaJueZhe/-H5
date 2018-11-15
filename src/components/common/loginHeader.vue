<template>
    <div class="head">
        <div class="titl">
            <h2>登录</h2>
        </div>
        <div>
            <a href="#" @click="demologin" class="bgzu">快速体验</a>
        </div>
    </div>
</template>

<script>
import Vue from "vue";

export default {

methods: {
    demologin(){
        this.$router.push("/logindemo");
    }
}



};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

bg-col = #101a30;   // 背景色设置
font-fam = '微软雅黑';
col = #ffffff
.head {
    position relative
    height: px2rem(88px)
    line-height px2rem(88px)
    background-color: bg-col
    font-family: font-fam
    color col
    overflow hidden
    padding 0 px2rem(20px)
    text-align center
    .titl{
        display inline-block
        h2{
            font-size :px2rem(40px);
            font-weight normal
        }

    }
    .bgzu {
        position absolute
        top 0
        right px2rem(20px)
        font-size: px2rem(24px);
        color col
    }
}
</style>

