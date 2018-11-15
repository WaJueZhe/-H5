<template>
  <div class="vehicle-page">
    <app-comhed :name="headerName" :operation = "operation" :flag = "false" :back="true"></app-comhed>
    <div class="serch">
      <div class="input">
        <i class="iconfont icon-search"></i>
        <input v-model="searchStr" type="text" placeholder="请输入车牌号">
      </div>
      <button @click="searchVehicle">查询</button>
    </div>
    <scroller
      ref="myscroller"
        :on-refresh="refresh"
        :on-infinite="infinite"
      >
        <div class="group" v-for="(item,index) in list" :key="index">
          <div @click="choseVehicle(item)">
            <div class="info">
              <div class="name">车牌号：{{item.vehicleNo}}</div>
              <div class="phone">车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：{{item.vehicleType|vehicleTypeFilter}}</div>
            </div>
            <div class="info">
              <div class="name">车&nbsp;&nbsp;&nbsp;长：<span v-if="item.length">{{item.length}}米</span></div>
              <div class="phone">牌照类型：{{item.vehicleNumberType|vehicleNumberTypeFilter}}</div>
            </div>
          </div>
          <div v-if="checkPermits(item)" class="group-btn">
            <div  class="btn-left" @click="compile(item)">
              <!-- <router-link to="/compileVehicle"> -->
                <i class="iconfont icon-bianji"></i>
                编辑
              <!-- </router-link> -->
            </div>
            <div  class="btn-left"  @click="deleteVehicle(item)">
              <i class="iconfont icon-delete"></i>
              删除</div>
          </div>
        </div>
      </scroller>
    <div class="add-btn" v-if="checkCreatePermit()">
      <router-link to="/addVehicle">新增车辆</router-link>
    </div>
  </div>
</template>
<script>
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import { MessageBox } from "mint-ui";
import { delCookie, setCookie, getCookie } from "../../js/cookie.js";
import { getPermitsByType }  from "../../js/CookiePermitsMap.js";
export default {
  data () {
    return {
      headerName:'车辆管理',
      operation:'',
      list:[],
      pages:0,
      indexNo:1,
      pageSize:20,
      identityType:'',//身份信息
      searchStr:'',
      inWay:''        //判断是否是建单时选择车辆
    }
  },
  filters: {
    vehicleNumberTypeFilter: function(value) { // 牌照类型 
      let result = "";
      switch (value) {
        case "1":
          result = "大型号牌";
          break;
        case "2":
          result = "小型号牌";
          break;
        case "99":
          result = "其他号牌";
          break;
      }
      return result;
    }, 
    vehicleTypeFilter: function(value) { // 车型
      let ret = "";
      switch (value) {
        case "H01":
          ret = "普通货车";
          break;
        case "H02":
          ret = "厢式货车";
          break;
        case "H04":
          ret = "罐式货车";
          break;
        case "Q00":
          ret = "牵引车";
          break;
        case "G01":
          ret = "普通挂车";
          break;
        case "G03":
          ret = "罐式挂车";
          break;
        case "G05":
          ret = "集装箱挂车";
          break;
        case "H09":
          ret = "仓栅式货车";
          break;
        case "H03":
          ret = "封闭货车";
          break;
        case "H05":
          ret = "平板货车";
          break;
        case "H06":
          ret = "集装箱车";
          break;
        case "H07":
          ret = "自卸货车";
          break;
        case "H08":
          ret = "特殊结构货车";
          break;
        case "Z00":
          ret = "专项作业车";
          break;
        case "G02":
          ret = "厢式挂车";
          break;
        case "G07":
          ret = "仓栅式挂车";
          break;
        case "G04":
          ret = "平板挂车";
          break;
        case "G06":
          ret = "自卸挂车";
          break;
        case "G09":
          ret = "专项作业挂车";
          break;
        case "X91":
          ret = "车辆运输车";
          break;
        case "X92":
          ret = "车辆运输车(单排)";
          break;
        default:
          break;
      }
      return ret;
    }
  },
  methods: {
    checkCreatePermit(){
      if(this.identityType == 'pcuser' && !this.containPermitTypeAndCode('userAllMenuCodes', 'm002003')){
        // pcuser 且没 车辆权限，
        return false;
      }else{
        // 非pcuser ,或pcuser 车辆有权限
        return true;
      }
    },
    checkPermits(item){
      // console.log("item.isCreator = "+ item.isCreator);
      // console.log("this.identityType = "+ this.identityType);
      if(this.identityType == 'pcuser') { // 司机:driver、PC用户:pcuser、C端用户:customer
        // console.log(getPermitsByType('userAllMenuCodes'))
        if(this.containPermitTypeAndCode('userAllMenuCodes', 'm002003')){ // 车辆权限
          return true;
        }else{
          return false;
        }
      } else{
        //return item.isCreator=='Y';
        return true;
      }
    },
    //包含权限的类型和权限代码 
    containPermitTypeAndCode(permitType, permitCode){
      return getPermitsByType(permitType) != undefined && getPermitsByType(permitType).contain(permitCode);
    },
    deleteVehicle(item){
        let that = this;
        MessageBox.confirm('', {title: "提示", message: "确定删除？", confirmButtonText: "确定", cancelButtonText: "取消"
          }).then(action =>{
            let param = {vehicleId:item.id}
            console.table(param)
            let deleteUrl = "";
            switch (that.identityType) {
              case 'pcuser':
                deleteUrl = `${that.api.baseURL}/vehicle_driver/delete`;
                break;
              case 'customer':
                deleteUrl = `${that.api.baseURL}/cuser_vehicle_driver/delete`;
                break;      
              default:
                break;
            }
            that.axios.post(deleteUrl, param).then(function(result){ 
                if ((result) && (result.status == '200')){ 
                    Toast("删除成功");
                    that.searchVehicle();
                }else{
                    Toast("删除失败");
                }
            });
          }).catch(err =>{
            // do nothing
          });
    },
    compile(item){
      console.log(item)
      this.$store.state.compileVehicle = item;
      this.$router.push('/compileVehicle')
    },
     refresh(done){
       this.indexNo=1;
       this.list=[];
      let self = this;
      setTimeout(() => {
        this.init();
        done();
      }, 1500);
    },
    infinite (done) {
      if (this.pages <= this.indexNo) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }
      setTimeout(() => {
        this.indexNo=this.indexNo+1;
        this.init();
        done();
      }, 1500);
    },
    //初始化查询
    init(){
      let postUrl = null;
      switch (this.identityType) {
        case 'pcuser':
          let params = {
            currentPage: this.indexNo,
            pageSize: this.pageSize,
            searchByKeys: {
              vehicleNO: this.searchStr
          },
            orderByKeys: { createDate: "desc" }
          };

          Indicator.open();
          this.axios.post(`${this.api.baseURL}/vehicle_driver/findPage`,params).then(res => {
            Indicator.close();
            console.log(res);
            if (res.data.success) {
              this.list = this.list.concat(res.data.data.result.content);
              this.pages = res.data.data.result.totalPage;
            } else {
              Toast(res.data.message);
            }
          });
          break;
        case 'customer':
          let p = {
            currentPage: this.indexNo,
            pageSize: this.pageSize,
            vehicleNO:this.searchStr
          };

          Indicator.open();
          this.axios.post(`${this.api.baseURL}/cuser_vehicle_driver/findPage`,p).then(res => {
            Indicator.close();
            console.log(res);
            if (res.data.success) {
              this.list = this.list.concat(res.data.data.result.records);
              this.pages = res.data.data.result.pages;
            } else {
              Toast(res.data.message);
            }
          });
          break;      
        default:
          break;
      }

    },
    //查询车辆
    searchVehicle(){
      this.list=[];
      this.indexNo=1;
      this.init();
    },
    //选择车辆
    choseVehicle(item){
      if(this.inWay=='search'){
        this.$store.state.createTask.vehicle = item;
        this.$router.go(-1);
      }
    }
  },
  created () {
    this.identityType = getCookie("identityType");
    this.inWay = this.$route.params.inWay;
    this.init();
  }
}
</script>
<style lang="stylus">
@import '../../components/stylus/mixins.styl';

