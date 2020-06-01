import Vue from 'vue'
import App from './App'
import request from './utils/request'
Vue.prototype.$http = request;
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)
let audio;
audio = wx.createInnerAudioContext();
audio.src='https://test.veimx.com/1001.mp3';
audio.autoplay=true;
Vue.prototype.$audio = audio;
app.$mount()
Vue.prototype.globalData = getApp().globalData
