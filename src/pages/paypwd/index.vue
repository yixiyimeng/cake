<template>
    <div class="loginbox">
        <form>
            <div>绑定账号:{{phone}}</div>
            <!-- <div class="group flex flex-align-center">
                <i class="phone"><image src="/static/images/icon1.png" mode="aspectFit"/></i>
                <input class="flex-1" type="text" value="" placeholder="请输入手机号码" v-model="phone" />
            </div> -->
            <div class="clearfix codebox mt20">
                <div class="group flex flex-align-center">
                    <i class="code">
                        <image src="/static/images/icon7.png" mode="aspectFit"/>
                    </i>
                    <input type="text" value="" placeholder="验证码" class="flex-1" v-model='code'/>
                </div>

                <button class="getcode" :disabled="isAble=='0'" :class="{'active':isAble=='1'}" @click="getCode()">
                    {{codetxt}}
                </button>
            </div>

            <div class="group flex flex-align-center mt20">
                <i class="lock">
                    <image src="/static/images/icon2.png" mode="aspectFit"/>
                </i>
                <input class="flex-1 pwd" type="password" value="" placeholder="请输入6位密码" v-model="pwd"/>
            </div>
            <div class="group flex flex-align-center mt20">
                <i class="lock">
                    <image src="/static/images/icon2.png" mode="aspectFit"/>
                </i>
                <input class="flex-1 compwd" type="password" placeholder="请输入6位确认密码" v-model="confirmpwd"/>
            </div>
            <div class="submitBtn" @click="setPayPwd()">确定</div>
        </form>
    </div>
</template>

<script>
    import api from '@/utils/api';

    export default {
        components: {},

        data() {
            return {
                code: '',
                phone: '',
                pwd: '',
                confirmpwd: '',
                isAble: '1',
                codetxt: '获取验证码',
				timer:null
            }
        },
        onShow() {
            // this.getUserInfo();
			var userinfo = wx.getStorageSync('userinfo');
			this.phone=userinfo.cellphone;
        },
        mounted() {
            // 			this.phone = this.$root.$mp.query.phone;
            // 			console.log(this.phone)
        },
		onHide(){
			this.code = '';
			this.phone = '';
			this.pwd = '';
			this.confirmpwd = '';
			this.isAble = '1';
			this.codetxt = '获取验证码';
			if(this.timer){
				clearInterval(this.timer);
			}
		},
        onUnload() {
            this.code = '';
            this.phone = '';
            this.pwd = '';
            this.confirmpwd = '';
            this.isAble = '1';
            this.codetxt = '获取验证码';
			if(this.timer){
				clearInterval(this.timer);
			}
        },
        methods: {
            getCode() {
                var that = this;
                if (that.isAble == '1') {
                    that.isAble = '0';
                    var num = 60;
                    that.codetxt = num + 's';
                    this.timer = setInterval(function () {
                        if (num == 1) {
                            clearInterval(this.timer);
                            that.codetxt = '获取验证码';
                            that.isAble = '1';
                        } else {
                            num--;
                            that.codetxt = num + 's';
                        }
                    }, 1000);
                    api.sendVerifyCode(that.phone).then(da => {
                        var data = da.param;
                        if (data.code == 200) {
                            wx.showToast({
                                title: '验证码已发送，请查看短信',
                                icon: 'success'
                            });
                        } else {
                            wx.showToast({
                                title: '验证码发送失败，请稍后重试',
                                icon: 'none'
                            });
                        }
                    })
                }
            },
            setPayPwd() {
                if (this.code == '') {
                    wx.showToast({
                        title: '请填写验证码',
                        icon: 'none'
                    });
                    return false;
                }
                if (this.pwd == '' || this.confirmpwd == '') {
                    wx.showToast({
                        title: '请填写密码',
                        icon: 'none'
                    });
                    return false;
                }
                var param = {
                    formData: {
                        pay_password: this.pwd,
                        pay_password_confirm: this.confirmpwd,
                        verification_code: this.code
                    }
                }
                api.setMemberPayPassword(param, this.globalData.member_id).then(da => {
                    var data = da.param;
                    if (data.code == 200) {
                       wx.navigateBack({
                            delta: 1
                        });
                    }
					wx.showToast({
					    title: data.message,
					    icon: 'none'
					});
                })
            }
        },
        watch: {},
        computed: {}
    }
</script>

<style scoped>
   .loginbox {
   	width: 540rpx;
   	margin: 0 auto;
   	padding-top: 40px;
   }
   
   .loginbox .logo,
   .loginbox .logo img {
   	display: block;
   	width: 175px;
   	margin: 0 auto;
   }
   
   .loginbox form {
   	margin-top: 50px;
   }
   
   .loginbox .group {
   	height: 40px;
   	border-radius: 5px;
   	border: 1px solid #ff5454;
   	background: #fff;
   	font-size: 30rpx;
   }
   
   .loginbox .group i {
   	display: block;
   	height: 20px;
   	width: 36px;
   }
   
   .loginbox .group i image {
   	display: block;
   	width: 100%;
   	height: 100%;
   }
   
   .mt20 {
   	margin-top: 40rpx;
   }
   
   .loginbox .group input {
   	background: none;
   	border: none;
   	width: 100%;
   	height: 100%;
   }
   
   .loginbox .codebox>div {
   	width: 55%;
   	float: left;
   }
   
   .loginbox .codebox>button {
   	float: right;
   	width: 40%;
   	background: #ff5454;
   	line-height: 40px;
   	color: #fff;
   	border-radius: 5px;
   	text-align: center;
   	font-size: 30rpx;
   	opacity: .8;
   }
   
   .loginbox .codebox>button.active {
   	opacity: 1;
   }
   
   .loginbox .submitBtn {
   	display: block;
   	width: 100%;
   	background: #ff5454;
   	color: #fff;
   	line-height: 80rpx;
   	height: 80rpx;
   	text-align: center;
   	border-radius: 10rpx;
   	border: none;
   	margin-top: 70rpx;
   }
</style>
