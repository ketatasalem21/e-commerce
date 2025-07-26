<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'collapsed': sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <ShoppingBag class="w-8 h-8" />
          <span v-if="!sidebarCollapsed" class="logo-text">Admin</span>
        </div>
        <button @click="toggleSidebar" class="sidebar-toggle">
          <Menu class="w-5 h-5" />
        </button>
      </div>
      
      <nav class="sidebar-nav">
        <!-- Dashboard Section -->
        <div class="nav-section">
          <div v-if="!sidebarCollapsed" class="section-title">Dashboard</div>
          <RouterLink to="/admin" class="nav-item" exact-active-class="active">
            <ShoppingBag class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">E-commerce</span>
          </RouterLink>
          <RouterLink to="/admin/banking" class="nav-item">
            <CreditCard class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Banking</span>
          </RouterLink>
          <RouterLink to="/admin/marketing" class="nav-item">
            <Megaphone class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Marketing</span>
          </RouterLink>
        </div>
        
        <!-- Products Section -->
        <div class="nav-section">
          <div v-if="!sidebarCollapsed" class="section-title">Produits</div>
          <RouterLink to="/admin/products" class="nav-item">
            <Package class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Produits</span>
          </RouterLink>
          <RouterLink to="/admin/categories" class="nav-item">
            <Folder class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Catégories</span>
          </RouterLink>
          <RouterLink to="/admin/inventory" class="nav-item">
            <Warehouse class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Inventaire</span>
          </RouterLink>
        </div>
        
        <!-- Business Section -->
        <div class="nav-section">
          <div v-if="!sidebarCollapsed" class="section-title">Business</div>
          <RouterLink to="/admin/orders" class="nav-item">
            <ShoppingCart class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Commandes</span>
          </RouterLink>
          <RouterLink to="/admin/invoices" class="nav-item">
            <FileText class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Factures</span>
          </RouterLink>
          <RouterLink to="/admin/customers" class="nav-item">
            <Users class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Clients</span>
          </RouterLink>
          <RouterLink to="/admin/analytics" class="nav-item">
            <TrendingUp class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Analytics</span>
          </RouterLink>
          <RouterLink to="/admin/reports" class="nav-item">
            <ClipboardList class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Rapports</span>
          </RouterLink>
        </div>
        
        <!-- Settings Section -->
        <div class="nav-section">
          <div v-if="!sidebarCollapsed" class="section-title">Configuration</div>
          <RouterLink to="/admin/settings" class="nav-item">
            <Settings class="w-5 h-5" />
            <span v-if="!sidebarCollapsed">Paramètres</span>
          </RouterLink>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <RouterLink to="/" class="nav-item">
          <ArrowLeft class="w-5 h-5" />
          <span v-if="!sidebarCollapsed">Retour client</span>
        </RouterLink>
      </div>
    </aside>
    
    <!-- Main Content -->
    <div class="main-content">
      <!-- Top Bar -->
      <header class="topbar">
        <div class="topbar-left">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </div>
        
        <div class="topbar-right">
          <button class="notification-btn">
            <Bell class="w-5 h-5" />
            <span class="notification-badge">3</span>
          </button>
          
          <div class="user-menu">
            <div class="user-avatar">
              <User class="w-5 h-5" />
            </div>
          </div>
        </div>
      </header>
      
      <!-- Content -->
      <main class="content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { RouterLink, RouterView } from 'vue-router'
import { 
  ShoppingBag, 
  Menu, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  ArrowLeft,
  Bell,
  User,
  Users,
  Settings,
  ClipboardList,
  Warehouse,
  Folder,
  CreditCard,
  Megaphone,
  FileText
} from 'lucide-vue-next'

const route = useRoute()
const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const pageTitle = computed(() => {
  const routeNames: Record<string, string> = {
    'AdminDashboard': 'E-commerce Dashboard',
    'AdminBanking': 'Banking Dashboard',
    'AdminMarketing': 'Marketing Dashboard',
    'AdminProducts': 'Gestion des Produits',
    'AdminOrders': 'Gestion des Commandes',
    'AdminAnalytics': 'Analytics',
    'AdminCategories': 'Gestion des Catégories',
    'AdminCustomers': 'Gestion des Clients',
    'AdminInventory': 'Gestion de l\'Inventaire',
    'AdminReports': 'Rapports',
    'AdminSettings': 'Paramètres'
  }
  return routeNames[route.name as string] || 'Admin'
})
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-gray-50);
}

.sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid var(--color-gray-200);
  display: flex;
  flex-direction: column;
  transition: width 0.3s var(--ease-out-expo);
  position: relative;
  z-index: 30;
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-primary);
  font-weight: 700;
  font-size: var(--font-size-xl);
}

.logo-text {
  transition: opacity 0.2s ease;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: var(--color-gray-600);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
}

.sidebar-toggle:hover {
  background: var(--color-gray-100);
  color: var(--color-primary);
}

.sidebar-nav {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.section-title {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 var(--space-4);
  margin-bottom: var(--space-2);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  margin-bottom: var(--space-2);
  text-decoration: none;
  color: var(--color-gray-700);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  font-weight: 500;
  position: relative;
}

.nav-item:hover {
  background: var(--color-gray-50);
  color: var(--color-primary);
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  color: var(--color-primary);
  font-weight: 600;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background: var(--gradient-primary);
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
}

.sidebar-footer {
  padding: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.topbar {
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
  padding: var(--space-4) var(--space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.notification-btn {
  position: relative;
  background: none;
  border: none;
  color: var(--color-gray-600);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
}

.notification-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-primary);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--color-error);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--border-radius-full);
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-lg);
}

.content {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    z-index: 50;
    transform: translateX(-100%);
  }
  
  .sidebar:not(.collapsed) {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
}
</style>
