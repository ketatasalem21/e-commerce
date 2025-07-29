<template>
  <div class="home">
    <!-- Hero Section avec animations 3D spectaculaires -->
    <section class="hero">
      <div class="hero-background">
        <!-- Particules énergétiques -->
        <div class="energy-field">
          <div v-for="i in 50" :key="i" class="energy-particles" :style="getEnergyParticleStyle(i)"></div>
        </div>
        
        <!-- Éléments 3D flottants spectaculaires -->
        <div class="floating-3d-elements">
          <div class="magic-cube" :style="{ top: '15%', left: '10%' }"></div>
          <div class="orbital-sphere" :style="{ top: '25%', right: '15%' }"></div>
          <div class="crystal-prism" :style="{ bottom: '30%', left: '20%' }"></div>
          <div class="advanced-hologram" :style="{ bottom: '20%', right: '25%' }"></div>
          <div class="geometric-morph" :style="{ top: '40%', left: '5%' }"></div>
          <div class="dna-helix" :style="{ top: '60%', right: '10%' }"></div>
          <div class="dimensional-portal" :style="{ top: '10%', left: '50%', transform: 'translateX(-50%)' }"></div>
          <div class="fractal-tessellation" :style="{ bottom: '40%', left: '45%' }"></div>
          <div class="temporal-vortex" :style="{ top: '50%', right: '5%' }"></div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text spectacular-entrance">
          <h1 class="hero-title quantum-levitation">
            Découvrez l'<span class="gradient-text">Excellence</span>
          </h1>
          
          <!-- Animation de photos juice pour e-commerce -->
          <div class="excellence-photos-container">
            <div 
              class="juice-photo juice-photo-float" 
              :style="{ animationDelay: '0s' }"
              @click="handlePhotoClick('macbook')"
              @mouseenter="handlePhotoHover('macbook')"
            >
              <img src="https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=300" 
                   alt="MacBook Pro" class="juice-photo-img" />
              <div class="photo-overlay">
                <span class="photo-label">MacBook Pro M3</span>
                <span class="photo-price">€2,499</span>
              </div>
              <div class="photo-glow"></div>
            </div>
            
            <div 
              class="juice-photo photo-morphing" 
              :style="{ animationDelay: '2s' }"
              @click="handlePhotoClick('iphone')"
              @mouseenter="handlePhotoHover('iphone')"
            >
              <img src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300" 
                   alt="iPhone 15 Pro" class="juice-photo-img" />
              <div class="photo-overlay">
                <span class="photo-label">iPhone 15 Pro</span>
                <span class="photo-price">€1,199</span>
              </div>
              <div class="photo-glow"></div>
            </div>
            
            <div 
              class="juice-photo photo-gallery-3d" 
              :style="{ animationDelay: '4s' }"
              @click="handlePhotoClick('airpods')"
              @mouseenter="handlePhotoHover('airpods')"
            >
              <img src="https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=300" 
                   alt="AirPods Pro" class="juice-photo-img" />
              <div class="photo-overlay">
                <span class="photo-label">AirPods Pro</span>
                <span class="photo-price">€279</span>
              </div>
              <div class="photo-glow"></div>
            </div>
            
            <div 
              class="juice-photo photo-stack" 
              :style="{ animationDelay: '1s' }"
              @click="handlePhotoClick('watch')"
              @mouseenter="handlePhotoHover('watch')"
            >
              <img src="https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=300" 
                   alt="Apple Watch" class="juice-photo-img" />
              <div class="photo-overlay">
                <span class="photo-label">Apple Watch</span>
                <span class="photo-price">€429</span>
              </div>
              <div class="photo-glow"></div>
            </div>
            
            <div 
              class="juice-photo juice-photo-float" 
              :style="{ animationDelay: '3s' }"
              @click="handlePhotoClick('ipad')"
              @mouseenter="handlePhotoHover('ipad')"
            >
              <img src="https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=300" 
                   alt="iPad Air" class="juice-photo-img" />
              <div class="photo-overlay">
                <span class="photo-label">iPad Air</span>
                <span class="photo-price">€699</span>
              </div>
              <div class="photo-glow"></div>
            </div>
          </div>
          
          <p class="hero-description fade-in-up">
            Des produits d'exception pour une expérience shopping unique. 
            Qualité premium, design moderne et innovation technologique.
          </p>
          
          <div class="hero-stats quantum-levitation">
            <div class="stat-item magic-cube">
              <div class="stat-number">{{ featuredProducts.length }}+</div>
              <div class="stat-label">Produits premium</div>
            </div>
            <div class="stat-item orbital-sphere">
              <div class="stat-number">10k+</div>
              <div class="stat-label">Clients satisfaits</div>
            </div>
            <div class="stat-item crystal-prism">
              <div class="stat-number">4.9</div>
              <div class="stat-label">Note moyenne</div>
            </div>
          </div>
          
          <div class="hero-actions">
            <AnimatedButton 
              variant="primary" 
              size="lg"
              @click="$router.push('/products')"
              class="cta-button advanced-hologram"
            >
              Découvrir la collection
            </AnimatedButton>
            <AnimatedButton 
              variant="secondary" 
              size="lg"
              @click="scrollToFeatures"
              class="geometric-morph"
            >
              En savoir plus
            </AnimatedButton>
          </div>
        </div>
        
        <div class="hero-visual slide-in-right">
          <div class="hero-image-container temporal-vortex">
            <!-- Cartes flottantes 3D spectaculaires -->
            <div class="floating-cards">
              <div 
                v-for="(product, index) in featuredProducts.slice(0, 3)"
                :key="product.id"
                class="floating-card fractal-tessellation"
                :style="{ 
                  animationDelay: `${index * 0.5}s`,
                  ...getFloatingCardPosition(index)
                }"
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
              class="hero-image quantum-levitation"
            />
            
            <!-- Éléments décoratifs 3D spectaculaires -->
            <div class="decoration-elements">
              <div class="deco-ring dimensional-portal"></div>
              <div class="deco-triangle dna-helix"></div>
              <div class="deco-hexagon advanced-hologram"></div>
              <div class="deco-diamond magic-cube"></div>
              <div class="deco-spiral orbital-sphere"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Trust Indicators avec animations 3D -->
    <section class="trust-section">
      <div class="container">
        <div class="trust-indicators">
          <div class="trust-item geometric-morph">
            <Shield class="w-8 h-8 crystal-prism" />
            <span>Paiement 100% sécurisé</span>
          </div>
          <div class="trust-item fractal-tessellation">
            <Truck class="w-8 h-8 orbital-sphere" />
            <span>Livraison gratuite dès 50€</span>
          </div>
          <div class="trust-item advanced-hologram">
            <RotateCcw class="w-8 h-8 magic-cube" />
            <span>Retour gratuit 30 jours</span>
          </div>
          <div class="trust-item dimensional-portal">
            <Headphones class="w-8 h-8 dna-helix" />
            <span>Support client 24/7</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section avec animations 3D -->
    <section class="features" ref="featuresSection">
      <div class="container">
        <div class="section-header spectacular-entrance">
          <h2 class="section-title temporal-vortex">Pourquoi nous choisir ?</h2>
          <p class="section-subtitle">Des avantages exclusifs pour une expérience d'achat exceptionnelle</p>
        </div>
        <div class="features-grid">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="feature-card stagger-item hover-lift quantum-levitation"
            :style="{ animationDelay: `${index * 0.3}s` }"
          >
            <div class="feature-icon dimensional-portal">
              <component :is="feature.icon" class="w-8 h-8 advanced-hologram" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-number magic-cube">{{ String(index + 1).padStart(2, '0') }}</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Categories Showcase avec animations 3D -->
    <section class="categories-showcase">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title fractal-tessellation">Explorez nos catégories</h2>
          <p class="section-subtitle">Trouvez exactement ce que vous cherchez</p>
        </div>
        
        <div class="categories-grid">
          <div 
            v-for="category in activeCategories"
            :key="category.id"
            class="category-card hover-lift geometric-morph"
            @click="$router.push(`/products?category=${category.slug}`)"
          >
            <div class="category-image">
              <img :src="category.image" :alt="category.name" />
              <div class="category-overlay advanced-hologram">
                <h3 class="category-name">{{ category.name }}</h3>
                <p class="category-count">{{ category.productsCount }} produits</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Featured Products avec animations 3D -->
    <section class="featured-products">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title orbital-sphere">Produits vedettes</h2>
          <p class="section-subtitle">Notre sélection des meilleurs produits</p>
          <RouterLink to="/products" class="view-all-link crystal-prism">
            Voir tout
            <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
        
        <div class="products-grid">
          <div 
            v-for="(product, index) in featuredProducts"
            :key="product.id"
            class="product-wrapper product-3d-container"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <!-- Éléments 3D flottants autour des produits -->
            <div class="product-3d-elements">
              <div class="product-cube-float" :style="{ animationDelay: `${index * 0.5}s` }"></div>
              <div class="product-sphere-orbit" :style="{ animationDelay: `${index * 0.7}s` }"></div>
              <div class="product-prism-morph" :style="{ animationDelay: `${index * 0.3}s` }"></div>
            </div>
            
            <ProductCard 
              :product="product"
              @quick-view="openQuickView"
              @update:product="updateProduct"
              class="product-card-3d"
            />
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials avec animations 3D -->
    <section class="testimonials">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title temporal-vortex">Ce que disent nos clients</h2>
          <p class="section-subtitle">Des avis authentiques de notre communauté</p>
        </div>
        
        <div class="testimonials-grid">
          <div 
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="testimonial-card stagger-item dimensional-portal"
            :style="{ animationDelay: `${index * 0.4}s` }"
          >
            <div class="testimonial-content">
              <div class="quote-icon fractal-tessellation">
                <Quote class="w-6 h-6" />
              </div>
              <p class="testimonial-text">{{ testimonial.text }}</p>
            </div>
            <div class="testimonial-author">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="author-avatar advanced-hologram" />
              <div class="author-info">
                <h4 class="author-name">{{ testimonial.name }}</h4>
                <p class="author-role">{{ testimonial.role }}</p>
              </div>
              <div class="testimonial-rating">
                <Star 
                  v-for="i in testimonial.rating" 
                  :key="i"
                  class="w-4 h-4 text-yellow-400 fill-current orbital-sphere"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Newsletter Section avec animations 3D -->
    <section class="newsletter">
      <div class="container">
        <div class="newsletter-content quantum-levitation">
          <div class="newsletter-icon temporal-vortex">
            <Mail class="w-12 h-12 dimensional-portal" />
          </div>
          <h3 class="newsletter-title geometric-morph">Restez connecté</h3>
          <p class="newsletter-description">
            Recevez nos dernières offres exclusives, nouveautés et conseils directement dans votre boîte mail
          </p>
          
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input 
              v-model="email"
              type="email" 
              placeholder="Votre adresse email"
              class="newsletter-input advanced-hologram"
              required
            />
            <AnimatedButton 
              type="submit"
              variant="primary"
              :loading="subscribing"
              class="fractal-tessellation"
            >
              S'abonner
            </AnimatedButton>
          </form>
          
          <div class="newsletter-benefits">
            <div class="benefit-item">
              <Check class="w-4 h-4 crystal-prism" />
              <span>Offres exclusives</span>
            </div>
            <div class="benefit-item">
              <Check class="w-4 h-4 magic-cube" />
              <span>Nouveautés en avant-première</span>
            </div>
            <div class="benefit-item">
              <Check class="w-4 h-4 orbital-sphere" />
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

