<template>
    <div class="acount">
        <image src="/static/images/icon27.png " mode="aspectFit"/>
        <div class="money flex flex-pack-justify">
            <span>账户余额</span>
            <span class="red">￥{{money}}</span>
        </div>
        <div class="linkbox ml10 mr10">
            <a href="/pages/paycheck/main">去充值</a>
            <a href="/pages/accountlist/main">查看记录</a>
        </div>
    </div>
</template>

<script>
    import api from '@/utils/api'

    export default {
        components: {},

        data() {
            return {
                money: 0
            }
        },
        onShow() {
            var that = this;
            api.getMemberInfoById(this.globalData.member_id).then(da => {
                var item = da.param.data.item;
                if (da.param.code == 200) {
                    wx.setStorageSync('userinfo', item);
                    that.money = item.total_amount;
					this.globalData.total_amount =item.total_amount;
					
                }
            });
        },
        created() {
        },
        mounted() {
            var that = this;
        }
    }
</script>

<style scoped>  
    /*账户*/

   .acount {
   	text-align: center;
   	padding: 20px 0;
   }
   
   .acount .money {
   	padding: 20px 40px;
   	border-bottom: 1px solid #efefef;
   	border-top: 1px solid #efefef;
   	margin-top: 20px;
   }
   
   .acount .linkbox a {
   	display: inline-block;
   	width: 80px;
   	background: #ff5454;
   	color: #fff;
   	line-height: 30px;
   	margin: 20px 10px;
   	font-size: 24rpx;
   }
   
   .acount image {
   	width: 128rpx;
   	height: 142rpx;
   }
</style>
