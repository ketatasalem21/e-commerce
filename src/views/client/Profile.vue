<template>
  <div class="profile-page">
    <div class="container">
      <!-- Profile Header -->
      <div class="profile-header glass-card">
        <div class="profile-avatar-section">
          <div class="avatar-container">
            <img 
              :src="user?.avatar || defaultAvatar" 
              :alt="user?.firstName"
              class="profile-avatar hover-magnetic"
            />
            <button class="avatar-edit-btn glow-pulse">
              <Camera class="w-5 h-5" />
            </button>
          </div>
          
          <div class="profile-info">
            <h1 class="profile-name text-reveal">
              <span>{{ user?.firstName }}</span> <span>{{ user?.lastName }}</span>
            </h1>
            <p class="profile-email">{{ user?.email }}</p>
            <div class="profile-badges">
              <span class="badge verified" v-if="user?.isVerified">
                <Shield class="w-4 h-4" />
                Vérifié
              </span>
              <span class="badge premium">
                <Crown class="w-4 h-4" />
                Membre Premium
              </span>
            </div>
          </div>
        </div>
        
        <div class="profile-stats">
          <div class="stat-item hover-lift">
            <div class="stat-value">{{ totalOrders }}</div>
            <div class="stat-label">Commandes</div>
          </div>
          <div class="stat-item hover-lift">
            <div class="stat-value">{{ formatPrice(totalSpent) }}</div>
            <div class="stat-label">Total dépensé</div>
          </div>
          <div class="stat-item hover-lift">
            <div class="stat-value">{{ wishlistCount }}</div>
            <div class="stat-label">Favoris</div>
          </div>
        </div>
      </div>
      
      <!-- Profile Navigation -->
      <div class="profile-nav">
        <button 
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['nav-tab', { 'active': activeTab === tab.id }]"
          class="hover-magnetic"
        >
          <component :is="tab.icon" class="w-5 h-5" />
          {{ tab.label }}
        </button>
      </div>
      
      <!-- Profile Content -->
      <div class="profile-content">
        <!-- Personal Information -->
        <div v-if="activeTab === 'personal'" class="tab-content fade-in-up">
          <div class="content-header">
            <h2 class="content-title">Informations personnelles</h2>
            <AnimatedButton 
              variant="primary"
              @click="editMode = !editMode"
              class="edit-btn"
            >
              <Edit class="w-4 h-4" />
              {{ editMode ? 'Annuler' : 'Modifier' }}
            </AnimatedButton>
          </div>
          
          <form @submit.prevent="savePersonalInfo" class="personal-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Prénom</label>
                <input 
                  v-model="personalForm.firstName"
                  :disabled="!editMode"
                  class="form-input"
                  type="text"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Nom</label>
                <input 
                  v-model="personalForm.lastName"
                  :disabled="!editMode"
                  class="form-input"
                  type="text"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Email</label>
                <input 
                  v-model="personalForm.email"
                  :disabled="!editMode"
                  class="form-input"
                  type="email"
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">Téléphone</label>
                <input 
                  v-model="personalForm.phone"
                  :disabled="!editMode"
                  class="form-input"
                  type="tel"
                />
              </div>
              
              <div class="form-group full-width">
                <label class="form-label">Date de naissance</label>
                <input 
                  v-model="personalForm.birthDate"
                  :disabled="!editMode"
                  class="form-input"
                  type="date"
                />
              </div>
            </div>
            
            <div v-if="editMode" class="form-actions">
              <AnimatedButton 
                type="submit"
                variant="primary"
                :loading="saving"
                class="save-btn"
              >
                Sauvegarder
              </AnimatedButton>
            </div>
          </form>
        </div>
        
        <!-- Addresses -->
        <div v-if="activeTab === 'addresses'" class="tab-content fade-in-up">
          <div class="content-header">
            <h2 class="content-title">Mes adresses</h2>
            <AnimatedButton 
              variant="primary"
              @click="showAddressModal = true"
              class="add-btn"
            >
              <Plus class="w-4 h-4" />
              Ajouter une adresse
            </AnimatedButton>
          </div>
          
          <div class="addresses-grid">
            <div 
              v-for="address in addresses"
              :key="address.id"
              class="address-card hover-lift"
            >
              <div class="address-header">
                <h3 class="address-title">{{ address.title }}</h3>
                <div class="address-actions">
                  <button class="action-btn edit-btn">
                    <Edit class="w-4 h-4" />
                  </button>
                  <button class="action-btn delete-btn">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div class="address-content">
                <p class="address-name">{{ address.firstName }} {{ address.lastName }}</p>
                <p class="address-line">{{ address.address1 }}</p>
                <p v-if="address.address2" class="address-line">{{ address.address2 }}</p>
                <p class="address-line">{{ address.postalCode }} {{ address.city }}</p>
                <p class="address-line">{{ address.country }}</p>
                <p v-if="address.phone" class="address-phone">{{ address.phone }}</p>
              </div>
              
              <div v-if="address.isDefault" class="default-badge">
                <Star class="w-4 h-4" />
                Adresse par défaut
              </div>
            </div>
          </div>
        </div>
        
        <!-- Security -->
        <div v-if="activeTab === 'security'" class="tab-content fade-in-up">
          <div class="content-header">
            <h2 class="content-title">Sécurité</h2>
          </div>
          
          <div class="security-sections">
            <!-- Change Password -->
            <div class="security-section">
              <h3 class="section-title">Changer le mot de passe</h3>
              <form @submit.prevent="changePassword" class="password-form">
                <div class="form-group">
                  <label class="form-label">Mot de passe actuel</label>
                  <input 
                    v-model="passwordForm.current"
                    type="password"
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Nouveau mot de passe</label>
                  <input 
                    v-model="passwordForm.new"
                    type="password"
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">Confirmer le nouveau mot de passe</label>
                  <input 
                    v-model="passwordForm.confirm"
                    type="password"
                    class="form-input"
                    required
                  />
                </div>
                
                <AnimatedButton 
                  type="submit"
                  variant="primary"
                  :loading="changingPassword"
                  class="change-password-btn"
                >
                  Changer le mot de passe
                </AnimatedButton>
              </form>
            </div>
            
            <!-- Two-Factor Authentication -->
            <div class="security-section">
              <h3 class="section-title">Authentification à deux facteurs</h3>
              <div class="two-factor-content">
                <div class="two-factor-status">
                  <div class="status-indicator" :class="{ 'enabled': twoFactorEnabled }">
                    <Shield class="w-5 h-5" />
                  </div>
                  <div class="status-text">
                    <p class="status-title">
                      {{ twoFactorEnabled ? 'Activée' : 'Désactivée' }}
                    </p>
                    <p class="status-description">
                      {{ twoFactorEnabled 
                        ? 'Votre compte est protégé par l\'authentification à deux facteurs' 
                        : 'Activez l\'authentification à deux facteurs pour plus de sécurité' 
                      }}
                    </p>
                  </div>
                </div>
                
                <AnimatedButton 
                  :variant="twoFactorEnabled ? 'secondary' : 'primary'"
                  @click="toggleTwoFactor"
                  class="two-factor-btn"
                >
                  {{ twoFactorEnabled ? 'Désactiver' : 'Activer' }}
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Preferences -->
        <div v-if="activeTab === 'preferences'" class="tab-content fade-in-up">
          <div class="content-header">
            <h2 class="content-title">Préférences</h2>
          </div>
          
          <div class="preferences-sections">
            <!-- Notifications -->
            <div class="preference-section">
              <h3 class="section-title">Notifications</h3>
              <div class="preference-options">
                <div class="preference-item">
                  <div class="preference-info">
                    <h4 class="preference-title">Notifications par email</h4>
                    <p class="preference-description">Recevoir des notifications par email</p>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="preferences.emailNotifications" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <div class="preference-item">
                  <div class="preference-info">
                    <h4 class="preference-title">Notifications push</h4>
                    <p class="preference-description">Recevoir des notifications push</p>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="preferences.pushNotifications" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
                
                <div class="preference-item">
                  <div class="preference-info">
                    <h4 class="preference-title">Newsletter</h4>
                    <p class="preference-description">Recevoir notre newsletter hebdomadaire</p>
                  </div>
                  <label class="toggle-switch">
                    <input v-model="preferences.newsletter" type="checkbox" />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Language & Currency -->
            <div class="preference-section">
              <h3 class="section-title">Langue et devise</h3>
              <div class="preference-grid">
                <div class="form-group">
                  <label class="form-label">Langue</label>
                  <select v-model="preferences.language" class="form-select">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">Devise</label>
                  <select v-model="preferences.currency" class="form-select">
                    <option value="EUR">Euro (€)</option>
                    <option value="USD">Dollar ($)</option>
                    <option value="GBP">Livre (£)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div class="preferences-actions">
            <AnimatedButton 
              variant="primary"
              @click="savePreferences"
              :loading="savingPreferences"
              class="save-preferences-btn"
            >
              Sauvegarder les préférences
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Camera, Shield, Crown, Edit, Plus, Trash2, Star, 
  User, MapPin, Lock, Settings, Bell
} from 'lucide-vue-next'
import { useMainStore } from '../../stores/main'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const store = useMainStore()

