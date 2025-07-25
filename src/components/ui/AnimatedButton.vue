<template>
  <button 
    :class="[
      'btn animated-btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'loading': loading }
    ]"
    :disabled="loading || disabled"
    @click="handleClick"
  >
    <span class="btn-content">
      <slot />
    </span>
    <div class="btn-ripple" ref="rippleRef"></div>
    <div v-if="loading" class="btn-loader">
      <div class="loader-spinner"></div>
    </div>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const rippleRef = ref<HTMLElement>()

const handleClick = (event: MouseEvent) => {
  if (props.loading || props.disabled) return
  
  // Effet ripple
  createRipple(event)
  
  emit('click', event)
}

const createRipple = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const ripple = rippleRef.value
  
  if (!ripple) return
  
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2
  
  ripple.style.width = ripple.style.height = size + 'px'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  ripple.style.transform = 'scale(0)'
  
  ripple.classList.add('ripple-animate')
  
  setTimeout(() => {
    ripple.classList.remove('ripple-animate')
  }, 600)
}
</script>

<style scoped>
.animated-btn {
  position: relative;
  overflow: hidden;
  transform: translateZ(0);
}

.animated-btn:not(.loading):hover {
  animation: pulse 0.6s ease-in-out;
}

.btn-content {
  position: relative;
  z-index: 2;
  transition: transform var(--transition-fast);
}

.animated-btn:active .btn-content {
  transform: scale(0.95);
}

.btn-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  pointer-events: none;
  z-index: 1;
}

.ripple-animate {
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

.btn-loader {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: inherit;
  z-index: 3;
}

.loader-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animated-btn.loading {
  pointer-events: none;
}

.animated-btn.loading .btn-content {
  opacity: 0;
}
</style>