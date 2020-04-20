import $http from './request'

/*var qs = require('qs');
fly.post('/foo', qs.stringify({ 'bar': 123 }));*/
export function JsontoForm(params) {
	let str = [];
	for (let key in params) {
		str.push(key + "=" + params[key])
	}
	return str.join('&');

}

export function getmsglist() {
	return $http.get({
		url: '/content/announcement/get'
	})
}

export function getbannerlist() {
	return $http.get({
		url: '/content/carousel/get'
	})
}

export function getbaikelist(data) {
	let params = JsontoForm(data);
	return $http.get({
		url: '/content/xiaochengxu/baike?' + params,

	})
}

export function getjiankanglist(data) {
	let params = JsontoForm(data);
	return $http.get({
		url: '/content/xiaochengxu/food?' + params,
	})
}

export function getbaike(id) {
	return $http.get({
		url: '/content/article/baike/get/' + id,

	})
}

export function getjiankang(id) {
	return $http.get({
		url: '/content/article/food/get/' + id,
	})
}

export function getwechatlist(data) {
	let params = JsontoForm(data);
	return $http.get({
		url: '/content/wechat_zoom/get?' + params,
	})
}

export function getOpenId(code) {
	return $http.get({
		url: '/api/firm/token/wechat/getOpenId?code=' + code,
	})
}

export function getMember(open_id) {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url: '/api/firm/member/index?open_id=' + open_id + '&login_code=' + login_code,
	})
}

export function addMember(param) {
	let login_code = wx.getStorageSync('login_code');
	return $http.post({
		url: '/api/firm/member/add/one?login_code=' + login_code,
		data: param
	})
}

export function getMemberAddr(memberId) {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url: '/api/firm/member_address/get/' + memberId + '?login_code=' + login_code,
	})
}

export function addAddress(param) {
	let login_code = wx.getStorageSync('login_code');
	return $http.post({
		url: '/api/firm/member_address/add/one?login_code=' + login_code,
		data: param
	})
}

export function editAddress(param, id) {
	let login_code = wx.getStorageSync('login_code');
	return $http.post({
		url: '/api/firm/member_address/update/one/' + id + '?login_code=' + login_code,
		data: param
	})
}

export function delAddress(id) {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url: '/api/firm/member_address/delete/one/' + id + '?login_code=' + login_code,
	})
}

export function sendVerifyCode(cellphone) {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url: '/api/firm/member/getVerificationCode?cellphone=' + cellphone + '&login_code=' + login_code,
	})
}

export function setMemberPhone(param, memberId) {
	let login_code = wx.getStorageSync('login_code');
	return $http.post({
		url: '/api/firm/member/update/phone/' + memberId + '?login_code=' + login_code,
		data: param
	})
}

export function setMemberPayPassword(param, memberId) {
	let login_code = wx.getStorageSync('login_code');
	return $http.post({
		url: '/api/firm/member/update/payPassword/' + memberId + '?login_code=' + login_code,
		data: param
	})
}

export function getRechargeAmount() {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url: '/api/firm/member/getRechargeAmount?login_code=' + login_code,
	})
}

export function prepareOrderRecharge(param) {
	let login_code = wx.getStorageSync('login_code');
	return $http.post({
		url: '/api/firm/payment/weixin/prepareOrder/recharge?login_code=' + login_code,
		data: param
	})
}

export function getAccountChangeRecord(memberId, page) {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url: '/api/firm/account_change_record/index?member_id=' + memberId + '&page=' + page + '&login_code=' + login_code,
	})
}

