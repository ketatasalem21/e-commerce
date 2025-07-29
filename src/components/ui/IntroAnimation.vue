<template>
  <div v-if="showIntro" class="intro-overlay">
    <!-- Background with particles -->
    <div class="intro-background">
      <div class="particles-container">
        <div v-for="i in 100" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- Main intro content -->
    <div class="intro-content">
      <!-- Logo animation -->
      <div class="logo-container">
        <div class="logo-wrapper">
          <!-- Animated logo parts -->
          <div class="logo-cube">
            <div class="cube-face front">
              <ShoppingBag class="w-16 h-16" />
            </div>
            <div class="cube-face back">
              <ShoppingBag class="w-16 h-16" />
            </div>
            <div class="cube-face right">
              <ShoppingBag class="w-16 h-16" />
            </div>
            <div class="cube-face left">
              <ShoppingBag class="w-16 h-16" />
            </div>
            <div class="cube-face top">
              <ShoppingBag class="w-16 h-16" />
            </div>
            <div class="cube-face bottom">
              <ShoppingBag class="w-16 h-16" />
            </div>
          </div>
          
          <!-- Glowing rings -->
          <div class="glow-ring ring-1"></div>
          <div class="glow-ring ring-2"></div>
          <div class="glow-ring ring-3"></div>
        </div>
      </div>

      <!-- Brand name animation -->
      <div class="brand-container">
        <h1 class="brand-text">
          <span v-for="(letter, index) in brandLetters" 
                :key="index" 
                class="brand-letter"
                :style="{ animationDelay: `${1.5 + index * 0.1}s` }">
            {{ letter }}
          </span>
        </h1>
        <div class="brand-subtitle">
          <span class="subtitle-text">Votre boutique premium</span>
        </div>
      </div>

      <!-- Loading progress -->
      <div class="loading-container">
        <div class="loading-bar">
          <div class="loading-fill" :style="{ width: `${loadingProgress}%` }"></div>
        </div>
        <div class="loading-text">{{ loadingText }}</div>
      </div>

      <!-- Energy waves -->
      <div class="energy-waves">
        <div class="wave wave-1"></div>
        <div class="wave wave-2"></div>
        <div class="wave wave-3"></div>
      </div>
    </div>

    <!-- Skip button -->
    <button @click="skipIntro" class="skip-button">
      <span>Passer</span>
      <ChevronRight class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ShoppingBag, ChevronRight } from 'lucide-vue-next'

const emit = defineEmits<{
  complete: []
}>()

const showIntro = ref(true)
const loadingProgress = ref(0)
const loadingText = ref('Initialisation...')
const brandLetters = 'ELITESTORE'.split('')

const loadingSteps = [
  { progress: 20, text: 'Chargement des produits...' },
  { progress: 40, text: 'Configuration du panier...' },
  { progress: 60, text: 'Préparation de l\'interface...' },
  { progress: 80, text: 'Optimisation des performances...' },
  { progress: 100, text: 'Prêt !' }
]

let progressInterval: NodeJS.Timeout
let stepIndex = 0

const getParticleStyle = (index: number) => {
  const delay = Math.random() * 4
  const duration = 3 + Math.random() * 4
  const x = Math.random() * 100
  const y = Math.random() * 100
  const size = 1 + Math.random() * 3
  const hue = Math.random() * 360
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    width: `${size}px`,
    height: `${size}px`,
    background: `hsl(${hue}, 70%, 60%)`
  }
}

const startIntro = () => {
  // Start loading animation
  progressInterval = setInterval(() => {
    if (stepIndex < loadingSteps.length) {
      const step = loadingSteps[stepIndex]
      loadingProgress.value = step.progress
      loadingText.value = step.text
      stepIndex++
    } else {
      clearInterval(progressInterval)
      setTimeout(() => {
        completeIntro()
      }, 1000)
    }
  }, 800)
}

const skipIntro = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
  completeIntro()
}

const completeIntro = () => {
  showIntro.value = false
  emit('complete')
}

onMounted(() => {
  startIntro()
})

onUnmounted(() => {
  if (progressInterval) {
    clearInterval(progressInterval)
  }
})
</script>

<style scoped>
.intro-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(135deg, 
    #0f0f23 0%, 
    #1a1a2e 25%,
    #16213e 50%,
    #0f0f23 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.intro-background {
  position: absolute;
  inset: 0;
}

.particles-container {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: particleFloat 6s ease-in-out infinite;
}

