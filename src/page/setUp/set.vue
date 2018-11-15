<template>
  <div class="set">
      <app-comhed :name="headerName" :operation = "operation" :flag = "false" :back="false"></app-comhed>
      <div class="form">
          <div v-show="$store.isdemouser" class="photo">
                <span>头像</span>
                <span>
                  <img v-if="driver.driverPic != ''&& driver.driverPic !=null" v-bind:src="api.resourceurl+driver.driverPic">
                  <img v-if="driver.driverPic == ''|| driver.driverPic ==null" src="static/user.jpg">
                  <i class="iconfont icon-enter"></i>
                </span>
          </div>
          <div v-show="!$store.isdemouser" class="photo" @click="camera = !camera">
                <span>头像</span>
                <span>
                  <img v-if="driver.driverPic != ''&& driver.driverPic !=null" v-bind:src="api.resourceurl+driver.driverPic">
                  <img v-if="driver.driverPic == ''|| driver.driverPic ==null" src="static/user.jpg">
                  <i class="iconfont icon-enter"></i>
                </span>
          </div>
          <div v-show="$store.isdemouser" class="name">
                <span>姓名</span>
                <span  style="float:right;">演示用户<i class="iconfont icon-enter"></i></span>
          </div>
          <div v-show="!$store.isdemouser" class="name" @click="handle(1,driver.driverName)">
                <span>姓名</span>
                <span style="float:right;">{{driver.driverName}}<i class="iconfont icon-enter"></i></span>
          </div>
          <div v-show="!$store.isdemouser" class="gender" @click="seletcd=true">
                <span>性别</span>
                <span class="der" v-if="driver.driverSex==1">男<i class="iconfont icon-enter"></i></span>
                <span class="der" v-if="driver.driverSex==2">女<i class="iconfont icon-enter"></i></span>
                <span class="der" v-if="driver.driverSex!=1&&driver.driverSex!=2">{{driver.driverSex}}<i class="iconfont icon-enter"></i></span>

          </div>
          <div class="jiashi" v-show="$store.state.ownerLogin">
                <span>驾驶证</span>
                <span v-show="!$store.isdemouser">{{driver.driver_license_number}}</span>
                <span v-show="$store.isdemouser">1234567890</span>
          </div>
          <div class="phone">
                <span>手机号码</span>
                <span v-show="!$store.isdemouser">{{driver.driverMobile}}</span>
                <span v-show="$store.isdemouser">1234567890</span>
          </div>
          <div class="card">   
                <span>身份证号</span>
                <span v-show="!$store.isdemouser">{{driver.driverIdentityId}}</span>
                <span v-show="$store.isdemouser">1234567890</span>
                <span v-show="driver.isVerified == '1'" style="float:right;">已认证</span>
                <span v-show="driver.isVerified != '1'" style="float:right;color:red" @click="showRealName">未认证</span>
          </div>
      </div>
      <div class="back" @click="logOff">退出登录</div>
      <!-- 选择用户性别 -->
      <transition name="selet">
        <div class="leted" v-show="seletcd">
          <div class="bak" @click="seletcd = false"></div>
          <div class="gender">
            <h4>性别</h4>
            <div class="choice">  
                <label class="radio" @click="clkGender(1)">男<input type="radio" name="radio" :checked="checkedboy"><i></i></label>  
                <label class="radio" @click="clkGender(2)">女<input type="radio" name="radio" :checked="checkedgirl"><i></i></label>  
            </div> 
          </div>
        </div>
      </transition>
     
      <!-- 选择用户头像 -->
      <transition name="camera">
        <div class="camera" v-show="camera">
          <div class="zezhao" @click="camera = false"></div>
          <div>
            <VueImgInputer class="int" v-model="picValue" theme="light" size="large" @onChange="changimg"></VueImgInputer>
            <span>拍照</span>
          </div>
          <div><input id="upload" type="file" name="file" accept="image/*" @change="choiseImg"><span>请从手机相册选择</span> </div>
          <button @click="camera = false">取消</button>
        </div>
      </transition>

      <transition name="selet">
        <div class="leted" v-show="showReadNameComp">
          <div class="bak" @click="showReadNameComp = false"></div>
          <div class="gender">
            <realName :userName="this.driver.driverName" :identityCard="this.driver.driverRealIdentityId" :userType="this.driver.userType" @completeRealName="completeRealName"></realName>
          </div>
        </div>
      </transition>

  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import { Radio } from "mint-ui";
