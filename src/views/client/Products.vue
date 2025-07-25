<template>
  <div class="products-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header fade-in-up">
        <h1 class="page-title">Notre Collection</h1>
        <p class="page-description">
          Découvrez notre sélection de produits d'exception, soigneusement choisis pour leur qualité et leur design.
        </p>
      </div>
      
      <!-- Filters & Search -->
      <div class="filters-section slide-in-right">
        <div class="search-bar">
          <Search class="search-icon" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher un produit..."
            class="search-input"
          />
        </div>
        
        <div class="filter-tabs">
          <button 
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="['filter-tab', { 'active': selectedCategory === category }]"
          >
            {{ category }}
          </button>
        </div>
        
        <div class="sort-dropdown">
          <select v-model="sortBy" class="sort-select">
            <option value="name">Nom</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Note</option>
          </select>
        </div>
      </div>
      
      <!-- Products Grid -->
      <div class="products-grid">
        <ProductCard 
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @quick-view="openQuickView"
          @update:product="updateProduct"
        />
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredProducts.length === 0" class="empty-state fade-in-scale">
        <Package class="empty-icon" />
        <h3 class="empty-title">Aucun produit trouvé</h3>
        <p class="empty-description">
          Essayez de modifier vos critères de recherche ou filtres.
        </p>
        <AnimatedButton @click="clearFilters" variant="primary">
          Effacer les filtres
        </AnimatedButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Package } from 'lucide-vue-next'
import { useMainStore, type Product } from '../../stores/main'
import ProductCard from '../../components/ui/ProductCard.vue'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const store = useMainStore()
const route = useRoute()

const searchQuery = ref('')
const selectedCategory = ref('Tous')
const sortBy = ref('name')

onMounted(() => {
  const categoryFromUrl = route.query.category
  if (categoryFromUrl && typeof categoryFromUrl === 'string') {
    const categoryExists = categories.value.find(c => c.toLowerCase() === categoryFromUrl.toLowerCase())
    if (categoryExists) {
      selectedCategory.value = categoryExists
    }
  }
})

const categories = computed(() => {
  const allCategories = store.products.map(p => p.category)
  return ['Tous', ...Array.from(new Set(allCategories))]
})

const filteredProducts = computed(() => {
  let products = store.products
  
  // Filter by category
  if (selectedCategory.value !== 'Tous') {
    products = products.filter(p => p.category === selectedCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }
  
  // Sort products
  switch (sortBy.value) {
    case 'price-asc':
      products = [...products].sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      products = [...products].sort((a, b) => b.price - a.price)
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

const openQuickView = (product: Product) => {
  console.log('Quick view:', product)
  // Implement quick view modal
}

const updateProduct = (updatedProduct: Product) => {
  const index = store.products.findIndex(p => p.id === updatedProduct.id)
  if (index !== -1) {
    store.products.splice(index, 1, updatedProduct)
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'Tous'
  sortBy.value = 'name'
}
</script>

<style scoped>
.products-page {
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
  line-height: var(--line-height-relaxed);
}

.filters-section {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-12);
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--space-6);
  align-items: center;
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

.filter-tabs {
  display: flex;
  gap: var(--space-2);
}

.filter-tab {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-gray-300);
  background: white;
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
  white-space: nowrap;
}

.filter-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-tab.active {
  background: var(--gradient-primary);
  border-color: transparent;
  color: white;
}

.sort-select {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
  background: white;
  cursor: pointer;
  transition: border-color var(--transition-fast);
}

.sort-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-8);
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
  .filters-section {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .filter-tabs {
    overflow-x: auto;
    padding-bottom: var(--space-2);
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-6);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
