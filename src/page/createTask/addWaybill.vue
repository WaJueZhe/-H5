<template>
  <div class="addWaybill-page">
    <app-comhed :name="headerName" :operation = "operation" :flag = "false" :back="true" v-show="fromBox"></app-comhed>
    <div class="from" v-show="fromBox">
      <div class="group-item">
        <div class="original">原始单号：</div>
        <div class="input">
          <input type="text" v-model="shpTemp.referId"  placeholder="原始运单号（选填）">
        </div>
        <div class="right" ><i @click="scan" class="iconfont icon-chadan"></i></div>
      </div>
      <div class="info-item">
        <div class="info-left" @click="deliver = true">
          <i class="iconfont icon-dingwei1"></i>
          <span class="name" style="color:black" v-if="shpTemp.tempDeiverInfo">{{shpTemp.tempDeiverInfo}}</span>
          <span class="name" v-if="!shpTemp.tempDeiverInfo">发货单位/发货人</span>
          <div class="forwarding-unit"><img src="../../assets/img/u1993.png" alt=""></div>
        </div>
        <div class="info-right" @click="pickTime('S')">
          <i class="iconfont icon-shijian"></i>
          <span v-if="shpTemp.deliverPlanDate">{{shpTemp.deliverPlanDate}}</span>
          <span v-else class="sendTime">发货时间</span>
        </div>
      </div>
      <div class="info-item">
        <div class="info-left" @click="unload = true">
          <i class="iconfont icon-dingwei1"></i>
          <span class="name" style="color:black" v-if="shpTemp.tempUnloadInfo">{{shpTemp.tempUnloadInfo}}</span>
          <span class="name" v-if="!shpTemp.tempUnloadInfo">收货网点/收货人</span>
          <div class="forwarding-unit"><img src="../../assets/img/u1993.png" alt=""></div>
        </div>
        <div class="info-right" @click="pickTime('E')">
          <i class="iconfont icon-shijian"></i>
          <span v-if="shpTemp.unloadPlanDate">{{shpTemp.unloadPlanDate}}</span>
          <span v-else class="sendTime">收货时间</span>
        </div>
      </div>

      <div class="switch">
        <mt-switch v-model="value" @change="change">是否代收货款</mt-switch>
        <div class="switch-input" v-show="switchBox">
          <div class="group-item">
            <div class="original">代收金额：</div>
            <div class="input">
              <input v-model="shpTemp.PaidDriverAmount" type="text" placeholder="代收货款金额（元）">
            </div>
          </div>
        </div>
      </div>

      <div class="cargo-msg" @click="addMessage">
        <span class="image"><img src="../../assets/img/u1974.png" alt=""></span>
        <span>货物信息</span>
      </div>
    </div>

    <div class="msg-btn">
      <div class="btn" @click="cancle">取消</div>
      <div class="btn" @click="submitShp">确定</div>
    </div>

    <!-- 货物信息显示列表 -->
    <div class="group-box" v-if="showList&&shpTemp.shipmentUnitList.length>0">
      <table style="border-collapse :collapse ;">
        <tr style="background-color: #fff;font-weight:bold">
          <td>货物名称</td>
          <td>件数</td>
          <td>体积</td>
          <td>重量</td>
        </tr>
        <tr style="background-color: #fff;" v-for="(item,index) in shpTemp.shipmentUnitList" :key="index">
          <td>{{item.unitDesc}}</td>
          <td>{{item.plannedUnits}}件</td>
          <td>{{item.plannedVolume}}方</td>
          <td>{{item.plannedWeight}}吨<i class="iconfont icon-delete" @click="deleteRow(index)"></i></td>
        </tr>
      </table>
    </div>
    

    <!-- 装货弹框 -->
    <div class="deliverBox" v-if="deliver">
      <div class="deliverBox-top">
        <i class="iconfont icon-back" @click="deliver = false"></i>
        <span>地址管理</span>
      </div>
      <deliver @choseItem="choseItem"></deliver>
    </div>

    <!-- 卸货弹框 -->
    <div class="deliverBox" v-if="unload">
      <div class="deliverBox-top">
        <i class="iconfont icon-back" @click="unload = false"></i>
        <span>地址管理</span>
      </div>
      <unload @choseUnloadItem="choseUnloadItem"></unload>
    </div>

    <!-- 货物信息弹框 -->
    <receiveMessage v-show="messageBox" @abolish="abolish"></receiveMessage>
    <!-- 时间选择器 -->
    <formData :showPicker="timePicker" @ievent="ievent" ></formData>
  </div>
