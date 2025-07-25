<template>
  <div class="admin-dashboard">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div 
        v-for="(stat, index) in stats"
        :key="index"
        class="stat-card stagger-item hover-lift"
      >
        <div class="stat-icon" :style="{ background: stat.gradient }">
          <component :is="stat.icon" class="w-6 h-6" />
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stat.value }}</h3>
          <p class="stat-label">{{ stat.label }}</p>
          <div class="stat-trend" :class="stat.trend.direction">
            <component :is="stat.trend.icon" class="w-4 h-4" />
            <span>{{ stat.trend.value }}%</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="charts-section">
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Ventes par mois</h3>
          <div class="chart-filters">
            <select v-model="selectedPeriod" class="chart-select">
              <option value="6m">6 derniers mois</option>
              <option value="1y">Dernière année</option>
            </select>
          </div>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <BarChart3 class="w-16 h-16 text-gray-300" />
            <p class="text-gray-500">Graphique des ventes</p>
          </div>
        </div>
      </div>
      
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Répartition des ventes</h3>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <PieChart class="w-16 h-16 text-gray-300" />
            <p class="text-gray-500">Graphique en secteurs</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Orders -->
    <div class="recent-orders-section">
      <div class="section-header">
        <h3 class="section-title">Commandes récentes</h3>
        <RouterLink to="/admin/orders" class="view-all-link">
          Voir tout
          <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>
      
      <div class="orders-table">
        <div class="table-header">
          <div class="table-cell">Commande</div>
          <div class="table-cell">Client</div>
          <div class="table-cell">Date</div>
          <div class="table-cell">Total</div>
          <div class="table-cell">Statut</div>
        </div>
        
        <div 
          v-for="order in recentOrders"
          :key="order.id"
          class="table-row stagger-item hover-lift"
        >
          <div class="table-cell font-medium">#{{ order.id }}</div>
          <div class="table-cell">{{ order.customer }}</div>
          <div class="table-cell">{{ formatDate(order.date) }}</div>
          <div class="table-cell font-semibold">{{ formatPrice(order.total) }}</div>
          <div class="table-cell">
            <span class="status-badge" :class="getStatusClass(order.status)">
              {{ order.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Top Products -->
    <div class="top-products-section">
      <div class="section-header">
        <h3 class="section-title">Produits populaires</h3>
        <RouterLink to="/admin/products" class="view-all-link">
          Voir tout
          <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>
      
      <div class="products-grid">
        <div 
          v-for="product in topProducts"
          :key="product.id"
          class="product-card stagger-item hover-lift"
        >
          <img :src="product.image" :alt="product.name" class="product-image" />
          <div class="product-info">
            <h4 class="product-name">{{ product.name }}</h4>
            <p class="product-category">{{ product.category }}</p>
            <div class="product-stats">
              <span class="product-price">{{ formatPrice(product.price) }}</span>
              <span class="product-stock">{{ product.stock }} en stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { 
  Euro, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  PieChart,
  ArrowRight
} from 'lucide-vue-next'
import { useMainStore } from '../../stores/main'

const store = useMainStore()
const selectedPeriod = ref('6m')

const stats = [
  {
    icon: Euro,
    value: '125 400€',
    label: 'Chiffre d\'affaires',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    trend: {
      icon: TrendingUp,
      value: 12.5,
      direction: 'up'
    }
  },
  {
    icon: ShoppingCart,
    value: '1,234',
    label: 'Commandes',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    trend: {
      icon: TrendingUp,
      value: 8.2,
      direction: 'up'
    }
  },
  {
    icon: Users,
    value: '8,567',
    label: 'Clients',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    trend: {
      icon: TrendingUp,
      value: 5.7,
      direction: 'up'
    }
  },
  {
    icon: TrendingUp,
    value: '€2,450',
    label: 'Panier moyen',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    trend: {
      icon: TrendingDown,
      value: 2.1,
      direction: 'down'
    }
  }
]

const recentOrders = computed(() => store.orders.slice(0, 5))
const topProducts = computed(() => store.featuredProducts.slice(0, 4))

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('fr-FR').format(new Date(date))
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'livré':
      return 'status-success'
    case 'en cours':
      return 'status-warning'
    case 'annulé':
      return 'status-error'
    default:
      return 'status-info'
  }
}
</script>

<style scoped>
.admin-dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

.stat-card {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  transition: all var(--transition-normal);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.stat-label {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-2);
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.stat-trend.up {
  color: var(--color-success);
}

.stat-trend.down {
  color: var(--color-error);
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-6);
}

.chart-card {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.chart-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
}

.chart-select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: white;
}

.chart-content {
  padding: var(--space-8);
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
  opacity: 0.5;
}

.recent-orders-section,
.top-products-section {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.section-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.view-all-link:hover {
  gap: var(--space-3);
}

.orders-table {
  padding: var(--space-6);
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-gray-200);
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-gray-100);
  transition: all var(--transition-normal);
  border-radius: var(--border-radius-lg);
}

.table-row:hover {
  background: var(--color-gray-50);
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

.table-cell {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.status-badge {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.status-success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.status-error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.status-info {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-secondary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  padding: var(--space-6);
}

.product-card {
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.product-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.product-info {
  padding: var(--space-4);
}

.product-name {
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
  font-size: var(--font-size-sm);
}

.product-category {
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
  margin-bottom: var(--space-3);
}

.product-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-price {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.product-stock {
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr 1fr;
    font-size: var(--font-size-xs);
  }
  
  .table-cell:nth-child(3),
  .table-cell:nth-child(4) {
    display: none;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>