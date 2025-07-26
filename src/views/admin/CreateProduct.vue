<template>
  <div class="create-product-page">
    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <button @click="$router.back()" class="back-btn">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <h1 class="page-title">Create Product</h1>
        </div>
      </div>

      <!-- Main Content -->
      <form @submit.prevent="saveProduct" class="product-form">
        <div class="form-layout">
          <!-- Left Column - Main Form -->
          <div class="form-main">
            <!-- Product Name -->
            <div class="form-group full-width">
              <input 
                v-model="productForm.name"
                type="text"
                placeholder="Product Name"
                class="form-input large"
                required
              />
            </div>

            <!-- Price, Code, SKU Row -->
            <div class="form-row">
              <div class="form-group">
                <input 
                  v-model.number="productForm.price"
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <input 
                  v-model="productForm.code"
                  type="text"
                  placeholder="Product Code"
                  class="form-input"
                  required
                />
              </div>
              <div class="form-group">
                <input 
                  v-model="productForm.sku"
                  type="text"
                  placeholder="Product SKU"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <!-- Rich Text Editor -->
            <div class="form-group full-width">
              <div class="editor-container">
                <div class="editor-toolbar">
                  <div class="toolbar-group">
                    <select class="toolbar-select">
                      <option>Heading</option>
                      <option>Paragraph</option>
                    </select>
                    <select class="toolbar-select">
                      <option>Sans Serif</option>
                      <option>Serif</option>
                    </select>
                  </div>
                  <div class="toolbar-group">
                    <button type="button" class="toolbar-btn"><strong>B</strong></button>
                    <button type="button" class="toolbar-btn"><em>I</em></button>
                    <button type="button" class="toolbar-btn"><u>U</u></button>
                    <button type="button" class="toolbar-btn">A</button>
                    <button type="button" class="toolbar-btn">🎨</button>
                  </div>
                  <div class="toolbar-group">
                    <button type="button" class="toolbar-btn">📋</button>
                    <button type="button" class="toolbar-btn">📝</button>
                    <button type="button" class="toolbar-btn">📊</button>
                    <button type="button" class="toolbar-btn">🔗</button>
                    <button type="button" class="toolbar-btn">📷</button>
                    <button type="button" class="toolbar-btn">📊</button>
                    <button type="button" class="toolbar-btn">🔧</button>
                  </div>
                </div>
                <textarea 
                  v-model="productForm.description"
                  class="editor-content"
                  rows="8"
                  placeholder="Product description..."
                  required
                ></textarea>
              </div>
            </div>

            <!-- Image Upload -->
            <div class="form-group full-width">
              <div class="image-upload-area">
                <div class="upload-icon">
                  <Upload class="w-8 h-8" />
                </div>
                <p class="upload-text">Drop or select a cover image</p>
                <input type="file" class="upload-input" accept="image/*" />
              </div>
            </div>
          </div>

          <!-- Right Sidebar -->
          <div class="form-sidebar">
            <!-- Publish Section -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">Publish</h3>
              
              <div class="status-row">
                <span class="status-label">Status:</span>
                <div class="status-value">
                  <span class="status-indicator draft"></span>
                  <span>Draft</span>
                  <Edit class="w-4 h-4 text-primary cursor-pointer" />
                </div>
              </div>

              <div class="publish-actions">
                <button type="button" class="discard-btn">
                  <Trash2 class="w-4 h-4" />
                  Discard
                </button>
                <button type="submit" class="publish-btn" :disabled="saving">
                  <Check class="w-4 h-4" />
                  {{ saving ? 'Publishing...' : 'Publish' }}
                </button>
              </div>
            </div>

            <!-- Tags Section -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">Tags</h3>
              
              <div class="tags-container">
                <div class="tag-item">
                  <span>Nike</span>
                  <X class="w-3 h-3 cursor-pointer" @click="removeTag('Nike')" />
                </div>
                <div class="tag-item">
                  <span>Sneaker</span>
                  <X class="w-3 h-3 cursor-pointer" @click="removeTag('Sneaker')" />
                </div>
              </div>
              
              <input 
                v-model="newTag"
                @keydown.enter.prevent="addTag"
                type="text" 
                placeholder="Add tag..."
                class="tag-input"
              />
            </div>

            <!-- Category Section -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">Category</h3>
              <select 
                v-model="productForm.category"
                class="category-select"
                required
              >
                <option value="">Select a category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <!-- Colors Section -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">Colors</h3>
              <div class="color-grid">
                <div 
                  v-for="color in availableColors"
                  :key="color.id"
                  @click="toggleColor(color)"
                  :class="['color-swatch', { 'selected': selectedColors.includes(color.id) }]"
                  :style="{ backgroundColor: color.value }"
                  :title="color.name"
                >
                  <Check v-if="selectedColors.includes(color.id)" class="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            <!-- Stock Section -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">Stock</h3>
              
              <select v-model="productForm.stockStatus" class="stock-select">
                <option value="">Select stock</option>
                <option value="in-stock">In stock</option>
                <option value="out-of-stock">Out of stock</option>
                <option value="low-stock">Low stock</option>
              </select>

              <div class="stock-toggle">
                <span>In stock</span>
                <label class="toggle-switch">
                  <input v-model="productForm.inStock" type="checkbox" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Upload, Edit, Trash2, Check, X } from 'lucide-vue-next'
