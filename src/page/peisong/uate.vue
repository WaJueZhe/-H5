<template>
  <div class="uate">
    <app-comhed :name="name" :operation="operation" :flag="false"></app-comhed>
    <div class="state">
      <div class="photo"><img src="../../assets/img/group-01.png" alt=""></div>
      <div class="state-title">恭喜，签单成功！</div>
    </div>
    <div class="group-box">
      <div class="group">
        <table>
          <tr>
            <td>{{senderOrRev}}</td>
            <td>合同类型</td>
            <td>下载</td>
          </tr>
        </table>
      </div>
      <div class="message-box">
        <table style="word-break:break-all;">
          <tr v-for="(item,index) in shpList" :key="index" class="tab">
            <td v-if="item.stopType=='U'">{{item.deliverCompany}}</td>
            <td v-if="item.stopType=='D'">{{item.unloadCompany}}</td>
            <td>{{item.contractType|contType}}</td>
            <td v-if="item.docViewUrl" @click="openDown(item.id,item.shpNo,item.docDownUrl,item.docViewUrl)"><img src="../../assets/img/u278.png" alt=""></td>
            <td v-if="!item.docViewUrl">无</td>
          </tr>
        </table>
      </div>
    </div>
    <div class="user">
      <div class="hed">
        <img src="../../assets/img/pic_my.png" alt="">
        <div class="name">
          <p>{{driver.driverName}}</p>
          <p>{{vehicleNo}}</p>
        </div>
      </div>
      <div class="star">
        <!-- 评价控件 -->
        <app-star @ievent = "ievent" :size="{ type : 4 }" :score="{ type : 4 }" ></app-star>
        <p>点这里，为运输服务满意度评分</p>
      </div>
    </div>
    <div class="text">
      <textarea v-model="evaluateComment" placeholder="对车主意见描述"></textarea>
    </div>
    <div class="but">
      <button v-show="showButton"  @click="sendEvaluate">提交评价</button>
    </div>

    <!-- 下载弹框提示 -->
    <Download v-show="$store.state.download" :downShpNo="downShpNo" :docViewUrl="downDocViewUrl" :docDownUrl="downDocDownUrl" :shpId="downShpId" :userName="userName"></Download>
  </div>
</template>

<script>
import Star from "../../components/peisong/star.vue";
import Download from "../../components/peisong/download.vue";
import { Indicator } from "mint-ui";
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
import wx from "weixin-js-sdk";
import { wx_init } from "../../js/weixin.js";

export default {
  data() {
    return {
      senderOrRev:'',
      showButton: true,
      name: "签单成功",
      operation: "",
      driver: {},
      stopId: "",
      vehicleNo: "",
      evaluateComment: "",
      evaluateName: "",
      score: 0,
      downShpId:'',
      downDocDownUrl:'',
      downDocViewUrl:'',
      downShpNo:'',
      userName:'',
      shpList:[]
    };
  },
  filters: {
    contType(val){
      switch(val){
        case '1':
        return '普通合同';
        break;
        case '2':
        return '异常签收合同';
        break;
        default:
        return '其他合同';
        break;
      }
    }
  },
  methods: {
    openDown(shpId,downShpNo,docDownUrl,docViewUrl){
      this.downShpId = shpId;
      this.downShpNo = downShpNo;
      this.downDocDownUrl = this.api.baseURL.substring(0,this.api.baseURL.length-3)+this.getCaption(docDownUrl,"tosignserver").replace('/etc', '');
      this.downDocViewUrl = this.api.baseURL.substring(0,this.api.baseURL.length-3)+this.getCaption(docViewUrl,"tosignserver").replace('/etc', '');
      this.$store.state.download = true;
    },
    //字符串截取
    getCaption(obj,str){
      var index=obj.lastIndexOf(str);
      obj=obj.substring(index,obj.length);
      return obj;
    },
    ievent(...data) {
      console.log(data); // data为包含传过来所有数据的数组，第一个元素是对象，第二个元素是字符串
      this.score = data[0];
    },
    //提交评价判断
    sendEvaluate() {
      console.log("提交评价");
      if (
        this.driver.id != null &&
        this.driver.id != "" &&
        this.stopId != null &&
        this.stopId != ""
      ) {
        if (this.score == 0) {
          MessageBox.confirm("确定要给司机评价0星吗?").then(action => {
            this.sendReq();
          });
        } else {
          this.sendReq();
        }
      } else {
        Toast("参数有误");
      }
    },
    //发送评价数据
    sendReq() {
      Indicator.open();
     let param = {"driverId": this.driver.id, "stopId": this.stopId, "evaluateComment": this.evaluateComment, "evaluateName": this.evaluateName, "score": this.score};
      this.axios
        .post(`${this.api.baseURL}/bsTaskEvaluate/api/createh5`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            Toast("评价成功,感谢您的参与!");
            this.showButton = false;
            if(window.__wxjs_environment === 'miniprogram'){   //判断是否在微信小程序内执行
              setTimeout(() => {
                wx.miniProgram.navigateBack({
                  delta: 1
                })
              }, 1500);
              return
            }
            this.$router.push('/signSucceed');
          } else {
            Toast("评价失败!");
          }
        });
    },
    //加载数据
    loadData(){
      let p ={stopId:this.stopId};
      console.log("stopID:"+this.stopId);
      Indicator.open();
      this.axios
        .post(`${this.api.baseURL}/bsTaskEvaluate/api/findUateData`,p)
        .then(res => {
          Indicator.close();
          console.log(res);
          if (res.data.success) {
            this.shpList = res.data.data.ret;
            if(this.shpList.length>0){
              if(this.shpList[0].stopType=='U'){
                this.senderOrRev="发货人";
              }else{
                this.senderOrRev="收货人";
              }
            }
          }
        });
    }
  },
    beforeMount() {
    var _this = this;
    //调用微信接口
    wx.ready();
  },
  created() {
    this.driver.id = this.$route.params.driverId;
    this.driver.driverName = this.$route.params.driverName;
    this.vehicleNo = this.$route.params.vehicleNo;
    this.stopId = this.$route.params.stopId;
    this.evaluateName = this.$route.params.evaluateName;
    this.userName = this.$route.params.userName;
    this.loadData();
  },
  mounted () {
    window.addEventListener("popstate", function(e) {  
        // 
    }, false);
  },
  components: {
    "app-star": Star,
    Download,
  }
};
</script>


