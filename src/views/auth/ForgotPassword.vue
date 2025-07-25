<template>
  <div class="forgot-password-form">
    <div class="form-header">
      <h2 class="form-title">
        Mot de passe oublié
      </h2>
      <p class="form-subtitle">Entrez votre email pour recevoir un lien de réinitialisation</p>
    </div>
    
    <form @submit.prevent="handleForgotPassword" class="auth-form">
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
      
      <AnimatedButton 
        type="submit"
        variant="primary"
        size="lg"
        :loading="loading"
        class="submit-btn"
      >
        Envoyer le lien
      </AnimatedButton>
      
      <div class="back-to-login">
        <span>Vous vous souvenez de votre mot de passe ?</span>
        <RouterLink to="/auth/login" class="link">
          Se connecter
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail } from 'lucide-vue-next'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const router = useRouter()

const loading = ref(false)

const form = ref({
  email: ''
})

const handleForgotPassword = async () => {
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Password reset email sent to:', form.value.email)
    
    // Redirect to login with success message
    router.push('/auth/login')
    
  } catch (error) {
    console.error('Failed to send reset email:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.forgot-password-form {
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
  max-width: 400px;
  margin: 0 auto;
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

.submit-btn {
  width: 100%;
  margin-top: var(--space-4);
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
