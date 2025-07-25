<template>
  <div class="admin-products">
    <div class="page-header">
      <h2 class="page-title">Gestion des Produits</h2>
      <AnimatedButton variant="primary" @click="showAddModal = true">
        <Plus class="w-5 h-5" />
        Ajouter un produit
      </AnimatedButton>
    </div>
    
    <div class="filters-section">
      <div class="search-bar">
        <Search class="search-icon" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher un produit..."
          class="search-input"
        />
      </div>
      
      <select v-model="filterCategory" class="filter-select">
        <option value="">Toutes les catégories</option>
        <option v-for="category in categories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
      
      <select v-model="sortBy" class="sort-select">
        <option value="name">Nom</option>
        <option value="price">Prix</option>
        <option value="stock">Stock</option>
        <option value="rating">Note</option>
      </select>
    </div>
    
    <div class="products-table">
      <div class="table-header">
        <div class="table-cell">Produit</div>
        <div class="table-cell">Catégorie</div>
        <div class="table-cell">Prix</div>
        <div class="table-cell">Stock</div>
        <div class="table-cell">Note</div>
        <div class="table-cell">Actions</div>
      </div>
      
      <div 
        v-for="product in filteredProducts"
        :key="product.id"
        class="table-row stagger-item hover-lift"
      >
        <div class="table-cell product-cell">
          <img :src="product.image" :alt="product.name" class="product-thumbnail" />
          <div class="product-details">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-description">{{ product.description.slice(0, 50) }}...</p>
          </div>
        </div>
        
        <div class="table-cell">
          <span class="category-badge">{{ product.category }}</span>
        </div>
        
        <div class="table-cell">
          <span class="product-price">{{ formatPrice(product.price) }}</span>
        </div>
        
        <div class="table-cell">
          <span class="stock-badge" :class="getStockClass(product.stock)">
            {{ product.stock }}
          </span>
        </div>
        
        <div class="table-cell">
          <div class="rating">
            <Star class="w-4 h-4 text-yellow-400 fill-current" />
            <span>{{ product.rating }}</span>
          </div>
        </div>
        
        <div class="table-cell actions-cell">
          <button @click="editProduct(product)" class="action-btn edit-btn">
            <Edit class="w-4 h-4" />
          </button>
          <button @click="deleteProduct(product.id)" class="action-btn delete-btn">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Product Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            {{ showAddModal ? 'Ajouter un produit' : 'Modifier le produit' }}
          </h3>
          <button @click="closeModals" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveProduct" class="product-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="name" class="form-label">Nom du produit *</label>
              <input 
                id="name"
                v-model="productForm.name"
                type="text"
                class="form-input"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="category" class="form-label">Catégorie *</label>
              <select 
                id="category"
                v-model="productForm.category"
                class="form-input"
                required
              >
                <option value="">Sélectionner une catégorie</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label">Description *</label>
            <textarea 
              id="description"
              v-model="productForm.description"
              class="form-textarea"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="price" class="form-label">Prix (€) *</label>
              <input 
                id="price"
                v-model.number="productForm.price"
                type="number"
                step="0.01"
                class="form-input"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="stock" class="form-label">Stock *</label>
              <input 
                id="stock"
                v-model.number="productForm.stock"
                type="number"
                class="form-input"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="image" class="form-label">URL de l'image *</label>
            <input 
              id="image"
              v-model="productForm.image"
              type="url"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                v-model="productForm.featured"
                type="checkbox"
                class="checkbox"
              />
              <span class="checkbox-text">Produit vedette</span>
            </label>
          </div>
          
          <div class="form-actions">
            <AnimatedButton type="button" variant="secondary" @click="closeModals">
              Annuler
            </AnimatedButton>
            <AnimatedButton type="submit" variant="primary" :loading="saving">
              {{ showAddModal ? 'Ajouter' : 'Modifier' }}
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Search, Edit, Trash2, Star, X } from 'lucide-vue-next'
import { useMainStore, type Product } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const store = useMainStore()

const searchQuery = ref('')
const filterCategory = ref('')
const sortBy = ref('name')
const showAddModal = ref(false)
const showEditModal = ref(false)
const saving = ref(false)
const editingProduct = ref<Product | null>(null)

const productForm = ref({
  name: '',
  category: '',
  description: '',
  price: 0,
  stock: 0,
  image: '',
  featured: false,
  rating: 4.5
})

const categories = computed(() => {
  const allCategories = store.products.map(p => p.category)
  return Array.from(new Set(allCategories))
})

const filteredProducts = computed(() => {
  let products = store.products
  
  // Filter by category
  if (filterCategory.value) {
    products = products.filter(p => p.category === filterCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    )
  }
  
  // Sort products
  switch (sortBy.value) {
    case 'price':
      products = [...products].sort((a, b) => a.price - b.price)
      break
    case 'stock':
      products = [...products].sort((a, b) => b.stock - a.stock)
      break
    case 'rating':
      products = [...products].sort((a, b) => b.rating - a.rating)
      break
    case 'name':
    default:
      products = [...products].sort((a, b) => a.name.localeCompare(b.name))
      break
  }
  
  return products
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const getStockClass = (stock: number) => {
  if (stock > 10) return 'stock-high'
  if (stock > 0) return 'stock-medium'
  return 'stock-low'
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.value = { ...product }
  showEditModal.value = true
}

const deleteProduct = (productId: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    console.log('Delete product:', productId)
    // Implement product deletion
  }
}

const saveProduct = async () => {
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (showAddModal.value) {
      // Add new product
      console.log('Add product:', productForm.value)
    } else {
      // Update existing product
      console.log('Update product:', productForm.value)
    }
    
    closeModals()
  } catch (error) {
    console.error('Error saving product:', error)
  } finally {
    saving.value = false
  }
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    featured: false,
    rating: 4.5
  }
}
</script>

<style scoped>
.admin-products {
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

.products-table {
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
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
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr;
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

.product-cell {
  gap: var(--space-3);
}

.product-thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  flex-shrink: 0;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.product-description {
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-badge {
  padding: var(--space-1) var(--space-2);
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.product-price {
  font-weight: 600;
  color: var(--color-primary);
}

.stock-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.stock-high {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.stock-medium {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.stock-low {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.rating {
  display: flex;
  align-items: center;
  gap: var(--space-1);
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

.edit-btn {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-secondary);
}

.edit-btn:hover {
  background: var(--color-secondary);
  color: white;
}

.delete-btn {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.delete-btn:hover {
  background: var(--color-error);
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

.product-form {
  padding: var(--space-6);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-group {
  margin-bottom: var(--space-4);
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
}

.checkbox-text {
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
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
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
  
  .table-cell:not(.product-cell) {
    display: none;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: var(--space-4);
    max-height: calc(100vh - 2rem);
  }
}
</style>