<template>
 
  <div class="pinglun">
    <scroller  ref="myscroller" :on-infinite="infinite" :loadingLayerColor="bgCol">
      <div class="warper">
      <!-- 人物评价 -->
      <div class="character">
          <div @click="togglerole(0)"><span>收货人评价<i></i></span></div>
          <div @click="togglerole(1)"><span>发货人评价<i></i></span></div>
      </div>
      <!-- 评价程度 -->
      <div class="evaluate">
          <ul v-if="showNo==0">
              <li @click="toggleatti(0)">全部（{{ucount}}）</li>
              <li @click="toggleatti(1)">满意（{{umcount}}）</li>
              <li @click="toggleatti(2)">不满意（{{ubmcount}}）</li>
          </ul>
          <ul v-if="showNo==1">
              <li @click="toggleatti(0)">全部（{{dcount}}）</li>
              <li @click="toggleatti(1)">满意（{{dmcount}}）</li>
              <li @click="toggleatti(2)">不满意（{{dbmcount}}）</li>
          </ul>
      </div>
      <!-- 评论详情 -->
      
      <div class="main" v-if="toggleattiNo==0" v-for="(item,indexNo) in evlist" :key="indexNo">
         
          <div class="people">
              <img src="../../assets/img/icn_dis@3x.png" alt="">
              <span>{{item.evaluateName}}</span>
              <span class="time">{{formatDate(item.createDate)}}</span>
          </div>
          <!-- <div class="time">
              <span>{{formatDate(item.createDate)}}</span>
          </div> -->
          <div class="text">
              <p v-if="item.evaluateComment !=''&&item.evaluateComment!=null">{{item.evaluateComment}}</p>
              <p v-if="item.evaluateComment ==''||item.evaluateComment==null">未作评价</p>
          </div>
        
      </div>
      <div class="main" v-if="toggleattiNo==1&&item.evaluateLevel>=3" v-for="(item,indexNo) in evlist" :key="indexNo">
         
          <div class="people">
              <img src="../../assets/img/icn_dis@3x.png" alt="">
              <span>{{item.evaluateName}}</span>
              <span class="time">{{formatDate(item.createDate)}}</span>
          </div>
          <div class="text">
              <p v-if="item.evaluateComment !=''&&item.evaluateComment!=null">{{item.evaluateComment}}</p>
              <p v-if="item.evaluateComment ==''||item.evaluateComment==null">无评价</p>
          </div>
        
      </div>
      <div class="main" v-if="toggleattiNo==2&&item.evaluateLevel<3" v-for="(item,indexNo) in evlist" :key="indexNo">
         
          <div class="people">
              <img src="../../assets/img/icn_dis@3x.png" alt="">
              <span>{{item.evaluateName}}</span>
              <span class="time">{{formatDate(item.createDate)}}</span>
          </div>
          <div class="text" >
              <p v-if="item.evaluateComment !=''&&item.evaluateComment!=null">{{item.evaluateComment}}</p>
              <p v-if="item.evaluateComment ==''||item.evaluateComment==null">无评价</p>
          </div>
        </div>
      </div>
    </scroller>      
  </div>
</template>