const getEnergyParticleStyle = (index: number) => {
  const delay = Math.random() * 8
  const duration = 6 + Math.random() * 4
  const left = Math.random() * 100
  const size = 3 + Math.random() * 6
  const hue = Math.random() * 360
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    background: `radial-gradient(circle, hsl(${hue}, 70%, 60%) 0%, transparent 70%)`
  }
}

const getFloatingCardPosition = (index: number) => {
  const positions = [
    { top: '10%', left: '-25%' },
    { top: '60%', right: '-35%' },
    { bottom: '15%', left: '-15%' }
  ]
  return positions[index] || positions[0]
}

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const openQuickView = (product: Product) => {
  console.log('Quick view:', product)
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
  
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log('Newsletter subscription:', email.value)
  email.value = ''
  subscribing.value = false
}

const handlePhotoClick = (productType: string) => {
  console.log(`Photo clicked: ${productType}`)
  // Animation de clic avec effet d'explosion
  const event = new CustomEvent('photoClick', { detail: productType })
  document.dispatchEvent(event)
}

const handlePhotoHover = (productType: string) => {
  console.log(`Photo hovered: ${productType}`)
  // Animation de hover avec effet de glow
}
</script>

<style scoped>
.home {
  overflow-x: hidden;
  perspective: 2000px;
  transform-style: preserve-3d;
}

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 25%,
    #f093fb 50%,
    #f5576c 75%,
    #4facfe 100%
  );
  color: white;
  overflow: hidden;
  perspective: 2000px;
  transform-style: preserve-3d;
}