import { useMainStore } from '../../stores/main'

const router = useRouter()
const store = useMainStore()

const saving = ref(false)
const newTag = ref('')

const productForm = ref({
  name: '',
  price: 0,
  code: '',
  sku: '',
  description: '',
  category: '',
  stockStatus: '',
  inStock: true,
  tags: ['Nike', 'Sneaker']
})

const selectedColors = ref<number[]>([1, 2, 3])

const availableColors = [
  { id: 1, name: 'Black', value: '#000000' },
  { id: 2, name: 'Orange', value: '#ff6b35' },
  { id: 3, name: 'Blue', value: '#007bff' },
  { id: 4, name: 'Gray', value: '#6c757d' },
  { id: 5, name: 'Red', value: '#dc3545' },
  { id: 6, name: 'Green', value: '#28a745' }
]

const categories = ['Electronics', 'Audio', 'Wearables', 'Accessories']

const toggleColor = (color: any) => {
  const index = selectedColors.value.indexOf(color.id)
  if (index > -1) {
    selectedColors.value.splice(index, 1)
  } else {
    selectedColors.value.push(color.id)
  }
}

const addTag = () => {
  if (newTag.value.trim() && !productForm.value.tags.includes(newTag.value.trim())) {
    productForm.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (tag: string) => {
  const index = productForm.value.tags.indexOf(tag)
  if (index > -1) {
    productForm.value.tags.splice(index, 1)
  }
}

const saveProduct = async () => {
  saving.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Product created:', productForm.value)
    router.push('/admin/products')
  } catch (error) {
    console.error('Error creating product:', error)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.create-product-page {
  min-height: 100vh;
  background: #f8fafc;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--space-6);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-gray-300);
  background: white;
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.back-btn:hover {
  background: var(--color-gray-50);
  border-color: var(--color-primary);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0;
}

.product-form {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.form-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  min-height: 80vh;
}

.form-main {
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.form-input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}

.form-input.large {
  padding: var(--space-4) var(--space-6);
  font-size: var(--font-size-lg);
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.editor-container {
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.editor-toolbar {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-300);
}

.toolbar-group {
  display: flex;
  gap: var(--space-2);
  align-items: center;
}

.toolbar-select {
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  background: white;
}

.toolbar-btn {
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-gray-300);
  background: white;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-btn:hover {
  background: var(--color-gray-100);
  border-color: var(--color-primary);
}

.editor-content {
  width: 100%;
  padding: var(--space-4);
  border: none;
  resize: vertical;
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
}

.editor-content:focus {
  outline: none;
}

.image-upload-area {
  border: 2px dashed var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  padding: var(--space-12);
  text-align: center;
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
  background: var(--color-gray-50);
}

.image-upload-area:hover {
  border-color: var(--color-primary);
  background: rgba(139, 92, 246, 0.05);
}

.upload-icon {
  color: var(--color-gray-400);
  margin-bottom: var(--space-3);
}

.upload-text {
  color: var(--color-gray-600);
  font-size: var(--font-size-base);
  margin: 0;
}

.upload-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.form-sidebar {
  background: var(--color-gray-50);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.sidebar-card {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.sidebar-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-4);
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.status-label {
  font-weight: 500;
  color: var(--color-gray-700);
}

.status-value {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-gray-600);
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.draft {
  background: var(--color-warning);
}

.publish-actions {
  display: flex;
  gap: var(--space-3);
}

.discard-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: white;
  border: 1px solid var(--color-gray-300);
  color: var(--color-error);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.discard-btn:hover {
  background: rgba(239, 68, 68, 0.05);
  border-color: var(--color-error);
}

.publish-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--color-success);
  border: none;
  color: white;
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.publish-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-1px);
}

.publish-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.tag-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-gray-100);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.tag-input {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
}

.category-select,
.stock-select {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-sm);
  background: white;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.color-swatch:hover {
  transform: scale(1.1);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.color-swatch.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
}

.stock-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-4);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-gray-300);
  transition: 0.4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: var(--color-success);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

@media (max-width: 1200px) {
  .form-layout {
    grid-template-columns: 1fr;
  }
  
  .form-sidebar {
    background: white;
    border-top: 1px solid var(--color-gray-200);
  }
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .color-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>