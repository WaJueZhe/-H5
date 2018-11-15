//编写自己的公共组件库
import HeaderCompontent from './header.vue'
import LoginCompontent from './loginHeader.vue'
import FooterCompontent from './footer.vue'
import AsideCompontent from './aside.vue'
import CommonHeader from './commonHeader.vue'
import CommonalityHeader from '../c_componments/commonalityHeader.vue'
import VueBarcode from '@xkeshi/vue-barcode' //引入生成一形码的插件
import TimeChose from './timeChose.vue'


export default {
  install(Vue) {
    Vue.component('app-header', HeaderCompontent),
      Vue.component('app-login', LoginCompontent),
      Vue.component('app-footer', FooterCompontent),
      Vue.component('app-aside', AsideCompontent),
      Vue.component('app-comhed', CommonHeader),
      Vue.component('barcode', VueBarcode),
      Vue.component('commonalityHeader', CommonalityHeader),
      Vue.component('timeChose', TimeChose)
  }
};
