<template>
	<div style="background: #f6f6f6;">
		<scroll-view scroll-y="scroll" :style="{ height: scrollhight + 'px' }" class="myorderlist" @scrolltolower="loadresult(1)"
		 @scrolltoupper="refresh(1)">
			<div v-show="myorder.length == 0" class="nodata">
				<image src="/static/images/nodata.jpg" mode="aspectFit" />
			</div>

			<div class="order-item" v-for="(item, itemIndex) in myorder" :key="itemIndex" :class="{ mt20: itemIndex > 0 }">
				<div class="flex flex-pack-justify title">
					<span>日期 {{ item.created_at }}</span>
					<span>
						订单号
						<font class="red">{{ item.order_no }}</font>
					</span>
				</div>
				<div class="orderlist mt10">
					<div class="orderlist-hd">
						<div>名称</div>
						<div>价格</div>
						<div>数量</div>
					</div>
					<ul class="orderlist-bd">
						<li v-for="(subitem, subitemIndex) in item.goodsDetails" :key="subitemIndex">
							<div>{{ subitem.name }}</div>
							<div>￥{{ subitem.price }}</div>
							<div>{{ subitem.qty }}</div>
						</li>
					</ul>
				</div>
				<div class="totalprice">
					<!--共计 10箱 -->
					合计
					<font class="red">￥{{ item.total_amount }}</font>
					<span style="margin-left: 10px;">余额支付</span>
					<font class="red">￥{{item.balance_amount }}</font>
					<span style="margin-left: 10px;">微信支付</span>
					<font class="red">￥{{ item.need_pay_amount>0?item.need_pay_amount:item.pay_amount }}</font>
				</div>
				<div class="tip  flex flex-pack-justify  flex-align-center">
					<div>
						<span class="state1">{{ item.state }}</span>
						<!-- <span class="state2" v-if="item.pay_status == 2">已发货</span> -->
						<!-- <span class="state2" v-if="item.pay_status == 0">已失效</span> -->

					</div>
					<div>
						<span v-if="item.state__!=1" class="btn btn3 ml20" @click="copyBtn(item.order_no)">复制订单</span>
						<span v-if="item.state__==4&&item.evaluate_flag__==1" class="btn btn3 ml20" @click="showComment(item.id)">评价订单</span>
						<span v-if="item.state__==1" class="btn btn3 ml20" @click="cancelOrder(item.id)">取消订单</span>
						<span v-if="item.state__==1" class="btn btn3 ml20" @click="payOrder(item)">付款</span>
						<span v-if="item.state__==3" class="btn btn3 ml20" @click="confirmOrder(item.id)">确认收货</span>
					</div>
				</div>
			</div>
		</scroll-view>
		<div class="dialog" v-if="showDialog">
			<div class="win-content">
				<img class="close-img" src="/static/images/dele_icon.png" @click="showDialog = !showDialog" />
				<div>
					<div>客服评价</div>
					<div class="user_star">
						<p :class="kefunum > 0 ? 'active' : ''" @click="clickStart('kefunum', 0)">★</p>
						<p :class="kefunum > 1 ? 'active' : ''" @click="clickStart('kefunum', 1)">★</p>
						<p :class="kefunum > 2 ? 'active' : ''" @click="clickStart('kefunum', 2)">★</p>
						<span>{{ kefunum > 2 ? '优' : kefunum > 1 ? '良' : kefunum > 0 ? '差' : '' }}</span>
					</div>
				</div>
				<div>商品评价</div>
				<div class="user_star">
					<p :class="shangpinnum > 0 ? 'active' : ''" @click="clickStart('shangpinnum', 0)">★</p>
					<p :class="shangpinnum > 1 ? 'active' : ''" @click="clickStart('shangpinnum', 1)">★</p>
					<p :class="shangpinnum > 2 ? 'active' : ''" @click="clickStart('shangpinnum', 2)">★</p>
					<span>{{ shangpinnum > 2 ? '优' : shangpinnum > 1 ? '良' : shangpinnum > 0 ? '差' : '' }}</span>
				</div>
				<div>快递评价</div>
				<div class="user_star">
					<p :class="kuaidinum > 0 ? 'active' : ''" @click="clickStart('kuaidinum', 0)">★</p>
					<p :class="kuaidinum > 1 ? 'active' : ''" @click="clickStart('kuaidinum', 1)">★</p>
					<p :class="kuaidinum > 2 ? 'active' : ''" @click="clickStart('kuaidinum', 2)">★</p>
					<span>{{ kuaidinum > 2 ? '优' : kuaidinum > 1 ? '良' : kuaidinum > 0 ? '差' : '' }}</span>
				</div>
				<div class="btn" @click="sendcomment()">确定</div>
			</div>
		</div>
		<!-- <navigator class="gotohome" url="/pages/index/main" open-type="switchTab">返回首页</navigator> -->
	</div>
