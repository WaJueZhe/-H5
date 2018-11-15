<template>
<scroller ref="myscroller" :on-refresh="refresh" :on-infinite="infinite" :loadingLayerColor="bgCol">
  <div class="content">
      <way-card v-for="(item,indexNo) in list" :key="indexNo" :item="item"></way-card>
  </div>
</scroller>
</template>

<script>
import WayAll from "../../components/waybill/card.vue";
import { InfiniteScroll } from "mint-ui";
import { Indicator } from "mint-ui";
import Vue from "vue";
Vue.use(InfiniteScroll);
export default {
  data() {
    return {
      noData: "",
      bgCol: "#383838",
      list: [],
      pageNo: "",
      pages: 0,
      pageSize: 10
    };
  },
  methods: {
    init() {
      this.pageNo = 1;
      this.list = [];
      this.noData = "";
     let param = {"pageNo": this.pageNo, "pageSize": this.pageSize, "status": "1"};
      this.axios
        .post(`${this.api.baseURL}/shipment/findShipmentByDriverIdh5`, param)
        .then(res => {
          if (res.data.success) {
            this.list = this.list.concat(res.data.data.shipments.records);
            this.pages = res.data.data.shipments.pages;
          }
        });
    },
    loadmore() {
      this.pageNo = this.pageNo + 1;
      Indicator.open();
     let param = {"pageNo": this.pageNo, "pageSize": this.pageSize, "status": "1"};
      this.axios
        .post(`${this.api.baseURL}/shipment/findShipmentByDriverIdh5`, param)
        .then(res => {
          Indicator.close();
          if (res.data.success) {
            this.list = this.list.concat(res.data.data.shipments.records);
            this.pages = res.data.data.shipments.pages;
          }
        });
    },
    /** 
     * 上拉刷新
    */
    refresh(done) {
      let self = this;
      setTimeout(() => {
        self.loadmore();
        done();
      }, 1500);
    },
    /** 
     * 下来刷新
    */
    infinite(done) {
      if (this.noData) {
        setTimeout(() => {
          this.$refs.myscroller.finishInfinite(2);
        });
        return;
      }
      let self = this;
      setTimeout(() => {
        if (this.pageNo >= this.pages) {
          self.noData = "没有更多数据";
        } else {
          this.loadmore();
        }
        self.$refs.myscroller.resize();
        done();
      }, 1500);
    }
  },
  created() {
    this.init();
  },
  components: {
    "way-card": WayAll
  }
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.content {
  padding: 0 px2rem(20px);
  padding-top: px2rem(150px);
}
</style>