const user = computed(() => store.user)
const wishlistCount = computed(() => store.wishlistCount)

const defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=8B5CF6&color=fff'
const totalOrders = ref(12)
const totalSpent = ref(2850.50)

const activeTab = ref('personal')
const editMode = ref(false)
const saving = ref(false)
const changingPassword = ref(false)
const savingPreferences = ref(false)
const showAddressModal = ref(false)
const twoFactorEnabled = ref(false)

const tabs = [
  { id: 'personal', label: 'Informations', icon: User },
  { id: 'addresses', label: 'Adresses', icon: MapPin },
  { id: 'security', label: 'Sécurité', icon: Lock },
  { id: 'preferences', label: 'Préférences', icon: Settings }
]

const personalForm = ref({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  phone: '',
  birthDate: ''
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const preferences = ref({
  emailNotifications: true,
  pushNotifications: false,
  newsletter: true,
  language: 'fr',
  currency: 'EUR'
})

const addresses = ref([
  {
    id: 1,
    title: 'Domicile',
    firstName: 'Jean',
    lastName: 'Dupont',
    address1: '123 Rue de la Paix',
    address2: 'Appartement 4B',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    phone: '+33 1 23 45 67 89',
    isDefault: true
  },
  {
    id: 2,
    title: 'Bureau',
    firstName: 'Jean',
    lastName: 'Dupont',
    address1: '456 Avenue des Champs',
    address2: '',
    city: 'Paris',
    postalCode: '75008',
    country: 'France',
    phone: '+33 1 98 76 54 32',
    isDefault: false
  }
])

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const savePersonalInfo = async () => {
  saving.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    editMode.value = false
    console.log('Personal info saved:', personalForm.value)
  } catch (error) {
    console.error('Failed to save personal info:', error)
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    alert('Les mots de passe ne correspondent pas')
    return
  }
  
  changingPassword.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    passwordForm.value = { current: '', new: '', confirm: '' }
    console.log('Password changed successfully')
  } catch (error) {
    console.error('Failed to change password:', error)
  } finally {
    changingPassword.value = false
  }
}

