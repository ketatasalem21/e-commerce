<template>
  <div class="inventory-management">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Inventory Management</h1>
        <p class="page-subtitle">Track and manage your product inventory</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline">
          <Download class="w-4 h-4" />
          Export
        </button>
        <button class="btn btn-primary" @click="showAddModal = true">
          <Plus class="w-4 h-4" />
          Add Stock
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <Package class="w-5 h-5" />
        </div>
        <div class="stat-content">
          <h3>1,247</h3>
          <p>Total Products</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon low">
          <AlertTriangle class="w-5 h-5" />
        </div>
        <div class="stat-content">
          <h3>23</h3>
          <p>Low Stock</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon out">
          <XCircle class="w-5 h-5" />
        </div>
        <div class="stat-content">
          <h3>8</h3>
          <p>Out of Stock</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon value">
          <DollarSign class="w-5 h-5" />
        </div>
        <div class="stat-content">
          <h3>$124,580</h3>
          <p>Total Value</p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-box">
        <Search class="w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search products..." 
          v-model="searchQuery"
        >
      </div>
      <div class="filter-controls">
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
        <select v-model="categoryFilter" class="filter-select">
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="home">Home & Garden</option>
        </select>
        <select v-model="sortBy" class="filter-select">
          <option value="name">Sort by Name</option>
          <option value="stock">Sort by Stock</option>
          <option value="value">Sort by Value</option>
          <option value="updated">Last Updated</option>
        </select>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="inventory-table-container">
      <table class="inventory-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
            </th>
            <th>Product</th>
            <th>SKU</th>
            <th>Category</th>
            <th>Current Stock</th>
            <th>Reserved</th>
            <th>Available</th>
            <th>Unit Price</th>
            <th>Total Value</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredInventory" :key="item.id" class="inventory-row">
            <td>
              <input type="checkbox" v-model="selectedItems" :value="item.id">
            </td>
            <td class="product-cell">
              <div class="product-info">
                <img :src="item.image" :alt="item.name" class="product-image">
                <div class="product-details">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.variant }}</p>
                </div>
              </div>
            </td>
            <td class="sku-cell">{{ item.sku }}</td>
            <td class="category-cell">
              <span class="category-badge">{{ item.category }}</span>
            </td>
            <td class="stock-cell">
              <span class="stock-number">{{ item.currentStock }}</span>
            </td>
            <td class="reserved-cell">{{ item.reserved }}</td>
            <td class="available-cell">
              <span class="available-number">{{ item.available }}</span>
            </td>
            <td class="price-cell">${{ item.unitPrice }}</td>
            <td class="value-cell">${{ (item.currentStock * item.unitPrice).toLocaleString() }}</td>
            <td class="status-cell">
              <span :class="['status-badge', item.status]">
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td class="date-cell">{{ formatDate(item.lastUpdated) }}</td>
            <td class="actions-cell">
              <div class="action-buttons">
                <button class="action-btn edit" @click="editItem(item)" title="Edit">
                  <Edit class="w-4 h-4" />
                </button>
                <button class="action-btn restock" @click="restockItem(item)" title="Restock">
                  <Plus class="w-4 h-4" />
                </button>
                <button class="action-btn history" @click="viewHistory(item)" title="History">
                  <Clock class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }} entries
      </div>
      <div class="pagination-controls">
        <button class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
          Previous
        </button>
        <span class="pagination-numbers">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            :class="['pagination-number', { active: page === currentPage }]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </span>
        <button class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          Next
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingItem ? 'Update Stock' : 'Add Stock' }}</h3>
          <button class="modal-close" @click="closeModal">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveItem">
            <div class="form-group">
              <label>Product</label>
              <select v-model="formData.productId" required>
                <option value="">Select Product</option>
                <option value="1">Nike Air Max</option>
                <option value="2">iPhone 15 Pro</option>
                <option value="3">MacBook Pro</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Quantity</label>
                <input type="number" v-model="formData.quantity" required min="1">
              </div>
              <div class="form-group">
                <label>Unit Cost</label>
                <input type="number" v-model="formData.unitCost" step="0.01" required>
              </div>
            </div>
            <div class="form-group">
              <label>Supplier</label>
              <input type="text" v-model="formData.supplier" required>
            </div>
            <div class="form-group">
              <label>Notes</label>
              <textarea v-model="formData.notes" rows="3"></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary">
                {{ editingItem ? 'Update' : 'Add' }} Stock
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  Download, 
  Plus, 
  Package, 
  AlertTriangle, 
  XCircle, 
  DollarSign, 
  Search, 
  Edit, 
  Clock, 
  X 
} from 'lucide-vue-next'

