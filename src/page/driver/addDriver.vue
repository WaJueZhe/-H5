<template>
  <div class="addDriver-page">
    <app-comhed :name="headerName" :operation = "operation" :flag = "false" :back="true"></app-comhed>
    <div class="form">

      <div class="group-item">
        <div class="type"><span>*</span> 姓名：</div>
        <div class="select">
          <input type="text" placeholder="请输入您的姓名" v-model="addForm.driverName">
        </div>
      </div>

      <div class="group-item">
        <div class="type"><span>*</span> 年龄：</div>
        <div class="select">
          <input type="text" placeholder="请输入您的年龄" v-model.number="addForm.driverAge">
        </div>
      </div>

      <div class="group-item">
        <div class="type"><span>*</span> 性别：</div>
        <div class="select">
          <Radio v-model="formData.gender" :dataList="formTemp.gender"></Radio>
        </div>
      </div>

      <div class="group-item">
        <div class="type"><span>*</span> 手机号：</div>
        <div class="select">
          <input type="text" placeholder="请输入手机号" :maxlength="11" v-model="addForm.driverMobile"
          vd-required
          vd-validate
          vd-type="phone"
          vd-notify='{
            "text": "手机号码不能为空",
            "patt": "手机号码格式不正确"
          }'
          >
        </div>
      </div>

      <div class="group-item">
        <div class="type"><span v-if="this.identityType == 'pcuser'">*</span>身份证号：</div>
        <div class="select">
          <input type="text" placeholder="请输入身份证号" :maxlength="18" v-model="addForm.driverIdentityId">
        </div>
      </div>
    </div>
    <div class="from-btn" @click="addSubmit">提交</div>
    
  </div>
</template>
<script>
import Radio from '../../components/common/radio';
import { delCookie, setCookie, getCookie } from "../../js/cookie.js";
import { Toast } from "mint-ui";
import { lang } from 'moment';
export default {
  data () {
    return {
      identityType:"",
      headerName:'新增司机',
      operation:'',
      formData:{
        gender:1,
      },
      formTemp:{
        gender: [
          {
            name: '男',
            value: 1,
          },
          {
            name: '女',
            value: 2,
          },
        ],
      },
      
      addForm: {
        driverName: "",
        driverAge: "",
        driverSex:"1",
        driverMobile: "",
        driverIdentityId: ""//,
        // driverLicenseNumber: ""

        // driverAge:18,
        // driverIdentityId:"",
        // driverLicenseEndTime:"2018-05-07",
        // driverLicenseNumber:"",
        // driverLicenseType:"A1",
        // driverMobile:"13826588898",
        // driverName:"xxx",
        // driverQualCode:"",
        // driverSex:"1"
      }
    }
  },
  components: {
    Radio,
  },
  methods: {
    checkExistsDriverIdentityId(){
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(reg.test(this.addForm.driverIdentityId) === false){
        Toast('您输入的身份不合法');
      }else {
        let pa = { idCard: this.addForm.driverIdentityId };
        this.axios
          .post(`${this.api.baseURL}/common/checkIdCardFormat`, pa)
          .then(res => {
            if (!res.data.data.result) {
              //后台校验不合法
              Toast("您输入的身份不正确");
            } else {
              //后台校验合法,再次请求，校验身份证是否重复
              let p = { driverIdentityId: value };
              this.axios
                .post(
                  `${this.api.baseURL}/driver/getCountByDriverIdentityId`,
                  p
                )
                .then(res => {
                  if (parseInt(res.data.data.result) > 0) {
                    Toast("同一客户已存在相同的身份证号!");
                    return false;
                  }
                });
            }
          });
      }
    },

    addSubmit(){
      if(this.addForm.driverName == ''){
        Toast('请输入姓名');
        return false;
      }
      else if(this.addForm.driverAge == ''){
        Toast('请输入年龄');
        return false;
      }
      else if(isNaN(this.addForm.driverAge)){
        Toast('年龄为数字');
        return false;
      }
      else if(!(/^[0-9]*[1-9][0-9]*$/.test(this.addForm.driverAge))){
        Toast('请输正整数');
        return false;
      }
      else if(this.addForm.driverAge < 18 || this.addForm.driverAge > 60){
        Toast('年龄要在18到60岁之间');
        return false;
      }
      else if(this.addForm.driverMobile == ''){
        Toast('请输入手机号码');
        return false;
      }
      else if(!(/^1[123456789]\d{9}$/.test(this.addForm.driverMobile))){
        Toast("手机号码不正确");
        return false;
      }else if (this.identityType == 'pcuser' && this.addForm.driverIdentityId == ''){
        Toast('请输入身份证');
        return false;      
      }
      else if (this.addForm.driverIdentityId) {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(reg.test(this.addForm.driverIdentityId) === false){
          Toast('您输入的身份不合法');
          return false;
        }
      }

      this.addForm.driverSex = this.formData.gender;
      let addUrl = "";
      switch (this.identityType) {
        case 'pcuser':
          addUrl = `${this.api.baseURL}/driver/createDriver`;
          break;
        case 'customer':
          addUrl = `${this.api.baseURL}/c_driver/createDriver`;
          break;      
        default:
          break;
      }
      let that = this; 
      let para = Object.assign({}, this.addForm);
      that.axios.post(addUrl, para)
        .then(function(result) {
          if (result && result.data.code == "200") {
            //保存成功
            Toast("添加成功");
            that.$router.go(-1);
          } else if(result && result.data.code == "400"){
            Toast(result.data.message);
          }else{
            Toast("添加失败，联系管理员");
          }
      });   
    }
  },
  created () { 
    this.identityType = getCookie("identityType"); 
    // console.log(this.identityType)
  }
}
</script>
<style lang="stylus">
@import '../../components/stylus/mixins.styl';

.addDriver-page {
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
}
</style>
