<template>
    <div class="authentication">
      <div class="mobile">
        <div class="number">姓名</div>
        <div class="input">
          <input type="text" placeholder="请输入您的姓名" v-model="inputUserName">
        </div>
      </div>
      <div class="mobile">
        <div class="number">身份证</div>
        <div class="input">
          <input type="text" placeholder="用户类型" v-model ="inputUserType" style="display:none">
          <input type="text" placeholder="请输入身份证号" :maxlength="18" v-model ="inputIdentityCard">
        </div>
      </div>
      <div class="affirm" :class="{ affirmActive: inputUserName && inputIdentityCard}" @click="saveInfo">实名认证</div>
    </div>
</template>

<script>
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
export default {
    props:['userType', 'userName', 'identityCard'],
    data() {
        return {
            tmp: '',
            inputUserName: '',
            inputIdentityCard: '',
            inputUserType: '',
        };
    },
    methods: {
        saveInfo(){
            if (this.inputIdentityCard.length < 15){
                Toast({position: 'bottom', message:'请输入正确的身份证号码'});
                return;
            }
            if ((this.inputUserName != '') && (this.inputIdentityCard != '') && (this.inputUserType != '')){
                let that = this;
                let url = this.api.baseURL + '/authent/userAuthent';
                let p = {"signerName": this.inputUserName, "signerIdcode": this.inputIdentityCard, "userType": this.inputUserType, "update": "1"};
                this.axios.post(url, p).then(res =>{
                  //console.log(res);
                  if ((res.status == '200') && (res.data.success == true)){
                    Toast({position: 'bottom', message: "已认证！"});
                    that.axios.post(`${this.api.baseURL}/userAuth/refreshUserIdentity`).then(res =>{
                      that.$emit("completeRealName", {}); //调用父组件
                    });
                  }else{
                    Toast({position: 'bottom', message: res.data.message});
                  }
                });
            }else{
              Toast({position: 'bottom', message:'请检查输入：' + this.inputUserName + '/' + this.inputIdentityCard + '/' + this.inputUserType});
            }
        },
    },
    watch: {
        userType(val){
            this.inputUserType = val;
        },
        userName(val){
            this.inputUserName = val;
        },
        identityCard(val){
            this.inputIdentityCard = val;
        }
    }
}
</script>

<style lang="stylus">
@import '../stylus/mixins.styl';
  .authentication {
    margin-top:px2rem(40px);
    box-sizing:border-box;

    .mobile  {
      position: relative;
      margin-bottom:px2rem(40px);
      width:100%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      border-bottom:1px solid #ccc;

      .number {
        position: absolute;
        top:0;
        left:0;
        width:20%;
        height:px2rem(80px);
        line-height:px2rem(80px);
        font-size: px2rem(34px);
        font-weight: 500;
      }

      .input {
        position: absolute;
        top:0;
        right:0;
        width:80%;
        height:100%;

        > input {
          width:100%;
          height:100%;
          font-size:px2rem(34px);
        }
      }
    }

    .affirm {
      margin:auto;
      margin-top:px2rem(80px);
      width:px2rem(200px);
      height:px2rem(80px);
      line-height:px2rem(80px);
      text-align:center;
      font-size:px2rem(32px);
      background-color: #ccc;
      color :#fff;
      border-radius:px2rem(10px);
    }

    .affirmActive {
      background-color: #2166ff;
    }
  }
</style>