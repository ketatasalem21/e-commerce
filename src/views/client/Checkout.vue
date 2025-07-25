<template>
  <div class="checkout-page">
    <div class="container">
      <div class="page-header fade-in-up">
        <h1 class="page-title">Finaliser la commande</h1>
        <div class="checkout-steps">
          <div class="step active">
            <div class="step-number">1</div>
            <span>Informations</span>
          </div>
          <div class="step-divider"></div>
          <div class="step">
            <div class="step-number">2</div>
            <span>Paiement</span>
          </div>
          <div class="step-divider"></div>
          <div class="step">
            <div class="step-number">3</div>
            <span>Confirmation</span>
          </div>
        </div>
      </div>
      
      <div class="checkout-content">
        <!-- Checkout Form -->
        <div class="checkout-form slide-in-right">
          <form @submit.prevent="processOrder">
            <!-- Customer Information -->
            <div class="form-section">
              <h3 class="section-title">Informations de livraison</h3>
              
              <div class="form-grid">
                <div class="form-group">
                  <label for="firstName" class="form-label">Prénom *</label>
                  <input 
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="lastName" class="form-label">Nom *</label>
                  <input 
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="email" class="form-label">Email *</label>
                <input 
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label for="phone" class="form-label">Téléphone</label>
                <input 
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label for="address" class="form-label">Adresse *</label>
                <input 
                  id="address"
                  v-model="form.address"
                  type="text"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-grid">
                <div class="form-group">
                  <label for="city" class="form-label">Ville *</label>
                  <input 
                    id="city"
                    v-model="form.city"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label for="postalCode" class="form-label">Code postal *</label>
                  <input 
                    id="postalCode"
                    v-model="form.postalCode"
                    type="text"
                    class="form-input"
                    required
                  />
                </div>
              </div>
            </div>
            
            <!-- Payment Information -->
            <div class="form-section">
              <h3 class="section-title">Informations de paiement</h3>
              
              <div class="payment-methods">
                <label class="payment-method">
                  <input 
                    v-model="form.paymentMethod"
                    type="radio"
                    value="card"
                    class="payment-radio"
                  />
                  <div class="payment-option">
                    <CreditCard class="w-5 h-5" />
                    <span>Carte bancaire</span>
                  </div>
                </label>
                
                <label class="payment-method">
                  <input 
                    v-model="form.paymentMethod"
                    type="radio"
                    value="paypal"
                    class="payment-radio"
                  />
                  <div class="payment-option">
                    <Wallet class="w-5 h-5" />
                    <span>PayPal</span>
                  </div>
                </label>
              </div>
              
              <div v-if="form.paymentMethod === 'card'" class="card-form">
                <div class="form-group">
                  <label for="cardNumber" class="form-label">Numéro de carte *</label>
                  <input 
                    id="cardNumber"
                    v-model="form.cardNumber"
                    type="text"
                    class="form-input"
                    placeholder="1234 5678 9012 3456"
                    required
                  />
                </div>
                
                <div class="form-grid">
                  <div class="form-group">
                    <label for="expiryDate" class="form-label">Date d'expiration *</label>
                    <input 
                      id="expiryDate"
                      v-model="form.expiryDate"
                      type="text"
                      class="form-input"
                      placeholder="MM/AA"
                      required
                    />
                  </div>
                  
                  <div class="form-group">
                    <label for="cvv" class="form-label">CVV *</label>
                    <input 
                      id="cvv"
                      v-model="form.cvv"
                      type="text"
                      class="form-input"
                      placeholder="123"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-actions">
              <AnimatedButton 
                type="submit"
                variant="primary" 
                size="lg"
                :loading="processing"
                class="submit-btn"
              >
                Finaliser la commande
              </AnimatedButton>
            </div>
          </form>
        </div>
        
        <!-- Order Summary -->
        <div class="order-summary fade-in-up">
          <div class="summary-card">
            <h3 class="summary-title">Récapitulatif de commande</h3>
            
            <div class="order-items">
              <div 
                v-for="item in cartItems"
                :key="item.id"
                class="order-item"
              >
                <img :src="item.product.image" :alt="item.product.name" class="item-image" />
                <div class="item-details">
                  <h4 class="item-name">{{ item.product.name }}</h4>
                  <p class="item-quantity">Quantité: {{ item.quantity }}</p>
                </div>
                <div class="item-price">
                  {{ formatPrice(item.product.price * item.quantity) }}
                </div>
              </div>
            </div>
            
            <div class="summary-calculations">
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
            </div>
            
            <!-- Security Info -->
            <div class="security-info">
              <div class="security-item">
                <Shield class="w-4 h-4 text-success" />
                <span>Paiement sécurisé SSL</span>
              </div>
              <div class="security-item">
                <Lock class="w-4 h-4 text-success" />
                <span>Données cryptées</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { CreditCard, Wallet, Shield, Lock } from 'lucide-vue-next'
import { useMainStore } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const router = useRouter()
const store = useMainStore()

const cartItems = computed(() => store.cart)
const cartTotal = computed(() => store.cartTotal)

const processing = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  paymentMethod: 'card',
  cardNumber: '',
  expiryDate: '',
  cvv: ''
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const processOrder = async () => {
  if (cartItems.value.length === 0) return
  
  processing.value = true
  
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear cart
    store.clearCart()
    
    // Redirect to success page or show confirmation
    console.log('Order processed successfully')
    router.push('/')
    
  } catch (error) {
    console.error('Order processing failed:', error)
  } finally {
    processing.value = false
  }
}
</script>

<style scoped>
.checkout-page {
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
  margin-bottom: var(--space-8);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.checkout-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  max-width: 500px;
  margin: 0 auto;
}

.step {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.step.active {
  color: var(--color-primary);
  font-weight: 600;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-gray-200);
  color: var(--color-gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.step.active .step-number {
  background: var(--color-primary);
  color: white;
}

.step-divider {
  width: 40px;
  height: 1px;
  background: var(--color-gray-300);
}

.checkout-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-12);
  align-items: start;
}

.checkout-form {
  background: white;
  padding: var(--space-8);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
}

.form-section {
  margin-bottom: var(--space-8);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-6);
  color: var(--color-gray-900);
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

.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.payment-methods {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.payment-method {
  flex: 1;
  cursor: pointer;
}

.payment-radio {
  display: none;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 2px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
}

.payment-radio:checked + .payment-option {
  border-color: var(--color-primary);
  background: rgba(139, 92, 246, 0.05);
}

.card-form {
  animation: fadeInUp 0.3s ease;
}

.form-actions {
  margin-top: var(--space-8);
}

.submit-btn {
  width: 100%;
}

.order-summary {
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

.order-items {
  margin-bottom: var(--space-6);
}

.order-item {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--space-3);
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--color-gray-900);
}

.item-quantity {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.item-price {
  font-weight: 600;
  color: var(--color-primary);
}

.summary-calculations {
  margin-bottom: var(--space-6);
}

.summary-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
  color: var(--color-gray-700);
}

.summary-divider {
  height: 1px;
  background: var(--color-gray-200);
  margin: var(--space-4) 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-gray-900);
}

.security-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-gray-200);
}

.security-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.text-success {
  color: var(--color-success);
  font-weight: 500;
}

@media (max-width: 768px) {
  .checkout-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-methods {
    flex-direction: column;
  }
  
  .order-summary {
    position: static;
    order: -1;
  }
  
  .checkout-steps {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .step-divider {
    width: 1px;
    height: 20px;
  }
}
</style>