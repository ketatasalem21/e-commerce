<template>
  <div class="client-layout">
    <!-- Header -->
    <header class="header">
      <nav class="nav">
        <div class="nav-container">
          <!-- Logo -->
          <RouterLink to="/" class="logo">
            <div class="logo-icon">
              <ShoppingBag class="w-8 h-8" />
            </div>
            <span class="logo-text">EliteStore</span>
          </RouterLink>
          
          <!-- Navigation Links -->
          <div class="nav-links">
            <RouterLink to="/" class="nav-link" :class="{ 'router-link-exact-active': isHomeActive }">Accueil</RouterLink>
            <RouterLink to="/products" class="nav-link" :class="{ 'products-link-active': isProductsActive }">Produits</RouterLink>
          </div>
          
          <!-- Actions -->
          <div class="nav-actions">
            <button class="search-btn">
              <Search class="w-5 h-5" />
            </button>
            
            <RouterLink to="/wishlist" class="wishlist-btn">
              <div class="relative">
                <Heart class="w-5 h-5" />
                <span v-if="wishlistCount > 0" class="wishlist-badge">
                  {{ wishlistCount }}
                </span>
              </div>
            </RouterLink>
            
            <RouterLink to="/cart" class="cart-btn">
              <div class="relative">
                <ShoppingCart class="w-5 h-5" />
                <span v-if="cartItemsCount > 0" class="cart-badge">
                  {{ cartItemsCount }}
                </span>
              </div>
            </RouterLink>
            
            <div v-if="isAuthenticated" class="user-menu">
              <div class="user-dropdown" @click="toggleUserMenu">
                <img 
                  :src="user?.avatar || defaultAvatar" 
                  :alt="user?.firstName"
                  class="user-avatar"
                />
                <ChevronDown class="w-4 h-4" />
              </div>
              
              <div v-if="showUserMenu" class="dropdown-menu">
                <RouterLink to="/profile" class="dropdown-item">
                  <User class="w-4 h-4" />
                  Mon profil
                </RouterLink>
                <RouterLink to="/orders" class="dropdown-item">
                  <Package class="w-4 h-4" />
                  Mes commandes
                </RouterLink>
                <RouterLink to="/wishlist" class="dropdown-item">
                  <Heart class="w-4 h-4" />
                  Mes favoris
                </RouterLink>
                <div class="dropdown-divider"></div>
                <RouterLink v-if="user?.role === 'admin'" to="/admin" class="dropdown-item">
                  <Settings class="w-4 h-4" />
                  Administration
                </RouterLink>
                <button @click="logout" class="dropdown-item logout-btn">
                  <LogOut class="w-4 h-4" />
                  Déconnexion
                </button>
              </div>
            </div>
            
            <div v-else class="auth-buttons">
              <RouterLink to="/auth/login" class="btn btn-secondary btn-sm">
                Connexion
              </RouterLink>
              <RouterLink to="/auth/register" class="btn btn-primary btn-sm">
                S'inscrire
              </RouterLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
    
    <!-- Main Content -->
    <main class="main">
      <RouterView />
    </main>
    
    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-section">
            <h4>EliteStore</h4>
            <p>Votre boutique premium pour les produits d'exception.</p>
          </div>
          
          <div class="footer-section">
            <h5>Liens rapides</h5>
            <div class="footer-links">
              <RouterLink to="/">Accueil</RouterLink>
              <RouterLink to="/products">Produits</RouterLink>
              <RouterLink to="/profile">Profil</RouterLink>
              <RouterLink to="/orders">Commandes</RouterLink>
              <RouterLink to="/wishlist">Favoris</RouterLink>
            </div>
          </div>
          
          <div class="footer-section">
            <h5>Support</h5>
            <div class="footer-links">
              <a href="#">FAQ</a>
              <a href="#">Livraison</a>
              <a href="#">Retours</a>
              <a href="#">Support</a>
            </div>
          </div>
          
          <div class="footer-section">
            <h5>Suivez-nous</h5>
            <div class="social-links">
              <a href="#" class="social-link">
                <Facebook class="w-5 h-5" />
              </a>
              <a href="#" class="social-link">
                <Twitter class="w-5 h-5" />
              </a>
              <a href="#" class="social-link">
                <Instagram class="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2024 EliteStore. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { 
  ShoppingBag, Search, ShoppingCart, Heart, ChevronDown, User, Package, 
  Settings, LogOut, Facebook, Twitter, Instagram 
} from 'lucide-vue-next'
import { useMainStore } from '../stores/main'

