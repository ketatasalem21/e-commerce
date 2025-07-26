<template>
  <div class="admin-invoices">
    <div class="page-header">
      <h2 class="page-title">Gestion des Factures</h2>
      <div class="header-actions">
        <AnimatedButton variant="secondary" @click="exportInvoices">
          <Download class="w-5 h-5" />
          Exporter
        </AnimatedButton>
        <AnimatedButton variant="primary" @click="showCreateModal = true">
          <Plus class="w-5 h-5" />
          Nouvelle facture
        </AnimatedButton>
      </div>
    </div>
    
    <div class="filters-section">
      <div class="search-bar">
        <Search class="search-icon" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une facture..."
          class="search-input"
        />
      </div>
      
      <select v-model="filterStatus" class="filter-select">
        <option value="">Tous les statuts</option>
        <option value="paid">Payée</option>
        <option value="pending">En attente</option>
        <option value="overdue">En retard</option>
        <option value="cancelled">Annulée</option>
      </select>
      
      <select v-model="sortBy" class="sort-select">
        <option value="date-desc">Plus récent</option>
        <option value="date-asc">Plus ancien</option>
        <option value="amount-desc">Montant décroissant</option>
        <option value="amount-asc">Montant croissant</option>
      </select>
    </div>
    
    <div class="invoices-table">
      <div class="table-header">
        <div class="table-cell">Facture</div>
        <div class="table-cell">Client</div>
        <div class="table-cell">Date</div>
        <div class="table-cell">Échéance</div>
        <div class="table-cell">Montant</div>
        <div class="table-cell">Statut</div>
        <div class="table-cell">Actions</div>
      </div>
      
      <div 
        v-for="invoice in filteredInvoices"
        :key="invoice.id"
        class="table-row stagger-item hover-lift"
      >
        <div class="table-cell invoice-cell">
          <div class="invoice-number">#{{ invoice.number }}</div>
        </div>
        
        <div class="table-cell">
          <div class="customer-info">
            <div class="customer-avatar">
              {{ getInitials(invoice.customerName) }}
            </div>
            <span class="customer-name">{{ invoice.customerName }}</span>
          </div>
        </div>
        
        <div class="table-cell">
          <span class="invoice-date">{{ formatDate(invoice.date) }}</span>
        </div>
        
        <div class="table-cell">
          <span class="due-date">{{ formatDate(invoice.dueDate) }}</span>
        </div>
        
        <div class="table-cell">
          <span class="invoice-amount">{{ formatPrice(invoice.amount) }}</span>
        </div>
        
        <div class="table-cell">
          <span class="status-badge" :class="getStatusClass(invoice.status)">
            {{ getStatusText(invoice.status) }}
          </span>
        </div>
        
        <div class="table-cell actions-cell">
          <button @click="viewInvoice(invoice)" class="action-btn view-btn">
            <Eye class="w-4 h-4" />
          </button>
          <button @click="downloadInvoice(invoice)" class="action-btn download-btn">
            <Download class="w-4 h-4" />
          </button>
          <button @click="printInvoice(invoice)" class="action-btn print-btn">
            <Printer class="w-4 h-4" />
          </button>
          <button @click="editInvoice(invoice)" class="action-btn edit-btn">
            <Edit class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Create Invoice Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Nouvelle Facture</h3>
          <button @click="closeCreateModal" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="createInvoice" class="invoice-form">
          <div class="form-group">
            <label for="customer" class="form-label">Client *</label>
            <select 
              id="customer"
              v-model="invoiceForm.customerId"
              class="form-input"
              required
            >
              <option value="">Sélectionner un client</option>
              <option 
                v-for="customer in customers"
                :key="customer.id"
                :value="customer.id"
              >
                {{ customer.firstName }} {{ customer.lastName }}
              </option>
            </select>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="date" class="form-label">Date *</label>
              <input 
                id="date"
                v-model="invoiceForm.date"
                type="date"
                class="form-input"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="dueDate" class="form-label">Date d'échéance *</label>
              <input 
                id="dueDate"
                v-model="invoiceForm.dueDate"
                type="date"
                class="form-input"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="amount" class="form-label">Montant *</label>
            <input 
              id="amount"
              v-model.number="invoiceForm.amount"
              type="number"
              step="0.01"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea 
              id="description"
              v-model="invoiceForm.description"
              class="form-textarea"
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <AnimatedButton type="button" variant="secondary" @click="closeCreateModal">
              Annuler
            </AnimatedButton>
            <AnimatedButton type="submit" variant="primary" :loading="creating">
              Créer la facture
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, Eye, Download, Printer, Edit, Plus, X } from 'lucide-vue-next'
import { useMainStore } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const store = useMainStore()

