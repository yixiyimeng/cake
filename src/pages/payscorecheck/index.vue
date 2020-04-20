<template>
    <div>
        <div class="text-center">
		<span class="payitem" v-for="(item,index) in list" @click="selectnum(index)" :key="index"
              :class="{'active':item.sel}">￥{{item.amount}}
		<view class="price">积分：{{item.integral}}</view></span>
        </div>
        <div class="paybtn" @click="paymoney">兑换</div>
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

        },
        mounted() {
            var that = this;
            api.getIntegralAmount().then(function (data) {
                var da = data.param;
				console.log(da.code)
                if (da.code == 200) {
					console.log(da.data)
					let list=[];
					for(var key in da.data){
						var item=da.data[key];
						item.sel=false;
						list.push(item)
					}
					// let list=da.data.map(item=>{
					// 	item.sel=false;
					// 	return item
					// })
                    // da.data.forEach(item => item.sel = false);
                    that.list =list;
					console.log(that.list)
                } else {
                    wx.showToast({
                        title: '获取兑换积分失败',
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
                    this.integral = 0;
                    this.amount = 0;
                } else {
                    this.list.forEach(item => item.sel = false);
                    this.list[index].sel = true;
                    this.integral = this.list[index].integral;
                    this.amount = this.list[index].amount;
                }
            },
            paymoney() {
                var that = this;
                if (that.amount > 0) {
                    var param = {
						integral:this.integral,
						amount:this.amount
                        // formData: {
                        //     recharge_amount: this.recharge,
                        //     presentation_amount: this.money,
                        //     member_id: that.globalData.member_id
                        // }
                    }
                    api.IntegralRechangerAmount(param,that.globalData.member_id).then(function (da) {
                        var data = da.param;
						wx.showToast({
						    title: data.message,
						    icon: 'none'
						});
                        if (data.code == 200) {
                          wx.navigateBack({
                          	delta: 1
                          });
                        } else {
                          
                        }
                    });
                } else {
                    wx.showToast({
                        title: '请选择兑换金额',
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
   .text-center{
   	text-align: center;
   }
   .payitem{
   	color: #ff5555;
   	border: 1px solid #ff5555;
   	border-radius: 5px;
   	margin: 10rpx 2%;
   	padding: 10rpx 20rpx;
   	display: inline-block;
   	font-size: 40rpx;
   	width: 46%;
   	box-sizing: border-box;
   	
   }.payitem view{
   	color: #999;
   	font-size: 30rpx;
   }
   .payitem.active{
   	background: #ff5555;
   	color: #fff;
   }	.payitem.active view{
   	color: #fff;
   }
   .paybtn{
   	background: #ff5555;
   	color: #fff;
   	text-align: center;
   	line-height: 80rpx;
   	border-radius: 10rpx;
   	margin: 10px 20px;
   }
   .price{
	   overflow: hidden;
	   text-overflow: ellipsis;
	   white-space: nowrap;
   }
</style>
