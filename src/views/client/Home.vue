<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="hero-particles">
          <div v-for="i in 30" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text fade-in-up">
          <h1 class="hero-title">
            Découvrez l'<span class="gradient-text">Excellence</span>
          </h1>
          <p class="hero-description">
            Des produits d'exception pour une expérience shopping unique. 
            Qualité premium, design moderne et innovation technologique.
          </p>
          
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">{{ featuredProducts.length }}+</div>
              <div class="stat-label">Produits premium</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">10k+</div>
              <div class="stat-label">Clients satisfaits</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">4.9</div>
              <div class="stat-label">Note moyenne</div>
            </div>
          </div>
          
          <div class="hero-actions">
            <AnimatedButton 
              variant="primary" 
              size="lg"
              @click="$router.push('/products')"
              class="cta-button"
            >
              Découvrir la collection
            </AnimatedButton>
            <AnimatedButton 
              variant="secondary" 
              size="lg"
              @click="scrollToFeatures"
            >
              En savoir plus
            </AnimatedButton>
          </div>
        </div>
        
        <div class="hero-visual slide-in-right">
          <div class="hero-image-container">
            <div class="floating-cards">
              <div 
                v-for="(product, index) in featuredProducts.slice(0, 3)"
                :key="product.id"
                class="floating-card"
                :style="{ animationDelay: `${index * 0.2}s` }"
              >
                <img :src="product.image" :alt="product.name" />
                <div class="card-info">
                  <h4>{{ product.name }}</h4>
                  <p>{{ formatPrice(product.price) }}</p>
                </div>
              </div>
            </div>
            <img 
              src="https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Hero"
              class="hero-image float"
            />
            <div class="hero-decoration"></div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Trust Indicators -->
    <section class="trust-section">
      <div class="container">
        <div class="trust-indicators">
          <div class="trust-item">
            <Shield class="w-8 h-8" />
            <span>Paiement 100% sécurisé</span>
          </div>
          <div class="trust-item">
            <Truck class="w-8 h-8" />
            <span>Livraison gratuite dès 50€</span>
          </div>
          <div class="trust-item">
            <RotateCcw class="w-8 h-8" />
            <span>Retour gratuit 30 jours</span>
          </div>
          <div class="trust-item">
            <Headphones class="w-8 h-8" />
            <span>Support client 24/7</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="features" ref="featuresSection">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Pourquoi nous choisir ?</h2>
          <p class="section-subtitle">Des avantages exclusifs pour une expérience d'achat exceptionnelle</p>
        </div>
        <div class="features-grid">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="feature-card stagger-item hover-lift interactive-card"
          >
            <div class="feature-icon">
              <component :is="feature.icon" class="w-8 h-8" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-number">{{ String(index + 1).padStart(2, '0') }}</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Categories Showcase -->
    <section class="categories-showcase">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Explorez nos catégories</h2>
          <p class="section-subtitle">Trouvez exactement ce que vous cherchez</p>
        </div>
        
        <div class="categories-grid">
          <div 
            v-for="category in activeCategories"
            :key="category.id"
            class="category-card hover-lift"
            @click="$router.push(`/products?category=${category.slug}`)"
          >
            <div class="category-image">
              <img :src="category.image" :alt="category.name" />
              <div class="category-overlay">
                <h3 class="category-name">{{ category.name }}</h3>
                <p class="category-count">{{ category.productsCount }} produits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Featured Products -->
    <section class="featured-products">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Produits vedettes</h2>
          <p class="section-subtitle">Notre sélection des meilleurs produits</p>
          <RouterLink to="/products" class="view-all-link">
            Voir tout
            <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
        
        <div class="products-grid">
          <ProductCard 
            v-for="product in featuredProducts"
            :key="product.id"
            :product="product"
            @quick-view="openQuickView"
            @update:product="updateProduct"
          />
        </div>
      </div>
    </section>
    
    <!-- Testimonials -->
    <section class="testimonials">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Ce que disent nos clients</h2>
          <p class="section-subtitle">Des avis authentiques de notre communauté</p>
        </div>
        
        <div class="testimonials-grid">
          <div 
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="testimonial-card stagger-item"
          >
            <div class="testimonial-content">
              <div class="quote-icon">
                <Quote class="w-6 h-6" />
              </div>
              <p class="testimonial-text">{{ testimonial.text }}</p>
            </div>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar" />
              <div class="author-info">
                <h4 class="author-name">{{ testimonial.name }}</h4>
                <p class="author-role">{{ testimonial.role }}</p>
              </div>
              <div class="testimonial-rating">
                <Star 
                  v-for="i in testimonial.rating" 
                  :key="i"
                  class="w-4 h-4 text-yellow-400 fill-current"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Newsletter Section -->
    <section class="newsletter">
      <div class="container">
        <div class="newsletter-content">
          <div class="newsletter-icon">
            <Mail class="w-12 h-12" />
          </div>
          <h3 class="newsletter-title">Restez connecté</h3>
          <p class="newsletter-description">
            Recevez nos dernières offres exclusives, nouveautés et conseils directement dans votre boîte mail
          </p>
          
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input 
              v-model="email"
              type="email" 
              placeholder="Votre adresse email"
              class="newsletter-input"
              required
            />
            <AnimatedButton 
              type="submit"
              variant="primary"
              :loading="subscribing"
            >
              S'abonner
            </AnimatedButton>
          </form>
          
          <div class="newsletter-benefits">
            <div class="benefit-item">
              <Check class="w-4 h-4" />
              <span>Offres exclusives</span>
            </div>
            <div class="benefit-item">
              <Check class="w-4 h-4" />
              <span>Nouveautés en avant-première</span>
            </div>
            <div class="benefit-item">
              <Check class="w-4 h-4" />
              <span>Conseils d'experts</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { 
  Truck, Shield, Star, Headphones, ArrowRight, RotateCcw, 
  Quote, Mail, Check 
} from 'lucide-vue-next'
import { useMainStore, type Product } from '../../stores/main'
import ProductCard from '../../components/ui/ProductCard.vue'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const store = useMainStore()
const featuredProducts = computed(() => store.featuredProducts)
const activeCategories = computed(() => store.activeCategories)

