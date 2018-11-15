<template>
  <div class="createTask-page">
    <app-comhed :name="headerName" :operation = "operation" :flag = "false" :back="true"></app-comhed>
    <div class="group">
      <div class="group-item">
        <div class="original">原始单号：</div>
        <div class="input">
          <input type="text" @change="saveRefId" v-model="task.referId" placeholder="原始任务单号（选填）">
        </div>
        <div class="right"><i  @click="scan" class="iconfont icon-chadan"></i></div>
      </div>

      <div class="group-item" v-if="identityType=='pcuser'">
        <div class="original"><span style="color:red">*</span>部门：</div>
        <div class="input">
          <input type="text" readonly placeholder="选择部门" v-model="task.departmentName">
        </div>
        <div class="right">
          <span @click="modalBox=!modalBox"><img src="../../assets/img/deptuser.png" alt=""></span>
        </div>
      </div>

      <div class="group-item">
        <div class="original"><span style="color:red">*</span>司机：</div>
        <div class="input">
          <input type="text" readonly placeholder="司机相关信息" v-model="task.driverNameTmp">
        </div>
        <div class="right">
          <span @click="choseDriver"><img src="../../assets/img/u2183.png" alt=""></span>
        </div>
      </div>

      <div class="group-item">
        <div class="original"><span style="color:red">*</span>车辆：</div>
        <div class="input">
          <input type="text" readonly placeholder="车辆相关信息" v-model="task.vehicleNameTmp">
        </div>
        <div class="right">
          <span @click="choseVehicle"><img src="../../assets/img/u2188.png" alt=""></span>
        </div>
      </div>

    </div>

    <div class="newAdd">
      <router-link to="/addWaybill">[ &nbsp;&nbsp;&nbsp; + 新增运单 &nbsp;&nbsp;&nbsp; ]</router-link>
    </div>

    <div class="from-group" v-for="(item,index) in task.shipmentList" :key="index">
      <div class="item-title">
        <div class="title-left">{{item.deliverCompany}}</div>
        <div class="title-right">
          <i class="iconfont icon-bianji" @click="editShp(item)"></i>
          <i class="iconfont icon-delete" @click="delShp(index)"></i>
        </div>
      </div>
      <div class="from-item">
        <div class="item-left">
          <i class="iconfont icon-fa"></i>
          <span class="deliver-place">发货地：</span>
        </div>
        <div class="item-right">{{item.deliverFullAddress}}</div>
      </div>
      <div class="from-item">
        <div class="item-left">
          <i class="iconfont icon-zhong"></i>
          <span class="deliver-place">签收地：</span>
        </div>
        <div class="item-right">{{item.unloadFullAddress}}</div>
      </div>
      <div class="from-item">
        <div class="item-left">
          <i class="iconfont icon-shijian"></i>
          <span class="deliver-place">开始时间：</span>
          <span class="finish-time">结束时间：</span>
        </div>
        <div class="item-right">{{item.deliverPlanDate}}</div>
        <div class="item-right">{{item.unloadPlanDate}}</div>
      </div>
      <div class="from-item">
        <div class="item-left">
          <i class="iconfont icon-lishirenwu"></i>
          <span class="deliver-place">货物：</span>
        </div>
        <div class="item-msg">{{item.tempTotalDesc}}</div>
        <div class="number">{{item.tempTotalCount}}件</div>
      </div>
    </div>

    <div class="from-btn">
      <span @click="saveTask">创建</span>
    </div>

    <!-- <manageDriver v-show="driver" @abolish="abolish" @fromtep="fromtep"></manageDriver> -->
    <!-- <manageVehicle v-show="vehicle" @abolish="abolish" @mgvehicle="mgvehicle"></manageVehicle> -->

    <!-- 部门选择弹框 -->
    <transition enter-active-class="animated bounceInRight" leave-active-class="animated bounceOutRight">
      <div class="modal-box" v-if="modalBox">
        <div class="modal-list">
          <div class="modal-tit">请选择部门</div>
          <div class="modal-item" v-for="(item, index) in deptarr" :key="index" @click="choseDept(item)">{{item.departmentName}}</div>
        </div>
      </div>
    </transition>



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
import manageDriver from '../driver/driver.vue'
import { delCookie, setCookie, getCookie } from "../../js/cookie.js";