.hero-background {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.energy-field {
  position: absolute;
  inset: 0;
  overflow: hidden;
  transform-style: preserve-3d;
}

.floating-3d-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform-style: preserve-3d;
  z-index: 1;
}

.floating-3d-elements > div {
  position: absolute;
  transform-style: preserve-3d;
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
  transform-style: preserve-3d;
}

.hero-title {
  font-size: var(--font-size-5xl);
  font-weight: 700;
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-6);
  color: white;
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  transform-style: preserve-3d;
}

.gradient-text {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.8));
  display: inline-block;
  transform-style: preserve-3d;
}

.hero-description {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-8);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
}

.hero-stats {
  display: flex;
  gap: var(--space-8);
  margin-bottom: var(--space-8);
  transform-style: preserve-3d;
}

.stat-item {
  text-align: center;
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-xl);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transform-style: preserve-3d;
}

.stat-number {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: white;
  margin-bottom: var(--space-1);
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: rgba(255, 255, 255, 0.8);
}

.hero-actions {
  display: flex;
  gap: var(--space-4);
  transform-style: preserve-3d;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transform-style: preserve-3d;
}

.hero-image-container {
  position: relative;
  max-width: 500px;
  transform-style: preserve-3d;
}

.floating-cards {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform-style: preserve-3d;
}

