<template>
  <div class="radio-wrappe">
    <label v-for="(item, index) in dataList" :key="index" class="radio" :class="{ 'radio-checked': currentValue == item.value }">
      <span class="radio-inner"></span>
      <input type="radio" :checked="currentValue == item.value" @change="change(item)" class="radio-input">
      <span class="sta">{{ item.name }}</span>
    </label>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'radio',
  props: {
    value: {},
    dataList: {
      type: Array,
    },
  },
  data () {
    return {
      currentValue: this.value,
    };
  },
  mounted () {
  },
  computed: {
  },
  watch: {
    currentValue (val) {
      this.value = val;
    },
    value (val) {
      this.currentValue = val;
    },
  },
  components: {

  },
  methods: {
    change (item) {
      this.currentValue = item.value;
      this.$emit('input', item.value);
    }

  }
};
</script>
<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

.radio-wrappe {
  display: inline-block;
  cursor: pointer;

  .radio {
    position: relative;
    display: inline-block;
    margin-right:px2rem(20px);
    line-height: 1;
    vertical-align: middle;
    white-space: nowrap;
    cursor: pointer;

    &:last-child {
      margin-right: 0;
    }

    &.radio-checked {
      .radio-inner {
        border-color: #2d8cf0;
        background-color: #2d8cf0;

        &:after {
          transform: rotate(45deg) scale(1);
        }
      }
    }

    .radio-inner {
      display: inline-block;
      position: relative;
      width: px2rem(40px);
      height: px2rem(40px);
      border: 1px solid #dddee1;
      border-radius: 50%;
      background-color: #fff;
      vertical-align: middle;
      transition: all .2s ease-in-out;

      &:after {
        position: absolute;
        display: table;
        top: px2rem(6px);
        left: 0;
        right: 0;
        margin: 0 auto;
        width: px2rem(8px);
        height: px2rem(16px);
        border: 2px solid #fff;
        border-top: 0;
        border-left: 0;
        content: '';
        transform: rotate(45deg) scale(0);
        transition: all .2s ease-in-out;
      }
    }

    .sta {
      color: #333;
      vertical-align: middle;
    }

    .radio-input {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      cursor: pointer;
      opacity: 0;
    }
  }

}
</style>
