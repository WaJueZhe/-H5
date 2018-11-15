<template>
<div class="evaStar">
    <ul class="star">
        <li v-for="(itemClass,index) in itemClasses" :key="index" :class="itemClass" class="star-item" @click="stars(index)" track-by="index"></li><!--性能优化 track-by 数据不改变时不会重新渲染-->
    </ul>
</div>
</template>
 

<script type="text/ecmascript-6">
const LENGTH = 5;
const CLS_ON = "on";
const CLS_HALF = "half";
const CLS_OFF = "off";

export default {
  data() {
    return {
      score: 0
    };
  },
  computed: {
    //计算属性
    itemClasses() {
      let result = []; // 返回的是一个数组,用来遍历输出星星
      let score = Math.floor(this.score * 2) / 2; // 计算所有星星的数量
      let hasDecimal = score % 1 !== 0; // 非整数星星判断
      let integer = Math.floor(score); // 整数星星判断
      for (let i = 0; i < integer; i++) {
        // 整数星星使用on
        result.push("on"); // 一个整数星星就push一个CLS_ON到数组
      }
      if (hasDecimal) {
        // 非整数星星使用half
        result.push("half"); // 类似
      }
      while (result.length < 5) {
        // 余下的用无星星补全,使用off
        result.push("off");
      }
      return result;
    }
  },
  methods: {
    stars: function(index) {
      this.score = index + 1;
      this.$emit('ievent',this.score);
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

// .evaStar {
//   // height: px2rem(160px);
// }

.star {
  font-size: 0;
}

.star-item {
  display: inline-block;
  background-repeat: no-repeat;
  width: px2rem(50px);
  height: px2rem(50px);
  margin-right: px2rem(20px);
  background-size: 100%;
}

.star-item.on {
  background-image: url('../../assets/img/icn_star_s.png');
}

.star-item.half {
  background-image: url('../../assets/img/icn_star_s.png');
}

.star-item.off {
  background-image: url('../../assets/img/icn_star_d.png');
}
</style>
