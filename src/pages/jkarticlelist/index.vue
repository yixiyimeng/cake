<template>
	<div class="articlebox">
		<div v-show="list.length == 0" class="nodata"><image src="/static/images/nodata.jpg" mode="aspectFit" /></div>
		
		<scroll-view scroll-y="auto" class="scroll">
			<ul class="scrollload-content articlelist">
				<li v-for="(item, itemIndex) in list" :key="itemIndex" class="flex flex-pack-justify flex-align-center">
					<a :href="'/pages/article/main?type='+type+'&id='+item.id"><img :src="item.image" alt="" mode="widthFix" /></a>
					<div class="flex-1">
						<a :href="'/pages/article/main?type='+type+'&id='+item.id" class="title">{{ item.title }}</a>
						<div class="tip flex flex-pack-justify">
							<span class="time">{{ item.publish_time }}</span>
							<span class="count">浏览:{{ item.view_count }}</span>
							<!-- <span class="share">分享</span> -->
						</div>
					</div>
				</li>
			</ul>
		</scroll-view>
	</div>
</template>

<script>
	import api from '@/utils/api';
	import {
		host
	} from '@/utils/request';
	export default {
		components: {},

		data() {
			return {
				host,
				type: 0,
				page: 0,
				limit: 15,
				isMore: true,
				list: []
			};
		},
		onLoad: function(options) {
			this.type = options.type;
			let that = this;
			this.page = 0;
			this.isMore = true;
			wx.setNavigationBarTitle({
				title: that.type == 0 ? '健康百科' : '健康饮食'
			});
			this.list=[];
			this.loadresult();
		},
		created() {},
		onPullDownRefresh: function() {
			this.page = 0;
			this.isMore = true;
			wx.showNavigationBarLoading();
			wx.stopPullDownRefresh();
			this.loadresult();
		},
		onReachBottom: function() {
			this.loadresult();
		},
		methods: {

			loadresult() {
				if (!this.isMore) {
					return false;
				}
				if (this.type == 0) {
					/* 获取健康百科 */
					this.getbaikelist();
				} else {
					/* 获取健康饮食 */
					this.getjiankanglist();
				}
			},
			getbaikelist() {
				this.page++;
				let param = {
					sort_type: 'baike',
					page: this.page,
					limit: this.limit
				};
				api.getbaikelist(param).then(da => {

					if (da.code == 0) {
						this.loadlist(da.data);
					}
				}).finally(() => {
					wx.hideNavigationBarLoading();
				});
			},
			getjiankanglist() {
				this.page++;
				let param = {
					sort_type: 'food',
					page: this.page,
					limit: this.limit
				};
				api.getjiankanglist(param).then(da => {
					if (da.code == 0) {
						this.loadlist(da.data);
					}
				}).finally(() => {
					wx.hideNavigationBarLoading();
				});
			},
			loadlist(list) {
				if (list && list.length > 0) {
					list = list.map(item => {
						item.image = host + item.image;
						return item
					})

					if (this.page == 1) {

						this.list = list;
					} else {
						this.list.push(list);
					}
					if (this.list.length >= da.count) {
						this.isMore = false;

					}
				}
			}
		}
	};
</script>

<style scoped>
	/*文章*/

	.articlelist {
		background: #eee;
	}

	.articlelist li {
		background: #fff;
		/* margin-top: 10rpx; */
		padding: 10rpx 20rpx;
		line-height: 45rpx;
		color: #999;
		font-size: 28rpx;
		border-bottom: 2rpx solid #efefef;
	}

	.articlelist li img {
		width: 200rpx;
		margin-right: 20rpx;
	}

	.articlelist li .title {
		font-size: 32rpx;
		color: #434343;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		height: 90rpx;
	}
</style>
