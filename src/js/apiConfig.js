// const baseurl  = 'https://www.bcscm.net/etc';    //正式环境
// const socketurl = 'https://www.bcscm.net/chatApp';  //正式环境
// const resourceurl = 'https://www.bcscm.net/resource/';    //正式环境
// const h5url ='https://www.bcscm.net/v1/#/';      //正式环境

const baseurl = 'https://test.bcscm.net/etc'; //测试环境
// const baseurl = 'http://10.1.23.253:8089/etc'; //测试环境
// const h5url ='https://test.bcscm.net/v1/#/';      //测试环境
const socketurl = 'https://test.bcscm.net/chatApp'; //测试环境
const resourceurl = 'https://test.bcscm.net/resource/'; //测试环境

// const baseurl = 'http://localhost:8089/etc'       //本地
const h5url = 'http://localhost:8080/#/'; //本地

const loginUsageDocUrl = 'https://www.bcscm.net/templatedownload/usageAgreement.html';
const loginPrivacyDocUrl = 'https://www.bcscm.net/templatedownload/privacyProtection.html';

export default {
    baseURL: baseurl,
    socketurl: socketurl,
    resourceurl: resourceurl,
    h5url: h5url,
    loginUsageDocUrl: loginUsageDocUrl,
    loginPrivacyDocUrl: loginPrivacyDocUrl,

    getloginVcode: `${baseurl}/userAuth/loginPhoneSendCheckCodeh5`, //获取登录验证码

    loginByPhone: `${baseurl}/userAuth/loginPhoneInsureCheckCodeh5`, //使用验证码登录

    loginByWeixin: `${baseurl}/userAuth/loginByWeixinh5`, //通过微信OpenId登录

    loadTaskList: `${baseurl}/task/findTaskByDriver`, //获取任务单列表

    confirmTask: `${baseurl}/task/confirmTask`, //司机接单

    refuseTask: `${baseurl}/task/refuseTask`, //司机拒绝任务

    // bloadStopList:`${baseurl}/taskStop/findbTaskStopByTaskIdFor`,                //获取站点列表

    loadStopList: `${baseurl}/taskStop/findTaskStopByTaskId`, //获取站点列表

    findTaskStopCardInfo: `${baseurl}/taskStop/sign/findTaskStopCardInfo`, //站点签发或签收卡片

    signSendMsmCode: `${baseurl}/taskStop/sign/signSendsms`, //签发短信发送

    stopBegin: `${baseurl}/taskStop/stopBeginh5`, //站点发运

    signSend: `${baseurl}/taskStop/sign/signSendh5`, //站点签发

    signGet: `${baseurl}/taskStop/sign/signArrivedh5`, //站点签收

    stopEnd: `${baseurl}/taskStop/stopEndh5`, //站点发运


    // 登录接口
    getlogin: `${baseurl}/userAuth/loginUserByUserCode`, //该接口需要两个参数

    getWxSignature: `${baseurl}/wx/wx_getSignatureh5`, //获取微信签名信息

    // baiduApi:`http://api.map.baidu.com/geoconv/v1/`,                 //百度经纬度转换

    // baiduAK:"tWz7NEsSQmkWvDQsBgQyfVBsQm6vYGAm"

}