<template>
  <div
    v-if="product"
    class="product-card-wrapper hover-magnetic"
    @click="navigateToProduct"
    @keydown.enter="navigateToProduct"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    role="link"
    tabindex="0"
  >
    <div class="product-card card hover-lift smooth-all stagger-item spectacular-card">
      <div class="product-image-container">
        <!-- Particules flottantes -->
        <div class="card-particles" :class="{ 'active': isHovered }">
          <div v-for="i in 15" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
        
        <!-- Éléments 3D flottants -->
        <div class="floating-3d-elements" :class="{ 'active': isHovered }">
          <div class="floating-cube"></div>
          <div class="floating-sphere"></div>
          <div class="floating-triangle"></div>
        </div>
        
        <img
          :src="product.image"
          :alt="product.name"
          class="product-image smooth-transform spectacular-image"
          :class="{ 'hovered': isHovered }"
        />
        
        <!-- Overlay avec effet holographique -->
        <div class="product-overlay spectacular-overlay" :class="{ 'visible': isHovered }">
          <div class="overlay-glow"></div>
          <AnimatedButton
            variant="primary"
            size="sm"
            @click.stop="$emit('quick-view', product)"
            class="quick-view-btn spectacular-btn"
          >
            Vue rapide
          </AnimatedButton>
        </div>
        
        <div v-if="product.featured" class="featured-badge">
          <Star class="w-4 h-4" />
          Featured
        </div>
        
        <button @click.stop="toggleWishlist" class="wishlist-btn spectacular-wishlist">
          <Heart class="w-5 h-5" :class="{ favorited: isInWishlist }" />
        </button>
        
        <!-- Effet de scan laser -->
        <div class="laser-scan" :class="{ 'active': isHovered }"></div>
      </div>

      <div class="card-body spectacular-body">
        <div class="product-category text-sm text-gray-500 mb-2">
          {{ product.category }}
        </div>

        <h3
          class="product-title text-lg font-semibold mb-2 hover:text-primary smooth-all spectacular-title"
        >
          {{ product.name }}
        </h3>

        <p class="product-description text-sm text-gray-600 mb-4 line-clamp-2 spectacular-description">
          {{ product.description }}
        </p>

        <div class="product-rating mb-4 flex items-center gap-2 spectacular-rating">
          <div class="stars flex">
            <Star
              v-for="i in 5"
              :key="i"
              class="w-4 h-4 cursor-pointer spectacular-star"
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

        <div class="product-footer flex items-center justify-between spectacular-footer">
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
            class="spectacular-add-btn"
          >
            <ShoppingCart class="w-4 h-4" />
            {{ product.stock === 0 ? "Rupture" : "Ajouter" }}
          </AnimatedButton>
        </div>

        <div class="stock-indicator mt-3 spectacular-stock">
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

const getParticleStyle = (index: number) => {
  const delay = Math.random() * 2
  const duration = 2 + Math.random() * 3
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = 2 + Math.random() * 4
  const hue = Math.random() * 360
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    background: `hsl(${hue}, 70%, 60%)`
  }
}
</script>

<style scoped>
.spectacular-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  transform-style: preserve-3d;
  perspective: 1000px;
  position: relative;
  overflow: visible;
}

.spectacular-card:hover {
  transform: perspective(1000px) rotateX(15deg) rotateY(15deg) translateZ(50px) scale(1.05);
  box-shadow: 
    0 0 60px rgba(139, 92, 246, 0.6),
    0 30px 80px rgba(0, 0, 0, 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(139, 92, 246, 0.5);
}

.card-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s ease;
  z-index: 10;
}

.card-particles.active {
  opacity: 1;
}

.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.8;
  animation: particleFloat 4s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px) scale(1) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-30px) scale(1.5) rotate(180deg);
    opacity: 1;
  }
}

.floating-3d-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.6s ease;
  z-index: 5;
}

.floating-3d-elements.active {
  opacity: 1;
}

.floating-cube {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.6));
  border-radius: 4px;
  animation: cubeFloat 3s ease-in-out infinite;
  transform-style: preserve-3d;
}

.floating-sphere {
  position: absolute;
  top: 20px;
  right: 15px;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.8), rgba(6, 95, 70, 0.4));
  border-radius: 50%;
  animation: sphereOrbit 4s linear infinite;
  transform-style: preserve-3d;
}

