<template>
  <div class="compileVehicle-page">
    <app-comhed :name="headerName" :operation = "operation" :flag = "false" :back="true"></app-comhed>
    <div class="form">

      <div class="group-item">
        <div class="type"><span>*</span> 车牌号：</div>
        <div class="select">
          <input type="text" placeholder="请输入车牌号" readonly="readonly" v-model="updateForm.vehicleNo">
        </div>
      </div>

      <div class="group-item">
        <div class="type"> 车型：</div>
        <div class="select" @click="modalBox = true">
          <span class="deliver" v-if="carType">{{carType}}</span>
          <span class="deliver" v-else>请选择类型</span>
          <i class="iconfont icon-jiantou"></i>
        </div>
      </div>

      <div class="group-item">
        <div class="type"><span>*</span> 牌照类型：</div>
        <div class="select" @click="licenseBox = true">
          <span class="deliver" v-if="license">{{license}}</span>
          <span class="deliver" v-else>请选择类型</span>
          <i class="iconfont icon-jiantou"></i>
        </div>
      </div>

      <div class="group-item">
        <div class="type">车长(米)：</div>
        <div class="select">
          <input type="text" placeholder="请输入车长" v-model="updateForm.length">
        </div>
      </div>
    </div>
    <div class="from-btn" @click="editSubmit">提交</div>

    <!-- 车型弹框 -->
    <transition name="fade">
      <div class="modal-box" v-show="modalBox" @click="modalBox = false">
        <div class="modal-list">
          <div class="modal-item" v-for="(item, index) in carTypeList" :key="index" @click="description(item)">{{item.lbl}}</div>
        </div>
      </div>
    </transition>

    <!-- 牌照类型弹框 -->
    <transition name="fade">
      <div class="modal-box" v-show="licenseBox" @click="licenseBox = false">
        <div class="modal-list">
          <div class="modal-item" v-for="(item, index) in licenseList" :key="index" @click="chooseLicense(item)">{{item.lbl}}</div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import { delCookie, setCookie, getCookie } from "../../js/cookie.js";
