<template>

    <div class="accountlist">
        <ul class="accountlist-hd">
            <li>日期</li>
            <li>充值</li>
            <li>消费</li>
            <li>余额</li>
        </ul>

        <div v-show="!isMore&&rechargeLog.length==0" class="nodata">
            <image src="/static/images/nodata.jpg" mode='aspectFit'/>
        </div>
        <div class="window" v-show="rechargeLog.length>0" :style="{height:scrollhight+'px'}">
            <!-- <scroll-view scroll-y='auto' class="scroll" :style="{height:scrollhight+'px'}" @scrolltolower="loadresult"> -->
            <ul class="scrollload-content accountlist-bd">
                <li class="flex-align-center flex" v-for="(item, itemIndex) in rechargeLog" :key='itemIndex'>
                    <div>{{item.created_at}}</div>
                    <div style="color: green;">+{{item.income}}</div>
                    <div style="color:#FFA500">-{{item.expenses}}</div>
                    <div>{{item.total_amount_after}}</div>
                </li>
            </ul>
            <!-- </scroll-view> -->

        </div>
        <!-- <div class="flex flex-pack-justify" style="padding: 0 20rpx;"><span>累积充值金额</span><span>{{accumulated_recharge_amount}}元</span>
        </div> -->
    </div>
</template>

<script>
    import api from '@/utils/api'

    export default {
        components: {},

        data() {
            return {
                accumulated_recharge_amount: 0,
                scrollhight: 100,
                rechargeLog: [],
                page: 1,
                isMore: true
            }
        },

        created() {

        },
        onPullDownRefresh: function () {
            this.page = 1;
            wx.showNavigationBarLoading();
            wx.stopPullDownRefresh();
            this.getRechargeLog();
        },
        onReachBottom: function () {
            var self = this;

            this.loadresult()
        },
        onLoad() {
            var that = this;
            wx.getSystemInfo({
                success: function (res) {
                    that.scrollhight = res.windowHeight - res.windowWidth * 0 / 750
                }
            });
            that.getRechargeLog();
            var userinfo = wx.getStorageSync('userinfo');
            this.accumulated_recharge_amount = userinfo.accumulated_recharge_amount;
        },
        methods: {
            getRechargeLog() {
                var that = this;
                api.getAccountChangeRecord(this.globalData.member_id, that.page).then(function (data) {
                    var da = data.param;
                    wx.hideNavigationBarLoading(); //隐藏导航条加载动画。
                    if (da.code == 200) {
                        if (that.page == 1) {
                            that.rechargeLog = da.data.list;
                        } else {
                            that.rechargeLog = that.rechargeLog.concat(da.data.list);
                        }
                        if (that.rechargeLog.length >= da.data.totalCount) {
                            that.isMore = false;
                        } else {
                            that.page++
                        }
                        console.log(that.isMore)
                    }
                })
            },
            /*加载更多筛选*/
            loadresult() {
                var that = this;
                if (that.isMore) {
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
    	box-sizing: border-box;
    	/* position: absolute;
    	top: 60rpx;
    	bottom: 0;
    	left: 0; */
    }
    
    .accountlist .accountlist-bd>li {
    	/* line-height: 40px; */
    	border-bottom: 1px solid #efefef;
    	text-align: center;
    	overflow: hidden;
		padding: 20rpx 0;
    }
    
    .accountlist .accountlist-bd>li>div {
    	width: 20%;
    	float: left;
    }
</style>
