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
          <div class="form-layout">
            <!-- Left Column -->
            <div class="form-main">
              <div class="form-section">
                <h4 class="section-title">Informations générales</h4>
                
                <div class="form-group">
                  <label for="name" class="form-label">Nom du produit *</label>
                  <input 
                    id="name"
                    v-model="productForm.name"
                    type="text"
                    class="form-input"
                    placeholder="Nom du produit"
                    required
                  />
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
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="sku" class="form-label">SKU *</label>
                    <input 
                      id="sku"
                      v-model="productForm.sku"
                      type="text"
                      class="form-input"
                      placeholder="SKU-001"
                      required
                    />
                  </div>
                </div>
                
                <!-- Rich Text Editor Placeholder -->
                <div class="form-group">
                  <label class="form-label">Description *</label>
                  <div class="editor-toolbar">
                    <div class="toolbar-group">
                      <select class="toolbar-select">
                        <option>Heading</option>
                        <option>Paragraph</option>
                      </select>
                      <select class="toolbar-select">
                        <option>Sans Serif</option>
                        <option>Serif</option>
                      </select>
                    </div>
                    <div class="toolbar-group">
                      <button type="button" class="toolbar-btn"><strong>B</strong></button>
                      <button type="button" class="toolbar-btn"><em>I</em></button>
                      <button type="button" class="toolbar-btn"><u>U</u></button>
                    </div>
                    <div class="toolbar-group">
                      <button type="button" class="toolbar-btn">🔗</button>
                      <button type="button" class="toolbar-btn">📷</button>
                      <button type="button" class="toolbar-btn">📊</button>
                    </div>
                  </div>
                  <textarea 
                    v-model="productForm.description"
                    class="form-textarea editor-content"
                    rows="6"
                    placeholder="Description détaillée du produit..."
                    required
                  ></textarea>
                </div>
                
                <!-- Image Upload -->
                <div class="form-group">
                  <label class="form-label">Image de couverture</label>
                  <div class="image-upload-area">
                    <div class="upload-placeholder">
                      <Upload class="w-8 h-8 text-gray-400" />
                      <p class="upload-text">Drop or select a cover image</p>
                      <input type="file" class="upload-input" accept="image/*" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Right Sidebar -->
            <div class="form-sidebar">
              <!-- Publish Section -->
              <div class="sidebar-section">
                <h4 class="sidebar-title">Publier</h4>
                
                <div class="status-item">
                  <span class="status-label">Status:</span>
                  <div class="status-value">
                    <span class="status-indicator draft"></span>
                    <span>Draft</span>
                    <Edit class="w-4 h-4 text-primary cursor-pointer" />
                  </div>
                </div>
                
                <div class="sidebar-actions">
                  <AnimatedButton variant="secondary" size="sm" class="discard-btn">
                    <Trash2 class="w-4 h-4" />
                    Discard
                  </AnimatedButton>
                  <AnimatedButton variant="primary" size="sm" class="publish-btn">
                    <Check class="w-4 h-4" />
                    Publish
                  </AnimatedButton>
                </div>
              </div>
              
              <!-- Tags Section -->
              <div class="sidebar-section">
                <h4 class="sidebar-title">Tags</h4>
                <div class="tags-container">
                  <div class="tag-item">
                    <span>Nike</span>
                    <X class="w-3 h-3 cursor-pointer" />
                  </div>
                  <div class="tag-item">
                    <span>Sneaker</span>
                    <X class="w-3 h-3 cursor-pointer" />
                  </div>
                </div>
                <input 
                  type="text" 
                  placeholder="Add tag..."
                  class="tag-input"
                />
              </div>
              
              <!-- Category Section -->
              <div class="sidebar-section">
                <h4 class="sidebar-title">Category</h4>
                <select 
                  v-model="productForm.category"
                  class="form-select"
                  required
                >
                  <option value="">Select a category</option>
                  <option v-for="category in categories" :key="category" :value="category">
                    {{ category }}
                  </option>
                </select>
              </div>
              
              <!-- Colors Section -->
              <div class="sidebar-section">
                <h4 class="sidebar-title">Colors</h4>
                <div class="color-picker">
                  <div 
                    v-for="color in availableColors"
                    :key="color.id"
                    @click="toggleColor(color)"
                    :class="['color-swatch', { 'selected': selectedColors.includes(color.id) }]"
                    :style="{ backgroundColor: color.value }"
                    :title="color.name"
                  >
                    <Check v-if="selectedColors.includes(color.id)" class="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              
              <!-- Stock Section -->
              <div class="sidebar-section">
                <h4 class="sidebar-title">Stock</h4>
                <select class="form-select">
                  <option>Select stock</option>
                  <option>In stock</option>
                  <option>Out of stock</option>
                  <option>Low stock</option>
                </select>
                
                <div class="stock-toggle">
                  <span>In stock</span>
                  <label class="toggle-switch">
                    <input v-model="productForm.inStock" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
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
import { Plus, Search, Edit, Trash2, Star, X, Upload, Check } from 'lucide-vue-next'
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
  sku: '',
  category: '',
  description: '',
  price: 0,
  stock: 0,
  image: '',
  featured: false,
  rating: 4.5,
  inStock: true
})

