<template>
  <div class="newsDetail">
      <div class="header">
          <i class="iconfont icon-back" @click="$router.replace('/news')"></i> 
          <span>消息详情</span>
      </div>
      <div class="tit">
        {{taskTitle}}
        <!-- <span class="time">2018-12-12</span> -->
      </div>
      <div class="time">
        <span>2018-12-12</span>
      </div>
      <div class="text">
        <div v-html="article.articleContent" id="content"></div>
      </div>
      <div class="team">~云单团队</div>
  </div>
</template>

<script>
import { Toast } from "mint-ui";
export default {
  watch: {
    $route: ["init"]
  },
  data() {
    return {
      taskTitle: "查看详情",
      id: "",
      article: {}
    };
  },
  methods: {
    init() {
      this.id = this.$route.params.id;
      let param = {
        id: this.id
      };
      this.axios
        .post(`${this.api.baseURL}/msgArticle/findArticleDetail`, param)
        .then(res => {
          if (res.data.success) {
            //把图片变小  坑
            res.data.data.result.articleContent = res.data.data.result.articleContent.replace(/img src=/g, 'img style="width: 100%" src=');
            this.article = res.data.data.result;
            this.taskTitle = this.article.articleTitle;
          } else {
            Toast("出现了点意外，请重新进入");
          }
        });
    }
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.header {
  width: 100%;
  background-color: #061128;
  height: px2rem(80px);
  line-height: px2rem(80px);
  color: #ffffff;
  text-align: center;
  font-size: px2rem(30px);

  i {
    float: left;
  }
}

.tit {
  padding: px2rem(20px);
  text-align: center;
  font-size: px2rem(36px);
  box-sizing: border-box;
}

.time {
  padding: 0 px2rem(20px);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  > span {
    float: right;
    color: #666;
  }
}

.text {
  width: 100%;
  padding: px2rem(20px);
  box-sizing: border-box;

  p span {
    opacity: 0;
  }
}

.team {
  margin-bottom:px2rem(40px);
  text-align:center;
  font-size:px2rem(28px);
  color:#666;
}
</style>


