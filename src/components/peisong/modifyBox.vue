<template>
  <!-- 签收弹框 -->
  <div class="modify" @click.self="$store.state.modifyBox = false">
      <div class="card">
          <div class="title">收货实际信息</div>
          <div class="main">
              <div class="but1">
                  <div class="jia" @click="jiaNum">＋</div>
                  <div class="bnt"><input type="text" v-model="value"></div>
                  <div class="jian" @click="jianNum">－</div>
              </div>
          </div>
          <div class="but">
              <button @click="modify">确认修改</button>
          </div>
      </div>
  </div>
</template>

<script>
export default {
  props: ["indexNo", "mlist","type"],
  data() {
    return { 
        value: "",
        index: 0
        };
  },
  created(){
          
  },
  methods: {
    // 修改货物信息提交
    modify() {
      this.$store.state.modifyBox = false;
      this.$emit(
        "ievent",
        this.index,
        this.value
      );
    },
    // 货物加
    jiaNum() {
      this.value = String(Number(this.value) + 1);
    },
    // 货物减
    jianNum() {
      if (Number(this.value) == 0 || this.value == null || this.value == "") {
        return false;
      }
      this.value = String(Number(this.value) - 1);
    }
  },
  watch: {
    indexNo(){
        console.log(this.type);
       this.index = this.indexNo;
       if(this.type=='U'){
           if(this.mlist[this.index].newActualUnits){
            this.value = this.mlist[this.index].newActualUnits;
           }
           this.value = this.mlist[this.index].recvActUnits;
       }
       if(this.type=='D'){
           if(this.mlist[this.index].newActualUnits){
            this.value = this.mlist[this.index].newActualUnits;
           }          
           this.value = this.mlist[this.index].sendActUnits;
       }
       
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

til-col = #061128;
zCl = #383838;
bord-CL = #2166ff;

.modify {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    z-index: 11;
    background-color: rgba(0, 0, 0, 0.3);

    .card {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        z-index: 22;
        width: px2rem(640px);
        height: px2rem(360px);
        border-radius: px2rem(20px);
        overflow: hidden;
        background-color: #ffffff;

        .title {
            height: px2rem(70px);
            width: 100%;
            background-color: til-col;
            font-size: px2rem(30px);
            color: #ffffff;
            text-align: center;
            line-height: px2rem(70px);
        }

        .main {
            width: 100%;
            padding: 0 px2rem(30px);
            box-sizing: border-box;

            .but1 {
                position: relative;
                top: px2rem(30px);
                left: 50%;
                transform: translateX(-50%);
                height: px2rem(120px);
                border: 1px solid #ccc;
                width: 100%;
                border-radius: px2rem(10px);
                box-sizing: border-box;

                div {
                    width: 30%;
                    height: px2rem(120px);
                    line-height: px2rem(120px);
                    font-size: px2rem(60px);
                    font-weight: bold;
                    box-sizing: border-box;
                }

                .jia {
                    position: absolute;
                    left: 0;
                    top: 0;
                    text-align: center;
                }

                .jian {
                    position: absolute;
                    right: 0;
                    top: 0;
                    text-align: center;
                }

                .bnt {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40%;
                    height: 100%;
                    border: 1px solid #cccccc;
                    border-top: none;
                    // border-bottom: none;

                    input {
                        width: 100%;
                        height: 100%;
                        font-size: px2rem(62px);
                        color: zCl;
                        text-align: center;
                        vertical-align :top;
                    }
                }
            }
        }

        .but {
            position: absolute;
            left: 0;
            bottom: px2rem(40px);
            box-sizing: border-box;
            padding: 0 px2rem(30px);
            width: 100%;

            button {
                width: 100%;
                height: px2rem(60px);
                line-height: px2rem(60px);
                text-align: center;
                background-color: bord-CL;
                color: #ffffff;
                font-size: px2rem(30px);
                border-radius: px2rem(10px);
            }
        }
    }
}
</style>