.floating-triangle {
  position: absolute;
  bottom: 15px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 14px solid rgba(245, 158, 11, 0.7);
  animation: triangleRotate 5s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes cubeFloat {
  0% {
    transform: perspective(500px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px);
  }
  33% {
    transform: perspective(500px) rotateX(120deg) rotateY(120deg) rotateZ(120deg) translateZ(20px);
  }
  66% {
    transform: perspective(500px) rotateX(240deg) rotateY(240deg) rotateZ(240deg) translateZ(10px);
  }
  100% {
    transform: perspective(500px) rotateX(360deg) rotateY(360deg) rotateZ(360deg) translateZ(0px);
  }
}

@keyframes sphereOrbit {
  0% {
    transform: perspective(400px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1);
  }
  25% {
    transform: perspective(400px) rotateX(90deg) rotateY(90deg) translateZ(15px) scale(1.3);
  }
  50% {
    transform: perspective(400px) rotateX(180deg) rotateY(180deg) translateZ(25px) scale(0.7);
  }
  75% {
    transform: perspective(400px) rotateX(270deg) rotateY(270deg) translateZ(10px) scale(1.1);
  }
  100% {
    transform: perspective(400px) rotateX(360deg) rotateY(360deg) translateZ(0px) scale(1);
  }
}

@keyframes triangleRotate {
  0% {
    transform: perspective(300px) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  50% {
    transform: perspective(300px) rotateX(180deg) rotateY(180deg) rotateZ(180deg);
  }
  100% {
    transform: perspective(300px) rotateX(360deg) rotateY(360deg) rotateZ(360deg);
  }
}

.card-body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  transform-style: preserve-3d;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.spectacular-card:hover .spectacular-body {
  transform: translateZ(20px);
}

.product-footer {
  margin-top: auto;
}

.product-image-container {
  position: relative;
  overflow: hidden;
  height: 240px;
  background: var(--color-gray-100);
  transform-style: preserve-3d;
}

.spectacular-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.spectacular-image.hovered {
  transform: perspective(800px) rotateX(10deg) rotateY(10deg) scale(1.2) translateZ(30px);
  filter: brightness(1.2) contrast(1.1) saturate(1.3);
}

.spectacular-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.8) 0%,
    rgba(59, 130, 246, 0.6) 50%,
    rgba(16, 185, 129, 0.4) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: perspective(500px) rotateX(-90deg);
  transform-origin: bottom;
  backdrop-filter: blur(10px);
}

.spectacular-overlay.visible {
  opacity: 1;
  transform: perspective(500px) rotateX(0deg);
}

.overlay-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center,
    rgba(255, 255, 255, 0.3) 0%,
    transparent 70%
  );
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.2);
  }
}

.spectacular-btn {
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.spectacular-overlay.visible .spectacular-btn {
  transform: translateY(0) scale(1.1);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

.laser-scan {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(139, 92, 246, 0.8) 50%,
    transparent 100%
  );
  opacity: 0;
  transition: all 0.8s ease;
}

.laser-scan.active {
  opacity: 1;
  left: 100%;
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
  animation: badgeGlow 3s ease-in-out infinite;
  transform-style: preserve-3d;
}

@keyframes badgeGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(139, 92, 246, 0.8);
    transform: scale(1.05);
  }
}

.spectacular-wishlist {
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
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.spectacular-wishlist:hover {
  background: white;
  transform: perspective(300px) rotateX(15deg) rotateY(15deg) scale(1.2) translateZ(10px);
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.6);
}

.spectacular-wishlist .favorited {
  fill: var(--color-error);
  color: var(--color-error);
  animation: heartBeat 1.5s ease-in-out infinite;
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

.spectacular-title {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.spectacular-card:hover .spectacular-title {
  transform: translateZ(15px);
  color: var(--color-primary);
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
}

.spectacular-description {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.spectacular-card:hover .spectacular-description {
  transform: translateZ(10px);
}

.spectacular-rating {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.spectacular-card:hover .spectacular-rating {
  transform: translateZ(12px);
}

.spectacular-star {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.spectacular-star:hover {
  transform: perspective(200px) rotateX(15deg) rotateY(15deg) scale(1.3) translateZ(5px);
  filter: drop-shadow(0 0 10px rgba(254, 196, 0, 0.8));
}

.spectacular-footer {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.spectacular-card:hover .spectacular-footer {
  transform: translateZ(18px);
}

.spectacular-add-btn {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.spectacular-add-btn:hover {
  transform: perspective(300px) rotateX(10deg) rotateY(10deg) scale(1.1) translateZ(8px);
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
}

.spectacular-stock {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-style: preserve-3d;
}

.spectacular-card:hover .spectacular-stock {
  transform: translateZ(8px);
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
  filter: drop-shadow(0 0 6px rgba(254, 196, 0, 0.8));
  animation: starGlow 2s ease-in-out infinite;
}

@keyframes starGlow {
  0%, 100% {
    filter: drop-shadow(0 0 6px rgba(254, 196, 0, 0.8));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(254, 196, 0, 1));
  }
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
