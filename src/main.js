import Vue from 'vue'
import App from './App'
import router from './router'

//引入第三方包
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css';
import './css/reset.css';
import axios from 'axios';

//引入lib-flexible进行屏幕适配
import './js/flexible' //字体适配
import "./components/stylus/mixins.styl";

//引用字体图标文件
import './css/icon/iconfont.css'
import './css/icon1/iconfont.css'
import './css/icon2/iconfont.css'
import './css/icon-css/iconfont.css'
import './css/icon-css/iconfont.js'
import './css/animate.css'
//手写签名插件
import vueSignature from "vue-signature"
//动态生成二维码控件
import VueQArt from 'vue-qart'

//引入自己封装的组件,或第三方插件
import common from './components/common/common.js'
import store from './vuex/store.js'
import apiConfig from './js/apiConfig.js'
import arrayUtil from './js/arrayUtil.js'

//下拉刷新上拉加载
import VueScroller from 'vue-scroller'

//引入图片裁切插件
import VueCropper from 'vue-cropper'
import Croppa from 'vue-croppa'

import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'swiper/dist/css/swiper.css'

import 'babel-polyfill'

Vue.use(VueAwesomeSwiper)

//引入cookie的操作方法
import {
    getCookie,
    setCookie
} from "./js/cookie.js";

//引入websocket操作
import './js/websocket.js'
import stompClient from './js/websocket.js'

//  在拦截器中添加tokenid
axios.interceptors.request.use(
    config => {
        // 这里写死一个token，然后在这里从cookie中获取到token的值
        var token = getCookie('tokenid');
        if (token) {
            // 这里将token设置到headers中，header的key是Authorization，这个key值根据你的需要进行修改即可
            config.headers.tokenId = token;
            setCookie("tokenid", token, 7*24*60*60*1000);

        }
        return config
    },
    error => {
        console.log(error);
        return Promise.reject(error)
    });

import { Indicator } from "mint-ui";

//返回拦截器
axios.interceptors.response.use((response) => {
  const data = response.data
  // token 已过期，重定向到登录页面 
  if (data.code == '443' || data.code == '444') {
    window.location.href = apiConfig.baseURL+"/wx/wx_mpredirect?reurl=wx_oauth";
    return;
  }
  
  return response;
}, function (error) {
  // Do something with response error  
  return Promise.reject(error);
});


//手动启用插件
Vue.use(Mint);
Vue.use(common);
Vue.use(vueSignature);
Vue.use(VueScroller);
Vue.use(Croppa) //手动启用图片裁切功能
Vue.use(arrayUtil)


//解决移动端点击300ms延迟
import FastClick from 'fastclick';
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.config.productionTip = false

//扩展实例成员
Vue.prototype.axios = axios;
Vue.prototype.api = apiConfig; //请求地址的配置
Vue.prototype.stompClient = stompClient; //websocket客户端


//解決axios的兼容性問題
// import 'babel-polyfill'
// require('es6-promise').polyfill()

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App,
        VueQArt
    }
})