.floating-card {
  position: absolute;
  width: 140px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--border-radius-xl);
  padding: var(--space-3);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transform-style: preserve-3d;
  box-shadow: 
    0 0 30px rgba(255, 255, 255, 0.3),
    inset 0 0 20px rgba(255, 255, 255, 0.1);
}

.floating-card img {
  width: 100%;
  height: 70px;
  object-fit: cover;
  border-radius: var(--border-radius-md);
  margin-bottom: var(--space-2);
}

.card-info h4 {
  font-size: var(--font-size-xs);
  font-weight: 600;
  margin-bottom: var(--space-1);
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.card-info p {
  font-size: var(--font-size-xs);
  color: #f093fb;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(240, 147, 251, 0.8);
}

.hero-image {
  width: 100%;
  height: auto;
  border-radius: var(--border-radius-2xl);
  box-shadow: 
    0 0 60px rgba(255, 255, 255, 0.4),
    0 30px 60px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
}

.excellence-photos-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform-style: preserve-3d;
  z-index: 1;
}

.juice-photo {
  position: absolute;
  width: 200px;
  height: 140px;
  border-radius: 20px;
  overflow: hidden;
  transform-style: preserve-3d;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 3px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(139, 92, 246, 0.4);
}

.juice-photo:hover {
  transform: perspective(1000px) rotateX(15deg) rotateY(15deg) translateZ(50px) scale(1.1);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(139, 92, 246, 0.8);
  border-color: rgba(255, 255, 255, 0.6);
}