@keyframes particleFloat {
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

.intro-content {
  position: relative;
  text-align: center;
  z-index: 2;
}

.logo-container {
  margin-bottom: 3rem;
  perspective: 1000px;
}

.logo-wrapper {
  position: relative;
  display: inline-block;
  animation: logoEntrance 2s ease-out;
}

@keyframes logoEntrance {
  0% {
    opacity: 0;
    transform: scale(0.3) rotateY(-180deg);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2) rotateY(-90deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotateY(0deg);
  }
}

.logo-cube {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  transform-style: preserve-3d;
  animation: cubeRotate 4s ease-in-out infinite;
}

@keyframes cubeRotate {
  0% {
    transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg);
  }
  33% {
    transform: rotateX(120deg) rotateY(120deg) rotateZ(120deg);
  }
  66% {
    transform: rotateX(240deg) rotateY(240deg) rotateZ(240deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
  }
}

.cube-face {
  position: absolute;
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  backdrop-filter: blur(10px);
}

.cube-face.front { transform: rotateY(0deg) translateZ(60px); }
.cube-face.back { transform: rotateY(180deg) translateZ(60px); }
.cube-face.right { transform: rotateY(90deg) translateZ(60px); }
.cube-face.left { transform: rotateY(-90deg) translateZ(60px); }
.cube-face.top { transform: rotateX(90deg) translateZ(60px); }
.cube-face.bottom { transform: rotateX(-90deg) translateZ(60px); }

.glow-ring {
  position: absolute;
  border: 2px solid transparent;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring-1 {
  width: 160px;
  height: 160px;
  border-color: rgba(139, 92, 246, 0.6);
  animation: ringPulse 2s ease-in-out infinite;
}

.ring-2 {
  width: 200px;
  height: 200px;
  border-color: rgba(59, 130, 246, 0.4);
  animation: ringPulse 2s ease-in-out infinite 0.5s;
}

.ring-3 {
  width: 240px;
  height: 240px;
  border-color: rgba(16, 185, 129, 0.3);
  animation: ringPulse 2s ease-in-out infinite 1s;
}

@keyframes ringPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.5;
  }
}

.brand-container {
  margin-bottom: 3rem;
}

.brand-text {
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  perspective: 1000px;
}

.brand-letter {
  display: inline-block;
  background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 50%, #10B981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: letterReveal 0.8s ease-out both;
  transform-origin: center;
}

@keyframes letterReveal {
  0% {
    opacity: 0;
    transform: rotateY(-90deg) translateZ(-100px) scale(0.5);
    filter: blur(10px);
  }
  50% {
    opacity: 0.7;
    transform: rotateY(-45deg) translateZ(-50px) scale(1.2);
    filter: blur(5px);
  }
  100% {
    opacity: 1;
    transform: rotateY(0deg) translateZ(0px) scale(1);
    filter: blur(0px);
  }
}

.brand-subtitle {
  overflow: hidden;
}

.subtitle-text {
  display: inline-block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  animation: slideUp 1s ease-out 2.5s both;
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-container {
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-out 3s both;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.loading-bar {
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin: 0 auto 1rem;
  overflow: hidden;
}

.loading-fill {
  height: 100%;
  background: linear-gradient(90deg, #8B5CF6 0%, #3B82F6 50%, #10B981 100%);
  border-radius: 2px;
  transition: width 0.8s ease-out;
  position: relative;
}

.loading-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.4) 50%, 
    transparent 100%
  );
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.loading-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-weight: 500;
}

.energy-waves {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.wave {
  position: absolute;
  top: 50%;
  left: 50%;
  border: 2px solid transparent;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.wave-1 {
  width: 400px;
  height: 400px;
  border-color: rgba(139, 92, 246, 0.3);
  animation: waveExpand 3s ease-out infinite;
}

.wave-2 {
  width: 600px;
  height: 600px;
  border-color: rgba(59, 130, 246, 0.2);
  animation: waveExpand 3s ease-out infinite 1s;
}

.wave-3 {
  width: 800px;
  height: 800px;
  border-color: rgba(16, 185, 129, 0.1);
  animation: waveExpand 3s ease-out infinite 2s;
}

@keyframes waveExpand {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

.skip-button {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 2rem;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.skip-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .brand-text {
    font-size: 2.5rem;
  }
  
  .logo-cube {
    width: 80px;
    height: 80px;
  }
  
  .cube-face {
    width: 80px;
    height: 80px;
  }
  
  .cube-face.front { transform: rotateY(0deg) translateZ(40px); }
  .cube-face.back { transform: rotateY(180deg) translateZ(40px); }
  .cube-face.right { transform: rotateY(90deg) translateZ(40px); }
  .cube-face.left { transform: rotateY(-90deg) translateZ(40px); }
  .cube-face.top { transform: rotateX(90deg) translateZ(40px); }
  .cube-face.bottom { transform: rotateX(-90deg) translateZ(40px); }
  
  .loading-bar {
    width: 250px;
  }
}
</style>