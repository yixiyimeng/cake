<template>
	<div style="background: #f6f6f6;">
		<div class="pt10">
			<ul class="view arrow ml10 mr10">
				<li v-if="order_type!=2&&transway==1">
					<a style="line-height:50rpx;" href="/pages/addresslist/main?type" hover-class="none">
						<i class="addr">
							<image src="/static/images/icon12.png" mode="widthFix" /></i>
						<div>
							<p>{{ addr.contact_name }}{{ addr.contact_phone }}</p>
							<span>{{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.address }}</span>
						</div>
					</a>
				</li>
				<!-- <li class="mt5 noarrow">
					<div>
						<i class="time">
							<image src="/static/images/icon13.png" mode="widthFix" />
						</i>
						<span>发货时间 </span>
						<span class="tip">{{deliveryTimeInfo}}</span>
					</div>
				</li> -->
				<li class="mt5 noarrow">
					<div class="flex flex-pack-justify ">
						<div>
							<i class="payway">
								<image src="/static/images/icon14.png" mode="widthFix" /></i>
							<span>余额</span>
							<span style="color: #999; font-weight: normal; font-size: 14px; margin-left: 10px;">({{user_balance_amount}}元)</span>
						</div>
						<!-- <span class="pay">{{ payWaytxt }}</span> -->
						<!-- <input class="flex-1" type="number" @change.stop="changebalance" v-model.lazy="balance_amount" style="margin-right: 80rpx; text-align: right;"> -->
						<switch :checked="use_balance_flag" style="transform: scale(.7);" @change="changebalance"></switch>
					</div>
				</li>
			</ul>
			<div class="orderdetails">
				<div class="title">订单详情</div>

				<!-- <div class="ordergoodslist mt10" v-show="type == 2">
					<div class="flex goodinfo mt5" v-for="(item, itemIndex) in goods" :key="itemIndex">
						<div class="imgbox"><image :src="item.thumb_img" mode="widthFix" /></div>
						<div class="flex-1 ml20">
							<p class="goodsname">{{ item.title }}</p>
							<div class="flex flex-pack-justify">
								<span class="price">￥：{{ item.tg_price }}元</span>
								<span class="num red">购买数量：{{ item.nums }}箱</span>
							</div>
						</div>
					</div>
				</div> -->
				<ul>
					<li class="flex" v-for="(item, itemIndex) in goods" :key="itemIndex">
						<div style="width:40%;text-align: left; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; padding-left: 10px;">{{ item.name }}</div>

						<div style="width: 30%;">{{ item.qty }}份</div>
						<div style="width: 30%;" v-if="order_type == 1">￥{{ item.take_out_price }}</div>
						<div style="width: 30%;" v-if="order_type == 3">{{ item.personal_group_price }}</div>
						<div style="width: 30%;" v-if="order_type == 4">{{ item.enterprise_group_price }}</div>
					</li>
				</ul>
			</div>

			<ul class="view view2 arrow ml10 mr10">
				<li v-if="order_type!=2">
					<a class="flex flex-pack-justify" @click="istransway = !istransway">
						<div>
							<i class="transport">
								<image src="/static/images/icon15.png" mode="widthFix" /></i>
							<span>运输方式</span>
						</div>
						<span class="pay">{{ transwaytxt }}</span>
					</a>
				</li>
				<li class="mt5 noarrow" v-if="order_type!=2">
					<a class="flex flex-pack-justify">
						<div>
							<i class="transportmoney">
								<image src="/static/images/icon16.png" mode="widthFix" /></i>
							<span>运费价格</span>
						</div>
						<span class="pay">{{ freight_amount }}</span>
					</a>
				</li>
				<!-- <li class="mt5">
					<a class="flex flex-pack-justify" @click="iscanjuway = !iscanjuway">
						<div>
							<i class="bzmoney">
								<image src="/static/images/icon17.png" mode="widthFix" /></i>
							<span>餐具增加</span>
						</div>
						<span class="pay">{{ canjuwaytxt }}</span>
					</a>
				</li> -->
				<li class="mt5">
					<div class="flex flex-pack-justify js-selecpayway" @click="ispayway=true">
						<div>
							<i class="payway">
								<image src="/static/images/icon14.png" mode="widthFix" /></i>
							<span>优惠券</span>
						</div>
						<span class="pay">{{ payWaytxt }}</span>
					</div>
				</li>
			</ul>
			<div class="mt5 modbox">

				<span style="display: inline-block;" class="ml10">
					<span>商品金额：</span>
					<span class="paynum">{{ goods_amount }}元</span>
				</span>
				<span style="display: inline-block;" class="ml10">
					<span>总计：</span>
					<span class="paynum">{{ amount }}元</span>
				</span>
				<span v-if="use_balance_flag" style="display: inline-block;" class="ml10">
					<span>余额支付：</span>
					<span class="paynum">{{balance_amount}}元</span>
				</span>
				<span style="display: inline-block;" class="ml10">
					<span>实付金额：</span>
					<span class="paynum">{{ need_pay_amount }}元</span>
				</span>

				<!-- <span style="display: inline-block;">
					<span class="ml10">优惠：</span>
					<span class="paynum">{{ youhui }}元</span>
				</span>
				<span style="display: inline-block;">
					<span class="ml10">实付：</span>
					<span class="paynum">{{ paynum }}元</span>
				</span> -->
			</div>
			<div class="mt5 modbox flex flex-align-center">
				<label>备注</label>
				<input type="text" name="" id="" value="" class="flex-1 remark" v-model="remark" />
			</div>
			<div style="height: 60px;"></div>
		</div>
		<span class="gotopay" @click="payforOrder()">去支付￥{{ need_pay_amount }}</span>
		<!--支付方式 star-->
		<div class="paywaybox" :class="{ active: ispayway&&couponlist.length>0 }" @click="closepaywaybox" id="paywaybox">
			<div>
				<div class="title">优惠券</div>
				<div>
					<ul>
						<li v-for="(item,index) in couponlist" :key="index" @click.stop="setPayWay(item,index)">
							<a :class="{ active: item.ischeck }">
								<span>{{item.name}}</span>
							</a>
						</li>
						<!-- <li>
							<a @click="setPayWay(0, '微信支付')" :class="{ active: payWay == 2 }">
								<image src="/static/images/icon19.png" mode="widthFix" class="weixi" />
								<span>微信支付</span>
							</a>
						</li>
						<li>
							<a @click="setPayWay(5, '余额支付')" :class="{ active: payWay == 1 }">
								<image src="/static/images/icon18.png" mode="widthFix" class="yue" />
								<span>余额支付</span>
							</a>
						</li> -->
						<!-- <li>
							<a @click="setPayWay(3, '积分支付')" :class="{ active: payWay == 3 }">
								<image src="/static/images/jf.png" mode="widthFix" class="yue" />
								<span>积分支付</span>
							</a>
						</li> -->
					</ul>
				</div>
			</div>
		</div>
		<!--支付方式 end-->
		<div class="transwaybox" :class="{ active: istransway }" @click="closetranswaybox">
			<div>
				<div class="title">运输方式</div>
				<div>
					<ul>
						<li>
							<a @click="settransway(1, '小哥配送')" :class="{ active: transway == 1 }"><span>小哥配送</span></a>
						</li>
						<li>
							<a @click="settransway(0, '到店自取')" :class="{ active: transway == 0 }"><span>到店自取</span></a>
						</li>
						<!-- <li>
							<a @click="settransway(3, '配送至单位')" :class="{ active: transway == 3 }"><span>配送至单位</span></a>
						</li> -->
					</ul>
				</div>
			</div>
		</div>
		<!--运输方式 end-->
		<!-- 餐具增加 -->
		<div class="transwaybox" :class="{ active: iscanjuway }" @click="closecanjuwaybox">
			<div>
				<div class="title">餐具增加</div>
				<div>
					<ul>
						<li>
							<a @click="setcanjuway(1, '无')" :class="{ active: canjuway == 1 }"><span>无</span></a>
						</li>
						<li>
							<a @click="setcanjuway(2, '蜡烛*5 2元')" :class="{ active: canjuway == 2 }"><span>蜡烛*5 2元</span></a>
						</li>
						<li>
							<a @click="setcanjuway(3, '帽子*10 5元')" :class="{ active: canjuway == 3 }"><span>帽子*10 5元</span></a>
						</li>
						<li>
							<a @click="setcanjuway(4, '餐盘*10 10元')" :class="{ active: canjuway == 4 }"><span>餐盘*10 10元</span></a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!--输入支付密码-->
		<div class="ftc_wzsf" :class="{ active: ispaypwdbyye }">
			<div class="srzfmm_box">
				<div class="qsrzfmm_bt clear_wl">
					<span class="tx close" @click="ispaypwdbyye = !ispaypwdbyye">×</span>
					<!--<img src="img/xx_03.jpg" class="tx close">-->
					<span>请输入支付密码</span>
				</div>
				<div class="zfmmxx_shop">
					<!--<div class="mz">测试商品</div>-->
					<div class="zhifu_price">￥{{ paynum }}</div>
				</div>
				<ul class="mm_box clearfix">
					<li v-for="(item, itemIndex) in paypwd" :key="itemIndex" class="mmdd"></li>
					<li v-for="(item, itemIndex) in nopaypwd" :key="itemIndex"></li>
					<!--<li></li>
					<li></li>
					<li></li>
					<li></li>-->
				</ul>
				<a href="/pages/paypwd/main" class="forgetpwd">忘记支付密码</a>
			</div>
			<div class="numb_box">
				<div class="xiaq_tb">
					<!--<img src="img/jftc_14.jpg" height="10">-->
				</div>
				<ul class="nub_ggg">
					<li><span @click="addpwdStr(1)" class="zf_num">1</span></li>
					<li><span @click="addpwdStr(2)" class="zj_x zf_num">2</span></li>
					<li><span @click="addpwdStr(3)" class="zf_num">3</span></li>
					<li><span @click="addpwdStr(4)" class="zf_num">4</span></li>
					<li><span @click="addpwdStr(5)" class="zj_x zf_num">5</span></li>
					<li><span @click="addpwdStr(6)" class="zf_num">6</span></li>
					<li><span @click="addpwdStr(7)" class="zf_num">7</span></li>
					<li><span @click="addpwdStr(8)" class="zj_x zf_num">8</span></li>
					<li><span @click="addpwdStr(9)" class="zf_num">9</span></li>
					<li><span @click="clearpwdStr()" class="zf_empty">清空</span></li>
					<li><span @click="addpwdStr(0)" class="zj_x zf_num">0</span></li>
					<li><span @click="delpwdStr()" class="zf_del">删除</span></li>
				</ul>
			</div>
			<div class="hbbj"></div>
		</div>
	</div>
