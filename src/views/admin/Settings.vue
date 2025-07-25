<template>
  <div class="settings-management">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your application settings and preferences</p>
      </div>
      <div class="header-actions">
        <button class="btn btn-outline" @click="resetSettings">
          <RotateCcw class="w-4 h-4" />
          Reset
        </button>
        <button class="btn btn-primary" @click="saveSettings">
          <Save class="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>

    <!-- Settings Sections -->
    <div class="settings-container">
      <!-- General Settings -->
      <div class="settings-section">
        <div class="section-header">
          <Settings class="w-5 h-5" />
          <h2>General Settings</h2>
        </div>
        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <span>Site Name</span>
              <input type="text" v-model="settings.general.siteName" class="setting-input">
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Site Description</span>
              <textarea v-model="settings.general.siteDescription" class="setting-textarea" rows="3"></textarea>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Contact Email</span>
              <input type="email" v-model="settings.general.contactEmail" class="setting-input">
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Default Currency</span>
              <select v-model="settings.general.currency" class="setting-select">
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <!-- Store Settings -->
      <div class="settings-section">
        <div class="section-header">
          <Store class="w-5 h-5" />
          <h2>Store Settings</h2>
        </div>
        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <span>Store Status</span>
              <div class="toggle-switch">
                <input type="checkbox" v-model="settings.store.isOpen" id="store-status">
                <label for="store-status" class="toggle-label"></label>
              </div>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Maintenance Mode</span>
              <div class="toggle-switch">
                <input type="checkbox" v-model="settings.store.maintenanceMode" id="maintenance-mode">
                <label for="maintenance-mode" class="toggle-label"></label>
              </div>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Tax Rate (%)</span>
              <input type="number" v-model="settings.store.taxRate" class="setting-input" min="0" max="100" step="0.01">
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Free Shipping Threshold</span>
              <input type="number" v-model="settings.store.freeShippingThreshold" class="setting-input" min="0" step="0.01">
            </label>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="settings-section">
        <div class="section-header">
          <Bell class="w-5 h-5" />
          <h2>Notifications</h2>
        </div>
        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <span>Email Notifications</span>
              <div class="toggle-switch">
                <input type="checkbox" v-model="settings.notifications.email" id="email-notifications">
                <label for="email-notifications" class="toggle-label"></label>
              </div>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>SMS Notifications</span>
              <div class="toggle-switch">
                <input type="checkbox" v-model="settings.notifications.sms" id="sms-notifications">
                <label for="sms-notifications" class="toggle-label"></label>
              </div>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Order Notifications</span>
              <div class="toggle-switch">
                <input type="checkbox" v-model="settings.notifications.orders" id="order-notifications">
                <label for="order-notifications" class="toggle-label"></label>
              </div>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Low Stock Alerts</span>
              <div class="toggle-switch">
                <input type="checkbox" v-model="settings.notifications.lowStock" id="low-stock-alerts">
                <label for="low-stock-alerts" class="toggle-label"></label>
              </div>
            </label>
          </div>
        </div>
      </div>

      <!-- Security Settings -->
      <div class="settings-section">
        <div class="section-header">
          <Shield class="w-5 h-5" />
          <h2>Security</h2>
        </div>
        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <span>Two-Factor Authentication</span>
              <div class="toggle-switch">
                <input type="checkbox" v-model="settings.security.twoFactor" id="two-factor">
                <label for="two-factor" class="toggle-label"></label>
              </div>
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Session Timeout (minutes)</span>
              <input type="number" v-model="settings.security.sessionTimeout" class="setting-input" min="5" max="1440">
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Password Minimum Length</span>
              <input type="number" v-model="settings.security.passwordMinLength" class="setting-input" min="6" max="50">
            </label>
          </div>
          <div class="setting-item">
            <label class="setting-label">
              <span>Login Attempts Limit</span>
              <input type="number" v-model="settings.security.loginAttemptsLimit" class="setting-input" min="3" max="10">
            </label>
          </div>
        </div>
      </div>

      <!-- Payment Settings -->
      <div class="settings-section">
        <div class="section-header">
          <CreditCard class="w-5 h-5" />
          <h2>Payment Methods</h2>
        </div>
        <div class="payment-methods">
          <div class="payment-method" v-for="method in paymentMethods" :key="method.id">
            <div class="method-info">
              <component :is="method.icon" class="w-6 h-6" />
              <div class="method-details">
                <h4>{{ method.name }}</h4>
                <p>{{ method.description }}</p>
              </div>
            </div>
            <div class="method-actions">
              <div class="toggle-switch">
                <input type="checkbox" v-model="method.enabled" :id="`payment-${method.id}`">
                <label :for="`payment-${method.id}`" class="toggle-label"></label>
              </div>
              <button class="btn btn-outline btn-sm" @click="configurePayment(method)">
                <Settings class="w-4 h-4" />
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Backup Settings -->
      <div class="settings-section">
        <div class="section-header">
          <Database class="w-5 h-5" />
          <h2>Backup & Data</h2>
        </div>
        <div class="backup-controls">
          <div class="backup-item">
            <div class="backup-info">
              <h4>Automatic Backups</h4>
              <p>Automatically backup your data daily</p>
            </div>
            <div class="toggle-switch">
              <input type="checkbox" v-model="settings.backup.automatic" id="auto-backup">
              <label for="auto-backup" class="toggle-label"></label>
            </div>
          </div>
          <div class="backup-item">
            <div class="backup-info">
              <h4>Backup Frequency</h4>
              <select v-model="settings.backup.frequency" class="setting-select">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div class="backup-actions">
            <button class="btn btn-outline" @click="createBackup">
              <Download class="w-4 h-4" />
              Create Backup
            </button>
            <button class="btn btn-outline" @click="restoreBackup">
              <Upload class="w-4 h-4" />
              Restore Backup
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Store, 
  Bell, 
  Shield, 
  CreditCard, 
  Database,
  Download,
  Upload
} from 'lucide-vue-next'

