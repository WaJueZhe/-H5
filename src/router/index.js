import Vue from 'vue'
import Router from 'vue-router'

import LoginComponent from '../page/login/login.vue' //登录
import LoginDemoComponet from '../page/login/logindemo.vue' //游客登录

import RegisterComponet from '../page/register/register.vue' //新用户注册

import HomeComponent from '../page/home/home.vue' //首页
import Com from '../page/common/common.vue' //建设中的网站
import LoseCompontent from '../page/common/losepage.vue' //网络请求失败
import News from '../page/home/news.vue' //消息页面
import NewsDeatil from '../page/home/newsDetail.vue' //消息详情页面

import PeisongCompnent from '../page/task/task1.vue'
import YichangComponent from '../page/task/task2.vue'
import TaskComponent from '../page/task/task0.vue'
import Task1DetailComponent from '../page/task/task1Detail.vue'
import Task2DetailComponent from '../page/task/task2Detail.vue'

import CheckCompontent from '../page/check/check.vue' //查单页面
// import SerchCompon from '../page/check/serch.vue'  //查单结果页面
import WatchCompontent from '../page/task/watchDetail' //查看详情
import MeCompontent from '../page/me/me.vue' //我的

import FayunCompontent from '../page/peisong/fayun.vue' //发运页面
import LssueCompontent from '../page/peisong/lssue.vue' //签发页面
import SignCompontent from '../page/peisong/sign.vue' //签收页面
import CargoAffirmCompontent from '../page/peisong/cargoAffirm.vue' //签收页面
import CargoAffirmSendCompontent from '../page/peisong/cargoAffirmSend.vue' //签发明细页面
import ImguploadCompontent from '../page/peisong/imgUpload.vue' //图片上传页面
import UateCompontent from '../page/peisong/uate.vue' //评价
import signSucceedCompontent from '../page/peisong/signSucceed.vue' //签单成功
import ImgUploadPage from '../components/peisong/Photograph.vue' //拍照留证页面


// 侧边栏
import SetUpCompontent from '../page/setUp/set.vue' //设置页面
import OperationCompontent from '../components/setup/operation.vue' //设置页面后的具体操作页面
import CutImgCompontent from '../components/setup/cutImg.vue' //裁切图片页面
import Help from '../page/help/supportCenter.vue' //帮助中心
import IssueDetail from '../page/help/issueDetail.vue' //问题详情
import FamiliarIssue from '../page/help/familiarIssue.vue' //常见问题
import Feedback from '../page/help/feedback.vue' //意见反馈
import DrivingRoute from '../page/map/drivingRoute.vue'


import HistoryCompontent from '../page/history/history.vue' //历史记录
import HistoryDetailCompontent from '../page/history/historyDetail.vue' //历史记录
import WayBillCompontent from '../page/waybill/waybill.vue' //运单管理
import WayAllCompontent from '../page/waybill/wayall.vue' //全部运单
import NotWatCompontent from '../page/waybill/notsign.vue' //未签收
import ToSignCompontent from '../page/waybill/tosign.vue' //已签收

import AbnormalCompontent from '../page/abnormal/abnormal.vue' //异常签收确认
import PracticalCompontent from '../page/practical/practical.vue' //实际收货信息

// import IndicateCompontent from '../page/indicate/indicate.vue' //指导页面

//C端功能
// import C_SignedShipmentList from '../c_page/signedShpList.vue'  //C端收货人 签收运单 查询和列表功能 包含子功能：待签收、已签收、货损货差签收(纠纷)
import OwnerHomeCompontent from '../c_page/receive/ownerHome.vue'
import InquireCompontent from '../c_page/receive/waybill_inquire/inquire.vue'
import ListHomeCompontent from '../c_page/receive/waybill_list/listHome.vue'
import ListCompontent from '../c_page/receive/list/list0.vue'
import historyListCompontent from '../c_page/receive/history_list/historyList.vue'

import UserSettingCompontent from '../c_page/setup/userSetting.vue' //设置页面
import CUserSettingCompontent from '../c_page/setup/cuserSetting.vue' //设置页面
import UserOperation from '../c_page/setup/userOperation.vue'
import CUserOperation from '../c_page/setup/cUserOperation.vue'
import UserCutImage from '../c_page/setup/userCutImg.vue'
import CUserCutImage from '../c_page/setup/cUserCutImg.vue'

//发货
import DlrHomeComponent from '../c_page/deliver/deliverHome.vue'
import DlrInquireComponent from '../c_page/deliver/waybill_inquire/inquire.vue'
import DlrListHomeComponent from '../c_page/deliver/waybill_list/listHome.vue'
import DlrListComponent from '../c_page/deliver/list/list0.vue'
import DlrHistoryListComponent from '../c_page/deliver/history_list/historyList.vue'



