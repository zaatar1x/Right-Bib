<template>
  <div class="loader">
    <div class="spinner-container">
      <div class="spinner"></div>
      <div class="spinner-glow"></div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
}

.spinner-container {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner {
  width: 100%;
  height: 100%;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-glow {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: var(--gradient-primary);
  opacity: 0.2;
  filter: blur(8px);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.1); }
}
</style>
