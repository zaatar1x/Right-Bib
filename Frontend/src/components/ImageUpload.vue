<template>
  <div class="image-upload">
    <label class="form-label">{{ label }}</label>
    
    <div class="upload-tabs">
      <button
        type="button"
        @click="activeTab = 'url'"
        class="tab-btn"
        :class="{ active: activeTab === 'url' }"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        URL
      </button>
      <button
        type="button"
        @click="activeTab = 'upload'"
        class="tab-btn"
        :class="{ active: activeTab === 'upload' }"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Upload
      </button>
    </div>

    <div v-if="activeTab === 'url'" class="url-input-wrapper">
      <input
        v-model="urlInput"
        @input="handleUrlInput"
        type="url"
        class="input"
        placeholder="https://example.com/image.jpg"
        required
      >
      <transition name="fade">
        <div v-if="urlInput && isValidUrl(urlInput)" class="preview-small">
          <img :src="urlInput" alt="Preview" @error="handleImageError" @load="handleImageLoad">
          <div v-if="imageLoading" class="preview-loading">Loading...</div>
        </div>
      </transition>
    </div>

    <div v-else class="upload-area">
      <div
        class="dropzone"
        :class="{ 'drag-over': isDragging, 'has-image': uploadedImage }"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="triggerFileInput"
      >
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          class="file-input"
        >
        
        <div v-if="!uploadedImage" class="dropzone-content">
          <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="dropzone-text">
            <span class="highlight">Click to upload</span> or drag and drop
          </p>
          <p class="dropzone-hint">PNG, JPG, GIF up to 10MB</p>
        </div>

        <div v-else class="preview-wrapper">
          <img :src="uploadedImage" alt="Uploaded" class="preview-image">
          <button type="button" @click.stop="removeImage" class="remove-btn">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  modelValue: string
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const activeTab = ref<'url' | 'upload'>('url')
const isDragging = ref(false)
const uploadedImage = ref('')
const urlInput = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const imageLoading = ref(false)

// Initialize from modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (newValue.startsWith('data:')) {
      uploadedImage.value = newValue
      urlInput.value = ''
      activeTab.value = 'upload'
    } else {
      urlInput.value = newValue
      uploadedImage.value = ''
      activeTab.value = 'url'
    }
  } else {
    urlInput.value = ''
    uploadedImage.value = ''
  }
}, { immediate: true })

const displayImage = computed(() => {
  if (activeTab.value === 'upload') {
    return uploadedImage.value
  }
  return urlInput.value
})

function handleUrlInput() {
  uploadedImage.value = ''
  if (urlInput.value && isValidUrl(urlInput.value)) {
    imageLoading.value = true
  }
  emit('update:modelValue', urlInput.value)
}

function handleImageLoad() {
  imageLoading.value = false
}

function isValidUrl(url: string) {
  if (!url) return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function handleImageError(e: Event) {
  imageLoading.value = false
  const img = e.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/200x300/EF4444/FFFFFF?text=Invalid+Image'
}

function triggerFileInput() {
  fileInput.value?.click()
}

function handleFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    processFile(file)
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  } else {
    alert('Please drop an image file (PNG, JPG, GIF)')
  }
}

function processFile(file: File) {
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB')
    return
  }

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    uploadedImage.value = result
    urlInput.value = ''
    emit('update:modelValue', result)
  }
  reader.onerror = () => {
    alert('Error reading file. Please try again.')
  }
  reader.readAsDataURL(file)
}

function removeImage() {
  uploadedImage.value = ''
  urlInput.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.image-upload {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.upload-tabs {
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem;
  background: var(--hover);
  border-radius: 0.75rem;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  transition: all 0.3s;
}

.tab-btn svg {
  width: 18px;
  height: 18px;
}

.tab-btn:hover {
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--card);
  color: var(--primary);
  box-shadow: var(--shadow-sm);
}

.url-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-small {
  width: 120px;
  height: 160px;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid var(--border);
  position: relative;
}

.preview-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-loading {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
}

.upload-area {
  margin-top: 0.5rem;
}

.dropzone {
  position: relative;
  border: 2px dashed var(--border);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
  cursor: pointer;
  background: var(--hover);
}

.dropzone:hover {
  border-color: var(--primary);
  background: var(--card);
}

.dropzone.drag-over {
  border-color: var(--primary);
  background: rgba(37, 99, 235, 0.05);
  transform: scale(1.02);
}

.dropzone.has-image {
  padding: 0;
  border-style: solid;
}

.file-input {
  display: none;
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: var(--text-secondary);
}

.dropzone-text {
  font-size: 0.9375rem;
  color: var(--text-primary);
  font-weight: 500;
}

.highlight {
  color: var(--primary);
  font-weight: 700;
}

.dropzone-hint {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.preview-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  max-width: 300px;
  margin: 0 auto;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
}

.remove-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.95);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: var(--shadow-lg);
}

.remove-btn:hover {
  transform: scale(1.1) rotate(90deg);
  background: var(--error);
}

.remove-btn svg {
  width: 20px;
  height: 20px;
}
</style>