const toggleTwoFactor = () => {
  twoFactorEnabled.value = !twoFactorEnabled.value
  console.log('Two-factor authentication:', twoFactorEnabled.value ? 'enabled' : 'disabled')
}

const savePreferences = async () => {
  savingPreferences.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Preferences saved:', preferences.value)
  } catch (error) {
    console.error('Failed to save preferences:', error)
  } finally {
    savingPreferences.value = false
  }
}
</script>

<style scoped>
.profile-page {
  padding: var(--space-8) 0;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-100) 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-8);
  margin-bottom: var(--space-8);
  border-radius: var(--border-radius-2xl);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.avatar-container {
  position: relative;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-normal);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}

.avatar-edit-btn:hover {
  transform: scale(1.1);
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  margin-bottom: var(--space-2);
  color: var(--color-gray-900);
}

.profile-name span {
  display: inline-block;
  animation-delay: calc(var(--i, 0) * 0.1s);
}

.profile-email {
  color: var(--color-gray-600);
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-4);
}

.profile-badges {
  display: flex;
  gap: var(--space-3);
}

.badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.badge.verified {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.badge.premium {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.profile-stats {
  display: flex;
  gap: var(--space-8);
}

.stat-item {
  text-align: center;
  padding: var(--space-4);
  border-radius: var(--border-radius-lg);
  background: rgba(255, 255, 255, 0.5);
  transition: all var(--transition-normal);
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--space-1);
}

.stat-label {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.profile-nav {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-8);
  background: white;
  padding: var(--space-2);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border: none;
  background: none;
  border-radius: var(--border-radius-lg);
  color: var(--color-gray-600);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.nav-tab:hover {
  background: var(--color-gray-50);
  color: var(--color-gray-900);
}

.nav-tab.active {
  background: var(--gradient-primary);
  color: white;
  box-shadow: var(--shadow-md);
}

.profile-content {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.tab-content {
  padding: var(--space-8);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
}

.content-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
}

.personal-form {
  max-width: 800px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 500;
  color: var(--color-gray-700);
}

.form-input,
.form-select {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}

.form-input:disabled {
  background: var(--color-gray-50);
  color: var(--color-gray-500);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.address-card {
  background: var(--color-gray-50);
  border-radius: var(--border-radius-xl);
  padding: var(--space-6);
  position: relative;
  transition: all var(--transition-normal);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.address-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
}

.address-actions {
  display: flex;
  gap: var(--space-2);
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-normal);
}

.action-btn.edit-btn {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-secondary);
}

.action-btn.edit-btn:hover {
  background: var(--color-secondary);
  color: white;
}

.action-btn.delete-btn {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.action-btn.delete-btn:hover {
  background: var(--color-error);
  color: white;
}

.address-content {
  margin-bottom: var(--space-4);
}

.address-name {
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.address-line,
.address-phone {
  color: var(--color-gray-600);
  margin-bottom: var(--space-1);
}

.default-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  font-weight: 500;
  width: fit-content;
}

.security-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
}

.security-section {
  padding: var(--space-6);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-xl);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-6);
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 400px;
}

.two-factor-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.two-factor-status {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.status-indicator {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
  transition: all var(--transition-normal);
}

.status-indicator.enabled {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-title {
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.status-description {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.preferences-sections {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.preference-section {
  padding: var(--space-6);
  background: var(--color-gray-50);
  border-radius: var(--border-radius-xl);
}

.preference-options {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background: white;
  border-radius: var(--border-radius-lg);
}

.preference-title {
  font-weight: 500;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.preference-description {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
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
  background-color: var(--color-primary);
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.preference-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.preferences-actions {
  margin-top: var(--space-8);
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: var(--space-6);
    text-align: center;
  }
  
  .profile-avatar-section {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .profile-nav {
    flex-wrap: wrap;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .addresses-grid {
    grid-template-columns: 1fr;
  }
  
  .two-factor-content {
    flex-direction: column;
    gap: var(--space-4);
    text-align: center;
  }
  
  .preference-grid {
    grid-template-columns: 1fr;
  }
}
</style>