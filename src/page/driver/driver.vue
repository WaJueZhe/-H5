<template>
  <div class="driver-page">
    <app-comhed :name="headerName" :operation = "operation" :flag = "false" :back="true"></app-comhed>
    <div class="serch">
      <div class="input">
        <i class="iconfont icon-search"></i>
        <input v-model="searchStr" type="text" placeholder="请输入姓名、电话或者身份证信息">
      </div>
      <button @click="searchDriver">查询</button>
    </div>
    <scroller
      ref="myscroller"
        :on-refresh="refresh"
        :on-infinite="infinite"
      >
      <div class="group" v-for="(item,index) in list" :key="index">
        <div @click="choseDriver(item)">
          <!-- <div class="info">
            <div class="name">姓名：{{item.driverName}}/{{item.driverMobile}}</div>
          </div>
          <div class="info">
            <div class="name">性别：{{item.driverSex|driverSexFilter}}</div>
            <div class="phone">年龄：{{item.driverAge}}</div>
          </div> -->
          <div class="company-name">
            <div class="left">姓&nbsp;&nbsp;&nbsp;&nbsp;名：</div>
            <div class="right">{{item.driverName}}/{{item.driverMobile}}</div>
          </div>
          <div class="info">
            <div class="name">性&nbsp;&nbsp;&nbsp;&nbsp;别：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.driverSex|driverSexFilter}}</div>
            <div class="phone">年龄：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.driverAge}}</div>
          </div>
          <!-- <div class="company-name">
            <div class="left">性别：</div>
            <div class="right">{{item.driverSex|driverSexFilter}}</div>
          </div>
          <div class="company-name">
            <div class="left">年龄：</div>
            <div class="right">{{item.driverAge}}</div>
          </div> -->
          <div class="company-name">
            <div class="left">身份证：</div>
            <div class="right">{{item.driverIdentityId|identityShow}}</div>
          </div>
        </div>
        <div v-if="checkPermits(item)" class="group-btn">
          <div class="btn-left" @click="compile(item)">
            <!-- <router-link to="/compileDriver"> -->
              <i class="iconfont icon-bianji"></i>
              编辑
            <!-- </router-link> -->
          </div>
          <div class="btn-left"  @click="deleteDriver(item)">
            <i class="iconfont icon-delete"></i>
            删除</div>
        </div>
      </div>     
     </scroller>
    <div class="add-btn" v-if="checkCreatePermit()">
      <router-link to="/addDriver">新增司机</router-link>
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
      headerName:'司机',
      searchStr:"",
      list:[],
      operation:'',
      pages:0,
      indexNo:1,
      pageSize:10,
      identityType:'',//身份信息
      inWay:null      //进入页面的方式
    }
  },
  filters: {
    driverSexFilter(val){
      switch (val) {
        case '1':
          return '男';
          break;
        case '2':
          return '女';
          break;      
        default: 
          return "男";
          break;
      }
    },
    identityShow(val){
      if(!val){
        return null;
      }
      if(val.length == '15'){
        return val.slice(0,4) +'****'+'***'+val.slice(11)
      }
      return val.slice(0,4) +'****'+'******'+val.slice(14)
    }
  },
  methods: {
    checkCreatePermit(){
      if(this.identityType == 'pcuser' && !this.containPermitTypeAndCode('userAllMenuCodes', 'm002002')){
        // pcuser 且没 司机权限，
        return false;
      }else{
        // 非pcuser ,或pcuser 司机有权限
        return true;
      }
    },
    checkPermits(item){
      // console.log("item.isCreator = "+ item.isCreator);
      // console.log("this.identityType = "+ this.identityType);
      if(this.identityType == 'pcuser') { // 司机:driver、PC用户:pcuser、C端用户:customer
        // console.log(getPermitsByType('userAllMenuCodes'))
        if(this.containPermitTypeAndCode('userAllMenuCodes', 'm002002')){ // 司机权限
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
    //bianji
    compile(item){
      this.$store.state.compileDriverList = item;
      this.$router.push('/compileDriver')
    },
    deleteDriver(item){
        let that = this;
        MessageBox.confirm('', {title: "提示", message: "确定删除？", confirmButtonText: "确定", cancelButtonText: "取消"
          }).then(action =>{
            let param = {id:item.id}
            console.table(param)
            let deleteUrl = "";
            switch (this.identityType) {
              case 'pcuser':
                deleteUrl = `${this.api.baseURL}/driver/delete`;
                break;
              case 'customer':
                deleteUrl = `${this.api.baseURL}/c_driver/delete`;
                break;      
              default:
                break;
            }
            this.axios.post(deleteUrl, param).then(function(result){
                if ((result) && (result.status == '200')){ 
                    Toast("删除成功");
                    that.searchDriver();
                }else{
                    Toast("删除失败");
                }
            });
          }).catch(err =>{
            // do nothing
          });
    },
    init(){
      switch (this.identityType) {
        case 'pcuser':
          this.pc_user();
          break;
        case 'customer':
          this.c_user();
          break;      
        default:
          break;
      }
    },
    //选择司机
    choseDriver(item){
      if(this.inWay=='search'){
        this.$store.state.createTask.dirver = item;
        this.$router.go(-1);
      }
    },
    //关键字查询
    searchDriver(){
      this.list = [];
      this.indexNo = 1;
      this.init();
    },
    //B端用户
    pc_user(){

      let params = {
        currentPage: this.indexNo,
        pageSize: this.pageSize,
        searchByKeys: {
          searchStr: this.searchStr
        },
        orderByKeys: { createDate: "desc" }
      };

      Indicator.open();
      this.axios.post(`${this.api.baseURL}/driver/findDriverPage`,params).then(res => {
        Indicator.close();
        if (res.data.success) {
          this.list = this.list.concat(res.data.data.result.content);
          this.pages = res.data.data.result.totalRecord;
        } else {
          Toast(res.data.message);
        }
      });      
    },
    //c端用户查询司机
    c_user(){
      let params = {
        currentPage: this.indexNo,
        pageSize: this.pageSize,
        searchStr: this.searchStr
      };

      Indicator.open();
      this.axios.post(`${this.api.baseURL}/c_driver/findDriverPage`,params).then(res => {
        Indicator.close();
        if (res.data.success) {
          this.list = this.list.concat(res.data.data.result.records);
          this.pages = res.data.data.result.pages;
        } else {
          Toast(res.data.message);
        }
      });
    },
    //刷新
    refresh(done){
      setTimeout(() => {
        this.indexNo=1;
        this.list=[];
        this.init();
        done();
      }, 1500);
    },
    //加载更多
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
  },
  created () {
    this.identityType = getCookie("identityType");
    this.inWay = this.$route.params.inWay;
    this.list = [];
    this.init();
  }
}
</script>
<style lang="stylus">
@import '../../components/stylus/mixins.styl';

.driver-page {
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
      width:100%;

      &:after {
        display:block;
        clear: both;
        content:' ';
      }

      .name {
        float: left;
        margin-right:px2rem(70px);
      }

      .phone {
        float: left;
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
        width:25%;
      }

      .right {
        float:left;
        width:75%;
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