export function getMemberInfoById(memberId) {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url: '/api/firm/member/show/' + memberId + '?login_code=' + login_code,
	})
}
/* 获取商品分类 */
export function getcategory(data) {
	let login_code = wx.getStorageSync('login_code');
	data.login_code = login_code;
	let params = JsontoForm(data);
	return $http.get({
		url: '/api/firm/category/index?' + params
	})
}
/* 获取优惠券 */
export function getcoupon(minAmount, memberId) {
	let login_code = wx.getStorageSync('login_code');
	console.log(memberId)
	return $http.get({
		url: '/api/firm/member_coupon/get/' + memberId + '?login_code=' + login_code + '&minAmount=' + minAmount,
	})
}
export function getgoods(data) {
	let login_code = wx.getStorageSync('login_code');
	data.login_code = login_code;
	let params = JsontoForm(data);
	return $http.get({
		url: '/api/firm/product/index?' + params
		// url: '/api/firm/goods/index?' + params
	})
}
/* 获取团购 */
export function gettggoods(data) {
	let login_code = wx.getStorageSync('login_code');
	data.login_code = login_code;
	let params = JsontoForm(data);
	return $http.get({
		url: '/api/firm/goods/index?' + params
	})
}
/* 计算订单 */
export function calcOrder(param) {

	let login_code = wx.getStorageSync('login_code');
	param.login_code = login_code;
	// console.log(1223445555);
	// let formData = new FormData()
	// 
	// for(var key in param){
	// 	formdata.append(key,param[key])
	// }
	// console.log(1223445555);
	return $http.post({
		url: '/api/firm/order/calc?login_code=' + login_code,
		data: param
	})
}
export function submitOrder(param) {
	let login_code = wx.getStorageSync('login_code');
	param.login_code = login_code;
	return $http.post({
		url: '/api/firm/order/submit?login_code=' + login_code,
		data: param
	})
}
export function payOrder(param) {
	let login_code = wx.getStorageSync('login_code');
	param.login_code = login_code;
	return $http.post({
		url: '/api/firm/payment/weixin/prepareOrder/payOrder?login_code=' + login_code,
		data: param
	})
}
export function getorderList(param) {
	let login_code = wx.getStorageSync('login_code');
	param.login_code = login_code;
	return $http.post({
		url: '/api/firm/order/index?login_code=' + login_code,
		data: param
	})
}
/* 评价订单 */
export function sendcomment(data) {
	let login_code = wx.getStorageSync('login_code');
	data.login_code = login_code;
	let params = JsontoForm(data);
	return $http.get({
		url: '/comment/send?' + params,
	})
}
/*验证企业邀请码 */
export function invitation(code) {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url: '/content/xiaochengxu/invitation/' + code + '?login_code=' + login_code,
	})
}
/*取消订单 */
export function cancelOrder(id, data) {
	let login_code = wx.getStorageSync('login_code');
	data.login_code = login_code;
	let params = JsontoForm(data);
	return $http.post({
		url: '/api/firm/order/cancel/' + id + '?' + params,
	})
}
/* 确认收货 */
export function confirmOrder(id, data) {
	let login_code = wx.getStorageSync('login_code');
	data.login_code = login_code;
	let params = JsontoForm(data);
	return $http.post({
		url: '/api/firm/order/complete/' + id + '?' + params,
	})
}

/* 查询是否在营业状态 */
export function opentime() {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url: '/comment/get/open/time?login_code=' + login_code,
		
	})
}
/* 查询兑换积分列表 */
export function getIntegralAmount() {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url:'/api/firm/member/getIntegralAmount?login_code=' + login_code,
		
	})
}
/* 获取团购描述信息 */
export function getGroupMoreInfo() {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url:'/api/firm/member/getGroupMoreInfo?login_code=' + login_code,
		
	})
}
//* 兑换积分 */
export function IntegralRechangerAmount(param,memberId) {
	let login_code = wx.getStorageSync('login_code');
	let params = JsontoForm(param);
	return $http.post({
		url:'/api/firm/member/IntegralRechangerAmount/'+memberId+'?login_code='+login_code,
		data: param
	})
}
export function getwebview() {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url:'/comment/guanggao/get?login_code='+login_code,
	})
}
export function getlive() {
	let login_code = wx.getStorageSync('login_code');
	return $http.get({
		url:'/comment/get/live?login_code='+login_code,
	})
}
export default {
	getmsglist,
	getbannerlist,
	getbaikelist,
	getjiankanglist,
	getwechatlist,
	getbaike,
	getjiankang,
	getOpenId,
	getMember,
	addMember,
	getMemberAddr,
	addAddress,
	editAddress,
	delAddress,
	sendVerifyCode,
	setMemberPhone,
	setMemberPayPassword,
	getRechargeAmount,
	getAccountChangeRecord,
	prepareOrderRecharge,
	getMemberInfoById,
	getcategory,
	getgoods,
	gettggoods,
	calcOrder,
	submitOrder,
	payOrder,
	getorderList,
	getcoupon,
	sendcomment,
	invitation,
	cancelOrder,
	opentime,
	confirmOrder,
	getIntegralAmount,
	getGroupMoreInfo,
	IntegralRechangerAmount,
	getwebview,
	getlive
}
