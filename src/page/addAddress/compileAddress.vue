<template>
  <div class="compileAddress-page">
    <app-comhed :name="headerName" :operation = "operation" :flag = "false" :back="true"></app-comhed>
    <div class="form">
      <div class="group-item">
        <div class="type"><span>*</span> 地址类型：</div>
        <div class="select" @click="chooseType">
          <span class="deliver" v-if="type">{{type}}</span>
          <span class="deliver" v-else>请选择类型</span>
          <i class="iconfont icon-jiantou"></i>
        </div>
      </div>
      <div class="group-item" v-if="identityType == 'pcuser'">
        <div class="type"><span>*</span> 地址编码：</div>
        <div class="select">
          <input type="text" placeholder="请输入编码" v-model="compileForm.addressCode">
        </div>
      </div>

      <div class="group-item">
        <div class="type"><span>*</span> 省市区县：</div>
        <div class="select">
          <span class="deliver" @click="_showLinkage" v-html="result"></span>
          <i class="iconfont icon-jiantou"></i>
        </div>
      </div>

      <div class="group-item">
        <div class="type"><span>*</span> 详细地址：</div>
        <div class="select">
          <input type="text" placeholder="请输入详细地址" v-model="compileForm.street">
        </div>
      </div>

      <div class="group-item">
        <div class="type"><span>*</span> 联系人：</div>
        <div class="select">
          <input type="text" placeholder="请输入联系人" v-model="compileForm.currentContactPerson">
        </div>
      </div>

      <div class="group-item">
        <div class="type"><span>*</span> 联系电话：</div>
        <div class="select">
          <input type="text" placeholder="请输入联系电话" v-model="compileForm.currentContactMobile">
        </div>
      </div>

      <div class="group-item">
        <div class="type">单位名称：</div>
        <div class="select">
          <input type="text" placeholder="请输入单位名称" v-model="compileForm.addressName">
        </div>
      </div>
    </div>

    <div class="from-btn" @click="addSubmit">提交</div>

    <div class="modal-box" v-show="modalBox" @click="modalBox = false">
      <div class="modal-list">
        <div class="modal-item" v-for="(item, index) in arr" :key="index" @click="description(item)">{{item.name}}</div>
      </div>
    </div>
    <!-- 选择地区弹框 -->
    <transition name="fade">
      <cityPicker @getLinkage='_showChildMsg' v-show="showLinkage"></cityPicker>
    </transition>
    <!-- <p v-html="result" class="getCity" @click="_showLinkage"></p>
    <p v-html="id" class="getCity" ></p> -->
  </div>
</template>
<script>
import cityPicker from './cityPicker';
import { Toast } from 'mint-ui';
import { delCookie, setCookie, getCookie } from "../../js/cookie.js";
export default {
  data(){
    return{
      headerName:'编辑地址',
      operation:'',
      showLinkage:false, //控制子组件的显示隐藏
      result:'请选择所在省市',
      cityIds:'',
      arr:[ {id:'D',name:'装货'}, {id:'U', name:'卸货'}],
      modalBox:false,
      type:'',
      compileForm:{
        addressCode : this.$store.state.compileAddressList.addressCode,
        currentContactPerson : this.$store.state.compileAddressList.currentContactPerson,
        provinceName : this.$store.state.compileAddressList.provinceName,
        cityName : this.$store.state.compileAddressList.cityName,
        districtName : this.$store.state.compileAddressList.districtName,
        street : this.$store.state.compileAddressList.street,
        currentContactPerson : this.$store.state.compileAddressList.currentContactPerson,
        currentContactMobile : this.$store.state.compileAddressList.currentContactMobile,
        addressName : this.$store.state.compileAddressList.addressName,
        addressType : this.$store.state.compileAddressList.addressType,
        provinceCode : this.$store.state.compileAddressList.provinceCode,
        cityCode : this.$store.state.compileAddressList.cityCode,
        districtCode : this.$store.state.compileAddressList.districtCode,
        pcdCode:[],
        pcdName:[],
        id:this.$store.state.compileAddressList.id,
        customerOrgId:this.$store.state.compileAddressList.customerOrgId
      },
      identityType:'',//身份信息
      inWay:null      //进入页面的方式
    }
  },
  methods: {
   _showChildMsg(msg){ //接收子组件数据
      this.result = msg.name
      this.cityIds=msg.id
      this.showLinkage=false
    },
    _showLinkage(){
      this.showLinkage=true
    },
    chooseType(){
      this.modalBox = true;
    },
    description(value){
      this.type = value.name;
      this.compileForm.addressType = value.id;
    },
    addSubmit(){
      if(this.compileForm.addressType == ''){
        Toast("请输入地址类型");
        return false;
      }else if(this.identityType == 'pcuser' && this.compileForm.addressCode == ''){
        Toast("请输入地址编码");
        return false;
      }else if (this.cityIds == ""){
          Toast("请输入省市区！");
          return false;
      }else if(this.compileForm.street == ''){
        Toast("请输入详细地址");
        return false;
      }else if(this.compileForm.currentContactPerson == ''){
        Toast("请输入联系人");
        return false;
      }else if(this.compileForm.currentContactMobile == ''){
        Toast("请输入手机号码");
        return false;
      }else if(!(/^1[123456789]\d{9}$/.test(this.compileForm.currentContactMobile))){
        Toast("手机号码不正确");
        return false; 
      }
      let addUrl =""; 
      if(this.identityType == "pcuser"){
        addUrl =`${this.api.baseURL}/address/updateAddress`;
      }else{
        addUrl =`${this.api.baseURL}/cuserAddress/updateAddress`;
      }
      this.compileForm.pcdCode = this.cityIds.split(",");
      this.compileForm.pcdName = this.result.split(",");
      let that = this ;
      let param = Object.assign({}, that.compileForm);
      that.axios.post(addUrl, param)
      .then(result => {
          console.log(result);
          if(result.data.code == 200) {
            Toast('修改成功');
            that.$router.go(-1);
          }else if(result && result.data.code == "400"){
            Toast(result.data.message);
          }else{
            Toast("修改成功，联系管理员");
          }
      })
    }
  },
  mounted () {
    this.result = this.compileForm.provinceName + "," + this.compileForm.cityName + "," + this.compileForm.districtName;
    this.cityIds = this.compileForm.provinceCode + "," + this.compileForm.cityCode + "," + this.compileForm.districtCode;
    console.log(this.cityIds)
    console.log(this.result)
    if(this.$store.state.compileAddressList.addressType == 'D'){
      this.type = this.arr[0].name;
    }else if(this.$store.state.compileAddressList.addressType == 'U'){
      this.type = this.arr[1].name;
    }
  },
  components:{
    cityPicker, //注册子组件
  },
  created () {
    this.identityType = getCookie("identityType");
    this.inWay = this.$route.params.inWay;
  }
}
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.compileAddress-page {
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
        width:75%;
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

  .getCity{
    font-size: 20px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to  {
    opacity: 0;
  }
}
</style>
