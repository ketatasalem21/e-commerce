<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-animation">
        <div class="error-number liquid-float">
          <span class="digit morph-scale">5</span>
          <span class="digit glow-pulse">0</span>
          <span class="digit liquid-float">0</span>
        </div>
        <div class="error-particles">
          <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>
      
      <div class="error-content">
        <h1 class="error-title text-reveal">
          <span>Erreur</span> <span>serveur</span>
        </h1>
        <p class="error-description">
          Une erreur interne s'est produite sur le serveur. Nos équipes techniques ont été notifiées et travaillent à résoudre le problème.
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
            @click="refreshPage"
            class="refresh-btn hover-magnetic"
          >
            <RefreshCw class="w-5 h-5" />
            Actualiser
          </AnimatedButton>
        </div>
        
        <div class="helpful-links">
          <h3>Que faire en attendant :</h3>
          <div class="links-grid">
            <RouterLink to="/products" class="helpful-link hover-lift">
              <ShoppingBag class="w-5 h-5" />
              <span>Nos produits</span>
            </RouterLink>
            <RouterLink to="/cart" class="helpful-link hover-lift">
              <ShoppingCart class="w-5 h-5" />
              <span>Mon panier</span>
            </RouterLink>
            <a href="#" class="helpful-link hover-lift">
              <HelpCircle class="w-5 h-5" />
              <span>Support</span>
            </a>
            <a href="#" class="helpful-link hover-lift">
              <MessageCircle class="w-5 h-5" />
              <span>Contact</span>
            </a>
          </div>
        </div>
        
        <div class="error-details">
          <details class="error-technical">
            <summary>Détails techniques</summary>
            <div class="technical-info">
              <p><strong>Code d'erreur:</strong> 500</p>
              <p><strong>Timestamp:</strong> {{ new Date().toISOString() }}</p>
              <p><strong>ID de session:</strong> {{ sessionId }}</p>
            </div>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Home, RefreshCw, ShoppingBag, ShoppingCart, HelpCircle, MessageCircle } from 'lucide-vue-next'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const sessionId = ref(Math.random().toString(36).substr(2, 9))

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

const refreshPage = () => {
  window.location.reload()
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    #ef4444 0%, 
    #dc2626 25%,
    #b91c1c 50%,
    #991b1b 100%
  );
  position: relative;
  overflow: hidden;
}

.error-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 70%, 
    rgba(239, 68, 68, 0.3) 0%, 
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
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 50px rgba(239, 68, 68, 0.3);
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
  color: white;
}

.error-title span {
  display: inline-block;
  animation-delay: calc(var(--i, 0) * 0.1s);
}

.error-description {
  font-size: var(--font-size-lg);
  color: rgba(255, 255, 255, 0.9);
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
  margin-bottom: var(--space-8);
}

.helpful-links h3 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-6);
  color: white;
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-xl);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: all var(--transition-normal);
}

.helpful-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.error-details {
  margin-top: var(--space-8);
}

.error-technical {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-lg);
  padding: var(--space-4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.error-technical summary {
  color: white;
  font-weight: 500;
  cursor: pointer;
  padding: var(--space-2);
}

.technical-info {
  margin-top: var(--space-4);
  padding: var(--space-4);
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius-md);
  text-align: left;
}

.technical-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-2);
  font-family: monospace;
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