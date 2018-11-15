<template>
     <div class="taskCard">
        <!-- 数字视图 -->
        <div class="number">
            <!-- 提货数字栏 -->
            <div v-if="item.stopType=='D'" class="tihuo">{{indexNo+1}}</div>
            <!-- 卸货数字栏 -->
            <div v-if="item.stopType=='U'" class="xiehuo">{{indexNo+1}}</div>
        </div>
        <!-- 线条 -->  
        <div class="line"></div>
        <!-- 提货标题栏 -->
        <div v-if="item.stopType=='D'" class="title">
          <span>提货</span>
          <span v-if="item.actualDate">实际提货时间：{{item.actualDate}}</span>
          <span v-if="!item.actualDate" >未到提货点</span>
        </div>
        <!-- 卸货标题栏 -->
        <div v-if="item.stopType=='U'" class="cargo">
          <span>卸货</span>
          <span v-if="item.actualDate">实际卸货时间：{{item.actualDate}}</span>
          <span v-if="!item.actualDate" >未到卸货点</span>
        </div>

        <!-- 卡片信息 -->
        <div class="detail">
          <div class="address">{{item.cityName}}</div>
          <div class="tail">
            <ul>
              <li>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dingwei"></use>
                  </svg>
                  <span>{{item.cityName}}-{{item.street}}</span>
              </li>
            </ul>
            <ul>
                <li v-if="item.paidDriverAmount>0&&item.stopType=='U'">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-qian"></use>
                    </svg>
                    <span>代收货款:￥{{item.paidDriverAmount}}</span>
                </li>
            </ul>
            <ul>
              <li>{{item.totalUnits}}{{item.unitUnit}}</li>
              <li>{{item.totalVolume}}{{item.volumeUnit}}</li>
              <li>{{item.totalWeight}}{{item.weightUnit}}</li>
            </ul>

          </div>
        </div>
        <div class="tain">
            <span v-if="useSign=='Y'&&item.signTime&&item.stopType=='D'"> 签发时间:{{item.signTime}}</span>
            <span v-if="useSign=='Y'&&item.signTime&&item.stopType=='U'"> 签收时间:{{item.signTime}}</span>
            <span v-if="useSign=='Y'&&!item.signTime&&item.stopType=='D'"> 尚未签发</span>
            <span v-if="useSign=='Y'&&!item.signTime&&item.stopType=='U'"> 尚未签收</span>
            <span v-if="useSign=='N'">该任务是免签任务</span>
        </div>

        <!-- <div class="opertain" v-if="item.stopType=='U'">
            <button style="background-color: #FF7F00" v-if="(item.expunconfCount!=''&&item.expunconfCount!=null&&item.expunconfCount>0)"  @click="abnormal(item.id)">异常签收待确认</button>
        </div> -->
    </div>
</template>