//常用地址
import AddressCompontent from '../page/address/address.vue' //常用地址
import AddAddressCompontent from '../page/addAddress/addAddress.vue' //新增地址
import CompileAddressCompontent from '../page/addAddress/compileAddress.vue' //编辑地址
import DriverCompontent from '../page/driver/driver.vue' //司机管理
import AddDriverCompontent from '../page/driver/addDriver.vue' //新增司机
import CompileDriverCompontent from '../page/driver/compileDriver.vue' //编辑司机
import VehicleCompontent from '../page/vehicle/vehicle.vue' //车辆管理
import addVehicleCompontent from '../page/vehicle/addVehicle.vue' //新增车辆
import CompileVehicleCompontent from '../page/vehicle/compileVehicle.vue' //编辑车辆
import CreateTaskCompontent from '../page/createTask/createTask.vue' //创建任务
import AddWaybillCompontent from '../page/createTask/addWaybill.vue' //新增运单
import CreateHistory from '../page/createTask/createHistory.vue' //创建任务列表
import CreateHistoryDetail from '../page/createTask/createHistoryDetail.vue' //创建任务列表





Vue.use(Router)

export default new Router({
    // mode:'history',
    routes: [{
            path: '/',
            name: 'login',
            component: LoginComponent //登录界面
        },
        {
            path: '/logindemo',
            name: 'logindemo',
            component: LoginDemoComponet //演示登录界面
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterComponet //演示登录界面
        },
        {
            path: '/ImgUploadPage',
            name: 'ImgUploadPage',
            component: ImgUploadPage //图片上传页面
        },
        {
            path: '/news',
            name: 'News',
            component: News //消息界面
        },
        {
            path: '/newsDetail/:id',
            name: 'newsDetail',
            component: NewsDeatil //消息详情页面
        },
        {
            path: '/drivingRoute/:p1/:p2',
            name: 'drivingRoute',
            component: DrivingRoute //地图导航规划
        },
        {
            path: '/com',
            name: 'Com',
            component: Com //网站正在建设中
        },
        {
            path: '/home',
            name: 'home',
            component: HomeComponent, //主页
            children: [{
                    path: '/task1',
                    name: 'task1',
                    component: PeisongCompnent //配送中
                },
                {
                    path: '/task2',
                    name: 'task2',
                    component: YichangComponent //异常单
                }, {
                    path: '/task0',
                    name: 'task0',
                    component: TaskComponent //新任务
                }, {
                    path: '/loser',
                    name: 'loser',
                    component: LoseCompontent //网络请求失败
                }
            ]
        },
        {
            path: '/check',
            name: 'check',
            component: CheckCompontent
        },
        {
            path: '/me',
            name: 'me',
            component: MeCompontent //我的
        },
        {
            path: '/fayun',
            name: 'fayun',
            component: FayunCompontent //签发
        },
        {
            path: '/lssue',
            name: 'lssue',
            component: LssueCompontent //签发
        },
        {
            path: '/sign',
            name: 'sign',
            component: SignCompontent //签收
        },
        {
            path: '/cargoAffirm/:shpId/:stopId/:address',
            name: 'cargoAffirm',
            component: CargoAffirmCompontent //到货确认
        },
        {
            path: '/cargoAffirmSend/:shpId/:stopId',
            name: 'cargoAffirmSend',
            component: CargoAffirmSendCompontent //到货确认
        },
        {
            path: '/imgupload',
            name: 'imgupload',
            component: ImguploadCompontent //签收
        },
        {
            path: '/uate/:stopId/:driverId/:driverName/:vehicleNo',
            name: 'uate',
            component: UateCompontent
        },
        {
            path: '/signSucceed',
            name: 'signSucceed',
            component: signSucceedCompontent
        },
        {
            path: '/setup',
            name: 'setup',
            component: SetUpCompontent //设置
        },
        {
            path: '/address',
            name: 'address',
            component: AddressCompontent //常用地址
        },
        {
            path: '/addAddress',
            name: 'addAddress',
            component: AddAddressCompontent //新增地址
        },
        {
            path: '/compileAddress',
            name: 'compileAddress',
            component: CompileAddressCompontent //编辑地址
        },
        {
            path: '/driver/:inWay',
            name: 'driver',
            component: DriverCompontent //司机管理
        },
        {
            path: '/addDriver',
            name: 'addDriver',
            component: AddDriverCompontent //新增司机
        },
        {
            path: '/compileDriver',
            name: 'compileDriver',
            component: CompileDriverCompontent //编辑司机
        },
        {
            path: '/vehicle/:inWay',
            name: 'vehicle',
            component: VehicleCompontent //车辆管理
        },
        {
            path: '/addvehicle',
            name: 'addVehicle',
            component: addVehicleCompontent //新增车辆
        },
        {
            path: '/compileVehicle',
            name: 'compileVehicle',
            component: CompileVehicleCompontent //编辑车辆
        },
        {
            path: '/createTask',
            name: 'createTask',
            component: CreateTaskCompontent //创建任务
        },
        {
            path: '/addWaybill',
            name: 'addWaybill',
            component: AddWaybillCompontent //创建任务
        },
        {
          path: '/createHistory',
          name: 'createHistory',
          component: CreateHistory //创建任务列表
        },
        {
          path: '/createHistoryDetail',
          name: 'createHistoryDetail',
          component: CreateHistoryDetail //创建任务明细
        },
        {
            path: '/help',
            name: 'help',
            component: Help //帮助中心
        },
        {
            path: '/issueDetail/:category',
            name: 'issueDetail',
            component: IssueDetail //问题详情
        },
        {
            path: '/familiarIssue/:id',
            name: 'familiarIssue',
            component: FamiliarIssue //常见问题
        },
        {
            path: '/feedback',
            name: 'feedback',
            component: Feedback //常见问题
        },
        {
            path: '/history',
            name: 'history',
            component: HistoryCompontent //历史任务
        },
        {
            path: '/historyDetail',
            name: 'historyDetail',
            component: HistoryDetailCompontent //历史任务
        },
        // {
        //   path: '/indicate',
        //   name: 'indicate',
        //   component: IndicateCompontent//指导页面
        // },
        {
            path: '/waybill',
            name: 'waybill',
            component: WayBillCompontent, //运单管理
            children: [{
                path: '/wayall',
                name: 'wayall',
                component: WayAllCompontent
            }, {
                path: '/waynot',
                name: 'waynot',
                component: NotWatCompontent //未签收
            }, {
                path: '/wayyes',
                name: 'wayyes',
                component: ToSignCompontent //已签收
            }]
        },

        {
            path: '/watchDetail/:taskid',
            name: 'watchDetail',
            component: WatchCompontent
        },
        {
            path: '/task1Detail/:taskid',
            name: 'task1Detail',
            component: Task1DetailComponent //待接收详情页面
        },
        {
            path: '/task2Detail/:taskid',
            name: 'task2Detail',
            component: Task2DetailComponent //配送中详情页面
        },
        {
            path: '/setOperation',
            name: 'setOperation',
            component: OperationCompontent //设置用户的具体操作页面
        },
        {
            path: '/cutImg',
            name: 'cutImg',
            component: CutImgCompontent
        },
        {
            path: '/abnormal/:stopId',
            name: 'abnormal',
            component: AbnormalCompontent
        },
        {
            path: '/practical/:isDriverConf/:stopId/:address',
            name: 'practical',
            component: PracticalCompontent
        },
        {
            path: '/c_page/receive/ownerHome',
            name: 'ownerHome',
            component: OwnerHomeCompontent, //C端 收货人 签收列表和查询
        },
        {
            path: '/waybill_inquire/inquire',
            name: 'inquire',
            component: InquireCompontent
        },
        {
            path: '/waybill_list/listHome/:externalPara',
            name: 'c_sign_listHome',
            component: ListHomeCompontent,
        },
        {
            path: '/list/list0',
            name: 'list0',
            component: ListCompontent,
        },
        {
            path: '/history_list/historyList',
            name: 'historyList',
            component: historyListCompontent,
        },
        {
            path: '/c_page/usersetting',
            name: 'usersetting',
            component: UserSettingCompontent,
        },
        {
            path: '/c_page/userOperation',
            name: 'userOperation',
            component: UserOperation,
        },
        {
            path: '/c_page/userCutImage',
            name: 'userCutImage',
            component: UserCutImage,
        },
        {
            path: '/c_page/cusersetting',
            name: 'cusersetting',
            component: CUserSettingCompontent,
        }, ,
        {
            path: '/c_page/cuserOperation',
            name: 'cuserOperation',
            component: CUserOperation,
        },
        {
            path: '/c_page/cuserCutImage',
            name: 'cuserCutImage',
            component: CUserCutImage,
        },
        {
            path: '/c_page/deliver/deliverHome',
            name: 'dlrHome',
            component: DlrHomeComponent, //C端 收货人 签收列表和查询
        },
        {
            path: '/c_page/deliver/inquire',
            name: 'dlrInquire',
            component: DlrInquireComponent,
        },
        {
            path: '/c_page/deliver/listHome/:externalPara',
            name: 'dlrListHome',
            component: DlrListHomeComponent,
        },
        {
            path: '/c_page/deliver/list0',
            name: 'dlrList0',
            component: DlrListComponent,
        },
        {
            path: '/c_page/deliver/historyList',
            name: 'dlrHistoryList',
            component: DlrHistoryListComponent,
        }

    ]
})