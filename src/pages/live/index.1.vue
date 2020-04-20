<template>
	<div class="onlive">
		<live-player src="https://domain/pull_stream" mode="RTC" autoplay bindstatechange="statechange" binderror="error" style="width: 100%; height: 225px;" />
		<div class="zbinfo flex flex-align-center">
			<img src="/static/images/1.png" alt="" mode="aspectFit" />
			<div>
				<p class="name">主播：核桃妈妈</p>
				<p>人气：1233 粉丝：2.9万</p>
			</div>
			
		</div>
		<div class="tablink flex">
			<div class="flex-1" :class="{'active':tablink==1}" @click="tablink=1"><span>互动</span></div>
			<div class="flex-1" :class="{'active':tablink==2}" @click="tablink=2"><span>简介</span></div>
		</div>
		<div class="tab-bd">
			<div v-if="tablink==1">
				<div class="activing-item"><span class="tag">房管</span><span class="name">核桃妈妈：</span><span>进入直播</span></div>
				<div class="activing-item"><span class="tag">房管</span><span class="name">核桃妈妈：</span><span>进入直播</span></div>
			</div>
			<div class="info" v-if="tablink==2">
				核桃妈妈哈哈哈哈哈哈哈哈
			</div>
		</div>
		<div class="txtbar flex flex-align-center">
			<img src="../../../static/images/img03.png" alt="" mode="aspectFit">
			<input type="text" placeholder="请输入想发送的弹幕" class="flex-1">
		</div>
	</div>
</template>

<script>
export default {
	components: {},

	data() {
		return {
			scrollhight: 100,
			tablink:1
		};
	},

	onLoad() {
		var that = this;
		wx.getSystemInfo({
			success: function(res) {
				that.scrollhight = res.windowHeight - (res.windowWidth * 60) / 750;
			}
		});
		
	},
	methods: {
		
	}
};
</script>

<style scoped>
	.zbinfo{
		font-size: 28rpx;
		color: #666;
		line-height: 1.5em;
		border-bottom: 1px solid #efefef;
		padding: 5px 20px;
	}
	.zbinfo .name{
		color: #333;
		font-size: 32rpx;
	}
.zbinfo img{
	height: 50px;
	width: 50px;
	 border-radius: 100%;
	 margin-right: 10px;
}
.tablink{
	border-bottom: 1px solid #EFEFEF;
	line-height: 30px;
	text-align: center;
	color: #666;
	font-size: 28rpx;
}
.tablink div.active{
	color: #f00;
}.tablink div.active span{
	border-bottom: 3px solid #f00;
	padding: 0 10px;
	display: inline-block;
}
.txtbar{
	background: #fff;
	border-top: 1px solid #efefef;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 40px;
	padding: 10px;
}
.txtbar img{
	height: 30px;width: 40px;
}
.txtbar input{
	border: 1px solid #ddd;
	background: #efefef;
	border-radius: 50px;
	text-align: center;
	padding: 5px;
	font-size: 28rpx;
	height: 30px;
	margin-left: 20px;
}
.info{
	color: #666;
	padding: 10px;font-size: 28rpx;
}
.activing-item{
	font-size: 28rpx;padding:  0 10px;margin: 10px 0;
	color: #666;
}
.activing-item .tag{
	background: #f00;
	color: #fff;
	padding:2px 5px;
	display: inline-block;
	border-radius: 5px;
	margin-right: 10px;
	
}
.activing-item .name{
	color: #333;
}
</style>
