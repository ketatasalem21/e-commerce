<template>
  <div class="wishlist-page">
    <div class="container">
      <div class="page-header fade-in-up">
        <h1 class="page-title">Ma Liste de Souhaits</h1>
        <p class="page-description">
          Retrouvez tous vos produits favoris et ajoutez-les facilement à votre panier.
        </p>
      </div>
      
      <div class="wishlist-filters slide-in-right">
        <div class="search-bar">
          <Search class="search-icon" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher dans vos favoris..."
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
          <option value="date-desc">Plus récent</option>
          <option value="date-asc">Plus ancien</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>
      
      <div v-if="filteredWishlist.length > 0" class="wishlist-grid">
        <div 
          v-for="item in filteredWishlist"
          :key="item.id"
          class="wishlist-item stagger-item hover-lift"
        >
          <div class="item-image-container">
            <img 
              :src="item.product.image" 
              :alt="item.product.name"
              class="item-image"
            />
            <button 
              @click="removeFromWishlist(item.product.id)"
              class="remove-btn"
            >
              <X class="w-4 h-4" />
            </button>
            <div v-if="item.product.stock === 0" class="out-of-stock-overlay">
              <span>Rupture de stock</span>
            </div>
          </div>
          
          <div class="item-content">
            <div class="item-category">{{ item.product.category }}</div>
            <h3 class="item-name">{{ item.product.name }}</h3>
            <p class="item-description">{{ item.product.description.slice(0, 100) }}...</p>
            
            <div class="item-rating">
              <div class="stars">
                <Star 
                  v-for="i in 5" 
                  :key="i"
                  class="w-4 h-4"
                  :class="i <= item.product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                />
              </div>
              <span class="rating-text">({{ item.product.rating }})</span>
            </div>
            
            <div class="item-footer">
              <div class="item-price">
                <span class="price-current">{{ formatPrice(item.product.price) }}</span>
              </div>
              
              <div class="item-actions">
                <AnimatedButton 
                  variant="primary" 
                  size="sm"
                  @click="addToCart(item.product)"
                  :disabled="item.product.stock === 0"
                >
                  <ShoppingCart class="w-4 h-4" />
                  {{ item.product.stock === 0 ? 'Rupture' : 'Ajouter' }}
                </AnimatedButton>
                
                <AnimatedButton 
                  variant="secondary" 
                  size="sm"
                  @click="viewProduct(item.product.id)"
                >
                  <Eye class="w-4 h-4" />
                  Voir
                </AnimatedButton>
              </div>
            </div>
            
            <div class="item-date">
              Ajouté le {{ formatDate(item.dateAdded) }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="empty-state fade-in-scale">
        <Heart class="empty-icon" />
        <h3 class="empty-title">Votre liste de souhaits est vide</h3>
        <p class="empty-description">
          {{ searchQuery || filterCategory ? 'Aucun produit ne correspond à vos critères.' : 'Découvrez nos produits et ajoutez vos favoris à votre liste de souhaits.' }}
        </p>
        <AnimatedButton 
          variant="primary"
          @click="$router.push('/products')"
        >
          Découvrir nos produits
        </AnimatedButton>
      </div>
      
      <!-- Bulk Actions -->
      <div v-if="filteredWishlist.length > 0" class="bulk-actions">
        <AnimatedButton 
          variant="accent"
          @click="addAllToCart"
          :disabled="!hasAvailableItems"
        >
          <ShoppingCart class="w-5 h-5" />
          Tout ajouter au panier
        </AnimatedButton>
        
        <AnimatedButton 
          variant="secondary"
          @click="clearWishlist"
        >
          <Trash2 class="w-5 h-5" />
          Vider la liste
        </AnimatedButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X, Star, ShoppingCart, Eye, Heart, Trash2 } from 'lucide-vue-next'
import { useMainStore } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const router = useRouter()
const store = useMainStore()

const searchQuery = ref('')
const filterCategory = ref('')
const sortBy = ref('date-desc')

const wishlist = computed(() => store.wishlist)

const categories = computed(() => {
  const allCategories = wishlist.value.map(item => item.product.category)
  return Array.from(new Set(allCategories))
})

const filteredWishlist = computed(() => {
  let filtered = wishlist.value
  
  // Filter by category
  if (filterCategory.value) {
    filtered = filtered.filter(item => item.product.category === filterCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item => 
      item.product.name.toLowerCase().includes(query) ||
      item.product.description.toLowerCase().includes(query) ||
      item.product.category.toLowerCase().includes(query)
    )
  }
  
  // Sort items
  switch (sortBy.value) {
    case 'date-asc':
      filtered = [...filtered].sort((a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime())
      break
    case 'price-asc':
      filtered = [...filtered].sort((a, b) => a.product.price - b.product.price)
      break
    case 'price-desc':
      filtered = [...filtered].sort((a, b) => b.product.price - a.product.price)
      break
    case 'date-desc':
    default:
      filtered = [...filtered].sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      break
  }
  
  return filtered
})

const hasAvailableItems = computed(() => 
  filteredWishlist.value.some(item => item.product.stock > 0)
)

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

const removeFromWishlist = (productId: number) => {
  store.removeFromWishlist(productId)
}

const addToCart = (product: any) => {
  if (product.stock > 0) {
    store.addToCart(product)
    // Optionally remove from wishlist after adding to cart
    // store.removeFromWishlist(product.id)
  }
}

const viewProduct = (productId: number) => {
  router.push(`/product/${productId}`)
}

const addAllToCart = () => {
  filteredWishlist.value.forEach(item => {
    if (item.product.stock > 0) {
      store.addToCart(item.product)
    }
  })
  
  // Navigate to cart
  router.push('/cart')
}

const clearWishlist = () => {
  if (confirm('Êtes-vous sûr de vouloir vider votre liste de souhaits ?')) {
    filteredWishlist.value.forEach(item => {
      store.removeFromWishlist(item.product.id)
    })
  }
}
</script>

<style scoped>
.wishlist-page {
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

.wishlist-filters {
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

.filter-select,
.sort-select {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  background: white;
  min-width: 150px;
}

.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-8);
  margin-bottom: var(--space-12);
}

.wishlist-item {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.item-image-container {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.wishlist-item:hover .item-image {
  transform: scale(1.05);
}

.remove-btn {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
  color: var(--color-gray-600);
}

.remove-btn:hover {
  background: var(--color-error);
  color: white;
  transform: scale(1.1);
}

.out-of-stock-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.item-content {
  padding: var(--space-6);
}

.item-category {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin-bottom: var(--space-2);
}

.item-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-3);
  color: var(--color-gray-900);
}

.item-description {
  color: var(--color-gray-600);
  margin-bottom: var(--space-4);
  line-height: var(--line-height-relaxed);
}

.item-rating {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.price-current {
  font-size: var(--font-size-xl);
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.item-actions {
  display: flex;
  gap: var(--space-2);
}

.item-date {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  text-align: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
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

.bulk-actions {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  padding: var(--space-8);
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
}

@media (max-width: 768px) {
  .wishlist-filters {
    flex-direction: column;
  }
  
  .wishlist-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-6);
  }
  
  .item-footer {
    flex-direction: column;
    gap: var(--space-3);
    align-items: stretch;
  }
  
  .item-actions {
    justify-content: center;
  }
  
  .bulk-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .wishlist-grid {
    grid-template-columns: 1fr;
  }
}
</style>
