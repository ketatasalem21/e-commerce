<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-animation">
        <div class="error-number liquid-float">
          <span class="digit morph-scale">4</span>
          <span class="digit glow-pulse">0</span>
          <span class="digit liquid-float">4</span>
        </div>
        <div class="error-particles">
          <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>
      
      <div class="error-content">
        <h1 class="error-title text-reveal">
          <span>Page</span> <span>non</span> <span>trouvée</span>
        </h1>
        <p class="error-description">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div class="error-actions">
          <AnimatedButton 
            variant="primary" 
            size="lg"
            @click="$router.push('/')"
            class="home-btn hover-magnetic"
          >
            <Home class="w-5 h-5" />
            Retour à l'accueil
          </AnimatedButton>
          
          <AnimatedButton 
            variant="secondary" 
            size="lg"
            @click="$router.back()"
            class="back-btn hover-magnetic"
          >
            <ArrowLeft class="w-5 h-5" />
            Page précédente
          </AnimatedButton>
        </div>
        
        <div class="helpful-links">
          <h3>Liens utiles :</h3>
          <div class="links-grid">
            <RouterLink to="/products" class="helpful-link hover-lift">
              <ShoppingBag class="w-5 h-5" />
              <span>Nos produits</span>
            </RouterLink>
            <RouterLink to="/cart" class="helpful-link hover-lift">
              <ShoppingCart class="w-5 h-5" />
              <span>Mon panier</span>
            </RouterLink>
            <RouterLink to="/profile" class="helpful-link hover-lift">
              <User class="w-5 h-5" />
              <span>Mon compte</span>
            </RouterLink>
            <a href="#" class="helpful-link hover-lift">
              <HelpCircle class="w-5 h-5" />
              <span>Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home, ArrowLeft, ShoppingBag, ShoppingCart, User, HelpCircle } from 'lucide-vue-next'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const getParticleStyle = (index: number) => {
  const delay = Math.random() * 4
  const duration = 3 + Math.random() * 2
  const left = Math.random() * 100
  const size = 2 + Math.random() * 6
  
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`
  }
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    var(--color-gray-50) 0%, 
    var(--color-gray-100) 100%
  );
  position: relative;
  overflow: hidden;
}

.error-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 70%, 
    rgba(139, 92, 246, 0.1) 0%, 
    transparent 50%
  );
}

.error-container {
  max-width: 800px;
  padding: var(--space-8);
  text-align: center;
  position: relative;
  z-index: 2;
}

.error-animation {
  position: relative;
  margin-bottom: var(--space-12);
}

.error-number {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.digit {
  font-size: 8rem;
  font-weight: 900;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 50px rgba(139, 92, 246, 0.3);
  display: inline-block;
}

.error-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.error-content {
  max-width: 600px;
  margin: 0 auto;
}

.error-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  margin-bottom: var(--space-6);
  color: var(--color-gray-900);
}

.error-title span {
  display: inline-block;
  animation-delay: calc(var(--i, 0) * 0.1s);
}

.error-description {
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--space-8);
}

.error-actions {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  margin-bottom: var(--space-12);
}

.helpful-links {
  text-align: left;
}

.helpful-links h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-6);
  color: var(--color-gray-900);
  text-align: center;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.helpful-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-6);
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  text-decoration: none;
  color: var(--color-gray-700);
  font-weight: 500;
  transition: all var(--transition-normal);
}

.helpful-link:hover {
  color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .digit {
    font-size: 6rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .digit {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: var(--font-size-2xl);
  }
  
  .error-description {
    font-size: var(--font-size-base);
  }
}
</style>