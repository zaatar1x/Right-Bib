<template>
  <div class="admin-layout">
    <Navbar />
    <div class="admin-container">
      <Sidebar />
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-container {
  flex: 1;
  display: flex;
}

.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
}
</style>
