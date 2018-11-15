<template>
  <div class="foot">
      <ul>
          <li>
              <router-link to="/task0" @click.native="clk(0)">
                  <div class="home-img"><img :src="$store.state.home" alt=""></div>
                  <p>首页</p>
              </router-link>
          </li>
          <li>
              <router-link to="/check" @click.native="clk(1)">
                  <div class="check-img"><img :src="$store.state.query" alt=""></div>
                  <p>查单</p>
              </router-link>
          </li>
          <li>
              <router-link to="/me" @click.native="clk(2)">
                  <div class="home-img"><img :src="$store.state.my" alt=""></div>
                  <p>我的</p>
              </router-link>
          </li>
      </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    // 点击切换底部图标
    clk(id) {
      if (id == 0) {
        this.$store.state.home = require("../../assets/img/footer/foot_home_s.png");
        this.$store.state.query = require("../../assets/img/footer/foot_query_d.png");
        this.$store.state.my = require("../../assets/img/footer/foot_my_d.png");
      } else if (id == 1) {
        this.$store.state.query = require("../../assets/img/footer/foot_query_s.png");
        this.$store.state.home = require("../../assets/img/footer/foot_home_d.png");
        this.$store.state.my = require("../../assets/img/footer/foot_my_d.png");
      } else {
        this.$store.state.my = require("../../assets/img/footer/foot_mv_s.png");
        this.$store.state.query = require("../../assets/img/footer/foot_query_d.png");
        this.$store.state.home = require("../../assets/img/footer/foot_home_d.png");
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../stylus/mixins.styl';

.foot {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 2;
    height: px2rem(98px);
    width: 100%;
    box-sizing: border-box;
    background-color: #ffffff;
   
    ul {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;

        li {
            flex: 1;
            text-align: center;

            a {
              display:block;
              width: 100%;
              height: 100%;

              .home-img {
                margin:auto;
                width:px2rem(52px);
                height:px2rem(52px);

                > img {
                  width:100%;
                  height:100%;
                }
              }
            }
        }

        li:nth-child(2) {
            a {
                position: absolute;
                top: px2rem(-50px);
                left: 50%;
                transform: translateX(-50%);
                width: px2rem(148px);
                height: px2rem(148px);
                border-radius: 50%;
                background-color: #ffffff;

                .check-img {
                  margin:auto;
                  margin-top: px2rem(20px);
                  width:px2rem(80px);
                  height:px2rem(80px);

                  > img {
                    width:100%;
                    height:100%;
                  }
                }
            }
        }
    }
   }
</style>


