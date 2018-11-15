<template>
  <div class="header">
      <div class="bar" @click="$store.state.toggleaside = !$store.state.toggleaside">
          <img src="../../assets/img/inc_Navigation.png">
      </div>
      <div class="titlt">
          <h2>首页</h2>
      </div>
      <div class="main" @click="$router.push('/news')">
          <img src="../../assets/img/icn_news.png">
      </div>
  </div>
</template>

<script>
import Vue from "vue";
import { MessageBox } from "mint-ui";

export default {
  methods: {
    //显示侧滑导航栏
    toggle() {
      //console.log(1);
    },
    openNews(title, text) {
      MessageBox({
        title: "新消息",
        message: "收到新消息，是否立即查看？",
        showCancelButton: true,
        confirmButtonText: "查看"
      }).then(action => {
        this.$router.push({
          name: "newsDetail",
          params: {
            title: title,
            text: text
          }
        });
      });
    },
    noticeSub() {
      let _this = this;
      this.stompClient.stompClient.connect({}, function(frame) {
        _this.stompClient.stompClient.subscribe("/topic/notice/", function(messageOutput) {
          //log(messageOutput);
          var obj = JSON.parse(messageOutput.body);
          //收到信息消息的业务处理
        });

        _this.stompClient.stompClient.subscribe("/topic/article", function(
          messageOutput
        ) {
          //console.log(messageOutput);
          var obj = JSON.parse(messageOutput.body);
          var item = JSON.parse(obj.text);
          //收到新公告或文章
          MessageBox.confirm(
            "收到公告消息，立即查看?"
          ).then(action => {
            _this.$router.push({
              name: "newsDetail",
              params: {
                id: item.id
              }
            });
          });
        });
      });
    }
  },
  created() {
    this.noticeSub();
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

bg-col = #101a30;
clo = #ffffff;

.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  box-sizing: border-box;
  padding: 0 px2rem(20px);
  height: px2rem(88px);
  line-height: px2rem(88px);
  color: clo;
  text-align: center;
  background-color: bg-col;

  .bar {
    float: left;
  }

  .main {
    float: right;
    cursor: pointer;
  }

  .titlt {
    display: inline-block;

    h2 {
      font-size: px2rem(40px);
      font-weight: normal;
    }
  }
}
</style>


