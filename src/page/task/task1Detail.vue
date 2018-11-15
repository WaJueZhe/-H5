<template>
  <div class="peisong">
    <app-comhed :name="headerName" :operation="operation" :flag="false"></app-comhed>
    <!-- 状态栏 -->
    <scroller
    ref="myscroller" 
    :on-refresh="refresh">
      <div class="status1" v-if="!(bsTask.referId)">
        <div class="number">运单号：{{ bsTask.taskNo }}</div>
        <div>状态：
          <span>{{bsTask.status|taskStatus}}</span>
          <!-- <span v-if="bsTask.status=='1'">已接单</span>
          <span v-if="bsTask.status=='2'">执行中</span> -->
        </div>
        <div>联系人：
          <a :href="'tel:'+bsTask.createByPhone">
            <span>
              <i class="iconfont icon-dianhua1"></i>
              {{bsTask.createByName}}
            </span>
          </a>
        </div> 
        <div>
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shi"></use>
            </svg>
            <span v-if="flag">{{formatDate(bsTask.deliverPlanDate,"MM-DD HH:mm")}}</span>
          </span>
          <img src="../../assets/img/inc_Arrow.png">
          <span class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhong"></use>
            </svg>
            <span v-if="flag">{{formatDate(bsTask.unloadPlanDate,"MM-DD HH:mm")}}</span>
          </span>
        </div>
        <div>备注：{{bsTask.taskDesc}}</div>
      </div>

      <div class="status" v-else>
        <div class="number">任务单号：{{ bsTask.taskNo }}</div>
        <div class="mvvm">原始单号：{{bsTask.referId}}</div>
        <div>状态：
          <span v-if="bsTask.status=='1'">已接单</span>
          <span v-if="bsTask.status=='2'">执行中</span>
        </div>
        <div>联系人：
          <a :href="'tel:'+bsTask.createByPhone">
            <span>
              <i class="iconfont icon-dianhua1"></i>
              {{bsTask.createByName}}
            </span>
          </a>
        </div> 
        <div>
          <span>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-shi"></use>
            </svg>
            <span v-if="flag">{{formatDate(bsTask.deliverPlanDate,"MM-DD HH:mm")}}</span>
          </span>
          <img src="../../assets/img/inc_Arrow.png">
          <span class="right">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-zhong"></use>
            </svg>
            <span v-if="flag">{{formatDate(bsTask.unloadPlanDate,"MM-DD HH:mm")}}</span>
          </span>
        </div>
        <div class="beizhu">备注：{{bsTask.taskDesc}}</div>
      
      </div>
    <div class="info-card">
      <!-- 卡片视图 -->
      <div class="card" v-for="(item,index) in list" :key="index">
        <!-- 数字视图 -->
        <div v-if="item.stopType=='D'" class="number">
          <!-- 提货数字栏 -->
          <div class="tihuo">{{index+1}}</div>
        </div>
        <div v-if="item.stopType=='U'" class="number">
          <!-- 卸货数字栏 -->
          <div class="xiehuo">{{index+1}}</div>
        </div>
        <!-- 线条 -->
        <div class="line"></div>
        <!-- 提货标题栏 -->
        <div v-if="item.stopType=='D'" class="title">
          <span>提货</span>
          <span>要求提货时间：<strong v-if="flag">{{formatDate(item.planDate,"YYYY-MM-DD HH:mm")}}</strong></span>
        </div>
        <!-- 卸货标题栏 -->
        <div v-if="item.stopType=='U'" class="cargo">
          <span>卸货</span>
          <span>要求卸货时间：<strong v-if="flag">{{formatDate(item.planDate,"YYYY-MM-DD HH:mm")}}</strong></span>
        </div>
        <!-- 免签背景图 -->
        <div v-if="item.needSign=='N'" class="ground"></div>
        <!-- 卡片信息 -->
        <div class="detail">
          <div class="address">{{item.cityName}}</div>
            <div class="tail">
              <ul>
                <li>
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-yundan"></use>
                  </svg>
                  <span v-if="item.stopCompany" @touchstart="item.isNewRecord = true" @touchend="item.isNewRecord = false">{{item.stopCompany}}</span>
                  <span v-if="item.stopCompany==null||item.stopCompany==''" @touchstart="item.isNewRecord = true" @touchend="item.isNewRecord = false">运单号：{{item.shipmentIdList}}</span>
                  <!-- 显示详细运单号 -->
                  <mt-popup v-model="item.isNewRecord" class="dil"  popup-transition="popup-fade" :modal="false" >
                    {{item.shipmentIdList}}
                  </mt-popup>
                </li>
                <li>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-dingwei"></use>
                    </svg>
                  <span>{{item.districtName}}{{item.street}}</span>
                </li>
                <li>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-fangxiang"></use>
                    </svg>
                  <span>距你：{{getDistance(longitudeX,latitudeY,item.longitudeX,item.lantitudeY)}}公里</span>
                </li>
                <li>
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-qian"></use>
                    </svg>
                  <span v-if="item.paidDriverAmount==null||item.paidDriverAmount==''">无代收货款</span>
                  <span v-if="item.paidDriverAmount!=null&&item.paidDriverAmount!=''">代收贷款金额：{{item.paidDriverAmount}}元</span>
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

      <!-- 签发，签收按钮 -->
      <div class="opertain" v-if="item.stopType=='D'">
        <button v-if="(item.signTime==''||item.signTime==null)"  @click="signBegin(item.id)">签发</button>
        <mt-button v-if="!(item.signTime==''||item.signTime==null)"  disabled>已签发</mt-button>
        <button v-if="(item.actualDate==''||item.actualDate==null)"  @click="stopBegin(item.id,item.signTime)">起运</button>
        <mt-button v-if="!(item.actualDate==''||item.actualDate==null)" disabled>已起运</mt-button>
      </div>

      <!-- 签收，收货按钮 -->
      <div class="opertain" v-if="item.stopType=='U'">
         <button v-if="(item.actualDate==''||item.actualDate==null)" @click="stopEnd(item.id)">到货</button>
         <mt-button v-if="!(item.actualDate==''||item.actualDate==null)" disabled>已到货</mt-button>
         <button  v-if="(item.signTime==''||item.signTime==null)&&(item.expunconfCount==''||item.expunconfCount==null||item.expunconfCount==0)"  @click="signEnd(item.actualDate,item.id)">签收</button>
         <mt-button v-if="(!(item.signTime==''||item.signTime==null))&&(item.expunconfCount==''||item.expunconfCount==null||item.expunconfCount==0)" disabled>已签收</mt-button>
         <button style="background-color: #FF7F00" v-if="(item.expunconfCount!=''&&item.expunconfCount!=null&&item.expunconfCount>0)"  @click="abnormal(item.id)">异常签收待确认</button>
      </div>
      
      <!-- <transition name="opec">
        <app-code :codeType="item.stopType" :stopId="item.id" v-show="item.id==$store.state.stopId"></app-code>
      </transition> -->
    </div>
  </div>
  </scroller>
  <!-- 二维码弹框 -->
  <transition name="opec">
      <app-code @ievent = "ievent" :codeType="showCode.stopType" :stopId="showCode.stopId" v-show="showCode.show"></app-code>
  </transition>
