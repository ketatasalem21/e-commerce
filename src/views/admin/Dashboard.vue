<template>
  <div class="ecommerce-dashboard">
    <!-- Header with Period Selector -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">E-commerce Dashboard</h1>
        <p class="dashboard-subtitle">Vue d'ensemble des performances de votre boutique</p>
      </div>
      <div class="period-selector">
        <select v-model="selectedPeriod" class="period-select">
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>

    <!-- Main KPI Cards -->
    <div class="kpi-cards">
      <div class="kpi-card sales-rate">
        <div class="kpi-header">
          <h3 class="kpi-title">Sales Rate</h3>
          <select class="kpi-period">
            <option>Hourly</option>
          </select>
        </div>
        <div class="kpi-value">$256,137.48</div>
        <div class="kpi-chart">
          <div class="mini-chart black-bars">
            <div v-for="i in 12" :key="i" class="chart-bar" :style="{ height: `${Math.random() * 100}%` }"></div>
          </div>
        </div>
        <div class="kpi-trend positive">
          <TrendingUp class="w-4 h-4" />
          <span>+24% total orders compared last month</span>
        </div>
      </div>

      <div class="kpi-card new-customers">
        <div class="kpi-header">
          <h3 class="kpi-title">New Customer</h3>
          <select class="kpi-period">
            <option>Hourly</option>
          </select>
        </div>
        <div class="kpi-value">17,435</div>
        <div class="kpi-chart">
          <div class="mini-chart purple-bars">
            <div v-for="i in 12" :key="i" class="chart-bar" :style="{ height: `${Math.random() * 100}%` }"></div>
          </div>
        </div>
        <div class="kpi-trend positive">
          <TrendingUp class="w-4 h-4" />
          <span>+12% total orders compared last month</span>
        </div>
      </div>

      <div class="kpi-card avg-order">
        <div class="kpi-header">
          <h3 class="kpi-title">AVG. Monthly Order</h3>
          <select class="kpi-period">
            <option>Hourly</option>
          </select>
        </div>
        <div class="kpi-value">32,048</div>
        <div class="kpi-chart">
          <div class="mini-chart blue-bars">
            <div v-for="i in 12" :key="i" class="chart-bar" :style="{ height: `${Math.random() * 100}%` }"></div>
          </div>
        </div>
        <div class="kpi-trend positive">
          <TrendingUp class="w-4 h-4" />
          <span>+40% total orders compared last month</span>
        </div>
      </div>
    </div>

    <!-- E-commerce Overview Chart -->
    <div class="overview-section">
      <div class="section-header">
        <div class="section-info">
          <h2 class="section-title">E-Commerce Overview</h2>
          <p class="section-subtitle">Trends summary, performance analysis</p>
        </div>
        <select class="period-select">
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>
      
      <div class="overview-chart">
        <div class="chart-container">
          <div class="chart-y-axis">
            <span>300</span>
            <span>200</span>
            <span>100</span>
            <span>0</span>
          </div>
          <div class="chart-bars">
            <div v-for="(data, index) in chartData" :key="index" class="chart-column">
              <div class="stacked-bar">
                <div class="bar-segment light-blue" :style="{ height: `${data.value1}%` }"></div>
                <div class="bar-segment dark-blue" :style="{ height: `${data.value2}%` }"></div>
              </div>
              <span class="chart-label">{{ data.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Section with 3 Cards -->
    <div class="bottom-section">
      <!-- Social Media Users -->
      <div class="info-card social-media">
        <div class="card-header">
          <h3 class="card-title">Social media users</h3>
          <button class="see-all-btn">
            See All
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        
        <div class="social-stats">
          <div class="social-number">72,742,74</div>
          <div class="social-growth positive">12%</div>
        </div>

        <div class="social-chart">
          <div class="weekly-chart">
            <div class="chart-days">
              <span>Su</span><span>Mn</span><span>Tu</span><span>Wd</span><span>Th</span><span>Fr</span><span>St</span>
            </div>
            <div class="chart-bars-weekly">
              <div v-for="i in 7" :key="i" class="weekly-bar" :style="{ height: `${Math.random() * 100}%` }"></div>
            </div>
          </div>
        </div>

        <div class="social-platforms">
          <div class="platform-item">
            <div class="platform-info">
              <Facebook class="w-5 h-5 text-blue-600" />
              <span>Facebook</span>
            </div>
            <span class="platform-value">2685</span>
          </div>
          <div class="platform-item">
            <div class="platform-info">
              <Instagram class="w-5 h-5 text-pink-500" />
              <span>Instagram</span>
            </div>
            <span class="platform-value">2399</span>
          </div>
          <div class="platform-item">
            <div class="platform-info">
              <Twitter class="w-5 h-5 text-blue-400" />
              <span>X.com</span>
            </div>
            <span class="platform-value">2334</span>
          </div>
          <div class="platform-item">
            <div class="platform-info">
              <div class="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">R</span>
              </div>
              <span>Reddit</span>
            </div>
            <span class="platform-value">2884</span>
          </div>
        </div>
      </div>

      <!-- Orders -->
      <div class="info-card orders">
        <div class="card-header">
          <h3 class="card-title">Orders</h3>
          <button class="see-all-btn">
            See All
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        
        <div class="orders-list">
          <div class="order-item">
            <img src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=60" alt="iPhone" class="order-image" />
            <div class="order-details">
              <h4 class="order-name">iPhone 15 Pro 1T</h4>
              <p class="order-date">Feb 20, 2024</p>
            </div>
            <div class="order-status">
              <span class="status-badge pending">Pending</span>
              <span class="order-id">3543867</span>
            </div>
          </div>
          
          <div class="order-item">
            <img src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=60" alt="iPhone" class="order-image" />
            <div class="order-details">
              <h4 class="order-name">iPhone 13 Pro 256GB</h4>
              <p class="order-date">Feb 16, 2024</p>
            </div>
            <div class="order-status">
              <span class="status-badge pending">Pending</span>
              <span class="order-id">6243789</span>
            </div>
          </div>
          
          <div class="order-item">
            <img src="https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=60" alt="Apple Watch" class="order-image" />
            <div class="order-details">
              <h4 class="order-name">Apple Watch 7 41mm</h4>
              <p class="order-date">Feb 11, 2024</p>
            </div>
            <div class="order-status">
              <span class="status-badge sent">Sent</span>
              <span class="order-id">9763474</span>
            </div>
          </div>
          
          <div class="order-item">
            <img src="https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=60" alt="AirPods" class="order-image" />
            <div class="order-details">
              <h4 class="order-name">AirPods Pro</h4>
              <p class="order-date">Feb 09, 2024</p>
            </div>
            <div class="order-status">
              <span class="status-badge sent">Sent</span>
              <span class="order-id">2538268</span>
            </div>
          </div>
          
          <div class="order-item">
            <img src="https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=60" alt="Apple Watch" class="order-image" />
            <div class="order-details">
              <h4 class="order-name">Apple Watch 8 44mm</h4>
              <p class="order-date">Feb 08, 2024</p>
            </div>
            <div class="order-status">
              <span class="status-badge sent">Sent</span>
              <span class="order-id">9572345</span>
            </div>
          </div>
          
          <div class="order-item">
            <img src="https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=60" alt="iPhone" class="order-image" />
            <div class="order-details">
              <h4 class="order-name">iPhone 13 Pro 128GB</h4>
              <p class="order-date">Feb 07, 2024</p>
            </div>
            <div class="order-status">
              <span class="status-badge sent">Sent</span>
              <span class="order-id">1247247</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Media Revenue -->
      <div class="info-card revenue">
        <div class="card-header">
          <h3 class="card-title">Social media revenue</h3>
          <button class="see-all-btn">
            See All
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        
        <div class="revenue-stats">
          <div class="revenue-number">$192,742,74</div>
          <div class="revenue-growth positive">27%</div>
        </div>

        <div class="revenue-chart">
          <div class="weekly-chart">
            <div class="chart-days">
              <span>Su</span><span>Mn</span><span>Tu</span><span>Wd</span><span>Th</span><span>Fr</span><span>St</span>
            </div>
            <div class="chart-bars-stacked">
              <div v-for="i in 7" :key="i" class="stacked-column">
                <div class="stack-segment orange" :style="{ height: `${20 + Math.random() * 30}%` }"></div>
                <div class="stack-segment purple" :style="{ height: `${20 + Math.random() * 30}%` }"></div>
                <div class="stack-segment blue" :style="{ height: `${20 + Math.random() * 30}%` }"></div>
                <div class="stack-segment yellow" :style="{ height: `${20 + Math.random() * 30}%` }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="revenue-platforms">
          <div class="revenue-platform">
            <div class="platform-info">
              <Facebook class="w-5 h-5 text-blue-600" />
              <span>Facebook</span>
            </div>
            <span class="platform-revenue">$2672.83</span>
          </div>
          <div class="revenue-platform">
            <div class="platform-info">
              <Instagram class="w-5 h-5 text-pink-500" />
              <span>Instagram</span>
            </div>
            <span class="platform-revenue">$2973.83</span>
          </div>
          <div class="revenue-platform">
            <div class="platform-info">
              <Twitter class="w-5 h-5 text-blue-400" />
              <span>X.com</span>
            </div>
            <span class="platform-revenue">$2545.50</span>
          </div>
          <div class="revenue-platform">
            <div class="platform-info">
              <div class="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs font-bold">R</span>
              </div>
              <span>Reddit</span>
            </div>
            <span class="platform-revenue">$2340.33</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TrendingUp, ChevronRight, Facebook, Instagram, Twitter } from 'lucide-vue-next'

const selectedPeriod = ref('weekly')

const chartData = [
  { label: 'Aug 17, 2023', value1: 60, value2: 40 },
  { label: 'Aug 24, 2023', value1: 80, value2: 50 },
  { label: 'Aug 31, 2023', value1: 70, value2: 45 },
  { label: 'Sep 7, 2023', value1: 75, value2: 48 },
  { label: 'Sep 14, 2023', value1: 65, value2: 42 },
  { label: 'Sep 21, 2023', value1: 55, value2: 38 },
  { label: 'Sep 28, 2023', value1: 50, value2: 35 },
  { label: 'Oct 5, 2023', value1: 60, value2: 40 },
  { label: 'Oct 12, 2023', value1: 70, value2: 45 },
  { label: 'Oct 19, 2023', value1: 75, value2: 48 },
  { label: 'Oct 26, 2023', value1: 80, value2: 50 },
  { label: 'Nov 2, 2023', value1: 85, value2: 52 }
]
</script>

<style scoped>
.ecommerce-dashboard {
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

.period-selector {
  display: flex;
  gap: var(--space-3);
}

.period-select {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-lg);
  background: white;
  font-size: var(--font-size-sm);
}

.kpi-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.kpi-card {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.kpi-title {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
  font-weight: 500;
}

.kpi-period {
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  background: white;
}

.kpi-value {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--space-4);
}

.kpi-chart {
  margin-bottom: var(--space-4);
}

.mini-chart {
  display: flex;
  align-items: end;
  gap: 4px;
  height: 60px;
}

.chart-bar {
  flex: 1;
  border-radius: 2px;
  min-height: 8px;
}

.black-bars .chart-bar {
  background: #1f2937;
}

.purple-bars .chart-bar {
  background: #8b5cf6;
}

.blue-bars .chart-bar {
  background: #3b82f6;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
}

.kpi-trend.positive {
  color: var(--color-success);
}

.overview-section {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-8);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-6);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.section-subtitle {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.overview-chart {
  height: 300px;
}

.chart-container {
  display: flex;
  height: 100%;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-right: var(--space-4);
  color: var(--color-gray-500);
  font-size: var(--font-size-sm);
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: end;
  gap: var(--space-4);
}

.chart-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.stacked-bar {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 2px;
}

.bar-segment {
  border-radius: 4px;
}

.bar-segment.light-blue {
  background: #bfdbfe;
}

.bar-segment.dark-blue {
  background: #3b82f6;
}

.chart-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
  transform: rotate(-45deg);
  white-space: nowrap;
}

