<template>
	<div>
		<div style="background: #f6f6f6;">
			<div class="my_adres">
				<div v-show="addrlist.length == 0" class="nodata">
					<image src="/static/images/nodata.jpg" mode="aspectFit" />
				</div>
				<scroll-view scroll-y="auto" class="scroll" :style="{ height: scrollhight + 'px' }" v-if="addrlist.length >= 0">
					<ul>
						<li v-for="(item, itemIndex) in addrlist" :key="itemIndex">
							<div class="adres_Info" @click="setAddr(item)">
								<p class="flex flex-pack-justify">
									<label>{{ item.contact_name }}</label>
									<span>{{ item.contact_phone }}</span>
								</p>
								<p>{{ item.province }}{{ item.city }}{{ item.district }}{{ item.address }}</p>
							</div>
							<div class="adres_op flex flex-align-center flex-pack-justify">
								<div class="setDefault" :class="{ checked: item.is_default == '1' }" @click="setdefault(item.is_default, itemIndex)">
									<image src="/static/images/circle.png" mode="aspectFit" v-if="item.is_default == '0'" />
									<image src="/static/images/circle2.png" mode="aspectFit" v-if="item.is_default == '1'" />
									<span>设为默认</span>
								</div>
								<div>
									<div class="edit_adres" @click="editAddr(item)">
										<image src="/static/images/edit.png" mode="aspectFit" />
										<span>编辑</span>
									</div>
									<div class="del_adres ml20" @click="delAddr(item.id)">
										<image src="/static/images/del.png" mode="aspectFit" />
										<span>删除</span>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</scroll-view>
				<div class="adresBtn">
					<a href="../addaddress/main">
						<img src="/static/images/plus2.png" mode="aspectFit" />
						添加新地址
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/utils/api';
	export default {
		components: {},

		data() {
			return {
				scrollhight: 100,
				addrlist: [],
				type: ''
			};
		},

		created() {},
		onPullDownRefresh: function() {
			wx.showNavigationBarLoading();
			wx.stopPullDownRefresh();
			this.getaddressList();
		},
		onLoad() {
			var that = this;
			wx.getSystemInfo({
				success: function(res) {
					that.scrollhight = res.windowHeight - (res.windowWidth * 160) / 750;
				}
			});
			//console.log(12)
			if (this.$root.$mp.query.type) {
				that.type = this.$root.$mp.query.type;
				console.log(that.type);
			}
		},
		onShow() {
			var that = this;
			that.getaddressList();
		},
		methods: {
			bindDateChange(e) {
				console.log(e);
				this.activity.endDate = e.mp.detail.value;
			},
			bindRegionChange(e) {
				this.region = e.mp.detail.value;
			},
			getaddressList() {
				var that = this;
				api.getMemberAddr(that.globalData.member_id).then(function(da) {
					wx.hideNavigationBarLoading();
					var da = da.param;
					if (da.code == 200) {
						that.addrlist = da.data;
					}
				});
			},
			editAddr(item) {
				const addrinfo = JSON.stringify(item);
				const url = `../addaddress/main?info=${addrinfo}`;
				wx.navigateTo({
					url
				});
			},
			delAddr(id) {
				var that = this;
				wx.showModal({
					title: '提示',
					content: '你确定要删除这条数据吗',
					success(res) {
						if (res.confirm) {
							api.delAddress(id).then(function(da) {
								var da = da.param;
								if (da.code == 200) {
									wx.showToast({
										title: '删除地址成功',
										icon: 'success'
									});
									that.getaddressList();
								}
							});
							// console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			setdefault(state, index) {
				if (state != '1') {
					var that = this;

					that.addrlist.filter(item => {
						item.is_default = '0';
					});
					that.addrlist[index].is_default = '1';
					api.editAddress({
						formData: {
							is_default: '1',
							member_id: that.globalData.member_id
						}
					}, that.addrlist[index].id).then(function(da) {
						var da = da.param;
						if (da.code == 200) {
							wx.showToast({
								title: '设置默认地址成功',
								icon: 'success'
							});

						} else {
							wx.showToast({
								title: '设置默认地址失败',
								icon: 'none'
							});
						}
					});

				}
			},
			setAddr(item) {
				var that = this;
				if (that.type) {
					var addr = item;
					wx.setStorageSync('addr', addr);
					wx.navigateBack({
						delta: 1
					});
				}
			}
		}
	};
</script>

<style scoped>
	/*地址*/

	.my_adres ul {
		font-size: 28rpx;
		margin: 0 auto;
	}

	.my_adres ul li {
		background: #fff;
		line-height: 23px;
		font-size: 14px;
		margin: 0 0 10px;
	}

	.adres_Info {
		border-bottom: 1px solid #e5e5e5;
		padding: 10px;
	}

	.adres_op {
		padding: 10px;
	}

	.adres_op .setDefault,
	.adres_op .edit_adres,
	.adres_op .del_adres {
		display: inline-block;
		color: #434343;
		height: 40rpx;
	}

	.adres_op .setDefault image,
	.adres_op .edit_adres image,
	.adres_op .del_adres image {
		width: 40rpx;
		height: 40rpx;
		display: inline-block;
		vertical-align: middle;
	}

	.adres_op .setDefault span,
	.adres_op .edit_adres span,
	.adres_op .del_adres span {
		display: inline-block;
		vertical-align: middle;
		margin-left: 10rpx;
		margin-top: -4rpx;
	}

	/*.adres_op a.setDefault.checked {
		background: url(../img/circle2.png) no-repeat left center;
		background-size: 20px;
	}
	
	.adres_op .edit_adres {
		background: url(../img/edit.png) no-repeat left center;
		background-size: 18px;
	}
	
	.adres_op .del_adres {
		background: url(../img/del.png) no-repeat left center;
		background-size: 18px;
		margin-left: 20px
	}*/

	.adresBtn a {
		position: fixed;
		width: 100%;
		background: #fff;
		text-align: center;
		padding: 15px 0;
		bottom: 0;
		border-top: 1px solid #e5e5e5;
		font-size: 16px;
		display: block;
		color: #434343;
		height: 100rpx;
		line-height: 100rpx;
	}

	.adresBtn a img {
		vertical-align: middle;
		width: 40rpx;
		margin: 0 5px;
		height: 40rpx;
	}

	.no_adres {
		text-align: center;
		color: #d4d4d4;
		font-size: 16px;
		line-height: 30px;
		position: fixed;
		top: 50%;
		left: 50%;
		margin-left: -49px;
		margin-top: -48px;
		display: none;
	}

	.no_adres img {
		max-width: 100%;
	}

	.new_adres ul {
		margin: 0 auto 20px;
		background: #fff;
	}

	.new_adres ul li {
		border-bottom: 1px solid #e5e5e5;
		margin-left: 10px;
		padding: 12px 0;
		font-size: 15px;
	}

	.new_adres ul li input {
		width: 95%;
		height: 25px;
		line-height: 25px;
		border: none;
		font-size: 15px;
	}

	/*.set_default {
		border-bottom: 1px solid #E5E5E5;
		border-top: 1px solid #E5E5E5;
		background: #fff url(../img/slider.png) no-repeat 96% center;
		padding: 10px;
		color: #89878A;
		font-size: 15px;
		background-size: 55px;
	}
	
	.set_default h3 {
		color: #000;
		font-size: 16px;
	}
	
	.set_default.checked {
		background: #fff url(../img/slider2.png) no-repeat 96% center;
		background-size: 55px;
	}*/

	.save_adres {
		display: block;
		background: #e94858;
		color: #fff;
		font-size: 16px;
		padding: 10px 0;
		width: 95%;
		margin: 50px auto 20px;
		text-align: center;
		border-radius: 4px;
	}
</style>
