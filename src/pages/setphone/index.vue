<template>
	<div class="loginbox">
		<form>

			<div class="group flex flex-align-center">
				<i class="phone">
					<image src="/static/images/icon1.png" mode="aspectFit" />
				</i>
				<input class="flex-1" type="text" value="" placeholder="请输入手机号码" v-model="phone" />
			</div>
			<div class="clearfix codebox mt20">
				<div class="group flex flex-align-center">
					<i class="code">
						<image src="/static/images/icon7.png" mode="aspectFit" />
					</i>
					<input type="text" value="" placeholder="验证码" class="flex-1" v-model='code' />
				</div>

				<button class="getcode" :disabled="isAble=='0'" :class="{'active':isAble=='1'}" @click="getCode()">
					{{codetxt}}
				</button>
			</div>


			<div class="submitBtn" @click="setPayPwd()">确定</div>
		</form>
	</div>
</template>

<script>
	import api from '@/utils/api';
	import {
		regPhone
	} from '@/utils/index';

	export default {
		components: {},

		data() {
			return {
				code: '',
				phone: '',
				pwd: '',
				confirmpwd: '',
				isAble: '0',
				codetxt: '获取验证码',
				timer: null
			}
		},
		onShow() {
			// this.getUserInfo();
			
		},
		mounted() {
			// 			this.phone = this.$root.$mp.query.phone;
			// 			console.log(this.phone)
		},
		onHide(){
			this.code = '';
			this.phone = '';
			this.pwd = '';
			this.confirmpwd = '';
			this.isAble = '1';
			this.codetxt = '获取验证码';
			if(this.timer){
				clearInterval(this.timer);
			}
		},
		onUnload() {
			this.code = '';
			this.phone = '';
			this.pwd = '';
			this.confirmpwd = '';
			this.isAble = '0';
			this.codetxt = '获取验证码';
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
		},
		methods: {
			getCode() {
				var that = this;
				if (that.isAble == '1') {
					that.isAble = '0';
					var num = 60;
					that.codetxt = num + 's';
					that.timer= setInterval(function() {
						if (num == 1) {
							clearInterval(that.timer);
							that.codetxt = '获取验证码';
							that.isAble = '1';
							that.timer = null;
						} else {
							num--;
							that.codetxt = num + 's';
						}
					}, 1000);
					api.sendVerifyCode(that.phone).then(da => {
						var data = da.param;
						if (data.code == 200) {
							wx.showToast({
								title: data.message,
								icon: 'success'
							});
						} else {
							wx.showToast({
								title: '验证码发送失败，请稍后重试',
								icon: 'none'
							});
						}
					})
				}
			},
			setPayPwd() {
				if (!regPhone(this.phone)) {
					wx.showToast({
						title: '请输入正确的手机号码',
						icon: 'none'
					})
					return false;
				}
				if(!this.code){
					wx.showToast({
						title: '请输入验证码',
						icon: 'none'
					});
					return false;
				}
				var param = {
					formData: {
						cellphone: this.phone,
						verification_code: this.code
					}
				}
				api.setMemberPhone(param, this.globalData.member_id).then(da => {
					var data = da.param;
					if (data.code == 200) {
						wx.showToast({
							title: data.message,
							icon: 'success'
						});
						let userinfo=wx.getStorageSync('userinfo');
						userinfo.cellphone=this.phone;
						wx.setStorageSync('userinfo', userinfo);
						setTimeout(() => {
							wx.navigateBack({
								delta: 1 //想要返回的层级
							});
						}, 300);
					} else {
						wx.showToast({
							title: data.message,
							icon: 'none'
						});
					}
				})
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
		},
		computed: {}
	}
</script>

<style scoped>
	.loginbox {
		width: 540rpx;
		margin: 0 auto;
		padding-top: 40px;
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
		line-height: 40px;
		color: #fff;
		border-radius: 5px;
		text-align: center;
		font-size: 30rpx;
		opacity: .8;
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
		margin-top: 70rpx;
	}
</style>