.vehicle-page {
  width:100%;
  height:100%;

  ._v-container>._v-content {
    padding-top:px2rem(220px);
  }

  ._v-container>._v-content>.loading-layer {
      padding-bottom:px2rem(220px);
  }

  .serch {
    position: fixed;
    top:0;
    left:0;
    margin-top:px2rem(80px);
    padding: px2rem(20px);
    width:100%;
    box-sizing: border-box;
    background-color: #061128;
    z-index:2222;

    &:after {
      display:block;
      clear: both;
      content:' ';
    }

    .input {
      padding-left: px2rem(40px);
      float: left;
      width:85%;
      height: px2rem(90px);
      border-top-left-radius: px2rem(10px);
      border-bottom-left-radius: px2rem(10px);
      background-color: #fff;
      box-sizing: border-box;

      > i {
        font-size:px2rem(46px);
        vertical-align:middle
      }
      

      > input {
        width: 90%;
        height: 100%;
        font-size: px2rem(30px);
        border-radius: px2rem(10px);
      }
    }

    button {
      float right;
      width: 15%;
      height: px2rem(90px);
      background-color: #2d85de;
      color: #ffffff;
    }
  }

  .group {
    // margin-top:px2rem(40px);
    margin: px2rem(20px);
    // padding:0 px2rem(20px);
    // padding-bottom: 0;
    border:1px solid #c7c7c7;
    border-radius:px2rem(20px);
    box-sizing: border-box;
    font-size:px2rem(30px);
    background-color:#f5f5f5;

    .code {
      padding:0 px2rem(20px);
      width:100%;
      font-size:px2rem(30px);
      height:px2rem(60px);
      line-height:px2rem(60px);
      box-sizing: border-box;
      background-color: #343d50;
      color:#fff;
      border-top-right-radius:px2rem(20px);
      border-top-left-radius:px2rem(20px);
    }

    .info {
      padding:0 px2rem(20px);
      margin-top:px2rem(20px);
      margin-bottom:px2rem(20px);
      width:100%;
      display:flex;
      justify-content:space-between;
      box-sizing:border-box;

      &:after {
        display:block;
        clear: both;
        content:' ';
      }

      .name {
        flex:1;
        // margin-right:px2rem(70px);
      }

      .phone {
        flex:1;
      }
    }

    .company-name {
      padding:0 px2rem(20px);
      margin-top:px2rem(20px);
      width:100%;

      &:after {
        display:block;
        clear: both;
        content:' ';
      }

      .left {
        float: left;
        width:23%;
      }

      .right {
        float:left;
        width:77%;
      }
    }

    .group-btn {
      padding:0 px2rem(20px);
      margin-top:px2rem(14px);
      width:100%;
      text-align:right;
      color:#777;
      z-index:9999;

      .btn-left {
        display:inline-block;
        width:px2rem(120px);
        height:px2rem(70px);
        line-height:px2rem(70px);
        text-align:center;

        > a {
          display:block;
          clear: both;
          content:' ';
          color:#777;
        }
      }
    }
  }

  .add-btn {
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

    > a {
      display:block;
      width:100%;
      height:100%;
      color:#fff;
    }
  }
}
</style>