</div>
</template>

<script>
import Vue from "vue";
import { Popup } from "mint-ui";
Vue.component(Popup.name, Popup);
import Code from "../../components/peisong/QRcode.vue";
import { GetDistance } from "../../js/mapUtil.js";
import { change } from "../../js/numberUtil.js";
import { DateFormat } from "../../js/timeUtil.js";
import { InfiniteScroll } from "mint-ui";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import { MessageBox } from "mint-ui";
import { wx_init } from "../../js/weixin.js";
import wx from "weixin-js-sdk";
import socketClient from '../../js/websocket'
// import BMap from "BMap"; //引用baiduMap相关的API

Vue.use(InfiniteScroll);
export default {
  watch: {
    $route: ["init"]
  },
  data() {
    return {
      headerName: "任务详情",
      operation: "",
      pages: 0,
      pageSiz: 10000,
      pageNo: 1,
      list: [],
      taskId: "",
      longitudeX: "",
      latitudeY: "",
      bsTask: "",
      popupVisible: false, //控制详情运单,
      id: "",
      flag: false,
      showCode:{
        show:false,
        stopType:'',
        stopId:''
      },
      isSub:false
    };
  },
  filters: {
    taskStatus: function(value) {
      let result = "";
      switch (value) {
        case "0":
          result = "未接单";
          break;
        case "1":
          result = "已接单";
          break;
        case "2":
          result = "执行中";
          break;
        case "10":
          result = "已完成";
          break;
        case "98":
          result = "已拒绝";
          break;
        case "99":
          result = "已取消";
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
  methods: {
        /** 
     * 上拉刷新
    */
    refresh(done) {
      let self = this;
      setTimeout(() => {
        this.init();
        done();
      }, 1500);
    },
    ievent(...data) {
      this.showCode.show = data[0];
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
    },
    abnormal(stopId){
      this.$router.push({
        name:'abnormal',
        params:{
          stopId:stopId,
          taskId:this.taskId
        }
      });
    },
    loadTaskList() {
      this.pageNo = this.pageNo + 1;
      Indicator.open();
      this.axios
        .post(
          `${this.api.loadStopList}?taskId=${this.taskId}&pageNo=${
            this.pageNo
          }&pageSize=${this.pageSiz}`
        )
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.list = this.list.concat(res.data.data.result.records);
            let slist = this.list;
          }
        });
    },
    createNotice(stype, stopId) {
      let _this = this;
      this.stompClient.stompClient.subscribe(
          "/topic/bsnotice/driver" + stopId,
          function(messageOutput) {
            var obj = JSON.parse(messageOutput.body);
            if (obj.text == "Y") {
              if (stype == "D") {
                MessageBox("提示", "对方已完成签发!");
                _this.init();
                _this.showCode.show=false;
              }
              if (stype == "U") {
                MessageBox("提示", "对方已完成签收!");
                _this.init();
                _this.showCode.show=false;
              }
            }
            if (obj.text == "ES") {
                MessageBox("提示", "对方签收存在异常，请确认!");
                _this.init();
                _this.showCode.show=false;
            }       
          }
        );
    },
    signBegin(itemId) {
      this.showCode.stopType="D";
      this.showCode.stopId=itemId,
      this.showCode.show=true;
    },
    signEnd(actualDate, itemId) {
      if (actualDate != null && actualDate != "") {
        this.showCode.stopType="U";
        this.showCode.stopId=itemId,
        this.showCode.show=true;
      } else {
        MessageBox("提示", "未到货，不能进行签收!");
      }
    },
    stopEnd(stopId) {
      Indicator.open();
     let param = {"stopId": stopId, "longitudeX": this.longitudeX, "latitudeY": this.latitudeY};
      this.axios.post(`${this.api.stopEnd}`, param).then(res => {
        Indicator.close();
        if (res.data.success) {
          Toast("到站打卡成功!");
          this.init();
        } else {
          Toast("到站打卡失败!");
        }
      });
    },
    stopBegin(spid, signtime) {
      if (signtime != null && signtime != "") {
        this.$router.replace("/fayun?stopId=" + spid);
      } else {
        MessageBox("提示", "未签发，不能发运!");
      }
    },
    init() {
      this.taskId = this.$route.params.taskid;
      Indicator.open();
      this.list = [];
      this.pageNo = 1;
      this.axios.post(`${this.api.loadStopList}?taskId=${this.taskId}&pageNo=${this.pageNo}&pageSize=${this.pageSiz}`)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.list = res.data.data.result.records;
            this.pages = res.data.data.result.pages;
            this.bsTask = res.data.data.bsTask;
            let nowTime = new Date();
            if(!this.isSub){
              setTimeout(() => {
                for(let i=0;i<this.list.length;i++){
                  if(!this.list[i].signTime){
                    this.createNotice(this.list[i].stopType,"QS"+this.list[i].id);
                    this.createNotice(this.list[i].stopType,"YC"+this.list[i].id);
                  }
                }
                this.isSub = true;
              }, 5000);
            }
          }
        });
    },
    formatDate(val, str) {
      return DateFormat(val, str);
    },
    getDistance(lat1, lng1, lat2, lng2) {
      var num = GetDistance(lat1, lng1, lat2, lng2);
      //  num = num/1000;
      num = num.toFixed(2);
      return num;
    },
    translateCallback(data) {
      this.longitudeX = data.points[0].lng;
      this.latitudeY = data.points[0].lat;
    }
  },
  created() {
    this.init();
    // 配置微信
    let url = location.href.split("#")[0];
    wx_init(url);
  },
  beforeMount() {
    var _this = this;
    //调用微信接口
    wx.ready(function() {
      //获取用户信息
      wx.getLocation({
        type: "gcj02",
        success: function(res) {
          _this.longitudeX = res.longitude;
          _this.latitudeY = res.latitude;
        }
      });
    });
    this.stompClient.stompClient.connect({}, function(frame) {
    });
  },
  components: {
    "app-code": Code
  },
  updated() {
    //隐藏最后一条线line
    let lines = document.querySelectorAll(".line");
    lines[lines.length - 1].style.display = "none";
    this.flag = true;
  }
};
</script>

