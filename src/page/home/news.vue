<template>
  <div class="news">
      <div class="header">
          <i class="iconfont icon-back" @click="$router.push('/task0')"></i> 
          <span>消息通知</span>
      </div>
      <div class="newlist">
          <ul>
              <li v-for="item in toplist" :key="item.id" @click="openDetail(item.id)">
                  <i class="iconfont icon-xiaoxi"></i> 
                  <p style="color:red;"><strong>{{item.articleTitle}}</strong></p>
                  <span class="time">{{item.sendTime|toDate}}</span>  
              </li>
              <li v-for="item in list" :key="item.id" @click="openDetail(item.id)">
                  <i class="iconfont icon-xiaoxi"></i> 
                  <p>{{item.articleTitle}}</p>  
                  <span class="time">{{item.sendTime|toDate}}</span>
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import moment from "moment";
export default {
  data() {
    return {
      noData: "",
      pages: 0,
      pageNo: 1,
      pageSize: 10,
      toplist: [],
      list: []
    };
  },
  filters:{
    toDate(val){
      return moment(val).format("YYYY-MM-DD hh:mm");
    }
  },
  methods: {
    openDetail(id){
      this.$router.push(
        {
          name:"newsDetail",
          params:{
            id:id          
          }
        }
      );
    },
    loadTaskList() {
      this.pageNo = this.pageNo + 1;
      Indicator.open();
      let param = {
        isSend: "1",
        pageNo:this.pageNo,
        pageSize:this.pageSize
      };
      this.axios
        .post(`${this.api.baseURL}/msgArticle/findArticleList`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.toplist = res.data.data.topList.records;
            this.list = this.list.concat(res.data.data.generalList.records);
            this.pages = res.data.data.generalList.pages;
          } else {
            Toast("加载失败!");
          }
        });
      },
    init() {
      this.pageNo = 1;
      this.list = [];
      this.noData = "";
      Indicator.open();
      let param = {
        isSend: "1",
        pageNo:this.pageNo,
        pageSize:this.pageSize
      };
      this.axios
        .post(`${this.api.baseURL}/msgArticle/findArticleList`, param)
        .then(res => {
          Indicator.close();
          console.log(res);
          if (res.data.success) {
            this.toplist = res.data.data.topList.records;
            this.list = res.data.data.generalList.records;
            this.pages = res.data.data.generalList.pages;
          } else {
            Toast("加载失败!");
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

.news {
    width: 100%;
}

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

.newlist {
    width: 100%;

    li {
        position: relative;
        overflow: hidden;
        padding: px2rem(10px);

        width:100%;
        height: px2rem(80px);
        box-sizing: border-box;
        border-bottom: 1px solid #ececec;
        margin-top: px2rem(10px);
        background-color: #fcfcfc;

        i {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: px2rem(20px);
            font-size: px2rem(40px);
        }

        p {
            position: absolute;
            top: 23%;
            left: px2rem(80px);
            display: inline-block;
            width: 57%;
            height:  px2rem(40px);
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .time {
           position: absolute;
            top: 23%;
            right: 5px;
        }
    }
}
</style>



