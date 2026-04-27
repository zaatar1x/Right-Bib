<template>
  <div class="hero-carousel">
    <div class="carousel-track" ref="trackRef" @mousedown="startDrag" @touchstart="startDrag">
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        class="carousel-slide"
        :class="{ active: index === currentSlide }"
      >
        <div class="slide-content">
          <div class="slide-text">
            <h1 class="slide-title">{{ slide.title }}</h1>
            <p class="slide-subtitle">{{ slide.subtitle }}</p>
            <div class="slide-search">
              <SearchBar @search="handleSearch" />
            </div>
          </div>
          <div class="slide-visual">
            <div class="floating-books">
              <div v-for="i in 3" :key="i" class="book-float" :style="{ animationDelay: `${i * 0.3}s` }">
                <div class="book-spine"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-indicators">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        class="indicator"
        :class="{ active: index === currentSlide }"
      ></button>
    </div>

    <button @click="prevSlide" class="carousel-nav prev">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <button @click="nextSlide" class="carousel-nav next">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBooksStore } from '@/stores/books'
import SearchBar from './SearchBar.vue'

const router = useRouter()
const booksStore = useBooksStore()
const currentSlide = ref(0)
const trackRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)

const slides = [
  {
    title: 'Discover Your Next Great Read',
    subtitle: 'Explore thousands of books across all genres'
  },
  {
    title: 'Build Your Personal Library',
    subtitle: 'Save your favorites and track your reading journey'
  },
  {
    title: 'Join Our Reading Community',
    subtitle: 'Share and discover books loved by readers worldwide'
  }
]

function handleSearch(query: string) {
  booksStore.setFilters({ search: query })
  window.scrollTo({ top: 900, behavior: 'smooth' })
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

function goToSlide(index: number) {
  currentSlide.value = index
}

function startDrag(e: MouseEvent | TouchEvent) {
  isDragging.value = true
  startX.value = 'touches' in e ? e.touches[0].clientX : e.clientX
  
  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging.value) return
    currentX.value = 'touches' in e ? e.touches[0].clientX : e.clientX
    const diff = currentX.value - startX.value
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) prevSlide()
      else nextSlide()
      isDragging.value = false
    }
  }
  
  const handleEnd = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMove as any)
    document.removeEventListener('mouseup', handleEnd)
    document.removeEventListener('touchmove', handleMove as any)
    document.removeEventListener('touchend', handleEnd)
  }
  
  document.addEventListener('mousemove', handleMove as any)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove as any)
  document.addEventListener('touchend', handleEnd)
}

let autoplayInterval: ReturnType<typeof setInterval>

onMounted(() => {
  autoplayInterval = setInterval(nextSlide, 6000)
})

onUnmounted(() => {
  clearInterval(autoplayInterval)
})
</script>

<style scoped>
.hero-carousel {
  position: relative;
  background: var(--gradient-hero);
  overflow: hidden;
  border-radius: 0 0 2rem 2rem;
  margin-bottom: 4rem;
}

.hero-carousel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(100px, 100px); }
}

.carousel-track {
  position: relative;
  height: 600px;
  cursor: grab;
}

.carousel-track:active {
  cursor: grabbing;
}

.carousel-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.carousel-slide.active {
  opacity: 1;
  transform: scale(1);
  pointer-events: all;
}

.slide-content {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.slide-text {
  animation: slideInLeft 0.8s ease-out;
}

.slide-title {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.slide-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 3rem;
  font-weight: 500;
  line-height: 1.6;
}

.slide-search {
  max-width: 600px;
}

.slide-visual {
  position: relative;
  height: 400px;
  animation: slideInRight 0.8s ease-out;
}

.floating-books {
  position: relative;
  width: 100%;
  height: 100%;
}

.book-float {
  position: absolute;
  width: 120px;
  height: 160px;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%);
  border-radius: 0.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: float 6s ease-in-out infinite;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.book-float:nth-child(1) {
  top: 10%;
  left: 20%;
  transform: rotate(-15deg);
}

.book-float:nth-child(2) {
  top: 40%;
  right: 15%;
  transform: rotate(10deg);
  animation-delay: 1s;
}

.book-float:nth-child(3) {
  bottom: 15%;
  left: 40%;
  transform: rotate(-8deg);
  animation-delay: 2s;
}

.book-spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  background: linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
  border-radius: 0.5rem 0 0 0.5rem;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(var(--rotate, 0deg)); }
  50% { transform: translateY(-30px) rotate(calc(var(--rotate, 0deg) + 5deg)); }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.carousel-indicators {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.75rem;
  z-index: 10;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s;
  border: 2px solid transparent;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.2);
}

.indicator.active {
  width: 40px;
  border-radius: 6px;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  z-index: 10;
}

.carousel-nav:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.carousel-nav svg {
  width: 24px;
  height: 24px;
}

.carousel-nav.prev {
  left: 2rem;
}

.carousel-nav.next {
  right: 2rem;
}

@media (max-width: 1024px) {
  .slide-content {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .slide-visual {
    display: none;
  }

  .slide-title {
    font-size: 3rem;
  }

  .slide-subtitle {
    font-size: 1.25rem;
  }

  .slide-search {
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .carousel-track {
    height: 500px;
  }

  .slide-title {
    font-size: 2.25rem;
  }

  .slide-subtitle {
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }

  .carousel-nav {
    width: 44px;
    height: 44px;
  }

  .carousel-nav.prev {
    left: 1rem;
  }

  .carousel-nav.next {
    right: 1rem;
  }
}
</style>
