<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-content">
        <div class="auth-logo">
          <div class="logo-icon">
            <ShoppingBag class="w-12 h-12" />
          </div>
          <h1 class="logo-text">
            EliteStore
          </h1>
        </div>
        
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBag } from 'lucide-vue-next'
import { RouterView } from 'vue-router'

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
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gray-50);
  padding: var(--space-6);
}

.auth-container {
  width: 100%;
  max-width: 450px;
}

.auth-content {
  background: white;
  padding: var(--space-8);
  border-radius: var(--border-radius-2xl);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-gray-200);
}

.auth-logo {
  text-align: center;
  margin-bottom: var(--space-8);
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  border-radius: var(--border-radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-6);
  color: white;
}

.logo-text {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 480px) {
  .auth-content {
    padding: var(--space-6);
  }
}
</style>