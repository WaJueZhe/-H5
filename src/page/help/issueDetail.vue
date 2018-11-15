<template>
  <div class="supportCenter">
    <app-comhed :name="headername" :operation="operation" :flag="false" :back="true"></app-comhed>

    <div class="help">
      <div class="box">
        <div class="centre">
          <span class="images"><img src="../../assets/img/help-logo.png" alt=""></span>
          <span class="name">帮助与反馈</span>
        </div>
      </div>
    </div>

    <div class="group">
      <ul class="list">
        <li class="item" v-for="(item,indexNo) in list" :key="indexNo">
          <router-link :to="{ name: 'familiarIssue',params:{id: item.id}}">
            <span class="issue">{{indexNo+1}}.{{item.title}}</span>
            <i class="iconfont icon-jiantou"></i>
          </router-link>
        </li>
        <div v-show="havemore" class="nomore">没有更多数据了</div>
      </ul>
    </div>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  watch: {
    $route: ["init"]
  },
  data() {
    return {
      headername: "问题详情",
      operation: "",
      category: "",
      pageNo: 1,
      pageSize: 1000,
      list: [],
      havemore:false
    };
  },
  methods: {
    init() {
      this.category = this.$route.params.category;
      let p = {
        category: this.category,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      Indicator.open();
      this.axios
        .post(`${this.api.baseURL}/helpArticle/searchArticleBycategory`, p)
        .then(res => {
          Indicator.close();
          console.log(res);
          if (res.data.success) {
            this.list = res.data.data.list.records;
            if(res.data.data.list.total>0){
              this.havemore=false
            }else{
              this.havemore=true
            }
          }
        });
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.nomore {
  padding-bottom: px2rem(150px);
  width: 100%;
  text-align: center;
  height: px2rem(80px);
  line-height: px2rem(80px);
  font-size: 14px;
  color: #383838;
}

.supportCenter {
  width: 100%;
  height: 100%;
  background-color: #eee;
  box-sizing: border-box;

  .help {
    position: relative;
    margin-top: px2rem(80px);
    width: 100%;
    height: px2rem(180px);
    box-sizing: border-box;

    .box {
      position: absolute;
      top: px2rem(20px);
      left: 0;
      padding: 0 px2rem(20px);
      width: 100%;
      box-sizing: border-box;

      .centre {
        width: 100%;
        height: px2rem(140px);
        text-align: center;
        border-radius: px2rem(10px);

        .images {
          margin-top: px2rem(20px);
          display: inline-block;
          width: px2rem(90px);
          height: px2rem(90px);

          > img {
            width: 100%;
            height: 100%;
          }
        }

        .name {
          display:inline-block;
          font-size:px2rem(32px);
        }
      }
    }
  }

  .group {
    width: 100%;
    background-color: #fff;
    box-sizing: border-box;

    .list {
      width: 100%;

      .item {
        padding: 0 px2rem(40px);
        height: px2rem(80px);
        line-height: px2rem(80px);
        border-bottom: 1px solid #eee;

        > a {
          display: block;

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
}
</style>

