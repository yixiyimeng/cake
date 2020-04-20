<template>
	<div class="articlebox">
		<div class="article">
			<h4>{{name}}<p>{{add_time}}     浏览量：{{hits}}</p></h4>

			<div class="txt">
				<rich-text :nodes="info"></rich-text>
	</div>
		</div>
	</div>
</template>

<script>
	import api from '@/utils/api';
	export default {
		data() {
			return {
				ReadId: '',
				type: 0,
				info: '',
				name: '',
				hits: 0,
				add_time: '',
			}
		},
		onLoad: function(options) {
			//console.log(options)

		},
		created() {

		},
		onUnload() {
			this.info = '';
			
		},
		mounted() {
			var that = this;
			console.log(this.$root.$mp.query);
			that.ReadId = this.$root.$mp.query.id;
			that.type = this.$root.$mp.query.type;
			if(that.type == 0) {
			    that.getbaike(that.ReadId)
			} else {
				that.getjiankang(that.ReadId)
			}

		},
		methods: {

			getbaike(id) {
				api.getbaike(id).then(da => {
					if (da.code == 0) {
						this.getArticle(da.data)
					}
				});
			},
			getjiankang(id) {
				api.getjiankang(id).then(da => {
					if (da.code == 0) {
						this.getArticle(da.data)
					}
				});
			},
			getArticle(data){
				let article=data;
				this.info=article.description;
				this.name=article.title;
				this.add_time=article.publish_time;
				this.hits=article.view_count
			}

		},

	}
</script>

<style scoped>
	.articlebox {
		position: absolute;
		/*top: 10px;*/
		bottom: 0;
		overflow: auto;
		left: 0;
		right: 0;
		top: 0;
	}
	
	.article {
		padding: 20rpx;
		background: #fff;
		height: 100%;
		box-sizing: border-box;
	}
	
	.article h4 {
		text-align: center;
		border-bottom: 1px solid #efefef;
		line-height: 52rpx;
	}
	
	.article h4 p {
		color: #999;
		font-size: 24rpx;
		font-weight: normal;
	}
	
	.article .txt {
		position: absolute;
		top: 140rpx;
		bottom: 20rpx;
		left: 20rpx;
		right: 20rpx;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}
	
	.article .txt p {
		text-indent: 2em;
		font-size: 28rpx;
		line-height: 40rpx;
	}
	
	.article .txt img {
		display: block;
		max-width: 100%;
	}
</style>