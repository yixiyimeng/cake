<template>
	<div>
		<div class="text-center">
			<span class="payitem" v-for="(item,index) in list" @click="selectnum(index)" :key="index" :class="{'active':item.sel}">{{item.recharge + item.money}}
				<view class="price">售价：￥{{item.recharge}}</view>
			</span>
		</div>
		<div class="paybtn" @click="paymoney">充值</div>
		<p style="margin:10rpx; color:#f00">剁手小主请注意：充值后不能退款，运费需自理不可从充值里面抵扣!</p>
	</div>
</template>

<script>
	import api from '@/utils/api'

	export default {

		data() {
			return {
				list: [],
				money: 0,
				recharge: 0
			}
		},
		onShow() {
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
		mounted() {
			var that = this;
			api.getRechargeAmount().then(function(data) {
				var da = data.param;
				if (da.code == 200) {
					da.data.forEach(item => item.sel = false);
					console.info(da.data);
					that.list = da.data;
				} else {
					wx.showToast({
						title: '获取充值金额失败',
						icon: 'none'
					});
				}
			})
		},
		onUnload() {

		},
		methods: {
			selectnum(index) {

				if (this.list[index].sel) {
					this.list[index].sel = !this.list[index].sel;
					this.money = 0;
					this.recharge = 0;
				} else {
					this.list.forEach(item => item.sel = false);
					this.list[index].sel = true;
					this.recharge = this.list[index].recharge;
					this.money = this.list[index].money;
				}
			},
			paymoney() {
				var that = this;
				if (that.recharge > 0) {
					var param = {
						formData: {
							recharge_amount: this.recharge,
							presentation_amount: this.money,
							member_id: that.globalData.member_id
						}
					}
					api.prepareOrderRecharge(param).then(function(da) {
						var data = da.param;
						if (data.code == 200) {
							wx.requestPayment({
								'timeStamp': data.data.timeStamp,
								'nonceStr': data.data.nonceStr,
								'package': data.data.package,
								'signType': data.data.signType,
								'paySign': data.data.paySign,
								'success': function(res) {
									wx.showToast({
										title: '支付成功',
										icon: 'success'
									});
									wx.navigateTo({
										url: '/pages/account/main'
									});
								},
								'fail': function(res) {
									console.info('requestPayment fail:', res);
									var errMsg = res.errMsg == 'requestPayment:fail cancel' ? '已取消支付' : res.errMsg.replace(
										'requestPayment:fail ', '');
									wx.showToast({
										title: errMsg,
										icon: 'none'
									});
								},
								'complete': function(res) {
									console.info('requestPayment complete:', res);
								}
							})
						} else {
							wx.showToast({
								title: '请求充值失败',
								icon: 'none'
							});
						}
					});
				} else {
					wx.showToast({
						title: '请选择充值金额',
						icon: 'none'
					});
				}
			}
		},
		watch: {},
		computed: {}
	}
</script>

<style scoped>
	.text-center {
		text-align: center;
	}

	.payitem {
		color: #ff5555;
		border: 1px solid #ff5555;
		border-radius: 5px;
		margin: 10rpx 2%;
		padding: 10rpx 20rpx;
		display: inline-block;
		font-size: 40rpx;
		width: 46%;
		box-sizing: border-box;

	}

	.payitem view {
		color: #999;
		font-size: 30rpx;
	}

	.payitem.active {
		background: #ff5555;
		color: #fff;
	}

	.payitem.active view {
		color: #fff;
	}

	.paybtn {
		background: #ff5555;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
		border-radius: 10rpx;
		margin: 10px 20px;
	}

	.price {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