</template>
<script>
	import api from '@/utils/api';
	export default {
		components: {},

		data() {
			return {
				kefunum: 3,
				shangpinnum: 3,
				kuaidinum: 3,
				showDialog: false,
				scrollhight: 100,
				selecttab: 0,
				pageSize: 20,
				myorderpage: 1,
				bulkorderpage: 1,
				ismyorderMore: true, //普通订单是否还可以加载更多
				isbulkorderMore: true,
				myorder: [],
				accessToken: '',
				// hiddenmodalput: true,
				deltype: '',
				delid: '',
				delindex: '',
				isLoading: false,
				isLoadingtg: false,
				order_id: ''
			};
		},
		methods: {
			getorderList() {
				var that = this;
				that.isLoading = true;
				var param = {
					page: that.myorderpage,
					limit: that.pageSize,
					state: '1,2,3,4',
					belong_member_id: that.globalData.member_id
				};
				api.getorderList(param).then(function(da) {
					that.isLoading = false;
					var da = da.param;
					if (da.code == 200) {
						if (that.myorderpage == 1) {
							that.myorder = [];
						}
						that.myorder = that.myorder.concat(da.data.list);
						if (that.myorder.length >= da.data.totalCount) {
							that.ismyorderMore = false;
						} else {
							that.myorderpage++;
						}
					}
				});
			},

			cancel() {
				//this.hiddenmodalput = true
			},
			clickStart(type, num) {
				if (type == 'kefunum') {
					this.kefunum = num + 1;
				} else if (type == 'shangpinnum') {
					this.shangpinnum = num + 1;
				} else {
					this.kuaidinum = num + 1;
				}
			},
			/*加载更多筛选*/
			loadresult(type) {
				var that = this;
				if (that.ismyorderMore) {
					this.getorderList();
				}
			},
			/* 刷新 */
			refresh(type) {
				var that = this;
				that.myorderpage = 1;
				that.ismyorderMore = true;
				this.getorderList();
			},
			/* 评价订单 */
			sendcomment() {
				var param = {
					order_id: this.order_id,
					kf_evaluation: this.kefunum,
					sp_evaluation: this.shangpinnum,
					kd_evaluation: this.kuaidinum
				}
				api.sendcomment(param).then(da => {
					if (da.code == 200) {
						wx.showToast({
							title: '评价成功',
							icon: 'none'
						});
					}
					this.showDialog = false;

				})
			},
			showComment(id) {
				this.order_id = id;
				this.showDialog = true;

			},
			cancelOrder(id) {
				/* 取消订单 */
				let login_user_id = this.globalData.member_id
				let that = this;
				wx.showModal({
					title: '提示',
					content: '你确定要取消这个订单吗？',
					success(res) {
						if (res.confirm) {
							api.cancelOrder(id, {
								login_user_id: login_user_id
							}).then(da => {
								wx.showToast({
									title: da.message,
									icon: 'none'
								});
								that.refresh();

							})
						}
					}
				});

			},
			// 一键复制事件
			copyBtn(order_no) {
				var that = this;
				wx.setClipboardData({
					//准备复制的数据
					data: order_no,
					success: function(res) {
						wx.showToast({
							title: '复制成功',
						});
					}
				});
			},

			payOrder(item) {
				let that = this;
				/* 支付订单 */
				api.payOrder({
					formData: {
						order_id: item.order_no,
						member_id: this.globalData.member_id
					}
				}).then(data => {
					var data = data.param;
					if (data.code == 200) {
						wx.requestPayment({
							timeStamp: data.data.timeStamp,
							nonceStr: data.data.nonceStr,
							package: data.data.package,
							signType: data.data.signType,
							paySign: data.data.paySign,
							success: function(res) {
								that.refresh()
								wx.showToast({
									title: '支付成功',
									icon: 'success'
								});
							},
							fail: function(res) {
								console.info('requestPayment fail:', res);
								var errMsg = res.errMsg == 'requestPayment:fail cancel' ? '已取消支付' : res.errMsg.replace(
									'requestPayment:fail ', '');
								wx.showToast({
									title: errMsg,
									icon: 'none'
								});
							},
							complete: function(res) {
								console.info('requestPayment complete:', res);
							}
						});
					} else {
						wx.showToast({
							title: '请求充值失败',
							icon: 'none'
						});
					}
				});

			},
			confirmOrder(id) {
				let login_user_id = this.globalData.member_id
				let that = this;
				wx.showModal({
					title: '提示',
					content: '你确定要收货这个订单吗？',
					success(res) {
						if (res.confirm) {
							api.confirmOrder(id, {
								login_user_id: login_user_id
							}).then(da => {
								wx.showToast({
									title: da.message,
									icon: 'none'
								});
								that.refresh();

							})
						}
					}
				});
			}
		},

		created() {},
		onShow() {
			this.getorderList();
		},
		onLoad() {
			var that = this;
			wx.getSystemInfo({
				success: function(res) {
					that.scrollhight = res.windowHeight - (res.windowWidth * 100) / 750;
					//console.log("123"+res.windowHeight);
				}
			});
		}
	};
