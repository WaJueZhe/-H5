<template>
  <div class="practical">
    <!-- 头部 -->
    <app-comhed :name="headerName" :back="true" :operation = "operation"></app-comhed>

    <div class="abnormal">
      <span class="abnormal-tit" >{{expHead.deliverCompany}}</span>
      <span v-if="justRead()" class="abnormal-add" @click="addText"><i class="iconfont icon-add"></i></span>
    </div>
    <div class="group">
      <table>
        <tr>
          <td>货物名称</td>
          <td>编码</td>
          <td>数量</td>
          <td>异常类型</td>
          <td v-if="justRead()">&nbsp;&nbsp;&nbsp;&nbsp;</td>
        </tr>
      </table>
    </div>

    <div class="message-box" v-for="(item, index) in expList" :key="index">
      <table style="word-break:break-all;">
        <tr class="tab" @click="showMsg()">
          <td><input :readonly="!justRead()" v-model="item.itemName" type="text" placeholder="货物名称" class="condition"></td>
          <td><input :readonly="!justRead()" v-model="item.itemCode" type="text" placeholder="编码" class="condition"></td>
          <td><input :readonly="!justRead()" v-model="item.quantity" type="text" placeholder="数量" class="condition"></td>
          <td>
            <div v-if="!justRead()" type="text" placeholder="异常类型" value=""  class="genre">{{item.exceptionType|exceptionName}}</div>
            <div v-if="justRead()"  type="text" placeholder="异常类型" value=""  class="genre" @click="selectBox(index)">{{item.exceptionType || '请选择' |exceptionName}}</div>
          </td>
          <td v-if="justRead()">
            <i class="iconfont icon-subtract" @click="delText(index)"></i>
          </td>
        </tr>
      </table>
    </div>

    <div class="character-text" @click="showMsg()">
      <textarea :readonly="!justRead()" placeholder="异常信息描述" maxlength="1000" @input="descInput" v-model="remark"></textarea>
      <div class="sum">{{remnant}}/1000</div>
    </div>
    
    <div v-if="justRead()" class="btn">
      <div class="btn-confirm" @click="saveExp">确定</div>
      <div class="btn-evidence" @click="imgupload">拍照留证</div>
    </div>
    <div v-if="isDriverConf=='Y'" class="btn">
      <div class="btn-confirm" @click="goOut">返回</div>
    </div>
    <!-- 弹框 -->
    <div class="modal-box" v-show="modalBox" @click="modalBox = false">
      <div class="modal-list">
        <div class="modal-item" v-for="(item, index) in arr" :key="index" @click="description(item)">{{item}}</div>
      </div>
    </div>
  </div> 
</template>

