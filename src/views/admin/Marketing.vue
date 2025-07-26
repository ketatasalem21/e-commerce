<template>
  <div class="marketing-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">Marketing Dashboard</h1>
        <p class="dashboard-subtitle">Suivez vos campagnes et performances marketing</p>
      </div>
      <div class="header-actions">
        <button class="action-btn">
          <Plus class="w-4 h-4" />
          Nouvelle campagne
        </button>
        <button class="action-btn secondary">
          <Download class="w-4 h-4" />
          Exporter
        </button>
      </div>
    </div>

    <!-- Marketing KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card impressions">
        <div class="kpi-icon">
          <Eye class="w-6 h-6" />
        </div>
        <div class="kpi-content">
          <h3 class="kpi-value">2.4M</h3>
          <p class="kpi-label">Impressions</p>
          <div class="kpi-trend positive">
            <TrendingUp class="w-4 h-4" />
            <span>+18.2%</span>
          </div>
        </div>
      </div>

      <div class="kpi-card clicks">
        <div class="kpi-icon">
          <MousePointer class="w-6 h-6" />
        </div>
        <div class="kpi-content">
          <h3 class="kpi-value">156K</h3>
          <p class="kpi-label">Clicks</p>
          <div class="kpi-trend positive">
            <TrendingUp class="w-4 h-4" />
            <span>+12.5%</span>
          </div>
        </div>
      </div>

      <div class="kpi-card conversions">
        <div class="kpi-icon">
          <Target class="w-6 h-6" />
        </div>
        <div class="kpi-content">
          <h3 class="kpi-value">8.2K</h3>
          <p class="kpi-label">Conversions</p>
          <div class="kpi-trend positive">
            <TrendingUp class="w-4 h-4" />
            <span>+24.1%</span>
          </div>
        </div>
      </div>

      <div class="kpi-card roas">
        <div class="kpi-icon">
          <DollarSign class="w-6 h-6" />
        </div>
        <div class="kpi-content">
          <h3 class="kpi-value">4.2x</h3>
          <p class="kpi-label">ROAS</p>
          <div class="kpi-trend negative">
            <TrendingDown class="w-4 h-4" />
            <span>-2.3%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Campaign Performance -->
    <div class="performance-section">
      <div class="section-header">
        <h2 class="section-title">Performance des campagnes</h2>
        <div class="period-selector">
          <select v-model="selectedPeriod">
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>
        </div>
      </div>

      <div class="performance-chart">
        <div class="chart-container">
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color impressions"></div>
              <span>Impressions</span>
            </div>
            <div class="legend-item">
              <div class="legend-color clicks"></div>
              <span>Clicks</span>
            </div>
            <div class="legend-item">
              <div class="legend-color conversions"></div>
              <span>Conversions</span>
            </div>
          </div>
          
          <div class="chart-placeholder">
            <TrendingUp class="w-16 h-16 text-gray-300" />
            <p class="text-gray-500">Graphique de performance des campagnes</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Grid -->
    <div class="bottom-grid">
      <!-- Active Campaigns -->
      <div class="campaigns-card">
        <div class="card-header">
          <h3 class="card-title">Campagnes actives</h3>
          <button class="see-all-btn">
            Voir tout
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>

        <div class="campaigns-list">
          <div class="campaign-item">
            <div class="campaign-info">
              <div class="campaign-icon facebook">
                <Facebook class="w-5 h-5" />
              </div>
              <div class="campaign-details">
                <h4 class="campaign-name">Facebook Ads - Collection Été</h4>
                <p class="campaign-status active">Active</p>
              </div>
            </div>
            <div class="campaign-metrics">
              <span class="metric-value">€2,450</span>
              <span class="metric-label">Dépensé</span>
            </div>
          </div>

          <div class="campaign-item">
            <div class="campaign-info">
              <div class="campaign-icon google">
                <span class="google-icon">G</span>
              </div>
              <div class="campaign-details">
                <h4 class="campaign-name">Google Ads - Produits Premium</h4>
                <p class="campaign-status active">Active</p>
              </div>
            </div>
            <div class="campaign-metrics">
              <span class="metric-value">€1,890</span>
              <span class="metric-label">Dépensé</span>
            </div>
          </div>

          <div class="campaign-item">
            <div class="campaign-info">
              <div class="campaign-icon instagram">
                <Instagram class="w-5 h-5" />
              </div>
              <div class="campaign-details">
                <h4 class="campaign-name">Instagram Stories - Nouveautés</h4>
                <p class="campaign-status paused">En pause</p>
              </div>
            </div>
            <div class="campaign-metrics">
              <span class="metric-value">€980</span>
              <span class="metric-label">Dépensé</span>
            </div>
          </div>

          <div class="campaign-item">
            <div class="campaign-info">
              <div class="campaign-icon tiktok">
                <span class="tiktok-icon">T</span>
              </div>
              <div class="campaign-details">
                <h4 class="campaign-name">TikTok Ads - Génération Z</h4>
                <p class="campaign-status active">Active</p>
              </div>
            </div>
            <div class="campaign-metrics">
              <span class="metric-value">€1,250</span>
              <span class="metric-label">Dépensé</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Channel Performance -->
      <div class="channels-card">
        <div class="card-header">
          <h3 class="card-title">Performance par canal</h3>
          <button class="see-all-btn">
            Détails
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>

        <div class="channels-chart">
          <div class="donut-chart">
            <svg viewBox="0 0 100 100" class="donut-svg">
              <!-- Facebook -->
              <circle cx="50" cy="50" r="30" fill="none" stroke="#1877f2" stroke-width="8" 
                      stroke-dasharray="47.1 141.3" stroke-dashoffset="0"/>
              <!-- Google -->
              <circle cx="50" cy="50" r="30" fill="none" stroke="#4285f4" stroke-width="8" 
                      stroke-dasharray="37.7 150.7" stroke-dashoffset="-47.1"/>
              <!-- Instagram -->
              <circle cx="50" cy="50" r="30" fill="none" stroke="#e4405f" stroke-width="8" 
                      stroke-dasharray="28.3 160.1" stroke-dashoffset="-84.8"/>
              <!-- TikTok -->
              <circle cx="50" cy="50" r="30" fill="none" stroke="#000000" stroke-width="8" 
                      stroke-dasharray="75.4 112.9" stroke-dashoffset="-113.1"/>
            </svg>
            <div class="donut-center">
              <span class="total-value">€6,570</span>
              <span class="total-label">Total</span>
            </div>
          </div>
        </div>

        <div class="channels-legend">
          <div class="legend-item">
            <div class="legend-dot facebook"></div>
            <span class="legend-text">Facebook</span>
            <span class="legend-percentage">25%</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot google"></div>
            <span class="legend-text">Google</span>
            <span class="legend-percentage">20%</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot instagram"></div>
            <span class="legend-text">Instagram</span>
            <span class="legend-percentage">15%</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot tiktok"></div>
            <span class="legend-text">TikTok</span>
            <span class="legend-percentage">40%</span>
          </div>
        </div>
      </div>

      <!-- Top Performing Content -->
      <div class="content-card">
        <div class="card-header">
          <h3 class="card-title">Contenu performant</h3>
          <button class="see-all-btn">
            Voir tout
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>

        <div class="content-list">
          <div class="content-item">
            <img src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=60" 
                 alt="Content" class="content-image" />
            <div class="content-details">
              <h4 class="content-title">iPhone 15 Pro - Campagne Lancement</h4>
              <p class="content-metrics">2.1K likes • 450 partages</p>
            </div>
            <div class="content-performance">
              <span class="performance-value">4.2%</span>
              <span class="performance-label">CTR</span>
            </div>
          </div>

          <div class="content-item">
            <img src="https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=60" 
                 alt="Content" class="content-image" />
            <div class="content-details">
              <h4 class="content-title">MacBook Pro M3 - Vidéo Démo</h4>
              <p class="content-metrics">1.8K likes • 320 partages</p>
            </div>
            <div class="content-performance">
              <span class="performance-value">3.8%</span>
              <span class="performance-label">CTR</span>
            </div>
          </div>

          <div class="content-item">
            <img src="https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=60" 
                 alt="Content" class="content-image" />
            <div class="content-details">
              <h4 class="content-title">AirPods Pro - Stories Instagram</h4>
              <p class="content-metrics">950 likes • 180 partages</p>
            </div>
            <div class="content-performance">
              <span class="performance-value">5.1%</span>
              <span class="performance-label">CTR</span>
            </div>
          </div>

          <div class="content-item">
            <img src="https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=60" 
                 alt="Content" class="content-image" />
            <div class="content-details">
              <h4 class="content-title">Apple Watch - Fitness Challenge</h4>
              <p class="content-metrics">1.2K likes • 290 partages</p>
            </div>
            <div class="content-performance">
              <span class="performance-value">3.5%</span>
              <span class="performance-label">CTR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  Plus, 
  Download, 
  Eye, 
  MousePointer, 
  Target, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Facebook,
  Instagram
} from 'lucide-vue-next'

