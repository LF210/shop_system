// 引入Vue框架
import Vue from 'vue'
// 引入主组件
import App from './App.vue'
// 引入路由
import router from './router'
// 引入axios
import axios from 'axios'
// 引入全局css
import './assets/css/base.css'
// 引入elementUI框架
import ElementUI from 'element-ui';
// 引入elementUI的css
import 'element-ui/lib/theme-chalk/index.css';
// 引入富文本编辑器及其样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入lodash
import lodash from 'lodash'
// 引入vue-table-tree
import ZkTable from 'vue-table-with-tree-grid'

// 挂载vue-table-tree
Vue.component('table-tree', ZkTable)
// 挂载lodashs
Vue.prototype._ = lodash
// 挂载富文本编辑器
Vue.use(VueQuillEditor)
// 挂载elementUI
Vue.use(ElementUI);

// 设置axios的默认路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
// 挂载axios
Vue.prototype.$http = axios
// 禁用vue的消息提醒
Vue.config.productionTip = false
// 请求拦截器
axios.interceptors.request.use(
  function (config) {
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
// 时间过滤器
Vue.filter("dataForm", (originVal) => {
  const time = new Date(originVal)
  const year = time.getFullYear()
  const month = (time.getMonth() + 1).toString().padStart(2, "0")
  const day = time.getDate().toString().padStart(2, "0")
  const hour = time.getHours().toString().padStart(2, "0")
  const minute = time.getMinutes().toString().padStart(2, "0")
  const second = time.getSeconds().toString().padStart(2, "0")
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
})
// 挂载Vue实例
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')