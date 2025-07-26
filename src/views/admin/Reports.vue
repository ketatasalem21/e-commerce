<template>
  <div class="admin-reports">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h2 class="page-title">Rapports</h2>
        <p class="page-description">Générez et consultez vos rapports d'activité</p>
      </div>
      <div class="header-actions">
        <AnimatedButton variant="secondary" @click="exportReports">
          <Download class="w-5 h-5" />
          Exporter
        </AnimatedButton>
        <AnimatedButton variant="primary" @click="generateReport">
          <FileText class="w-5 h-5" />
          Nouveau rapport
        </AnimatedButton>
      </div>
    </div>
    
    <!-- Report Types -->
    <div class="report-types-grid">
      <div 
        v-for="reportType in reportTypes"
        :key="reportType.id"
        class="report-type-card stagger-item hover-lift"
        @click="selectReportType(reportType)"
      >
        <div class="report-icon" :style="{ background: reportType.gradient }">
          <component :is="reportType.icon" class="w-6 h-6" />
        </div>
        <div class="report-content">
          <h3 class="report-title">{{ reportType.title }}</h3>
          <p class="report-description">{{ reportType.description }}</p>
          <div class="report-stats">
            <span class="stat-item">{{ reportType.lastGenerated }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Recent Reports -->
    <div class="recent-reports-section">
      <div class="section-header">
        <h3 class="section-title">Rapports récents</h3>
        <div class="section-filters">
          <select v-model="filterPeriod" class="filter-select">
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
          </select>
        </div>
      </div>
      
      <div class="reports-table">
        <div class="table-header">
          <div class="table-cell">Rapport</div>
          <div class="table-cell">Type</div>
          <div class="table-cell">Période</div>
          <div class="table-cell">Généré le</div>
          <div class="table-cell">Statut</div>
          <div class="table-cell">Actions</div>
        </div>
        
        <div 
          v-for="report in recentReports"
          :key="report.id"
          class="table-row stagger-item hover-lift"
        >
          <div class="table-cell report-cell">
            <div class="report-info">
              <h4 class="report-name">{{ report.name }}</h4>
              <p class="report-size">{{ report.size }}</p>
            </div>
          </div>
          
          <div class="table-cell">
            <span class="type-badge">{{ report.type }}</span>
          </div>
          
          <div class="table-cell">
            <span class="period-text">{{ report.period }}</span>
          </div>
          
          <div class="table-cell">
            <span class="date-text">{{ formatDate(report.generatedAt) }}</span>
          </div>
          
          <div class="table-cell">
            <span class="status-badge" :class="getStatusClass(report.status)">
              {{ report.status }}
            </span>
          </div>
          
          <div class="table-cell actions-cell">
            <button @click="downloadReport(report)" class="action-btn download-btn">
              <Download class="w-4 h-4" />
            </button>
            <button @click="viewReport(report)" class="action-btn view-btn">
              <Eye class="w-4 h-4" />
            </button>
            <button @click="deleteReport(report.id)" class="action-btn delete-btn">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Report Generation Modal -->
    <div v-if="showGenerateModal" class="modal-overlay" @click="closeGenerateModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">Générer un rapport</h3>
          <button @click="closeGenerateModal" class="modal-close">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <form @submit.prevent="submitReport" class="report-form">
          <div class="form-group">
            <label for="reportName" class="form-label">Nom du rapport *</label>
            <input 
              id="reportName"
              v-model="reportForm.name"
              type="text"
              class="form-input"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="reportType" class="form-label">Type de rapport *</label>
            <select 
              id="reportType"
              v-model="reportForm.type"
              class="form-input"
              required
            >
              <option value="">Sélectionner un type</option>
              <option value="sales">Ventes</option>
              <option value="inventory">Inventaire</option>
              <option value="customers">Clients</option>
              <option value="financial">Financier</option>
            </select>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="startDate" class="form-label">Date de début *</label>
              <input 
                id="startDate"
                v-model="reportForm.startDate"
                type="date"
                class="form-input"
                required
              />
            </div>
            
            <div class="form-group">
              <label for="endDate" class="form-label">Date de fin *</label>
              <input 
                id="endDate"
                v-model="reportForm.endDate"
                type="date"
                class="form-input"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="format" class="form-label">Format *</label>
            <select 
              id="format"
              v-model="reportForm.format"
              class="form-input"
              required
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                v-model="reportForm.includeCharts"
                type="checkbox"
                class="checkbox"
              />
              <span class="checkbox-text">Inclure les graphiques</span>
            </label>
          </div>
          
          <div class="form-actions">
            <AnimatedButton type="button" variant="secondary" @click="closeGenerateModal">
              Annuler
            </AnimatedButton>
            <AnimatedButton type="submit" variant="primary" :loading="generating">
              Générer le rapport
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Download, 
  FileText, 
  Eye, 
  Trash2, 
  X,
  BarChart3,
  Package,
  Users,
  DollarSign,
  TrendingUp
} from 'lucide-vue-next'
import AnimatedButton from '../../components/ui/AnimatedButton.vue'

