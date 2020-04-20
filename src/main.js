import Vue from 'vue'
import App from './App'
import request from './utils/request'
Vue.prototype.$http = request;
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)
app.$mount()
Vue.prototype.globalData = getApp().globalData
