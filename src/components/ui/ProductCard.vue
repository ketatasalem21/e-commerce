<template>
  <div
    v-if="product"
    class="product-card-wrapper"
    @click="navigateToProduct"
    @keydown.enter="navigateToProduct"
    role="link"
    tabindex="0"
  >
    <div class="product-card card hover-lift smooth-all stagger-item">
      <div class="product-image-container">
        <img
          :src="product.image"
          :alt="product.name"
          class="product-image smooth-transform"
          :class="{ hovered: isHovered }"
        />
        <div class="product-overlay" :class="{ visible: isHovered }">
          <AnimatedButton
            variant="primary"
            size="sm"
            @click.stop="$emit('quick-view', product)"
            class="quick-view-btn"
          >
            Vue rapide
          </AnimatedButton>
        </div>
        <div v-if="product.featured" class="featured-badge">
          <Star class="w-4 h-4" />
          Featured
        </div>
        <button @click.stop="toggleWishlist" class="wishlist-btn">
          <Heart class="w-5 h-5" :class="{ favorited: isInWishlist }" />
        </button>
      </div>

      <div class="card-body">
        <div class="product-category text-sm text-gray-500 mb-2">
          {{ product.category }}
        </div>

        <h3
          class="product-title text-lg font-semibold mb-2 hover:text-primary smooth-all"
        >
          {{ product.name }}
        </h3>

        <p class="product-description text-sm text-gray-600 mb-4 line-clamp-2">
          {{ product.description }}
        </p>

        <div class="product-rating mb-4 flex items-center gap-2">
          <div class="stars flex">
            <Star
              v-for="i in 5"
              :key="i"
              class="w-4 h-4 cursor-pointer"
              :class="
                getUserStarClass(i)
              "
              @click.stop="rateProduct(i)"
            />
          </div>
          <span class="text-sm text-gray-500">
            ({{ userRating !== null ? userRating : product.rating }})
          </span>
        </div>

        <div class="product-footer flex items-center justify-between">
          <div class="product-price">
            <span class="price-current text-2xl font-bold text-primary">
              {{ formatPrice(product.price) }}
            </span>
          </div>

          <AnimatedButton
            variant="accent"
            size="sm"
            @click.stop="addToCart"
            :disabled="product.stock === 0"
          >
            <ShoppingCart class="w-4 h-4" />
            {{ product.stock === 0 ? "Rupture" : "Ajouter" }}
          </AnimatedButton>
        </div>

        <div class="stock-indicator mt-3">
          <div class="stock-bar">
            <div
              class="stock-fill"
              :style="{ width: `${Math.min((product.stock / 100) * 100, 100)}%` }"
            ></div>
          </div>
          <span class="text-xs text-gray-500">
            {{ product.stock > 0 ? `${product.stock} en stock` : "Rupture de stock" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { Star, ShoppingCart, Heart } from 'lucide-vue-next'
import { useMainStore, type Product } from '../../stores/main'
import AnimatedButton from "./AnimatedButton.vue";

interface Props {
  product: Product
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'quick-view': [product: Product],
  'update:product': [product: Product]
}>()

const { product } = toRefs(props)

const store = useMainStore()
const router = useRouter()
const isHovered = ref(false)

const isInWishlist = computed(() =>
  store.wishlist.some(item => item.product.id === product.value.id)
)

const userRating = computed(() => 
  store.getUserRating(product.value.id)
)

const navigateToProduct = () => {
  router.push(`/product/${product.value.id}`)
}

const toggleWishlist = () => {
  if (!store.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  if (isInWishlist.value) {
    store.removeFromWishlist(product.value.id)
  } else {
    store.addToWishlist(product.value)
  }
}

const rateProduct = (rating: number) => {
  if (!store.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  
  store.addUserRating(product.value.id, rating)
  // Optionally update the product's average rating
  // store.updateProductRating(product.value.id, rating)
  // emit('update:product', updatedProduct)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const addToCart = () => {
  if (product.value.stock > 0) {
    store.addToCart(product.value)
  }
}

const getUserStarClass = (starIndex: number) => {
  const currentUserRating = userRating.value
  const productRating = product.value.rating
  
  if (currentUserRating !== null) {
    // L'utilisateur a noté ce produit - afficher sa note en jaune vif
    return starIndex <= currentUserRating 
      ? 'text-yellow-400 fill-current user-rating' 
      : 'text-gray-300 hover:text-yellow-400'
  } else {
    // L'utilisateur n'a pas noté - afficher la note moyenne en jaune plus doux
    return starIndex <= productRating 
      ? 'text-yellow-300 fill-current' 
      : 'text-gray-300 hover:text-yellow-400'
  }
}
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.3s var(--ease-out-expo);
  cursor: pointer;
}

.card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-footer {
  margin-top: auto;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  height: 240px;
  background: var(--color-gray-100);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s var(--ease-out-expo);
}

.product-image.hovered {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-overlay.visible {
  opacity: 1;
}

.quick-view-btn {
  transform: translateY(20px);
  transition: transform 0.3s var(--ease-out-back);
}

.product-overlay.visible .quick-view-btn {
  transform: translateY(0);
}

.featured-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--gradient-primary);
  color: white;
  padding: 4px 8px;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: glow 2s ease-in-out infinite;
}

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.wishlist-btn:hover {
  background: white;
  transform: scale(1.1);
}

.wishlist-btn .favorited {
  fill: var(--color-error);
  color: var(--color-error);
}

.product-title {
  transition: color var(--transition-normal);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stars {
  gap: 2px;
}

.stars .user-rating {
  filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.8));
  animation: starGlow 2s ease-in-out infinite;
}

@keyframes starGlow {
  0%, 100% {
    filter: drop-shadow(0 0 6px rgba(250, 204, 21, 0.8));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(250, 204, 21, 1));
  }
}

.stars .w-4:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}

.price-current {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stock-bar {
  width: 100%;
  height: 4px;
  background: var(--color-gray-200);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.stock-fill {
  height: 100%;
  background: var(--gradient-secondary);
  border-radius: var(--border-radius-full);
  transition: width 0.5s ease;
}
</style>