const selectedPeriod = ref('30d')
</script>

<style scoped>
.marketing-dashboard {
  padding: var(--space-6);
  background: #f8fafc;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-8);
}

.dashboard-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.dashboard-subtitle {
  color: var(--color-gray-600);
  font-size: var(--font-size-base);
}

.header-actions {
  display: flex;
  gap: var(--space-3);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: none;
  border-radius: var(--border-radius-lg);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-primary);
  color: white;
}

.action-btn.secondary {
  background: white;
  color: var(--color-gray-700);
  border: 1px solid var(--color-gray-300);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.kpi-card {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.kpi-card.impressions .kpi-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.kpi-card.clicks .kpi-icon {
  background: linear-gradient(135deg, #10b981 0%, #047857 100%);
}

.kpi-card.conversions .kpi-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
}

.kpi-card.roas .kpi-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.kpi-label {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  margin-bottom: var(--space-2);
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.kpi-trend.positive {
  color: var(--color-success);
}

.kpi-trend.negative {
  color: var(--color-error);
}

.performance-section {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-8);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
}

.period-selector select {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  background: white;
  font-size: var(--font-size-sm);
}

.performance-chart {
  height: 300px;
}

.chart-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-legend {
  display: flex;
  gap: var(--space-6);
  margin-bottom: var(--space-4);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: var(--border-radius-sm);
}

.legend-color.impressions {
  background: #3b82f6;
}

.legend-color.clicks {
  background: #10b981;
}

.legend-color.conversions {
  background: #8b5cf6;
}

.chart-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
}

.bottom-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.campaigns-card, .channels-card, .content-card {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.card-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
}

.see-all-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  background: none;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.see-all-btn:hover {
  gap: var(--space-2);
}

.campaigns-list, .content-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.campaign-item, .content-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-fast);
}

