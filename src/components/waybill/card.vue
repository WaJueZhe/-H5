<template>
          <!-- 卡片视图 -->
      <div class="card">
        <div class="titlt">
          <div class="til">运单号：<strong>{{item.shpNo}}</strong>
          <span v-if="item.isDriverConfirmed==0" class="unconfirmed">[待确认货损货差]</span>
          <span v-if="item.isDriverConfirmed==1" class="confirmed">[已确认货损货差]</span>
          </div>
          <div class="adress">
            <span>{{item.status|shpStatus}}</span>
          </div>
        </div>
        <div class="xing">
          <div class="left">
            <ul>
              <li>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-yundan1"></use>
                </svg>
                <span>发货地:
                  <strong>{{item.deliverFullAddress}}</strong>
                </span>
              </li>
              <li>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-shijian"></use>
                </svg>

                <span>收货地:
                  <strong>{{item.unloadFullAddress}}</strong>
                </span>
              </li>
              <li>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-weizhi"></use>
                </svg>
                <span v-if="item.status!='2'">计划开始
                  <strong>{{formatDate(item.deliverPlanDate)}}</strong>
                </span>
                <span v-if="item.status=='2'">实际开始
                  <strong v-show="item.deliverActualDate">{{formatDate(item.deliverActualDate)}}</strong>
                  <strong v-show="!item.deliverActualDate">未知</strong>
                </span>
              </li>
              <li>
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#icon-weizhi"></use>
                </svg>
                <span v-if="item.status!='2'">计划结束
                  <strong>{{formatDate(item.unloadPlanDate)}}</strong>
                </span>
                <span v-if="item.status=='2'">实际结束
                  <strong v-show="item.unloadActualDate">{{formatDate(item.unloadActualDate)}}</strong>
                  <strong v-show="!item.unloadActualDate">未知</strong>
                </span>                
              </li>
            </ul>
            <!-- 方块视图 -->
            <ul>
              <li>{{item.totalUnits.toFixed(2)}}{{item.unitUnit}}</li>
              <li>{{item.totalVolume.toFixed(2)}}{{item.volumeUnit}}</li>
              <li>{{item.totalWeight.toFixed(2)}}{{item.weightUnit}}</li>
            </ul>
          </div>
        </div>
      </div>
</template>

<script>
import { DateFormat } from "../../js/timeUtil.js";

export default {

  props:['item'],
  filters: {
    shpStatus: function(value) {
      let result = "";
      switch (value) {
        case "0":
          result = "已派车";
          break;
        case "0.5":
          result = "已签发";
          break;          
        case "1":
          result = "在途";
          break;
        case "1.5":
          result = "已到货";
          break;          
        case "2":
          result = "已签收";
          break;
        case "-1":
          result = "已取消";
          break;
        case "-2":
          result = "已终止";
          break;
      }
      return result;
    },
    ifNull:function(value){
      if(value==null||value==''){
        return "-"
      }else{
        return value;
      }
    }
  },
  methods:{
    formatDate(val){
        return DateFormat(val,"YYYY-MM-DD HH:mm");
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

bg-col = #343d50; // 背景色
col = #383838; // 字体颜色

.card {
  margin-top: px2rem(20px);
  padding-bottom :px2rem(20px);
  // height: px2rem(400px);
  border-radius: px2rem(20px);
  overflow: hidden;
  background-color #ffffff
  box-shadow: px2rem(0px) px2rem(1px) px2rem(1px) #ccc;

  // 卡片标题
  .titlt {
    width: 100%;
    box-sizing: border-box;
    padding: 0 px2rem(20px);
    height: px2rem(70px);
    line-height: px2rem(70px);
    background-color: bg-col;
    overflow: hidden;

    .til {
      float: left;
      font-size: px2rem(30px);
      color: #ffffff;
    }

    .adress {
      float: right;
      color: #ffffff;
      font-size: px2rem(26px);
    }
  }

  // 卡片内容区域
  .xing {
    padding: 0 px2rem(20px);
    
    overflow: hidden;

    .left {
      float: left;

      ul:first-child {
        li {
          color: col;
          margin-top: px2rem(10px);
          font-size: px2rem(30px);

          span {
            margin-left: px2rem(20px);
          }
        }

        li:last-child svg {
          opacity: 0;
        }
      }

      ul:last-child {
        margin-top: px2rem(10px);
        padding-left: px2rem(50px);

        li {
          display: inline-block;
          border: 1px solid #999ea7;
          padding: px2rem(2px) px2rem(6px);
          border-radius: px2rem(6px);
          margin-left: px2rem(10px);
        }
      }
    }
  }
.unconfirmed{
  color:#ff3300;
  font-weight :bold;
}
.confirmed{
  color:#28C728;
  font-weight :bold;
}

}
</style>