<script>
import { DateFormat } from "../../js/timeUtil.js";
import { Indicator } from "mint-ui";
export default {
  data() {
    return {
      dnoData: "",
      bgCol: "#383838",
      dpages: 0,
      dpageSiz: 100,
      dpageNo: 1,
      devlist: [],
      dcount: 0,
      dmcount:0,
      dbmcount:0,
      unoData: "",
      upages: 0,
      upageSiz: 100,
      upageNo: 1,
      uevlist: [],
      ucount: 0,
      umcount:0,
      ubmcount:0,
      evlist: [],
      showNo: 0,
      toggleattiNo:0,
      count: 0
    };
  },
  methods: {
    formatDate(val) {
      return DateFormat(val, "YYYY-MM-DD HH:mm");
    },
    dinit() {
      Indicator.open();

      let param = {
        "pageSiz": this.dpageSiz,
        "pageNo": this.dpageNo,
        "evaluateType": "D"};

      this.axios
        .post(`${this.api.baseURL}/bsTaskEvaluate/findByDriverh5`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.devlist = res.data.data.evals.records;
            this.count = res.data.data.count;
            this.dcount = res.data.data.dcount;
            this.dmcount = res.data.data.manyidcount;
            this.dbmcount = res.data.data.bumanyidcount;
            this.umcount = res.data.data.manyiucount;
            this.ubmcount = res.data.data.bumanyiucount;
            this.ucount = res.data.data.ucount;
          }
        });
    },
    uinit() {
      Indicator.open();
      let param = {
        "pageSiz": this.upageSiz,
        "pageNo": this.upageNo,
        "evaluateType": "U"};

      this.axios
        .post(`${this.api.baseURL}/bsTaskEvaluate/findByDriverh5`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.uevlist = res.data.data.evals.records;     
            this.evlist = JSON.parse(JSON.stringify(this.uevlist));       
            this.count = res.data.data.count;
            this.dcount = res.data.data.dcount;
            this.dmcount = res.data.data.manyidcount;
            this.dbmcount = res.data.data.bumanyidcount;
            this.umcount = res.data.data.manyiucount;
            this.ubmcount = res.data.data.bumanyiucount;
            this.ucount = res.data.data.ucount;
          }
        });
    },
    refresh() {
      if (this.showNo == 0) {
        this.unoData = "";
        this.uinit();
      }
      if (this.showNo == 1) {
        this.dnoData = "";
        this.dinit();
      }
    },
    infinite(done) {
      if (this.showNo == 0) {
        if (this.unoData) {
          setTimeout(() => {
            this.$refs.myscroller.finishInfinite(2);
          });
          return;
        }
        let self = this;
        setTimeout(() => {
          if (this.upageNo > this.upages) {
            self.unoData = "没有更多数据";
          } else {
            // this.loadTaskList();
          }
          self.$refs.myscroller.resize();
          done();
        }, 1500);
      }
      if (this.showNo == 1) {
        if (this.dnoData) {
          setTimeout(() => {
            this.$refs.myscroller.finishInfinite(2);
          });
          return;
        }
        let self = this;
        setTimeout(() => {
          if (this.dpageNo > this.dpages) {
            self.dnoData = "没有更多数据";
          } else {
            // this.loadTaskList();
          }
          self.$refs.myscroller.resize();
          done();
        }, 1500);
      }
    },
    //角色评价切换
    togglerole(inx) {
      let roles = document.querySelectorAll(".character div");
      let spn = document.querySelectorAll(".character i");
      for (var i = 0; i < roles.length; i++) {
        roles[i].style.fontWeight = "normal";
        spn[i].style.display = "none";
      }
      roles[inx].style.fontWeight = "bold";
      spn[inx].style.display = "block";
      this.showNo = inx;
      if (this.showNo == 0) {
        this.evlist = JSON.parse(JSON.stringify(this.uevlist));
        // this.evlist = this.uevlist;
      }

      if (this.showNo == 1) {
        this.evlist = JSON.parse(JSON.stringify(this.devlist));
      }
    },
    //满意程度切换
    toggleatti(id) {
      let atti = document.querySelectorAll(".evaluate li");
      // console.log(atti)
      for (var i = 0; i < atti.length; i++) {
        atti[i].style.backgroundColor = "#fff";
        atti[i].style.color = "#383838";
      }
      atti[id].style.backgroundColor = "#061128";
      atti[id].style.color = "#fff";
      this.toggleattiNo = id;
    },
    loadmore() {
      if (this.showNo == 0) {
        this.upageNo = this.upageNo + 1;
        Indicator.open();
        Indicator.open();
        
      let param = {
        "pageSiz": this.dpageSiz,
        "pageNo": this.dpageNo,
        "evaluateType": "U"};

        this.axios
          .post(`${this.api.baseURL}/bsTaskEvaluate/findByDriverh5`, param)
          .then(res => {
            Indicator.close();
            if (res.data.success) {
              this.uevlist = this.uevlist.concat(res.data.data.evals.records);
              this.upages = res.data.data.evals.pages;
              this.count = res.data.data.count;
              this.dcount = res.data.data.dcount;
              this.ucount = res.data.data.ucount;
            }
          });
      }
      if (this.showNo == 1) {
        this.dpageNo = this.dpageNo + 1;

        let param = {
          "pageSiz": this.upageSiz,
          "pageNo": this.upageNo,
          "evaluateType": "D"
          };

        this.axios
          .post(`${this.api.baseURL}/bsTaskEvaluate/findByDriverh5`, param)
          .then(res => {
            Indicator.close();
            if (res.data.success) {
              this.devlist = this.devlist.concat(res.data.data.evals.records);
              this.dpages = res.data.data.evals.pages;
              this.count = res.data.data.count;
              this.dcount = res.data.data.dcount;
              this.ucount = res.data.data.ucount;
            }
          });
      }
    }
  },
  created() {
    this.uinit();
    this.dinit();
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

zCl = #383838; // 字体颜色
bodCl = #061128; // 评论线框颜色

.pinglun {
    margin-top:px2rem(20px);
    width: 100%;
    background-color: #fff;

  .warper{
        padding-top: px2rem(600px);
        background-color: #fff;

    // 角色评价
    .character {
        overflow: hidden;
        height: px2rem(88px);
        line-height: px2rem(88px);
        border-bottom:1px solid #ccc;

        div {
            position: relative;
            width: 50%;
            color: zCl;
            font-size: px2rem(30px);
            font-weight: bold;
            text-align: center;

            i {
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                height: px2rem(8px);
                width: 50%;
                background-color: bodCl;
            }
        }

        div:first-child {
            float: left;
        }

        div:last-child {
            float: right;
            font-weight: normal;

            i {
                display: none;
            }
        }
    }

    // 满意程度
    .evaluate {
        padding: 0 px2rem(20px);
        line-height: px2rem(60px);
        margin-top: px2rem(20px);

        ul {
            width: 100%;
            overflow: hidden;
            border: 1px solid bodCl;
            box-sizing: border-box;
            border-radius: px2rem(10px);

            li {
                width: 33.333%;
                float: left;
                text-align: center;
                font-size: px2rem(26px);
                border-right: 1px solid bodCl;
                box-sizing: border-box;
                color: zCl;
            }

            li:last-child {
                border: none;
            }

            li:first-child {
                color: #ffffff;
                background-color: bodCl;
            }
        }
    }

    // 评论详情
    .main {
        width: 100%;
        padding: px2rem(30px) px2rem(20px);
        box-sizing: border-box;
        border-bottom: 1px solid #cccccc;

        .people {
            img {
                width: px2rem(40px);
                height: px2rem(40px);
                line-height :px2rem(40px);
                border-radius: 50%;
            }

            span {
                font-size: px2rem(30px);
                color: zCl;
                margin-left: px2rem(16px);
                vertical-align :middle;
            }

            .time {
              color: #999;
              font-size: px2rem(18px);
          }
        }

        .text {
          padding-top:px2rem(10px);
          font-size: px2rem(24px);
          color: zCl;
        }
    }
  }
}
</style>


