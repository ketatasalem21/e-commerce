<template>
  <div class="banking-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="breadcrumb">
        <Home class="w-4 h-4" />
        <ChevronRight class="w-4 h-4" />
        <span>Banking</span>
        <ChevronRight class="w-4 h-4" />
        <span class="current">Overview</span>
      </div>
    </div>

    <!-- Total Balance Card -->
    <div class="total-balance-card">
      <div class="balance-content">
        <h2 class="balance-title">Total Balance</h2>
        <div class="balance-amount">$673,742.90</div>
        <div class="balance-change positive">
          <TrendingUp class="w-4 h-4" />
          <span>17%</span>
        </div>
        <div class="balance-comparison">
          Compared to last month $148,157.94
        </div>
      </div>
      <div class="balance-visual">
        <div class="circle-chart">
          <svg viewBox="0 0 100 100" class="circular-chart">
            <path d="M 50,50 m 0,-40 a 40,40 0 1,1 0,80 a 40,40 0 1,1 0,-80" 
                  stroke="#e5e7eb" stroke-width="8" fill="none"/>
            <path d="M 50,50 m 0,-40 a 40,40 0 1,1 0,80 a 40,40 0 1,1 0,-80" 
                  stroke="url(#gradient)" stroke-width="8" fill="none"
                  stroke-dasharray="251.2" stroke-dashoffset="75.36"/>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#3b82f6"/>
                <stop offset="100%" style="stop-color:#8b5cf6"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>

    <!-- Currency Cards -->
    <div class="currency-grid">
      <div class="currency-card">
        <div class="currency-header">
          <h3 class="currency-code">USD</h3>
          <button class="more-btn">
            <MoreHorizontal class="w-4 h-4" />
          </button>
        </div>
        <div class="currency-amount">$178,942.11</div>
        <div class="currency-change positive">72%</div>
        <div class="currency-comparison">Compared to last month $48,157.94</div>
      </div>

      <div class="currency-card">
        <div class="currency-header">
          <h3 class="currency-code">EUR</h3>
          <button class="more-btn">
            <MoreHorizontal class="w-4 h-4" />
          </button>
        </div>
        <div class="currency-amount">€93,942.62</div>
        <div class="currency-change positive">10%</div>
        <div class="currency-comparison">Compared to last month €12,163.11</div>
      </div>

      <div class="currency-card">
        <div class="currency-header">
          <h3 class="currency-code">GBP</h3>
          <button class="more-btn">
            <MoreHorizontal class="w-4 h-4" />
          </button>
        </div>
        <div class="currency-amount">£17,942.33</div>
        <div class="currency-change positive">5%</div>
        <div class="currency-comparison">Compared to last month £2,983.74</div>
      </div>

      <div class="currency-card">
        <div class="currency-header">
          <h3 class="currency-code">TRY</h3>
          <button class="more-btn">
            <MoreHorizontal class="w-4 h-4" />
          </button>
        </div>
        <div class="currency-amount">TRY 142,409.01</div>
        <div class="currency-change negative">12%</div>
        <div class="currency-comparison">Compared to last month TRY 134,023.01</div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="bottom-section">
      <!-- Chart Section -->
      <div class="chart-section">
        <div class="chart-header">
          <div class="chart-amount">$278,942.12</div>
          <div class="chart-change positive">
            <TrendingUp class="w-4 h-4" />
            <span>4%</span>
          </div>
          <div class="chart-comparison">From $48,157.94</div>
        </div>

        <div class="period-tabs">
          <button class="period-tab active">Weekly</button>
          <button class="period-tab">Monthly</button>
          <button class="period-tab">Yearly</button>
        </div>

        <div class="main-chart">
          <div class="chart-container">
            <div class="chart-y-axis">
              <span>20K</span>
              <span>10K</span>
              <span>0</span>
              <span>10K</span>
              <span>20K</span>
            </div>
            <div class="chart-bars">
              <div v-for="(month, index) in months" :key="index" class="chart-column">
                <div class="stacked-bar">
                  <div class="bar-negative" :style="{ height: `${Math.random() * 60 + 20}px` }"></div>
                  <div class="bar-positive" :style="{ height: `${Math.random() * 80 + 40}px` }"></div>
                </div>
                <span class="chart-label">{{ month }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-legend">
          <div class="legend-item">
            <div class="legend-icon income">
              <BarChart3 class="w-4 h-4" />
            </div>
            <div class="legend-content">
              <span class="legend-label">Income</span>
              <span class="legend-value">$178,232.03</span>
              <span class="legend-change positive">↗ 52%</span>
            </div>
          </div>
          <div class="legend-item">
            <div class="legend-icon expenses">
              <BarChart3 class="w-4 h-4" />
            </div>
            <div class="legend-content">
              <span class="legend-label">Expenses</span>
              <span class="legend-value">$59,723.12</span>
              <span class="legend-change negative">↘ 12%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Section -->
      <div class="card-section">
        <div class="credit-card">
          <div class="card-header">
            <div class="card-logo">
              <div class="logo-circle orange"></div>
              <div class="logo-circle blue"></div>
            </div>
            <div class="card-brand">Avalon</div>
            <div class="card-type">
              <Wifi class="w-5 h-5" />
            </div>
          </div>
          
          <div class="card-number">
            <span class="dots">++++</span>
            <span class="dots">++++</span>
            <span class="dots">++++</span>
            <span class="visible-digits">5268</span>
          </div>
          
          <div class="card-holder">Aaron Swartz</div>
          
          <div class="card-nav">
            <button class="nav-btn">
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button class="nav-btn">
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="card-details">
          <div class="detail-row">
            <span class="detail-label">Card Number</span>
            <span class="detail-value">
              <div class="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></div>
              •••• 7203
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Expiry Date</span>
            <span class="detail-value">
              <div class="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></div>
              03/33
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">CVC</span>
            <span class="detail-value">
              <div class="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></div>
              ++++
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Spend Limit</span>
            <span class="detail-value">$72,000.00</span>
          </div>
          
          <div class="spend-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 82%"></div>
            </div>
            <div class="spend-amounts">
              <div class="spent">
                <span class="amount-label">Spent</span>
                <span class="amount-value">$59,611.00</span>
              </div>
              <div class="remaining">
                <span class="amount-label">Spent</span>
                <span class="amount-value">$12,389.00</span>
              </div>
            </div>
          </div>

          <div class="card-tabs">
            <button class="card-tab">Card Detail</button>
            <button class="card-tab">Limit</button>
            <button class="card-tab active">More</button>
          </div>

          <div class="spending-tabs">
            <button class="spending-tab">Daily</button>
            <button class="spending-tab active">Weekly</button>
            <button class="spending-tab">Monthly</button>
          </div>

          <div class="daily-amount">
            <span class="amount-label">Amount spent per day</span>
            <span class="amount-value">$1,172.83</span>
          </div>

          <div class="transactions">
            <div class="transaction-item">
              <div class="transaction-icon openai">
                <span>AI</span>
              </div>
              <div class="transaction-details">
                <span class="transaction-name">Open AI</span>
                <span class="transaction-date">May 29th, 2024</span>
              </div>
              <span class="transaction-amount negative">- $15.00 USD</span>
            </div>
            
            <div class="transaction-item">
              <div class="transaction-icon adobe">
                <span>A</span>
              </div>
              <div class="transaction-details">
                <span class="transaction-name">Adobe</span>
                <span class="transaction-date">May 22th, 2024</span>
              </div>
              <span class="transaction-amount negative">- $8.00 USD</span>
            </div>
            
            <div class="transaction-item">
              <div class="transaction-icon framer">
                <span>F</span>
              </div>
              <div class="transaction-details">
                <span class="transaction-name">Framer</span>
                <span class="transaction-date">May 16th, 2024</span>
              </div>
              <span class="transaction-amount negative">- $19.00 USD</span>
            </div>
            
            <div class="transaction-item">
              <div class="transaction-icon spotify">
                <span>S</span>
              </div>
              <div class="transaction-details">
                <span class="transaction-name">Spotify</span>
                <span class="transaction-date">May 12th, 2024</span>
              </div>
              <span class="transaction-amount negative">- $9.99 USD</span>
            </div>
          </div>

          <button class="see-all-transactions">
            <Eye class="w-4 h-4" />
            See All Transactions
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Home, 
  ChevronRight, 
  TrendingUp, 
  MoreHorizontal, 
  BarChart3,
  Wifi,
  ChevronLeft,
  Eye
} from 'lucide-vue-next'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
</script>