.juice-photo:active {
  transform: perspective(1000px) rotateX(25deg) rotateY(25deg) translateZ(30px) scale(0.95);
  transition: all 0.1s ease-out;
}

.juice-photo:nth-child(1) {
  top: 10%;
  left: -25%;
}

.juice-photo:nth-child(2) {
  top: 30%;
  right: -30%;
}

.juice-photo:nth-child(3) {
  bottom: 40%;
  left: -20%;
}

.juice-photo:nth-child(4) {
  bottom: 20%;
  right: -25%;
}

.juice-photo:nth-child(5) {
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
}

.juice-photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
}

.juice-photo:hover .juice-photo-img {
  transform: scale(1.2) rotate(2deg);
  filter: brightness(1.1) contrast(1.1) saturate(1.2);
}

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, 
    rgba(0, 0, 0, 0.9) 0%, 
    rgba(139, 92, 246, 0.3) 50%,
    transparent 100%
  );
  padding: var(--space-3);
  color: white;
  transform: translateY(80%);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  backdrop-filter: blur(10px);
}

.juice-photo:hover .photo-overlay {
  transform: translateY(0);
}

.photo-label {
  display: block;
  font-weight: 600;
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-1);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.photo-price {
  display: block;
  font-weight: 700;
  background: linear-gradient(45deg, #f093fb, #f5576c, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: var(--font-size-sm);
  text-shadow: 0 0 15px rgba(240, 147, 251, 0.8);
}

.photo-glow {
  position: absolute;
  inset: -5px;
  background: linear-gradient(45deg, 
    rgba(139, 92, 246, 0.6) 0%,
    rgba(59, 130, 246, 0.6) 25%,
    rgba(16, 185, 129, 0.6) 50%,
    rgba(245, 158, 11, 0.6) 75%,
    rgba(239, 68, 68, 0.6) 100%
  );
  border-radius: 25px;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
  filter: blur(15px);
}

.juice-photo:hover .photo-glow {
  opacity: 1;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

.decoration-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform-style: preserve-3d;
}

.deco-ring {
  position: absolute;
  top: 15%;
  right: 10%;
  width: 100px;
  height: 100px;
  border: 4px solid rgba(139, 92, 246, 0.6);
  border-radius: 50%;
  border-top-color: rgba(139, 92, 246, 1);
  border-right-color: rgba(59, 130, 246, 0.8);
}

.deco-triangle {
  position: absolute;
  bottom: 25%;
  right: 5%;
  width: 0;
  height: 0;
  border-left: 35px solid transparent;
  border-right: 35px solid transparent;
  border-bottom: 60px solid rgba(16, 185, 129, 0.6);
  filter: drop-shadow(0 0 20px rgba(16, 185, 129, 0.8));
}

.deco-hexagon {
  position: absolute;
  top: 40%;
  left: -15%;
  width: 80px;
  height: 80px;
  background: rgba(245, 158, 11, 0.5);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  border: 3px solid rgba(245, 158, 11, 0.8);
  filter: drop-shadow(0 0 25px rgba(245, 158, 11, 0.9));
}

.deco-diamond {
  position: absolute;
  top: 70%;
  left: 60%;
  width: 60px;
  height: 60px;
  background: rgba(239, 68, 68, 0.6);
  transform: rotate(45deg);
  border: 2px solid rgba(239, 68, 68, 0.8);
  filter: drop-shadow(0 0 20px rgba(239, 68, 68, 0.9));
}

.deco-spiral {
  position: absolute;
  bottom: 50%;
  right: 40%;
  width: 70px;
  height: 70px;
  background: conic-gradient(from 0deg, 
    rgba(139, 92, 246, 0.8) 0deg,
    rgba(59, 130, 246, 0.6) 120deg,
    rgba(16, 185, 129, 0.8) 240deg,
    rgba(139, 92, 246, 0.8) 360deg
  );
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.trust-section {
  padding: var(--space-12) 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-gray-200);
  transform-style: preserve-3d;
}

.trust-indicators {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
  transform-style: preserve-3d;
}

.trust-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
  color: var(--color-gray-600);
  padding: var(--space-6);
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--border-radius-xl);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transform-style: preserve-3d;
}

