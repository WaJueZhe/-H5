<template>
  <div class="cargoAffirm-page">
    <!-- 头部 -->
    <app-comhed :name="headerName" :operation = "operation"></app-comhed>
    <div class="title">收货人:{{sender}}</div>
    <div class="group">
      <table>
        <tr>
          <td>货物名称</td>
          <td>计划数量</td>
          <td>签发数量</td>
        </tr>
      </table>
    </div>
    <div class="message-box">
      <table style="word-break:break-all;">
        <tr v-for="(item,index) in units" :key="index" class="tab">
          <td>{{item.unitDesc}}</td>
          <td>{{item.plannedUnits}}件</td>
          <td v-on:click ="modify(index)">
            <span v-if="munitList[index].newActualUnits" :style="fontColor(munitList[index])">{{munitList[index].newActualUnits}}件</span>
            <span v-if="!munitList[index].newActualUnits" :style="fontColor(munitList[index])">{{munitList[index].sendActUnits}}件</span>
            <img src="../../assets/img/icn_modify.png">
          </td>
        </tr>
      </table>
    </div>

    <div class="bottom">
      <div class="bottom-item" @click="ensure">确定</div>
      <!-- <div class="bottom-item">
        <router-link :to="{ name: 'practical',params:{shpId:this.shpId,stopId:this.stopId,address:this.address} }">异常录入</router-link>
      </div> -->
    </div>

    <!-- 确认弹框提示 -->
    <div class="affirm" v-show="affirmBox">
      <div class="affirm-box">
        <div class="affirm-tit">提示</div>
        <div class="affirm-msg">数量已修改，是否提交保存？</div>
        <div class="affirm-btn">
          <div class="cancel" @click="affirmBox = false">返回</div>
          <div class="submit" @click="saveAct">提交</div>
        </div>
      </div>
    </div>

    <!-- 修改货物信息弹框 -->
    <transition name="modify">
        <app-modify @ievent = "ievent" v-show="$store.state.modifyBox" type="D" :mlist="munitList" :indexNo="indexNo"></app-modify>
    </transition>
  </div>
</template>

