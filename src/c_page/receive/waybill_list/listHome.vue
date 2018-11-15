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
            <mt-cell style="width:100%;height:100%">
              <list0 :task_criteria="this.task0_criteria"></list0>
            </mt-cell>
          </mt-tab-container-item>  

        <mt-tab-container-item id="task1" style="width:100%;height:100%">
          <mt-cell style="width:100%;height:100%">
            <list0 :task_criteria="this.task1_criteria"></list0> 
          </mt-cell>
        </mt-tab-container-item>  

        <mt-tab-container-item id="task2" style="width:100%;height:100%">  
          <mt-cell style="width:100%;height:100%"> 
            <list0 :task_criteria="this.task2_criteria"></list0> 
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
import list0 from "../list/list0";
let Base64 = require("js-base64").Base64;
export default {
  data () {
    return {
      headerName:'运单列表',
      operation:'',
      actived: "task0",
      externalPara: "null",
      externalJson: {},
      filters:{
        signerTel: "",
        signerTimeBegin: "",
        signerTimeEnd: "",
        searchKey: "",
        isInTransit: "",
        isSignedOK: "",
        pageNo: "1",
        pageSize: "5"
      },
      task0_criteria: {},
      task1_criteria:{},
      task2_criteria:{},
      task0_title: "待签收(0)",
      task1_title: "正常签收(0)",
      task2_title: "异常签收(0)",
    }
  },
  methods: {
    tabSelect(msg) {
      this.actived = msg;
    },
    initCreteria: function() {
      if (this.externalPara && this.externalPara.signerTel) {
        //初始化查询条件
        //let tmp = '{"exceptionStatus": "1", "createDateRange":["2018-01-27", "2018-01-29"]}';
        let tmp = this.externalPara;
        let j = tmp;
        this.filters.signerTel = j.signerTel;
        this.filters.signerTimeBegin = j.signerTimeBegin;
        this.filters.signerTimeEnd = j.signerTimeEnd;
        this.filters.searchKey = j.searchKey;
        this.filters.isInTransit = j.isInTransit;
        this.filters.isSignedOK = j.isSignedOK;
        this.filters.pageNo = j.pageNo;
        this.filters.pageSize = j.pageSize;
        this.task0_title = "待签收(" + (this.externalJson.intransitQty > 99 ? 99 : this.externalJson.intransitQty) + ")";
        this.task1_title = "正常签收(" + (this.externalJson.signedOK > 99 ? 99 : this.externalJson.signedOK) + ")";
        this.task2_title = "异常签收(" + (this.externalJson.signedNonOK > 99 ? 99 : this.externalJson.signedNonOK) + ")";
      } else {
        this.filters = {
          signerTel: "",
          signerTimeBegin: "",
          signerTimeEnd: "",
          searchKey: "",
          isInTransit: "",
          isSignedOK: "",
          pageNo: "1",
          pageSize: "5"
        };
      }
      this.query();
      this.setActiveTab();
    },
    query(){
      this.task0_criteria = {"signerTel": this.filters.signerTel, "signerTimeBegin": this.filters.signerTimeBegin, "signerTimeEnd": this.filters.signerTimeEnd, 
               "searchKey": this.filters.searchKey, "isInTransit": "1", "pageNo": this.filters.pageNo, "pageSize": this.filters.pageSize};
      this.task1_criteria = {"signerTel": this.filters.signerTel, "signerTimeBegin": this.filters.signerTimeBegin, "signerTimeEnd": this.filters.signerTimeEnd, 
               "searchKey": this.filters.searchKey, "isSignedOK": "1", "pageNo": this.filters.pageNo, "pageSize": this.filters.pageSize};
      this.task2_criteria = {"signerTel": this.filters.signerTel, "signerTimeBegin": this.filters.signerTimeBegin, "signerTimeEnd": this.filters.signerTimeEnd, 
               "searchKey": this.filters.searchKey, "isSignedOK": "0", "pageNo": this.filters.pageNo, "pageSize": this.filters.pageSize};
    },
    setActiveTab(){
      let t = "task" + (this.externalJson.activeTab - 1);
      this.tabSelect(t);
    }
  },
  watch:{
    $route: {
      handler(val){
        this.externalJson = JSON.parse(Base64.decode(this.$route.params.externalPara));
        this.externalPara = this.externalJson.criteria;
        this.initCreteria();
      }
    }
  },
  mounted () {
    this.externalJson = JSON.parse(Base64.decode(this.$route.params.externalPara));
    this.externalPara = this.externalJson.criteria;
    this.initCreteria();
    document.getElementById('miTab').children[0].style.height='100%'
  },
  components: {
    list0,
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
        width: px2rem(190px);
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


