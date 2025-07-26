import { createRouter, createWebHistory } from 'vue-router'
import ClientLayout from '../layouts/ClientLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'

// Client Views
import Home from '../views/client/Home.vue'
import Products from '../views/client/Products.vue'
import ProductDetail from '../views/client/ProductDetail.vue'
import Cart from '../views/client/Cart.vue'
import Checkout from '../views/client/Checkout.vue'
import Profile from '../views/client/Profile.vue'
import OrderHistory from '../views/client/OrderHistory.vue'
import Wishlist from '../views/client/Wishlist.vue'

// Admin Views
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminBanking from '../views/admin/Banking.vue'
import AdminMarketing from '../views/admin/Marketing.vue'
import AdminProducts from '../views/admin/Products.vue'
import AdminCategories from '../views/admin/Categories.vue'
import AdminOrders from '../views/admin/Orders.vue'
import AdminCustomers from '../views/admin/Customers.vue'
import AdminAnalytics from '../views/admin/Analytics.vue'
import AdminInventory from '../views/admin/Inventory.vue'
import AdminReports from '../views/admin/Reports.vue'
import AdminSettings from '../views/admin/Settings.vue'

// Auth Views
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import ForgotPassword from '../views/auth/ForgotPassword.vue'
import ResetPassword from '../views/auth/ResetPassword.vue'
import VerifyEmail from '../views/auth/VerifyEmail.vue'
import LockScreen from '../views/auth/LockScreen.vue'

// Error Views
import NotFound from '../views/errors/NotFound.vue'
import ServerError from '../views/errors/ServerError.vue'

const routes = [
  // Auth Routes
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: Login },
      { path: 'register', name: 'Register', component: Register },
      { path: 'forgot-password', name: 'ForgotPassword', component: ForgotPassword },
      { path: 'reset-password', name: 'ResetPassword', component: ResetPassword },
      { path: 'verify-email', name: 'VerifyEmail', component: VerifyEmail },
      { path: 'lock-screen', name: 'LockScreen', component: LockScreen }
    ]
  },
  
  // Client Routes
  {
    path: '/',
    component: ClientLayout,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'products', name: 'Products', component: Products },
      { path: 'product/:id', name: 'ProductDetail', component: ProductDetail },
      { path: 'cart', name: 'Cart', component: Cart },
      { path: 'checkout', name: 'Checkout', component: Checkout },
      { path: 'profile', name: 'Profile', component: Profile },
      { path: 'orders', name: 'OrderHistory', component: OrderHistory },
      { path: 'wishlist', name: 'Wishlist', component: Wishlist }
    ]
  },
  
  // Admin Routes
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', name: 'AdminDashboard', component: AdminDashboard },
      { path: 'banking', name: 'AdminBanking', component: AdminBanking },
      { path: 'marketing', name: 'AdminMarketing', component: AdminMarketing },
      { path: 'products', name: 'AdminProducts', component: AdminProducts },
      { path: 'products/create', name: 'AdminCreateProduct', component: () => import('../views/admin/CreateProduct.vue') },
      { path: 'categories', name: 'AdminCategories', component: AdminCategories },
      { path: 'invoices', name: 'AdminInvoices', component: () => import('../views/admin/Invoices.vue') },
      { path: 'orders', name: 'AdminOrders', component: AdminOrders },
      { path: 'customers', name: 'AdminCustomers', component: AdminCustomers },
      { path: 'analytics', name: 'AdminAnalytics', component: AdminAnalytics },
      { path: 'inventory', name: 'AdminInventory', component: AdminInventory },
      { path: 'reports', name: 'AdminReports', component: AdminReports },
      { path: 'settings', name: 'AdminSettings', component: AdminSettings }
    ]
  },
  
  // Error Routes
  { path: '/500', name: 'ServerError', component: ServerError },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})