<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

rdCl = #ececec; // 边框颜色
ZCL = #383838; // 字体颜色
bgl = #0f1a30; // 按钮颜色

.uate {
  width: 100%;
  height: 100%;
  margin-top: px2rem(80px);
  padding-bottom: px2rem(80px);

  .state {
    padding-top:px2rem(80px);
    text-align:center;

    .photo {
      margin:auto;      
      width:px2rem(160px);
      height:px2rem(180px);

      > img {
        width:100%;
        height:100%;
      }
    }

    .state-title {
      margin-top:px2rem(40px);
      margin-left:px2rem(30px)
      font-size:px2rem(38px);
      font-weight:bold;
    }
  }

  .group-box {
    margin-top:px2rem(40px);
    
    .group {
      width:100%;
      display:flex;
      justify-content:space-between;
      box-sizing:border-box;
      color:#fff;
      background-color: #061128;

      table {
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #d9d9d9;
        
        border
        > tr {
          height:5vh;

          > td {
            padding:px2rem(20px);
            width:33.3333%;
            font-size:px2rem(28px);
            box-sizing: border-box;
            border-right: 1px solid #dedede;
          }
        }
      }
    }

    .message-box {
      table {
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #d9d9d9;

        > tr {
          height:5vh;

          > td {
            padding:px2rem(20px);
            width:33.3333%;
            font-size:px2rem(28px);
            box-sizing: border-box;
            border-right: 1px solid #dedede;

            > img {
              width:px2rem(50px);
              height:px2rem(50px);
            }
          }
        }
      }
    }
  }

  .user {
    position: relative;
    padding: px2rem(30px);
    box-sizing: border-box;
    height: px2rem(160px);
    overflow: hidden;

    .hed {
      position: absolute;
      top:px2rem(30px);
      left:px2rem(30px);
      font-size: px2rem(30px);
      color: ZCL;

      img {
        width: px2rem(100px);
        height: px2rem(100px);
        border-radius: 50%;
        background-color: hotpink;
      }

      .name {
        float: right;
        margin-left: px2rem(20px);

        p:last-child {
          border: 1px solid rdCl;
          text-align: center;
          padding: 0 px2rem(4px);
          font-size: px2rem(24px);
          margin-top: px2rem(10px);
        }
      }
    }

    .star {
      position: absolute;
      right: px2rem(60px);
      top: px2rem(30px);
      // transform: translateY(-50%);

      // height: px2rem(160px);
      p {
        font-size: px2rem(18px);
        color: #dcdcdc;
      }
    }
  }

  .text {
    margin-top: px2rem(50px);
    width: 100%;
    height: px2rem(300px);
    padding: 0 px2rem(20px);
    box-sizing: border-box;

    textarea {
      width: 100%;
      height: 100%;
      border: 1px solid rdCl;
      padding: px2rem(20px);
    }
  }

  .but {
    margin-top:px2rem(40px);
    padding: 0 px2rem(20px);
    height: px2rem(80px);
    width: 100%;
    line-height: px2rem(80px);
    box-sizing: border-box;

    button {
      width: 100%;
      height: 100%;
      text-align: center;
      color: #ffffff;
      font-size: px2rem(30px);
      background-color: #0f1a30;
      border-radius: px2rem(12px);
    }
  }

}
</style>
