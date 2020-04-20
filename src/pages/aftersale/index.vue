<template>
	<div style="background: #f6f6f6;">

		<scroll-view scroll-y='scroll' :style="{height:scrollhight+'px'}" class="myorderlist" @scrolltolower="loadresult(1)"
		 @scrolltoupper="refresh(1)">

			<div class="order-item" v-for="(item, itemIndex) in myorder" :key='itemIndex' :class="{'mt20':itemIndex>0}">
				<div class="flex flex-pack-justify title">
					<span>日期 {{item.add_time}}</span><span>订单号 <font class="red">{{item.order_no}}</font></span>
				</div>
				<div class="orderlist mt10">
					<div class="orderlist-hd">
						<div>名称</div>
						<div>价格</div>
						<div>数量</div>
					</div>
					<ul class="orderlist-bd">
						<li v-for="(subitem, subitemIndex) in item.glists" :key='subitemIndex'>
							<div>{{subitem.title}}</div>
							<div>￥{{subitem.price}}</div>
							<div>{{subitem.nums}}</div>
						</li>
					</ul>
				</div>
				<div class="totalprice">
					<!--共计 10箱 -->合计
					<font class="red">￥{{item.order_amount}}</font>
				</div>
				<div class="tip  flex flex-pack-justify  flex-align-center">
					<span></span>
					<div>
						<span class="btn btn3 ml20" @click="showDialog=!showDialog">申请退款</span></div>
				</div>

			</div>

		</scroll-view>
		<div class="dialog" v-if="showDialog">
			<div class="win-content">
				<img class="close-img" src="/static/images/dele_icon.png" @click="showDialog=!showDialog" />

				<ul class="view arrow">
					<li>
						<div class="flex flex-pack-justify" @click="istkway=!istkway">
							<div><span>退款原因 </span></div>
							<span class="pay">{{tkwaytxt}}</span>
						</div>
					</li>
					<li class="noarrow" v-if="tkway==1">
						<div class="flex  flex-align-center">
							<div><span>退款金额 </span></div>
							<input type="number" class="flex-1" placeholder="最大退款金额20元">
						</div>
					</li>
				</ul>

				<div class="flex">
					<span>退款说明</span>
					<textarea name="" id="" class="flex-1" placeholder="退款说明"></textarea>
				</div>
				<div class="btn" @click="showDialog=!showDialog">确定</div>
			</div>
		</div>
		<div class="tkwaybox" :class="{'active':istkway}" @click="closetkwaybox">
			<div>
				<div class="title">退款方式</div>
				<div>
					<ul>
						<li>
							<a @click="settkway(1,'退款')" :class="{'active':tkway==1}">
								<span>退款</span>
							</a>
						</li>
						<li>
							<a @click="settkway(2,'退货')" :class="{'active':tkway==2}">
								<span>退货</span>
							</a>
						</li>

					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	// import api from '@/utils/api'
	export default {
		components: {},

		data() {
			return {
				tkwaytxt: '退款',
				istkway: false,//显示退款类型
				tkway: 1,
				showDialog: false,//显示退款弹出框
				scrollhight: 100,
				myorder: [{
						"order_amount": "567.00",
						"add_time": "2018-08-25 09:46",
						"order_no": "20180825094639018465",
						"pay_status": "0",
						"beizu": "",
						"glists": [{
								"price": "10.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180503/455aeb04be09f96.png",
								"title": "浅紫绣球",
								"danwei": "1支/扎",
								"level": "B",
								"color": "紫色",
								"nums": "1",
								"id": "260"
							},
							{
								"price": "12.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180505/385aed321708414.png",
								"title": "深紫绣球",
								"danwei": "1支/扎",
								"level": "B",
								"color": "紫色",
								"nums": "1",
								"id": "261"
							},
							{
								"price": "24.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180503/775aeb01f74ead5.png",
								"title": "露茜塔-紫色",
								"danwei": "800克/扎",
								"level": "B",
								"color": "紫色",
								"nums": "1",
								"id": "894"
							},
							{
								"price": "25.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180502/645ae9505f2fd0c.png",
								"title": "向日葵",
								"danwei": "5支/扎",
								"level": "A",
								"color": "黄色",
								"nums": "1",
								"id": "735"
							},
							{
								"price": "26.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180430/155ae6effdaccd5.png",
								"title": "惊艳泡泡",
								"danwei": "10支/扎",
								"level": "B",
								"color": "红色",
								"nums": "1",
								"id": "129"
							},
							{
								"price": "25.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180430/335ae6f0a897706.png",
								"title": "霓虹泡泡",
								"danwei": "10支/扎",
								"level": "B",
								"color": "红色",
								"nums": "1",
								"id": "123"
							},
							{
								"price": "23.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180502/385ae950b45eb1e.png",
								"title": "多橙玫瑰",
								"danwei": "10支/扎",
								"level": "B",
								"color": "橙色",
								"nums": "4",
								"id": "243"
							},
							{
								"price": "13.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180503/185aeb0877be1ec.png",
								"title": "叶上花",
								"danwei": "10支/扎",
								"level": "A",
								"color": "绿色",
								"nums": "25",
								"id": "569"
							}
						]
					},
					{
						"order_amount": "1008.40",
						"add_time": "2018-07-12 17:25",
						"order_no": "20180712172546825766",
						"pay_status": "0",
						"beizu": "",
						"glists": [{
								"price": "20.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180504/345aec65bb4f090.png",
								"title": "西伯利亚2头",
								"danwei": "10支/扎",
								"level": "B",
								"color": "白色",
								"nums": "3",
								"id": "347"
							},
							{
								"price": "20.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180505/155aed31362c5e1.png",
								"title": "黄水晶",
								"danwei": "1000g/扎",
								"level": "B",
								"color": "黄色",
								"nums": "3",
								"id": "395"
							},
							{
								"price": "26.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180430/815ae6afdeb37dd.png",
								"title": "拍市卡罗拉",
								"danwei": "20支/扎",
								"level": "C",
								"color": "红色",
								"nums": "4",
								"id": "162"
							},
							{
								"price": "18.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180430/885ae6c2803c0d4.png",
								"title": "影星",
								"danwei": "20支/扎",
								"level": "B",
								"color": "粉色",
								"nums": "2",
								"id": "194"
							},
							{
								"price": "20.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180430/725ae6d3365d4b6.png",
								"title": "戴安娜",
								"danwei": "20支/扎",
								"level": "C",
								"color": "粉色",
								"nums": "2",
								"id": "168"
							},
							{
								"price": "20.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180430/385ae6d31ec10a7.png",
								"title": "坦尼克",
								"danwei": "20支/扎",
								"level": "C",
								"color": "白色",
								"nums": "2",
								"id": "186"
							},
							{
								"price": "18.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180430/385ae6f6f802cfe.png",
								"title": "狂欢",
								"danwei": "20支/扎",
								"level": "B",
								"color": "黄色",
								"nums": "8",
								"id": "289"
							},
							{
								"price": "17.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180503/505aeafa5f80812.png",
								"title": "佳农",
								"danwei": "20支/扎",
								"level": "B",
								"color": "黄色",
								"nums": "5",
								"id": "886"
							},
							{
								"price": "26.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180430/685ae6c38ceb261.png",
								"title": "粉佳人",
								"danwei": "20支/扎",
								"level": "B",
								"color": "粉色",
								"nums": "9",
								"id": "199"
							},
							{
								"price": "39.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180503/545ae9f4c00fff4.png",
								"title": "马蒂斯",
								"danwei": "10支/扎",
								"level": "A",
								"color": "粉色",
								"nums": "2",
								"id": "484"
							},
							{
								"price": "32.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180501/535ae74626f324c.png",
								"title": "满天星",
								"danwei": "1KG/扎",
								"level": "B",
								"color": "白色",
								"nums": "2",
								"id": "408"
							},
							{
								"price": "29.80",
								"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180504/575aec66e474889.png",
								"title": "百万星-蓝色（吸色）",
								"danwei": "500g/扎",
								"level": "B",
								"color": "蓝色",
								"nums": "1",
								"id": "453"
							}
						]
					}
				]


			}
		},
		methods: {

			settkway(num, txt) {
				this.tkway = num;
				this.tkwaytxt = txt;
				this.istkway = false;
			},
			closetkwaybox(e) {
				var that = this;
				if (e.currentTarget.id == e.target.id)
					that.istkway = false
			},
		},

		created() {},
		onShow() {
			this.accessToken = wx.getStorageSync("accessToken");

		},
		onLoad() {
			var that = this;
			wx.getSystemInfo({
				success: function(res) {
					that.scrollhight = res.windowHeight - res.windowWidth * 100 / 750
					//console.log("123"+res.windowHeight);
				}
			});

		}
	}
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
		width: 33.33%;
		text-align: center;
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
		background: rgba(0, 0, 0, .5);
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

	.win-content {
		font-size: 14px;
	}

	.view input,
	.win-content>div textarea {
		margin-left: 20px;
	}

	.view li {
		padding-right: 20px;
		padding-left: 10px;

	}

	.view.arrow li:not(.noarrow):after {
		right: 0;
	}

	.win-content>div {
		padding: 10px;
	}

	.tkwaybox {
		position: fixed;
		bottom: 0;
		left: 0;
		top: 0;
		width: 100%;
		background: rgba(0, 0, 0, .4);
		z-index: 999;
		display: none;
		opacity: 0;
	}

	.tkwaybox.active {
		display: block;
		animation: fadeIn .3s forwards;
	}

	.tkwaybox.active>div {
		animation: slideInUp .3s both;
	}

	.tkwaybox.active1>div {
		animation: slideOutDown .3s both;
	}

	.tkwaybox>div {
		position: absolute;
		bottom: 0;
		background: #fff;
		left: 0;
		right: 0;
	}

	.tkwaybox>div .title {
		text-align: center;
		line-height: 40px;
		border-bottom: 1px solid #efefef;
	}

	.tkwaybox>div ul li {
		line-height: 40px;
		margin: 0 10px;
		border-bottom: 1px solid #efefef;
	}

	.tkwaybox>div ul li a {
		display: block;
		position: relative;
	}

	.tkwaybox>div ul li>a span {
		vertical-align: middle;
		color: #333;
		font-size: 12px;
	}

	.tkwaybox>div ul li>a.active:after {
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
</style>
