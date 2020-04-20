/**
 * Created by zhangjing on 2018/8/31.
 */
export const host = 'https://test.veimx.com';

function request(url, method, data, header = {}) {
	wx.showLoading({
		title: '加载中' //数据请求前loading
	})
	return new Promise((resolve, reject) => {
		wx.request({
			url: host + url, //仅为示例，并非真实的接口地址
			method: method,
			data:data,
			//  headers: {
			//    // 'content-type': 'application/json' ,// 默认值
			// 'content-Type': 'application/x-www-form-urlencoded',
			// 'cookie': wx.getStorageSync("sessionid")
			//  },

			header: {
				'Content-Type': 'application/json',
				'cookie': wx.getStorageSync("sessionid"),
				"memberId":wx.getStorageSync('member_id')||''
			},
			success: function(res) {
				var cookie = res.header["Set-Cookie"];
				if (cookie != null) {
					wx.setStorageSync("sessionid", res.header["Set-Cookie"]);
				}
				wx.hideLoading();
				resolve(res.data)
			},
			fail: function(error) {
				wx.hideLoading();
				reject(false)
			},
			complete: function() {
				wx.hideLoading();
			}
		})
	})
}

function get(obj) {
	return request(obj.url, 'GET', obj.data)
}

function post(obj) {
	return request(obj.url, 'POST', obj.data)
}

export default {
	request,
	get,
	post,
	host
}
