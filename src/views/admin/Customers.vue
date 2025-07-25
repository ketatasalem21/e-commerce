<template>
  <div class="admin-customers">
    <div class="page-header">
      <h2 class="page-title">Gestion des Clients</h2>
      <div class="header-stats">
        <div class="stat-item">
          <span class="stat-value">{{ customers.length }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ activeCustomersCount }}</span>
          <span class="stat-label">Actifs</span>
        </div>
      </div>
    </div>
    
    <div class="filters-section">
      <div class="search-bar">
        <Search class="search-icon" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un client..."
          class="search-input"
        />
      </div>
      
      <select v-model="filterStatus" class="filter-select">
        <option value="">Tous les statuts</option>
        <option value="active">Actifs</option>
        <option value="inactive">Inactifs</option>
        <option value="blocked">Bloqués</option>
      </select>
      
      <select v-model="sortBy" class="sort-select">
        <option value="name">Nom</option>
        <option value="email">Email</option>
        <option value="orders">Commandes</option>
        <option value="spent">Dépenses</option>
        <option value="joined">Date d'inscription</option>
      </select>
    </div>
    
    <div class="customers-table">
      <div class="table-header">
        <div class="table-cell">Client</div>
        <div class="table-cell">Contact</div>
        <div class="table-cell">Inscription</div>
        <div class="table-cell">Commandes</div>
        <div class="table-cell">Total dépensé</div>
        <div class="table-cell">Statut</div>
        <div class="table-cell">Actions</div>
      </div>
      
      <div 
        v-for="customer in filteredCustomers"
        :key="customer.id"
        class="table-row stagger-item hover-lift"
      >
        <div class="table-cell customer-cell">
          <div class="customer-avatar">
            <img :src="customer.avatar" :alt="customer.firstName" />
          </div>
          <div class="customer-details">
            <h3 class="customer-name">{{ customer.firstName }} {{ customer.lastName }}</h3>
            <p class="customer-id">ID: #{{ customer.id }}</p>
          </div>
        </div>
        
        <div class="table-cell contact-cell">
          <div class="contact-info">
            <span class="customer-email">{{ customer.email }}</span>
            <span class="customer-phone">{{ customer.phone }}</span>
          </div>
        </div>
        
        <div class="table-cell">
          <span class="join-date">{{ formatDate(customer.dateJoined) }}</span>
          <span class="last-login">Dernière connexion: {{ formatDate(customer.lastLogin) }}</span>
        </div>
        
        <div class="table-cell">
          <div class="orders-info">
            <span class="orders-count">{{ customer.totalOrders }} commandes</span>
          </div>
        </div>
        
        <div class="table-cell">
          <span class="total-spent">{{ formatPrice(customer.totalSpent) }}</span>
        </div>
        
        <div class="table-cell">
          <select 
            :value="customer.status"
            @change="updateCustomerStatus(customer.id, ($event.target as HTMLSelectElement).value)"
            class="status-select"
            :class="getStatusClass(customer.status)"
          >
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="blocked">Bloqué</option>
          </select>
        </div>
        
        <div class="table-cell actions-cell">
          <button @click="viewCustomer(customer)" class="action-btn view-btn">
            <Eye class="w-4 h-4" />
          </button>
          <button @click="editCustomer(customer)" class="action-btn edit-btn">
            <Edit class="w-4 h-4" />
          </button>
          <button @click="sendMessage(customer)" class="action-btn message-btn">
            <MessageCircle class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Customer Details Modal -->
    <div v-if="selectedCustomer" class="modal-overlay" @click="closeCustomerDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Détails du client</h3>
          <button @click="closeCustomerDetails" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div class="customer-details-content">
          <div class="customer-profile">
            <div class="profile-avatar">
              <img :src="selectedCustomer.avatar" :alt="selectedCustomer.firstName" />
            </div>
            <div class="profile-info">
              <h4 class="profile-name">{{ selectedCustomer.firstName }} {{ selectedCustomer.lastName }}</h4>
              <p class="profile-email">{{ selectedCustomer.email }}</p>
              <span class="profile-status" :class="getStatusClass(selectedCustomer.status)">
                {{ selectedCustomer.status }}
              </span>
            </div>
          </div>
          
          <div class="customer-stats">
            <div class="stat-card">
              <div class="stat-icon">
                <ShoppingBag class="w-6 h-6" />
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ selectedCustomer.totalOrders }}</span>
                <span class="stat-label">Commandes</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <DollarSign class="w-6 h-6" />
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ formatPrice(selectedCustomer.totalSpent) }}</span>
                <span class="stat-label">Total dépensé</span>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">
                <Calendar class="w-6 h-6" />
              </div>
              <div class="stat-info">
                <span class="stat-number">{{ formatDate(selectedCustomer.dateJoined) }}</span>
                <span class="stat-label">Membre depuis</span>
              </div>
            </div>
          </div>
          
          <div class="customer-actions">
            <AnimatedButton variant="primary" @click="sendMessage(selectedCustomer)">
              <MessageCircle class="w-4 h-4" />
              Envoyer un message
            </AnimatedButton>
            <AnimatedButton variant="secondary" @click="viewOrders(selectedCustomer)">
              <ShoppingBag class="w-4 h-4" />
              Voir les commandes
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Eye, Edit, MessageCircle, X, ShoppingBag, DollarSign, Calendar } from 'lucide-vue-next'
import { useMainStore, type Customer } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const store = useMainStore()

