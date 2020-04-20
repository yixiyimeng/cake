<template>
	<div>
		<div v-show="videolist.length == 0" class="nodata">
			<image src="/static/images/nodata.jpg" mode="aspectFit" />
		</div>
		<view v-show="isShowVideo" style="position:absolute; z-index: 999; background: #000000; top:0;left:0;right:0;bottom:0">
			<video id="prew_video" autoplay="true" direction="0" :src="videoSrc" @fullscreenchange="bindVideoScreenChange"
			 @pause="pause" :poster="poster" custom-cache="false" style="position: absolute; top: 50%; width: 100%; transform: translateY(-50%);"></video>
		</view>
		<div class="videolist">
			<ul>
				<li class="flex" v-for="(item, itemIndex) in videolist" :key="itemIndex">
					<div class="photo">
						<image :src="userInfo.logo" mode="aspectFill" />
					</div>
					<div class="flex-1 ml10">
						<p class="name">{{ userInfo.name }}</p>
						<div class="decript">{{ item.title }}</div>
						<div class="imgbox clearfix ">
							<span v-for="(image, subitemIndex) in item.imglist" :key="subitemIndex">
								<span class="previewimg">
									<image :src="image" @click="previewImage(item.imglist, image)" mode="aspectFill" :lazy-load="true" />
								</span>

							</span>
							<span v-if="item.video_url" class="video" @click="playvideo(item.video_url)">
								<image src="/static/images/webwxgetmsgimg.jpg" mode="aspectFill" />
								<div style="position: absolute;top: 0;left: 0; bottom: 0; right: 0; background: rgba(0,0,0,.3);">
								</div>
								<image src="/static/images/play.png" class="icon" mode="aspectFill"></image>
							</span>
						</div>
						<div class="tip flex flex-pack-justify">
							<span class="time">{{ item.add_time }}</span>
							<span @click="likeVideo(item.id, item.is_like, itemIndex)">
								<image src="/static/images/page/2.png" mode="widthFix" v-if="item.is_like == 1" />
								<image src="/static/images/page/3.png" mode="widthFix" v-if="item.is_like == 0" />
								<span class="ml10">{{ item.likes }}</span>
							</span>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	let timer=null;
	import {
		host
	} from '@/utils/request'
	import api from '@/utils/api';
	export default {
		components: {},

		data() {
			return {
				host,
				page: 1,
				limit: 15,
				videolist: [],
				isMore: true,
				isShow: false,
				userInfo: {},
				videoSrc: '',
				poster: '',
				isShowVideo: false
			};
		},
		onLoad() {
			var that = this;
			// 			wx.getSystemInfo({
			// 				success: function(res) {
			// 					that.scrollhight = res.windowHeight
			// 				}
			// 			});
			// 			that.accessToken = wx.getStorageSync("accessToken");
			//
			that.getVideoList();
		},
		created() {
			this.userInfo = this.globalData.userInfo;
			// console.log(this.globalData.userInfo.name)
		},
		onPullDownRefresh: function() {
			this.page = 1;
			wx.showNavigationBarLoading();
			wx.stopPullDownRefresh();
			this.getVideoList();
		},
		onReachBottom: function() {
			var self = this;
			this.loadresult();
		},
		methods: {
			previewImage: function(imglist, current) {
				// console.log(current)
				wx.previewImage({
					current: current, // 当前显示图片的http链接
					urls: imglist // 需要预览的图片http链接列表
				});
			},
			getVideoList() {
				const that = this;
				var param = {
					page: that.page,
					limit: that.limit
				};
				api.getwechatlist(param).then(da => {
					if (da.code == 0) {
						let list = [];
						if (da.data && da.data.length > 0) {
							list = da.data.map(item => {
								if (item.images_url) {
									item.imglist = item.images_url.split('|').map(subitem => {
										// return that.host + subitem
										return subitem
									});
								}
								// if (item.video_url) {
								// 	// item.video_url = that.host + item.video_url
								// }
								return item
							})
						}
						if (that.page == 1) {
							this.videolist = list;
						} else {
							this.videolist.push(list)
						}
						if (da.count <= this.videolist.length) {
							this.isMore = false;
						}
					}
				}).finally(da => {
					wx.hideNavigationBarLoading();
				})
			},
			likeVideo(id, like, index) {
				const that = this;
				/*if(like == 0) {*/
				var param = {
					accessToken: that.accessToken,
					id: id
				};

				/* api.setVideo(param).then(function(da) {
						if (da.code == 200 && da.data) {
							if (that.videolist[index].is_like == 0) {
								that.videolist[index].is_like = '1';
								var num = parseInt(that.videolist[index].likes);
								that.videolist[index].likes = ++num
							} else {
								that.videolist[index].is_like = '0';
								var num = parseInt(that.videolist[index].likes);
								that.videolist[index].likes = --num
							}
						}
					}) */
			},
			/*加载更多筛选*/
			loadresult() {
				var that = this;
				if (that.isMore) {
					that.getVideoList();
				}
			},
			showUser(uuid) {
				this.getvideoUserInfo(uuid);
				this.isShow = true;
			},
			hideUser(e) {
				if (e.currentTarget.id == e.target.id) {
					this.isShow = !this.isShow;
				}
			},
			getvideoUserInfo(uid) {
				var that = this;
				/* api.getvideoUserInfo({
						accessToken: that.accessToken,
						uid: uid
					}).then(da => {
						if (da.code == 200) {
							that.userInfo = da.data;
						}
					}) */
			},
			playvideo: function(path, poster) {
				// this.poster = poster;
				let that = this;
				var videoContext = this.videoContext;
				this.videoSrc = path;
				// that.isShowVideo = true;
				videoContext.seek(0);
				videoContext.play();
				if(timer){
					clearTimeout(timer)
				}
				timer=setTimeout(function() {
					videoContext.requestFullScreen();
				}, 100);
			},
			pause(e) {
				var videoContext = this.videoContext;
				videoContext.exitFullScreen();
				this.videoSrc = '';
				// this.isShowVideo = false;
			},
			/**
			 * 全屏改变
			 */
			bindVideoScreenChange: function(e) {
				var status = e.mp.detail.fullScreen;
				console.log(status);
				if (!status) {
					var videoContext = this.videoContext;
					videoContext.seek(0);
					videoContext.pause();
					this.videoSrc = '';
					this.isShowVideo = false;
				} else {
					this.isShowVideo = true;
				}
				//this.setData(play);
			}
		},
		onReady: function(res) {
			this.videoContext = wx.createVideoContext('prew_video');
		}
	};
