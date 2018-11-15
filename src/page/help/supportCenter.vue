<template>
  <div class="supportCenter">
    <app-comhed :name="headername" :operation="operation" :flag="false" :back="true"></app-comhed>
    
    <div class="help">
      <div class="top"></div>
      <div class="box">
        <div class="centre">
            <span class="images"><img src="../../assets/img/help-logo.png" alt=""></span>
            <span class="name">帮助与反馈</span>
        </div>
      </div>
    </div>

    <div class="title">常见问题</div>
    <div class="group">
      <ul class="list">
        <li class="item" v-for="(item,index) in categoryList" :key="index">
          <router-link :to="{ name: 'issueDetail',params:{category: item.category}}">
            <span class="issue">{{item.categoryName}}</span>
            <i class="iconfont icon-jiantou"></i>
          </router-link>
        </li>        
      </ul>
    </div>
    <div @click="tofeedback" class="retroaction">意见反馈</div>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      headername: "帮助中心",  
      operation: "",
      categoryList:[]
    };
  },
  methods: {
    tofeedback(){
      this.$router.push({ path: "/feedback" });
    },
    init(){
        Indicator.open();
        let p={
          limit:10
        };
        this.axios
        .post(`${this.api.baseURL}/helpArticle/categoryList`, p)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.categoryList = res.data.data.category;
          }else{
            Toast("数据加载失败");
          }
        });
    }
  },
  created () {
    this.init();
  }
}
</script>
<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';


.supportCenter {
  width:100%;
  height:100%;
  background-color: #eee;
  box-sizing: border-box;

  .help {
    position: relative;
    margin-top:px2rem(80px);
    width: 100%;
    height:px2rem(180px);
    box-sizing: border-box;

    .top {
      width:100%;
      height:px2rem(100px);
      background:#061128;
    }

    .box {
      position: absolute;
      top: px2rem(20px);
      left:0;
      padding:0 px2rem(20px);
      width:100%;
      box-sizing: border-box;

      .centre {
        width:100%;
        height:px2rem(140px);
        text-align:center;
        background-color: #fff;
        border:1px solid #fff;
        border-radius:px2rem(10px);

        .images {
          margin-top:px2rem(20px);
          display:inline-block;
          width:px2rem(90px);
          height:px2rem(90px);

          > img {
            width:100%;
            height:100%;
          }
        }

        .name {
          display:inline-block;
          font-size:px2rem(32px);
        }
      }
    }
  }

  .title {
    padding-left:px2rem(20px);
    width:100%;
    height:px2rem(100px);
    line-height:px2rem(100px);
    font-size:px2rem(32px);
    background-color: #fff;
    border-bottom:1px solid #eee;
    box-sizing: border-box;
  }

  .group {
    width:100%;
    background-color: #fff;
    box-sizing: border-box;

    .list {
      width:100%;

      .item {
        padding:0 px2rem(80px);
        height:px2rem(80px);
        line-height:px2rem(80px);
        border-bottom:1px solid #eee;

        > a {
          display:block;

          > i {
          float:right;
          font-size:px2rem(24px);
        }

        .issue {
          font-size:px2rem(28px);
          color:#666;
        }
        }
      }
    }
  }

  .retroaction {
    margin:0 px2rem(10px);
    margin-top:px2rem(180px);
    height:px2rem(80px);
    line-height:px2rem(80px);
    background-color:#2166ff;
    text-align:center;
    color #fff;
    font-size:px2rem(32px);
    border-radius:px2rem(10px);
  }
}


</style>

