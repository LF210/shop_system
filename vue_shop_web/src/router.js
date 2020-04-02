import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: "/",
      redirect: "/home"
    },
    {
      path: "/login",
      component: () => import("@/views/Login.vue")
    },
    {
      path: "/home",
      component: () => import("@/views/Home.vue"),
      children: [{
          path: "/",
          redirect: "/welcome"
        },
        // 欢迎页面
        {
          path: "/welcome",
          component: () => import("@/components/welcome.vue")
        },
        // 用户列表页面
        {
          path: "/users",
          component: () => import("@/components/usersList.vue")
        },
        // 角色列表页面
        {
          path: "/roles",
          component: () => import("@/components/rolesList.vue")
        },
        // 权限列表页面
        {
          path: "/rights",
          component: () => import("@/components/rightsList.vue")
        },
        // 商品列表
        {
          path: "/goods",
          component: () => import("@/components/goodsList.vue")
        },
        // 添加商品
        {
          path: "/goodsAdd",
          component: () => import("@/components/goodsAdd.vue")
        },
        // 参数列表
        {
          path: "/params",
          component: () => import("@/components/paramsList.vue")
        },
        // 商品分类
        {
          path: "/categories",
          component: () => import("@/components/categoriesList.vue")
        },
        // 订单列表
        {
          path: "/orders",
          component: () => import("@/components/ordersList.vue")
        },
        // 数据报表
        {
          path: "/reports",
          component: () => import("@/components/reportsList.vue")
        }
      ]
    }
  ]
})
// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  if (!window.sessionStorage.getItem("token")) return next("/login")
  next()
})

export default router