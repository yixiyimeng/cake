<template>
	<div>
		<div class="new_adres">
			<form method="post">
				<ul>
					<li><input type="text" placeholder="收货人姓名" id="name" v-model="info.contact_name" /></li>
					<li><input type="tel" placeholder="收货人手机" id="tel" v-model="info.contact_phone" /></li>
					<li>
						<picker mode="region" @change="bindRegionChange">
							<view style="color: #666;">选择省市区：{{ info.province }}{{ info.city }}{{ info.district }}</view>
							<!--<input class="picker" placeholder="选择省市区" :value="info.city" />-->
						</picker>
					</li>
					<li><input type="text" placeholder="详细街道地址" id="address" v-model="info.address" /></li>
					<!-- <li><input type="text" placeholder="请输入邮编" id="name" v-model="info.zip" /></li> -->
				</ul>
				<div class="set_default flex flex-pack-justify">
					<div>
						<h3 style="color: #666;">设置为默认地址</h3>
						每次下单时会使用默认地址
					</div>
					<switch @change="switch2Change" :checked="info.is_default == '1'" />
				</div>
				<div class="save_adres" @click="saveAdres()">保存</div>
			</form>
		</div>
	</div>
</template>
<script>
import api from '@/utils/api';
import { regPhone } from '@/utils/index';
export default {
	components: {},

	data() {
		return {
			info: {
				contact_name: '',
				contact_phone: '',
				province: '',
				city: '',
				district: '',
				address: '',
				// zip: '',
				is_default: '0'
			},
			addrId: ''
		};
	},

	created() {},
	mounted() {},
	onShow() {
		var that = this;
		if (this.$root.$mp.query.info) {
			that.addrinfo = JSON.parse(this.$root.$mp.query.info);
			that.addrId = that.addrinfo.id;
			if(that.addrId){
				for (var key in that.info) {
					that.info[key] = that.addrinfo[key];
				}
			}
		
		}
	},
	onHide: function() {},
	onUnload: function() {
		var that = this;
		for (var key in that.info) {
			if (key == 'is_default') {
				that.info[key] = '0';
			} else {
				that.info[key] = '';
			}
		}
		that.addrId = '';
	},
	methods: {
		bindRegionChange(e) {
			console.log(e.mp.detail);
			this.info.province = e.mp.detail.value[0];
			this.info.city = e.mp.detail.value[1];
			this.info.district = e.mp.detail.value[2];
		},
		/*新增收货地址*/
		addAddress(param) {
			api.addAddress(param).then(function(da) {
				var data = da.param;
				if (data.code == 200) {
					wx.showToast({
						title: '新增地址成功',
						icon: 'success'
					});
					wx.navigateBack({
						delta: 1
					});
				} else {
					wx.showToast({
						title: '新增地址失败',
						icon: 'none'
					});
				}
			});
		},
		/*编辑收货地址*/
		editAddress(param,addrId) {
			api.editAddress(param,addrId).then(function(da) {
				var da = da.param;
				if (da.code == 200) {
					wx.showToast({
						title: '编辑地址成功',
						icon: 'success'
					});

					wx.navigateBack({
						delta: 1
					});
				} else {
					wx.showToast({
						title: '编辑地址失败',
						icon: 'none'
					});
				}
			});
		},
		saveAdres() {
			var that = this;
			var param ={
				contact_name:that.info.contact_name,
				contact_phone:that.info.contact_phone,
				province:that.info.province,
				city:that.info.city,
				district:that.info.district,
				address:that.info.address,
				zip:that.info.zip,
				is_default: that.info.is_default
			} 
			for (var key in param) {
				if (param[key]==''&&param[key]!=0 && key != 'zip') {
					console.log(key);
					console.log(param[key])
					wx.showToast({
						title: '请完善地址信息',
						icon: 'none'
					});
					return false;
				}
				if (key == 'contact_phone') {
					if (!regPhone(param['contact_phone'])) {
						wx.showToast({
							title: '请输入正确的手机号码',
							icon: 'none'
						});
						return false;
					}
				}
			}
			param['member_id'] = that.globalData.member_id;
			if (that.addrId) {
				that.editAddress({ formData: param },that.addrId);
			} else {
				that.addAddress({ formData: param });
			}
		},
		switch2Change(e) {
			this.info.is_default = e.mp.detail.value ? '1' : '0';
			//console.log('switch2 发生 change 事件，携带值为', e.mp.detail.value)
		}
	}
};
</script>

<style scoped>
/*swtich整体大小及背景色*/

.wx-switch-input {
	width: 60rpx !important;
	height: 26rpx !important;
}

.wx-switch-input::before {
	width: 60rpx !important;
	height: 26rpx !important;
}
/*绿色样式（true的样式）*/

.wx-switch-input::after {
	width: 30rpx !important;
	height: 26rpx !important;
}

.new_adres ul {
	margin: 0 auto;
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

.set_default {
	border-bottom: 1px solid #e5e5e5;
	background: #fff;
	/*background: #fff url(../img/slider.png) no-repeat 96% center;*/
	padding: 10px;
	color: #89878a;
	font-size: 15px;
	background-size: 55px;
}

.set_default h3 {
	color: #000;
	font-size: 16px;
}

.set_default.checked {
	/*background: #fff url(../img/slider2.png) no-repeat 96% center;
		background-size: 55px;*/
}

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