.trust-item svg {
  color: var(--color-primary);
  filter: drop-shadow(0 0 10px rgba(139, 92, 246, 0.5));
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
  transform-style: preserve-3d;
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-8);
  color: var(--color-gray-900);
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.3);
  transform-style: preserve-3d;
}

.section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.features {
  padding: var(--space-20) 0;
  background: linear-gradient(135deg, 
    rgba(249, 250, 251, 0.9) 0%,
    rgba(243, 244, 246, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  perspective: 2000px;
  transform-style: preserve-3d;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
  transform-style: preserve-3d;
}

.feature-card {
  text-align: center;
  padding: var(--space-8);
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.2);
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

.feature-card:hover {
  transform: perspective(1000px) rotateX(15deg) rotateY(15deg) translateZ(30px);
  box-shadow: 
    0 0 50px rgba(139, 92, 246, 0.4),
    0 30px 60px rgba(0, 0, 0, 0.2);
}

.feature-icon {
  width: 100px;
  height: 100px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
  color: white;
  position: relative;
  z-index: 2;
  transform-style: preserve-3d;
  box-shadow: 
    0 0 40px rgba(139, 92, 246, 0.5),
    0 20px 40px rgba(139, 92, 246, 0.3);
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
  width: 40px;
  height: 40px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(139, 92, 246, 0.3);
}

.categories-showcase {
  padding: var(--space-20) 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  transform-style: preserve-3d;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  transform-style: preserve-3d;
}

.category-card {
  cursor: pointer;
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  transition: all var(--transition-normal);
  transform-style: preserve-3d;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.category-card:hover {
  transform: perspective(1000px) rotateX(10deg) rotateY(10deg) translateZ(20px);
  box-shadow: 
    0 0 40px rgba(139, 92, 246, 0.3),
    0 20px 40px rgba(0, 0, 0, 0.2);
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
  transform: scale(1.1) rotateZ(2deg);
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
  backdrop-filter: blur(10px);
}

.category-name {
  font-size: var(--font-size-xl);
  font-weight: 600;
  margin-bottom: var(--space-2);
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

.category-count {
  font-size: var(--font-size-sm);
  opacity: 0.9;
}

.featured-products {
  padding: var(--space-20) 0;
  background: linear-gradient(135deg, 
    rgba(249, 250, 251, 0.9) 0%,
    rgba(243, 244, 246, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  transform-style: preserve-3d;
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
  transform-style: preserve-3d;
}

.view-all-link:hover {
  gap: var(--space-3);
  transform: translateZ(10px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  transform-style: preserve-3d;
}

.product-wrapper {
  transform-style: preserve-3d;
}

.product-3d-container {
  position: relative;
  transform-style: preserve-3d;
}

.product-3d-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transform-style: preserve-3d;
  z-index: 1;
}

.product-cube-float {
  position: absolute;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.6));
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  animation: productCubeFloat 8s ease-in-out infinite;
  transform-style: preserve-3d;
}

.product-sphere-orbit {
  position: absolute;
  top: -15px;
  right: -15px;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.8), rgba(6, 95, 70, 0.4));
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px);
  animation: productSphereOrbit 10s linear infinite;
  transform-style: preserve-3d;
}

.product-prism-morph {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.8), rgba(239, 68, 68, 0.6));
  border: 2px solid rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(15px);
  animation: productPrismMorph 12s ease-in-out infinite;
  transform-style: preserve-3d;
}

.product-card-3d {
  position: relative;
  z-index: 2;
  transform-style: preserve-3d;
  transition: all var(--transition-normal);
}

.product-card-3d:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(20px);
}

/* Animations spécifiques pour les produits */
@keyframes productCubeFloat {
  0% {
    transform: perspective(800px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px);
  }
  33% {
    transform: perspective(800px) rotateX(120deg) rotateY(120deg) rotateZ(120deg) translateZ(30px);
  }
  66% {
    transform: perspective(800px) rotateX(240deg) rotateY(240deg) rotateZ(240deg) translateZ(15px);
  }
  100% {
    transform: perspective(800px) rotateX(360deg) rotateY(360deg) rotateZ(360deg) translateZ(0px);
  }
}