const selectedColors = ref<number[]>([])

const availableColors = [
  { id: 1, name: 'Black', value: '#000000' },
  { id: 2, name: 'Orange', value: '#ff6b35' },
  { id: 3, name: 'Blue', value: '#007bff' },
  { id: 4, name: 'Gray', value: '#6c757d' },
  { id: 5, name: 'Red', value: '#dc3545' },
  { id: 6, name: 'Green', value: '#28a745' }
]

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

const toggleColor = (color: any) => {
  const index = selectedColors.value.indexOf(color.id)
  if (index > -1) {
    selectedColors.value.splice(index, 1)
  } else {
    selectedColors.value.push(color.id)
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
    sku: '',
    category: '',
    description: '',
    price: 0,
    stock: 0,
    image: '',
    featured: false,
    rating: 4.5,
    inStock: true
  }
  selectedColors.value = []
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
  max-height: 80vh;
  overflow-y: auto;
}

.form-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-8);
}

.form-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-section {
  background: var(--color-gray-50);
  padding: var(--space-6);
  border-radius: var(--border-radius-lg);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--color-gray-900);
}

.editor-toolbar {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-3);
  background: white;
  border: 1px solid var(--color-gray-300);
  border-bottom: none;
  border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
}

.toolbar-group {
  display: flex;
  gap: var(--space-2);
}

.toolbar-select {
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  background: white;
}

.toolbar-btn {
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-gray-300);
  background: white;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.toolbar-btn:hover {
  background: var(--color-gray-50);
}

.editor-content {
  border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
  border-top: none;
}

.image-upload-area {
  border: 2px dashed var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  padding: var(--space-8);
  text-align: center;
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
}

.image-upload-area:hover {
  border-color: var(--color-primary);
  background: rgba(139, 92, 246, 0.05);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.upload-text {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.form-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.sidebar-section {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-gray-200);
}

.sidebar-title {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--color-gray-900);
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.status-label {
  font-weight: 500;
  color: var(--color-gray-700);
}

.status-value {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-gray-600);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.draft {
  background: var(--color-warning);
}

.sidebar-actions {
  display: flex;
  gap: var(--space-3);
}

.discard-btn {
  flex: 1;
  background: white;
  border: 1px solid var(--color-gray-300);
  color: var(--color-error);
}

.publish-btn {
  flex: 1;
  background: var(--color-success);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.tag-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: var(--color-gray-100);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
}

.tag-input {
  width: 100%;
  padding: var(--space-2);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
}

.form-select {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: white;
}

.color-picker {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.color-swatch.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
}

.stock-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-4);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-gray-300);
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--color-success);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
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
  .form-layout {
    grid-template-columns: 1fr;
  }
  
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
  
  .color-picker {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>