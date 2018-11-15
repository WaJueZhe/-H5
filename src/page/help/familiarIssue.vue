<template>
  <div class="familiarIssue">
    <app-comhed :name="headername" :operation="operation" :flag="false" :back="true"></app-comhed>

    <div class="info">
      <div class="title">{{helpArticle.title}}</div>
      <div class="list">
        <span class="pre-text">{{helpArticle.description}}</span>  
      </div>
      <div class="feedback">
        <div class="resolved" @click="resolved" :class="{ 'active': already }">
          <i class="iconfont icon-good"></i>
          <span>已解决</span>
          <span style="color:#A2CD5A;font-weight:bold;">{{helpArticle.solveNum}}</span>
        </div>
        <div class="unsolved" @click="unsolved" :class="{ 'active': not }">
          <i class="iconfont icon-bad"></i>
          <span>未解决</span>
          <span style="color:#8B5742;font-weight:bold;">{{helpArticle.unsolveNum}}</span>
        </div>
      </div>
      <div class="relation">与我们联系反馈您的意见
        <router-link :to="{ name: 'feedback' }">点击这里</router-link>
      </div>
    </div>
    <div class="bottom">
      <i class="iconfont icon-dianhua1"></i>
      <span>客服热线</span>
      <span>0755-36987388-8221</span>
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
      headername: "常见问题",
      operation: "",
      already: false,
      not: false,
      id: "",
      helpArticle: ""
    };
  },
  methods: {
    resolved() {
      if (!this.already) {
        this.already = true;
        let p = {
          id: this.id,
          solvedOrNot: "Y"
        };
        this.axios
          .post(`${this.api.baseURL}/helpArticle/solvedOrNot`, p)
          .then(res => {
            if (res.data.success) {
              this.init();
            }
          });
      } else {
        // Toast("您已经顶过了");
      }
    },
    unsolved() {
      if (!this.not) {
        this.not = true;
        let p = {
          id: this.id,
          solvedOrNot: "N"
        };
        this.axios
          .post(`${this.api.baseURL}/helpArticle/solvedOrNot`, p)
          .then(res => {
            if (res.data.success) {
              // console.log("未解决+1");
              this.init();
            }
          });
      }
    },
    here() {
      this.$router.push({ path: "/feedback" });
    },
    init() {
      this.id = this.$route.params.id;
      let p = {
        id: this.id
      };
      Indicator.open();
      this.axios
        .post(`${this.api.baseURL}/helpArticle/searchById`, p)
        .then(res => {
          Indicator.close();
          // console.log(res);
          if (res.data.success) {
            this.helpArticle = res.data.data.ha;
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

.pre-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  word-break: break-all;
}

.familiarIssue {
  width: 100%;
  height: 100%;
  background-color: #eee;
  box-sizing: border-box;

  .info {
    background-color: #fff;

    .title {
      margin-top:px2rem(80px);
      padding:px2rem(40px) 0;
      text-align:center;
      font-size:px2rem(36px);
      background-color: #fff;
      box-sizing: border-box;
    }

    .text {
      padding:0 px2rem(20px);
      font-size:px2rem(28px);
      background-color: #fff;
      box-sizing: border-box;
    }

    .headline {
      margin-top: px2rem(40px);
      padding: 0 px2rem(20px);
      background-color: #fff;
      box-sizing: border-box;
    }

    .list {
      padding: 0 px2rem(20px);
      background-color: #fff;
      box-sizing: border-box;
    }

    .feedback {
      margin-top:px2rem(40px);
      width:100%;
      height:px2rem(120px);
      font-size:px2rem(32px);
      border:1px solid #ccc;
      background-color: #fff;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;

      .resolved {
        width: 50%;
        height: px2rem(120px);
        line-height: px2rem(120px);
        text-align: center;
        border-right: 1px solid #ccc;
      }

      .active {
        color: #666;
      }

      .unsolved {
        width: 50%;
        height: px2rem(120px);
        line-height: px2rem(120px);
        text-align: center;
      }
    }

    .relation {
      padding:px2rem(40px) 0;
      text-align:center;
      font-size:px2rem(28px);

      > a {
        color: #39f;
      }
    }
  }

  .bottom {
    margin-top:px2rem(200px);
    text-align:center;
    font-size:px2rem(24px);
    color:#888;

    > i {
      font-size:px2rem(24px);
    }
  }
}
</style>

