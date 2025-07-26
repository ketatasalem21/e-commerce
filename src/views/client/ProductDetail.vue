<template>
  <div class="product-detail" v-if="product">
    <div class="container">
      <div class="product-content">
        <!-- Product Images Gallery -->
        <div class="product-images fade-in-up">
          <div class="main-image">
            <img 
              :src="currentImage" 
              :alt="product.name"
              class="product-image"
            />
          </div>
          
          <!-- Thumbnail Gallery -->
          <div class="thumbnail-gallery" v-if="product.images.length > 1">
            <button 
              v-for="(image, index) in product.images"
              :key="index"
              @click="currentImage = image"
              :class="['thumbnail-btn', { 'active': currentImage === image }]"
            >
              <img :src="image" :alt="`${product.name} ${index + 1}`" class="thumbnail-image" />
            </button>
          </div>
        </div>
        
        <!-- Product Info -->
        <div class="product-info slide-in-right">
          <div class="product-breadcrumb">
            <RouterLink to="/products" class="breadcrumb-link">Produits</RouterLink>
            <ChevronRight class="w-4 h-4" />
            <span class="breadcrumb-current">{{ product.name }}</span>
          </div>
          
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="product-sku">
            <span class="sku-label">SKU:</span>
            <span class="sku-value">{{ product.sku }}</span>
          </div>
          
          <div class="product-rating">
            <div class="stars">
              <Star 
                v-for="i in 5" 
                :key="i"
                class="w-5 h-5 cursor-pointer"
                :class="getUserStarClass(i)"
                @click="rateProduct(i)"
              />
            </div>
            <span class="rating-text">
              ({{ userRating !== null ? userRating : product.rating }}/5)
              <span v-if="userRating !== null" class="user-rating-indicator">
                - Votre note
              </span>
            </span>
          </div>
          
          <div class="product-price">
            <span class="price-current">{{ formatPrice(product.price) }}</span>
          </div>
          
          <!-- Color Selection -->
          <div class="color-selection" v-if="product.colors.length > 1">
            <h3 class="selection-title">Couleur: <span class="selected-color-name">{{ selectedColor.name }}</span></h3>
            <div class="color-options">
              <button 
                v-for="color in product.colors"
                :key="color.id"
                @click="selectColor(color)"
                :class="['color-option', { 'active': selectedColor.id === color.id }]"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
              >
                <Check v-if="selectedColor.id === color.id" class="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          <p class="product-description">{{ product.description }}</p>
          
          <div class="product-meta">
            <div class="meta-item">
              <span class="meta-label">Catégorie:</span>
              <span class="meta-value">{{ product.category }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Stock:</span>
              <span class="meta-value" :class="stockClass">{{ stockText }}</span>
            </div>
          </div>
          
          <div class="quantity-selector">
            <label class="quantity-label">Quantité:</label>
            <div class="quantity-controls">
              <button 
                @click="decreaseQuantity"
                :disabled="quantity <= 1"
                class="quantity-btn"
              >
                <Minus class="w-4 h-4" />
              </button>
              <span class="quantity-value">{{ quantity }}</span>
              <button 
                @click="increaseQuantity"
                :disabled="quantity >= product.stock"
                class="quantity-btn"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div class="product-actions">
            <AnimatedButton 
              variant="primary" 
              size="lg"
              @click="addToCart"
              :disabled="product.stock === 0"
              class="add-to-cart-btn"
            >
              <ShoppingCart class="w-5 h-5" />
              {{ product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier' }}
            </AnimatedButton>
            
            <AnimatedButton 
              variant="secondary" 
              size="lg"
              @click="addToWishlist"
            >
              <Heart class="w-5 h-5" />
              Favoris
            </AnimatedButton>
          </div>
          
          <!-- Features -->
          <div class="product-features">
            <div class="feature-item">
              <Truck class="w-5 h-5 text-primary" />
              <span>Livraison gratuite</span>
            </div>
            <div class="feature-item">
              <Shield class="w-5 h-5 text-primary" />
              <span>Garantie 2 ans</span>
            </div>
            <div class="feature-item">
              <RotateCcw class="w-5 h-5 text-primary" />
              <span>Retour 30 jours</span>
            </div>
          </div>
          
          <!-- Product Tabs -->
          <div class="product-tabs">
            <div class="tab-buttons">
              <button 
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="['tab-btn', { 'active': activeTab === tab.id }]"
              >
                {{ tab.label }}
              </button>
            </div>
            
            <div class="tab-content">
              <div v-if="activeTab === 'description'" class="tab-panel">
                <h4>Description détaillée</h4>
                <p>{{ product.description }}</p>
                <div v-if="product.specifications" class="specifications">
                  <h5>Spécifications</h5>
                  <div class="spec-grid">
                    <div 
                      v-for="(value, key) in product.specifications"
                      :key="key"
                      class="spec-item"
                    >
                      <span class="spec-label">{{ key }}:</span>
                      <span class="spec-value">{{ value }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-if="activeTab === 'reviews'" class="tab-panel">
                <h4>Avis clients</h4>
                <div v-if="product.reviews.length > 0" class="reviews-list">
                  <div 
                    v-for="review in product.reviews"
                    :key="review.id"
                    class="review-item"
                  >
                    <div class="review-header">
                      <img :src="review.userAvatar" :alt="review.userName" class="review-avatar" />
                      <div class="review-info">
                        <h5 class="review-author">{{ review.userName }}</h5>
                        <div class="review-rating">
                          <Star 
                            v-for="i in 5" 
                            :key="i"
                            class="w-4 h-4"
                            :class="i <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'"
                          />
                        </div>
                      </div>
                      <span class="review-date">{{ formatDate(review.date) }}</span>
                    </div>
                    <h6 class="review-title">{{ review.title }}</h6>
                    <p class="review-comment">{{ review.comment }}</p>
                  </div>
                </div>
                <div v-else class="no-reviews">
                  <p>Aucun avis pour ce produit.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else class="loading-state">
    <div class="loading-spinner"></div>
    <p>Chargement du produit...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { 
  Star, 
  ChevronRight, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart,
  Truck,
  Shield,
  RotateCcw,
  Check
} from 'lucide-vue-next'
import { useMainStore, type ProductColor } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const route = useRoute()
const router = useRouter()
const store = useMainStore()

const quantity = ref(1)
const currentImage = ref('')
const selectedColor = ref<ProductColor | null>(null)
const activeTab = ref('description')

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'reviews', label: 'Avis' }
]

const userRating = computed(() => 
  store.getUserRating(product.value?.id || 0)
)

const product = computed(() => {
  const id = parseInt(route.params.id as string)
  return store.products.find(p => p.id === id)
})

const stockClass = computed(() => {
  if (!product.value) return ''
  return product.value.stock > 10 ? 'text-success' : 
         product.value.stock > 0 ? 'text-warning' : 'text-error'
})

const stockText = computed(() => {
  if (!product.value) return ''
  return product.value.stock > 0 ? `${product.value.stock} disponibles` : 'Rupture de stock'
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

const selectColor = (color: ProductColor) => {
  selectedColor.value = color
  currentImage.value = color.image
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  if (product.value && quantity.value < product.value.stock) {
    quantity.value++
  }
}

const addToCart = () => {
  if (product.value && product.value.stock > 0) {
    store.addToCart(product.value, quantity.value)
  }
}

const addToWishlist = () => {
  if (!store.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  
  if (product.value) {
    store.addToWishlist(product.value)
  }
}

const rateProduct = (rating: number) => {
  if (!store.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  
  if (product.value) {
    store.addUserRating(product.value.id, rating)
  }
}

const getUserStarClass = (starIndex: number) => {
  if (!product.value) return 'text-gray-300'
  
  const currentUserRating = userRating.value
  const productRating = product.value.rating
  
  if (currentUserRating !== null) {
    return starIndex <= currentUserRating 
      ? 'star-user-rating fill-current' 
      : 'text-gray-300 star-hover'
  } else {
    return starIndex <= productRating 
      ? 'star-average-rating fill-current' 
      : 'text-gray-300 star-hover'
  }
}

onMounted(() => {
  if (product.value) {
    currentImage.value = product.value.image
    if (product.value.colors.length > 0) {
      selectedColor.value = product.value.colors[0]
    }
  }
  window.scrollTo(0, 0)
})
</script>

<style scoped>
.product-detail {
  padding: var(--space-12) 0;
  min-height: 100vh;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: start;
}

.product-images {
  position: sticky;
  top: var(--space-8);
}

.main-image {
  background: white;
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-6);
}

.product-image {
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-image:hover {
  transform: scale(1.05);
}

.thumbnail-gallery {
  display: flex;
  gap: var(--space-3);
  overflow-x: auto;
  padding: var(--space-2);
}

.thumbnail-btn {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
  background: white;
}

.thumbnail-btn.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.thumbnail-btn:hover {
  border-color: var(--color-gray-400);
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  font-size: var(--font-size-sm);
}

.breadcrumb-link {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.breadcrumb-link:hover {
  color: var(--color-primary-dark);
}

.breadcrumb-current {
  color: var(--color-gray-500);
}

.product-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-3);
  color: var(--color-gray-900);
}

.product-sku {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  font-size: var(--font-size-sm);
}

.sku-label {
  color: var(--color-gray-600);
}

.sku-value {
  color: var(--color-gray-900);
  font-weight: 500;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.stars {
  display: flex;
  gap: 2px;
}

.rating-text {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.user-rating-indicator {
  color: rgb(254, 196, 0);
  font-weight: 500;
}

.star-user-rating {
  color: rgb(254, 196, 0);
  filter: drop-shadow(0 0 6px rgba(254, 196, 0, 0.8));
  animation: starGlow 2s ease-in-out infinite;
}

.star-average-rating {
  color: rgba(254, 196, 0, 0.7);
}

.star-hover:hover {
  color: rgba(254, 196, 0, 0.5);
}

@keyframes starGlow {
  0%, 100% {
    filter: drop-shadow(0 0 6px rgba(254, 196, 0, 0.8));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(254, 196, 0, 1));
  }
}

.stars .w-5:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.product-price {
  margin-bottom: var(--space-6);
}

.price-current {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.color-selection {
  margin-bottom: var(--space-6);
}

.selection-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--color-gray-900);
}

.selected-color-name {
  color: var(--color-primary);
}

.color-options {
  display: flex;
  gap: var(--space-3);
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-option:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.color-option.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
}

.product-description {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-8);
}

.product-meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-8);
}

.meta-item {
  display: flex;
  gap: var(--space-4);
}

.meta-label {
  font-weight: 500;
  color: var(--color-gray-700);
  min-width: 80px;
}

.meta-value {
  color: var(--color-gray-600);
}

.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-error { color: var(--color-error); }

.quantity-selector {
  margin-bottom: var(--space-8);
}

.quantity-label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--space-3);
  color: var(--color-gray-700);
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.quantity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-gray-300);
  background: white;
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.quantity-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: var(--color-gray-50);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  font-size: var(--font-size-lg);
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.product-actions {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.add-to-cart-btn {
  flex: 1;
}

.product-features {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
}

.product-tabs {
  border-top: 1px solid var(--color-gray-200);
  padding-top: var(--space-8);
}

.tab-buttons {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.tab-btn {
  padding: var(--space-3) var(--space-6);
  border: 1px solid var(--color-gray-300);
  background: white;
  border-radius: var(--border-radius-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.tab-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.tab-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.tab-panel h4 {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--color-gray-900);
}

.specifications {
  margin-top: var(--space-6);
}

.specifications h5 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--color-gray-900);
}

.spec-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.spec-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-3);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-md);
}

.spec-label {
  font-weight: 500;
  color: var(--color-gray-700);
}

.spec-value {
  color: var(--color-gray-600);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.review-item {
  padding: var(--space-6);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-lg);
}

.review-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.review-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.review-info {
  flex: 1;
}

.review-author {
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--color-gray-900);
}

.review-rating {
  display: flex;
  gap: 2px;
}

.review-date {
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

.review-title {
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-gray-900);
}

.review-comment {
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
}

.no-reviews {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-gray-500);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: var(--space-4);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-gray-200);
  border-top: 3px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .product-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
  
  .product-images {
    position: static;
  }
  
  .product-image {
    height: 300px;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .spec-grid {
    grid-template-columns: 1fr;
  }
}
</style>