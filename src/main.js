/*
 * @Descripttion: 
 * @version: 
 * @Author: zhenzipu
 * @Date: 2021-07-15 15:05:39
 * @LastEditors: zhenzipu
 * @LastEditTime: 2021-12-21 15:36:26
 */
import Vue from 'vue'
import App from './App.vue'
import '@babel/polyfill';

// import JsMind from '../dist/build'
import JsMind from './components/JsMind/index'
console.log(`JsMind`, JsMind)
Vue.use(JsMind)

new Vue({
  el: '#app',
  render: h => h(App)
})