.bottom-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

.info-card {
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
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  background: none;
  border: none;
  cursor: pointer;
  transition: color var(--transition-fast);
}

.see-all-btn:hover {
  color: var(--color-primary);
}

.social-stats, .revenue-stats {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.social-number, .revenue-number {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
}

.social-growth, .revenue-growth {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.social-growth.positive, .revenue-growth.positive {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.social-chart, .revenue-chart {
  margin-bottom: var(--space-6);
}

.weekly-chart {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.chart-days {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

.chart-bars-weekly {
  display: flex;
  align-items: end;
  gap: var(--space-2);
  height: 60px;
}

.weekly-bar {
  flex: 1;
  background: #3b82f6;
  border-radius: 2px;
  min-height: 8px;
}

.chart-bars-stacked {
  display: flex;
  align-items: end;
  gap: var(--space-2);
  height: 60px;
}

.stacked-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: end;
  gap: 1px;
}

.stack-segment {
  border-radius: 1px;
}

.stack-segment.orange { background: #f97316; }
.stack-segment.purple { background: #8b5cf6; }
.stack-segment.blue { background: #3b82f6; }
.stack-segment.yellow { background: #eab308; }

.social-platforms, .revenue-platforms {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.platform-item, .revenue-platform {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.platform-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.platform-value, .platform-revenue {
  font-weight: 600;
  color: var(--color-gray-900);
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.order-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.order-image {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-md);
  object-fit: cover;
}

.order-details {
  flex: 1;
}

.order-name {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.order-date {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

.order-status {
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: var(--space-1);
}

.status-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.status-badge.sent {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.order-id {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

@media (max-width: 1200px) {
  .bottom-section {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
}

@media (max-width: 768px) {
  .kpi-cards {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: var(--space-4);
  }
}
</style>