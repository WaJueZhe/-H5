<template>
  <div class="unload-page">
    <div class="shipment" v-if=" $route.path != '/address' ">卸货</div>
    <scroller
      ref="myscroller"
        :on-refresh="refresh"
        :on-infinite="infinite"
      >
    <div class="serch">
      <div class="input">
        <i class="iconfont icon-search"></i>
        <input type="text" placeholder="请输入地址编码" v-model="searchKey">
      </div>
      <button @click="inquire">查询</button>
    </div>

      <div class="group" v-for="item in addressList" :key="item.id">
        <div @click="choseUnload(item)">
          <div class="code">编码：{{item.addressCode}}</div>
          <div class="info">
            <div class="name"><i class="iconfont icon-dianhua1"></i>{{item.currentContactPerson}} / {{item.currentContactMobile}}</div>
          </div>
          <div class="company-name">
            <div class="left"><i class="iconfont icon-shouyed"></i></div>
            <div class="right">{{item.addressName}}</div>
          </div>
          <div class="company-name">
            <div class="left"><i class="iconfont icon-dingwei"></i></div>
            <div class="right">{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.street}}</div>
          </div>
        </div>
        <div class="group-btn">
          <div class="btn-left" @click="compile(item)">
              <i class="iconfont icon-bianji"></i>
              编辑
          </div>
          <div class="btn-left" @click="remove(item.id)">
            <i class="iconfont icon-delete"></i>
            删除</div>
        </div>
      </div>
    </scroller>
    <div class="add-address">
      <router-link to="/addAddress">新增地址</router-link>
    </div>
  </div>
</template>
<script>
import { Toast } from 'mint-ui';
import { Indicator } from "mint-ui";
import { delCookie, setCookie, getCookie } from "../../js/cookie.js";
import { MessageBox } from "mint-ui";
export default {
  data () {
    return {
      addressList:[],
      total: 0,
      page: 1,
      limit: 10,
      searchKey:'',
      identityType:'',//用户身份信息
      inWay:'',       //判断用户是否是在建单时选择
    }
  },
  methods: {
    refresh(done){
      let self = this;
      setTimeout(() => {
        this.addressList=[];
        this.page = 1;
        this.init();
        done();
      }, 1500);
    },
    infinite (done) {
      if (this.page >= this.total) {
        setTimeout(() => {
          done(true);
        }, 1500);
        return;
      }

      setTimeout(() => {
        this.page = this.page+1;
        this.init();
        done();
      }, 1500);
    },
    init(){
      let postUrl = null;
      switch (this.identityType) {
        case 'pcuser':
          postUrl=`${this.api.baseURL}/address/getAddressList`;
          break;
        case 'customer':
          postUrl=`${this.api.baseURL}/cuserAddress/getAddressList`;
          break;      
        default:
          break;
      }

      let that = this
      let params = {
          currentPage: that.page,
          pageSize: that.limit,
          searchByKeys: {searchStr: that.searchKey,addressType:'U'},
          orderByKeys: {createDate: 'desc'}
      }
      Indicator.open();
      that.axios.post(postUrl, params)
      .then(res =>{
        Indicator.close();
        if(res.data.code == 200) {
          if(this.identityType=='pcuser'){ //取数据位置不一样
            that.addressList = that.addressList.concat(res.data.data.result.content);
            that.total = res.data.data.result.totalPage;
          }else if(this.identityType=='customer'){
            that.addressList = that.addressList.concat(res.data.data.result.records);
            that.total = res.data.data.result.pages;
          }
        }
      })
    },
    //删除
    remove(id){
      let that = this;
      MessageBox.confirm('', {title: "提示", message: "确定删除？", confirmButtonText: "确定", cancelButtonText: "取消"
        }).then(action => {
          let p = {"id":id};
          let delUrl =""; 
          if(this.identityType == "pcuser"){
            delUrl =`${this.api.baseURL}/address/deleteUsualAddress`;
          }else{
            delUrl =`${this.api.baseURL}/cuserAddress/deleteUsualAddress`;
          }
          that.axios.post(delUrl, p)
          .then(res => {
            console.log(res)
            if(res.data.code == '200') {
              that.addressList = [];
              that.init();
              Indicator.close();              
              Toast('删除成功');
            }else {
              Toast('删除失败');
            }
          })
        })
    },
    //编辑
    compile(item){
      this.$store.state.compileAddressList = item;
      this.$router.push('/compileAddress');
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    },
    //查询
    inquire(){
      this.total = 0;
      this.page = 1;
      this.addressList=[];
      this.init()
    },
    //用户选择地址 将地址返回到调用界面
    choseUnload(item){
      this.$emit('choseUnloadItem',item);
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.init();
    })
  },
  created () {
    this.identityType = getCookie("identityType");
    this.inWay = this.$route.params.inWay;
    this.addressList = [];
    this.init();
  },
  
}
</script>
<style lang="stylus">
@import '../stylus/mixins.styl';

.unload-page {
  width:100%;
  height:100%;

  ._v-container>._v-content {
    padding-top:px2rem(160px);
  }

  ._v-container>._v-content>.loading-layer {
      padding-bottom:px2rem(220px);
  }

  .shipment {
    position: fixed;
    top:0;
    left:0;
    margin-top:px2rem(80px);
    padding:0 px2rem(60px);
    width:100%;
    height:px2rem(80px);
    line-height:px2rem(80px);
    text-align:center;
    font-size:px2rem(32px);
    z-index:9999;
    background-color:#ccc;
  }

  .serch {
    width:100%;
    padding: px2rem(20px);
    box-sizing: border-box;
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

        > i {
          padding-right:px2rem(20px);
          font-size:px2rem(40px);
        }
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
        width:9%;

        > i {
          font-size:px2rem(40px);
        }
      }

      .right {
        float:left;
        width:91%;
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
          width:100%;
          height:100%;
          color:#777;
        }
      }
    }
  }

  .add-address {
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