export default {
  data () {
    return {
      headerName:'创建任务',
      task: {
          taskNo: '',
          referId:'',
          driverNameTmp:"",
          vehicleNameTmp:"",
          departmentName:'',
          shipmentList: []
      },
      submitDeptId:"",
      operation:'',
      modalBox:false,
      vehicleMsg:'',
      type:'',
      deptarr:[],
      driver:false,
      vehicle:false,
      identityType:'',//身份信息
    }
  },
  methods: {

    //弹框选择部门
    choseDept(item){
      this.modalBox=false;
      this.task.departmentName = item.departmentName;
      this.submitDeptId = item.id;
      this.$store.state.createTask.departmentName = item.departmentName;
      this.$store.state.createTask.submitDeptId=this.submitDeptId;
    },
    //删除运单
    delShp(index){
      this.$store.state.createTask.shipmentlist.splice(index,1);
    },
    //编辑运单
    editShp(item){
      this.$router.push({
        name:"addWaybill",
        params:{
          shp:item
        }
      });
    },
    //选择司机
    choseDriver(){
      this.$router.push({
        name:"driver",
        params:{
          inWay:'search'
        }});
    },
    //选择车辆
    choseVehicle(){
      this.$router.push({
        name:"vehicle",
        params:{
          inWay:'search'
        }});
    },    
    //判断用户是否实名认证
    judgeRealName(){
      let p={
        userType:this.identityType
      };
      this.axios.post(`${this.api.baseURL}/authent/judgeRealName`, p).then(res =>{
        if ((res.status == '200') && (res.data.success == true)){
          // console.log("已实名认证");
        }else{
          Toast({position: 'bottom', message: '您需要先完成实名认证才能创建任务'});
          switch (this.identityType) {
            case "pcuser":
              this.$router.push("/c_page/usersetting");
              break;
            case "customer":
              this.$router.push("/c_page/cusersetting");
              break;          
            default:
              this.$router.go(-1);
              break;
          }
          
        }
      });
    },  
    saveRefId(val){
      console.log(val);
      this.$store.state.createTask.referId=String(val);
    },
    //保存任务条件判断
    saveTask(){
      //部门判断
      if(this.identityType=='pcuser'){
        if(this.submitDeptId==null||this.submitDeptId==''){
          Toast({position: 'bottom', message: '请选择部门'});
          return;        
        }
      }

      //司机判断
      if(!this.$store.state.createTask.dirver.id){
        Toast({position: 'bottom', message: '请选择司机信息'});
        return;
      }else{
        this.task.driverId = this.$store.state.createTask.dirver.id;
        this.task.driverName = this.$store.state.createTask.dirver.driverName;
        this.task.driverMobile = this.$store.state.createTask.dirver.driverMobile;
      }
      //车辆判断
      if(!this.$store.state.createTask.vehicle.id){
        Toast({position: 'bottom', message: '请选择车辆信息'});
        return;
      }else{
        this.task.vehicleId = this.$store.state.createTask.vehicle.id;
        this.task.vehicleNo = this.$store.state.createTask.vehicle.vehicleNo;
      }

      if(this.task.shipmentList.length<=0){
        Toast({position: 'bottom', message: '请录入运单信息'});
        return;        
      }

      this.task.source = "H5录入";
      this.task.isUseEsign = "Y";
      this.task.volumeUnit = "方";
      this.task.weightUnit = "吨";
      this.task.unitUnit = "件";
      this.task.distanceUnit = "公里";
      MessageBox.confirm('确定要创建此任务?').then(action => {
        this.submitTask();
      });

    },
    //提交任务
    submitTask(){
      let paraJsonStr = JSON.stringify(this.task);
      let p = {taskJsonStr: paraJsonStr,source:'h5',deptId:this.submitDeptId};
      Indicator.open();
      this.axios.post(`${this.api.baseURL}/task/createFromWeb`, p).then(res => {
        Indicator.close();
          if ((res) && (res.status == '200')){ //保存成功
            Toast("任务保存成功");
            this.$router.push('/createHistory');
            this.$store.state.createTask.shipmentlist = [];
          }else{
            Toast({position: 'bottom', message: res.data.message});
            return; 
          }
      });
    },
    //获取部门列表
    getDetps() {
      let p = {};
      this.axios
        .post(`${this.api.baseURL}/depUser/getUserDepts`, p)
        .then(res => {
          this.deptarr = res.data.data.result;
          if(this.deptarr.length==1){
            this.task.departmentName = this.deptarr[0].departmentName;
            this.$store.state.createTask.departmentName=this.deptarr[0].departmentName;
            this.submitDeptId = this.deptarr[0].id;
            this.$store.state.createTask.submitDeptId=this.deptarr[0].id;
          }
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
            if(result.length>40){
              result = result.substring(0,40);
            }
            that.task.referId = result;
            that.$store.state.createTask.referId=result;
          }
        });
      });
    }
  },
  mounted () {
    this.identityType = getCookie("identityType");
    if(this.identityType=='pcuser'){
      this.getDetps();
    }else{
      this.judgeRealName();
    }
    
    if(this.$store.state.createTask.dirver.id){
      let d = this.$store.state.createTask.dirver;
      this.task.driverNameTmp=d.driverName+"/"+d.driverMobile;
    }
    if(this.$store.state.createTask.vehicle.id){
      let v = this.$store.state.createTask.vehicle;
      this.task.vehicleNameTmp = v.vehicleNo;
    }
    if(this.$store.state.createTask.departmentName){
      this.task.departmentName = this.$store.state.createTask.departmentName;
      this.submitDeptId = this.$store.state.createTask.submitDeptId;
    }

    this.task.referId = this.$store.state.createTask.referId;
    this.task.shipmentList = this.$store.state.createTask.shipmentlist;
  },
  created () {
    let url = location.href.split("#")[0];
    wx_init(url);
    
  }
}
</script>
<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.createTask-page {
  padding-bottom:px2rem(100px);
  width:100%;
  height:100%;
  background-color:#efefef;

  .group {
    margin-top:px2rem(100px);
    width:100%;

    .group-item {
      margin-top:px2rem(20px);
      padding:0 px2rem(40px);
      width:100%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      font-size:px2rem(30px);
      background-color #fff;
      box-sizing:border-box;

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
        height:px2rem(80px);
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

        > a {
          display:block;
          width:100%;
          height:100%;

          > img {
            width:px2rem(46px);
          }
        }
        > span {
          display:block;
          width:100%;
          height:100%;

          > img {
            width:px2rem(46px);
          }
        }
        > i {
          font-size:px2rem(46px);
          font-weight:600;
        }

        > img {
          width:px2rem(46px);
        }
      }
    }
  }

  .newAdd {
    margin-top:px2rem(20px);
    width:100%;
    height:px2rem(100px);
    line-height:px2rem(100px);
    text-align:center;
    font-size:px2rem(32px);
    background-color: #fff;

    > a {
      color:#2166ff;
    }
  }

  .from-group {
    margin-top:px2rem(20px);
    width:100%;

    .item-title {
      margin-bottom:px2rem(20px);
      padding:0 px2rem(40px);
      width:100%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      font-size:px2rem(30px);
      background-color:#ccc;

      &:after {
        display:block;
        clear: both;
        content:' ';
      }

      .title-left {
        float: left;
        width:83%;
        height:100%;
        color:#333;
      }

      .title-right {
        float:right;
        width:17%;
        height:100%;

        > i {
          font-size:px2rem(40px);
          color:#777;

          &:last-child {
            float:right;
          }
        }
      }
    }

    .from-item {
      padding: px2rem(10px);
      width:100%;
      font-size:px2rem(28px);
      background-color: #fff;
      border-bottom:1px solid #eee;

      &:after {
        display:block;
        clear: both;
        content:' ';
      }

      .item-left {
        float: left;
        width:30%;

        .finish-time  {
          // float:right;
          // margin-right:px2rem(20px);
          margin-left:px2rem(60px);
        }

        > i {
          margin-right:px2rem(4px);
          font-size:px2rem(46px);
          vertical-align:middle
        }
      }

      .item-right {
        float:right;
        width:70%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }

      .item-msg {
        float: left;
        width:40%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }

      .number {
        float: right;
        // padding:px2rem(10px) px2rem(20px);
        width:25%;
        text-align:center;
        border:1px solid #ccc;
        border-radius:px2rem(10px);
      }
    }
  }

  .from-btn {
    position: fixed;
    bottom:px2rem(10px);
    left:50%;
    transform:translateX(-50%);
    width:90%;
    height:px2rem(80px);
    line-height:px2rem(80px);
    text-align:center;
    font-size:px2rem(30px);
    background-color:#2166ff;
    border-radius:px2rem(10px);

    > span {
      display:block;
      width:100%;
      height:100%;
      color:#fff;
    }
  }

  .modal-box {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.3);
    z-index:999;

    .modal-list {
      position: absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      width:80%;
      max-height:px2rem(500px);
      overflow-y:auto;
      background-color: #fff;
      border-radius:px2rem(10px);

      .modal-tit {
        height:px2rem(80px);
        line-height:px2rem(80px);
        text-align:center;
        font-size:px2rem(32px);
        font-weight:bold;
        border-bottom:1px solid #ccc;
      }

      .modal-item {
        // padding:px2rem(10px);
        height:px2rem(80px);
        // line-height:px2rem(80px);
        padding-left:px2rem(20px);
        font-size:px2rem(28px);
        border-bottom:1px solid #ccc;
        z-index:9999;
        vertical-align:middle;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to  {
    opacity: 0;
  }
}
</style>
