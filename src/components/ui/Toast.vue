<template>
  <Teleport to="body">
    <Transition name="toast" appear>
      <div 
        v-if="visible"
        :class="[
          'toast',
          `toast-${type}`
        ]"
      >
        <div class="toast-icon">
          <CheckCircle v-if="type === 'success'" class="w-5 h-5" />
          <AlertCircle v-else-if="type === 'error'" class="w-5 h-5" />
          <Info v-else-if="type === 'info'" class="w-5 h-5" />
          <AlertTriangle v-else class="w-5 h-5" />
        </div>
        
        <div class="toast-content">
          <div class="toast-title">{{ title }}</div>
          <div v-if="message" class="toast-message">{{ message }}</div>
        </div>
        
        <button @click="close" class="toast-close">
          <X class="w-4 h-4" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-vue-next'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 4000
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

const close = () => {
  visible.value = false
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => close(), props.duration)
  }
})
</script>

<style scoped>
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 400px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border-left: 4px solid var(--toast-color);
}

.toast-success {
  --toast-color: var(--color-success);
}

.toast-error {
  --toast-color: var(--color-error);
}

.toast-warning {
  --toast-color: var(--color-warning);
}

.toast-info {
  --toast-color: var(--color-secondary);
}

.toast-icon {
  color: var(--toast-color);
  margin-top: 2px;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 4px;
}

.toast-message {
  font-size: 14px;
  color: var(--color-gray-600);
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s var(--ease-out-back);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
</style>