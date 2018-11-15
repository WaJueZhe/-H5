<template>
  <div class="compileDriver-page">
    <app-comhed :name="headerName" :operation = "operation" :flag = "false" :back="true"></app-comhed>
    <div class="form">

      <div class="group-item">
        <div class="type"><span>*</span> 姓名：</div>
        <div class="select">
          <input type="text" placeholder="请输入您的姓名" v-model="updateForm.driverName">
        </div>
      </div>

      <div class="group-item">
        <div class="type"><span>*</span> 年龄：</div>
        <div class="select">
          <input type="text" placeholder="请输入您的年龄" v-model="updateForm.driverAge">
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
          <input class="forbid" type="text" placeholder="请输入手机号" :maxlength="11" v-model.number="updateForm.driverMobile" readonly="readonly">
        </div>
      </div>

      <div class="group-item">
        <div class="type">身份证号：</div>
        <div class="select">
          <input class="forbid" type="text" placeholder="请输入身份证号" :maxlength="18"  v-model="updateForm.driverIdentityId" readonly="readonly">
        </div>
      </div>
    </div>
    <div class="from-btn" @click="editSubmit">提交</div>
    
  </div>
</template>
<script>
import Radio from '../../components/common/radio';
import { delCookie, setCookie, getCookie } from "../../js/cookie.js";
import { Toast } from "mint-ui";
export default {
  data () {
    return {
      identityType:"",
      headerName:'编辑司机',
      operation:'',
      formData:{
        gender: this.$store.state.compileDriverList.driverSex,
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
      updateForm: {
        id:this.$store.state.compileDriverList.id,
        driverName: this.$store.state.compileDriverList.driverName,
        driverAge: this.$store.state.compileDriverList.driverAge,
        driverSex: this.$store.state.compileDriverList.driverSex,
        driverMobile: this.$store.state.compileDriverList.driverMobile,
        driverIdentityId: this.$store.state.compileDriverList.driverIdentityId//,
       }
    }
  }, 
  methods: {
    editSubmit(){
      if(this.updateForm.driverName == ''){
        Toast('请输入姓名');
        return false;
      }
      else if(this.updateForm.driverAge == ''){
        Toast('请输入年龄');
        return false;
      }
      else if(isNaN(this.updateForm.driverAge)){
        Toast('年龄为数字');
        return false;
      }
      else if(!(/^[0-9]*[1-9][0-9]*$/.test(this.updateForm.driverAge))){
        Toast('请输正整数');
        return false;
      }
      else if(this.updateForm.driverAge < 18 || this.updateForm.driverAge > 60){
        Toast('年龄要在18到60岁之间');
        return false;
      }
      this.updateForm.driverSex = this.formData.gender;

      let updateUrl = "";
      if(this.identityType == "pcuser"){
        updateUrl =`${this.api.baseURL}/driver/update`;
      }else{
        updateUrl =`${this.api.baseURL}/c_driver/update`;
      }
      let that = this;
      let param = Object.assign({}, that.updateForm);
      console.log(param)
      that.axios
      .post(updateUrl, param)
      .then(function(result){
        console.log(result)
          if ((result) && (result.status == '200')){ //保存成功
              Toast("保存成功");
              that.$router.go(-1);
              // that.$router.push('/driver');
          } else if(result && result.data.code == "400"){
            Toast(result.data.message);
          }else{ 
            Toast("保存失败，联系管理员");
          }
      });
    }
  },
  components: {
    Radio,
  },
  created () {
    this.identityType = getCookie("identityType");
    console.log(this.identityType)
  }
}
</script>
<style lang="stylus">
@import '../../components/stylus/mixins.styl';

.compileDriver-page {
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

        .forbid {
          color:#999;
        }

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
