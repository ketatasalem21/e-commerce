<template>
  <div class="admin-analytics">
    <!-- Header -->
    <div class="page-header">
      <h2 class="page-title">Analytics</h2>
      <div class="date-filter">
        <select v-model="selectedPeriod" class="period-select">
          <option value="7d">7 derniers jours</option>
          <option value="30d">30 derniers jours</option>
          <option value="90d">90 derniers jours</option>
          <option value="1y">Dernière année</option>
        </select>
      </div>
    </div>
    
    <!-- Key Metrics -->
    <div class="metrics-grid">
      <div 
        v-for="(metric, index) in keyMetrics"
        :key="index"
        class="metric-card stagger-item hover-lift"
      >
        <div class="metric-icon" :style="{ background: metric.gradient }">
          <component :is="metric.icon" class="w-6 h-6" />
        </div>
        <div class="metric-content">
          <h3 class="metric-value">{{ metric.value }}</h3>
          <p class="metric-label">{{ metric.label }}</p>
          <div class="metric-change" :class="metric.change.direction">
            <component :is="metric.change.icon" class="w-4 h-4" />
            <span>{{ metric.change.value }}% vs période précédente</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Sales Chart -->
      <div class="chart-card large-chart">
        <div class="chart-header">
          <h3 class="chart-title">Évolution des ventes</h3>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color" style="background: var(--color-primary)"></div>
              <span>Ventes</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: var(--color-secondary)"></div>
              <span>Commandes</span>
            </div>
          </div>
        </div>
        <div class="chart-content">
          <div class="chart-placeholder">
            <TrendingUp class="w-16 h-16 text-gray-300" />
            <p class="text-gray-500">Graphique d'évolution des ventes</p>
          </div>
        </div>
      </div>
      
      <!-- Category Distribution -->
      <div class="chart-card">
        <div class="chart-header">
          <h3 class="chart-title">Ventes par catégorie</h3>
        </div>
        <div class="chart-content">
          <div class="category-stats">
            <div 
              v-for="category in categoryStats"
              :key="category.name"
              class="category-item"
            >
              <div class="category-info">
                <span class="category-name">{{ category.name }}</span>
                <span class="category-value">{{ formatPrice(category.sales) }}</span>
              </div>
              <div class="category-bar">
                <div 
                  class="category-fill"
                  :style="{ width: `${category.percentage}%`, background: category.color }"
                ></div>
              </div>
              <span class="category-percentage">{{ category.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Performance Tables -->
    <div class="tables-grid">
      <!-- Top Products -->
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Produits les plus vendus</h3>
          <RouterLink to="/admin/products" class="view-all-link">
            Voir tout
            <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
        <div class="table-content">
          <div 
            v-for="(product, index) in topProducts"
            :key="product.id"
            class="product-row stagger-item"
          >
            <div class="product-rank">{{ index + 1 }}</div>
            <img :src="product.image" :alt="product.name" class="product-image" />
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <p class="product-category">{{ product.category }}</p>
            </div>
            <div class="product-stats">
              <span class="product-sales">{{ product.salesCount }} vendus</span>
              <span class="product-revenue">{{ formatPrice(product.revenue) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Customer Insights -->
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Insights clients</h3>
        </div>
        <div class="table-content">
          <div class="insight-grid">
            <div class="insight-item">
              <div class="insight-icon">
                <Users class="w-5 h-5" />
              </div>
              <div class="insight-content">
                <span class="insight-value">2,547</span>
                <span class="insight-label">Nouveaux clients</span>
              </div>
            </div>
            
            <div class="insight-item">
              <div class="insight-icon">
                <Repeat class="w-5 h-5" />
              </div>
              <div class="insight-content">
                <span class="insight-value">68%</span>
                <span class="insight-label">Taux de rétention</span>
              </div>
            </div>
            
            <div class="insight-item">
              <div class="insight-icon">
                <Clock class="w-5 h-5" />
              </div>
              <div class="insight-content">
                <span class="insight-value">4.2j</span>
                <span class="insight-label">Temps moyen entre commandes</span>
              </div>
            </div>
            
            <div class="insight-item">
              <div class="insight-icon">
                <Star class="w-5 h-5" />
              </div>
              <div class="insight-content">
                <span class="insight-value">4.7/5</span>
                <span class="insight-label">Satisfaction moyenne</span>
              </div>
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
  ArrowRight,
  Repeat,
  Clock,
  Star
} from 'lucide-vue-next'
import { useMainStore } from '../../stores/main'

const store = useMainStore()
const selectedPeriod = ref('30d')

const keyMetrics = [
  {
    icon: Euro,
    value: '€125,400',
    label: 'Chiffre d\'affaires',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    change: {
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
    change: {
      icon: TrendingUp,
      value: 8.2,
      direction: 'up'
    }
  },
  {
    icon: Users,
    value: '8,567',
    label: 'Clients actifs',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    change: {
      icon: TrendingUp,
      value: 15.3,
      direction: 'up'
    }
  },
  {
    icon: TrendingUp,
    value: '€101.50',
    label: 'Panier moyen',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    change: {
      icon: TrendingDown,
      value: 2.1,
      direction: 'down'
    }
  }
]

const categoryStats = [
  {
    name: 'Electronics',
    sales: 75400,
    percentage: 45,
    color: 'var(--color-primary)'
  },
  {
    name: 'Audio',
    sales: 32100,
    percentage: 25,
    color: 'var(--color-secondary)'
  },
  {
    name: 'Wearables',
    sales: 25200,
    percentage: 20,
    color: 'var(--color-accent)'
  },
  {
    name: 'Accessories',
    sales: 12300,
    percentage: 10,
    color: 'var(--color-warning)'
  }
]

const topProducts = computed(() => {
  return store.products.slice(0, 5).map((product, index) => ({
    ...product,
    salesCount: Math.floor(Math.random() * 100) + 50,
    revenue: (Math.floor(Math.random() * 100) + 50) * product.price
  }))
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}
</script>

<style scoped>
.admin-analytics {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
}

.period-select {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
  background: white;
  cursor: pointer;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

.metric-card {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  transition: all var(--transition-normal);
}

.metric-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.metric-label {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-2);
}

.metric-change {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.metric-change.up {
  color: var(--color-success);
}

.metric-change.down {
  color: var(--color-error);
}

.charts-grid {
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

.chart-legend {
  display: flex;
  gap: var(--space-4);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: var(--border-radius-sm);
}

.chart-content {
  padding: var(--space-6);
}

.chart-placeholder {
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}

.category-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.category-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--space-4);
  align-items: center;
}

.category-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.category-name {
  font-weight: 500;
  color: var(--color-gray-900);
}

.category-value {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.category-bar {
  width: 100px;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.category-fill {
  height: 100%;
  border-radius: var(--border-radius-full);
  transition: width var(--transition-slow);
}

.category-percentage {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-700);
  min-width: 40px;
  text-align: right;
}

.tables-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.table-card {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.table-header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  font-size: var(--font-size-lg);
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

.table-content {
  padding: var(--space-6);
}

.product-row {
  display: grid;
  grid-template-columns: auto 60px 1fr auto;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-gray-100);
}

.product-row:last-child {
  border-bottom: none;
}

.product-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-gray-100);
  color: var(--color-gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius-lg);
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-weight: 500;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
  font-size: var(--font-size-sm);
}

.product-category {
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
}

.product-stats {
  text-align: right;
}

.product-sales {
  display: block;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  margin-bottom: var(--space-1);
}

.product-revenue {
  font-weight: 600;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
}

.insight-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.insight-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-lg);
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
}

.insight-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.insight-value {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-gray-900);
}

.insight-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .tables-grid {
    grid-template-columns: 1fr;
  }
  
  .insight-grid {
    grid-template-columns: 1fr;
  }
  
  .product-row {
    grid-template-columns: auto 1fr;
    gap: var(--space-3);
  }
  
  .product-image {
    width: 40px;
    height: 40px;
  }
  
  .product-stats {
    grid-column: 1 / -1;
    justify-self: end;
    margin-top: var(--space-2);
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>