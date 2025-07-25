<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/20"></div>
    <div class="relative z-10 w-full max-w-md">
      <div class="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <!-- User Avatar -->
        <div class="text-center mb-8">
          <div class="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User class="w-12 h-12 text-white" />
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p class="text-white/70">Enter your password to unlock</p>
        </div>

        <!-- Unlock Form -->
        <form @submit.prevent="handleUnlock" class="space-y-6">
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          <AnimatedButton
            type="submit"
            :loading="isLoading"
            class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <template #icon>
              <Unlock class="w-5 h-5" />
            </template>
            Unlock
          </AnimatedButton>
        </form>

        <!-- Additional Options -->
        <div class="mt-8 text-center space-y-4">
          <button
            @click="switchUser"
            class="text-white/70 hover:text-white transition-colors duration-200 text-sm"
          >
            Switch User
          </button>
          
          <div class="flex items-center justify-center space-x-4 text-sm text-white/50">
            <span class="flex items-center">
              <Clock class="w-4 h-4 mr-1" />
              {{ currentTime }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, Unlock, Clock } from 'lucide-vue-next'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const router = useRouter()
const password = ref('')
const isLoading = ref(false)
const currentTime = ref('')

let timeInterval: NodeJS.Timeout

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const handleUnlock = async () => {
  if (!password.value.trim()) return
  
  isLoading.value = true
  
  try {
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In a real app, you would validate the password here
    if (password.value === 'password') {
      router.push('/')
    } else {
      // Show error - in a real app you'd have proper error handling
      alert('Invalid password')
    }
  } catch (error) {
    console.error('Unlock failed:', error)
  } finally {
    isLoading.value = false
  }
}

const switchUser = () => {
  router.push('/auth/login')
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>