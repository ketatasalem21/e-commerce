<template>
  <div class="product-detail" v-if="product">
    <div class="container">
      <div class="product-content">
        <!-- Product Images -->
        <div class="product-images fade-in-up">
          <div class="main-image">
            <img 
              :src="product.image" 
              :alt="product.name"
              class="product-image"
            />
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
import { useRoute, RouterLink } from 'vue-router'
import { 
  Star, 
  ChevronRight, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-vue-next'
import { useMainStore } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const route = useRoute()
const store = useMainStore()

const quantity = ref(1)

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
    // Show toast notification
  }
}

const addToWishlist = () => {
  console.log('Add to wishlist:', product.value)
}

const rateProduct = (rating: number) => {
  if (!store.isAuthenticated) {
    // Redirection vers la page de connexion si non connecté
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
    // L'utilisateur a noté ce produit - afficher sa note avec la couleur personnalisée
    return starIndex <= currentUserRating 
      ? 'star-user-rating fill-current' 
      : 'text-gray-300 star-hover'
  } else {
    // L'utilisateur n'a pas noté - afficher la note moyenne
    return starIndex <= productRating 
      ? 'star-average-rating fill-current' 
      : 'text-gray-300 star-hover'
  }
}

onMounted(() => {
  // Scroll to top when component mounts
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
  margin-bottom: var(--space-4);
  color: var(--color-gray-900);
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
  color: var(--color-star-user);
  font-weight: 500;
}

.star-user-rating {
  color: var(--color-star-user);
  filter: drop-shadow(0 0 6px rgba(254, 196, 0, 0.8));
  animation: starGlow 2s ease-in-out infinite;
}

.star-average-rating {
  color: var(--color-star-average);
}

.star-hover:hover {
  color: var(--color-star-hover);
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
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
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
}
</style>