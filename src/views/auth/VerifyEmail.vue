<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
        <div class="text-center">
          <div class="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Mail class="h-6 w-6 text-green-600" />
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            <span class="inline-block animate-text-reveal">Verify Your Email</span>
          </h2>
          <p class="text-gray-600 mb-6">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>
        </div>

        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center">
              <Info class="h-5 w-5 text-blue-600 mr-2" />
              <p class="text-sm text-blue-800">
                Didn't receive the email? Check your spam folder or click resend below.
              </p>
            </div>
          </div>

          <button
            @click="resendEmail"
            :disabled="isResending || countdown > 0"
            class="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <RefreshCw v-if="isResending" class="animate-spin -ml-1 mr-2 h-4 w-4" />
            <span v-if="countdown > 0">Resend in {{ countdown }}s</span>
            <span v-else-if="isResending">Sending...</span>
            <span v-else>Resend Verification Email</span>
          </button>

          <div class="text-center">
            <router-link
              to="/auth/login"
              class="text-sm text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Mail, Info, RefreshCw } from 'lucide-vue-next'

const isResending = ref(false)
const countdown = ref(0)
let countdownInterval: number | null = null

const resendEmail = async () => {
  if (isResending.value || countdown.value > 0) return
  
  isResending.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Start countdown
    countdown.value = 60
    startCountdown()
    
    // Show success message (you can implement toast notifications here)
    console.log('Verification email sent successfully')
  } catch (error) {
    console.error('Failed to resend verification email:', error)
  } finally {
    isResending.value = false
  }
}

const startCountdown = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
  
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval!)
      countdownInterval = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
@keyframes text-reveal {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-text-reveal {
  animation: text-reveal 0.6s ease-out;
}
</style>