export default {
  name: 'AdminSettings',
  components: {
    Settings,
    Save,
    RotateCcw,
    Store,
    Bell,
    Shield,
    CreditCard,
    Database,
    Download,
    Upload
  },
  data() {
    return {
      settings: {
        general: {
          siteName: 'My E-commerce Store',
          siteDescription: 'Your one-stop shop for everything you need',
          contactEmail: 'contact@mystore.com',
          currency: 'USD'
        },
        store: {
          isOpen: true,
          maintenanceMode: false,
          taxRate: 8.5,
          freeShippingThreshold: 50
        },
        notifications: {
          email: true,
          sms: false,
          orders: true,
          lowStock: true
        },
        security: {
          twoFactor: false,
          sessionTimeout: 60,
          passwordMinLength: 8,
          loginAttemptsLimit: 5
        },
        backup: {
          automatic: true,
          frequency: 'daily'
        }
      },
      paymentMethods: [
        {
          id: 'stripe',
          name: 'Stripe',
          description: 'Accept credit cards and digital payments',
          icon: 'CreditCard',
          enabled: true
        },
        {
          id: 'paypal',
          name: 'PayPal',
          description: 'Accept PayPal payments',
          icon: 'CreditCard',
          enabled: true
        },
        {
          id: 'apple-pay',
          name: 'Apple Pay',
          description: 'Accept Apple Pay payments',
          icon: 'CreditCard',
          enabled: false
        },
        {
          id: 'google-pay',
          name: 'Google Pay',
          description: 'Accept Google Pay payments',
          icon: 'CreditCard',
          enabled: false
        }
      ]
    }
  },
  methods: {
    saveSettings() {
      console.log('Saving settings:', this.settings)
      // Implement save logic
    },
    resetSettings() {
      console.log('Resetting settings to defaults')
      // Implement reset logic
    },
    configurePayment(method) {
      console.log('Configuring payment method:', method.name)
      // Implement payment configuration
    },
    createBackup() {
      console.log('Creating backup...')
      // Implement backup creation
    },
    restoreBackup() {
      console.log('Restoring backup...')
      // Implement backup restoration
    }
  }
}
</script>

<style scoped>
.settings-management {
  padding: 2rem;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
}

.header-content p {
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-outline {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-outline:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
}

.setting-label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-label span {
  font-weight: 500;
  color: #374151;
}

.setting-input,
.setting-select,
.setting-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.setting-input:focus,
.setting-select:focus,
.setting-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.toggle-switch {
  position: relative;
  display: inline-block;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  display: block;
  width: 3rem;
  height: 1.5rem;
  background: #e5e7eb;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.toggle-label::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  background: white;
  border-radius: 50%;
  transition: all 0.2s;
}

.toggle-switch input:checked + .toggle-label {
  background: #3b82f6;
}

.toggle-switch input:checked + .toggle-label::after {
  transform: translateX(1.5rem);
}

.payment-methods {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-method {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.method-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.method-details h4 {
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.method-details p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.method-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.backup-controls {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.backup-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.backup-info h4 {
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.backup-info p {
  color: #6b7280;
  margin: 0;
  font-size: 0.875rem;
}

.backup-actions {
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

@media (max-width: 768px) {
  .settings-management {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .payment-method,
  .backup-item {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .method-actions,
  .backup-actions {
    justify-content: center;
  }
}
</style>