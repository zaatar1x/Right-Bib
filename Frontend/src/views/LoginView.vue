<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <img src="/assets/images/LOGO_maktaba.png" alt="Maktaba" class="auth-logo">
        <h1 class="auth-title">Welcome Back</h1>
        <p class="auth-subtitle">Sign in to your account</p>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email or Username</label>
            <input 
              v-model="form.identifiant" 
              type="text" 
              class="input"
              placeholder="Enter your email or username"
              required
            >
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input 
              v-model="form.password" 
              type="password" 
              class="input"
              placeholder="Enter your password"
              required
            >
          </div>

          <p v-if="error" class="error-message">{{ error }}</p>

          <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <p class="auth-footer">
          Don't have an account? 
          <router-link to="/signup" class="auth-link">Sign up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  identifiant: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''

  try {
    await authStore.signin(form.value.identifiant, form.value.password)
    router.replace('/books')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Invalid credentials'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--gradient-hero);
  position: relative;
  overflow: hidden;
}

.auth-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
}

.auth-container {
  width: 100%;
  max-width: 460px;
  position: relative;
  z-index: 1;
}

.auth-card {
  background: var(--card);
  border-radius: 1.5rem;
  padding: 3rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideUp 0.6s ease-out;
}

.auth-logo {
  height: 56px;
  margin: 0 auto 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-full {
  width: 100%;
  justify-content: center;
  padding: 1rem;
  font-size: 1rem;
}

.error-message {
  color: var(--error);
  font-size: 0.875rem;
  text-align: center;
  padding: 0.875rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 0.75rem;
  font-weight: 500;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.9375rem;
  color: var(--text-secondary);
}

.auth-link {
  color: var(--primary);
  font-weight: 700;
  transition: color 0.3s;
}

.auth-link:hover {
  color: var(--secondary);
  text-decoration: underline;
}

@media (max-width: 768px) {
  .auth-card {
    padding: 2rem;
  }
  
  .auth-title {
    font-size: 1.75rem;
  }
}
</style>
