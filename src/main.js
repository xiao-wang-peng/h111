import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import axios from "./utils/request.js";

import "./style/index.less";
import MyNav from "@/components/Bread-crumbs.vue";

// 引入组件 element-ui
Vue.use(ElementUI);
Vue.component("MyNav", MyNav);
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
