<template>
  <div class="feedback">
    <app-comhed :name="headername" :operation="operation" :flag="false" :back="true"></app-comhed>

    <div class="top">
      <div class="retroaction" :class="{active:activeIndex == 1}" @click="togolo(1)">我要反馈</div>
      <div class="retroaction" :class="{active:activeIndex == 2}" @click="togolo(2)">反馈记录</div>
    </div>

    <div class="retroaction-content" v-show="activeIndex == 1">
      <div class="text">
        <textarea placeholder="请描述您的问题或建议" maxlength="500" @input="descInput" v-model="desc"></textarea>
        <div class="total">
          <div class="number">{{remnant}}/500</div>
        </div>
      </div>
      <mt-field label="联系人" placeholder="请输入联系人姓名" v-model="contactName"></mt-field>
      <mt-field label="联系电话" placeholder="请输入联系电话" v-model="contactTel"></mt-field>
      <!-- <div class="phone">13812345678</div> -->
      <div class="btn" @click="save">提交</div>
    </div>
    <div class="reocrd-content" v-show="activeIndex ==2">
      <div class="info" v-for="(item,indexNo) in list" :key="indexNo">
        <div class="left">
          <div class="issue">{{item.details}}</div>
          <div class="time">{{item.createTime|toDate}}</div>
        </div>
        <div class="right" v-if="item.isSolved==1">已处理</div>
        <div class="right" v-if="item.isSolved==0 && item.isReceive==1">处理中</div>
        <div class="right" v-if="item.isSolved==0 && item.isReceive==0">待受理</div>
      </div>
      <div v-show="havemore" class="nomore">没有更多数据了</div>
    </div>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
import { getCookie } from "../../js/cookie.js";
import moment from "moment";
import { Field } from "mint-ui";

export default {
  data() {
    return {
      havemore:false,
      headername: "意见反馈",
      operation: "",
      arr: ["我要反馈", "反馈记录"],
      activeIndex: 1,
      remnant: 0,
      list: [],
      desc: "",
      contactTel: "",
      contactName: "",
      id: ""
    };
  },
  filters: {
    toDate(val) {
      return moment(val).format("YYYY-MM-DD");
    }
  },
  methods: {
    togolo(index) {
      this.activeIndex = index;
    },
    descInput() {
      var txtVal = this.desc.length;
      this.remnant = txtVal;
    },
    save() {
      if (this.desc == null || this.desc == "") {
        Toast("请输入您遇到的问题!");
        return;
      }
      if (this.contactName == null || this.contactName == "") {
        Toast("请输入联系人!");
        return;
      }
      if (this.contactTel == null || this.contactTel == "") {
        Toast("请输入联系电话!");
        return;
      }
      let p = {
        id: this.id,
        createBy: getCookie("authId"),
        details: this.desc,
        contactName:this.contactName,
        contactTel:this.contactTel,
        submitBy: "2",
        userType: "2",
        pageNo: 1,
        pageSize: 1000
      };
      Indicator.open();
      this.axios
        .post(`${this.api.baseURL}/userQuestion/saveQuestion`, p)
        .then(res => {
          Indicator.close();
          console.log(res);
          if (res.data.success) {
            Toast("问题已提交，我们会尽快与您取得联系!");
            this.desc = "";
            this.init();
            this.togolo(2);
          }
        });
    },
    init() {
      let p = {
        createBy: getCookie("authId"),
        pageNo: 1,
        pageSize: 1000
      };
      Indicator.open();
      this.axios
        .post(`${this.api.baseURL}/userQuestion/searchQuestion`, p)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.list = res.data.data.list.records;
            if(this.list.length>0){
              this.havemore=false;
            }else{
              this.havemore=true;
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

.feedback {
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;

  .btn {
    margin: 0 px2rem(10px);
    margin-top: px2rem(40px);
    height: px2rem(80px);
    line-height: px2rem(80px);
    background-color: #2166ff;
    text-align: center;
    color: #fff;
    font-size: 16px;
    border-radius: px2rem(10px);
  }

  .top {
    margin-top:px2rem(80px);
    width:100%;
    height:px2rem(120px);
    font-size:px2rem(32px);
    background-color: #eee;
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;

    .retroaction {
      width: 50%;
      height: px2rem(120px);
      line-height: px2rem(120px);
      text-align: center;

      &:first-child {
        border-right: 1px solid #ccc;
      }
    }

    .active {
      color: #39f;
    }
  }

  .retroaction-content {
    box-sizing: border-box;

    .text {
      position: relative;
      padding: px2rem(20px);
      width: 100%;
      height: px2rem(350px);
      box-sizing: border-box;
      background-color: #eee;
      border-bottom: 1px solid #ccc;

      > textarea {
        width: 100%;
        height: px2rem(250px);
        box-sizing: border-box;
      }

      .total {
        padding: 0 px2rem(20px);
        position: absolute;
        bottom: px2rem(40px);
        right: 0;
        width: 100%;
        box-sizing: border-box;

        .number {
          text-align: right;
          box-sizing: border-box;
          background-color: #fff;
        }
      }
    }

    .phone {
      padding: px2rem(40px) px2rem(20px);
      background-color: #eee;
    }

    .send {
      margin-top: px2rem(20px);
      padding: 0 px2rem(10px);
      box-sizing: border-box;

      > span {
        display:inline-block;
        padding:px2rem(20px);
        width:100%;
        text-align:center;
        font-size:px2rem(28px);
        background-color: #ccc;
        border-radius: px2rem(10px);
        box-sizing: border-box;
      }
    }
  }

  .reocrd-content {
    padding: 0 px2rem(20px);
    background-color: #eee;
    box-sizing: border-box;
    overflow: hidden;

    .info {
      margin-top: px2rem(10px);
      margin-bottom: px2rem(20px);
      padding: px2rem(20px);
      border-radius: px2rem(10px);
      color: #888;
      background-color: #fff;
      box-sizing: border-box;

      &:after {
        display: block;
        clear: both;
        content: ' ';
      }

      .left {
        float: left;
        width: 80%;

        .time {
          margin-top: px2rem(30px);
        }
      }

      .right {
        float: right;
        width: 20%;
        height: px2rem(110px);
        line-height: px2rem(110px);
        text-align: center;
        color: #000;
        font-weight: bold;
      }
    }
  }
}
</style>