<style scoped>
.banking-dashboard {
  padding: var(--space-6);
  background: #f8fafc;
  min-height: 100vh;
}

.dashboard-header {
  margin-bottom: var(--space-8);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.breadcrumb .current {
  color: var(--color-gray-900);
  font-weight: 500;
}

.total-balance-card {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  padding: var(--space-8);
  border-radius: var(--border-radius-2xl);
  color: white;
  margin-bottom: var(--space-8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.balance-content {
  flex: 1;
}

.balance-title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--space-4);
  opacity: 0.9;
}

.balance-amount {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.balance-change {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  background: rgba(255, 255, 255, 0.2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.balance-comparison {
  opacity: 0.8;
  font-size: var(--font-size-sm);
}

.balance-visual {
  width: 200px;
  height: 200px;
  position: relative;
}

.circle-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.circular-chart {
  width: 100%;
  height: 100%;
}

.currency-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

.currency-card {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
}

.currency-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.currency-code {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
}

.more-btn {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
}

.more-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.currency-amount {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.currency-change {
  display: inline-block;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--space-2);
}

.currency-change.positive {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.currency-change.negative {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.currency-comparison {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.bottom-section {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-8);
}

.chart-section {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
}

.chart-header {
  margin-bottom: var(--space-6);
}

.chart-amount {
  font-size: var(--font-size-3xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.chart-change {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-success);
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--space-1);
}

.chart-comparison {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.period-tabs {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-6);
}

.period-tab {
  padding: var(--space-2) var(--space-4);
  border: none;
  background: none;
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.period-tab.active {
  background: var(--color-gray-100);
  color: var(--color-gray-900);
  font-weight: 500;
}

.main-chart {
  height: 300px;
  margin-bottom: var(--space-6);
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
  align-items: center;
  gap: var(--space-3);
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bar-negative {
  background: #f97316;
  border-radius: 4px;
  width: 30px;
  margin-bottom: 2px;
}

.bar-positive {
  background: #3b82f6;
  border-radius: 4px;
  width: 30px;
}

.chart-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

.chart-legend {
  display: flex;
  gap: var(--space-8);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.legend-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.legend-icon.income {
  background: #3b82f6;
}

.legend-icon.expenses {
  background: #f97316;
}

.legend-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.legend-label {
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.legend-value {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
}

.legend-change {
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.legend-change.positive {
  color: var(--color-success);
}

.legend-change.negative {
  color: var(--color-error);
}

.card-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.credit-card {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  color: white;
  position: relative;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.card-logo {
  display: flex;
  gap: var(--space-1);
}

.logo-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.logo-circle.orange {
  background: #f97316;
}

.logo-circle.blue {
  background: #3b82f6;
}

.card-brand {
  font-size: var(--font-size-lg);
  font-weight: 600;
}

.card-number {
  display: flex;
  gap: var(--space-4);
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--space-4);
}

.dots {
  opacity: 0.7;
}

.card-holder {
  font-size: var(--font-size-base);
  margin-bottom: var(--space-4);
}

.card-nav {
  display: flex;
  gap: var(--space-2);
  justify-content: flex-end;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.card-details {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-sm);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.detail-label {
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
}

.detail-value {
  color: var(--color-gray-900);
  font-weight: 500;
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
}

.spend-progress {
  margin: var(--space-6) 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-gray-200);
  border-radius: var(--border-radius-full);
  overflow: hidden;
  margin-bottom: var(--space-3);
}

.progress-fill {
  height: 100%;
  background: var(--color-gray-900);
  border-radius: var(--border-radius-full);
}

.spend-amounts {
  display: flex;
  justify-content: space-between;
}

.spent, .remaining {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.amount-label {
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
}

.amount-value {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-gray-900);
}

.card-tabs {
  display: flex;
  gap: var(--space-1);
  margin: var(--space-6) 0;
}

.card-tab {
  padding: var(--space-2) var(--space-3);
  border: none;
  background: none;
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.card-tab.active {
  background: var(--color-gray-100);
  color: var(--color-gray-900);
  font-weight: 500;
}

.spending-tabs {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-4);
}

.spending-tab {
  padding: var(--space-2) var(--space-3);
  border: none;
  background: none;
  color: var(--color-gray-600);
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: var(--border-radius-md);
  transition: all var(--transition-fast);
}

.spending-tab.active {
  background: var(--color-gray-100);
  color: var(--color-gray-900);
  font-weight: 500;
}

.daily-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-6);
}

.transactions {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.transaction-icon.openai {
  background: #10b981;
}

.transaction-icon.adobe {
  background: #ef4444;
}

.transaction-icon.framer {
  background: #1f2937;
}

.transaction-icon.spotify {
  background: #22c55e;
}

.transaction-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.transaction-name {
  font-weight: 500;
  color: var(--color-gray-900);
}

.transaction-date {
  font-size: var(--font-size-xs);
  color: var(--color-gray-500);
}

.transaction-amount {
  font-weight: 600;
  font-size: var(--font-size-sm);
}

.transaction-amount.negative {
  color: var(--color-error);
}

.see-all-transactions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  background: none;
  color: var(--color-primary);
  border-radius: var(--border-radius-lg);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.see-all-transactions:hover {
  background: var(--color-gray-50);
  border-color: var(--color-primary);
}

@media (max-width: 1200px) {
  .bottom-section {
    grid-template-columns: 1fr;
  }
  
  .currency-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .currency-grid {
    grid-template-columns: 1fr;
  }
  
  .total-balance-card {
    flex-direction: column;
    text-align: center;
  }
  
  .balance-visual {
    width: 150px;
    height: 150px;
  }
}
</style>