</template>

<script>
	import api from '@/utils/api';
	export default {
		components: {},

		data() {
			return {
				addr: {},
				accessToken: '',
				goods: [],
				amount: 0,
				goods_amount: 0,
				ispayway: false, //是否显示支付方式弹出框
				istransway: false,
				iscanjuway: false,
				payWay: 2, //支付方式
				transway: 1,
				canjuway: 1,
				remark: '', //备注
				payWaytxt: '',
				transwaytxt: '小哥配送',
				canjuwaytxt: '无',
				youhui: 0,
				paynum: 0, //实际付款
				paypwd: [],
				nopaypwd: [0, 1, 2, 3, 4, 5],
				ispaypwdbyye: false, //是否显示余额支付弹出框
				orderId: '',
				type: 1,
				deliveryTimeInfo: '',
				order_type: 1,
				freight_amount: 0,
				goods_id: '',
				goodslist: [],
				balance_amount: 0,
				user_balance_amount: 0,
				couponlist: [],
				isfrist: true, //是否第一次计算订单
				need_pay_amount: 0, //实付款金额
				isCanpay: false, //是否可以点击支付
				use_balance_flag: true, //是否使用余额
				total_amount: 0, //账户余额
			};
		},

		created() {},
		onShow() {
			var addr = wx.getStorageSync('addr');
			this.order_type = this.$root.$mp.query.order_type || 1;
			let remark = this.$root.$mp.query.remark || null;
			if ((this.order_type != 1) && (this.order_type != 2)) {
				this.goods_id = this.$root.$mp.query.goods_id;
			}
			if (addr) {
				this.addr = addr;
				this.createOrder();
			} else {
				/* 获取默认地址 */
				this.getMemberAddr();
			}
			if (this.order_type == 2) {
				this.remark = '门店前台下单(' + remark + ')桌'
			}
			//console.log(this.globalData.member_id)
			this.user_balance_amount = wx.getStorageSync('userinfo').total_amount || 0
		},
		onLoad() {
			this.balance_amount = 0;
		},
		watch: {
			// ispayway(newval,oldval){
			// 	if(newval!=oldval&&newval=false){
			// 		/* 重新计算订单金额 */
			// 		this.createOrder();
			// 	}
			// }
			ispayway(newName, oldName) {
				if ((newName != oldName) && !newName) {
					/* 重新计算订单金额 */
					this.createOrder();
				}
			}
		},
		methods: {
			/*生成订单*/
			createOrder() {
				var that = this;
				var carlist = [];
				if (this.order_type == 1 || this.order_type == 2) {
					/*获取购物车*/
					var listcar = wx.getStorageSync('listcar');
					if (listcar && listcar.length > 0) {
						carlist = listcar.map(item => {
							return {
								goods_id: item.id,
								qty: item.num
							};
						});
					}
				} else {
					carlist = [{
						goods_id: this.goods_id,
						qty: 1
					}];
				}
				if (isNaN(that.balance_amount)) {
					wx.showToast({
						title: '请输入正确的余额',
						icon: 'none'
					});
					return false
				}
				that.getOrderInfo(carlist);
			},
			/*查询订单详情*/
			getOrderInfo(carlist) {
				var that = this;
				var coupon_ids = '';
				try {
					coupon_ids = that.couponlist.filter(item => item.ischeck).map(item => item.id).join(',');
					if (that.couponlist.filter(item => item.ischeck).length > 0) {
						that.payWaytxt = '使用了' + that.couponlist.filter(item => item.ischeck).length + '张优惠券'
					} else {
						that.payWaytxt = that.couponlist.length > 0 ? '有优惠券' : '无优惠券'
					};
				} catch (e) {
					//TODO handle the exception
				}

				var data = {
					rec_name: that.addr.contact_name,
					rec_phone: that.addr.contact_phone,
					province: that.addr.province,
					city: that.addr.city,
					district: that.addr.district,
					address: that.addr.address,
					self_distribution_flag: that.order_type == 2 ? 0 : that.transway, //到店自提
					pay_id: '-1',
					belong_member_id: that.globalData.member_id,
					remark: that.remark,
					goodsList: carlist,
					order_type: (that.order_type == 1 && that.transway == 0) ? 2 : that.order_type,
					// balance_amount: that.balance_amount,
					use_balance_flag: this.use_balance_flag, //是否使用余额
					coupon_ids: coupon_ids
				};
				api.calcOrder(data).then(function(da) {
					if (da.code == 200) {
						that.goods = da.data.goodsListInfo;
						that.freight_amount = da.data.orderInfo.freight_amount;
						that.amount = da.data.orderInfo.total_amount;
						that.goodslist = da.data.orderInfo.goodsList;
						that.goods_amount = da.data.orderInfo.goods_amount;
						that.need_pay_amount = da.data.orderInfo.need_pay_amount
						that.balance_amount = da.data.orderInfo.balance_amount;
						that.user_balance_amount = da.data.orderInfo.user_balance_amount;
						// console.log(da.data.orderInfo.total_amount);
						// that.youhui = that.youhui.toFixed(2);
						// that.addr = da.data && da.data.length > 0 ? da.data[0] : {};
						// if (that.isfrist) {
						that.getcoupon(that.goods_amount, that.globalData.member_id,coupon_ids);
						// }
						that.isfrist = false;
						that.isCanpay = true; //订单能够被支付
					} else {
						wx.showToast({
							title: da.message,
							icon: 'none'
						});
						that.isCanpay = false;
						setTimeout(
							function() {
								if (da.statusCode == '301') {
									wx.switchTab({
										url: '/pages/list/main'
									});
								}
							}, 800)



					}
				});
			},
			/*支付订单*/
			payOrder() {
				console.log('dizhi' + this.addr.id);
				/* 订单是否能够被支付 */
				if (!this.isCanpay) {
					wx.showToast({
						title: '订单存在错误，不能支付',
						icon: 'none'
					});
					return false;
				}
				if (this.order_type != 2 && this.transway == 1 && (!this.addr || !this.addr.id)) {
					wx.showToast({
						title: '请选择地址',
						icon: 'none'
					});
					return false;
				}
var that = this;
				var coupon_ids = '';
				try {
					coupon_ids = this.couponlist.filter(item => item.ischeck).map(item => item.id).join(',');

				} catch (e) {
					//TODO handle the exception
				}
				
				var data = {
					rec_name: that.addr.contact_name,
					rec_phone: that.addr.contact_phone,
					province: that.addr.province,
					city: that.addr.city,
					district: that.addr.district,
					address: that.addr.address,
					// self_distribution_flag: that.transway, //到店自提
					self_distribution_flag: that.order_type == 2 ? 0 : that.transway, //到店自提
					pay_id: 1,
					belong_member_id: that.globalData.member_id,
					remark: that.remark,
					goodsList: that.goodslist,
					// order_type: that.order_type,
					order_type: (that.order_type == 1 && that.transway == 0) ? 2 : that.order_type,
					// balance_amount: that.balance_amount,
					use_balance_flag: this.use_balance_flag, //是否使用余额
					// balance_amount: that.balance_amount,
					coupon_ids: coupon_ids
				};
				api.submitOrder(data).then(da => {
					if (da.code == 200) {
						wx.removeStorageSync("listcar");
						if (wx.getStorageSync("addr")) {
							wx.removeStorageSync("addr");
						}
						if (that.order_type == 2) {
							/* 清除桌号 */
							wx.removeStorageSync("remark");
						}
						if (that.need_pay_amount == 0) {
							wx.showToast({
								title: '支付成功',
								icon: 'success'
							});
							setTimeout(
								function() {
									wx.redirectTo({
										url: '/pages/order/main'
									});
								}, 400)

							return false
						}

						api.payOrder({
							formData: {
								order_id: da.data.order_no,
								member_id: that.globalData.member_id
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
										setTimeout(
											function() {
												wx.redirectTo({
													url: '/pages/order/main'
												});
											}, 400)
									}
								});
							} else {
								wx.showToast({
									title: data.message,
									icon: 'none'
								});
							}
						});
					} else {
						wx.showToast({
							title: da.message,
							icon: 'none'
						});
					}
				});
			},
			/*点击去支付*/
			payforOrder() {
				/* 先生成订单 */

				if (this.payWay != 2) {
					this.ispaypwdbyye = true;
					this.paypwd = [];
					this.nopaypwd = [0, 1, 2, 3, 4, 5];
				} else {
					this.payOrder();
				}
			},
			/*设置支付方式*/
			setPayWay(item, index) {
				var obj = Object.assign({}, item);
				obj.ischeck = !obj.ischeck;
				console.log(obj.ischeck);
				this.$set(this.couponlist, index, obj)
			},
			/*关闭支付方式弹出框*/
			closepaywaybox(e) {
				var that = this;
				console.log(e);
				if (e.currentTarget.id == e.target.id) that.ispayway = !that.ispayway;
			},

			settransway(num, txt) {
				this.transway = num;
				this.transwaytxt = txt;
				this.istransway = false;
				/* 重新计算订单 */
				this.createOrder();
			},
			/* 关闭运输方式 */
			closetranswaybox(e) {
				var that = this;
				console.log(e);
				if (e.currentTarget.id == e.target.id) that.istransway = false;
			},
			/* 设置餐具 */
			setcanjuway(num, txt) {
				this.canjuway = num;
				this.canjuwaytxt = txt;
				this.iscanjuway = false;
			},
			/* 关闭餐具 */
			closecanjuwaybox(e) {
				var that = this;
				console.log(e);
				if (e.currentTarget.id == e.target.id) that.iscanjuway = false;
			},
			/*支付密码*/
			addpwdStr(num) {
				if (this.paypwd.length < 6) {
					this.paypwd.push(num);
					this.nopaypwd = [];
					for (var i = 0; i < 6 - this.paypwd.length; i++) {
						this.nopaypwd.push(i);
					}
				}
				if (this.paypwd.length == 6) {
					/*todo 支付*/
					this.payOrder();
					this.clearpwdStr();
				}

				//console.log(this.nopaypwd);
			},
			/*清空支付密码*/
			clearpwdStr() {
				this.paypwd = [];
				this.nopaypwd = [];
				for (var i = 0; i < 6 - this.paypwd.length; i++) {
					this.nopaypwd.push(i);
				}
			},
			/*删除支付密码*/
			delpwdStr() {
				this.paypwd.pop();
				this.nopaypwd = [];
				for (var i = 0; i < 6 - this.paypwd.length; i++) {
					this.nopaypwd.push(i);
				}
			},
			/* 获取默认地址 */
			getMemberAddr() {
				var that = this;
				api.getMemberAddr(that.globalData.member_id, 1).then(function(da) {
					var da = da.param;
					if (da.code == 200) {
						that.addr = da.data && da.data.length > 0 ? da.data[0] : {};
						that.createOrder();
					}
				});
			},
			/* 获取优惠券 */
			getcoupon(num, member,coupon_ids) {
				var that = this;
				var coupon_idslist=coupon_ids.split(',')||[];
				console.log(coupon_idslist)
				api.getcoupon(num, member).then(function(da) {
					var da = da.param;
					if (da.code == 200) {
						that.couponlist = da.data;
						if (that.couponlist && that.couponlist.length > 0) {
							that.couponlist = that.couponlist.map(item => {
								item.ischeck = false;
								console.log(coupon_idslist.findIndex(sub=>sub==item.id)>-1)
								if(coupon_idslist.length>0&&coupon_idslist.findIndex(sub=>sub==item.id)>-1){
									console.log(coupon_idslist.findIndex(sub=>sub==item.id))
									item.ischeck = true;
								}
								return item
							})
							// that.payWaytxt = '有优惠券'
						} else {
							// that.payWaytxt = '无优惠券'
						}
						if (that.couponlist.filter(item => item.ischeck).length > 0) {
							that.payWaytxt = '使用了' + that.couponlist.filter(item => item.ischeck).length + '张优惠券'
						} else {
							that.payWaytxt = that.couponlist.length > 0 ? '有优惠券' : '无优惠券'
						};

					}
				});
			},
			/* 修改是否余额 支付*/
			changebalance(e) {
				this.use_balance_flag = e.target.value;
				// let value = e.target.value;
				// console.log(isNaN(value));
				// if (isNaN(value)) {
				// 	this.balance_amount = 0;
				// }
				this.createOrder();
			}
		}
	};
