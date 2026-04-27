<template>
  <div class="skeleton-card">
    <div class="skeleton skeleton-image"></div>
    <div class="skeleton-content">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-author"></div>
      <div class="skeleton skeleton-meta"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  background: var(--card);
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.skeleton-image {
  aspect-ratio: 3/4;
  width: 100%;
}

.skeleton-content {
  padding: 1rem;
}

.skeleton-title {
  height: 20px;
  margin-bottom: 0.5rem;
}

.skeleton-author {
  height: 16px;
  width: 60%;
  margin-bottom: 0.75rem;
}

.skeleton-meta {
  height: 14px;
  width: 40%;
}
</style>
