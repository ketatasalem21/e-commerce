<template>
  <div class="login-form">
    <div class="form-header">
      <h2 class="form-title">
        Bon retour !
      </h2>
      <p class="form-subtitle">Connectez-vous à votre compte</p>
    </div>
    
    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <div class="input-wrapper">
          <Mail class="input-icon" />
          <input 
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            placeholder="votre@email.com"
            required
          />
        </div>
      </div>
      
      <div class="form-group">
        <label for="password" class="form-label">Mot de passe</label>
        <div class="input-wrapper">
          <Lock class="input-icon" />
          <input 
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            placeholder="••••••••"
            required
          />
          <button 
            type="button"
            @click="showPassword = !showPassword"
            class="password-toggle"
          >
            <Eye v-if="showPassword" class="w-5 h-5" />
            <EyeOff v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div class="form-options">
        <label class="checkbox-wrapper">
          <input v-model="form.rememberMe" type="checkbox" class="checkbox" />
          <span class="checkbox-label">Se souvenir de moi</span>
        </label>
        
        <RouterLink to="/auth/forgot-password" class="forgot-link">
          Mot de passe oublié ?
        </RouterLink>
      </div>
      
      <AnimatedButton 
        type="submit"
        variant="primary"
        size="lg"
        :loading="loading"
        class="submit-btn"
      >
        Se connecter
      </AnimatedButton>
      
      <div class="divider">
        <span>ou</span>
      </div>
      
      <div class="social-login">
        <button type="button" class="social-btn google-btn">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        
        <button type="button" class="social-btn apple-btn">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
          Apple
        </button>
      </div>
      
      <div class="signup-link">
        <span>Pas encore de compte ?</span>
        <RouterLink to="/auth/register" class="link">
          S'inscrire
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { useMainStore } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const router = useRouter()
const store = useMainStore()

const loading = ref(false)
const showPassword = ref(false)

const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Determine user role based on email
    const isAdmin = form.value.email.includes('admin') || form.value.email === 'admin@elitestore.com'
    
    const userData = {
      id: 1,
      firstName: isAdmin ? 'Admin' : 'Jean',
      lastName: isAdmin ? 'EliteStore' : 'Dupont',
      email: form.value.email,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      role: isAdmin ? 'admin' as const : 'customer' as const,
      isVerified: true
    }
    
    store.login(userData)
    
    // Redirect based on role
    if (isAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
    
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-form {
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.form-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.form-subtitle {
  color: var(--color-gray-600);
  font-size: var(--font-size-base);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-weight: 500;
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: var(--space-4);
  width: 20px;
  height: 20px;
  color: var(--color-gray-400);
  z-index: 2;
}

.form-input {
  width: 100%;
  padding: var(--space-4) var(--space-4) var(--space-4) 48px;
  background: white;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  color: var(--color-gray-900);
  font-size: var(--font-size-base);
  transition: all var(--transition-normal);
}

.form-input::placeholder {
  color: var(--color-gray-400);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.password-toggle {
  position: absolute;
  right: var(--space-4);
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--border-radius-sm);
  transition: color var(--transition-fast);
}

.password-toggle:hover {
  color: var(--color-gray-600);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-sm);
  background: white;
  cursor: pointer;
}

.checkbox:checked {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.checkbox-label {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.forgot-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.forgot-link:hover {
  color: var(--color-primary-dark);
}

.submit-btn {
  width: 100%;
  margin-top: var(--space-4);
}

.divider {
  position: relative;
  text-align: center;
  margin: var(--space-6) 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-gray-200);
}

.divider span {
  background: white;
  padding: 0 var(--space-4);
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

.social-login {
  display: flex;
  gap: var(--space-4);
}

.social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: white;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  color: var(--color-gray-700);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.social-btn:hover {
  background: var(--color-gray-50);
  border-color: var(--color-gray-400);
}

.signup-link {
  text-align: center;
  margin-top: var(--space-4);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.signup-link .link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  margin-left: var(--space-2);
  transition: color var(--transition-fast);
}

.signup-link .link:hover {
  color: var(--color-primary-dark);
}
</style>