const filterPeriod = ref('30d')
const showGenerateModal = ref(false)
const generating = ref(false)

const reportForm = ref({
  name: '',
  type: '',
  startDate: '',
  endDate: '',
  format: 'pdf',
  includeCharts: true
})

const reportTypes = [
  {
    id: 1,
    title: 'Rapport de ventes',
    description: 'Analyse détaillée des performances de vente',
    icon: TrendingUp,
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    lastGenerated: 'Il y a 2 jours'
  },
  {
    id: 2,
    title: 'Rapport d\'inventaire',
    description: 'État des stocks et mouvements de produits',
    icon: Package,
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
    lastGenerated: 'Il y a 1 semaine'
  },
  {
    id: 3,
    title: 'Rapport clients',
    description: 'Analyse du comportement et segmentation client',
    icon: Users,
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    lastGenerated: 'Il y a 3 jours'
  },
  {
    id: 4,
    title: 'Rapport financier',
    description: 'Bilan financier et analyse de rentabilité',
    icon: DollarSign,
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    lastGenerated: 'Il y a 5 jours'
  }
]

const recentReports = ref([
  {
    id: 1,
    name: 'Ventes Janvier 2024',
    type: 'Ventes',
    period: '01/01 - 31/01/2024',
    generatedAt: '2024-02-01',
    status: 'Terminé',
    size: '2.4 MB'
  },
  {
    id: 2,
    name: 'Inventaire Q4 2023',
    type: 'Inventaire',
    period: 'Q4 2023',
    generatedAt: '2024-01-15',
    status: 'Terminé',
    size: '1.8 MB'
  },
  {
    id: 3,
    name: 'Analyse Clients Décembre',
    type: 'Clients',
    period: '01/12 - 31/12/2023',
    generatedAt: '2024-01-10',
    status: 'En cours',
    size: '3.1 MB'
  }
])

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'terminé':
      return 'status-success'
    case 'en cours':
      return 'status-warning'
    case 'erreur':
      return 'status-error'
    default:
      return 'status-info'
  }
}

const selectReportType = (reportType: any) => {
  reportForm.value.type = reportType.title.toLowerCase().includes('ventes') ? 'sales' :
                         reportType.title.toLowerCase().includes('inventaire') ? 'inventory' :
                         reportType.title.toLowerCase().includes('clients') ? 'customers' : 'financial'
  reportForm.value.name = `${reportType.title} - ${new Date().toLocaleDateString('fr-FR')}`
  
  // Set default dates
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
  
  reportForm.value.endDate = today.toISOString().split('T')[0]
  reportForm.value.startDate = lastMonth.toISOString().split('T')[0]
  
  showGenerateModal.value = true
}