const searchQuery = ref('')
const filterStatus = ref('')
const sortBy = ref('name')
const selectedCustomer = ref<Customer | null>(null)

const customers = computed(() => store.customers)

const activeCustomersCount = computed(() => 
  customers.value.filter(customer => customer.status === 'active').length
)

const filteredCustomers = computed(() => {
  let filtered = customers.value
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(customer => 
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    )
  }
  
  // Filter by status
  if (filterStatus.value) {
    filtered = filtered.filter(customer => customer.status === filterStatus.value)
  }
  
  // Sort customers
  switch (sortBy.value) {
    case 'email':
      filtered = [...filtered].sort((a, b) => a.email.localeCompare(b.email))
      break
    case 'orders':
      filtered = [...filtered].sort((a, b) => b.totalOrders - a.totalOrders)
      break
    case 'spent':
      filtered = [...filtered].sort((a, b) => b.totalSpent - a.totalSpent)
      break
    case 'joined':
      filtered = [...filtered].sort((a, b) => new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime())
      break
    case 'name':
    default:
      filtered = [...filtered].sort((a, b) => 
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      )
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

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'status-success'
    case 'inactive':
      return 'status-warning'
    case 'blocked':
      return 'status-error'
    default:
      return 'status-info'
  }
}

const updateCustomerStatus = (customerId: number, newStatus: string) => {
  console.log('Update customer status:', customerId, newStatus)
  // Implement status update logic
}

const viewCustomer = (customer: Customer) => {
  selectedCustomer.value = customer
}

const closeCustomerDetails = () => {
  selectedCustomer.value = null
}

const editCustomer = (customer: Customer) => {
  console.log('Edit customer:', customer.id)
  // Implement edit customer logic
}

const sendMessage = (customer: Customer) => {
  console.log('Send message to customer:', customer.id)
  // Implement messaging logic
}

const viewOrders = (customer: Customer) => {
  console.log('View orders for customer:', customer.id)
  // Navigate to orders filtered by customer
}
</script>

<style scoped>
.admin-customers {
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

.customers-table {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr;
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
  grid-template-columns: 2fr 1.5fr 1.5fr 1fr 1fr 1fr 1fr;
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

.customer-cell {
  gap: var(--space-3);
}

.customer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.customer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.customer-details {
  flex: 1;
  min-width: 0;
}

.customer-name {
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.customer-id {
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
}

.contact-cell {
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
}

.customer-email {
  color: var(--color-gray-900);
  font-weight: 500;
}

.customer-phone {
  color: var(--color-gray-600);
  font-size: var(--font-size-xs);
}

.join-date {
  display: block;
  color: var(--color-gray-900);
  font-weight: 500;
  margin-bottom: var(--space-1);
}

.last-login {
  color: var(--color-gray-600);
  font-size: var(--font-size-xs);
}

.orders-count {
  font-weight: 600;
  color: var(--color-gray-900);
}

.total-spent {
  font-weight: 600;
  color: var(--color-primary);
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

.edit-btn {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.edit-btn:hover {
  background: var(--color-warning);
  color: white;
}

.message-btn {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.message-btn:hover {
  background: var(--color-success);
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
  max-width: 600px;
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

.customer-details-content {
  padding: var(--space-6);
}

.customer-profile {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
  padding: var(--space-6);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.profile-email {
  color: var(--color-gray-600);
  margin-bottom: var(--space-2);
}

.profile-status {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.customer-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: white;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-number {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-gray-900);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.customer-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
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
  
  .customer-stats {
    grid-template-columns: 1fr;
  }
  
  .customer-actions {
    flex-direction: column;
  }
}
</style>