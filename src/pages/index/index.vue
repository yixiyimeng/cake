<template>
	<div class="bgf8">
		<div class="wrap">
			<view class="slide">
				<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-color="#fff"
				 indicator-active-color="#ff5454">
					<swiper-item v-for="(item, itemIndex) in imglist" :key="itemIndex">
						<navigator :url="item.jump_url">
							<image class="slide-image" :src="item.image_url" />
						</navigator>
						<!-- <navigator :url="''"><image class="slide-image" :src="host + item.image_url" /></navigator> -->
					</swiper-item>
				</swiper>
			</view>
			<div class="notice flex">
				公告:
				<div class="flex-1">
					<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" :vertical="true">
						<swiper-item v-for="(item, itemIndex) in notice" :key="itemIndex">
							<p>{{ item.content }}</p>
						</swiper-item>
					</swiper>
				</div>
			</div>
			<div class="menubox flex">
				<button open-type="contact" class="orderBtn">
					<image src="/static/images/11.jpg" class="bgimg" /></button>

				<!-- <div class="orderBtn" @click="showDialog = !showDialog"><image src="/static/images/11.jpg" class="bgimg" /></div> -->
				<div style="margin-left: 12rpx;" class="flex-1">
					<!-- :url="'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id='+liveinfo?liveinfo.roomid:''" -->
					<navigator class="bulkBtn">
						<image src="/static/images/14.jpg" class="bgimg" />
					</navigator>
					<div class="flex flex-pack-justify mt10">
						<navigator class="readBtn flex-1" url="/pages/jkarticlelist/main?type=0">
							<image src="/static/images/13.jpg" class="bgimg" />
						</navigator>
						<navigator class="transportBtn flex-1 ml10" url="/pages/jkarticlelist/main?type=1">
							<image src="/static/images/15.jpg" class="bgimg" />
						</navigator>
					</div>
				</div>
			</div>
			<!--今日特价-->
			<div class="modbox bgfff">
				<div class="modtitle flex flex-pack-justify">
					<div>产品推荐</div>
					<navigator class="more" url="/pages/list/main" open-type="switchTab">更 多 +</navigator>
				</div>
				<div style="margin: 10rpx;">
					<swiper class="subswiper" :indicator-dots="false" :autoplay="true" :circular="true" :interval="3000" :duration="1000"
					 :display-multiple-items="todayTj.length > 4 ? 4 : todayTj.length">
						<swiper-item v-for="(item, itemIndex) in todayTj" :key="itemIndex" style="text-align: left;">
							<div style="width: 180rpx; text-align: center;">
								<navigator url="/pages/list/main" open-type="switchTab">
									<image class="slide-image" :src="item.pic?item.pic[0]:''" mode="aspectFit" />
									<text class="goods-text">{{ item.name }}</text>

									<text class="goods-price">￥{{ item.take_out_price?item.take_out_price.min:0 }}</text>
								</navigator>
							</div>
						</swiper-item>
					</swiper>
				</div>
			</div>
			<div class="modbox " v-if="tgGoods.length > 0">
				<div class="modtitle flex flex-pack-justify">
					<div>个人团购</div>
				</div>
				<div>
					<ul class="bulkList">
						<li v-for="(item, itemIndex) in tgGoods" :key="itemIndex">
							<div class="flex">
								<!-- <navigator url="/pages/orderdetails/main?order_type=2" class="flex"> -->
								<div class="imgbox">
									<image class="image" lazy-load="true" :src="item.pic?item.pic[0]:''" @click="previewImage(item.pic, item.pic[0])" />
								</div>
								<div class="flex-1" @click="gotopage(item)">
									<!-- <navigator :url="'/pages/orderdetails/main?order_type=3&goods_id=' + item.id" > -->
									<p class="name">{{ item.name }}</p>
									<!-- 团购套餐独立运营,不予分类订单合并,拼团成功后不予退款 -->
									<p class="describe">{{grinfo}}</p>
									<div class="btnbox flex flex-pack-justify flex-align-center">
										<div>
											<!-- <span class="savemoney">已团购数量{{ item.tg_num }}/{{ item.goods_nums }}</span> -->
											<span class="price">
												团购价：
												<span style="font-weight: bold; font-size: 14px;">￥</span>
												{{ item.personal_group_price}}元
											</span>
										</div>
										<span class="show">下单团购</span>
									</div>
								</div>
								<!-- </navigator> -->
								<!-- </navigator> -->
							</div>
						</li>
					</ul>
				</div>
			</div>
			<!--团购套餐-->
			<div class="modbox" v-if="dwtgGoods.length > 0">
				<div class="modtitle flex flex-pack-justify">
					<div>单位团购</div>
				</div>
				<div>
					<ul class="bulkList">
						<li v-for="(item, itemIndex) in dwtgGoods" :key="itemIndex">
							<div class="flex">
								<!-- <navigator url="/pages/orderdetails/main" class="flex"> -->
								<div class="imgbox">
									<image class="image" lazy-load="true" :src="item.pic?item.pic[0]:''" @click="previewImage(item.pic, item.pic[0])" />
								</div>
								<div class="flex-1">
									<p class="name">{{ item.name }}</p>
									<!-- 团购套餐独立运营,不予分类订单合并,拼团成功后不予退款 -->
									<p class="describe">{{qyinfo}}</p>
									<div class="btnbox flex flex-pack-justify flex-align-center">
										<div>
											<!-- <span class="savemoney">已团购数量{{ item.tg_num }}/{{ item.goods_nums }}</span> -->
											<span class="price">
												团购价：
												<span style="font-weight: bold; font-size: 14px;">￥</span>
												{{ item.enterprise_group_price}}元
											</span>
										</div>
										<span class="show" @click="showModel(item)">下单团购</span>
									</div>
								</div>
								<!-- </navigator> -->
							</div>
						</li>
					</ul>
				</div>
			</div>
			<!-- cropRight -->
			<div class="cropRight">
				<image src="/static/images/cropright.png" mode="widthFix"></image>
				<div>
					<p class="name">小程序制作请联系微信：xhh527317</p>
					<p>©2013-{{today}}核桃妹的妈妈</p>
				</div>
			</div>
			<modal :hidden="hiddenmodalput" title="请输入单位邀请码" confirm-text="确定" cancel-text="取消" @cancel="cancelempty" @confirm="confirmempty">
				<input type="text" placeholder="请输入单位邀请码" class="yqm" v-model="tgcode" />
			</modal>
			<div class="dialog" v-if="showDialog">
				<div class="win-content">
					<img class="close-img" src="/static/images/dele_icon.png" @click="showDialog = !showDialog" />
					<div>
						<div>尺寸</div>
						<div>
							<span class="tag" :class="{ active: item == chicuntxt }" @click="chicuntxt = item" v-for="(item, index) in chicunlist"
							 :key="index">{{ item }}</span>
						</div>
					</div>
					<div>水果夹心</div>
					<div>
						<span class="tag" @click="shuiguotxt = item" :class="{ active: item == shuiguotxt }" v-for="(item, index) in shuiguolist"
						 :key="index">{{ item }}</span>
					</div>

					<div class="btn" @click="showDialog = !showDialog">接入人工服务下单订制</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/utils/api';
	import {
		host
	} from '@/utils/request';
	export default {
		data() {
			return {
				host,
				userInfo: {},
				isLoad: false,
				hiddenmodalput: true,
				showDialog: false, //订制蛋糕
				imglist: [],
				notice: [],
				newGoods: [],
				todayTj: [],
				tgGoods: [],
				dwtgGoods: [],
				pqReadId: '',
				transDescId: '',
				chicunlist: ['6寸', '8寸', '10寸', '12寸', '10+6寸', '12+8寸'],
				shuiguolist: ['水果', '芒果', '火龙果', '提子'],
				chicuntxt: '',
				shuiguotxt: '',
				tgcode: '',
				enterprise_goods_id: '',
				qyinfo: '',
				grinfo: '',
				liveinfo: null,
				today:null
			};
		},

		components: {},
		onShow() {
			let that = this;
		},
		onLoad() {
			this.getmsglist();
			this.getbannerlist();
			this.getOnegoods(1); //查询商品
			this.gettggoods(2, {
				personal_group_flag: 1
			}); //查询个人团购
			this.gettggoods(3, {
				enterprise_group_flag: 1
			}); //查询企业团购
			this.getGroupMoreInfo();
		},
		created() {
			// 只被创建一次
			// wx.login({
			// 	success: res => {
			// 		console.log(res);
			// 		api.getOpenId(res.code).then(da => {
			// 			let param = JSON.parse(da.param);
			// 			if (param.code == 200) {
			// 				//console.log(da.data);
			// 				var openid = param.data.openid;
			// 				wx.setStorageSync('openid', openid);
			// 				api.getMember(openid).then(da => {
			// 					var data = da.param.data;
			// 					if (da.param.code == 200) {
			// 						wx.setStorageSync('isLogin', 1);
			// 						wx.setStorageSync('userinfo', data.list[0]);
			// 						this.globalData.member_id = data.list[0].id;
			// 					}
			// 				});
			// 			}
			// 		});
			// 	}
			// });
			/* 设置初始常量 */
			this.globalData.userInfo = {
				name: '核桃妹的妈妈',
				logo: '/static/images/webwxgetmsgimg.jpg'
			};
			wx.setStorageSync('login_code', '5c906ce579857');
			// this.getlive()
			this.today = new Date().getFullYear()
			
		},
		methods: {
			getmsglist() {
				api.getmsglist().then(da => {
					if (da.code == 0) {
						console.log(da.data);
						this.notice = da.data;
					}
				});
			},
			getbannerlist() {
				let that = this;
				api.getbannerlist().then(da => {
					if (da.code == 0) {
						console.log(da.data);
						if (da.data && da.data.length > 0) {
							that.imglist = da.data.map(item => {
								// item.image_url = host + item.image_url;
								return item;
							});
						}
					}
				});
			},
			previewImage: function(imgalist, current) {
				//var current = e.target.dataset.src;
				wx.previewImage({
					current: current,
					urls: imgalist
				});
			},
			getUserInfo() {
				// 调用登录接口
				wx.login({
					success: () => {
						wx.getUserInfo({
							success: res => {
								this.userInfo = res.userInfo;
								console.log(this.userInfo)
								//wx.setStorageSync('isLogin', 1);
								// 						wx.setStorageSync('userinfo', data.list[0]);
								// 						this.globalData.member_id = data.list[0].id;
							}
						});
					}
				});
			},
			clickHandle(msg, ev) {
				console.log('clickHandle:', msg, ev);
			},
			show() {
				this.isLoad = !this.isLoad;
			},
			gotopage(item) {
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
								console.log('用户点击取消');
							}
						}
					});
				} else {
					const url = '/pages/orderdetails/main?order_type=3&goods_id=' + item.id;
					wx.navigateTo({
						url
					});
				}
			},
			showModel(item) {
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
								console.log('用户点击取消');
							}
						}
					});
				} else {
					this.enterprise_goods_id = item.id;
					this.hiddenmodalput = false;
					this.tgcode = ''
				}
			},
			cancelempty() {
				this.hiddenmodalput = true;
			},
			confirmempty() {
				if (!this.tgcode) {
					wx.showToast({
						title: '请输入单位邀请码',
						icon: 'none'
					});
					return false;
				}
				api.invitation(this.tgcode).then(da => {
					if (da.code == 200) {
						this.hiddenmodalput = true;
						const url = '/pages/orderdetails/main?order_type=4&goods_id=' + this.enterprise_goods_id + '&tgcode=' + this.tgcode;
						wx.navigateTo({
							url
						});
					} else {
						wx.showToast({
							title: '单位邀请码验证失败',
							icon: 'none'
						});
					}
				})

			},
			gettggoods(type, data){
				var that = this;
				var param = Object.assign({
						take_out_flag: 1,
						up_down: 1,
						limit: 10,
						page: 1
					},
					data
				);
				api.gettggoods(param).then(da => {
					if (da.param.code == 200) {
						var list = [];
						if (da.param.data.list && da.param.data.list.length > 0) {
							list = da.param.data.list;
						}
						if (type == 1) {
							that.todayTj = list;
						} else if (type == 2) {
							that.tgGoods = list;
						} else {
							that.dwtgGoods = list;
						}
					}
				});
			},
			getOnegoods(type, data) {
				var that = this;
				var param = Object.assign({
						take_out_flag: 1,
						up_down: 1,
						limit: 10,
						page: 1
					},
					data
				);
				api.getgoods(param).then(da => {
					if (da.param.code == 200) {
						var list = [];
						if (da.param.data.list && da.param.data.list.length > 0) {
							list = da.param.data.list;
						}
						if (type == 1) {
							that.todayTj = list;
						} else if (type == 2) {
							that.tgGoods = list;
						} else {
							that.dwtgGoods = list;
						}
					}
				});
			},
			getGroupMoreInfo() {
				api.getGroupMoreInfo().then(data => {
					let da = data.param;
					if (da.code == 200) {
						this.qyinfo = da.data['2'].data;
						this.grinfo = da.data['1'].data
					} else {
						wx.showToast({
							title: da.message,
							icon: 'none'
						});
					}
				})
			},
			getlive() {
				api.getlive().then(da => {
					if (da.errmsg == 'ok') {
						let data = da.room_info[0];
						// this.liveinfo=data;
						// if (data.live_status == 101 || data.live_status == 102) {
						// 	this.liveinfo = data;
						// } else {
						// 	this.liveinfo = null
						// }
						this.liveinfo = data;
					}
				})
			}
		}
	};
