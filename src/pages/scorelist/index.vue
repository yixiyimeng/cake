<template>

	<div class="accountlist">
		<ul class="accountlist-hd">
			<li>日期</li>
			<li>充值</li>
			<li>赠送(分)</li>
			<li>积分</li>
		</ul>

		<div v-show="!isMore&&rechargeLog.length==0" class="nodata">
			<image src="/static/images/nodata.jpg" mode='aspectFit' />
		</div>
		<div class="window" v-show="rechargeLog.length>0">
			<!-- <scroll-view scroll-y='auto' class="scroll" :style="{height:scrollhight+'px'}" @scrolltolower="loadresult"> -->
			<ul class="scrollload-content accountlist-bd">
				<li v-for="(item, itemIndex) in rechargeLog" :key='itemIndex'>
					<div>{{item.addtime}}</div>
					<div style="color: green;">+{{item.money}}</div>
					<div style="color:#FFA500">-{{item.x_money}}</div>
					<div>{{item.y_money}}</div>
				</li>
			</ul>
			<!-- </scroll-view> -->

		</div>
	</div>
</template>

<script>
	// import api from '@/utils/api'
	export default {
		components: {},

		data() {
			return {
				scrollhight: 100,
				rechargeLog: [ {
                "addtime": "2018.09.17",
                "money": "0.00",
                "x_money": "72.00",
                "y_money": "1943.20"
            }],
				page: 1,
				isMore: true
			}
		},

		created() {

		},
		onPullDownRefresh: function() {
			this.page = 1;
			wx.showNavigationBarLoading();
			wx.stopPullDownRefresh();
			this.getRechargeLog();
		},
		onReachBottom: function() {
			var self = this;

			this.loadresult()
		},
		onLoad() {
			var that = this;
			wx.getSystemInfo({
				success: function(res) {
					that.scrollhight = res.windowHeight - res.windowWidth * 60 / 750
				}
			});
			that.getRechargeLog()
		},
		methods: {
			getRechargeLog() {
				var that = this;
				var param = {
					accessToken: wx.getStorageSync("accessToken"),
					page: that.page
				};
// 				api.getRechargeLog(param).then(function(da) {
// 					wx.hideNavigationBarLoading(); //隐藏导航条加载动画。
// 					if(da.code == 200) {
// 						if(that.page == 1) {
// 							that.rechargeLog = da.data.lists;
// 						} else {
// 							that.rechargeLog = that.rechargeLog.concat(da.data.lists);
// 						}
// 						if(that.rechargeLog.length >= da.data.count) {
// 							that.isMore = false;
// 						} else {
// 							that.page++
// 						}
// 						console.log(that.isMore)
// 					}
// 				})
			},
			/*加载更多筛选*/
			loadresult() {
				var that = this;
				if(that.isMore) {
					that.getRechargeLog()
				}
			}
		}
	}
</script>

<style scoped>
	/*充值明细*/
	
	.accountlist {
		width: 100%;
	}
	
	.accountlist .accountlist-hd {
		width: 100%;
		overflow: hidden;
		position: fixed;
		top: 0;
	}
	
	.accountlist .accountlist-hd li {
		background: #ff5454;
		color: #fff;
		font-weight: normal;
		line-height: 60rpx;
		float: left;
		width: 20%;
		text-align: center;
	}
	
	.accountlist .accountlist-hd li:first-child,
	.accountlist .accountlist-bd>li>div:first-child {
		width: 40%;
	}
	
	.accountlist .window {
		width: 100%;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		padding-top: 60rpx;
		/* position: absolute;
		top: 60rpx;
		bottom: 0;
		left: 0; */
	}
	
	.accountlist .accountlist-bd>li {
		line-height: 40px;
		border-bottom: 1px solid #efefef;
		text-align: center;
		overflow: hidden;
	}
	
	.accountlist .accountlist-bd>li>div {
		width: 20%;
		float: left;
	}
</style>