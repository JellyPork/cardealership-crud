// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/UserDashboard.vue'),
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        //meta: {
          //requiresAuth: true,
        //}
      },
      {
        path: 'vehicles',
        name: 'Vehicles',
        component: () => import('@/views/Vehicles.vue'),
        //meta: {
          //requiresAuth: true,
        //}
      },
      {
        path: 'models',
        name: 'Models',
        component: () => import('@/views/Models.vue'),
        //meta: {
          //requiresAuth: true,
        //}
      },
      {
        path: 'brands',
        name: 'Brands',
        component: () => import('@/views/Brands.vue'),
        //meta: {
          //requiresAuth: true,
        //}
      },
      {
        path: 'branddashboard',
        name: 'BrandDasboard',
        component: () => import('@/views/BrandDashboard.vue'),
        //meta: {
          //requiresAuth: true,
        //}
      },
      {
        path: 'vehicledash',
        name: 'VehicleDashboard',
        component: () => import('@/views/VehicleDashboard.vue'),

        },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/UserDashboard.vue'),
        //meta: {
          //requiresAuth: true,
        //}
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