const searchQuery = ref('')
const filterStatus = ref('')
const sortBy = ref('date-desc')
const showCreateModal = ref(false)
const creating = ref(false)

const invoiceForm = ref({
  customerId: '',
  date: '',
  dueDate: '',
  amount: 0,
  description: ''
})

const invoices = ref([
  {
    id: 1,
    number: 'INV-2024-001',
    customerName: 'Jean Dupont',
    customerId: 1,
    date: '2024-01-15',
    dueDate: '2024-02-15',
    amount: 2499.00,
    status: 'paid'
  },
  {
    id: 2,
    number: 'INV-2024-002',
    customerName: 'Marie Martin',
    customerId: 2,
    date: '2024-01-16',
    dueDate: '2024-02-16',
    amount: 1299.00,
    status: 'pending'
  },
  {
    id: 3,
    number: 'INV-2024-003',
    customerName: 'Pierre Durand',
    customerId: 3,
    date: '2024-01-10',
    dueDate: '2024-02-10',
    amount: 899.00,
    status: 'overdue'
  }
])

const customers = computed(() => store.customers)

const filteredInvoices = computed(() => {
  let filtered = invoices.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(invoice => 
      invoice.number.toLowerCase().includes(query) ||
      invoice.customerName.toLowerCase().includes(query)
    )
  }
  
  if (filterStatus.value) {
    filtered = filtered.filter(invoice => invoice.status === filterStatus.value)
  }
  
  switch (sortBy.value) {
    case 'date-asc':
      filtered = [...filtered].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
    case 'amount-desc':
      filtered = [...filtered].sort((a, b) => b.amount - a.amount)
      break
    case 'amount-asc':
      filtered = [...filtered].sort((a, b) => a.amount - b.amount)
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
  switch (status) {
    case 'paid':
      return 'status-success'
    case 'pending':
      return 'status-warning'
    case 'overdue':
      return 'status-error'
    case 'cancelled':
      return 'status-gray'
    default:
      return 'status-info'
  }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'paid': 'Payée',
    'pending': 'En attente',
    'overdue': 'En retard',
    'cancelled': 'Annulée'
  }
  return statusMap[status] || status
}

const viewInvoice = (invoice: any) => {
  console.log('View invoice:', invoice.id)
  // Implement view invoice logic
}

const downloadInvoice = (invoice: any) => {
  console.log('Download invoice:', invoice.id)
  // Implement download logic
  const link = document.createElement('a')
  link.href = '#'
  link.download = `facture-${invoice.number}.pdf`
  link.click()
}

const printInvoice = (invoice: any) => {
  console.log('Print invoice:', invoice.id)
  // Implement print logic
  window.print()
}

const editInvoice = (invoice: any) => {
  console.log('Edit invoice:', invoice.id)
  // Implement edit logic
}

const exportInvoices = () => {
  console.log('Export invoices')
  // Implement export logic
}

const createInvoice = async () => {
  creating.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('Create invoice:', invoiceForm.value)
    closeCreateModal()
  } catch (error) {
    console.error('Error creating invoice:', error)
  } finally {
    creating.value = false
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  invoiceForm.value = {
    customerId: '',
    date: '',
    dueDate: '',
    amount: 0,
    description: ''
  }
}
</script>

<style scoped>
.admin-invoices {
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

.header-actions {
  display: flex;
  gap: var(--space-3);
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

.invoices-table {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr;
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
  grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 1fr 1.5fr;
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

.invoice-number {
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

.invoice-date,
.due-date {
  color: var(--color-gray-600);
}

.invoice-amount {
  font-weight: 600;
  color: var(--color-gray-900);
}

.status-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
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

.status-gray {
  background: rgba(107, 114, 128, 0.1);
  color: var(--color-gray-600);
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

.download-btn {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.download-btn:hover {
  background: var(--color-success);
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

.edit-btn {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.edit-btn:hover {
  background: var(--color-warning);
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

.invoice-form {
  padding: var(--space-6);
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--space-2);
  color: var(--color-gray-700);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: border-color var(--transition-fast);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-gray-200);
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
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>