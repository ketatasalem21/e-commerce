<template>
  <div class="cart-page">
    <div class="container">
      <div class="page-header fade-in-up">
        <h1 class="page-title">Panier</h1>
        <p v-if="cartItems.length > 0" class="page-description">
          {{ cartItems.length }} {{ cartItems.length === 1 ? 'article' : 'articles' }} dans votre panier
        </p>
      </div>
      
      <div v-if="cartItems.length > 0" class="cart-content">
        <!-- Cart Items -->
        <div class="cart-items">
          <div 
            v-for="item in cartItems"
            :key="item.id"
            class="cart-item stagger-item hover-lift"
          >
            <div class="item-image">
              <img :src="item.product.image" :alt="item.product.name" />
            </div>
            
            <div class="item-details">
              <h3 class="item-name">{{ item.product.name }}</h3>
              <p class="item-category">{{ item.product.category }}</p>
              <p class="item-price">{{ formatPrice(item.product.price) }}</p>
            </div>
            
            <div class="item-quantity">
              <button 
                @click="decreaseQuantity(item)"
                :disabled="item.quantity <= 1"
                class="quantity-btn"
              >
                <Minus class="w-4 h-4" />
              </button>
              <span class="quantity-value">{{ item.quantity }}</span>
              <button 
                @click="increaseQuantity(item)"
                :disabled="item.quantity >= item.product.stock"
                class="quantity-btn"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>
            
            <div class="item-total">
              {{ formatPrice(item.product.price * item.quantity) }}
            </div>
            
            <button 
              @click="removeItem(item)"
              class="remove-btn"
            >
              <Trash2 class="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <!-- Cart Summary -->
        <div class="cart-summary slide-in-right">
          <div class="summary-card">
            <h3 class="summary-title">Récapitulatif</h3>
            
            <div class="summary-line">
              <span>Sous-total</span>
              <span>{{ formatPrice(cartTotal) }}</span>
            </div>
            
            <div class="summary-line">
              <span>Livraison</span>
              <span class="text-success">Gratuite</span>
            </div>
            
            <div class="summary-line">
              <span>TVA (20%)</span>
              <span>{{ formatPrice(cartTotal * 0.2) }}</span>
            </div>
            
            <div class="summary-divider"></div>
            
            <div class="summary-total">
              <span>Total</span>
              <span>{{ formatPrice(cartTotal * 1.2) }}</span>
            </div>
            
            <AnimatedButton 
              variant="primary" 
              size="lg"
              @click="proceedToCheckout"
              class="checkout-btn"
            >
              Procéder au paiement
            </AnimatedButton>
            
            <AnimatedButton 
              variant="secondary"
              @click="$router.push('/products')"
              class="continue-shopping-btn"
            >
              Continuer mes achats
            </AnimatedButton>
          </div>
        </div>
      </div>
      
      <!-- Empty Cart -->
      <div v-else class="empty-cart fade-in-scale">
        <ShoppingCart class="empty-icon" />
        <h3 class="empty-title">Votre panier est vide</h3>
        <p class="empty-description">
          Découvrez notre collection de produits d'exception et ajoutez vos favoris au panier.
        </p>
        <AnimatedButton 
          variant="primary" 
          size="lg"
          @click="$router.push('/products')"
        >
          Découvrir nos produits
        </AnimatedButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-vue-next'
import { useMainStore, type CartItem } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const router = useRouter()
const store = useMainStore()

const cartItems = computed(() => store.cart)
const cartTotal = computed(() => store.cartTotal)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const decreaseQuantity = (item: CartItem) => {
  if (item.quantity > 1) {
    store.updateCartItemQuantity(item.id, item.quantity - 1)
  }
}

const increaseQuantity = (item: CartItem) => {
  if (item.quantity < item.product.stock) {
    store.updateCartItemQuantity(item.id, item.quantity + 1)
  }
}

const removeItem = (item: CartItem) => {
  store.removeFromCart(item.id)
}

const proceedToCheckout = () => {
  router.push('/checkout')
}
</script>

<style scoped>
.cart-page {
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
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: var(--space-6);
  align-items: center;
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  background: var(--color-gray-100);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-2);
  color: var(--color-gray-900);
}

.item-category {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
  margin-bottom: var(--space-2);
}

.item-price {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-primary);
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.quantity-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-gray-300);
  background: white;
  border-radius: var(--border-radius-md);
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
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-gray-900);
  min-width: 100px;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}

.remove-btn:hover {
  background: var(--color-error);
  color: white;
}

.cart-summary {
  position: sticky;
  top: var(--space-8);
}

.summary-card {
  background: white;
  padding: var(--space-8);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-lg);
}

.summary-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
  color: var(--color-gray-900);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
  color: var(--color-gray-700);
}

.summary-divider {
  height: 1px;
  background: var(--color-gray-200);
  margin: var(--space-6) 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--space-8);
  color: var(--color-gray-900);
}

.checkout-btn {
  width: 100%;
  margin-bottom: var(--space-4);
}

.continue-shopping-btn {
  width: 100%;
}

.empty-cart {
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
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.text-success {
  color: var(--color-success);
  font-weight: 500;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
  
  .cart-item {
    grid-template-columns: 80px 1fr;
    gap: var(--space-4);
  }
  
  .item-image {
    width: 80px;
    height: 80px;
  }
  
  .item-quantity,
  .item-total,
  .remove-btn {
    grid-column: 1 / -1;
    justify-self: end;
    margin-top: var(--space-4);
  }
  
  .cart-summary {
    position: static;
  }
}
</style>