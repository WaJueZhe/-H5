import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
    // 控制侧边栏导航
    toggleaside: false,
    // 底部图片的路径
    query: require("../assets/img/footer/foot_query_d.png"),
    my: require("../assets/img/footer/foot_my_d.png"),
    home: require('../assets/img/footer/foot_home_s.png'),
    messageBox: false,
    dropBox: false, //控制下拉弹框
    modifyBox: false, //控制修改货物弹框
    codeShow: false, //控制二维码弹框
    wxopenid: "",
    isdemouser: false,
    showdemobox: false,
    user: {
        opertain: "",
        behavior: "",
        banggu: "",
        handleId: ""
    }, //控制设计页面的渲染
    pcuser: {
        opertain: "",
        behavior: "",
        banggu: "",
        handleId: ""
    },
    cuser: {
        opertain: "",
        behavior: "",
        banggu: "",
        handleId: ""
    },
    stopId: '',
    imgUrl: '',
    photoSrc: '', //拍照上传
    isFirstLogin: false,
    isFirstLoginUser:false,
    pickUpDetail: false, //控制明细的显示隐藏

    driverLogin: true, //司机登录
    ownerLogin: false, //货主登录
    download: false, //下载弹框
    practicalTempData: {
        expHead: {}
    }, //异常数据临时保存

    compileAddressList: [], //常用地址编辑
    compileDriverList:[], // 司机
    compileVehicle:[], // 车辆
    createTask:{
        dirver:{},
        vehicle:{},
        shipmentlist:[]
    },//创建任务单
}

const mutations = {

}

export default new Vuex.Store({
    state,
    mutations
})