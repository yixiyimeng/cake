<template>
	<view>
		<web-view :webview-styles="webviewStyles" :src="weburl" @load="bindload"></web-view>
	</view>
</template>

<script>
	import api from '@/utils/api';
	export default {
		data() {
			return {
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				weburl: '',
				title:''
			}
		},
		onLoad() {
			// this.weburl=this.$root.$mp.query.weburl
		},
		onShow() {
			this.getwebview();
		},
		methods: {
			getwebview() {
				api.getwebview().then(da => {
					if (da.code == 200) {
						this.weburl = da.data.url;
						this.title=da.data.title
					}
				})
			},
			bindload(){
				console.log(122)
				wx.setNavigationBarTitle({
					title: this.title
				})
			}

		}
	}
</script>

<style>

</style>
