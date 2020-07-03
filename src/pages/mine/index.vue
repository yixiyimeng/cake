<template>
	<div>
		<div class="userInfo flex flex-align-center">
			<div class="imgbox">
				<open-data type="userAvatarUrl"></open-data>
			</div>
			<div class="flex-1">
				<p class="name">
					<open-data type="userNickName"></open-data>
				</p>
				<!--<p>{{userId}}</p>-->
			</div>
		</div>
		<navigator :url="accountUrl" class="accountlink ">
			<div class="flex flex-align-center">
				<image src="/static/images/icon26.png" />
				<div class="flex-1 ml20">
					<p class="flex flex-pack-justify"><span class="title">账户余额</span>
						<span class="red"></span>
					</p>
				</div>
			</div>
			<!-- <p class="tip red">{{activity}}</p> -->
		</navigator>
		<ul class="usertab clearfix mt5">
			<li>
				<a href="/pages/order/main">
					<image src="/static/images/icon28.png" mode="aspectFit" />
					<p>我的订单</p>
				</a>
			</li>
			<li>
				<a href="/pages/score/main">
					<image src="/static/images/jf.png" mode="aspectFit" />
					<p>积分</p>
				</a>
			</li>
			<li>
				<!-- open-type="contact" -->
				<button >
					<image src="/static/images/icon30.png" mode="aspectFit" />
					<p>售后服务</p>
				</button>

			</li>
			<li>
				<a @click="callphone">
					<image src="/static/images/icon25.png" mode="aspectFit" />
					<p>客服热线</p>
				</a>
			</li>
		</ul>
		<ul class="arrow view mt5">
			<li>
				<a href="/pages/addresslist/main"><span>收货地址管理</span>
				</a>

			</li>
			<li class="mt5">
				<a href="/pages/setphone/main"><span>手机号码修改</span>
				</a>

			</li>

			<li class="mt5">
				<a :href="'/pages/paypwd/main?phone='+phone"><span>设置密码</span>
				</a>

			</li>
			<!-- <li class="mt5">
				<a href="/pages/articlelist/main?ReadId=547"><span>常见问题</span>
				</a>

			</li> -->

		</ul>
		<div style="text-align: center; color: #f00; margin-top: 10px; font-size: 14px;"></div>
		<!-- cropRight -->
		<div class="cropRight">
			<image src="/static/images/cropright.png" mode="widthFix"></image>
			<div>
				<p class="name">小程序制作请联系微信：xhh527317</p>
				<p>©2013-{{today}}核桃妹的妈妈</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {

		data() {
			return {
				canIUse: wx.canIUse('button.open-type.getUserInfo'),
				accountUrl: '',
				money: '',
				phone: '',
				userId: '',
				activity: '累积充值满5000享受终生9折优惠',
				today: null
			}
		},
		methods: {
			callphone() {
				wx.makePhoneCall({
					phoneNumber: '15519066826'
				})
			},
			bindGetUserInfo: function(e) {
				//					console.log(e.detail.userInfo)
			},
			getRecharge: function() {
				let that = this;
				/* api.getRecharge({
					accessToken: wx.getStorageSync("accessToken")
				}).then(function(da) {
					if(da.code = 200) {
						that.money = da.data.money;
						that.accountUrl = `/pages/account/main?money=${that.money}&chargeId=${da.data.chargeId}`;
						that.activity = da.data.activity
					}
				}) */
				that.money = '10';
				that.accountUrl = `/pages/account/main?money=${that.money}&chargeId=111`;
			},
			//查询员工信息
			/* getUserInfo: function() {
				let that = this;
				api.getUserInfo({
					accessToken: wx.getStorageSync("accessToken")
				}).then(function(da) {
					if(da.code = 200) {
						that.phone = da.data.username.username;
						that.userId = da.data.uid;
					}
				})
			}, */

		},
		created() {
			this.today = new Date().getFullYear()
		},
		onShow() {
			this.userId = this.globalData.member_id
			if (!this.globalData.member_id) {
				wx.showModal({
					title: '提示',
					content: '你还没有绑定手机号码，是否绑定？',
					success(res) {
						if (res.confirm) {
							const url = '/pages/reg/main';
							wx.navigateTo({
								url
							});
							// console.log('用户点击确定');
						} else if (res.cancel) {
							const url = '/pages/index/main';
							wx.switchTab({
								url
							});
						}
					}
				});
			}
		},
		onLoad() {

			this.getRecharge();
			// 判断用户是否登录，提示绑定手机号码

		}


	}
</script>
<style>
	page {
		min-height: 100%;
		background: #f6f6f6;
	}
</style>
<style scoped>
	.mt5 {
		margin-top: 5px;
	}

	.red {
		color: #f00;
	}

	/*个人信息*/

	.userInfo {
		background: #ff5454;
		color: #fff;
		height: 200rpx;
		font-size: 28rpx;
	}

	.userInfo .name {
		font-size: 36rpx;
	}

	.userInfo .imgbox {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		overflow: hidden;
		margin: 0 40rpx;
	}

	.usertab {
		background: #fff;
	}

	.usertab li {
		float: left;
		width: 25%;
	}

	.usertab li a,
	.usertab li button {
		display: block;
		text-align: center;
		font-size: 12px;
		padding: 20rpx 0;
		color: #434343;
		background: none;
		margin: 0;
		line-height: 1;
	}

	.usertab li a image,
	.usertab li button image {
		display: block;
		width: 60rpx;
		height: 68rpx;
		background: no-repeat center center;
		background-size: 30px auto;
		margin: 0 auto 10px;
	}

	.usertab li a i.icon1 {
		/*background-image: url(../img/icon28.png);*/
	}

	.usertab li a i.icon2 {
		/*background-image: url(../img/icon29.png);*/
	}

	.usertab li a i.icon3 {
		/*background-image: url(../img/icon30.png);*/
	}

	.usertab li a i.icon4 {
		/*background-image: url(../img/icon25.png);*/
	}

	.accountlink {
		background: #fff;
		position: relative;
		padding: 15px 40px 15px 30px;
		display: block;
		color: #434343;
		font-size: 15px;
	}

	.accountlink image {
		vertical-align: middle;
		width: 52rpx;
		height: 59rpx;
	}

	.accountlink:after {
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

	.accountlink .tip {
		font-size: 10px;
		text-align: center;
	}

	/* .copyright {
		text-align: center;
		font-size: 24rpx;
		color: #666;
		line-height: 80rpx;
	} */
	
</style>