import { Toast } from "mint-ui";
export default {
  data () {
    return {
      identityType:"",
      headerName:'编辑车辆',
      operation:'',
      carType:'', // 车型
      license:'', // 牌照类型
      carTypeList: 
      [
        { val: "H01", lbl: "普通货车" },
        { val: "H02", lbl: "厢式货车" },
        { val: "H04", lbl: "罐式货车" },
        { val: "Q00", lbl: "牵引车" },
        { val: "G01", lbl: "普通挂车" },
        { val: "G03", lbl: "罐式挂车" },
        { val: "G05", lbl: "集装箱挂车" },
        { val: "H09", lbl: "仓栅式货车" },
        { val: "H03", lbl: "封闭货车" },
        { val: "H05", lbl: "平板货车" },
        { val: "H06", lbl: "集装箱车" },
        { val: "H07", lbl: "自卸货车" },
        { val: "H08", lbl: "特殊结构货车" },
        { val: "Z00", lbl: "专项作业车" },
        { val: "G02", lbl: "厢式挂车" },
        { val: "G07", lbl: "仓栅式挂车" },
        { val: "G04", lbl: "平板挂车" },
        { val: "G06", lbl: "自卸挂车" },
        { val: "G09", lbl: "专项作业挂车" },
        { val: "X91", lbl: "车辆运输车" },
        { val: "X92", lbl: "车辆运输车(单排)" }
      ],
      licenseList:[ { val: "1", lbl: "大型号牌" }, { val: "2", lbl: "小型号牌" }, { val: "99", lbl: "其他号牌" }],
      modalBox:false,
      licenseBox:false,
      updateForm: {
        id: this.$store.state.compileVehicle.id,
        vehicleNo: this.$store.state.compileVehicle.vehicleNo,
        vehicleNumberType: this.$store.state.compileVehicle.vehicleNumberType, // 牌照类型
        vehicleType: this.$store.state.compileVehicle.vehicleType, // 车型
        length: this.$store.state.compileVehicle.length
      }
    }
  },
  methods: {
    editSubmit(){
      if(this.updateForm.vehicleNo == ""){
        Toast("车牌号不能为空" )
        return false
      }else if(this.updateForm.vehicleNo.length != 7 ){
        Toast("正确车牌号长度为7位");
        return false;
      }
      if(this.updateForm.vehicleNumberType == ""){
        Toast("牌照类型不能为空") ;
        return false;
      }
      if(this.updateForm.length){
        if(isNaN(this.updateForm.length)){
          Toast("车长为数值类型" );
          return false;
        }
      }
      let that = this ;
      let param = Object.assign({}, this.updateForm);
      console.table(param)
      console.table(that.identityType)
      let updateUrl = "";
      switch (this.identityType) {
        case 'pcuser':
          updateUrl = `${this.api.baseURL}/vehicle_driver/update`;
          break;
        case 'customer':
          updateUrl = `${this.api.baseURL}/cuser_vehicle_driver/update`;
          break;      
        default:
          break;
      }
      this.axios.post(updateUrl, param).then(function(result){
          if ((result) && (result.data.code == '200')){ //保存成功
              Toast("保存成功");
              that.$router.go(-1);
          }else if(result && result.data.code == "400"){
            Toast(result.data.message);
          }else{
            Toast("保存失败，联系管理员");
          }
      });
    },
    description(value){
      this.carType = value.lbl;
      this.updateForm.vehicleType = value.val;// 车型code 
    },
    chooseLicense(value){
      this.license = value.lbl;
      this.updateForm.vehicleNumberType = value.val;// 牌照类型code
    },
  },
  components: {
  },
  created () {
    this.identityType = getCookie("identityType"); 
    if(this.updateForm.vehicleNumberType == '1'){
      this.license = this.licenseList[0].lbl;
    }else if(this.updateForm.vehicleNumberType == '2'){
      this.license = this.licenseList[1].lbl;
    }else if(this.updateForm.vehicleNumberType == '99'){
      this.license = this.licenseList[2].lbl;
    }
    
    if(this.updateForm.vehicleType == 'H01'){
      this.carType = this.carTypeList[0].lbl;
    }else if(this.updateForm.vehicleType == 'H02'){
      this.carType = this.carTypeList[1].lbl;
    }else if(this.updateForm.vehicleType == 'H04'){
      this.carType = this.carTypeList[2].lbl;
    }else if(this.updateForm.vehicleType == 'Q00'){
      this.carType = this.carTypeList[3].lbl;
    }else if(this.updateForm.vehicleType == 'G01'){
      this.carType = this.carTypeList[4].lbl;
    }else if(this.updateForm.vehicleType == 'G03'){
      this.carType = this.carTypeList[5].lbl;
    }else if(this.updateForm.vehicleType == 'G05'){
      this.carType = this.carTypeList[6].lbl;
    }else if(this.updateForm.vehicleType == 'H09'){
      this.carType = this.carTypeList[7].lbl;
    }else if(this.updateForm.vehicleType == 'H03'){
      this.carType = this.carTypeList[8].lbl;
    }else if(this.updateForm.vehicleType == 'H05'){
      this.carType = this.carTypeList[9].lbl;
    }else if(this.updateForm.vehicleType == 'H06'){
      this.carType = this.carTypeList[10].lbl;
    }else if(this.updateForm.vehicleType == 'H07'){
      this.carType = this.carTypeList[11].lbl;
    }else if(this.updateForm.vehicleType == 'H08'){
      this.carType = this.carTypeList[12].lbl;
    }else if(this.updateForm.vehicleType == 'Z00'){
      this.carType = this.carTypeList[13].lbl;
    }else if(this.updateForm.vehicleType == 'G02'){
      this.carType = this.carTypeList[14].lbl;
    }else if(this.updateForm.vehicleType == 'G07'){
      this.carType = this.carTypeList[15].lbl;
    }else if(this.updateForm.vehicleType == 'G04'){
      this.carType = this.carTypeList[16].lbl;
    }else if(this.updateForm.vehicleType == 'G06'){
      this.carType = this.carTypeList[17].lbl;
    }else if(this.updateForm.vehicleType == 'G09'){
      this.carType = this.carTypeList[18].lbl;
    }else if(this.updateForm.vehicleType == 'X91'){
      this.carType = this.carTypeList[19].lbl;
    }else if(this.updateForm.vehicleType == 'X92'){
      this.carType = this.carTypeList[20].lbl;
    } 
  }
}
</script>
<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.compileVehicle-page {
  width:100%;
  height:100%;

  .form {
    margin-top:px2rem(80px);
    padding:px2rem(20px);
    width:100%;
    box-sizing:border-box;

    .group-item {
      width:100%;
      border-bottom:1px solid #ccc;
      overflow: hidden;

      &:after {
        display:block;
        clear: both;
        content:' ';
      }

      .type {
        float: left;
        width:25%;
        height:px2rem(110px);
        line-height:px2rem(110px);
        // text-align:center;
        font-size:px2rem(30px);

        > span {
          color:red;
        }
      }

      .select {
        float: right;
        width:70%;
        height:px2rem(110px);
        line-height:px2rem(110px);
        font-size:px2rem(30px);
        text-align:right;

        .deliver {
          margin-right:px2rem(20px);
          color:#999;
        }

        > input {
          padding-right:px2rem(20px);
          width:100%;
          height:px2rem(104px);
          text-align:right;
          font-size:px2rem(30px);
        }
      }
    }
  }

  .from-btn {
    margin:auto;
    margin-top:px2rem(120px);
    width:95%;
    height:px2rem(80px);
    line-height:px2rem(80px);
    text-align:center;
    font-size:px2rem(32px);
    background-color:#2166ff;
    color:#fff;
    border-radius:px2rem(10px);
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
      height:px2rem(600px);
      overflow-y:auto;
      background-color: #fff;

      .modal-item {
        height:px2rem(80px);
        line-height:px2rem(80px);
        text-align:center;
        font-size:px2rem(28px);
        border-bottom:1px solid #ccc;
        z-index:9999
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