<script>
import { Indicator } from "mint-ui";
import { Toast } from "mint-ui";
import { MessageBox } from 'mint-ui';
export default {
  data () {
    return {
      formItemIndex: 0,
      headerName:'录入异常',
      operation:'返回',
      modalBox:false,
      arr:['货差','货损','其他'],
      expHead:'',
      expList:[
        {
          itemName:'',
          itemCode:'',
          quantity:'',
          exceptionType:''
        }
      ],
      remark:'',
      remnant:0,
      stopId:'',
      address:'',
      isDriverConf:'N'
    }
  },
  filters:{
    exceptionName(val){
      switch (val) {
        case 1:
          return '货损'
          break;
        case 2:
          return '货差'
        case '请选择':
          return '请选择';
        default:
          return '其他'
          break;
      }
    }
  },
  methods: {
    //提示信息
    showMsg(){
      let isReadOnly = this.justRead();
      if(!isReadOnly){
        Toast("司机已确认，不能修改");
      }
    },
    //判断是否是只读
    justRead(){
      if(this.isDriverConf=='N'){
        return true;
      }else{
        return false
      }
    },
    //进入拍照留证
    imgupload() {
      let _this = this;
      if(!this.checkData()){
        return;
      }
      this.checkData();
      this.$router.push({
        name: "ImgUploadPage",
        params: {
          stopId: _this.stopId,
          adr: _this.address
        }
      });
    },
    //返回上一页
    goOut(){
      this.$router.go(-1);     
    },
    //检查数据是否有效
    checkData(){
      if(this.expList.length==1){
        if((this.expList[0].itemName==null||this.expList[0].itemName=='')&&(this.expList[0].itemCode==null||this.expList[0].itemCode=='')
        &&(this.expList[0].quantity==null||this.expList[0].quantity=='')
        &&(this.expList[0].exceptionType==null||this.expList[0].exceptionType=='')){
          if(this.remark!=null&&this.remark!=''){
              Toast("需录入货损货差明细后才能录入异常备注信息");
              return false;
          }else{
            this.expList=[];
          }
        }else{
            if((this.expList[0].itemName==null||this.expList[0].itemName=='')&&(this.expList[0].itemCode==null||this.expList[0].itemCode=='')){
              Toast("第1行，名称和编码不能同时为空");
              return false;
            }
            if(this.expList[0].quantity==null||this.expList[0].quantity==''){
              Toast("第1行，数量不能为空");
              return false;
            }else{
              if(!this.isNumber(this.expList[0].quantity)){
                Toast("第1行，数量只能为数字");
                return false;
              }
            }
            if(this.expList[0].exceptionType==null||this.expList[0].exceptionType==''){
              Toast("第1行，异常类型不能为空");
              return false;
            } 
        }
      }else{
      //判断是否为空
        for(let i=0;i<this.expList.length;i++){
          if((this.expList[i].itemName==null||this.expList[i].itemName=='')&&(this.expList[i].itemCode==null||this.expList[i].itemCode=='')){
            Toast("第"+(i+1)+"行，名称和编码不能同时为空");
            return false;
          }
          if(this.expList[i].quantity==null||this.expList[i].quantity==''){
            Toast("第"+(i+1)+"行，数量不能为空");
            return false;
          }else{
            if(!this.isNumber(this.expList[i].quantity)){
              Toast("第"+(i+1)+"行，数量只能为数字");
              return false;
            }
          }
          if(this.expList[i].exceptionType==null||this.expList[i].exceptionType==''){
            Toast("第"+(i+1)+"行，异常类型不能为空");
            return false;
          }  

        }
      }
      
      this.$store.state.practicalTempData.expList=this.expList;
      this.$store.state.practicalTempData.expHead.remark=this.remark;
      return true;
    },
    // //转换异常类型
    // checkExpType(){
    //   for(let i = 0;i< this.expList.length;i++){
    //         switch(this.expList[i].exceptionType){
    //         case '货损':
    //         this.expList[i].exceptionType = 1;
    //         break;
    //         case '货差':
    //         this.expList[i].exceptionType = 2;
    //         break;
    //         default:
    //         this.expList[i].exceptionType = 9;
    //         break;
    //       }
    //   }
    // },
    //保存货损货差信息
    saveExp(){
      if(this.checkData()){
        this.$router.go(-1);
      };     
    },
    //判断是否为数字
    isNumber(val) {
      var regPos = /^\d+(\.\d+)?$/; //非负浮点数
      var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if (regPos.test(val) || regNeg.test(val)) {
        return true;
      } else {
        return false;
      }
    },
    // 选中弹框
    selectBox(index){
      this.formItemIndex = index;
      this.modalBox = true; 
    },
    //增加
    addText(){
      this.expList.push({
				text: '',
			});
    },
    //删除
    delText(index){
      if (this.expList.length == 1) {
        this.expList=[];
        this.expList.push({itemName:'',itemCode:'',quantity:'',exceptionType:''});
				return;
      }
      this.expList.splice(index, 1);
      this.$store.state.practicalTempData.expList = this.expList;
    },
    description(value){
      switch (value) {
        case '货损':
          this.expList[this.formItemIndex].exceptionType = 1;
          break;
        case '货差':
          this.expList[this.formItemIndex].exceptionType = 2;
          break;
        default:
          this.expList[this.formItemIndex].exceptionType = 9;
          break;
      }
      console.log(this.expList)
       this.$forceUpdate();
    },
    descInput(){
      let remk = String(this.remark);
      var txtVal = remk.length;
      this.remnant =0 + txtVal;
    }
  },created () {
    this.stopId = this.$route.params.stopId;
    this.address=this.$route.params.address;
    this.isDriverConf = this.$route.params.isDriverConf;
    if(this.$store.state.practicalTempData.expList){
      this.expList = this.$store.state.practicalTempData.expList;
    }
    this.expHead = this.$store.state.practicalTempData.expHead;
    this.remark = this.expHead.remark;
    this.descInput();
    console.log(this.expList)
    if(!this.expList){
      this.expList.push({itemName:'',itemCode:'',quantity:'',exceptionType:''});
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.practical {
  position:fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  width:100%;
  height:100%;
  background-color: #eee;  

  .abnormal {
    position: relative;
    margin-top:px2rem(80px);
    height: px2rem(70px);
    width: 100%;
    background-color: #eee;
    font-size: px2rem(30px);
    line-height: px2rem(70px);

    .abnormal-tit {
      position: absolute;
      left:50%;
      transform:translateX(-50%);
    }

    .abnormal-add {
      position: absolute;
      right:px2rem(20px);
      padding:0 px2rem(20px);

      > i {
        border:px2rem(2px) solid blue;
        border-radius:50%;
        color:blue;
        font-size: px2rem(40px);
        vertical-align:middle
      }
    }

    
  }
  .info-title {
    width:100%;
    font-size:px2rem(28px);
    display:flex;
    justify-content:space-between;
    border-bottom:px2rem(2px) solid #ccc;

    .info-name {
      width:40%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      text-align:center;
      border-right:px2rem(2px) solid #ccc;
    }
    .info-number {
      width:20%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      text-align:center;
      border-right:px2rem(2px) solid #ccc;
    }
    .info-status {
      width:40%;
      height:px2rem(80px);
      line-height:px2rem(80px);
      text-align:center;
    }
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
      border-bottom: px2rem(2px) solid #d9d9d9;

      > tr {
        height:5vh;
        

        > td {
          padding:px2rem(20px);
          width:25%;
          font-size:px2rem(28px);
          box-sizing: border-box;
          border-right: px2rem(2px) solid #dedede;
          overflow: hidden;
          

          &:nth-child(3) {
            width:19%;
          }

          &:nth-child(5) {
            width:6%;

            > i {
              border:px2rem(2px) solid #ccc;
              border-radius:50%;
              font-size:px2rem(30px);
              font-weight:bold;
              color:#666;
            }
          }

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
    // width:100%;
    display:flex;
    justify-content:space-between;
    box-sizing:border-box;
    background-color: #fff;
    
    table {
      width: 100%;
      text-align: center;
      border-bottom: px2rem(2px) solid #d9d9d9;

      > tr {
        height:5vh;

        > td {
          padding:px2rem(20px);
          width:25%;
          min-height:px2rem(80px);
          font-size:px2rem(28px);
          color:#999;
          box-sizing: border-box;
          border-right: px2rem(2px) solid #dedede;
          overflow: hidden;

          .condition {
            width:100%;
            height:100%;
            text-align:center;
          }

          &:nth-child(3) {
            width:19.2%;
          }

           &:nth-child(5) {
            width:6%;

            > i {
              border:px2rem(2px) solid #ccc;
              border-radius:50%;
              font-size:px2rem(30px);
              font-weight:bold;
              color:#666;
            }
          }

          &:nth-child(4) {
            // padding:0;
            // text-align:left;

            .genre {
              width:100%;
              height:100%;
              text-align:center
              color:#666;
            }

            

            > span {
              display:inline-block;
              border-top: px2rem(20px) solid #666;
              border-right: px2rem(20px) solid transparent;
              vertical-align:middle;
              margin-top:px2rem(-8px)
            }
          }

          > img {
            vertical-align:middle;
            margin-top: px2rem(-8px);
          }
        }
      }
    }
  }

  .character-text {
    margin-top:px2rem(60px);
    padding:px2rem(20px);
    width:100%;
    height:px2rem(300px);
    box-sizing:border-box;

    > textarea {
      padding:px2rem(20px);
      width:100%;
      height:100%;
      box-sizing:border-box;
    }

    .sum {
      margin-top:px2rem(-8px);
      margin-right:px2rem(6px);
      text-align:right;
      font-size:px2rem(28px);
    }
  }

  .info-text {
    margin-top:px2rem(100px);
    margin-bottom :px2rem(28px);
    text-align:center;
    font-size:px2rem(28px);
    color:#666;

    > span {
      color:blue;
    }
  }

  .btn {
    padding:px2rem(40px) px2rem(40px);
    width:100%;
    display:flex;
    justify-content:space-between;

    > div {
      flex:1;
      text-align:center;
      height:px2rem(80px);
      line-height:px2rem(80px);
      font-size:px2rem(36px);
      background-color:blue;
      color:#fff;
      border-radius:px2rem(10px);
    }

    .btn-confirm {
      margin-right:px2rem(20px);
    }
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
        border-bottom:px2rem(2px) solid #ccc;
        z-index:9999
      }
    }
  }
}

</style>


