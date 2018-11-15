<template>  
    <div class="uploadImg">  
      <!-- 头部 -->
      <div class="header">
        <i @click="$router.go(-1)" class="iconfont icon-back"></i>
        <span>图片上传</span>
        <button @click="postImg">保存</button>
      </div>

      <!-- 描述 -->
      <div class="text">  
        <textarea name="" id="" cols="30" rows="10" placeholder="描述你的情况" v-model="text"></textarea>
      </div>
      <div class="imgBox">
        <ul class="list">
          <li v-for="(item,indexNo) in stopPics" :key="indexNo" class="item">
            <img v-if="api.resourceurl+item" v-bind:src="api.resourceurl+item"/>
          </li>
        </ul>
      </div>
      <!-- 添加照片 -->
      <div class="addPhoto">
        <!-- 图片展示 -->
        <div class="showImg" v-for="(item,index) in headerImage" :key="index">
          <img :src="item">
        </div>
        <div class="show" >
          <div @click="camera = !camera">
            <span class="shu"></span>
            <span class="heng"></span>
            <!-- <input type="file" id="upload" accept="image" @change="upload"> -->
          </div>
        </div>  
      </div>
      <!-- 选择图片 -->
      <transition name="camera">
        <div class="camera" v-show="camera">
          <div class="zezhao" @click="camera = false"></div>
          <div>
            <VueImgInputer class="int" v-model="picValue" theme="light" size="large" @onChange="changimg"></VueImgInputer>
            <span>拍照</span>
          </div>
          <div><input id="upload" type="file" name="file" accept="image/*" @change="upload"><span>请从手机相册选择</span> </div>
          <button @click="camera = false">取消</button>
        </div>
      </transition>
      <!-- 地理位置信息 -->
      <div class="adress">
        <i></i>{{address}}
      </div>
    </div>  
</template>  
  
<script>
import Exif from "exif-js";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";
import VueImgInputer from "vue-img-inputer";
export default {
  data() {
    return {
      camera: false,
      headerImage: [],
      picValue: "",
      text: "",
      address: "",
      stopId: "",
      stopInfo: {},
      stopPics: []
    };
  },
  methods: {
    init() {
      let param = {
        "stopId": this.stopId
        };

      this.axios
        .post(`${this.api.baseURL}/taskStop/findStopInfoh5`, param)
        .then(res => {
          if (res.data.success) {
            this.stopInfo = res.data.data.stopInfo;
            this.stopPics = res.data.data.stopInfo.stopPics.split("、");
            this.text = res.data.data.stopInfo.stopDesc;
          } else {
            Toast("加载出现了点意外，请重新进入");
          }
        });
    },
    upload(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.picValue = files[0];
      this.imgPreview(this.picValue);
      this.camera=false;
    },
        // 拍照
    changimg(file) {
      this.imgPreview(file);
      this.camera=false;
      // this.$router.push("/cutImg");
    },
    //获取图片
    imgPreview(file) {
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
          //判断图片是否大于100K,是就直接上传，反之压缩图片
          if (result.length <= 100 * 1024) {
            self.headerImage.push(result);
          } else {
            Indicator.open();
            img.onload = function() {
              let data = self.compress(img, Orientation);
              self.headerImage.push(data);
              Indicator.close();
            };
          }
        };
      }
    },
    //这里写接口
    postImg() {
      if (
        (this.text == null || this.text == "") &&
        (this.headerImage == null ||
          this.headerImage == "" ||
          this.headerImage == [])
      ) {
        Toast("您还没进行描述或者上传图片呢");
        return;
      }
      Indicator.open();
      let picStr = "";
      if (this.headerImage.length != 0) {
        picStr = JSON.stringify(this.headerImage);
      }
      let param = {
        "stopId": this.stopId,
        "stopDesc": this.text,
        "stopPics": picStr
        };
      this.axios
        .post(`${this.api.baseURL}/taskStop/updateStopPich5`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            Toast("提交成功");
            this.$router.go(-1);
          } else {
            Toast("出现了点意外，请重新进入");
          }
        });
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
        console.log("大于400万像素");
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
        console.log("超过100W像素");
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
    }
  },
  created() {
    this.address = this.$route.params.adr;
    this.stopId = this.$route.params.stopId;
    this.init();
  },
  components: {
    VueImgInputer
  }
};
</script>  
   
<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

bgCol = #061128;

.uploadImg {
  width: 100%;
}

// 头部
.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 22;
  width: 100%;
  height: px2rem(80px);
  line-height: px2rem(80px);
  background-color: bgCol;
  overflow: hidden;
  color: #ffffff;
  font-size: px2rem(30px);

  button {
    position: absolute;
    top: 50%;
    right: px2rem(20px);
    transform: translateY(-50%);
    width: px2rem(120px);
    height: px2rem(60px);
    line-height: px2rem(60px);
    border-radius: px2rem(10px);
    text-align: center;
    background-color: #5284f1;
    color: #fff;
  }
}

.text {
  width: 100%;
  height: px2rem(200px);
  margin-top: px2rem(80px);

  textarea {
    width: 100%;
    height: 100%;
    padding: px2rem(10px);
    box-sizing: border-box;
    font-size: px2rem(36px);
  }
}

.imgBox {
  padding: px2rem(20px);
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  .list {
    .item {
      float: left;
      margin-top: px2rem(20px);
      margin-right: px2rem(20px);
      width: px2rem(130px);
      height: px2rem(130px);

      > img {
        width: 100%;
      }
    }
  }
}

.addPhoto {
  width: 100%;
  padding: px2rem(10px);
  box-sizing: border-box;
  overflow: hidden;

  .showImg {
    float: left;
    width: 20%;
    height: px2rem(150px);
    padding: px2rem(10px);
    box-sizing: border-box;

    img {
      border: 1px solid #ccc;
      width: 100%;
      height: 100%;
    }
  }

  .show {
    float: left;
    position: relative;
    width: 20%;
    height: px2rem(150px);
    padding: px2rem(10px);
    box-sizing: border-box;

    div {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
    }

    .shu {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      width: 1px;
      height: 80%;
      border-right: 1px solid #ccc;
    }

    .heng {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      height: 1px;
      width: 80%;
      border-top: 1px solid #ccc;
    }

    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
      opacity: 0;
    }
  }
}

// 地理位置信息
.adress {
  width: 100%;
  padding: px2rem(10px);
  box-sizing: border-box;
  color: #383838;
  font-size: px2rem(32px);
}

// 选择图片动画
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
</style>
