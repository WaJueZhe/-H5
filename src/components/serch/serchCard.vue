<template>
  <div class="card">
    <div class="titlt">
        <div class="til">任务编号:{{detail.taskNo}}</div>
        <div class="adress">
            <span v-show="(detail.status == '0')">未接单</span> 
            <span v-show="(detail.status == '1')">已接单</span> 
            <span v-show="(detail.status == '2')">执行中</span> 
            <span v-show="(detail.status == '10')">已完成</span> 
            <span v-show="(detail.status == '99')">已取消</span> 
            <span v-show="(detail.status == '98')">已拒绝</span> 
        </div>
    </div>
    <div class="xing">
        <div class="left">
            <ul>
                <li>
                    <i class="iconfont icon-yundan"></i>
                    <span>站点数量:<strong>{{detail.stopCount}}</strong></span>
                </li>
                <li>
                    <i class="iconfont icon-shijian"></i>
                    <span>任务开始时间:<strong>{{detail.deliverPlanDate}}</strong></span>
                </li>
                <li>
                    <i class="iconfont icon-weizhi"></i>
                    <span>大约行驶：<strong>{{detail.totalDistance}}{{detail.distanceUnit}}</strong></span>
                </li>
            </ul>
            <ul>
                <li>{{detail.totalUnits}}{{detail.unitUnit}}货物</li>
                <li>{{detail.totalVolume}}{{detail.volumeUnit}}</li>
                <li>{{detail.totalWeight}}{{detail.weightUnit}}</li>
            </ul>
        </div>
    </div>
    <!-- 新任务 -->
    <router-link v-show="(detail.status == '0')" :to="{ name: 'watchDetail', params:{taskid: detail.id }}" class="chakan">
        <i></i>
        <span>查看详情</span>
        <i class="iconfont icon-jiantou"></i>
    </router-link>
    <!-- 配送中 -->
    <router-link v-show="(detail.status == '1' || detail.status == '2')" :to="{ name: 'task1Detail', params:{taskid: detail.id }}" class="chakan">
        <i></i>
        <span>查看详情</span>
        <i class="iconfont icon-jiantou"></i>
    </router-link>
    <!-- 历史运单 -->
    <router-link v-show="(detail.status == '10')" :to="{ name: 'historyDetail', params:{taskid: detail.id }}" class="chakan">
        <i></i>
        <span>查看详情</span>
        <i class="iconfont icon-jiantou"></i>
    </router-link>
  </div>
</template>

<script>
export default {
  props: ["detail"],
  created() {
  }
};
</script>

<style lang="stylus" scoped>
@import '../../components/stylus/mixins.styl';

// 卡片视图
bg-col = #343d50; // 背景色
col = #383838; // 字体颜色

.card {
    border-radius: px2rem(20px);
    overflow: hidden;
    box-shadow: px2rem(0px) px2rem(1px) px2rem(1px) #ccc;
    background-color: #ffffff;

    // 卡片标题
    .titlt {
        width: 100%;
        box-sizing: border-box;
        padding: 0 px2rem(20px);
        height: px2rem(70px);
        line-height: px2rem(70px);
        background-color: bg-col;
        overflow: hidden;

        .til {
            float: left;
            font-size: px2rem(30px);
            color: #ffffff;
        }

        .adress {
            float: right;
            color: #ffffff;
            font-size: px2rem(26px);

            span:first-child {
                img {
                    vertical-align: middle;
                }
            }

            span:last-child {
                vertical-align: middle;
            }
        }
    }

    // 卡片内容区域
    .xing {
        padding: 0 px2rem(20px);
        overflow: hidden;
        width: 100%;

        .left {
            float: left;

            ul:first-child {
                li {
                    color: col;
                    margin-top: px2rem(20px);
                    font-size: px2rem(30px);

                    span {
                        margin-left: px2rem(20px);
                    }
                }
            }

            ul:last-child {
                margin-top: px2rem(20px);
                padding-left: px2rem(50px);

                li {
                    display: inline-block;
                    border: 1px solid #999ea7;
                    padding: px2rem(2px);
                    border-radius: px2rem(6px);
                }
            }
        }

        .right {
            float: right;

            a {
                display: inline-block;
                width: px2rem(140);
                height: px2rem(140);
                line-height: px2rem(140);
                border-radius: 50%;
                text-align: center;
                background-color: #2166ff;
                color: #ffffff;
                font-size: px2rem(40px);
                font-weight: 500;
                margin-right: px2rem(74px);
                margin-top: 50%;
                transform: translateY(-50%);
            }
        }
    }

    .barcode {
        margin-bottom: px2rem(10px);
        width: 100%;
        height: px2rem(80px);
        padding: 0 px2rem(20px);
        box-sizing: border-box;

        .bar {
            width: 100%;
            height: 100%;
        }
    }

    // 查看详情
    .chakan {
        position: relative;
        display: inline-block;
        height: px2rem(70px);
        line-height: px2rem(70px);
        box-sizing: border-box;
        padding: 0 px2rem(20px);
        width: 100%;

        i:first-child {
            position: absolute;
            top: 0;
            left: px2rem(20px);
            width: px2rem(670px);
            height: 1px;
            background-color: #dedede;
        }

        span:nth-child(2) {
            font-size: px2rem(30px);
            float: left;
        }

        i:last-child {
            float: right;
            font-size: px2rem(30px);
        }
    }
}
</style>


