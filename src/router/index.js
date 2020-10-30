import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/login/login.vue";
import Layout from "../views/layout/layout.vue";
import Article from "../views/articles/article.vue";
import Image from "../views/images/image.vue";
import Page from "../views/page404/404.vue";
import Edit from "../views/articles/edit.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/",
    component: Layout,
    children: [
      { path: "/articles", component: Article },
      { path: "/image", component: Image },
      { path: "/edit/:id", component: Edit }
    ]
  },
  {
    path: "*",
    component: Page
  }
];

const router = new VueRouter({
  routes
});

// 路由导航守卫
// 判断跳转登陆后的页面是否携带token
// to: 要跳入的路由信息。  你要去哪里
// from: 要跳出的路由信息。你从哪里来
// next: 放行方法
//   - next() : 正确跳转。允许进入到 to 路由
//   - next(路由地址) : 不允许去to，而转去指定的路由地址
router.beforeEach((to, from, next) => {
  if (to.path === "/") {
    const token = localStorage.getItem("token");
    if (token) {
      next();
    } else {
      alert("未登录，请先登录");
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