<script>
import ModifyBox from "../../components/peisong/modifyBox.vue";
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  watch: {
    stopId() {
      this.init();
    }
  },
  data () {
    return {
      headerName:'发货确认',
      operation:'',
      affirmBox:false,//控制确认弹框的显示
      indexNo: "",
      munitList: [],
      recvUnits:[],
      shpId:'',
      stopId:'',
      units:[],
      sender:'',
      address:''
    }
  },
  methods: {
    // 修改货物信息
    modify(index) {
      this.indexNo = index;
      this.$store.state.modifyBox = true;
    },
    saveAct(){
      let p ={
        units:this.recvUnits,
        acttype:'D',
        stopId:this.stopId
      };
      Indicator.open();
      this.axios
        .post(`${this.api.baseURL}/bsShipmentUnitActual/api/saveOrUpdateActUnits`,p)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.affirmBox=false;
            Toast('保存成功!');
            window.location.href=this.api.baseURL+"/wx/wx_mpredirect?reurl=sign_begin&params=lssue,"+this.stopId;
          }
        });
    },
    ensure(){
      this.recvUnits=[];
      for(let i=0;i<this.munitList.length;i++){
        if(this.munitList[i].newActualUnits!=null
        &&this.munitList[i].newActualUnits!=this.munitList[i].sendActUnits){
          this.recvUnits.push(this.munitList[i]);
        }
      }
      if( this.recvUnits.length>0){
        this.affirmBox = true;
      }else{
        //没有修改，直接返回
        window.location.href=this.api.baseURL+"/wx/wx_mpredirect?reurl=sign_begin&params=lssue,"+this.stopId;
      }
    },
    ievent(...data) {
      let newUnit = data[1];
      this.munitList[data[0]].newActualUnits = newUnit;
    },
    //颜色变红
    fontColor(item){
      if(item.newActualUnits !=null){
        if(item.plannedUnits!=item.newActualUnits){
        return 'color :red;font-weight :bold'
        }else{
          return null;
        }
      }else{
        if(item.plannedUnits!=item.sendActUnits){
          return 'color :red;font-weight :bold'
        }
      }
    },
    init(){
      let p ={shpId:this.shpId};
      console.log(this.shpId);
      Indicator.open();
      this.axios
        .post(`${this.api.baseURL}/bsShipmentUnitActual/api/findActUnit`,p)
        .then(res => {
          Indicator.close();
          console.log(res);
          if (res.data.success) {
            this.units = res.data.data.units;
            this.munitList = JSON.parse(JSON.stringify(this.units));
            if(this.units.length>0){
              this.sender = this.units[0].unloadCompany;             
            }
          }
        });
    }
  },
  created () {
    this.shpId = this.$route.params.shpId;
    this.stopId = this.$route.params.stopId;
    this.address = this.$route.params.address;
    this.init();
  },
  components: {
    "app-modify": ModifyBox
  }
}
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.cargoAffirm-page {
  width:100%;
  height:100%;
  padding-bottom:px2rem(120px);

  .title {
    margin-top:px2rem(80px);
    height:px2rem(80px);
    line-height:px2rem(80px);
    text-align:center;
    font-size:px2rem(32px);
    background-color: #ccc;
  }

  .group {
    width:100%;
    display:flex;
    justify-content:space-between;
    box-sizing:border-box;
    background-color: #f5f5f5;

    table {
      
      width: 100%;
      text-align: center;
      border-bottom: 1px solid #d9d9d9;

      > tr {
        height:5vh;

        > td {
          padding:px2rem(20px);
          width:33.333%;
          font-size:px2rem(28px);
          box-sizing: border-box;
          border-right: 1px solid #dedede;

          > i {
            margin-left:px2rem(10px);
            color: #007aff;
            font-weight:bold;
          }

          .wrong {
            > i {
              margin-left:px2rem(10px);
              color:red;
              font-weight:bold;
            }
          }
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
          width:33.333%;
          font-size:px2rem(28px);
          box-sizing: border-box;
          border-right: 1px solid #dedede;

          > img {
            vertical-align:middle;
            margin-top: px2rem(-8px);
          }
        }
      }
    }
  }

  .bottom {
    position: fixed;
    bottom:px2rem(10px);
    padding:0 px2rem(30px);
    width:100%;
    display:flex;
    justify-content:space-between;
    box-sizing:border-box;
    

    .bottom-item {
      flex:1;
      height:px2rem(80px);
      line-height:px2rem(80px);
      text-align:center;
      font-size:px2rem(36px);
      color:#fff;
      background-color:blue;
      box-sizing:border-box;
      border-radius:px2rem(10px);

      > a {
        display:block;
        width:100%;
        height:100%;
        color:#fff;
      }

      &:last-child {
        margin-left:px2rem(30px);
        background-color:red;
      }
    }
  }

  //确认弹框提示
  .affirm {
    position: fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,.3);
    z-index:33;

    .affirm-box {
      position: absolute;
      top:50%;
      left:50%;
      width:90%;
      transform:translate(-50%,-50%);
      background-color: #fff;
      border-radius:px2rem(10px);
      z-index:44;
      box-sizing:border-box;

      .affirm-tit {
        padding-top:px2rem(30px);
        font-size:px2rem(30px);
        text-align:center;
        box-sizing:border-box;
      }

      .affirm-msg {
        padding:px2rem(40px) 0;
        font-size:px2rem(28px);
        text-align:center;
        box-sizing:border-box;
      }

      .affirm-btn {
        width:100%;
        display:flex;
        justify-content:space-between;
        border-top:1px solid #ccc;

        > div {
          flex:1;
          height:px2rem(80px);
          line-height:px2rem(80px);
          text-align:center;
          font-size:px2rem(28px);
          color:#666;
          

          &:last-child {
            color:#00b2fb;
            border-left:1px solid #ccc;
          }
        }
      }
    }
  }
}

// 货物信息弹框动画
// 控制弹框操作
.modify-enter-active {
    transition: all 0.5s;
}

.modify-leave-active {
    transition: all 0.5s;
}

.modify-enter {
    opacity: 0;
}

.modify-leave-to {
    opacity: 0;
}

</style>