export default {
  name: 'AdminInventory',
  components: {
    Download,
    Plus,
    Package,
    AlertTriangle,
    XCircle,
    DollarSign,
    Search,
    Edit,
    Clock,
    X
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      categoryFilter: '',
      sortBy: 'name',
      currentPage: 1,
      itemsPerPage: 10,
      selectAll: false,
      selectedItems: [],
      showAddModal: false,
      editingItem: null,
      formData: {
        productId: '',
        quantity: '',
        unitCost: '',
        supplier: '',
        notes: ''
      },
      inventory: [
        {
          id: 1,
          name: 'Nike Air Max 270',
          variant: 'Black/White - Size 42',
          sku: 'NAM270-BW-42',
          category: 'Footwear',
          currentStock: 45,
          reserved: 5,
          available: 40,
          unitPrice: 120,
          status: 'in-stock',
          lastUpdated: '2024-01-15',
          image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
          id: 2,
          name: 'iPhone 15 Pro',
          variant: 'Natural Titanium - 256GB',
          sku: 'IP15P-NT-256',
          category: 'Electronics',
          currentStock: 8,
          reserved: 3,
          available: 5,
          unitPrice: 999,
          status: 'low-stock',
          lastUpdated: '2024-01-14',
          image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        {
          id: 3,
          name: 'MacBook Pro 16"',
          variant: 'Space Gray - M3 Pro',
          sku: 'MBP16-SG-M3P',
          category: 'Electronics',
          currentStock: 0,
          reserved: 0,
          available: 0,
          unitPrice: 2499,
          status: 'out-of-stock',
          lastUpdated: '2024-01-10',
          image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=100'
        }
      ]
    }
  },
  computed: {
    filteredInventory() {
      let filtered = this.inventory

      if (this.searchQuery) {
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          item.sku.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      if (this.statusFilter) {
        filtered = filtered.filter(item => item.status === this.statusFilter)
      }

      if (this.categoryFilter) {
        filtered = filtered.filter(item => 
          item.category.toLowerCase() === this.categoryFilter.toLowerCase()
        )
      }

      return filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'stock':
            return b.currentStock - a.currentStock
          case 'value':
            return (b.currentStock * b.unitPrice) - (a.currentStock * a.unitPrice)
          case 'updated':
            return new Date(b.lastUpdated) - new Date(a.lastUpdated)
          default:
            return a.name.localeCompare(b.name)
        }
      })
    },
    totalItems() {
      return this.filteredInventory.length
    },
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage)
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }
  },
  methods: {
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedItems = this.filteredInventory.map(item => item.id)
      } else {
        this.selectedItems = []
      }
    },
    getStatusText(status) {
      const statusMap = {
        'in-stock': 'In Stock',
        'low-stock': 'Low Stock',
        'out-of-stock': 'Out of Stock'
      }
      return statusMap[status] || status
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    editItem(item) {
      this.editingItem = item
      this.formData = {
        productId: item.id,
        quantity: '',
        unitCost: item.unitPrice,
        supplier: '',
        notes: ''
      }
      this.showAddModal = true
    },
    restockItem(item) {
      this.editItem(item)
    },
    viewHistory(item) {
      console.log('View history for:', item.name)
    },
    closeModal() {
      this.showAddModal = false
      this.editingItem = null
      this.formData = {
        productId: '',
        quantity: '',
        unitCost: '',
        supplier: '',
        notes: ''
      }
    },
    saveItem() {
      console.log('Saving item:', this.formData)
      this.closeModal()
    }
  }
}
</script>

<style scoped>
.inventory-management {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.header-content p {
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-outline {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.stat-icon.total {
  background: #dbeafe;
  color: #3b82f6;
}

.stat-icon.low {
  background: #fef3c7;
  color: #f59e0b;
}

.stat-icon.out {
  background: #fee2e2;
  color: #ef4444;
}

.stat-icon.value {
  background: #d1fae5;
  color: #10b981;
}

.stat-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
}

.stat-content p {
  color: #64748b;
  margin: 0;
  font-size: 0.875rem;
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.filter-controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  min-width: 150px;
}

.inventory-table-container {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.875rem;
}

.inventory-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
}

.inventory-row:hover {
  background: #f9fafb;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.product-image {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  object-fit: cover;
}

.product-details h4 {
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.product-details p {
  color: #6b7280;
  margin: 0;
  font-size: 0.75rem;
}

.category-badge {
  background: #f3f4f6;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.stock-number, .available-number {
  font-weight: 600;
  color: #1f2937;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-badge.in-stock {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.low-stock {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.out-of-stock {
  background: #fee2e2;
  color: #991b1b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn.edit {
  background: #dbeafe;
  color: #3b82f6;
}

.action-btn.edit:hover {
  background: #bfdbfe;
}

.action-btn.restock {
  background: #d1fae5;
  color: #10b981;
}

.action-btn.restock:hover {
  background: #a7f3d0;
}

.action-btn.history {
  background: #f3f4f6;
  color: #6b7280;
}

.action-btn.history:hover {
  background: #e5e7eb;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pagination-info {
  color: #64748b;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.pagination-btn:hover:not(:disabled) {
  background: #f8fafc;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 0.25rem;
}

.pagination-number {
  width: 2rem;
  height: 2rem;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-number:hover {
  background: #f8fafc;
}

.pagination-number.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .inventory-management {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .inventory-table-container {
    overflow-x: auto;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>