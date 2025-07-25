<template>
  <div class="admin-categories">
    <div class="page-header">
      <h2 class="page-title">Gestion des Catégories</h2>
      <AnimatedButton variant="primary" @click="showAddModal = true">
        <Plus class="w-5 h-5" />
        Ajouter une catégorie
      </AnimatedButton>
    </div>
    
    <div class="filters-section">
      <div class="search-bar">
        <Search class="search-icon" />
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une catégorie..."
          class="search-input"
        />
      </div>
      
      <select v-model="filterStatus" class="filter-select">
        <option value="">Tous les statuts</option>
        <option value="active">Actives</option>
        <option value="inactive">Inactives</option>
      </select>
      
      <select v-model="sortBy" class="sort-select">
        <option value="name">Nom</option>
        <option value="products">Nombre de produits</option>
        <option value="created">Date de création</option>
      </select>
    </div>
    
    <div class="categories-grid">
      <div 
        v-for="category in filteredCategories"
        :key="category.id"
        class="category-card stagger-item hover-lift"
      >
        <div class="category-image">
          <img :src="category.image" :alt="category.name" />
          <div class="category-overlay">
            <button @click="editCategory(category)" class="overlay-btn">
              <Edit class="w-4 h-4" />
            </button>
            <button @click="deleteCategory(category.id)" class="overlay-btn delete">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div class="category-content">
          <div class="category-header">
            <h3 class="category-name">{{ category.name }}</h3>
            <div class="category-status">
              <span 
                class="status-badge" 
                :class="category.isActive ? 'status-active' : 'status-inactive'"
              >
                {{ category.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
          
          <p class="category-description">{{ category.description }}</p>
          
          <div class="category-stats">
            <div class="stat-item">
              <Package class="w-4 h-4" />
              <span>{{ category.productsCount }} produits</span>
            </div>
            <div class="stat-item">
              <Calendar class="w-4 h-4" />
              <span>{{ formatDate(category.createdAt) }}</span>
            </div>
          </div>
          
          <div class="category-actions">
            <AnimatedButton 
              variant="secondary" 
              size="sm"
              @click="viewProducts(category)"
            >
              <Eye class="w-4 h-4" />
              Voir produits
            </AnimatedButton>
            <AnimatedButton 
              variant="primary" 
              size="sm"
              @click="editCategory(category)"
            >
              <Edit class="w-4 h-4" />
              Modifier
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Add/Edit Category Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            {{ showAddModal ? 'Ajouter une catégorie' : 'Modifier la catégorie' }}
          </h3>
          <button @click="closeModals" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="saveCategory" class="category-form">
          <div class="form-group">
            <label for="name" class="form-label">Nom de la catégorie *</label>
            <input 
              id="name"
              v-model="categoryForm.name"
              type="text"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="slug" class="form-label">Slug *</label>
            <input 
              id="slug"
              v-model="categoryForm.slug"
              type="text"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="description" class="form-label">Description *</label>
            <textarea 
              id="description"
              v-model="categoryForm.description"
              class="form-textarea"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="image" class="form-label">URL de l'image *</label>
            <input 
              id="image"
              v-model="categoryForm.image"
              type="url"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="parentCategory" class="form-label">Catégorie parente</label>
            <select 
              id="parentCategory"
              v-model="categoryForm.parentId"
              class="form-input"
            >
              <option value="">Aucune (catégorie racine)</option>
              <option 
                v-for="category in availableParents"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                v-model="categoryForm.isActive"
                type="checkbox"
                class="checkbox"
              />
              <span class="checkbox-text">Catégorie active</span>
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
import { useRouter } from 'vue-router'
import { Plus, Search, Edit, Trash2, Eye, Package, Calendar, X } from 'lucide-vue-next'
import { useMainStore, type Category } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const router = useRouter()
const store = useMainStore()

const searchQuery = ref('')
const filterStatus = ref('')
const sortBy = ref('name')
const showAddModal = ref(false)
const showEditModal = ref(false)
const saving = ref(false)
const editingCategory = ref<Category | null>(null)

const categoryForm = ref({
  name: '',
  slug: '',
  description: '',
  image: '',
  parentId: null as number | null,
  isActive: true
})

const categories = computed(() => store.categories)

const availableParents = computed(() => {
  if (editingCategory.value) {
    return categories.value.filter(cat => cat.id !== editingCategory.value?.id)
  }
  return categories.value
})

const filteredCategories = computed(() => {
  let filtered = categories.value
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(category => 
      category.name.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query)
    )
  }
  
  // Filter by status
  if (filterStatus.value) {
    const isActive = filterStatus.value === 'active'
    filtered = filtered.filter(category => category.isActive === isActive)
  }
  
  // Sort categories
  switch (sortBy.value) {
    case 'products':
      filtered = [...filtered].sort((a, b) => b.productsCount - a.productsCount)
      break
    case 'created':
      filtered = [...filtered].sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
      break
    case 'name':
    default:
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name))
      break
  }
  
  return filtered
})

const formatDate = (date: string | undefined) => {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    parentId: category.parentId || null,
    isActive: category.isActive
  }
  showEditModal.value = true
}

const deleteCategory = (categoryId: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
    console.log('Delete category:', categoryId)
    // Implement category deletion
  }
}

const viewProducts = (category: Category) => {
  router.push(`/admin/products?category=${category.slug}`)
}

const saveCategory = async () => {
  saving.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (showAddModal.value) {
      console.log('Add category:', categoryForm.value)
    } else {
      console.log('Update category:', categoryForm.value)
    }
    
    closeModals()
  } catch (error) {
    console.error('Error saving category:', error)
  } finally {
    saving.value = false
  }
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: null,
    isActive: true
  }
}
</script>

<style scoped>
.admin-categories {
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-6);
}

.category-card {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.category-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.category-card:hover .category-image img {
  transform: scale(1.05);
}

.category-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.category-card:hover .category-overlay {
  opacity: 1;
}

.overlay-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: white;
  color: var(--color-gray-700);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.overlay-btn:hover {
  background: var(--color-primary);
  color: white;
}

.overlay-btn.delete:hover {
  background: var(--color-error);
}

.category-content {
  padding: var(--space-6);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.category-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
}

.status-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.status-active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-inactive {
  background: rgba(107, 114, 128, 0.1);
  color: var(--color-gray-600);
}

.category-description {
  color: var(--color-gray-600);
  margin-bottom: var(--space-4);
  line-height: var(--line-height-relaxed);
}

.category-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.category-actions {
  display: flex;
  gap: var(--space-3);
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
  max-width: 500px;
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

.category-form {
  padding: var(--space-6);
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
  
  .categories-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  .category-actions {
    flex-direction: column;
  }
  
  .modal-content {
    margin: var(--space-4);
    max-height: calc(100vh - 2rem);
  }
}
</style>