<script>
	import api from '@/utils/api';
	export default {
		created() {
			// 调用API从本地缓存中获取数据
			/*
			 * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
			 * 微信：mpvue === wx, mpvuePlatform === 'wx'
			 * 头条：mpvue === tt, mpvuePlatform === 'tt'
			 * 百度：mpvue === swan, mpvuePlatform === 'swan'
			 * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
			 */

			// let logs
			// if (mpvuePlatform === 'my') {
			// 	logs = mpvue.getStorageSync({
			// 		key: 'logs'
			// 	}).data || []
			// 	logs.unshift(Date.now())
			// 	mpvue.setStorageSync({
			// 		key: 'logs',
			// 		data: logs
			// 	})
			// } else {
			// 	logs = mpvue.getStorageSync('logs') || []
			// 	logs.unshift(Date.now())
			// 	mpvue.setStorageSync('logs', logs)
			// }
			// 只被创建一次
			wx.login({
				success: res => {
					console.log(res);
					api.getOpenId(res.code).then(da => {
						let param = JSON.parse(da.param);
						if (param.code == 200) {
							//console.log(da.data);
							var openid = param.data.openid;
							wx.setStorageSync('openid', openid);
							api.getMember(openid).then(da => {
								var data = da.param.data;
								if (da.param.code == 200 && data.list.length > 0) {
									wx.setStorageSync('isLogin', 1);
									wx.setStorageSync('userinfo', data.list[0]);
									wx.setStorageSync('member_id', data.list[0].id);
									this.globalData.member_id = data.list[0].id;
									this.globalData.total_amount = data.list[0].total_amount
								}
							});
						}
					});
				}
			});
			/* 设置初始常量 */

			wx.setStorageSync('login_code', '5c906ce579857');

		},
		log() {
			console.log(`log at:${Date.now()}`)
		},
		onLaunch() {


			wx.setBackgroundFetchToken({
				token: '122333'
			});
			wx.getBackgroundFetchData({
				fetchType: 'pre',
				success(res) {
					if (res.fetchedData) {
						try {
							wx.setStorageSync('goodslist', {
								list: JSON.parse(res.fetchedData).param.data.list,
								totalCount: JSON.parse(res.fetchedData).param.data.totalCount
							});
						} catch (e) {
							//TODO handle the exception
						}

					}
				}
			})

		}
	}
</script>

<style>
	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 200rpx 0;
		box-sizing: border-box;
	}

	/* this rule will be remove */

	* {
		transition: width 2s;
		-moz-transition: width 2s;
		-webkit-transition: width 2s;
		-o-transition: width 2s;
	}

	.bgf8 {
		background: #f8f8f8;
	}

	.clearfix {
		display: block;
	}

	.clearfix:after {
		overflow: hidden;
		clear: both;
		height: 0;
		content: '';
		line-height: 0;
		display: block;
	}

	/*flex 布局*/

	.flex {
		display: -webkit-box;
		display: -webkit-flex;
		display: -ms-flexbox;
		display: flex;
	}

	/*垂直显示*/

	.flex-v {
		-webkit-box-orient: vertical;
		-webkit-flex-direction: column;
		-ms-flex-direction: column;
		flex-direction: column;
	}

	.flex-1 {
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		overflow: hidden
	}

	/*垂直对其方式*/

	.flex-align-center {
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
	}

	/*左右居中*/

	.flex-pack-center {
		-webkit-box-pack: center;
		-webkit-justify-content: center;
		-ms-flex-pack: center;
		justify-content: center;
	}

	/*两端对齐*/

	.flex-pack-justify {
		-webkit-box-pack: justify;
		-webkit-justify-content: space-between;
		-ms-flex-pack: justify;
		justify-content: space-between;
	}

	.ml10 {
		margin-left: 10rpx;
	}

	.mr10 {
		margin-right: 10rpx;
	}
	.pt10{
		padding-top: 10rpx;
	}

	.mt10 {
		margin-top: 10rpx;
	}

	.ml20 {
		margin-left: 20rpx;
	}

	.view li {
		display: block;
		position: relative;
		height: 120rpx;
		border-bottom: 1px solid #efefef;
		line-height: 120rpx;
		padding-left: 40rpx;
		background: #fff;
		font-size: 28rpx;
	}

	.view.arrow li:not(.noarrow):after {
		content: '';
		display: block;
		height: 8px;
		width: 8px;
		border: 3px solid transparent;
		border-top-color: #ff5454;
		border-right-color: #ff5454;
		transform: rotate(45deg);
		right: 20px;
		position: absolute;
		top: 25px;
	}

	.view.arrow li a {
		color: #666;
		display: flex;
		align-items: center;
	}

	.view.arrow li a img {
		height: 30px;
		vertical-align: middle;
	}

	.view.arrow li a i {
		display: inline-block;
		width: 40px;
		margin-right: 35px;
		text-align: center;
	}

	.view.arrow li a i+span {
		vertical-align: middle;
		font-weight: bold;
	}

	.nodata {
		padding-top: 100rpx;
		text-align: center;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: #fff;
	}

	.nodata image {
		width: 400rpx;
	}

	.spinner {
		margin: 0 auto;
		width: 50px;
		text-align: center;
	}

	.spinner>div {
		width: 10px;
		height: 10px;
		background-color: rgba(0, 0, 0, .4);

		border-radius: 100%;
		display: inline-block;
		-webkit-animation: bouncedelay 1.4s infinite ease-in-out;
		animation: bouncedelay 1.4s infinite ease-in-out;
		/* Prevent first frame from flickering when animation starts */
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
	}

	.spinner .bounce1 {
		-webkit-animation-delay: -0.32s;
		animation-delay: -0.32s;
	}

	.spinner .bounce2 {
		-webkit-animation-delay: -0.16s;
		animation-delay: -0.16s;
	}

	@-webkit-keyframes bouncedelay {

		0%,
		80%,
		100% {
			-webkit-transform: scale(0.0)
		}

		40% {
			-webkit-transform: scale(1.0)
		}
	}

	@keyframes bouncedelay {

		0%,
		80%,
		100% {
			transform: scale(0.0);
			-webkit-transform: scale(0.0);
		}

		40% {
			transform: scale(1.0);
			-webkit-transform: scale(1.0);
		}
	}

	button::after {
		border: none
	}

	.cropRight {
		position: relative;
		padding: 0 20rpx;
		color: #fff;
		text-align: left;
		font-size: 26rpx;
		line-height: 1.8;
	}

	.cropRight image {
		width: 100%;
	}

	.cropRight .name {
		font-size: 32rpx;
		padding-top: 10rpx;
	}

	.cropRight>div {
		position: absolute;
		left: 20px;
		top: 15px;
	}
</style>