</script>
<style scoped>
	.mt20 {
		margin-top: 20rpx;
	}

	.mr20 {
		margin-right: 20rpx;
	}

	.ml20 {
		margin-left: 20rpx;
	}

	.myorderlist {
		/* background: #f6f6f6 ; */
		position: relative;
	}

	.loading {
		position: absolute;
		top: 0;
		height: 30px;
		left: 0;
		right: 0;
	}

	.myorderlist .order-item {
		display: block;
		background: #fff;
		padding: 20rpx 0;
		font-size: 30rpx;
		border: 1px solid #efefef;
	}

	.myorderlist .order-item .title {
		padding: 0 20rpx;
		font-size: 24rpx;
	}

	.myorderlist .order-item .goodinfo {
		background: #f9f9f9;
		padding: 0 10px;
		margin-bottom: 10rpx;
	}

	.myorderlist .order-item .goodinfo .imgbox {
		height: 64px;
		width: 64px;
		background: #f29b76;
		overflow: hidden;
	}

	.myorderlist .order-item .goodinfo .imgbox image {
		height: 64px;
		width: 64px;
	}

	.myorderlist .order-item .goodinfo .goodsname {
		min-height: 3em;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.myorderlist .order-item .totalprice {
		line-height: 50rpx;
		text-align: right;
		padding-right: 10px;
		border-bottom: 1rpx solid #efefef;
	}

	.myorderlist .order-item .tip {
		padding: 10px;
	}

	.myorderlist .order-item .tip .state1 {
		color: #108e06;
		font-weight: bold;
		font-size: 12px;
	}

	.myorderlist .order-item .tip .state2 {
		color: #ff0000;
		font-weight: bold;
		font-size: 12px;
	}

	.myorderlist .order-item .tip .btn {
		width: 63px;
		height: 23px;
		display: inline-block;
		border-radius: 4px;
		line-height: 23px;
		font-size: 24rpx;
	}

	.myorderlist .order-item .tip .btn.btn1 {
		color: #fff;
		background: #ff5454;
		text-align: center;
		border: 1px solid #ff5454;
	}

	.myorderlist .order-item .tip .btn.btn2 {
		color: #434343;
		background: #ffd260;
		text-align: center;
		border: 1px solid #ffd260;
	}

	.myorderlist .order-item .tip .btn.btn3 {
		color: #434343;
		background: #fff;
		text-align: center;
		border: 1px solid #d2d2d2;
	}

	.mt10 {
		margin-top: 10rpx;
	}

	.red {
		color: #ff5454;
	}

	.mark {
		padding: 0 20rpx;
	}

	.tab {
		text-align: center;
		background: #fff;
		height: 80rpx;
	}

	.tab div {
		width: 320rpx;
		height: 60rpx;
		border-radius: 10rpx;
		display: inline-block;
		font-size: 30rpx;
		line-height: 60rpx;
	}

	.tab .tabbtn {
		color: #ff5454;
		border: 1px solid #ff5454;
		margin: 0 20rpx;
	}

	.tab .tabbtn.active {
		background: #ff5454;
		color: #fff;
	}

	.tab .tabbulkbtn {
		color: #ffd260;
		border: 1px solid #ffd260;
	}

	.tab .tabbulkbtn.active {
		background: #ffd260;
		color: #323332;
	}

	.orderlist-hd,
	.orderlist-bd {
		overflow: hidden;
	}

	.orderlist-hd {
		border-bottom: 1rpx solid #efefef;
		line-height: 60rpx;
		color: #ff5454;
	}

	.orderlist-hd div,
	.orderlist-bd div {
		float: left;
		width: 30%;
		text-align: center;
	}

	.orderlist-hd div:first-child,
	.orderlist-bd div:first-child {
		width: 40%;
	}

	.orderlist-bd li {
		overflow: hidden;
		border-bottom: 1rpx solid #efefef;
		line-height: 60rpx;
	}

	.orderlist-bd li .taglist {
		width: 40%;
		color: #666;
		font-size: 20rpx;
	}

	.orderlist-bd li .taglist span {
		border-radius: 5rpx;
		padding: 0 5rpx;
		font-size: 20rpx;
		margin: 0 3rpx;
	}

	.orderlist-bd li .taglist .color {
		border: 1rpx solid #ff5454;
		color: #ff5454;
	}

	.orderlist-bd li .taglist .tag {
		border: 1rpx solid #3cb878;
		color: #3cb878;
	}

	.gotohome {
		height: 80rpx;
		width: 80rpx;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		font-size: 30rpx;
		position: fixed;
		right: 20rpx;
		bottom: 30%;
		text-align: center;
		border-radius: 100%;
		padding: 20rpx;
	}

	.dialog {
		position: fixed;
		top: 0;
		width: 100%;
		left: 0;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		z-index: 100;
	}

	.dialog .win-content {
		position: absolute;
		width: 90%;
		background: #fff;
		border-radius: 5px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 20px;
		box-sizing: border-box;
	}

	.dialog .close-img {
		position: absolute;
		right: -10px;
		top: -10px;
		width: 30px;
		height: 30px;
		z-index: 999;
	}

	.user_star {
		border-bottom: 1px dashed #eee;
		margin-bottom: 10px;
	}

	.user_star p.active {
		color: #ff7200 !important;
	}

	.user_star p {
		color: #999;
		display: inline-block;
		font-size: 30px;
		margin-right: 10px;
		vertical-align: middle;
	}

	.user_star span {
		vertical-align: middle;
		margin-left: 10px;
		display: inline-block;
	}

	.btn {
		background: #f00;
		border-radius: 5px;
		color: #fff;
		text-align: center;
		font-size: 40rpx;
		line-height: 40px;
		height: 40px;
	}
</style>
