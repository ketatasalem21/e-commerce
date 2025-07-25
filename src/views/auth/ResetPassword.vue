<template>
  <div class="reset-password-form">
    <div class="form-header">
      <h2 class="form-title">
        Nouveau mot de passe
      </h2>
      <p class="form-subtitle">Créez un nouveau mot de passe sécurisé</p>
    </div>
    
    <form @submit.prevent="handleResetPassword" class="auth-form">
      <div class="form-group">
        <label for="password" class="form-label">Nouveau mot de passe</label>
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
        <div class="password-strength">
          <div class="strength-bar">
            <div 
              class="strength-fill"
              :class="passwordStrengthClass"
              :style="{ width: `${passwordStrength}%` }"
            ></div>
          </div>
          <span class="strength-text">{{ passwordStrengthText }}</span>
        </div>
      </div>
      
      <div class="form-group">
        <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
        <div class="input-wrapper">
          <Lock class="input-icon" />
          <input 
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            class="form-input"
            placeholder="••••••••"
            required
          />
        </div>
        <div v-if="form.confirmPassword && !passwordsMatch" class="error-message">
          Les mots de passe ne correspondent pas
        </div>
      </div>
      
      <AnimatedButton 
        type="submit"
        variant="primary"
        size="lg"
        :loading="loading"
        :disabled="!isFormValid"
        class="submit-btn"
      >
        Réinitialiser le mot de passe
      </AnimatedButton>
      
      <div class="back-to-login">
        <span>Retour à la</span>
        <RouterLink to="/auth/login" class="link">
          connexion
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Lock, Eye, EyeOff } from 'lucide-vue-next'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const showPassword = ref(false)

const form = ref({
  password: '',
  confirmPassword: ''
})

const passwordStrength = computed(() => {
  const password = form.value.password
  let strength = 0
  
  if (password.length >= 8) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password)) strength += 25
  if (/[^A-Za-z0-9]/.test(password)) strength += 25
  
  return strength
})

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 25) return 'weak'
  if (passwordStrength.value < 50) return 'fair'
  if (passwordStrength.value < 75) return 'good'
  return 'strong'
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 25) return 'Faible'
  if (passwordStrength.value < 50) return 'Moyen'
  if (passwordStrength.value < 75) return 'Bon'
  return 'Fort'
})

const passwordsMatch = computed(() => {
  return form.value.password === form.value.confirmPassword
})

const isFormValid = computed(() => {
  return form.value.password &&
         form.value.confirmPassword &&
         passwordsMatch.value &&
         passwordStrength.value >= 50
})

const handleResetPassword = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const token = route.query.token
    console.log('Password reset with token:', token)
    
    // Redirect to login with success message
    router.push('/auth/login')
    
  } catch (error) {
    console.error('Password reset failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-password-form {
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
  line-height: var(--line-height-relaxed);
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

.password-strength {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-2);
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--color-gray-200);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: var(--border-radius-full);
  transition: all var(--transition-normal);
}

.strength-fill.weak { background: #ef4444; }
.strength-fill.fair { background: #f59e0b; }
.strength-fill.good { background: #3b82f6; }
.strength-fill.strong { background: #10b981; }

.strength-text {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  min-width: 40px;
}

.error-message {
  color: #ef4444;
  font-size: var(--font-size-sm);
  margin-top: var(--space-1);
}

.submit-btn {
  width: 100%;
  margin-top: var(--space-4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.back-to-login {
  text-align: center;
  margin-top: var(--space-6);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.back-to-login .link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  margin-left: var(--space-2);
  transition: color var(--transition-fast);
}

.back-to-login .link:hover {
  color: var(--color-primary-dark);
}
</style>