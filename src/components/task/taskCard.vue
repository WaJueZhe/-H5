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
    <!-- <div class="line"></div> -->
    <!-- 提货标题栏 -->
    <div v-if="item.stopType=='D'" class="title">
      <span>提货</span>
      <span>要求提货时间：{{item.planDate}}</span>
    </div>
    <!-- 卸货标题栏 -->
    <div v-if="item.stopType=='U'" class="cargo">
      <span>卸货</span>
      <span>要求卸货时间：{{item.planDate}}</span>
    </div>
    <!-- 背景图 -->
    <div v-if="useSign=='N'" class="ground"></div>
    <!-- 卡片信息 -->
    <div class="detail">
      <div class="address">{{item.cityName}}</div>
      <div class="tail">
        <ul class="list">
          <li v-if="item.stopCompany">
            <i class="iconfont">&#xe619;</i>
            <span>{{item.stopCompany}}</span>
            <!-- <span class="particulars" @click="$store.state.pickUpDetail = true"><i class="iconfont icon-yundan1"></i></span> -->
          </li>
          <li>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-weizhi"></use>
            </svg>
            <span>{{item.cityName}}-{{item.street}}</span>
          </li>          
          <li>
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-fangxiang"></use>
            </svg>
            <span>距你：{{getDistance(longitudeX,latitudeY,item.longitudeX,item.lantitudeY)}}公里</span>
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
        <div @click="lookMap(item.longitudeX,item.lantitudeY,item.provinceName+item.cityName+item.districtName+item.street,item.stopCompany)">
        <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-dingwei-yuan"></use>
        </svg>
          <i></i>
          <span>查看地图</span>
        </div>
      <div>
        <a :href="'tel:'+item.contactMobile">
            <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-dianhua"></use>
            </svg>
          <span>{{item.contactPerson}}</span>
        </a>
      </div>
    </div>
    <!-- 签收，收货按钮 -->
    <div class="opertain" v-if="item.stopType=='U'">
        <button style="background-color: #FF7F00" v-if="(item.expunconfCount!=''&&item.expunconfCount!=null&&item.expunconfCount>0)"  @click="abnormal(item.id)">异常签收待确认</button>
    </div>
  </div>
</template>

<script>
import { GetDistance } from "../../js/mapUtil.js";
import { wx_init } from "../../js/weixin.js";
import wx from "weixin-js-sdk";
export default {
  props: ["item", "indexNo", "useSign", "longitudeX", "latitudeY"],
  data() {
    return {};
  },
  methods: {
    abnormal(stopId){
      this.$router.push({
        name:'abnormal',
        params:{
          stopId:this.item.id,
          taskId:this.item.taskId
        }
      });
    },
    lookMap(px, py ,adr,adrname) {
      let p1 = {
        x: this.longitudeX,
        y: this.latitudeY
      };
      let p2 = {
        x: px,
        y: py,
        adr:adr
      };
      wx.openLocation({
        latitude: Number(py), // 纬度，浮点数，范围为90 ~ -90
        longitude: Number(px), // 经度，浮点数，范围为180 ~ -180。
        name: adrname, // 位置名
        address: adr, // 地址详情说明
        scale: 16 // 地图缩放级别,整形值,范围从1~28。默认为最大
      })
      // this.$router.push({
      //   name: "drivingRoute",
      //   params: {
      //     p1: p1,
      //     p2: p2
      //   }
      // });
    },
    getDistance(lat1, lng1, lat2, lng2) {
      var num = GetDistance(lat1, lng1, lat2, lng2);
      //  num = num/1000;
      num = num.toFixed(2);
      return num;
    }
  },
  created() {
    // 配置微信
    let url = location.href.split("#")[0];
    wx_init(url);
  },
  mounted () {
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
    background-color: #ffffff;
    border-radius: px2rem(20px);

    &:after {
      position: absolute;
      top: px2rem(54px);
      left: px2rem(-36px);
      content: ' ';
      width: px2rem(4px);
      height: 93%;
      background: linear-gradient(#2166ff, #21cdff);
      
    }

    // 数字视图
    .number {
        position: absolute;
        top: px2rem(10px);
        left: px2rem(-54px);

        div {
            width: px2rem(40px);
            height: px2rem(40px);
            line-height: px2rem(34px);
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
        height: px2rem(360px);
        background: linear-gradient(#2166ff, #21cdff);
    }


    // 背景图
    .ground {
        position: absolute;
        bottom: px2rem(60px);
        right: px2rem(14px);
        width: px2rem(200px);
        height: px2rem(200px);
        z-index: 2;
        background-image: url('../../assets/img/icn_miao.png');
        background-repeat: no-repeat;
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
        }

        button:first-child {
          float: left;
        }

        button:last-child {
          float: right;
        }
      }

    // 卡片信息
    .detail {
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
            margin-left: px2rem(190px);
            font-size: px2rem(30px);

            .list {
                // height :px2rem(154px);
            }

            ul:first-child {
                margin-top: px2rem(20px);

                li {
                    margin-top: px2rem(10px);

                    > img {
                        padding-left :2px;
                        width :20px;
                        height :20px;
                    }

                   > i {
                     font-size:px2rem(40px);
                     margin-left:px2rem(4px);
                   }
                   
                   .particulars {
                     margin-left:px2rem(150px);

                     > i {
                       font-size:px2rem(40px);
                     }
                   }
                }

                span {
                    margin-left: px2rem(20px);
                }
            }

            ul:last-child {
                margin-top: px2rem(10px);
                margin-bottom :px2rem(10px);
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
        background-color: #ffffff;
        display: inline-block;
        font-size:px2rem(32px);

        div {
            border-top: 1px solid #eee;
            text-align: center;
            color: col;
            box-sizing: border-box;

            span:last-child {
                margin-left: px2rem(20px);
            }
        }

        div:first-child {
            float: left;
            width: 50%;
            position: relative;
            overflow: hidden;
            i:nth-child(2) {
                position: absolute;
                top: 50%;
                right: -1px;
                transform: translateY(-50%);
                width: 1px;
                height: 60%;
                border: 1px solid #eee;
            }
        }

        div:last-child {
            float: right;
            width: 50%;
        }
    }

    
}
</style>


