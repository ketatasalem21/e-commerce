<template>
  <div class="admin-orders">
    <div class="page-header">
      <h2 class="page-title">Gestion des Commandes</h2>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-value">{{ orders.length }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ pendingOrdersCount }}</span>
          <span class="stat-label">En cours</span>
        </div>
      </div>
    </div>
    
    <div class="filters-section">
      <div class="search-bar">
        <Search class="search-icon" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher par ID, client..."
          class="search-input"
        />
      </div>
      
      <select v-model="filterStatus" class="filter-select">
        <option value="">Tous les statuts</option>
        <option value="En cours">En cours</option>
        <option value="Livré">Livré</option>
        <option value="Annulé">Annulé</option>
      </select>
      
      <select v-model="sortBy" class="sort-select">
        <option value="date-desc">Plus récent</option>
        <option value="date-asc">Plus ancien</option>
        <option value="total-desc">Montant décroissant</option>
        <option value="total-asc">Montant croissant</option>
      </select>
    </div>
    
    <div class="orders-table">
      <div class="table-header">
        <div class="table-cell">Commande</div>
        <div class="table-cell">Client</div>
        <div class="table-cell">Date</div>
        <div class="table-cell">Articles</div>
        <div class="table-cell">Total</div>
        <div class="table-cell">Statut</div>
        <div class="table-cell">Actions</div>
      </div>
      
      <div 
        v-for="order in filteredOrders"
        :key="order.id"
        class="table-row stagger-item hover-lift"
      >
        <div class="table-cell order-cell">
          <div class="order-id">#{{ order.id }}</div>
        </div>
        
        <div class="table-cell">
          <div class="customer-info">
            <div class="customer-avatar">
              {{ getInitials(order.customer) }}
            </div>
            <span class="customer-name">{{ order.customer }}</span>
          </div>
        </div>
        
        <div class="table-cell">
          <span class="order-date">{{ formatDate(order.date) }}</span>
        </div>
        
        <div class="table-cell">
          <div class="items-info">
            <span class="items-count">{{ order.items.length }} article{{ order.items.length > 1 ? 's' : '' }}</span>
            <button @click="toggleOrderDetails(order.id)" class="details-btn">
              <Eye class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div class="table-cell">
          <span class="order-total">{{ formatPrice(order.total) }}</span>
        </div>
        
        <div class="table-cell">
          <select 
            :value="order.status"
            @change="updateOrderStatus(order.id, ($event.target as HTMLSelectElement).value)"
            class="status-select"
            :class="getStatusClass(order.status)"
          >
            <option value="En cours">En cours</option>
            <option value="Livré">Livré</option>
            <option value="Annulé">Annulé</option>
          </select>
        </div>
        
        <div class="table-cell actions-cell">
          <button @click="viewOrder(order)" class="action-btn view-btn">
            <Eye class="w-4 h-4" />
          </button>
          <button @click="printOrder(order)" class="action-btn print-btn">
            <Printer class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click="closeOrderDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Détails de la commande #{{ selectedOrder.id }}</h3>
          <button @click="closeOrderDetails" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div class="order-details">
          <div class="order-info">
            <div class="info-section">
              <h4 class="section-title">Informations générales</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Client:</span>
                  <span class="info-value">{{ selectedOrder.customer }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Date:</span>
                  <span class="info-value">{{ formatDate(selectedOrder.date) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Statut:</span>
                  <span class="info-value">
                    <span class="status-badge" :class="getStatusClass(selectedOrder.status)">
                      {{ selectedOrder.status }}
                    </span>
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">Total:</span>
                  <span class="info-value font-semibold">{{ formatPrice(selectedOrder.total) }}</span>
                </div>
              </div>
            </div>
            
            <div class="info-section">
              <h4 class="section-title">Articles commandés</h4>
              <div class="order-items">
                <div 
                  v-for="item in selectedOrder.items"
                  :key="item.id"
                  class="order-item"
                >
                  <img :src="item.product.image" :alt="item.product.name" class="item-image" />
                  <div class="item-details">
                    <h5 class="item-name">{{ item.product.name }}</h5>
                    <p class="item-price">{{ formatPrice(item.product.price) }}</p>
                  </div>
                  <div class="item-quantity">
                    <span>Qté: {{ item.quantity }}</span>
                  </div>
                  <div class="item-total">
                    {{ formatPrice(item.product.price * item.quantity) }}
                  </div>
                </div>
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
import { Search, Eye, Printer, X } from 'lucide-vue-next'
import { useMainStore, type Order } from '../../stores/main'

const store = useMainStore()

const searchQuery = ref('')
const filterStatus = ref('')
const sortBy = ref('date-desc')
const selectedOrder = ref<Order | null>(null)
const expandedOrders = ref<Set<number>>(new Set())

const orders = computed(() => store.orders)

const pendingOrdersCount = computed(() => 
  orders.value.filter(order => order.status === 'En cours').length
)

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
  
  // Sort orders
  switch (sortBy.value) {
    case 'date-asc':
      filtered = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
    case 'total-desc':
      filtered = [...filtered].sort((a, b) => b.total - a.total)
      break
    case 'total-asc':
      filtered = [...filtered].sort((a, b) => a.total - b.total)
      break
    case 'date-desc':
    default:
      filtered = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      break
  }
  
  return filtered
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
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
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

const toggleOrderDetails = (orderId: number) => {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId)
  } else {
    expandedOrders.value.add(orderId)
  }
}

const updateOrderStatus = (orderId: number, newStatus: string) => {
  console.log('Update order status:', orderId, newStatus)
  // Implement status update logic
}

const viewOrder = (order: Order) => {
  selectedOrder.value = order
}

const closeOrderDetails = () => {
  selectedOrder.value = null
}

const printOrder = (order: Order) => {
  console.log('Print order:', order.id)
  // Implement print functionality
}
</script>

<style scoped>
.admin-orders {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
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

.header-stats {
  display: flex;
  gap: var(--space-6);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.filters-section {
  display: flex;
  gap: var(--space-4);
  background: white;
  padding: var(--space-4);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.search-bar {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray-400);
  width: 20px;
  height: 20px;
}

.search-input {
  width: 100%;
  padding: var(--space-2) var(--space-3) var(--space-2) 40px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.filter-select,
.sort-select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: white;
  min-width: 150px;
}

.orders-table {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-gray-100);
  transition: all var(--transition-normal);
}

.table-row:hover {
  background: var(--color-gray-50);
}

.table-cell {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.order-id {
  font-weight: 600;
  color: var(--color-primary);
}

.customer-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.customer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.customer-name {
  font-weight: 500;
}

.order-date {
  color: var(--color-gray-600);
}

.items-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.details-btn {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-normal);
}

.details-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-primary);
}

