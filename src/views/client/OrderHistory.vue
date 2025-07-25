<template>
  <div class="order-history-page">
    <div class="container">
      <div class="page-header fade-in-up">
        <h1 class="page-title">Historique des commandes</h1>
        <p class="page-description">
          Consultez l'historique de toutes vos commandes et suivez leur statut.
        </p>
      </div>
      
      <div class="orders-filters slide-in-right">
        <div class="search-bar">
          <Search class="search-icon" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher une commande..."
            class="search-input"
          />
        </div>
        
        <select v-model="filterStatus" class="filter-select">
          <option value="">Tous les statuts</option>
          <option value="En cours">En cours</option>
          <option value="Livré">Livré</option>
          <option value="Annulé">Annulé</option>
        </select>
      </div>
      
      <div v-if="filteredOrders.length > 0" class="orders-list">
        <div 
          v-for="order in filteredOrders"
          :key="order.id"
          class="order-card stagger-item hover-lift"
        >
          <div class="order-header">
            <div class="order-info">
              <h3 class="order-number">Commande #{{ order.id }}</h3>
              <p class="order-date">{{ formatDate(order.date) }}</p>
            </div>
            <div class="order-status">
              <span class="status-badge" :class="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </div>
          </div>
          
          <div class="order-items">
            <div 
              v-for="item in order.items"
              :key="item.id"
              class="order-item"
            >
              <img :src="item.product.image" :alt="item.product.name" class="item-image" />
              <div class="item-details">
                <h4 class="item-name">{{ item.product.name }}</h4>
                <p class="item-quantity">Quantité: {{ item.quantity }}</p>
              </div>
              <div class="item-price">
                {{ formatPrice(item.product.price * item.quantity) }}
              </div>
            </div>
          </div>
          
          <div class="order-footer">
            <div class="order-total">
              <span class="total-label">Total:</span>
              <span class="total-amount">{{ formatPrice(order.total) }}</span>
            </div>
            <div class="order-actions">
              <AnimatedButton 
                variant="secondary" 
                size="sm"
                @click="viewOrderDetails(order)"
              >
                <Eye class="w-4 h-4" />
                Détails
              </AnimatedButton>
              <AnimatedButton 
                v-if="order.status === 'Livré'"
                variant="primary" 
                size="sm"
                @click="reorderItems(order)"
              >
                <RotateCcw class="w-4 h-4" />
                Recommander
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="empty-state fade-in-scale">
        <Package class="empty-icon" />
        <h3 class="empty-title">Aucune commande trouvée</h3>
        <p class="empty-description">
          {{ searchQuery || filterStatus ? 'Aucune commande ne correspond à vos critères.' : 'Vous n\'avez pas encore passé de commande.' }}
        </p>
        <AnimatedButton 
          variant="primary"
          @click="$router.push('/products')"
        >
          Découvrir nos produits
        </AnimatedButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Eye, RotateCcw, Package } from 'lucide-vue-next'
import { useMainStore, type Order } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const router = useRouter()
const store = useMainStore()

const searchQuery = ref('')
const filterStatus = ref('')

const orders = computed(() => store.orders)

const filteredOrders = computed(() => {
  let filtered = orders.value
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      order.id.toString().includes(query) ||
      order.customer.toLowerCase().includes(query)
    )
  }
  
  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(order => order.status === filterStatus.value)
  }
  
  // Sort by date (most recent first)
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
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

const viewOrderDetails = (order: Order) => {
  console.log('View order details:', order.id)
  // Implement order details modal or navigation
}

const reorderItems = (order: Order) => {
  // Add all items from the order back to cart
  order.items.forEach(item => {
    store.addToCart(item.product, item.quantity)
  })
  
  // Navigate to cart
  router.push('/cart')
}
</script>

<style scoped>
.order-history-page {
  padding: var(--space-12) 0;
  min-height: 100vh;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.page-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.orders-filters {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  background: white;
  padding: var(--space-4);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
}

.search-bar {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray-400);
  width: 20px;
  height: 20px;
}

.search-input {
  width: 100%;
  padding: var(--space-3) var(--space-4) var(--space-3) 48px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.filter-select {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  background: white;
  min-width: 150px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.order-card {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
}

.order-number {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--color-gray-900);
}

.order-date {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.status-badge {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
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

.order-items {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.order-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--color-gray-900);
}

.item-quantity {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.item-price {
  font-weight: 600;
  color: var(--color-primary);
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6);
  background: var(--color-gray-50);
}

.order-total {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.total-label {
  font-weight: 500;
  color: var(--color-gray-700);
}

.total-amount {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-gray-900);
}

.order-actions {
  display: flex;
  gap: var(--space-3);
}

.empty-state {
  text-align: center;
  padding: var(--space-20);
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: var(--color-gray-400);
  margin: 0 auto var(--space-6);
}

.empty-title {
  font-size: var(--font-size-2xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--color-gray-900);
}

.empty-description {
  color: var(--color-gray-600);
  margin-bottom: var(--space-8);
  line-height: var(--line-height-relaxed);
}

@media (max-width: 768px) {
  .orders-filters {
    flex-direction: column;
  }
  
  .order-header {
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
  }
  
  .order-footer {
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
  }
  
  .order-actions {
    justify-content: center;
  }
}
</style>
