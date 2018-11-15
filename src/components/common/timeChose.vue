<template>
    <mt-datetime-picker
        ref="picker"
        type="datetime"
        month-format="{value}月"
        date-format="{value}日"
        hour-format="{value}时"
        minute-format="{value}分"
        :startDate = "startDate"
        :endDate = "endDate"
        v-model="pickerValue"
        @confirm="choseTime">
    </mt-datetime-picker>
    <!-- type="datetime"是时分秒，data只有日历 -->
</template>

<script>
import Vue from "vue";
import { DatetimePicker } from 'mint-ui';
// 计算时间的方法
import moment from "moment";

export default {
  props: ["showPicker"],
  data () {
    return {
      pickerValue:new Date(),
      startDate: new Date(),      //设置开始时间
      endDate: new Date(),   //设置结束时间
    }
  },
  methods: {
    choseTime(data){
      data = moment(data).format("YYYY-MM-DD HH:mm:ss");
      this.$emit('ievent',data);
    },
    //打开时间选择器
    openPicker() {
    this.$refs.picker.open();
    },
  },
  watch: {
      showPicker(val){
          if(val){
              this.$refs.picker.open();
          }
      }
  },
  mounted () {
    console.log(moment().add(-3, "days"));
    if(this.showPicker){
        this.$refs.picker.open();
    }

    this.startDate = new Date(moment().add(-3, "days"));
    this.endDate = new Date(moment().add(21, "days"));
  },
}

</script>