const email = ref('')
const subscribing = ref(false)
const featuresSection = ref<HTMLElement>()

const features = [
  {
    icon: Truck,
    title: 'Livraison rapide',
    description: 'Livraison gratuite en 24h pour toute commande supérieure à 50€'
  },
  {
    icon: Shield,
    title: 'Paiement sécurisé',
    description: 'Vos données sont protégées avec le cryptage SSL et 3D Secure'
  },
  {
    icon: Star,
    title: 'Qualité premium',
    description: 'Produits sélectionnés avec soin pour leur excellence et durabilité'
  },
  {
    icon: Headphones,
    title: 'Support 24/7',
    description: 'Notre équipe est disponible pour vous accompagner à tout moment'
  }
]

const testimonials = [
  {
    text: "Service client exceptionnel et produits de qualité. Je recommande vivement !",
    name: "Marie Dubois",
    role: "Cliente fidèle",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5
  },
  {
    text: "Livraison ultra rapide et emballage soigné. Une expérience parfaite du début à la fin.",
    name: "Pierre Martin",
    role: "Acheteur vérifié",
    avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5
  },
  {
    text: "Large choix de produits et prix compétitifs. Mon site de référence pour mes achats.",
    name: "Sophie Laurent",
    role: "Membre premium",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    rating: 5
  }
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const getParticleStyle = (index: number) => {
  const delay = Math.random() * 4
  const duration = 4 + Math.random() * 2
  const left = Math.random() * 100
  const size = 2 + Math.random() * 4
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`
  }
}

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

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

const subscribeNewsletter = async () => {
  if (!email.value) return
  
  subscribing.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('Newsletter subscription:', email.value)
  email.value = ''
  subscribing.value = false
}
</script>

<style scoped>
.home {
  overflow-x: hidden;
}

.hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
}

.hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-6);
  color: white;
}

.gradient-text {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-8);
}

.hero-stats {
  display: flex;
  gap: var(--space-8);
  margin-bottom: var(--space-8);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: white;
  margin-bottom: var(--space-1);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.8);
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
}

.cta-button {
  animation: glow-pulse 3s ease-in-out infinite;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.hero-image-container {
  position: relative;
  max-width: 500px;
}

.floating-cards {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-card {
  position: absolute;
  width: 120px;
  background: white;
  border-radius: var(--border-radius-xl);
  padding: var(--space-3);
  box-shadow: var(--shadow-xl);
  animation: float 6s ease-in-out infinite;
}

.floating-card:nth-child(1) {
  top: 10%;
  left: -20%;
  animation-delay: 0s;
}

.floating-card:nth-child(2) {
  top: 60%;
  right: -30%;
  animation-delay: 2s;
}

.floating-card:nth-child(3) {
  bottom: 20%;
  left: -10%;
  animation-delay: 4s;
}

.floating-card img {
  width: 100%;
  height: 60px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--space-2);
}

.card-info h4 {
  font-size: var(--font-size-xs);
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: var(--color-gray-900);
}

.card-info p {
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  font-weight: 600;
}

.hero-image {
  width: 100%;
  height: auto;
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-2xl);
}

.hero-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 50%;
  opacity: 0.1;
  animation: pulse 3s ease-in-out infinite;
}

.trust-section {
  padding: var(--space-12) 0;
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
}

.trust-indicators {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
  color: var(--color-gray-600);
}

.trust-item svg {
  color: var(--color-primary);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-8);
  color: var(--color-gray-900);
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.features {
  padding: var(--space-20) 0;
  background: var(--color-gray-50);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
}

.feature-card {
  text-align: center;
  padding: var(--space-8);
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  transform: scaleX(0);
  transition: transform var(--transition-normal);
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
  color: white;
  position: relative;
  z-index: 2;
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-4);
  color: var(--color-gray-900);
}

.feature-description {
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
}

.feature-number {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 32px;
  height: 32px;
  background: var(--color-gray-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

.categories-showcase {
  padding: var(--space-20) 0;
  background: white;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

.category-card {
  cursor: pointer;
  border-radius: var(--border-radius-xl);
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
  transform: scale(1.1);
}

.category-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-6);
  color: white;
}

.category-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.category-count {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.featured-products {
  padding: var(--space-20) 0;
  background: var(--color-gray-50);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-12);
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-normal);
}

.view-all-link:hover {
  gap: var(--space-3);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

.testimonials {
  padding: var(--space-20) 0;
  background: white;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
}

.testimonial-card {
  background: var(--color-gray-50);
  border-radius: var(--border-radius-xl);
  padding: var(--space-8);
  transition: all var(--transition-normal);
}

.testimonial-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.testimonial-content {
  position: relative;
  margin-bottom: var(--space-6);
}

.quote-icon {
  position: absolute;
  top: -10px;
  left: -10px;
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.testimonial-text {
  font-style: italic;
  color: var(--color-gray-700);
  line-height: var(--line-height-relaxed);
  padding-left: var(--space-6);
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.author-role {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.testimonial-rating {
  display: flex;
  gap: 2px;
}

.newsletter {
  padding: var(--space-20) 0;
  background: var(--gradient-dark);
  color: white;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
  backdrop-filter: blur(10px);
}

.newsletter-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
}

.newsletter-description {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-8);
  opacity: 0.9;
  line-height: var(--line-height-relaxed);
}

.newsletter-form {
  display: flex;
  gap: var(--space-4);
  max-width: 400px;
  margin: 0 auto;
  margin-bottom: var(--space-8);
}

.newsletter-input {
  flex: 1;
  padding: var(--space-4);
  border: none;
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.newsletter-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.newsletter-benefits {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
  flex-wrap: wrap;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--space-8);
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .hero-title {
    font-size: var(--font-size-3xl);
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .floating-cards {
    display: none;
  }
  
  .trust-indicators {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  
  .newsletter-form {
    flex-direction: column;
    max-width: 300px;
  }
  
  .newsletter-benefits {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .trust-indicators {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
