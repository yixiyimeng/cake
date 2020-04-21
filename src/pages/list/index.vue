<template>
	<div>
		<div class="searchbar flex">
			<button open-type="contact" class="contact">
				<image src="/static/images/kf.png" mode="aspectFit" /></button>

			<div class="flex-1">
				<div class="flex flex-align-center">
					<i class="search">
						<image src="/static/images/search.png" /></i>
					<input v-model="keyword" placeholder="请输入你想要的产品名称" type="text" confirm-type="search" @confirm="confirm($event)" />
				</div>
			</div>
			<!-- <a href="" class="filterBtn" @click="showfilter">筛选</a> -->
		</div>

		<div>
			<div class="grid flex ">
				<div class="submenu">
					<!--"-->
					<scroll-view scroll-y="true" class="scroll-view" :scroll-into-view="'head-' + indexSize">
						<ul>
							<li :class="{ active: indexSize == myitemIndex }" v-for="(item, myitemIndex) in menulist" :key="myitemIndex"
							 @click="scrollTo(myitemIndex, item)" :data-index="myitemIndex" :id="'head-' + myitemIndex">
								<i :class="{ show: item.num > 0  && isOpen == 1 }">{{ item.num > 100 ? '99+' : item.num }}</i>
								<span class="flex flex-align-center flex-pack-center cate" v-bind:style="{ color: item.color }">{{ item.name }}</span>
							</li>
						</ul>
					</scroll-view>
				</div>

				<div class="main flex-1" style="position: relative;">
					<div class="loading" v-if="isloading">
						<div class="spinner">
							<div class="bounce1"></div>
							<div class="bounce2"></div>
							<div class="bounce3"></div>
						</div>
					</div>
					<!--<div class="filterbar">
						快速找到你喜欢的产品>>
						<a href="" class="filterBtn" @click="showfilter">筛选</a>
					</div>-->
					<scroll-view scroll-y="true" class="goodslist" style="position: relative; z-index: 1;" :scroll-into-view="'goods-' + scrollTop"
					 @scrolltolower="loadgoodslist()" @scroll="scroll" @scrolltoupper="refresh()" :enable-back-to-top="false">
						<div v-show="!isMoregoods && goodslist.length == 0" class="nodata">
							<image src="/static/images/nodata.jpg" mode="aspectFit" />
						</div>
						<div class="goodsmod">
							<!-- <h4>{{goodType.cate_name}}</h4> -->
							<div class="goodslist-item" v-for="(goods, index) in goodslist" :key="index" :id="'goods-' + index">
								<div class="flex">
									<div class="goodimg" @click="showDetails(goods, index)">
										<!-- <span class="goodstag" v-if='goods.attr==1||goods.attr==2||goods.attr==3' :class="{'goodstag2':goods.attr==1,'goodstag1':goods.attr==2,'goodstag3':goods.attr==3}">{{goods.attr==1?'热销':goods.attr==2?'新品':'推荐'}}</span> -->
										<image class="image" :src="goods.pic[0]" mode="aspectFit" lazy-load="true" />
									</div>
									<div class="goodinfo flex-1">
										<p class="name" v-bind:style="{ color: goods.color }">
											<strong>{{ goods.name }}</strong>
										</p>

										<p class="mt5 red" v-if="isOpen == 1">
											<span style="font-weight: bold; font-size: 14px;">￥</span>
											<span class="price">{{ goods.take_out_price.min }}</span>
											元
										</p>
										<!-- <p class="red mt5 num" v-show="goods.goods_nums>0&&isOpen==1">供货量<span class="total">{{goods.goods_nums>300?'充足':goods.goods_nums+'扎'}}</span></p> -->
										<!-- <p class="red mt5 num" v-show="goods.goods_nums==0&&isOpen==1">今日已售完</span> </p>-->
									</div>
									<div class="edit">
										<div class="minus" v-if="goods.num > 0" @click.stop="minusnum(goods, index)">
											<image src="/static/images/minus2.png" mode="widthFix" />
										</div>
										<span v-if="goods.num > 0">{{goods.num}}</span>
										<!-- <input name="" id="" v-if="goods.num > 0" type="number" v-model.lazy="goods.num" @change.stop="editnum(goods, index)" /> -->
										<div class="add" @click.stop="addnum(goods, index)">
											<image src="/static/images/add.png" mode="aspectFill" />
										</div>
									</div>
								</div>
								<p class="desc">
									<rich-text :nodes="goods.desc"></rich-text>
								</p>
							</div>
						</div>
					</scroll-view>
				</div>
			</div>
		</div>

		<!--提示-->
		<!-- <p class="isCannotice">蛋糕需要制作时间</p> -->
		<div class="list-footer flex ">
			<div class="flex-1" @click="openCar" v-if="isOpen == 1">
				<div class="carbox" :class="{ active: totalnum >= 1 }">
					<div class="car">
						<image src="/static/images/22.png" />
						<div>{{ totalnum >= 100 ? '99+' : totalnum }}</div>
					</div>
				</div>
				<div class="goodsnum" :class="{ active: totalnum >= 1 }">
					<p>共计￥{{ totalprice }}元</p>
					<!-- <p class="tip">全场包邮到店，无需任何杂费</p> -->
				</div>
			</div>
			<!-- <button class="invoiceBtn" open-type="getUserInfo" @getuserinfo="onGotUserInfo" >去结算</button> -->
			<span class="invoiceBtn" @click="gotoInvo" :class="{ active: totalnum >= 1 }" v-if="isOpen == 1">结算</span>
			<div v-if="isOpen == 0" class="timetip" style="line-height: 120rpx;text-align: center;margin: 0 auto;">目前不在营业时间内</div>
		</div>
		<!--筛选-->
		<div class="filter" :class="{ active: isFilter }" @click.stop="closeFilter">
			<div @click.stop="stopclose">
				<div class="cont">
					<div class="filter-modbox mb10">
						<p>颜色</p>
						<div>
							<span @click="addfilter('color', item, index)" :class="{ active: item.sel == 1 }" v-for="(item, index) in filterlist['color']"
							 :key="index">
								{{ item.name }}
							</span>
						</div>
					</div>
					<div class="filter-modbox mb10">
						<p>价格</p>
						<div>
							<span @click="addfilter('price', item, index)" v-for="(item, index) in filterlist['price']" :key="index" :class="{ active: item.sel == 1 }">
								{{ item.desc }}
							</span>
						</div>
					</div>
					<div class="filter-modbox mb10">
						<p>用途</p>
						<div>
							<span @click="addfilter('use', item, index)" v-for="(item, index) in filterlist['use']" :key="index" :class="{ active: item.sel == 1 }">
								{{ item.desc }}
							</span>
						</div>
					</div>
					<div class="filter-modbox mb10">
						<p>标签</p>
						<div>
							<span @click="addfilter('attr', item, index)" v-for="(item, index) in filterlist['attr']" :key="index" :class="{ active: item.sel == 1 }">
								{{ item.desc }}
							</span>
						</div>
					</div>
					<div class="filter-modbox mb10">
						<p>其他</p>
						<div>
							<span @click="addfilter('other', item, index)" v-for="(item, index) in filterlist['other']" :key="index" :class="{ active: item.sel == 1 }">
								{{ item.desc }}
							</span>
						</div>
					</div>
				</div>
				<div class="btnbox">
					<span @click.stop="confirmFilter">确定</span>
					<span @click.stop="clearFilter">重置</span>
				</div>
			</div>
		</div>
		<div class="carlist" :class="{ active: isshowCar }" @click="closeCar" id="carbox">
			<div>
				<div class="flex flex-pack-justify">
					<!-- <div class="notice">本站满{{packnum}}扎包邮，不满{{packnum}}扎不发货</div> -->
					<div class="clearCar" @click="empty">
						<img src="/static/images/del.png" mode="widthFix" />
						<span>清空购物车</span>
					</div>
				</div>
				<ul class="mt10">
					<li class="flex flex-pack-justify flex-align-center" v-for="(item, index) in carlist" :key="index">
						<span class="name">{{ item.name }}</span>

						<span class="price" v-if="isOpen == 1">
							￥
							<span>{{ item.take_out_price }}</span>
						</span>
						<div class="edit" v-if="isOpen == 1">
							<div class="minus" @click="minusCarnum(item)">
								<image src="/static/images/minus2.png" mode="widthFix" />
							</div>
							<input type="number" name="" id="" v-model.lazy="item.num" @change="editCarnum(item)" />
							<div href="javascript:;" class="add" @click="addCarnum(item)">
								<image src="/static/images/add.png" mode="widthFix" />
							</div>
						</div>
					</li>
				</ul>
				<div class="flex flex-pack-justify" v-if="lostgoods.length > 0">
					<div class="notice" style="color: #666;">以下产品已下架或库存不足</div>
					<div class="clearCar" @click="emptylost">
						<img src="/static/images/del.png" mode="widthFix" />
						<span>清空失效商品</span>
					</div>
				</div>
				<ul class="mt10" v-if="lostgoods.length > 0">
					<li class="flex flex-pack-justify flex-align-center" v-for="(item, index) in lostgoods" :key="index">
						<span class="name" style="color: #666;">{{ item.name }}</span>
						<!-- <span class="taglist">
							<span class="tag">{{ item.level }}</span>
							<span class="color">{{ item.g_color }}</span>
						</span> -->
						<span class="price" v-if="isOpen == 1" style="color: #666;">
							￥
							<span>--</span>
						</span>
						<span style="color: #666;">已失效</span>
					</li>
				</ul>
			</div>
		</div>
		<!--商品详情-->
		<div class="goodsdetails" @click="closeGoodsdetails" :class="{ active: isDetails }" id="goodsdetails">
			<div id="goodsdetails2" class="flex flex-v" :style="{height:selectAttrList.length>0?'70%':'auto'}">
				<!-- <view class="slide">
					<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-color="#fff"
					 indicator-active-color="#ff5454">
						<swiper-item>
							<image class="slide-image" :src="Details.pic" mode="widthFix" />
						</swiper-item>
					</swiper>
				</view> -->
				<div class="flex flex-align-center">
					<div class="close" @click="closeGoodsdetails">×</div>
					<div class="imgbox" @click="previewImage(Details.pic, Details.pic[0])">
						<image class="image" :src="Details.pic?Details.pic[0]:''" mode="widthFix" lazy-load="true" />
					</div>
					<div class="flex-1">
						<span class="name">{{ Details.name }}</span>
						<p class="price" v-if="isOpen == 1">
							￥
							<span>{{ Details.goods_list?Details.goods_list[selectAttrIndex].take_out_price:0 }}</span>
							元
						</p>
						<p v-if="selectAttrList.length>0">选择了：<span v-for="(item,index) in selectAttrList" :key="index" style="margin: 0 5px;">{{item.attr_val_text}}</span></p>
					</div>
				</div>
				<div class="flex-1 main">
					<div class="flex flex-pack-justify">
						<span class="title">数量</span>
						<div v-if="isOpen == 1">
							<div class="edit">
								<div class="minus" @click="minusAttrnum(Details)">
									<image src="/static/images/minus2.png" mode="widthFix" />
								</div>
								<input type="number" name="" id="" v-model.lazy="Details.num" />
								<div class="add" @click="addAttrnum(Details)">
									<image src="/static/images/add.png" mode="widthFix" />
								</div>
							</div>
						</div>
					</div>
					<div class="tagbox" v-for="(attr_info,attr_info_index) in Details.attr_info" :key="attr_info_index">
						<div class="title">{{attr_info.attr_text}}</div>
						<div class="taglist">
							<span class="tag" :class="{'active':selectAttrList[attr_info_index].attr_val_text==attr_val.attr_val_text}"
							 v-for="(attr_val,attr_val_index) in attr_info.attr_val" :key="attr_val_index" @tap="changeAttr(attr_info_index,attr_val.attr_val_text)">{{attr_val.attr_val_text}}</span>
						</div>
					</div>
					<div class="goodsInfo" v-if="Details.desc">
						<p class="desc">
							<rich-text :nodes="Details.desc"></rich-text>
						</p>
					</div>
				</div>
				<div class="btn" @tap="addCar">添加购物车</div>
			</div>
		</div>
		<!--搜索结果页面-->
		<div class="result" :class="{ active: isResult }">
			<span class="close" @click="isResult = !isResult">×</span>
			<h4>搜索结果</h4>
			<scroll-view scroll-y="true" class="resultlist" @scrolltolower="loadresult">
				<div class="goodslist-item" v-for="(goods, index) in searchlist" :key="index">
					<div class="flex">
						<div class="goodimg" @click="showDetails(goods, itemIndex, index)">
							<!-- <span class="goodstag" v-if='goods.attr==1||goods.attr==2||goods.attr==3' :class="{'goodstag2':goods.attr==1,'goodstag1':goods.attr==2,'goodstag3':goods.attr==3}">{{goods.attr==1?'热销':goods.attr==2?'新品':'推荐'}}</span> -->
							<image class="image" :src="goods.pic[0]" mode="widthFix" lazy-load="true" />
						</div>
						<div class="goodinfo flex-1">
							<p class="name">
								<strong>{{ goods.name }}</strong>
							</p>

							<p class="mt10 red" v-if="isOpen == 1">
								￥
								<span class="price">{{ goods.take_out_price?goods.take_out_price.min:0 }}</span>
								元
								<!--<image class="echart" src="/static/images/21.png" mode="widthFix" v-if="goods.trend==1" @click="showChart(goods.id)" />-->
							</p>

							<!-- <p class="red" v-show="goods.goods_nums > 0 && isOpen == 1">
								供货量
								<span class="total">{{ goods.goods_nums }}</span>
								扎
							</p> -->
							<!-- <p class="red" v-show="goods.goods_nums == 0 && isOpen == 1">今日已售完</p> -->
						</div>
						<!-- <div class="edit">
							<div class="minus" v-if="goods.num > 0" @click="minusResult(goods, index)">
								<image src="/static/images/minus2.png" mode="widthFix" />
							</div>
							<input name="" id="" v-if="goods.num > 0" type="number" v-model.lazy="goods.num" @change="editResult(goods, index)" />
							<div class="add" @click="addResult(goods, index)">
								<image src="/static/images/add.png" mode="widthFix" />
							</div>
						</div> -->
						<div class="edit">
							<div class="minus" v-if="goods.num > 0" @click.stop="minusnum(goods, index)">
								<image src="/static/images/minus2.png" mode="widthFix" />
							</div>
							<span v-if="goods.num > 0">{{goods.num}}</span>
							<!-- <input name="" id="" v-if="goods.num > 0" type="number" v-model.lazy="goods.num" @change.stop="editnum(goods, index)" /> -->
							<div class="add" @click.stop="addnum(goods, index)">
								<image src="/static/images/add.png" mode="aspectFill" />
							</div>
						</div>
					</div>
					<p class="desc">
						<rich-text :nodes="goods.desc"></rich-text>
					</p>
				</div>
			</scroll-view>
		</div>
	</div>
