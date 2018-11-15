<template>
    <div class="user">
          <div class="header">
              <i @click="$router.push('/setup')" class="iconfont icon-back"></i>
              <span>{{ $store.state.user.opertain }}</span>
              <button @click="update()">保存</button>
          </div>
          <div class="text">
              <input type="text" :placeholder="$store.state.user.behavior" v-model="$store.state.user.banggu">
          </div>
    </div>
</template>

<script>
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  methods: {
    update() {
      let id = this.$store.state.user.handleId;
      let param = {};
      if (id == 1) {
        //修改用户姓名
        let driverName = this.$store.state.user.banggu;
        param.driverName = driverName;
      } else if (id == 3) {
        //修改用户手机号码
        // let driverName = this.$store.state.user.banggu;
        // param.append("driverName", driverName);
      } else {
      }

      this.axios
        .post(`${this.api.baseURL}/driver/updatedriverInfh5`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            Toast("保存成功");
            //调回设置页面
            this.$router.replace("/setup");
          } else {
            Toast(res.data.message);
          }
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

.user {
    width: 100%;
    height: 100%;

    .header {
        position: relative;
        width: 100%;
        height: px2rem(90px);
        line-height: px2rem(90px);
        background-color: #061128;
        font-size: px2rem(32px);
        color: #ffffff;

        span {
            margin-left: px2rem(20px);
        }

        button {
            position: absolute;
            top: 50%;
            right: px2rem(20px);
            transform: translateY(-50%);
            background-color: #5a83dc;
            height: px2rem(60px);
            color: #ffffff;
            width: px2rem(120px);
            border-radius: px2rem(10px);
        }
    }

    .text {
        width: 100%;
        padding: 0 px2rem(20px);
        box-sizing: border-box;
        margin-top: px2rem(20px);

        input {
            width: 100%;
            height: px2rem(80px);
            border-bottom: 1px solid #ececee;
            font-size: px2rem(32px);
        }
    }
}
</style>