const store = useMainStore()
const route = useRoute()

const isHomeActive = computed(() => route.path === '/')
const isProductsActive = computed(() => route.path === '/products')
const cartItemsCount = computed(() => store.cartItemsCount)
const wishlistCount = computed(() => store.wishlistCount)
const isAuthenticated = computed(() => store.isAuthenticated)
const user = computed(() => store.user)

const showUserMenu = ref(false)
const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=8B5CF6&color=fff'

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const logout = () => {
  store.logout()
  showUserMenu.value = false
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu')) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.client-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: white;
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
  z-index: 50;
  backdrop-filter: blur(8px);
}

.nav {
  padding: 0 var(--space-6);
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  color: var(--color-gray-900);
  font-weight: 700;
  font-size: var(--font-size-xl);
}

.logo-icon {
  background: var(--gradient-primary);
  padding: var(--space-2);
  border-radius: var(--border-radius-lg);
  color: white;
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  gap: var(--space-8);
}

.nav-link {
  text-decoration: none;
  color: var(--color-gray-700);
  font-weight: 500;
  padding: var(--space-2) 0;
  position: relative;
  transition: color var(--transition-normal);
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link.router-link-exact-active, .nav-link.products-link-active {
  color: var(--color-primary);
}

.nav-link.router-link-exact-active::after, .nav-link.products-link-active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-full);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.search-btn, .cart-btn, .wishlist-btn {
  background: none;
  border: none;
  color: var(--color-gray-600);
  cursor: pointer;
  padding: var(--space-2);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  text-decoration: none;
  display: flex;
  align-items: center;
}

.search-btn:hover, .cart-btn:hover, .wishlist-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-primary);
}

.cart-badge, .wishlist-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--color-error);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: 600;
  padding: 2px 6px;
  border-radius: var(--border-radius-full);
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 1s ease-in-out infinite;
}

.wishlist-badge {
  background: var(--color-accent);
}

.user-menu {
  position: relative;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.user-dropdown:hover {
  background: var(--color-gray-100);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-gray-200);
  min-width: 200px;
  z-index: 100;
  animation: fadeInUp 0.2s ease;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  text-decoration: none;
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--color-gray-50);
  color: var(--color-primary);
}

.dropdown-item:first-child {
  border-radius: var(--border-radius-xl) var(--border-radius-xl) 0 0;
}

.dropdown-item:last-child {
  border-radius: 0 0 var(--border-radius-xl) var(--border-radius-xl);
}

.dropdown-divider {
  height: 1px;
  background: var(--color-gray-200);
  margin: var(--space-2) 0;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.auth-buttons {
  display: flex;
  gap: var(--space-3);
}

.main {
  flex: 1;
}

.footer {
  background: var(--color-gray-900);
  color: white;
  margin-top: var(--space-20);
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: var(--space-16) var(--space-6) var(--space-8);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-8);
  margin-bottom: var(--space-8);
}

.footer-section h4,
.footer-section h5 {
  margin-bottom: var(--space-4);
  color: white;
}

.footer-section p {
  color: var(--color-gray-400);
  line-height: var(--line-height-relaxed);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.footer-links a {
  color: var(--color-gray-400);
  text-decoration: none;
  transition: color var(--transition-normal);
}

.footer-links a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: var(--space-3);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-gray-800);
  border-radius: var(--border-radius-lg);
  color: var(--color-gray-400);
  text-decoration: none;
  transition: all var(--transition-normal);
}

.social-link:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid var(--color-gray-800);
  padding-top: var(--space-8);
  text-align: center;
  color: var(--color-gray-400);
}

@media (max-width: 768px) {
  .nav-container {
    height: 60px;
  }
  
  .nav-links {
    display: none;
  }
  
  .auth-buttons {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>
