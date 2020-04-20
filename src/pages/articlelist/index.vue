<template>
	<div class="articlebox">
		<scroll-view scroll-y='auto' class="scroll">
			<ul class="scrollload-content articlelist">
				<li v-for="(item, itemIndex) in list" :key='itemIndex'>
					<a href="" class="flex flex-pack-justify">
						<span>{{item.title}}</span>
						<span class="show" @click="showDetails(item.id)">查看</span>
					</a>
				</li>
			</ul>
		</scroll-view>

	</div>
</template>

<script>
	export default {
		components: {

		},

		data() {
			return {
				list: [{
					title:'关于加单'
				},
				{
					title:'关于加单2'
				}],
				page: 1,
				pageSize: 20
			}
		},

		created() {

		},
		mounted() {
		

		},
		methods: {
			showDetails(id) {
				const url = `../article/main?type=2&ReadId=${id}`
				wx.navigateTo({
					url
				})
			}
		},

	}
</script>

<style scoped>
	/*文章*/
	
	.articlelist {
		background: #eee;
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		overflow: auto;
	}
	
	.articlelist li {
		background: #fff;
		margin-top: 20rpx;
		padding: 0 60rpx;
		line-height: 90rpx;
		color: #434343;
		font-size: 28rpx;
	}
	
	.articlelist li .show {
		color: #f00;
	}
</style>