</template>
<script>
// 配置微信
import { wx_init } from "../../js/weixin.js";
// 引用微信的配置文件
import wx from "weixin-js-sdk";
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
import { MessageBox } from 'mint-ui';
import formData from '../../components/common/timeChose.vue';
import deliver from '../../components/deliver/deliver.vue'
import unload from '../../components/unload/unload.vue'
import receiveMessage from './receiveMessage.vue'
import Vue from 'vue'
import { Switch } from 'mint-ui';
Vue.component(Switch.name, Switch);
export default {
  data () {
    return {
      headerName:'新增运单',
      operation:'',
      tempTime:'',
      shpTemp:{
        id: '',
        referId:'',
        tempDeiverInfo:'',
        tempUnloadInfo:"",
        tempTotalCount:0,
        tempTotalVol:0,
        tempTotalWeight:0,
        tempTotalDesc:'',
        deliverPlanDate:'',
        unloadPlanDate:'',
        shipmentUnitList:[]
      },    
      timePicker:false,
      deliver:false,
      deliverItem:{},
      unload:false,
      unloadItem:{},
      messageBox:false,
      fromBox:true,
      showList:true,
      value:false,
      switchBox:false,
    }
  },

  methods: {

    //保存运单
    submitShp(){
      if(!this.deliverItem.id){
          Toast("出发地不能为空");
          return;
      }
      if(this.shpTemp.deliverPlanDate==''||this.shpTemp.deliverPlanDate==null){
          Toast("计划出发时间不能为空");
          return;
      }      
      if(!this.unloadItem.id){
          Toast("目的地不能为空");
          return;
      }
      if(this.shpTemp.unloadPlanDate==''||this.shpTemp.unloadPlanDate==null){
          Toast("计划到达时间不能为空");
          return;
      }     

      if(this.shpTemp.unloadPlanDate<this.shpTemp.deliverPlanDate){
          Toast("计划到达时间不能早于计划出发时间");
          return;
      }

      //判断是否维护明细
      let unitNumber = this.shpTemp.shipmentUnitList.length;
      if(unitNumber==0){
          Toast("货物明细不能为空");
          return;
      }


      this.shpTemp.categoryDesc = null; // no change!!!
      if(!this.value){
        this.shpTemp.isPaidToDriver = '0';
        this.shpTemp.PaidDriverAmount = '0';
      }else{
        if(!this.isNumber(this.shpTemp.PaidDriverAmount)){
          Toast("代收货款金额只能为数字");
          return;
        }else if(Number(this.shpTemp.PaidDriverAmount)<=0){
          Toast("代收货款金额不能小于0");
          return;
        }else{
          this.shpTemp.isPaidToDriver = '1';
        }
      }

      this.shpTemp.isUseEsign = 'Y';
      this.shpTemp.goodsDesc = this.shpTemp.tempTotalDesc;
      
      let delFullAddr = this.deliverItem.provinceName+this.deliverItem.cityName+this.deliverItem.districtName+this.deliverItem.street;
      this.shpTemp.deliverCountryCode = 'CN';
      this.shpTemp.deliverProvinceCode = this.deliverItem.provinceCode;
      this.shpTemp.deliverCityCode = this.deliverItem.cityCode;
      this.shpTemp.deliverDistrictCode = this.deliverItem.districtCode;
      this.shpTemp.deliverProvinceNameTemp = this.deliverItem.provinceName;
      this.shpTemp.deliverCityNameTemp = this.deliverItem.cityName;
      this.shpTemp.deliverDistrictNameTemp = this.deliverItem.districtName;
      this.shpTemp.deliverStreet = this.deliverItem.street;
      this.shpTemp.deliverFullAddress = delFullAddr;
      this.shpTemp.deliverCompany = this.deliverItem.addressName;
      this.shpTemp.deliveryLongitudeX = this.deliverItem.longitudeX;
      this.shpTemp.deliveryLongitudeY = this.deliverItem.latitudeY;
      this.shpTemp.deliverContactPerson = this.deliverItem.currentContactPerson;
      this.shpTemp.deliverContactMobile = this.deliverItem.currentContactMobile;
      this.shpTemp.deliverItem = this.deliverItem;

      let undFullAddr = this.unloadItem.provinceName+this.unloadItem.cityName+this.unloadItem.districtName+this.unloadItem.street;
      this.shpTemp.unloadCountryCode = 'CN';
      this.shpTemp.unloadProvinceCode = this.unloadItem.provinceCode;
      this.shpTemp.unloadCityCode = this.unloadItem.cityCode;
      this.shpTemp.unloadDistrictCode = this.unloadItem.districtCode;
      this.shpTemp.unloadProvinceNameTemp = this.unloadItem.provinceName;
      this.shpTemp.unloadCityNameTemp = this.unloadItem.cityName;
      this.shpTemp.unloadDistrictNameTemp = this.unloadItem.districtName;
      this.shpTemp.unloadStreet = this.unloadItem.street;
      this.shpTemp.unloadFullAddress = undFullAddr;
      this.shpTemp.unloadCompany = this.unloadItem.addressName;
      this.shpTemp.unloadLongitudeX = this.unloadItem.longitudeX;
      this.shpTemp.unloadLongitudeY = this.unloadItem.latitudeY;
      this.shpTemp.unloadContactPerson = this.unloadItem.currentContactPerson;
      this.shpTemp.unloadContactMobile = this.unloadItem.currentContactMobile;
      this.shpTemp.unloadItem = this.unloadItem;

      if(this.shpTemp.id==null||this.shpTemp.id==''){
        for(let i=0;i<this.$store.state.createTask.shipmentlist.length;i++){
          if(this.$store.state.createTask.shipmentlist[i].deliverFullAddress == this.shpTemp.deliverFullAddress
          &&this.$store.state.createTask.shipmentlist[i].unloadFullAddress == this.shpTemp.unloadFullAddress){
            MessageBox.alert('您录入了相同线路的运单，请确认录入是否准确！').then(action => {
              return;
            });
          }
        }
        this.shpTemp.id=this.guid();
        this.$store.state.createTask.shipmentlist.push(this.shpTemp);
      }else{
        for(let i=0;i<this.$store.state.createTask.shipmentlist.length;i++){
          if(this.$store.state.createTask.shipmentlist[i].id==this.shpTemp.id){
            this.$store.state.createTask.shipmentlist[i] = this.shpTemp;
          }
        }
      }

      

      this.shpTemp={
        id: '',
        referId:'',
        tempDeiverInfo:'',
        tempUnloadInfo:"",
        tempTotalCount:0,
        tempTotalVol:0,
        tempTotalWeight:0,
        tempTotalDesc:'',
        deliverPlanDate:'',
        unloadPlanDate:'',
        shipmentUnitList:[]
      }, 
      this.$router.go(-1);

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
    },
    change(){
      if(this.value == true){
        this.switchBox = true
      }else {
        this.switchBox = false
      }
    },
    ievent(val){
      if(this.tempTime=="S"){
        this.shpTemp.deliverPlanDate = val;
      }
      if(this.tempTime=="E"){
        this.shpTemp.unloadPlanDate = val;
      }      
    },
    pickTime(val){
      this.tempTime=val;
      this.timePicker = !this.timePicker
    },
    addMessage(){
      this.fromBox = false;
      this.messageBox = true;
      this.showList = false;
    },
    //完成明细的新增
    abolish(val){
      if(val){
        val.unitNo='1';
        val.plannedGoodsValue = '0.00';
        console.log(val);
        this.shpTemp.shipmentUnitList=this.shpTemp.shipmentUnitList.concat(val);
        this.unitCount();
      }
      
      this.messageBox = false;
      this.showList = true;
      this.fromBox = true;
    },
    //完成出发地的选择
    choseItem(item){
      if(item){
        if(item.addressName!=''&&item.addressName!=null&&item.addressName!=undefined){
          this.shpTemp.tempDeiverInfo = item.addressName+"/"+item.currentContactPerson
        }else{
          this.shpTemp.tempDeiverInfo = item.currentContactPerson+"/"+item.currentContactMobile
        }
        this.deliverItem = item;
        
      }
      this.deliver=false;
    },
    //完成到达地点选择
    choseUnloadItem(item){
      if(item){
        if(item.addressName!=''&&item.addressName!=null&&item.addressName!=undefined){
          this.shpTemp.tempUnloadInfo = item.addressName+"/"+item.currentContactPerson
        }else{
          this.shpTemp.tempUnloadInfo = item.currentContactPerson+"/"+item.currentContactMobile
        }

        this.unloadItem = item;
        
      }
      this.unload=false;
    },
    cancle(){
      this.shpTemp={
        id: '',
        referId:'',
        tempDeiverInfo:'',
        tempUnloadInfo:"",
        tempTotalCount:0,
        tempTotalVol:0,
        tempTotalWeight:0,
        tempTotalDesc:'',
        deliverPlanDate:'',
        unloadPlanDate:'',
        shipmentUnitList:[]
      }, 
      this.$router.go(-1);
    },
    //删除明细元素
    deleteRow(index){
        this.shpTemp.shipmentUnitList.splice(index,1);
        this.unitCount();
    },
    //计算明细汇总的数量及货物描述
    unitCount(){
      if(this.shpTemp.shipmentUnitList.length>0){
        let lnt = this.shpTemp.shipmentUnitList.length;
        this.shpTemp.tempTotalCount = 0;
        this.shpTemp.tempTotalVol = 0;
        this.shpTemp.tempTotalWeight = 0;
        this.shpTemp.tempTotalDesc = '';
        for(let i=0;i<lnt;i++){
          let unitItem = this.shpTemp.shipmentUnitList[i];
          this.shpTemp.tempTotalCount = Number(this.shpTemp.tempTotalCount)+Number(unitItem.plannedUnits);
          this.shpTemp.tempTotalVol = Number(this.shpTemp.tempTotalVol)+Number(unitItem.plannedVolume);
          this.shpTemp.tempTotalWeight = Number(this.shpTemp.tempTotalWeight)+Number(unitItem.plannedWeight);
          this.shpTemp.tempTotalDesc = this.shpTemp.tempTotalDesc+"、"+unitItem.unitDesc;
        }
        this.shpTemp.tempTotalDesc = String(this.shpTemp.tempTotalDesc).substring(1);
      }
    },
    guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
    scan(){
      let that = this;
      //调用微信接口
      wx.ready(function() {
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            var result = String(res.resultStr); // 当needResult 为 1 时，扫码返回的结果
            if(result.length>20){
              result = result.substring(0,20);
            }
            that.shpTemp.referId = result;
          }
        });
      });
    }
  },
  created () {
    let url = location.href.split("#")[0];
    wx_init(url);
    if(this.$route.params.shp){
      this.shpTemp = this.$route.params.shp;
      this.deliverItem = this.shpTemp.deliverItem;
      this.unloadItem = this.shpTemp.unloadItem;
      if(this.shpTemp.isPaidToDriver=='0'){
        this.value=false;
        this.switchBox = false;
      }
      if(this.shpTemp.isPaidToDriver=='1'){
        this.value=true;
        this.switchBox = true;
      }      
    }
  },
  components: {
    formData,
    deliver,
    unload,
    receiveMessage,
  }
}
</script>
<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.addWaybill-page {
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:#efefef;

  .from {
    margin-top:px2rem(100px);
    width:100%;
    box-sizing:border-box;

    .group-item {
      padding:0 px2rem(40px);
      margin-top:px2rem(20px);
      width:100%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      font-size:px2rem(30px);
      background-color #fff;
      box-sizing:border-box;
      border-bottom:1px solid #ccc;

      &:after {
        display:block;
        clear: both;
        content:' ';
      }

      .original {
        float left;
        width:23%;
        height:px2rem(80px);
      }

      .input {
        float left
        width:67%;
        height:px2rem(76px);
        font-size:px2rem(30px);

        > input {
          width:100%;
          height:100%;
          font-size:px2rem(30px);
        }
      }

      .right {
        float:right;
        width:10%;
        height:px2rem(80px);
        text-align:center;

        > i {
          font-size:px2rem(46px);
          font-weight:600;
        }

        > img {
          width:px2rem(46px);
        }
      }
    }

    .info-item {
      margin-top:px2rem(20px);
      padding:0 px2rem(20px);
      width:100%;
      // height:px2rem(80px);
      // line-height:px2rem(80px);
      background-color: #fff;
      box-sizing:border-box;

      &:last-child {
        .info-left {

          > i {
            color:red;
          }
        }
      }

      .info-left {
        // float: left;
        padding:px2rem(20px) 0;
        width:100%;
        // height:px2rem(80px);
        // line-height:px2rem(80px);
        border-bottom:1px solid #ccc;

        

        &:after {
          display:block;
          clear: both;
          content:' ';
        }

        > i {
          font-size:px2rem(40px);
          color:#2166ff;
          vertical-align:middle;
        }

        .name {
          display inline-block;
          width:80%;
          padding-left:px2rem(10px);
          font-size:px2rem(30px);
          color:#888;
          overflow: hidden;
          white-space:nowrap;
          text-overflow:ellipsis;
          vertical-align: top;
        }

        .forwarding-unit {
          margin-top:px2rem(-4px);
          margin-right:px2rem(20px);
          float:right;
          display: inline-block;
          width:px2rem(55px);
          height:px2rem(55px);

          > img {
            width:100%;
            height:100%;
          }
        }
      }

      .info-right {
        width:100%;
        height:px2rem(80px);
        line-height:px2rem(80px);
        font-size:px2rem(30px);

        > i {
          font-size:px2rem(40px);
          vertical-align:middle;
        }

        > span {
          padding-left:px2rem(10px);
        }

        .sendTime {
          color:#888;
        }
      }
    }

    .switch {
      margin-top:px2rem(20px);
      width:100%;
      background-color:#fff;

      .switch-input {
        border-top:1px solid #ccc;

        .group-item {
          margin-top:0;
        }
      }
    }

    .cargo-msg {
      margin-top:px2rem(20px);
      width:100%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      text-align:center;
      font-size:px2rem(30px);
      background-color: #fff;

      .image {
        display: inline-block;
        width:px2rem(45px);
        height:px2rem(45px);

        > img {
          width:100%;
          height:100%;
        }
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

  .group-box {
    width:100%;

    > table {
      width:100%;
      background-color: #fff;

      > tr {

        > td {
          width:25%;
          height:px2rem(80px);
          border:1px solid #eee;
          font-size:px2rem(28px);
          text-align:center;

          > i {
            float:right;
            padding-right:px2rem(20px);
          }
        }
      }
    }
  }

  .deliverBox {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.3);
    z-index:2222;

    .deliverBox-top {
      position: fixed;
      top:0;
      left:0;
      width:100%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      text-align:center;
      background-color: #000;
      color:#fff;
      z-index:99999;

      > i {
        float left;
        padding:0 px2rem(20px);
      }

      > span {
        position absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
        font-size:px2rem(30px);
      }
    }
  }
}
</style>