</template>

<script>
	import api from '@/utils/api';
	export default {
		data() {
			return {
				hiddenmodalput: true,
				subtitle: '请在此输入搜索内容',
				isFilter: false,
				filter: {
					color: [],
					price: '',
					use: [],
					attr: [],
					other: []
				},
				filterlist: {},
				menulist: [],
				classifySeleted: '',
				isTap: true,
				goodslist: [],
				isDetails: false,
				percent: 0.5,
				isAble: true,
				Details: {},
				DetailsIndex: '',
				DetailstypeIndex: '',
				searchlist: [],
				keyword: '',
				totalnum: 0,
				totalprice: 0,
				carlist: [],
				isshowCar: false,
				limit: 20,
				page: 1,
				isMore: true,
				isResult: false,
				isShowChart: false,
				oldscrollTop: -1,
				indexSize: 0,
				indicatorDots: false,
				autoplay: false,
				duration: 500,
				circular: true,
				heightArr: [],
				packnum: 1, //包邮数量
				goodspage: 1,
				cate_id: 0,
				isMoregoods: true,
				scrollTop: 0,
				isOpen: 1, //是否在营业时间
				isloading: false,
				lostgoods: [], //失效商品
				remark: null, //标记是线上订单还是线下订单
				selectAttrIndex: 0, //选择属性商品
				selectAttrList: [], //选中属性列表
			};
		},

		components: {},

		onLoad(options) {
			var that = this;
			let query = wx.createSelectorQuery().in(this);
			wx.getSystemInfo({
				success: function(res) {
					that.percent = res.windowWidth / 750;
				}
			});

			console.log(options)
			if (options.scene) {
				let scene = decodeURIComponent(options.scene);
				//&是我们定义的参数链接方式
				let remark = scene && scene != 0 ? scene : '';
				this.remark = remark;
				wx.setStorageSync('remark', {
					remark: remark,
					time: new Date().getTime()
				});
				// console.log('remark'+remark)
			} else {
				this.remark = null
			}
			that.getcategory();
			//that.searchSet();
			// 判断是否有列表缓存
			if (!this.remark && wx.getStorageSync('goodslist')) {
				let goodslist = wx.getStorageSync('goodslist');
				that.setgoodslist(goodslist.list, goodslist.totalCount)
			}
		},
		onShow() {
			/* 查询营业状态 */
			api.opentime().then(da => {
				if (da.code == 200) {
					this.isOpen = 1
				} else {
					this.isOpen = 0;
				}
			});
			var that = this;
			that.carlist = wx.getStorageSync('listcar') || [];
			that.lostgoods = wx.getStorageSync('lostgoods') || [];
			that.calunum('1');

		},
		methods: {
			cancelempty() {
				this.hiddenmodalput = true;
			},
			confirmempty() {
				this.hiddenmodalput = true;
				this.isshowCar = true;
			},
			/* 获取商品分类 */
			getcategory() {
				var that = this;
				api.getcategory({
					page: 1,
					limit: 100
				}).then(da => {
					// console.log(da.param.data);
					if (da.param.code == 200) {
						that.menulist = da.param.data.list;
						// console.log('12that.cate_id' + da.param.data.list.length);

						that.cate_id = that.menulist[0].id;
						// console.log('that.cate_id' + that.cate_id);
						if (that.remark && wx.getStorageSync('goodslist')) {
							that.calunum('1');
						} else {
							that.getOnegoods();
						}
					}
				});
				// that.calunum();
			},
			/* 获取一个商品分类列表 */
			getOnegoods() {
				var that = this;
				var param = {
					take_out_flag: this.remark ? 0 : 1,
					cate_id: that.cate_id,
					limit: that.limit,
					page: that.goodspage,
					up_down: 1
				};
				api.getgoods(param).then(da => {
					// console.log(da);
					if (da.param.code == 200) {
						var list = [];
						if (da.param.data.list && da.param.data.list.length > 0) {
							list = da.param.data.list;
						}
						that.setgoodslist(list, da.param.data.totalCount);
						that.calunum('1');
					}
				});

				//that.uploadgoodslist();
			},
			setgoodslist(list, totalCount) {
				var that = this;
				if (that.goodspage == 1) {
					that.goodslist = list;
					that.scrollTop = 0;
				} else {
					that.goodslist = that.goodslist.concat(list);
				}
				if (that.goodslist.length >= totalCount) {
					that.isMoregoods = false;
				} else {
					that.goodspage++;
				}

			},
			loadgoodslist() {
				// console.log(123344);
				if (this.isMoregoods) {
					this.getOnegoods();
				}
			},
			/*确认搜索*/
			confirm() {
				var that = this;
				that.page = 1;
				that.isMore = true;
				that.isResult = true;
				that.searchlist = [];
				that.searchGoods();
			},
			searchGoods() {
				var that = this;
				var param = {
					limit: that.limit,
					page: that.page,
					name: that.keyword,
					up_down: 1,
					take_out_flag: this.remark ? 0 : 1

				};
				//console.log(2)
				api.getgoods(param).then(da => {
					// if (da.code == 200) {
					let list = da.param.data.list;
					that.searchlist = [];
					if (list.length > 0) {
						list.forEach(item => {
							item.num = 0;
							for (var i = 0; i < that.carlist.length; i++) {
								if (that.carlist[i].product_id == item.id) {
									item.num = item.num + that.carlist[i].num;
									// break;
								}
							}
							that.searchlist.push(item);
						});
					}
					// console.log(that.searchlist);
					if (that.searchlist.length >= da.data.count) {
						that.isMore = false;
					} else {
						that.page++;
					}
					// }
				});
			},
			addResult(goods, index) {
				var that = this;
				// if (parseInt(goods.goods_nums) > parseInt(goods.num)) {
				goods.num++;
				that.$set(that.searchlist, index, goods);
				var carindex = -1;
				if (that.carlist && that.carlist.length > 0) {
					var carindex = that.carlist.findIndex(item => {
						return item.id == goods.id;
					});
				}
				var onegoods = Object.assign({}, goods, {
					cate_id: goods.cid
				});

				if (carindex == -1) {
					that.carlist.push(onegoods);
				} else {
					that.$set(that.carlist, carindex, onegoods);
				}

				that.calunum('1');
				// }
			},
			minusResult(goods, index) {
				var that = this;
				if (goods.num == 0) {
					return false;
				}
				goods.num--;
				//that.searchlist(index).num++;
				that.$set(that.searchlist, index, goods);
				var carindex = -1;
				if (that.carlist && that.carlist.length > 0) {
					var carindex = that.carlist.findIndex(item => {
						return item.id == goods.id;
					});
				}
				if (carindex > -1) {
					that.carlist[carindex].num = goods.num;
				}

				that.calunum('1');
			},
			editResult(goods, index) {
				var that = this;
				var num = goods.num;
				if (goods.goods_nums < goods.num) {
					num = 0;
				}
				goods.num = num;
				that.$set(that.searchlist, index, goods);
				if (that.carlist && that.carlist.length > 0) {
					var carindex = that.carlist.findIndex(item => {
						return item.id == goods.id;
					});
				}
				if (carindex > -1) {
					that.carlist[carindex].num = goods.num;
				}
				that.calunum('1');
			},
			/*加载更多筛选*/
			loadresult() {
				var that = this;
				if (that.isMore) {
					that.searchGoods();
				}
			},
			/*打开筛选框*/
			showfilter(e) {
				var that = this;
				that.isFilter = !that.isFilter;
			},
			//关闭筛选框
			closeFilter(e) {
				//console.log(234);
				var that = this;
				that.isFilter = !that.isFilter;
			},
			//确认筛选
			confirmFilter(e) {
				//console.log(123)
				//				var that=this;
				//
				this.filter = {
					color: [],
					price: '',
					use: [],
					attr: [],
					other: []
				};
				for (var key in this.filterlist) {
					if (this.filterlist[key].length > 0) {
						this.filterlist[key].forEach(item => {
							if (item.sel == 1) {
								if (key == 'color') {
									this.filter.color.push(item.id);
								} else if (key == 'price') {
									this.filter.price = item.val;
								} else {
									this.filter[key].push(item.val);
								}
							}
						});
					}
				}
				//console.log(JSON.stringify(this.filter))
				this.isFilter = !this.isFilter;
				this.confirm();
			},
			clearFilter(e) {
				this.filter = {
					color: [],
					price: '',
					use: [],
					attr: [],
					other: []
				};
				for (var key in this.filterlist) {
					if (this.filterlist[key].length > 0) {
						this.filterlist[key].forEach(item => {
							item.sel = 0;
						});
					}
				}
			},
			stopclose(e) {
				//console.log(234);
			},
			closeGoodsdetails(e) {
				var that = this;
				//console.log(e)
				if (e.currentTarget.id == e.target.id) that.isDetails = !that.isDetails;
			},
			showDetails(item, index) {
				//this.scrollTop = this.oldscrollTop;
				var that = this;
				this.isTap = true;
				this.classifySeleted = '';
				that.isDetails = !that.isDetails;
				that.Details = item;
				that.Details.num = 1;
				that.DetailsIndex = index;
				that.selectAttrIndex = 0;
				that.selectAttrList = JSON.parse(JSON.stringify(that.Details.goods_list[0].attr_val));
				console.log(that.Details.goods_list[0]);
				console.log(that.selectAttrList)
				// that.DetailstypeIndex = index;
			},
			changeAttr(index, attr) {
				var that = this;
				var selectAttrList = JSON.parse(JSON.stringify(that.selectAttrList));
				selectAttrList[index].attr_val_text = attr;
				var str = [];
				for (var i = 0; i < selectAttrList.length; i++) {
					str.push(selectAttrList[i].attr_text + ':' + selectAttrList[i].attr_val_text)
				}
				var AttrId = that.Details.attr_index[str.join(',')]
				if (AttrId) {
					var subindex = that.Details.goods_list.findIndex(item => item.id == AttrId);
					that.selectAttrIndex = subindex;
					that.selectAttrList=JSON.parse(JSON.stringify(selectAttrList));
				} else {
					wx.showToast({
						title: '该商品已下架',
						icon: 'none'
					});
				}
			},
			minusAttrnum(Details) {
				if (Details.num > 1) {
					Details.num--;
				} else {
					Details.num = 1;
				}
			},
			addAttrnum(Details) {
				if (Details.num < 30) {
					Details.num++;
				}
			},
			editAttrnum(Details) {
				Details.num = parseInt(Details.num);
			},
			/* 添加购物车 */
			addCar() {
				var that = this;
				if (that.Details.num >= 1) {
					var goods = that.Details.goods_list[that.selectAttrIndex];
					goods['cate_id'] = that.Details.cate_id;
					goods.num = parseInt(that.Details.num);
					if (that.carlist && that.carlist.length > 0) {
						var carindex = that.carlist.findIndex(item => {
							return item.id == goods.id;
						});
						if (carindex > -1) {
							that.carlist[carindex].num = parseInt(that.carlist[carindex].num) + goods.num;
						} else {
							that.carlist.push(goods);
						}
					} else {
						console.log(goods)
						that.carlist.push(goods);
						console.log(that.carlist)
					}

					that.calunum('1');
					that.isDetails = false;
				}
			},
			tapClassify(e) {
				this.classifySeleted = e.mp.currentTarget.dataset.id;
				this.isTap = true;
				//console.log(this.classifySeleted)
			},

			addnum(goods, index) {
				var that = this;
				/* 先判断有没有属性列表 */
				if (goods.attr_info.length > 0) {
					/* 打开详情 */
					this.isTap = true;
					this.classifySeleted = '';
					that.isDetails = !that.isDetails;
					that.Details = Object.assign({}, goods);
					that.Details.num = 1;
					that.DetailsIndex = index;
					that.selectAttrIndex = 0;
					that.selectAttrList = that.Details.goods_list[that.selectAttrIndex].attr_val

				} else {
					goods.num++
					var details = goods.goods_list[0];
					details.cate_id = goods.cate_id;
					details.num = goods.num;
					if (that.carlist && that.carlist.length > 0) {
						var carindex = that.carlist.findIndex(item => {
							return item.id == details.id;
						});
						if (carindex > -1) {
							that.carlist[carindex].num = details.num;
						} else {
							that.carlist.push(details);
						}
					} else {
						that.carlist.push(details);
					}

					that.calunum('1');
				}
				// that.goodslist[index].num++;
				// var carindex = -1;
				// if (that.carlist && that.carlist.length > 0) {
				// 	var carindex = that.carlist.findIndex(item => {
				// 		return item.id == goods.id;
				// 	});
				// }
				// var onegoods = Object.assign({}, goods, {
				// 	cate_id: goods.cate_id == 0 ? goods.cid : goods.cate_id
				// });

				// if (carindex == -1) {
				// 	that.carlist.push(onegoods);
				// } else {
				// 	that.$set(that.carlist, carindex, onegoods);
				// }

				// that.calunum();

			},

			minusnum(goods, index) {
				var that = this;
				if (goods.attr_info.length > 0) {
					that.isshowCar = true;
				} else {
					goods.num--;
					var details = goods.goods_list[0];
					details.cate_id = goods.cate_id;
					details.num = goods.num;
					if (that.carlist && that.carlist.length > 0) {
						var carindex = that.carlist.findIndex(item => {
							return item.id == details.id;
						});
						if (carindex > -1) {
							that.carlist[carindex].num = details.num;
						}
					}

					that.calunum('1');
				}

				// if (that.goodslist[index].num > 0) {
				// 	that.goodslist[index].num--;

				// 	if (that.goodslist[index].num >= 0) {
				// 		var carindex = -1;
				// 		if (that.carlist && that.carlist.length > 0) {
				// 			var carindex = that.carlist.findIndex(item => {
				// 				return item.id == goods.id;
				// 			});
				// 		}
				// 		var onegoods = Object.assign({}, goods, {
				// 			cate_id: goods.cate_id == 0 ? goods.cid : goods.cate_id
				// 		});
				// 		if (carindex > -1) {
				// 			that.$set(that.carlist, carindex, onegoods);
				// 		}
				// 	}
				// 	//console.log(that.carlist)
				// 	that.calunum();
				// }
			},
			editnum(goods, index) {
				var that = this;
				var num = that.goodslist[index].num || 0;
				if (parseInt(that.goodslist[index].goods_nums) < parseInt(that.goodslist[index].num) || parseInt(that.goodslist[
						index].num) > 30) {
					that.goodslist[index].num = 0;
					num = 0;
				}
				goods.num = num;
				var carindex = -1;
				if (that.carlist && that.carlist.length > 0) {
					var carindex = that.carlist.findIndex(item => {
						return item.id == goods.id;
					});
				}
				if (carindex > -1) {
					that.carlist[carindex].num = goods.num;
					//that.$set(that.carlist, carindex, onegoods);
				}
				that.calunum();
			},
			/*更新列表数据*/
			uploadgoodslist() {
				var that = this;
				for (var i = 0; i < that.goodslist.length; i++) {
					that.goodslist[i].num = 0;
					if (that.carlist && that.carlist.length > 0) {
						// var index = that.carlist.findIndex(item => item.product_id == that.goodslist[i].id);
						// if (index > -1) {
						// 	that.goodslist[i].num =that.goodslist[i].num+ that.carlist[index].num;
						// }
						that.carlist.forEach(item => {
							if (item.product_id == that.goodslist[i].id) {
								that.goodslist[i].num = that.goodslist[i].num + item.num;
							}
						})
					}
				}
				/* 更新查询列表 */
				if (this.isResult) {
					for (var i = 0; i < that.searchlist.length; i++) {
						if (that.carlist && that.carlist.length > 0) {
							var index = that.carlist.findIndex(item => item.id == that.searchlist[i].id);
							if (index > -1) {
								that.searchlist[i].num = that.carlist[index].num;
							} else {
								that.searchlist[i].num = 0;
							}
						} else {
							that.searchlist[i].num = 0;
						}
						//	if(that.goodslist[i].id)
					}
				}
				// console.log(JSON.stringify(that.goodslist));
			},
			calunum(upload) {
				var that = this;
				console.log('哈哈哈哈' + that.carlist.length)
				/*重计算总数*/
				that.totalnum = 0;
				that.totalprice = 0;
				if (that.carlist && that.carlist.length > 0) {
					that.carlist = that.carlist.filter(item => {
						return parseInt(item.num) > 0;
					});
				}
				for (var i = 0; i < that.carlist.length; i++) {
					that.totalnum = that.totalnum + parseInt(that.carlist[i].num);
					that.totalprice = that.totalprice + that.carlist[i].take_out_price * that.carlist[i].num;
				}
				that.menulist.forEach((item, index) => {
					var list = that.carlist.filter(subitem => subitem.cate_id == item.id);
					var total = 0;
					if (list && list.length > 0) {
						for (var i = 0; i < list.length; i++) {
							total = total + parseInt(list[i].num);
						}
						//list.reduce((total, listitem) => total = total + listitem.num, 0);
					}
					item.num = total;
					//console.log(total);
					that.$set(that.menulist, index, item);
				});
				//console.log(that.menulist)
				that.totalprice = that.totalprice.toFixed(2);
				wx.setStorageSync('listcar', that.carlist);

				if (upload) {
					that.uploadgoodslist();
				}
				/* 能够重新购买的无效产品清除 */
				var caridlists = that.carlist.map(item => item.id);
				var newlostgoods = [];
				for (var i = 0; i < that.lostgoods.length; i++) {
					if (
						caridlists.findIndex(item => {
							return item == that.lostgoods[i].id;
						}) == -1
					) {
						newlostgoods.push(that.lostgoods[i]);
					}
				}
				that.lostgoods = newlostgoods;
				wx.setStorageSync('lostgoods', that.lostgoods);
			},
			/*购物车中的添加*/
			addCarnum(goods) {
				var that = this;
				goods.num++;
				that.calunum('1');
			},
			/*购物车中的删除*/
			minusCarnum(goods) {
				var that = this;
				if (parseInt(goods.num) > 0) {
					goods.num--;
				}
				//console.log(goods)
				that.calunum('1');
			},
			/*购物车中的编辑*/
			editCarnum(goods) {
				var that = this;
				var num = goods.num;
				if (parseInt(goods.num) > parseInt(goods.goods_nums) || parseInt(goods.num) > 30) {
					num = 0;
				}
				goods.num = num;
				that.calunum('1');
			},
			/*关闭购物车*/
			closeCar(e) {
				var that = this;
				if (e.currentTarget.id == e.target.id) {
					that.isshowCar = false;
				}
			},
			/*打开购物车*/
			openCar() {
				var that = this;
				if (that.totalnum > 0) {
					that.isshowCar = true;
				}
			},
			empty() {
				var that = this;
				that.isshowCar = false;
				that.carlist = [];
				that.calunum('1');
				/*清空缓存*/
				wx.removeStorageSync('listcar');
			},
			emptylost() {
				this.lostgoods = [];
				/*清空缓存*/
				wx.removeStorageSync('lostgoods');
			},

			gotoInvo() {
				/* 先判断是否登录过了 */
				if (this.globalData.member_id) {
					/*结算*/
					var that = this;
					/* 先判断是否有失效商品 */

					if (that.totalnum >= that.packnum) {
						/* 校验购物车状态 */
						/* 判断桌号是否过期 */
						let remarkinfo = wx.getStorageSync('remark');
						if (remarkinfo) {
							let timecha = (new Date().getTime() - remarkinfo.time) / (60 * 1000);
							if (timecha > 30) {
								/* 表示remark失效了 */
								this.remark = null;
								wx.removeStorageSync("remark");
							} else {
								this.remark = remarkinfo.remark;
							}
						} else {
							this.remark = null;
						}
						let order_type = this.remark ? 2 : 1;
						const url = '/pages/orderdetails/main?order_type=' + order_type + '&remark=' + this.remark;
						wx.navigateTo({
							url
						});
					}
				} else {
					wx.showModal({
						title: '提示',
						content: '你还没有绑定手机号码，是否绑定？',
						success(res) {
							if (res.confirm) {
								const url = '/pages/reg/main';
								wx.navigateTo({
									url
								});
								// console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			},
			/*搜索设置*/
			searchSet() {
				var that = this;
				/* api.searchSet().then(da => {
						if (da.code == 200) {
							that.filterlist = da.data
						}
					}) */
			},
			addfilter(type, item, index) {
				var that = this;

				if (type == 'price') {
					that.filterlist['price'].map(a => {
						a.sel = 0;
					});
				}
				var myitem = item;
				myitem.sel = item.sel == 1 ? 0 : 1;
				that.$set(that.filterlist[type], index, myitem);

				//console.log(JSON.stringify(that.filter))
			},
			showChart(id) {
				this.isShowChart = true;
				this.classifySeleted = '';
			},
			closeChart(e) {
				if (e.currentTarget.id == e.target.id) this.isShowChart = !this.isShowChart;
			},
			change(e) {
				this.indexSize = e.mp.detail.current;
			},
			scrollTo(myitemIndex, item) {
				this.indexSize = myitemIndex;
				this.classifySeleted = item.id;
				this.cate_id = item.id;
				this.isMoregoods = true;
				this.goodspage = 1;
				this.getOnegoods();
				this.isTap = true;

				//	console.log('hhhhhh')
			},
			stopTouchMove: function() {
				return false;
			},

			/*购物车状态*/
			shopCart(ids, type) {
				var that = this;
			},
			scroll(e) {
				//console.log(e.mp.detail.scrollTop);
				//this.oldscrollTop = e.mp.detail.scrollTop;
				this.scrollTop = '';
			},
			refresh() {
				this.goodspage = 1;
				this.isMoregoods = true;
				this.getOnegoods();
			},
			previewImage: function(imglist, current) {
				// console.log(current)
				wx.previewImage({
					current: current, // 当前显示图片的http链接
					urls: imglist // 需要预览的图片http链接列表
				});
			},
		},

		created() {},

		computed: {}
	};
</script>

<style scoped>
	ec-canvas {
		width: 400px;
		height: 400px;
		background: #f00;
	}

	.mt5 {
		margin-top: 8px;
	}

	.loading {
		position: absolute;
		top: 0;
		height: 30px;
		left: 0;
		right: 0;
	}

	.searchbar {
		background: #ff5454;
		height: 120rpx;
		padding: 30rpx 20rpx;
	}

	.searchbar a {
		color: #fff;
		display: block;
		/*width: 4em;*/
		text-align: center;
	}

	.searchbar>div {
		height: 60rpx;
		background: #fff;
		border-radius: 6px;
		margin: 0 10px;
	}

	.searchbar .search {
		display: block;
		height: 40rpx;
		width: 40rpx;
		margin: 10rpx;
		line-height: 40rpx;
		font-size: 24rpx;
	}

	.searchbar .search image {
		height: 100%;
		width: 100%;
	}

	.searchbar input {
		border: none;
		background: none;
		width: 100%;
		font-size: 24rpx;
	}

	.grid {
		position: absolute;
		top: 120rpx;
		bottom: 130rpx;
		left: 0;
		right: 0;
		overflow: hidden;
	}

	.grid.bottom {
		bottom: 170rpx;
	}

	.grid .submenu {
		width: 160rpx;
		text-align: center;
		font-size: 28rpx;
		color: #434343;
		margin: 0 auto;
		height: 100%;
		overflow: hidden;
		border-right: 1px solid #e6e6e6;
		background: #fff;
	}

	.scroll-view {
		width: 100%;
		height: 100%;
	}

	.grid .submenu li {
		height: 90rpx;
		padding: 0 10rpx;
		border-bottom: 1px solid #e6e6e6;
		position: relative;
	}

	.grid .submenu li:before {
		content: '';
		height: 80%;
		width: 10rpx;
		background: transparent;
		display: inline-block;
		position: absolute;
		left: 10rpx;
		top: 10%;
	}

	.grid .submenu li.active:before {
		background: #ff5454;
	}

	.grid .submenu ul li>span {
		height: 90rpx;
		text-align: center;
		color: #434343;
		margin: 0 auto;
		overflow: hidden;
	}

	.grid .submenu ul li i {
		position: absolute;
		background: #ff5454;
		color: #fff;
		height: 16px;
		min-width: 16px;
		border-radius: 20px;
		padding: 0 3px;
		font-size: 10px;
		text-align: center;
		right: 1px;
		top: 4px;
		line-height: 16px;
		font-style: normal;
		display: none;
	}

	.grid .submenu ul li i.show {
		display: inline-block;
	}

	.grid .filterbar {
		background: #fff;
		font-size: 24rpx;
		line-height: 90rpx;
		text-align: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 99;
	}

	.grid .main {
		position: relative;
		height: 100%;
		background: #f6f6f6;
	}

	.searchbar .filterBtn {
		display: inline-block;
		background: #fff;
		border-radius: 5px;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 20rpx;
		color: #ff5454;
		font-size: 24rpx;
	}

	.grid .main .goodslist {
		/* position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0; */
		width: 100%;

		height: 100%;
		/*padding-top: 90rpx;*/
		box-sizing: border-box;
	}

	.grid .main .goodslist h4 {
		font-size: 30rpx;
		padding-left: 20rpx;
		height: 30rpx;
		line-height: 30rpx;
		padding-top: 20rpx;
	}

	.goodslist-item {
		background: #fff;
		margin-bottom: 20rpx;
		padding: 20rpx 20rpx 10rpx;
		position: relative;
		height: 190rpx;
	}

	.goodslist-item .goodimg {
		width: 160rpx;
		display: block;
		position: relative;
	}

	.goodslist-item .goodimg image {
		display: block;
		width: 100%;
		height: 160rpx;
	}

	.goodslist-item .goodimg .goodstag {
		position: absolute;
		right: 0;
		top: 0;
		color: #fff;
		font-size: 20rpx;
		line-height: 30rpx;
		padding: 0 10rpx;
	}

	.goodslist-item .goodimg .goodstag1 {
		background: #42d7a2;
	}

	.goodslist-item .goodimg .goodstag2 {
		background: #fdb116;
	}

	.goodslist-item .goodimg .goodstag3 {
		background: #bc6fe6;
	}

	.goodslist-item .goodinfo {
		margin-left: 10px;
		font-size: 10px;
	}

	.goodslist-item .desc {
		font-size: 10px;
		color: #999;
		height: 30rpx;
		line-height: 30rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.goodslist-item .price,
	.result .price {
		font-size: 16px;
	}

	.goodslist-item .edit {
		position: absolute;
		right: 20rpx;
		top: 110rpx;
	}

	.goodslist-item .name,
	.result .name {
		color: #434343;
		font-size: 16px;
	}

	.goodslist-item .num,
	.goodsdetails .num,
	.result .num {
		/* color: #b3b3b3; */
		font-size: 14px;
	}

	.goodslist-item .tag,
	.goodsdetails .tag,
	.carlist .tag,
	.taglist .tag,
	.result .tag {
		border: 1px solid #3cb878;
		color: #3cb878;
		font-weight: bold;
		border-radius: 2px;
		padding: 0 2px;
		font-size: 10px;
		margin: 0 5rpx;
	}

	.goodslist-item .color,
	.goodsdetails .color,
	.carlist .color,
	.taglist .color,
	.result .color {
		border: 1px solid #ff5454;
		border-radius: 2px;
		padding: 0 2px;
		font-size: 10px;
		color: #ff5454;
	}

	.goodsdetails .edit .add,
	.goodslist-item .edit .add,
	.carlist .edit .add,
	.searchwin .edit .add,
	.result .edit .add {
		display: inline-block;
		width: 22px;
		height: 22px;
		background-size: 100% auto;
		vertical-align: middle;
	}

	.goodsdetails .edit .minus,
	.goodslist-item .edit .minus,
	.carlist .edit .minus,
	.searchwin .edit .minus,
	.goodsdetails .edit .plus,
	.goodsdetails .edit .minus,
	.result .edit .minus {
		display: inline-block;
		width: 22px;
		height: 22px;
		background-size: 100% auto;
		vertical-align: middle;
	}

	.edit image {
		height: 100%;
		width: 100%;
	}

	.goodsdetails .edit input[type='number'],
	.goodslist-item .edit input[type='number'],
	.goodslist-item .edit span,
	.carlist .edit input[type='number'],
	.searchwin .edit input[type='number'],
	.goodsdetails .edit input[type='number'],
	.result .edit span,
	.result .edit input[type='number'] {
		width: 26px;
		border: none;
		text-align: center;
		vertical-align: middle;
		color: #434343;
		display: inline-block;
		font-size: 28rpx;
	}

	.echart {
		display: inline-block;
		height: 38rpx;
		width: 38rpx;
		padding-top: 10rpx;
		margin-left: 10rpx;
	}

	.list-footer {
		position: fixed;
		height: 120rpx;
		bottom: 0;
		left: 0;
		right: 0;
		color: #fff;
		background: #323332;
		z-index: 9999;
	}

	.list-footer .invoiceBtn {
		width: 200rpx;
		background: #666;
		color: #999;
		font-size: 33rpx;
		text-align: center;
		line-height: 120rpx;
	}

	.list-footer .invoiceBtn.active {
		background: #ff5454;
		color: #fff;
	}

	.list-footer .carbox .car {
		height: 120rpx;
		width: 120rpx;
		background: #666;
		border-radius: 100%;
		position: absolute;
		top: -20rpx;
		left: 10rpx;
		text-align: center;
	}

	.list-footer .carbox.active .car {
		background: #ff5454;
	}

	.list-footer .carbox .car image {
		width: 70rpx;
		height: 70rpx;
		margin-top: 25rpx;
	}

	.list-footer .carbox .car div {
		opacity: 0;
		position: absolute;
		right: -10rpx;
		top: 0;
	}

	.list-footer .carbox.active .car div {
		color: #010101;
		background: #fff100;
		border-radius: 20rpx;
		padding: 2rpx 8rpx;
		font-size: 22rpx;
		opacity: 1;
	}

	.list-footer .goodsnum {
		margin-left: 180rpx;
		line-height: 120rpx;
		color: #999;
		font-size: 30rpx;
	}

	.list-footer .goodsnum.active {
		color: #fff;
	}

	.list-footer .goodsnum .tip {
		font-size: 22rpx;
		margin-top: 10rpx;
	}

	.filter {
		position: fixed;
		background: rgba(0, 0, 0, 0.4);
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		display: none;
		opacity: 0;
		z-index: 999;
		font-size: 30rpx;
		/*transition: all .2s;*/
	}

	.filter.active {
		display: block;
		animation: fadeIn 0.3s forwards;
		/*transform: translateX(0);*/
	}

	.filter>div {
		position: absolute;
		left: 20%;
		right: 0;
		top: 0;
		bottom: 120rpx;
		background: #fff;
		padding-top: 30px;
		padding-left: 10px;
		transform: translateX(100%);
	}

	.filter.active>div {
		animation: slideInRight 0.3s forwards;
	}

	.filter.active>div>div:first-child {
		position: absolute;
		left: 10px;
		right: 0;
		top: 30px;
		bottom: 40px;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	.filter.active1>div {
		animation: slideOutRight 0.3s forwards;
	}

	@keyframes slideInRight {
		0% {
			transform: translate3d(100%, 0, 0);
			visibility: visible;
		}

		to {
			transform: translateZ(0);
		}
	}

	@keyframes slideOutRight {
		0% {
			transform: translateZ(0);
			visibility: hidden;
		}

		to {
			transform: translate3d(100%, 0, 0);
			visibility: visible;
		}
	}

	.filter>div .filter-modbox span {
		display: inline-block;
		background: #f1f0f0;
		color: #9e9d9d;
		padding: 16rpx 30rpx;
		border-radius: 5px;
		margin: 5px;
		font-size: 24rpx;
	}

	.filter>div .filter-modbox span.active {
		background: #ff5454;
		color: #fff;
	}

	.filter .btnbox {
		position: absolute;
		bottom: 0;
		overflow: hidden;
		width: 100%;
		left: 0;
	}

	.filter .btnbox span {
		float: left;
		width: 50%;
		text-align: center;
		height: 40px;
		background: #f1f0f0;
		line-height: 40px;
		color: #9e9d9d;
	}

	.filter .btnbox span:first-child {
		background: #ff5454;
		color: #fff;
	}

	.red {
		color: #ff5a5a;
	}

	.isCannotice {
		text-align: center;
		font-size: 24rpx;
		background: #fff2d1;
		width: 100%;
		margin: 0;
		position: fixed;
		bottom: 120rpx;
		left: 0;
		line-height: 60rpx;
		color: #010101;
		z-index: 99;
	}

	/*购物车*/

	.carlist {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		top: 0;
		background: rgba(0, 0, 0, 0.4);
		display: none;
		opacity: 0;
		z-index: 999;
		font-size: 28rpx;
	}

	.carlist.active {
		display: block;
		animation: fadeIn 0.3s forwards;
	}

	.carlist>div {
		background: #f6f6f6;
		position: absolute;
		bottom: 60px;
		left: 0;
		width: 100%;
		transform: translateY(100%);
	}

	.carlist.active>div {
		animation: slideInUp 0.3s both;
	}

	.carlist.active2 {
		/*animation: fadeOut .3s .1s forwards;*/
	}

	.carlist.active2>div {
		animation: slideOutDown 0.3s both;
	}

	.carlist .notice {
		padding-left: 20rpx;
		font-size: 28rpx;
	}

	.carlist>div ul {
		background: #fff;
		max-height: 200px;
		overflow: auto;
		-webkit-overflow-scrolling: auto;
	}

	.carlist>div ul li {
		border-bottom: 1px solid #e9e9e9;
		padding: 15px 10px;
	}

	.carlist>div ul li>span {
		width: 20%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.carlist>div ul li>span.name {
		width: 35%;
	}

	.carlist>div ul li .price {
		color: #ff5454;
	}

	.carlist>div ul li .edit {
		width: 25%;
		text-align: right;
	}

	.carlist>div ul li .edit a,
	.carlist>div ul li .edit input {
		display: inline-block !important;
	}

	/*清空购物车*/

	.clearCar {
		color: #ababab;
		margin-right: 20px;
	}

	.clearCar img {
		width: 14px;
		vertical-align: middle;
	}

	.clearCar span {
		vertical-align: middle;
	}

	.goodsdetails {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: rgba(0, 0, 0, 0.4);
		top: 0;
		display: none;
		opacity: 0;
		z-index: 9999;

	}

	.goodsdetails>div {
		background: #fff;
		position: absolute;
		bottom: 0;
		width: 100%;
		transform: translateY(100%);
		transition: all 0.3s;
		height: 70%;
		/* overflow: auto; */
	}

	.goodsdetails .close {
		color: #666;
		font-size: 60rpx;
		position: absolute;
		top: 0;
		right: 20rpx;
	}

	.goodsdetails.active {
		display: block;
		animation: fadeIn 0.3s forwards;
	}

	.goodsdetails.active>div {
		animation: slideInUp 0.3s both;
	}

	.goodsdetails.active1>div {
		animation: slideOutDown 0.3s both;
	}

	.goodsdetails .swiper-container+div {
		padding: 20px;
	}

	.goodsdetails .swiper-container+div .info {
		font-size: 10px;
		color: #999;
	}

	.goodsdetails .price {
		color: #ff5454;
		font-size: 16px;
	}

	.goodsdetails .slide,
	.goodsdetails .slide .swiper {
		width: 100%;
		display: block;
		height: 750rpx;
	}

	.goodsdetails .slide .swiper .slide-image {
		/*height: 100%;*/
		width: 100%;
	}

	.goodsdetails .name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goodsdetails .goodsInfo {
		padding: 20rpx;
		font-size: 28rpx;
	}

	.goodsdetails .goodsInfo .price {
		font-size: 28rpx;
	}

	.goodsdetails .goodsInfo .desc {
		font-size: 30rpx;
		color: #999;

	}

	@keyframes slideInUp {
		0% {
			transform: translate3d(0, 100%, 0);
			visibility: visible;
		}

		to {
			transform: translateZ(0);
		}
	}

	@keyframes slideOutDown {
		0% {
			transform: translateZ(0);
			visibility: hidden;
		}

		to {
			transform: translate3d(0, 100%, 0);
			visibility: visible;
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}

		to {
			opacity: 1;
		}
	}

	@keyframes fadeOut {
		0% {
			opacity: 1;
		}

		to {
			opacity: 0;
		}
	}

	.result {
		position: fixed;
		display: none;
		width: 100%;
		top: 0;
		left: 0;
		bottom: 120rpx;
		background: #fff;
		z-index: 998;
	}

	.result h4 {
		text-align: center;
		line-height: 60rpx;
	}

	.result.active {
		display: block;
	}

	.result .close {
		background: rgba(0, 0, 0, 0.4);
		border-radius: 100%;
		height: 50rpx;
		width: 50rpx;
		text-align: center;
		line-height: 40rpx;
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		color: #fff;
		font-size: 24px;
	}

	.result .resultlist {
		position: absolute;
		top: 60rpx;
		left: 3%;
		bottom: 0;
		width: 94%;
		background: #f6f6f6;
	}

	.result .resultlist ul li {
		padding: 0 10rpx;
	}

	.result .resultlist ul li>span {
		width: 20%;
	}

	.result .resultlist ul li.name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.result .resultlist ul li>span.edit {
		width: 40%;
	}

	.chartbox {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, 0.4);
		z-index: 9999;
		display: none;
	}

	.chartbox.active {
		display: block;
	}

	.chartbox>div {
		height: 500rpx;
		width: 100%;
		background: #fff;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.contact {
		padding: 0;
		line-height: 0;
		height: 60rpx;
		background: none;
		box-shadow: none;
		position: relative;
	}

	.contact image {
		width: 64rpx;
		height: 64rpx;
		border: none;
	}

	.goodsdetails>div>div {
		padding: 20rpx 30rpx;
		box-sizing: border-box;
	}

	.goodsdetails .main {
		height: 100px;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	.goodsdetails .main>div {
		border-bottom: 1px solid #eee;
		padding: 20rpx 0;
	}

	.goodsdetails>div>div:last-child {
		border: none;
	}

	.goodsdetails .imgbox {
		width: 220rpx;
		height: 220rpx;
		border: 2px solid #ff5454;
		border-radius: 10rpx;
		overflow: hidden;
		margin-right: 25rpx;
	}

	.goodsdetails .imgbox image {
		width: 100%;
	}

	.goodsdetails .title {
		color: #333;
		font-size: 28rpx;
	}

	.goodsdetails .tagbox .tag {
		background: #f6f6f6;
		line-height: 80rpx;
		height: 80rpx;
		font-weight: normal;
		padding: 0 20rpx;
		border-radius: 8rpx;
		border: 1px solid #f6f6f6;
		color: #282629;
		font-size: 26rpx;
		margin: 5rpx 10rpx;
	}

	.goodsdetails .tagbox .tag.active {
		border: 1px solid #ffad9b;
		color: #ffad9b;
		background: #fff9f9;
	}

	.goodsdetails .btn {
		display: block;
		color: #fff;
		background: #ef622c;
		border-radius: 100rpx;
		line-height: 40rpx;
		text-align: center;
		padding: 0;
		margin: 10rpx 20rpx;
	}
</style>
