<template>
  <div class="list-page">
    <commonalityHeader :name="headerName" :operation="operation" :flag="false">
      <div class="slot" slot="right">
          <span v-if=" $route.path == '/waybill_list/list' "><i class="iconfont icon-search"></i></span>
      </div>
    </commonalityHeader>

    <div class="content">
      <div class="tap">
        <a href="javascript:;" :class="{'active': actived === 'task0'}" @click="tabSelect('task0')">
          {{task0_title}}
        </a>
        <a href="javascript:;" :class="{'active': actived === 'task1'}" @click="tabSelect('task1')">
          {{task1_title}}
        </a>
        <a href="javascript:;" :class="{'active': actived === 'task2'}" @click="tabSelect('task2')">
          {{task2_title}}
        </a>
      </div>
    </div>

    <div class="main">
      <mt-tab-container  v-model="actived" swipeable style="width:100%;height:100%" id="miTab">  
          <mt-tab-container-item id="task0" style="width:100%;height:100%">  
            <mt-cell title="tab-container 1" style="width:100%;height:100%">
              <historyCard :task_criteria="this.task0_criteria"></historyCard>
            </mt-cell>
          </mt-tab-container-item>  

        <mt-tab-container-item id="task1" style="width:100%;height:100%">
          <mt-cell  title="tab-container 2" style="width:100%;height:100%">
            <historyCard :task_criteria="this.task1_criteria"></historyCard> 
          </mt-cell>
        </mt-tab-container-item>  

        <mt-tab-container-item id="task2" style="width:100%;height:100%">  
          <mt-cell title="tab-container 3" style="width:100%;height:100%"> 
            <historyCard :task_criteria="this.task2_criteria"></historyCard> 
          </mt-cell>
        </mt-tab-container-item>  
    </mt-tab-container>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { TabContainer, TabContainerItem } from 'mint-ui';
Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
import moment from "moment";
import historyCard from "../list/list0";
import { Toast } from "mint-ui";
import { getCookie } from "../../../js/cookie.js";
let Base64 = require("js-base64").Base64;
export default {
  data () {
    return {
      headerName:'签收运单',
      operation:'',
      actived: "task0",
      signerTel: "",
      task0_criteria: {},
      task1_criteria:{},
      task2_criteria:{},
      task0_title: "待签收",
      task1_title: "正常签收",
      task2_title: "异常签收",
      signerTimeBegin: "",
      signerTimeEnd: "",
      searchKey: "",
      pageNo: 1,
      pageSize: 5,
    }
  },
  methods: {
    tabSelect(msg) {
      this.actived = msg;
    },
    query(){
      this.signerTimeEnd = moment().format("YYYY-MM-DD");
      this.signerTimeBegin = moment().add(-1, "years").format("YYYY") + "-01-01";
      this.task0_criteria = {"signerTel": this.signerTel, "signerTimeBegin": this.signerTimeBegin, "signerTimeEnd": this.signerTimeEnd, 
               "searchKey": this.searchKey, "isInTransit": "1", "pageNo": this.pageNo, "pageSize": this.pageSize};
      this.task1_criteria = {"signerTel": this.signerTel, "signerTimeBegin": this.signerTimeBegin, "signerTimeEnd": this.signerTimeEnd, 
               "searchKey": this.searchKey, "isSignedOK": "1", "pageNo": this.pageNo, "pageSize": this.pageSize};
      this.task2_criteria = {"signerTel": this.signerTel, "signerTimeBegin": this.signerTimeBegin, "signerTimeEnd": this.signerTimeEnd, 
               "searchKey": this.searchKey, "isSignedOK": "0", "pageNo": this.pageNo, "pageSize": this.pageSize};
    }
  },
  mounted () {
    document.getElementById('miTab').children[0].style.height='100%';
    this.signerTel = getCookie("phone");
    this.query();
  },
  created(){
    this.signerTel = getCookie("phone");
  },
  components: {
    historyCard,
  }
}
</script>

<style lang="stylus" scoped>
@import '../../../components/stylus/mixins.styl';

.list-page {
  width:100%;
  height:100%;

  .content {
    margin-top: px2rem(-2px);
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
      background-color: #101a30;
      height: px2rem(80px);
      line-height: px2rem(80px);
      text-align: center;
      padding: 0 px2rem(60px);
      overflow: hidden;
      box-sizing:border-box;

      a {
        box-sizing: border-box;
        position: relative;
        top: 0;
        left: 0;
        color: #ffffff;
        font-size: px2rem(30px);
        display: inline-block;
        width: px2rem(150px);
        text-align: center;
      }
      a:first-child {
        float: left;
      }

      .active {
        border-bottom: px2rem(6px) solid #fff;

        &:after {
          content: '';
          display: block;
          width: 100%;
          height: px2rem(6px);
          position: absolute;
          bottom: px2rem(6px);
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
}

</style>