.campaign-item:hover, .content-item:hover {
  background: var(--color-gray-50);
}

.campaign-info, .content-details {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.campaign-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.campaign-icon.facebook {
  background: #1877f2;
}

.campaign-icon.google {
  background: #4285f4;
}

.campaign-icon.instagram {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
}

.campaign-icon.tiktok {
  background: #000000;
}

.google-icon, .tiktok-icon {
  font-weight: 700;
  font-size: var(--font-size-lg);
}

.campaign-details {
  flex: 1;
}

.campaign-name, .content-title {
  font-weight: 500;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
  font-size: var(--font-size-sm);
}

.campaign-status {
  font-size: var(--font-size-xs);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  font-weight: 500;
}

.campaign-status.active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.campaign-status.paused {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.campaign-metrics, .content-performance {
  text-align: right;
}

.metric-value, .performance-value {
  font-weight: 600;
  color: var(--color-gray-900);
  display: block;
  margin-bottom: var(--space-1);
}

.metric-label, .performance-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

.channels-chart {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-6);
}

.donut-chart {
  position: relative;
  width: 200px;
  height: 200px;
}

.donut-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.total-value {
  display: block;
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-gray-900);
}

.total-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.channels-legend {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.channels-legend .legend-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.facebook {
  background: #1877f2;
}

.legend-dot.google {
  background: #4285f4;
}

.legend-dot.instagram {
  background: #e4405f;
}

.legend-dot.tiktok {
  background: #000000;
}

.legend-text {
  flex: 1;
  margin-left: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.legend-percentage {
  font-weight: 600;
  color: var(--color-gray-900);
  font-size: var(--font-size-sm);
}

.content-image {
  width: 50px;
  height: 50px;
  border-radius: var(--border-radius-lg);
  object-fit: cover;
}

.content-metrics {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

@media (max-width: 1200px) {
  .bottom-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: var(--space-4);
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
}
</style>