@keyframes productSphereOrbit {
  0% {
    transform: perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1);
  }
  25% {
    transform: perspective(600px) rotateX(90deg) rotateY(90deg) translateZ(40px) scale(1.2);
  }
  50% {
    transform: perspective(600px) rotateX(180deg) rotateY(180deg) translateZ(60px) scale(0.8);
  }
  75% {
    transform: perspective(600px) rotateX(270deg) rotateY(270deg) translateZ(30px) scale(1.1);
  }
  100% {
    transform: perspective(600px) rotateX(360deg) rotateY(360deg) translateZ(0px) scale(1);
  }
}

@keyframes productPrismMorph {
  0% {
    transform: perspective(700px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translateZ(0px);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
  25% {
    transform: perspective(700px) rotateX(90deg) rotateY(90deg) rotateZ(90deg) translateZ(25px);
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  }
  50% {
    transform: perspective(700px) rotateX(180deg) rotateY(180deg) rotateZ(180deg) translateZ(40px);
    clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
  }
  75% {
    transform: perspective(700px) rotateX(270deg) rotateY(270deg) rotateZ(270deg) translateZ(20px);
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  }
  100% {
    transform: perspective(700px) rotateX(360deg) rotateY(360deg) rotateZ(360deg) translateZ(0px);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
}

.testimonials {
  padding: var(--space-20) 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  transform-style: preserve-3d;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-8);
  transform-style: preserve-3d;
}

.testimonial-card {
  background: rgba(249, 250, 251, 0.8);
  border-radius: var(--border-radius-xl);
  padding: var(--space-8);
  transition: all var(--transition-normal);
  transform-style: preserve-3d;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.testimonial-card:hover {
  transform: perspective(1000px) rotateX(5deg) rotateY(5deg) translateZ(15px);
  box-shadow: 
    0 0 40px rgba(139, 92, 246, 0.3),
    0 20px 40px rgba(0, 0, 0, 0.1);
}

.testimonial-content {
  position: relative;
  margin-bottom: var(--space-6);
}

.quote-icon {
  position: absolute;
  top: -15px;
  left: -15px;
  width: 50px;
  height: 50px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transform-style: preserve-3d;
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
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
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(139, 92, 246, 0.3);
  transform-style: preserve-3d;
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
  background: linear-gradient(135deg, 
    #667eea 0%, 
    #764ba2 25%,
    #f093fb 50%,
    #f5576c 75%,
    #4facfe 100%
  );
  color: white;
  transform-style: preserve-3d;
}

.newsletter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  transform-style: preserve-3d;
}

.newsletter-icon {
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--border-radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
  backdrop-filter: blur(20px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  transform-style: preserve-3d;
  box-shadow: 
    0 0 50px rgba(255, 255, 255, 0.3),
    inset 0 0 30px rgba(255, 255, 255, 0.1);
}

.newsletter-title {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-4);
  text-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
}

.newsletter-description {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-8);
  opacity: 0.9;
  line-height: var(--line-height-relaxed);
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

.newsletter-form {
  display: flex;
  gap: var(--space-4);
  max-width: 400px;
  margin: 0 auto;
  margin-bottom: var(--space-8);
  transform-style: preserve-3d;
}

.newsletter-input {
  flex: 1;
  padding: var(--space-4);
  border: none;
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  background: rgba(255, 255, 255, 0.15);
  color: white;
  backdrop-filter: blur(15px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transform-style: preserve-3d;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.newsletter-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
}

.newsletter-benefits {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
  flex-wrap: wrap;
  transform-style: preserve-3d;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  opacity: 0.9;
  padding: var(--space-2) var(--space-4);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  
  .floating-cards,
  .floating-3d-elements,
  .decoration-elements,
  .excellence-photos-container {
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
  .trust-indicators,
  .features-grid,
  .categories-grid,
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>