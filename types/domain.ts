// User roles in the system
export type UserRole = "owner" | "admin" | "manager" | "peon"

// User interface
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  permissions: string[]
  createdAt: Date
  lastLogin?: Date
  isActive: boolean
}

// Flock/Parvada related types
export interface Flock {
  id: string
  name: string
  breed: string
  quantity: number
  age: number
  galpon: string
  startDate: Date
  status: "active" | "inactive" | "completed"
}

// Production metrics
export interface ProductionMetrics {
  date: Date
  flockId: string
  eggProduction: number
  mortality: number
  feed: number
  weight: number
  fcr: number
}

// IoT sensor data
export interface SensorData {
  id: string
  galpon: string
  temperature: number
  humidity: number
  timestamp: Date
  status: "normal" | "warning" | "critical"
}

// Alert types
export interface Alert {
  id: string
  type: "temperature" | "humidity" | "mortality" | "production" | "system"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  galpon?: string
  timestamp: Date
  isRead: boolean
  isResolved: boolean
}

// Batch/Lote for production cycle
export interface Batch {
  id: string
  name: string
  breed: string
  quantity: number
  startDate: Date
  expectedEndDate: Date
  galpon: string
  status: "planning" | "active" | "completed"
  currentWeek: number
  totalWeeks: number
}

// Event types for treatments and activities
export interface Event {
  id: string
  type: "vaccination" | "medication" | "feeding" | "cleaning" | "inspection" | "other"
  title: string
  description: string
  galpon: string
  date: Date
  responsible: string
  status: "pending" | "completed" | "cancelled"
  cost?: number
}

// Document types
export interface Document {
  id: string
  name: string
  type: "report" | "certificate" | "invoice" | "manual" | "other"
  url: string
  uploadDate: Date
  uploadedBy: string
  size: number
  tags: string[]
}

// Cost analysis
export interface CostAnalysis {
  period: string
  galpon: string
  feedCost: number
  laborCost: number
  utilitiesCost: number
  medicationCost: number
  totalCost: number
  revenue: number
  profit: number
  fcr: number
  fep: number // Feed Efficiency Percentage
}

// Breeder/Reproductora specific types
export interface BreederBatch {
  id: string
  name: string
  breed: string
  quantity: number
  startDate: Date
  galpon: string
  phase: "crianza" | "postura"
  currentWeek: number
  status: "active" | "inactive" | "completed"
}

// Hatch/Incubación types
export interface HatchBatch {
  id: string
  name: string
  eggQuantity: number
  startDate: Date
  expectedHatchDate: Date
  incubator: string
  status: "incubating" | "hatching" | "completed" | "failed"
  hatchability?: number
  fertility?: number
}

// Traceability chain
export interface TraceabilityRecord {
  id: string
  batchId: string
  event: string
  description: string
  date: Date
  responsible: string
  location: string
  previousRecord?: string
  nextRecord?: string
}