</script>

<style scoped>
	.view li {
		display: block;
		position: relative;
		height: 60px;
		border-bottom: 1px solid #efefef;
		line-height: 60px;
		padding-left: 20px;
		background: #fff;
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

	.view.arrow li>div,
	.view.arrow li a {
		color: #666;
		display: flex;
		align-items: center;
	}

	.view.arrow li>div i,
	.view.arrow li a i {
		display: inline-block;
		width: 40px;
		margin-right: 0;
		text-align: center;
		vertical-align: middle;
		height: 40px;
	}

	.view.arrow li>div span,
	.view.arrow li a span {
		vertical-align: middle;
		font-weight: bold;
	}

	.view.arrow li>div i image,
	.view.arrow li a i image {
		display: block;
		width: 40rpx;
		margin: 0 auto;
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}

	.view.arrow li a i.addr,
	.view.arrow li>div i.time,
	.view.arrow li>div i.payway,
	.view2.arrow li>div i {
		height: 40px;
		vertical-align: middle;
		margin-right: 0;
		width: 30px;
	}

	.view.arrow li .tip {
		font-size: 14px;
		color: #ff5454;
		margin-left: 10px;
	}

	.view.arrow li .pay {
		margin-right: 40px;
		font-size: 14px;
	}

	.notice {
		width: 240px;
		margin: 10px 20px 0;
		line-height: 30px;
		color: #666;
	}

	.orderdetails {
		margin: 10px;
		background: #fff;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	.orderdetails .title {
		background: #ff5454;
		color: #fff;
		text-align: center;
		line-height: 35px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	.orderdetails ul {
		background: #fff;
		border-collapse: collapse;
		width: 100%;
		text-align: center;
		line-height: 30px;
		margin-top: 20px;
	}

	.orderdetails ul li {
		font-size: 28rpx;
	}

	.modbox {
		background: #fff;
		line-height: 45px;
		padding: 0 20px;
		font-size: 28rpx;
	}

	.modbox .paynum {
		color: #ed145b;
		font-size: 18px;
		font-weight: bold;
	}

	.modbox .remark {
		border: none;
		padding: 0 10px;
		text-align: right;
	}

	.gotopay {
		background: #ff5454;
		line-height: 50px;
		position: fixed;
		left: 0;
		bottom: 0;
		color: #fff;
		text-align: center;
		font-size: 15px;
		width: 100%;
		z-index: 999;
	}

	.paywaybox,
	.transwaybox {
		position: fixed;
		bottom: 0;
		left: 0;
		top: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.4);
		z-index: 999;
		display: none;
		opacity: 0;
	}

	.paywaybox.active,
	.transwaybox.active {
		display: block;
		animation: fadeIn 0.3s forwards;
	}

	.paywaybox.active>div,
	.transwaybox.active>div {
		animation: slideInUp 0.3s both;
	}

	.paywaybox.active1>div,
	.transwaybox.active1>div {
		animation: slideOutDown 0.3s both;
	}

	.paywaybox>div,
	.transwaybox>div {
		position: absolute;
		bottom: 0;
		background: #fff;
		left: 0;
		right: 0;
	}

	.paywaybox>div .title,
	.transwaybox>div .title {
		text-align: center;
		line-height: 40px;
		border-bottom: 1px solid #efefef;
	}

	.paywaybox>div ul li,
	.transwaybox>div ul li {
		line-height: 40px;
		margin: 0 10px;
		border-bottom: 1px solid #efefef;
	}

	.paywaybox>div ul li a,
	.transwaybox>div ul li a {
		display: block;
		position: relative;
	}

	.paywaybox>div ul li>a span,
	.transwaybox>div ul li>a span {
		vertical-align: middle;
		color: #333;
		font-size: 12px;
	}

	.paywaybox>div ul li>a image,
	.transwaybox>div ul li>a image {
		display: inline-block;
		/*height: 40px;*/
		width: 40rpx;
		vertical-align: middle;
		margin-right: 20rpx;
		/*	background: no-repeat center center;
		background-size: 20px auto;*/
	}

	.paywaybox>div ul li>a.active:after,
	.transwaybox>div ul li>a.active:after {
		position: absolute;
		right: 10px;
		height: 4px;
		width: 12px;
		content: '';
		border: 3px solid transparent;
		border-left-color: #3cb878;
		border-bottom-color: #3cb878;
		transform: rotate(-45deg);
		top: 14px;
	}

	.taglist span {
		font-weight: bold;
		border-radius: 8rpx;
		padding: 0 10rpx;
		font-size: 28rpx;
		margin: 0 5rpx;
		color: #666;
	}

	.taglist .tag {
		border: 1px solid #3cb878;
		color: #3cb878;
	}

	.taglist .color {
		border: 1px solid #ff5454;
		color: #ff5454;
	}

	.mt5 {
		margin-top: 10rpx;
	}

	.ordergoodslist .goodinfo {
		background: #f9f9f9;
		padding: 0 10px;
		margin-bottom: 10rpx;
		font-size: 24rpx;
		color: #323332;
	}

	.ordergoodslist .goodinfo .imgbox {
		height: 64px;
		width: 64px;
		background: #f29b76;
	}

	.ordergoodslist .goodinfo .imgbox image {
		height: 64px;
		width: 64px;
	}

	.ordergoodslist .goodinfo .goodsname {
		min-height: 4em;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.ordergoodslist .totalprice {
		line-height: 50rpx;
		text-align: right;
		padding-right: 10px;
		border-bottom: 1rpx solid #efefef;
	}

	.ordergoodslist .goodinfo .num {
		color: #ff5454;
	}

	.ftc_wzsf {
		display: none;
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		min-width: 320px;
	}

	.ftc_wzsf.active {
		display: block;
	}

	.ftc_wzsf .hbbj {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 8;
		background: #000;
		opacity: 0.4;
		top: 0;
		left: 0;
	}

	.ftc_wzsf .srzfmm_box {
		position: absolute;
		z-index: 10;
		background: #f8f8f8;
		width: 88%;
		left: 50%;
		margin-left: -44%;
		top: 20%;
	}

	.qsrzfmm_bt {
		font-size: 16px;
		border-bottom: 1px solid #c9daca;
		overflow: hidden;
		text-align: center;
		position: relative;
		line-height: 50px;
	}

	.qsrzfmm_bt a {
		display: block;
		width: 10%;
		padding: 10px 0;
		text-align: center;
	}

	.qsrzfmm_bt span.tx {
		width: 10%;
		/*padding: 10px 0;*/
		padding: 0;
		position: absolute;
		left: 10px;
		top: 0;
		font-size: 30px;
	}

	.qsrzfmm_bt span {
		padding: 15px 5px;
	}

	.zfmmxx_shop {
		text-align: center;
		font-size: 12px;
		padding: 10px 0;
		overflow: hidden;
	}

	.zfmmxx_shop .mz {
		font-size: 14px;
		float: left;
		width: 100%;
	}

	.zfmmxx_shop .zhifu_price {
		font-size: 24px;
		float: left;
		width: 100%;
	}

	.ml5 {
		margin-left: 5px;
	}

	.mm_box {
		width: 89%;
		margin: 10px auto;
		height: 40px;
		overflow: hidden;
		border: 1px solid #bebebe;
	}

	.mm_box li {
		border-right: 1px solid #efefef;
		height: 40px;
		float: left;
		width: 16.3%;
		background: #fff;
	}

	.mm_box li.mmdd {
		background: #fff center no-repeat;
		background-size: 25%;
		position: relative;
	}

	.mm_box li.mmdd:after {
		content: '';
		height: 20px;
		width: 20px;
		display: block;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -10px;
		margin-top: -10px;
		background: #000;
		border-radius: 100%;
	}

	.mm_box li:last-child {
		border-right: none;
	}

	.xiaq_tb {
		padding: 5px 0;
		text-align: center;
		border-top: 1px solid #dadada;
	}

	.numb_box {
		position: absolute;
		z-index: 10;
		background: #f5f5f5;
		width: 100%;
		bottom: 0px;
	}

	.nub_ggg {
		border: 1px solid #dadada;
		overflow: hidden;
		border-bottom: none;
	}

	.nub_ggg li {
		width: 33.3333%;
		border-bottom: 1px solid #dadada;
		float: left;
		text-align: center;
		font-size: 22px;
	}

	.nub_ggg li>span {
		display: block;
		color: #000;
		height: 50px;
		line-height: 50px;
		overflow: hidden;
	}

	.nub_ggg li>span:active {
		background: #e0e0e0;
	}

	.nub_ggg li>span.zj_x {
		border-left: 1px solid #dadada;
		border-right: 1px solid #dadada;
	}

	/*.nub_ggg li span {
		display: block;
		color: #e0e0e0;
		background: #e0e0e0;
		height: 50px;
		line-height: 50px;
		overflow: hidden;
	}
	*/

	.nub_ggg li span.del img {
		width: 30%;
	}

	.forgetpwd {
		color: #ff5454;
		float: right;
		padding-bottom: 18px;
		margin-right: 20px;
		font-size: 24rpx;
	}
</style>