<style lang="stylus">
@import '../../components/stylus/mixins.styl';

bgCol = #ececec;
zCl = #383838;
zCl1 = #f68622;
zCl2 = #939393;

// 卡片视图颜色
cardcol = #ffffff;
bordercol = #343d50; // 边框颜色
col = #383838;

.peisong {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  background-color: #ececec;
  padding-bottom: px2rem(120);

  ._v-container>._v-content {
    padding-top: px2rem(80px);
  }

  // 状态栏
  .status1 {
    padding: 0 px2rem(20px);
    box-sizing: border-box;
    overflow: hidden;
    background-color: #ffffff;
    // margin-top: px2rem(80px);
    box-shadow: px2rem(3px) px2rem(3px) px2rem(3px) rgba(0, 0, 0, 0.3);

    div {
      width: 50%;
      float: left;
      font-size: px2rem(26px);
      color: zCl;
      height: px2rem(60px);
      line-height: px2rem(60px);
      border-bottom: 1px solid #dcdcdc;
    }

    div:first-child {
      width: 100%;
    }

    div:nth-child(2) span {
      color: zCl1;
      font-weight:bold;
    }

    div:nth-child(3) {
      text-align: right;
    }

    div:nth-child(4) {
      width: 100%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      padding: 0 px2rem(28px);
      box-sizing: border-box;
      font-size: px2rem(30px);

      img:nth-child(2) {
        margin-left: px2rem(40px);
      }

      .right {
        float: right;
        margin-right: px2rem(20px);
      }
    }

    div:last-child {
      color: zCl2;
      width: 100%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      text-align: left;
      border: none;
      font-size: px2rem(26px);
    }
  }

  .status {
    padding: 0 px2rem(20px);
    box-sizing: border-box;
    overflow: hidden;
    background-color: #ffffff;
    margin-top: px2rem(80px);
    box-shadow: px2rem(3px) px2rem(3px) px2rem(3px) rgba(0, 0, 0, 0.3);

    div {
      width: 50%;
      float: left;
      font-size: px2rem(26px);
      color: zCl;
      height: px2rem(60px);
      line-height: px2rem(60px);
      border-bottom: 1px solid #dcdcdc;
    }

    div:first-child {
      width: 100%;
    }

    div:nth-child(3) span {
      color: zCl1;
      font-weight:bold;
    }

    div:nth-child(4) {
      text-align: right;
    }

    div:nth-child(5) {
      width: 100%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      padding: 0 px2rem(28px);
      box-sizing: border-box;
      font-size: px2rem(30px);

      img:nth-child(2) {
        margin-left: px2rem(40px);
      }

      .right {
        float: right;
        margin-right: px2rem(20px);
      }
    }

    .beizhu {
      color: zCl2;
      width: 100%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      text-align: left;
      border-bottom: 1px solid #dcdcdc;
      font-size: px2rem(26px);
    }

    .mvvm {
      position: relative;
      width: 100%;
      height: px2rem(80px);
      line-height: px2rem(80px);
      box-sizing: border-box;
    }
  }

  // 卡片视图
  .info-card {
    padding-bottom:px2rem(80px);
    width:100%;
 
    .card {
      position: relative;
      margin-left: px2rem(64px);
      width: 89%;
      box-shadow: px2rem(0px) px2rem(1px) px2rem(1px) #ccc;
      margin-top: px2rem(20);
      background-color: #ffffff;
      border-radius: px2rem(20px);

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
        height: px2rem(572px);
        background: linear-gradient(#2166ff, #21cdff);
      }

      // 背景图
      .ground {
        position: absolute;
        bottom: px2rem(180px);
        right: px2rem(14px);
        width: px2rem(200px);
        height: px2rem(200px);
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

      // 卡片信息
      .detail {
        height: px2rem(320px);
        position: relative;
        overflow: hidden;

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

          ul:first-child {
            position: relative;
            margin-top: px2rem(30px);

            li {
              // position: relative;
              margin-top: px2rem(10px);
              width: 90%;
              overflow: hidden;

              .dil {
                position: absolute;
                top: px2rem(80px);
                left: px2rem(280px);
                width: px2rem(210px);
                border: 1px solid #ececec;
                border-radius: px2rem(10px);
                word-wrap: break-word;
                color: #000;
                padding: px2rem(10px);
                background-color: #dcdcdc;
              }

              svg {
                float: left;
              }

              span {
                float: left;
                width: px2rem(360px);
                margin-left: px2rem(20px);
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              }
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
        // width: 100%;
        // height: px2rem(82px);
        // line-height: px2rem(82px);
        // padding: 0 px2rem(20px);
        // box-sizing: border-box;
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
          border-bottom: 1px solid #eee;
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

          i {
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

      // 签发起运
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
    }
  }

  // 控制二维码出场动画
  .opec-enter-active {
    transition: all 0.3s ease;
  }

  .opec-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }

  .opec-enter, .opec-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
}
</style>



