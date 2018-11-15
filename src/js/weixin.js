import Vue from "vue";
import apiConfig  from './apiConfig.js';
import axios from 'axios';
import wx from 'weixin-js-sdk'


//配置微信
function wxconfig(appid,timestamp,noncestr,signature){
	wx.config({
		debug: false,
		appId: appid,
		timestamp: timestamp,
		nonceStr: noncestr,
		signature: signature,
		// 所有要调用的 API 都要加到这个列表中
		jsApiList: [
			'checkJsApi',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'hideMenuItems',
			'showMenuItems',
			'hideAllNonBaseMenuItem',
			'showAllNonBaseMenuItem',
			'translateVoice',
			'startRecord',
			'stopRecord',
			'onRecordEnd',
			'playVoice',
			'pauseVoice',
			'stopVoice',
			'uploadVoice',
			'downloadVoice',
			'chooseImage',
			'previewImage',
			'uploadImage',
			'downloadImage',
			'getNetworkType',
			'openLocation',
			'getLocation',
			'hideOptionMenu',
			'showOptionMenu',
			'closeWindow',
			'scanQRCode',
			'chooseWXPay',
			'openProductSpecificView',
			'addCard',
			'chooseCard',
			'openCard'
		]
	});
}


//请求微信配置信息
function http(url){
	let param = {
		"url": url
	};

	axios.post(`${apiConfig.getWxSignature}`,param)
	.then(res=>{
		if(res.data.success) {
			var resultData = res.data.data;
			// 调用配置微信的方法
			wxconfig(resultData.appid,resultData.timestamp,resultData.noncestr,resultData.signature);
        } else {
			return false;
        }
	})
}

export function wx_init(url) {
	// 配置微信
	http(url);
}
