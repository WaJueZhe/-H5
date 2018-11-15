<template>
  <div class="content">
    <div class="header">
      <i class="iconfont icon-back" @click="$router.go(-1)"></i>
      <span>{{taskTitle}}</span>
    </div>
    <div class="content">
      <p>详细地址:{{point2.adr}}</p>
    </div>
    <div class="baidumap">
      <div id="allmap" class="map" style="position:fixed"></div>
    </div>

  </div>
</template>


<script>
import BMap from "BMap"; //引用baiduMap相关的API
export default {
  data() {
    return {
      taskTitle: "线路规划",
      point1: {
        x: "",
        y: ""
      },
      point2: {
        x: "",
        y: "4",
        adr: ""
      },
      waypoints: []
    };
  },
  methods: {
    init() {
      this.point1 = this.$route.params.p1;
      this.point2 = this.$route.params.p2;
      let p1 = this.bd_encrypt(this.point1.x,this.point1.y);
      let p2 = this.bd_encrypt(this.point2.x,this.point2.y);
      this.point1.x=p1.bd_lon;
      this.point1.y=p1.bd_lat;
      this.point2.x=p2.bd_lon;
      this.point2.y=p2.bd_lat;
      //   this.waypoints[] = this.$route.params.wp;
    },
    bd_encrypt(gg_lon, gg_lat) {
      var X_PI = Math.PI * 3000.0 / 180.0;
      var x = gg_lon,
        y = gg_lat;
      var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
      var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
      var bd_lon = z * Math.cos(theta) + 0.0065;
      var bd_lat = z * Math.sin(theta) + 0.006;
      return {
        bd_lat: bd_lat,
        bd_lon: bd_lon
      };
    }
  },
  mounted() {
    this.init();
    var _this = this;
    console.log(this.point1);
    console.log(this.point2);
    // 百度地图API功能
    var map = new BMap.Map("allmap"); // 创建Map实例
    map.centerAndZoom(new BMap.Point(this.point1.x, this.point1.y), 11); // 初始化地图,设置中心点坐标和地图级别
    //添加地图类型控件
    map.addControl(
      new BMap.MapTypeControl({
        mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP]
      })
    );
    map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放

    var p1 = new BMap.Point(this.point1.x, this.point1.y);
    var p2 = new BMap.Point(this.point2.x, this.point2.y);

    var marker = new BMap.Marker(p2); // 创建标注
    map.addOverlay(marker); // 将标注添加到地图中
    var label = new BMap.Label(this.point2.adr, {
      offset: new BMap.Size(20, -10)
    });
    marker.setLabel(label);

    var driving = new BMap.DrivingRoute(map, {
      renderOptions: { map: map, autoViewport: true }
    });
    // driving.search(p1, p2, {
    //   waypoints: ["北京科技大学", "北京国际会议中心"]
    // }); //waypoints表示途经点

    driving.search(p1, p2); //waypoints表示途
  }
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

.content {
  width: 100%;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  background-color: #061128;
  height: px2rem(80px);
  line-height: px2rem(80px);
  color: #ffffff;
  text-align: center;
  font-size: px2rem(30px);

  i {
    float: left;
  }
}

.content {
  position: fixed;
  top: px2rem(80px);
  left: 0;
  padding-left: px2rem(20px);
  z-index: 2;
  background-color: #fff;
  color: #000;
  height: px2rem(60px);
  line-height: px2rem(60px);
  border-bottom: 1px solid #cccccc;
}

.baidumap {
  position: fixed;
  top: px2rem(140px);
  left: 0;
  width: 100%;
  height: 100%;

  .map {
    width: 100%;
    height: 100%;
  }
}
</style>