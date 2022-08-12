import Vue from 'vue'
import VueRouter from 'vue-router'
import ClusterList from '../components/cluster/ClusterList.vue'
import ClusterInspect from '../components/cluster/ClusterInspect.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ClusterList',
    component: ClusterList
  },
  {
    path: '/cluster/:clusterName',
    name: 'ClusterInspect',
    component: ClusterInspect
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