import { Toast } from "mint-ui";
import VueImgInputer from "vue-img-inputer";
import { delCookie } from "../../js/cookie.js";
import Exif from "exif-js";
import realName from "../../components/setup/realName.vue";
export default {
  data() {
    return {
      headerName: "设置",
      operation: "",
      driver: {
        userType: ''
      },
      seletcd: false,
      boy: 1,
      girl: 2,
      camera: false,
      picValue: "",
      picValue1:'',
      headerImage:'',
      checkedboy:true,
      checkedgirl:false,
      showReadNameComp: false
    };
  },
  methods: {
        //处理隐藏手机号码信息
    handlePhone(value) {
      let arr = [...value];
      let preArr = arr.slice(0, 3);
      let afterArr = arr.slice(-3);
      let midArr = arr.slice(4, arr.length - 2);
      midArr = midArr.map(function() {
        return "*";
      });
      let result = preArr.concat(midArr, afterArr);
      return result.join("");
    },
    // 图片转换
    imgPreview(file) {
      let self = this;
      // 看支持不支持FileReader
      if (!file || !URL.createObjectURL) return;
      if (/^image/.test(file.type)) {
        // 创建一个reader
        this.$store.state.imgUrl = URL.createObjectURL(file);
      }
    },
    // 拍照
    changimg(file) {
      this.imgPreview(file);
      this.$router.push("/cutImg");
    },
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    //利用canvas压缩图片
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        // console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.1);
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    //从相册选择
    choiseImg(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue1 = files[0];
      this.imgPreview2(this.picValue1);
    },
    imgPreview2(file) {
      let self = this;
      let Orientation;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file);
        // 读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          // self.headerImage = result;
          self.$store.state.imgUrl = result;
          self.$router.push('/cutImg')
        };
      }
    },
    // 选择用户性别
    clkGender(val) {
      this.seletcd = false;
      let dSex = "";
      // console.log(val)
      if (val == 1) {
        dSex = "1";
      } else {
        dSex = "2";
      }
      if (this.driver.driverSex != dSex) {
        let param = {"driverSex": dSex};
        this.updateInf(param);
      }
    },
    logOff(){
      Indicator.open("正在注销");
      let param = {
        loginType:'0'
      };
      this.axios
        .post(`${this.api.baseURL}/userAuth/dirverLogOffh5`,param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.$router.push("/");
          } else {
            this.$router.push("/");
          }
          // 删除cookie 
          delCookie("authId");
          delCookie("phone");
          delCookie("tokenid"); 
          delCookie("identityType"); // 切换的身份写到cookie  
          delCookie("orgId"); // 司机登录机构id 
          delCookie("permitsMap");// 清除 pcuser 的权限信息
        });
    },
    handle(id, res) {
      if (id == 1) {
        //修改用户姓名
        this.$store.state.user.opertain = "修改用户名";
        this.$store.state.user.behavior = "请输入用户名";
        this.$store.state.user.banggu = res;
        this.$store.state.user.handleId = 1;
        this.$router.push("/setOperation");
      }
    },
    updateInf(param) {
      this.axios
        .post(`${this.api.baseURL}/driver/updatedriverInfh5`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            Toast("保存成功");
            //调回设置页面
            // this.$router.replace("/setup");
          } else {
            Toast(res.data.message);
          }
          this.$router.go(0);
        });
    },
    getDriverInfo(){
      Indicator.open();
      let that = this;
      this.axios.post(`${this.api.baseURL}/driver/driverInfo`).then(res => {
        Indicator.close();
        console.log(res);
        if (res.data.success) {
          this.driver = res.data.data.driver;
          res.data.data.driver.driverMobile= res.data.data.driver.driverMobile.slice(0,3) +'****'+res.data.data.driver.driverMobile.slice(7);
          this.driver.driverRealIdentityId = res.data.data.driver.driverIdentityId;
          this.driver.userType = 'driver';

          that.checkedboy = res.data.data.driver.driverSex == "1"; // 男默认值
          that.checkedgirl = res.data.data.driver.driverSex == "2"; // 女默认值

          if (res.data.data.driver.driverIdentityId.length === 15) {
                res.data.data.driver.driverIdentityId =res.data.data.driver.driverIdentityId.slice(0,4) +'****'+'***'+res.data.data.driver.driverIdentityId.slice(11);
              }
              else {
                res.data.data.driver.driverIdentityId =res.data.data.driver.driverIdentityId.slice(0,4) +'*****'+'*****'+res.data.data.driver.driverIdentityId.slice(14);
              }
        }
      });
    },
    completeRealName(){
      this.showReadNameComp = false;
      this.getDriverInfo();
    },
    showRealName(){
      this.showReadNameComp = true;
    }
  },
  created() {
    this.showReadNameComp = false;
    this.getDriverInfo();
  },
  components: {
    realName,
    VueImgInputer
  }
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

zCl = #383838;

