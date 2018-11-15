<template>
  <div class="receiveMessage-page">
    <div class="info">收货信息</div>
    <div class="message">
      <div class="name">名称：</div>
      <div class="input">
        <input maxlength="25" v-model="item.unitDesc" type="text" placeholder="请输入货物的名称">
      </div>
    </div>
    <div class="message">
      <div class="name">件数：</div>
      <div class="input">
        <input v-model="item.plannedUnits" type="text" placeholder="请输入货物的件数">
      </div>
    </div>
    <div class="message">
      <div class="name">体积：</div>
      <div class="input">
        <input v-model="item.plannedVolume" type="text" placeholder="请输入货物的体积（方）">
      </div>
    </div>
    <div class="message">
      <div class="name">重量：</div>
      <div class="input">
        <input v-model="item.plannedWeight" type="text" placeholder="请输入货物的重量（吨）">
      </div>
    </div>
    <div class="msg-btn">
      <div class="btn" @click="cancle">取消</div>
      <div class="btn" @click="submit">确定</div>
    </div>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
import { MessageBox } from 'mint-ui';
export default {
  data () {
    return {
      item:{
        unitDesc:null,
        plannedUnits:null,
        plannedVolume:null,
        plannedWeight:null
      },
      receiveBox:false
    }
  },
  methods: {
    //确认选择
    submit(){
      if(this.item.unitDesc ==null||this.item.unitDesc ==''){
        Toast("货物描述不能为空");
        return;
      }
      if(this.item.plannedUnits ==null||this.item.plannedUnits ==''||this.item.plannedUnits==0){
        Toast("件数不能为空");
        return;
      }else{
        if(!this.isNumber(this.item.plannedUnits)){
          Toast("件数只能为数字");
          return;
        }else if(Number(this.item.plannedUnits)<0){
          Toast("件数不能为负数");
          return;
        }
      }
      if(this.item.plannedVolume ==null||this.item.plannedVolume ==''||this.item.plannedVolume==0){
        Toast("体积不能为空");
        return;
      }else{
        if(!this.isNumber(this.item.plannedVolume)){
          Toast("体积只能为数字");
          return;
        }else if(Number(this.item.plannedVolume)<0){
          Toast("体积不能为负数");
          return;
        }
      }  
      if(this.item.plannedWeight ==null||this.item.plannedWeight ==''||this.item.plannedWeight==0){
        Toast("重量不能为空");
        return;
      }else{
        if(!this.isNumber(this.item.plannedWeight)){
          Toast("重量只能为数字");
          return;
        }else if(Number(this.item.plannedWeight)<0){
          Toast("重量不能为负数");
          return;
        }
      }   

      this.$emit('abolish',this.item);
      this.item={};

    },
    cancle(){
      this.item = {};
      this.$emit('abolish',this.receiveBox);
    },
    //判断是否为数字
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.receiveMessage-page {
  width:100%;
  height:100%;

  .info {
    width:100%;
    height:px2rem(100px);
    line-height:px2rem(100px);
    text-align:center;
    font-size:px2rem(32px);
    background-color:#eee;
  }

  .message {
    margin-top:px2rem(20px);
    padding: 0 px2rem(40px);
    width:100%;
    height:px2rem(80px);
    line-height:px2rem(80px);
    background-color: #fff;
    box-sizing:border-box;

    &:after {
      display:block;
      clear: both;
      content:' ';
    }

    .name {
      float: left;
      width:20%;
      font-size:px2rem(30px);
    }

    .input {
      float:right;
      width:80%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      background-color: #000;

      > input {
        padding-left:px2rem(5px);
        width:100%;
        height:100%;
        font-size:px2rem(30px);
      }
    }
  }

  .msg-btn {
    position: fixed;
    bottom:px2rem(20px);
    left:0;
    padding: 0 px2rem(40px);
    width:100%;
    height:px2rem(80px);
    line-height:px2rem(80px);
    display:flex;
    justify-content:space-between;

    .btn {
      flex:1;
      text-align:center;
      background-color:#2166ff;
      color:#fff;
      font-size:px2rem(32px);
      border-radius:px2rem(10px);

      &:first-child {
        margin-right:px2rem(40px);
      }
    }
  }
}
</style>