<script>
import { GetDistance } from "../../js/mapUtil.js";
export default {
  props: ["item", "indexNo", "useSign", "longitudeX", "latitudeY"],
  data() {
    return {};
  },
  methods: {
    getDistance(lat1, lng1, lat2, lng2) {
      var num = GetDistance(lat1, lng1, lat2, lng2);
      //  num = num/1000;
      num = num.toFixed(2);
      return num;
    }
  },mounted () {
      //隐藏最后一条线
       let lines = document.querySelectorAll('.line')
       lines[lines.length-1].style.display = "none"
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

// 卡片视图颜色
cardcol = #ffffff;
bordercol = #343d50; // 边框颜色
col = #383838;

// 卡片视图
.taskCard {
    position: relative;
    margin-left: px2rem(64px);
    width: px2rem(660px);
    box-shadow: px2rem(0px) px2rem(1px) px2rem(1px) #ccc;
    margin-top: px2rem(20);
    border-radius: px2rem(20px);
    background-color #ffffff;

    .opertain {
        width: 100%;
        padding: px2rem(20px);
        box-sizing: border-box;
        overflow: hidden;

        button {
          // display: inline-block;
          width: px2rem(300px);
          height: px2rem(80px);
          line-height: px2rem(80px);
          text-align: center;
          background-color: #08132a;
          font-size: px2rem(30px);
          font-weight: 500;
          border-radius: px2rem(10px);
          color: #ffffff;

          &:after {
              display:block;
              clear:both;
              content:' ';
          }
          
          &:first-child {
              float: left;
          }
          &:last-child {
              float: right;
          }
        }



        // button:first-child {
        //   float: left;
        // }

        // button:last-child {
        //   float: right;
        // }
      }

    // 数字视图
    .number {
        position: absolute;
        top: px2rem(10px);
        left: px2rem(-56px);

        div {
            width: px2rem(40px);
            height: px2rem(40px);
            line-height: px2rem(36px);
            text-align: center;
            border-radius: 50%;
        }

        // 卸货
        .xiehuo {
            border: px2rem(4px) solid #f68622;
            color: #f68622;
        }

        // 提货
        .tihuo {
            border: px2rem(4px) solid #2166ff;
            color: #2166ff;
        }
    }

    // 线条
    .line {
        position: absolute;
        top: px2rem(56px);
        left: px2rem(-37px);
        width: 2px;
        height: px2rem(350px);
        background: linear-gradient(#2166ff, #21cdff);
    }



    // 提货标题栏
    .title {
        height: px2rem(70px);
        border-top-left-radius: px2rem(20px);
        border-top-right-radius: px2rem(20px);
        line-height: px2rem(70px);
        color: cardcol;
        font-size: px2rem(40px);
        padding: 0 px2rem(20px);
        background-color: #2166ff;
        overflow: hidden;
        box-sizing: border-box;

        span:last-child {
            float: right;
            margin-right: px2rem(24px);
            font-size: px2rem(26px);
        }
    }

    // 卸货标题栏
    .cargo {
        border-top-left-radius: px2rem(20px);
        border-top-right-radius: px2rem(20px);
        height: px2rem(70px);
        line-height: px2rem(70px);
        color: cardcol;
        font-size: px2rem(40px);
        padding: 0 px2rem(20px);
        background-color: #f68622;
        overflow: hidden;
        box-sizing: border-box;

        span:last-child {
            float: right;
            margin-right: px2rem(24px);
            font-size: px2rem(26px);
        }
    }

    // 卡片信息
    .detail {
        height: px2rem(220px);
        position: relative;
        overflow: hidden;
        background-color: #ffffff;

        .address {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            margin-left: px2rem(20px);
            width: px2rem(140px);
            height: px2rem(140px);
            line-height: px2rem(140px);
            text-align: center;
            background-image: url('../../assets/img/icn_black.png');
            background-size: 100% 100%;
            color: #ffffff;
            font-size: px2rem(40px);
            font-weight: 500;
        }

        .tail {
            position: absolute;
            top: 50%;
            left px2rem(200px)
            transform translateY(-50%)
            font-size: px2rem(30px);
            

            ul:first-child {
                // margin-top: px2rem(10px);
                span {
                    margin-left: px2rem(20px);
                }
            }

            ul:nth-child(2){
                margin-top: px2rem(10px);
                span {
                    margin-left: px2rem(20px);
                }
            }

            ul:last-child {
                margin-top: px2rem(10px);

                li {
                    display: inline-block;
                    border: 1px solid #ccc;
                    padding: px2rem(4px);
                    border-radius: px2rem(6px);
                }
            }
        }
    }

    // 查看地图，电话
    .tain {
        width: 100%;
        height: px2rem(82px);
        line-height: px2rem(82px);
        padding: 0 px2rem(20px);
        box-sizing: border-box;
        border-top 1px solid #ececec
        div {
            border-top: 1px solid #eee;
            text-align: center;
            color: col;
            box-sizing: border-box;
        }

    
    }
}
</style>