</script>

<style scoped>
	.yqm {
		border-radius: 5px;
		border: 1px solid #ddd;
		line-height: 40px;
		height: 40px;
		font-size: 28rpx;
		padding: 0 10px;
	}

	.bgfff {
		background: #fff;
	}

	.modbox {
		border-top: 1px solid #e5e5e5;
		border-bottom: 1px solid #e5e5e5;
		/* padding-top: 10px; */
	}

	.swiper {
		height: 434rpx;
	}

	.swiper navigator {
		height: 100%;
	}

	.slide-image {
		height: 100%;
		width: 100%;
		display: block;
	}

	.subswiper {
		height: 210rpx;
	}

	.subswiper swiper-item {
		position: relative;
		padding: 5rpx 10rpx;
		box-sizing: border-box;
		text-align: center;
		font-size: 20rpx;
	}

	.subswiper swiper-item .slide-image {
		height: 150rpx;
	}

	.subswiper swiper-item .goods-text {
		width: 100%;
		display: block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		/*	position: absolute;
		bottom: 0;*/
		color: #434343;
	}

	.subswiper swiper-item .goods-price {
		color: #ff5454;
	}

	.recomlist {
		padding: 0 10rpx;
	}

	.recomlist li {
		float: left;
		width: 33.33%;
		padding: 10rpx;
		box-sizing: border-box;
	}

	.recomlist li navigator {
		display: block;
		position: relative;
		width: 100%;
	}

	.recomlist li navigator .image {
		display: block;
		width: 100%;
		height: 200rpx;
	}

	.recomlist li navigator .goods-text {
		position: absolute;
		background: rgba(0, 0, 0, 0.7);
		left: 0;
		right: 0;
		bottom: 0;
		color: #fff;
		text-align: center;
		line-height: 40rpx;
		font-size: 18rpx;
	}

	.notice {
		color: #ff5454;
		height: 50rpx;
		background: #fff2f2;
		border-bottom: 1px solid #eee;
		border-top: 1px solid #eee;
		line-height: 50rpx;
		font-size: 24rpx;

	}

	.notice:before {
		height: 50rpx;
		display: block;
		content: '';
		width: 6rpx;
		background: #ff5454;
		margin-right: 20rpx;
	}

	.notice p {
		color: #434343;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;

	}

	.menubox {
		padding: 12rpx;
	}

	.menubox .orderBtn {
		width: 140px;
		height: 152px;
		text-align: center;
		color: #434343;
		font-size: 14px;
		padding: 0;
		border-radius: 0;
		border: none;
	}

	.menubox .orderBtn .bgimg {
		display: block;
		width: 140px;
		height: 150px;
	}

	.menubox .bulkBtn {
		display: block;
		width: 100%;
		height: 72px;
		color: #434343;
		font-size: 14px;
	}

	.menubox .readBtn {
		height: 72px;
		width: 104px;
		background: #ffedce;
	}

	.menubox .bgimg {
		height: 100%;
		width: 100%;
		display: block;
	}

	.menubox .transportBtn {
		height: 72px;
		width: 104px;
		text-align: center;
		background: #cdf4ff;
	}

	.modtitle {
		font-size: 18rpx;
		color: #fff;
		background: #fff;
		padding-top: 20rpx;
	}

	.modtitle div {
		background: #ff5454;
		position: relative;
		height: 40rpx;
		line-height: 40rpx;
		display: inline-block;
		padding-left: 25rpx;
		padding-right: 10px;
	}

	.modtitle div:after {
		content: '';
		display: block;
		border: 21rpx solid transparent;
		border-left-color: #ff5454;
		position: absolute;
		right: -37rpx;
		top: 0;
	}

	.modtitle .more {
		border: 1px solid #ff5454;
		border-radius: 5px;
		color: #ff5454;
		display: inline-block;
		text-align: center;
		margin-right: 23rpx;
		width: 100rpx;
		line-height: 36rpx;
	}

	.bulkList li {
		padding: 20rpx;
		background: #fff;
		margin-bottom: 10rpx;
		overflow: hidden;
	}

	.bulkList li .imgbox {
		position: relative;
		width: 225rpx;
		height: 225rpx;
		box-shadow: 0 0 10rpx rgba(0, 0, 0, .1);
	}

	.bulkList li .imgbox image {
		display: block;
		height: 100%;
		width: 100%;
	}

	.bulkList li .imgbox .num {
		height: 30rpx;
		line-height: 30rpx;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		text-align: center;
		font-size: 18rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.bulkList li .flex-1 {
		margin-left: 15rpx;
		position: relative;
		height: 225rpx;
	}

	.bulkList li .name {
		font-size: 24rpx;
		color: #434343;
		font-weight: bold;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.bulkList li .describe {
		font-size: 20rpx;
		color: #9c9c9c;
		margin-top: 0;
		word-break: break-all;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}

	.bulkList li .btnbox {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
	}

	.bulkList li .btnbox .price {
		color: #ff5454;
		font-weight: bold;
		font-size: 24rpx;
		margin-top: 3rpx;
		display: block;
	}

	.bulkList li .btnbox .savemoney {
		color: #5c5c5c;
		font-size: 20rpx;
		margin-top: 3rpx;
		display: block;
	}

	.bulkList li .btnbox .show {
		height: 45rpx;
		width: 143rpx;
		background: #ffd260;
		color: #323332;
		font-size: 24rpx;
		text-align: center;
		line-height: 45rpx;
		border-radius: 5rpx;
	}

	.bulkList li .over {
		position: relative;
	}

	.bulkList li .over .overbox {
		background: rgba(0, 0, 0, 0.4);
		height: 100%;
		width: 100%;
		position: absolute;
		text-align: center;
		line-height: 100%;
	}

	.bulkList li .over .overbox .overimg {
		width: 80%;
		display: inline-block;
	}

	.copyright {
		text-align: center;
		font-size: 24rpx;
		color: #666;
		line-height: 80rpx;
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

	.dialog .tag {
		color: #ff5555;
		border: 1px solid #ff5555;
		border-radius: 5px;
		margin: 20rpx 1%;
		padding: 10rpx 20rpx;
		display: inline-block;
		font-size: 40rpx;
		min-width: 25%;
		box-sizing: border-box;
		text-align: center;
	}

	.dialog .tag.active {
		background: #ff5555;
		color: #fff;
	}

	.dialog .btn {
		background: #f00;
		border-radius: 5px;
		color: #fff;
		text-align: center;
		font-size: 40rpx;
		line-height: 40px;
		height: 40px;
	}
</style>