.set {
  position: fixed;
  top: 0;
  left: 0;
  padding-top: px2rem(80px);
  width: 100%;
  height: 100%;
  background-color: #ececec;

  // 用户表单
  .form {
    width: 100%;
    margin-top: px2rem(20px);
    border-bottom: 1px solid #d9d9d9;
    overflow: hidden;

    .photo {
      position: relative;
      padding: 0 px2rem(20px);
      background-color: #ffffff;
      box-sizing: border-box;

      input {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        opacity: 0;
      }

      img {
        width: px2rem(100px);
        height: px2rem(100px);
        border-radius: 50%;
      }

      span:last-child {
        float: right;
      }
    }

    div {
      position: relative;
      width: 100%;
      height: px2rem(100px);
      line-height: px2rem(100px);
      box-sizing: border-box;
      font-size: px2rem(30px);
      padding: 0 px2rem(20px);
      border-bottom: 1px solid #d9d9d9;
      background-color: #ffffff;
    }

    div:first-child {
      width: 100%;
      height: px2rem(140px);
      line-height: px2rem(140px);
    }

    .name {
      width: 100%;
      position: relative;

      span:last-child {
        position: absolute;
        right: px2rem(20px);
        top: 0;
      }
    }

    .jiashi, .card {
      border-bottom: 1px solid #d9d9d9;
      font-size: px2rem(30px);
      padding-right: px2rem(20px);
      box-sizing: border-box;

      span:last-child {
        float: right;
      }
    }

    .gender {
      position: relative;

      .der {
        position: absolute;
        right: px2rem(20px);
        top: 0;
      }
    }

    .phone {
      padding-right: px2rem(20px);

      span:last-child {
        float: right;
      }
    }

    .card {
      border: none;
    }

    .jiashi {
      margin-top: px2rem(20px);
    }
  }

  // 退出登录
  .back {
    margin: auto;
    width: px2rem(600px);
    background-color: #343d50;
    margin-top: px2rem(100px);
    font-size: px2rem(30px);
    color: #fff;
    text-align: center;
    height: px2rem(100px);
    line-height: px2rem(100px);
    border-radius:px2rem(20px);
    box-sizing: border-box;
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
  }
}

// 选择用户性别
.leted {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .bak {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
  }

  .gender {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 90%;
    // height: px2rem(350px);
    background-color: #ffffff;
    padding: px2rem(40px);
    box-sizing: border-box;

    h4 {
      font-size: px2rem(40px);
      font-weight: normal;
      margin-bottom: px2rem(20px);
    }

    .choice {
      position: relative;
    }

    .choice .radio {
      position: relative;
      display: block;
      font-weight: 400;
      color: #000;
      padding-left: 25px;
      cursor: pointer;
      font-size: px2rem(36px);
      height: px2rem(80px);
      line-height: px2rem(80px);
    }

    .choice .radio input {
      position: absolute;
      left: -9999px;
    }

    .choice .radio i {
      display: block;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 15px;
      height: 15px;
      outline: 0;
      border: 1px solid #47a8c0;
      background: #ececec;
      border-radius: 50%;
      transition: border-color 0.3s;
      -webkit-transition: border-color 0.3s;
    }

    .choice .radio input:checked+i {
      border-color: #0cd628;
    }

    .choice .radio input+i:after {
      position: absolute;
      content: '';
      top: 2px;
      left: 2px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background-color: #0cd628;
      opacity: 0;
      transition: opacity 0.1s;
      -webkit-transition: opacity 0.1s;
    }

    .choice .radio input:checked+i:after {
      opacity: 1;
    }
  }
}

// 选择用户头像动画
.camera {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #061128;

  .zezhao {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
  }

  div:nth-child(2) {
    position: absolute;
    bottom: px2rem(220px);
    left: 50%;
    transform: translateX(-50%);
    width: 96%;
    height: px2rem(100px);
    line-height: px2rem(100px);
    background-color: #ffffff;
    z-index: 22;
    border-top-left-radius: px2rem(10px);
    border-top-right-radius: px2rem(10px);

    .int {
      position: absolute;
      top: 0;
      width: 0;
      height: 100%;
      width: 100%;
      opacity: 0;
      z-index: 2;
    }

    span {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      z-index: 1;
      font-size: px2rem(28px);
    }
  }

  div:nth-child(3) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: px2rem(140px);
    width: 96%;
    height: px2rem(100px);
    line-height: px2rem(100px);
    background-color: #ffffff;
    z-index: 22;
    border-bottom-left-radius: px2rem(10px);
    border-bottom-right-radius: px2rem(10px);

    input {
      position: absolute;
      top: 0;
      width: 0;
      height: 100%;
      width: 100%;
      opacity: 0;
      z-index: 2;
    }

    span {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      z-index: 1;
      font-size: px2rem(28px);
    }
  }

  button {
    position: absolute;
    bottom: px2rem(30px);
    left: 50%;
    transform: translateX(-50%);
    width: 96%;
    height: px2rem(100px);
    background-color: #ffffff;
    border-radius: px2rem(10px);
    color: #061128;
  }
}

.camera-enter-active, .camera-leave-active {
  transition: opacity 0.5s;
}

.camera-enter, .camera-leave-to { /* .fade-leave-active below version 2.1.8 */
  opacity: 0;
}
</style>