.order-total {
  font-weight: 600;
  color: var(--color-gray-900);
}

.status-select {
  padding: var(--space-1) var(--space-2);
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
  cursor: pointer;
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

.actions-cell {
  gap: var(--space-2);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.view-btn {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-secondary);
}

.view-btn:hover {
  background: var(--color-secondary);
  color: white;
}

.print-btn {
  background: rgba(107, 114, 128, 0.1);
  color: var(--color-gray-600);
}

.print-btn:hover {
  background: var(--color-gray-600);
  color: white;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--space-4);
}

.modal-content {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-2xl);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}

.modal-close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.order-details {
  padding: var(--space-6);
}

.info-section {
  margin-bottom: var(--space-8);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-4);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-md);
}

.info-label {
  font-weight: 500;
  color: var(--color-gray-700);
}

.info-value {
  color: var(--color-gray-900);
}

.status-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.order-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.item-price {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.item-quantity,
.item-total {
  font-weight: 600;
  color: var(--color-gray-900);
}

@media (max-width: 768px) {
  .filters-section {
    flex-direction: column;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2);
  }
  
  .table-cell:nth-child(n+3) {
    display: none;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .order-item {
    grid-template-columns: 60px 1fr;
    gap: var(--space-3);
  }
  
  .item-quantity,
  .item-total {
    grid-column: 1 / -1;
    justify-self: end;
    margin-top: var(--space-2);
  }
}
</style>