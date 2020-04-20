<template>
	<div class="login">
		<img src="/static/images/bg.jpg" class="bgimg" mode="widthFix" />
		<div class="loginbox">
			<h4 class="title">绑定手机号码</h4>
			<form>
				<div class="group flex flex-align-center">
					<i class="phone">
						<image src="/static/images/icon1.png" mode="aspectFit" /></i>
					<input class="flex-1" type="text" value="" placeholder="请输入手机号码" v-model="phone" />
				</div>
				<div class="clearfix codebox mt20">
					<div class="group flex flex-align-center">
						<i class="code">
							<image src="/static/images/icon7.png" mode="aspectFit" /></i>
						<input type="text" value="" placeholder="验证码" class="flex-1" v-model='verification_code' />
					</div>

					<button class="getcode" :disabled="isAble=='0'" :class="{'active':isAble=='1'}" @click="getCode()">{{codetxt}}</button>
				</div>

				<!-- <div class="group flex flex-align-center mt20">
					<i class="lock">
						<image src="/static/images/icon2.png" mode="aspectFit" /></i>
					<input class="flex-1 pwd" autocomplete="off" type="password" value="" placeholder="请输入密码" v-model="pwd" />
				</div>
				<div class="group flex flex-align-center mt20">
					<i class="lock">
						<image src="/static/images/icon2.png" mode="aspectFit" /></i>
					<input class="flex-1 compwd"  autocomplete="off" type="password" placeholder="请输入确认密码" v-model="confirmpwd" />
				</div> -->
				<!-- <div class="flex flex-pack-justify mt20">
					<a href="/pages/login/main">登录</a>
					<a href="/pages/forgetpwd/main">忘记密码？</a>
				</div> -->
				<!-- <input type="submit" name="" id="" value="确定" class="submitBtn" @click="register()" /> -->
				<button class="submitBtn" open-type="getUserInfo" @getuserinfo="onGotUserInfo">确定</button>
			</form>
		</div>
	</div>
</template>

<script>
	import {
		regPhone
	} from '@/utils/index';
	import api from '@/utils/api';
	export default {
		components: {},

		data() {
			return {
				phone: '',
				codetxt:'获取验证码',
				isAble: 0,
				verification_code: '',
				openid: wx.getStorageSync('openid'),
				wxuserInfo: wx.getStorageSync('wxuserInfo')
			};
		},

		created() {},
		methods: {
			getCode() {
				var that = this;
				if (that.isAble == '1') {
					that.isAble = '0';
					var num = 60;
					that.codetxt = num + 's';
					var timer = setInterval(function() {
						if (num == 1) {
							clearInterval(timer);
							that.codetxt = '获取验证码';
							that.isAble = '1';
						} else {
							num--;
							that.codetxt = num + 's';
						}
					}, 1000);
					api.sendVerifyCode(that.phone).then(da => {
						wx.showToast({
							title: da.param.message,
							icon: 'none'
						});
					});
				}
			},
			onGotUserInfo: function(e) {
				if (e.mp.detail.errMsg == 'getUserInfo:ok') {
					this.wxuserInfo=e.mp.detail.userInfo;
					wx.setStorageSync('wxuserInfo', e.mp.detail.userInfo);
					this.getopenid();
				} else {
					wx.showToast({
						title: '授权未成功',
						icon: 'none'
					});
					setTimeout(function() {
						wx.navigateBack({
							delta: 1
						});
					}, 300)
				}

			},
			getopenid(){
				let $me=this;
				if (!regPhone(this.phone)) {
					wx.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					});
					return false;
				}
				if(!this.verification_code){
					wx.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return false;
				}
				if(this.openid){
					this.register();
				}else{
					/* 换取openid */
					wx.login({
						success: res => {
							api.getOpenId(res.code).then(da => {
								let param = JSON.parse(da.param);
								if (param.code == 200) {
									var openid = param.data.openid;
									wx.setStorageSync('openid', openid);
									$me.openid=openid;
									$me.register();
								}
							});
						}
					});
				}
			},
			register() {
				var param = {
					formData: {
						cellphone: this.phone, //手机号码
						open_id: this.openid, //openID
						username: this.wxuserInfo.nickName, //昵称
						portrait: this.wxuserInfo.avatarUrl, //头像
						verification_code: this.verification_code
					}
				};
				api.addMember(param).then(da => {
					var data = JSON.parse(da.param);
					wx.showToast({
						title: data.message,
						icon: 'none'
					});
					if (data.code == 200) {

						api.getMember(this.openid).then(da => {
							var data = da.param.data;
							if (da.param.code == 200) {
								wx.setStorageSync('isLogin', 1);
								wx.setStorageSync('userinfo', data.list[0]);
								wx.setStorageSync('member_id', data.list[0].id);
								this.globalData.member_id = data.list[0].id;
							}
							setTimeout(() => {
								wx.navigateBack({
									delta: 1 //想要返回的层级
								});
							}, 300);
						});
					}
				});
			}
		},
		watch: {
			phone: function(newvalue, oldvalue) {
				var that = this;
				if (regPhone(that.phone)) {
					that.isAble = '1';

				} else {
					that.isAble = '0';

				}
			}
		}
	};
</script>

<style scoped>
	.title {
		text-align: center;
		margin-bottom: 20px;
	}

	.login {
		position: fixed;
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
		background: #f9f1ee no-repeat top center;
		background-size: 100% auto;
		box-sizing: border-box;
		overflow: hidden;
	}

	.loginbox {
		width: 540rpx;
		margin: 0 auto;
		padding-top: 40px;
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	.loginbox .logo,
	.loginbox .logo img {
		display: block;
		width: 175px;
		margin: 0 auto;
	}

	.loginbox form {
		margin-top: 50px;
	}

	.loginbox .group {
		height: 40px;
		border-radius: 5px;
		border: 1px solid #ff5454;
		background: #fff;
		font-size: 30rpx;
	}

	.loginbox .group i {
		display: block;
		height: 20px;
		width: 36px;
	}

	.loginbox .group i image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.mt20 {
		margin-top: 40rpx;
	}

	.loginbox .group input {
		background: none;
		border: none;
		width: 100%;
		height: 100%;
	}

	.loginbox .codebox>div {
		width: 55%;
		float: left;
	}

	.loginbox .codebox>button {
		float: right;
		width: 40%;
		background: #ff5454;
		line-height: 80rpx;
		height: 80rpx;
		color: #fff;
		border-radius: 10rpx;
		text-align: center;
		font-size: 30rpx;
		opacity: 0.8;
	}

	.loginbox .codebox>button.active {
		opacity: 1;
	}

	.loginbox .submitBtn {
		display: block;
		width: 100%;
		background: #ff5454;
		color: #fff;
		line-height: 80rpx;
		height: 80rpx;
		text-align: center;
		border-radius: 10rpx;
		border: none;
		margin-top: 30rpx;
	}

	.tip {
		font-size: 18px;
		color: #333;
		padding-top: 20rpx;
	}

	.tip .link {
		color: #ff5555;
		display: inline-block;
	}

	.login a {
		color: #ff5454;
		font-size: 30rpx;
	}
</style>