</script>

<style scoped>
	page {
		background: #fff;
	}

	.videolist ul li {
		padding: 30px 12px 15px;
		border-bottom: 1px dashed #e8e8e8;
	}

	.videolist ul li .photo {
		width: 100rpx;
		height: 100rpx;
		overflow: hidden;
	}

	.videolist ul li .photo image {
		display: block;
		height: 100%;
		width: 100%;
	}

	.videolist ul li .name {
		font-size: 34rpx;
		color: #576a94;
		margin-bottom: 30rpx;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.videolist ul li .decript {
		font-size: 30rpx;
	}

	.videolist ul li .imgbox {
		margin-top: 20rpx;
	}

	.videolist ul li .imgbox .previewimg {
		display: block;
		width: 28%;
		height: 0;
		padding-bottom: 28%;
		/* padding: 0 4rpx; */
		margin-bottom: 10rpx;
		float: left;
		box-sizing: border-box;
		position: relative;
		overflow: hidden;
	}

	.videolist ul li .imgbox .previewimg {
		margin: 1%;
	}

	.videolist ul li .imgbox .previewimg image {
		height: 100%;
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.videolist ul li .tip {
		color: #434343;
		font-size: 24rpx;
		margin-top: 20rpx;
	}

	.videolist ul li image {
		width: 32rpx;
		vertical-align: middle;
	}

	.videolist ul li span {
		vertical-align: middle;
	}

	.userInfo {
		background: rgba(0, 0, 0, 0.4);
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		font-size: 28rpx;
		line-height: 60rpx;
	}

	.userInfo>div {
		position: absolute;
		top: 50%;
		left: 10%;
		width: 80%;
		transform: translateY(-50%);
		background: #fff;
		padding: 60rpx;
		box-sizing: border-box;
		color: #989898;
	}

	.userInfo .name {
		font-size: 32rpx;
		color: #131510;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-right: 35rpx;
	}

	.userInfo>div>div {
		border-bottom: 1px solid #f6f6f6;
	}

	.userInfo .btn {
		background: #ff5355;
		color: #fff;
		border-radius: 5px;
		font-size: 28rpx;
		text-align: center;
		margin-top: 40rpx;
	}

	.userInfo label {
		color: #131510;
	}

	.userInfo .icon {
		width: 32rpx;
		height: 32rpx;
	}

	.userInfo .photo {
		width: 100rpx;
		height: 100rpx;
		border-radius: 5px;
		overflow: hidden;
		display: block;
		margin-left: 10rpx;
	}

	.userInfo .pb20 {
		padding-bottom: 20px;
	}

	.video {
		width: 300rpx;
		height: 400rpx;
		overflow: hidden;
		display: block;
		background: #000;
		position: relative;
	}

	.videolist ul li .video image {
		width: 100%;
		height: 100%;
	}

	.videolist ul li .video image.icon {
		width: 128rpx;
		height: 128rpx;
		position: absolute;
		left: 86rpx;
		top: 136rpx;
	}
</style>