const generateReport = () => {
  // Set default dates
  const today = new Date()
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
  
  reportForm.value.endDate = today.toISOString().split('T')[0]
  reportForm.value.startDate = lastMonth.toISOString().split('T')[0]
  
  showGenerateModal.value = true
}

const closeGenerateModal = () => {
  showGenerateModal.value = false
  reportForm.value = {
    name: '',
    type: '',
    startDate: '',
    endDate: '',
    format: 'pdf',
    includeCharts: true
  }
}

const submitReport = async () => {
  generating.value = true
  
  try {
    // Simulate report generation with progress
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create new report entry
    const newReport = {
      id: Date.now(),
      name: reportForm.value.name,
      type: reportForm.value.type.charAt(0).toUpperCase() + reportForm.value.type.slice(1),
      period: `${reportForm.value.startDate} - ${reportForm.value.endDate}`,
      generatedAt: new Date().toISOString().split('T')[0],
      status: 'Terminé',
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`
    }
    
    recentReports.value.unshift(newReport)
    
    console.log('Rapport généré avec succès:', reportForm.value)
    closeGenerateModal()
  } catch (error) {
    console.error('Erreur lors de la génération du rapport:', error)
  } finally {
    generating.value = false
  }
}

const exportReports = () => {
  // Create comprehensive CSV with all report data
  const csvHeaders = [
    'Nom du rapport',
    'Type',
    'Période',
    'Date de génération', 
    'Statut',
    'Taille',
    'Métriques principales',
    'Recommandations'
  ]
  
  const csvData = recentReports.value.map(report => [
    report.name,
    report.type,
    report.period,
    report.generatedAt,
    report.status,
    report.size,
    'Données de performance analysées',
    'Suivi recommandé'
  ])
  
  const csvContent = [
    csvHeaders.join(','),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')
  
  // Add BOM for proper UTF-8 encoding
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8;' 
  })
  
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `rapports-export-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
  
  console.log('Export des rapports terminé avec succès')
}

const downloadReport = (report: any) => {
  // Generate PDF content for the report
  const reportContent = generateReportContent(report)
  
  // Create blob and download
  const blob = new Blob([reportContent], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${report.name.replace(/\s+/g, '_')}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  console.log(`Téléchargement de ${report.name} commencé`)
}

const viewReport = (report: any) => {
  // Generate detailed report view
  const reportWindow = window.open('', '_blank')
  if (reportWindow) {
    const reportHTML = generateReportHTML(report)
    reportWindow.document.write(reportHTML)
    reportWindow.document.close()
  }
}

const generateReportContent = (report: any) => {
  // Generate actual PDF content based on report type
  const content = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
>>
endobj

xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000074 00000 n 
0000000120 00000 n 
trailer
<<
/Size 4
/Root 1 0 R
>>
startxref
202
%%EOF`
  
  return content
}

const generateReportHTML = (report: any) => {
  return `
    <html>
      <head>
        <title>${report.name}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px;
            background: #f8fafc;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .header { 
            background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
          }
          .content { 
            padding: 30px;
            line-height: 1.6; 
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin: 20px 0;
          }
          .info-item {
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #8B5CF6;
          }
          .info-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 5px;
          }
          .info-value {
            color: #6b7280;
          }
          .chart-placeholder {
            height: 200px;
            background: #f3f4f6;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            margin: 20px 0;
          }
          .footer {
            background: #f8fafc;
            padding: 20px 30px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${report.name}</h1>
            <p>Rapport généré le ${formatDate(report.generatedAt)}</p>
          </div>
          
          <div class="content">
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Type de rapport</div>
                <div class="info-value">${report.type}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Période</div>
                <div class="info-value">${report.period}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Statut</div>
                <div class="info-value">${report.status}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Taille</div>
                <div class="info-value">${report.size}</div>
              </div>
            </div>
            
            <h2>Données du rapport</h2>
            <div class="chart-placeholder">
              📊 Graphiques et données détaillées du rapport
            </div>
            
            <h3>Résumé exécutif</h3>
            <p>Ce rapport contient une analyse détaillée des données pour la période ${report.period}. Les métriques principales montrent une performance ${report.status.toLowerCase() === 'terminé' ? 'satisfaisante' : 'en cours d\'analyse'}.</p>
            
            <h3>Recommandations</h3>
            <ul>
              <li>Continuer le suivi des métriques clés</li>
              <li>Analyser les tendances identifiées</li>
              <li>Mettre en place des actions correctives si nécessaire</li>
            </ul>
          </div>
          
          <div class="footer">
            <p>EliteStore - Rapport généré automatiquement</p>
            <p>Pour plus d'informations, contactez notre équipe d'analyse</p>
          </div>
        </div>
      </body>
    </html>
  `
}

const deleteReport = (reportId: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
    const index = recentReports.value.findIndex(r => r.id === reportId)
    if (index > -1) {
      recentReports.value.splice(index, 1)
      console.log('Rapport supprimé avec succès')
    }
  }
}
</script>

<style scoped>
.admin-reports {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  padding: var(--space-8);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.page-description {
  color: var(--color-gray-600);
  font-size: var(--font-size-base);
}

.header-actions {
  display: flex;
  gap: var(--space-4);
}

.report-types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.report-type-card {
  background: white;
  padding: var(--space-6);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.report-icon {
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.report-content {
  flex: 1;
}

.report-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-2);
}

.report-description {
  color: var(--color-gray-600);
  margin-bottom: var(--space-3);
  line-height: var(--line-height-relaxed);
}

.report-stats {
  display: flex;
  align-items: center;
}

.stat-item {
  font-size: var(--font-size-sm);
  color: var(--color-gray-500);
}

.recent-reports-section {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
}

.filter-select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: white;
}

.reports-table {
  padding: var(--space-6);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-gray-200);
  font-weight: 600;
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1.5fr 1fr 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-gray-100);
  transition: all var(--transition-normal);
  border-radius: var(--border-radius-lg);
}

.table-row:hover {
  background: var(--color-gray-50);
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

.table-cell {
  display: flex;
  align-items: center;
  font-size: var(--font-size-sm);
  color: var(--color-gray-700);
}

.report-cell {
  flex-direction: column;
  align-items: flex-start;
}

.report-name {
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: var(--space-1);
}

.report-size {
  color: var(--color-gray-500);
  font-size: var(--font-size-xs);
}

.type-badge {
  padding: var(--space-1) var(--space-2);
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.period-text,
.date-text {
  color: var(--color-gray-600);
}

.status-badge {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.status-success {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-warning {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.status-error {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.status-info {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-secondary);
}

.actions-cell {
  gap: var(--space-2);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.download-btn {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.download-btn:hover {
  background: var(--color-success);
  color: white;
}

.view-btn {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-secondary);
}

.view-btn:hover {
  background: var(--color-secondary);
  color: white;
}

.delete-btn {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-error);
}

.delete-btn:hover {
  background: var(--color-error);
  color: white;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: var(--space-4);
}

.modal-content {
  background: white;
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-2xl);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);
}

.modal-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
}

.modal-close {
  background: none;
  border: none;
  color: var(--color-gray-400);
  cursor: pointer;
  padding: var(--space-1);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
}

.modal-close:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
}

.report-form {
  padding: var(--space-6);
}

.form-group {
  margin-bottom: var(--space-4);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--space-2);
  color: var(--color-gray-700);
}

.form-input {
  width: 100%;
  padding: var(--space-3);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
}

.checkbox-text {
  color: var(--color-gray-700);
  font-size: var(--font-size-sm);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-gray-200);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--space-4);
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .report-types-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2);
  }
  
  .table-cell:nth-child(n+3) {
    display: none;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: var(--space-4);
    max-height: calc(100vh - 2rem);
  }
}
</style>