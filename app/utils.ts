import type { UserRole, BreederBatch, HatchLoad, TraceChain, CostData } from "@/types/domain"

// Mock function to get current user role
// In a real app, this would come from authentication context or API
export function getCurrentUserRole(): UserRole {
  // Return a static role to avoid infinite loops during development
  // In production, this would be retrieved from auth context or localStorage
  return "admin" // Change this to test different roles: "admin", "owner", "manager", "peon"
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amount)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export function calculateAge(startDate: Date): number {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - startDate.getTime())
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
  return diffWeeks
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "normal":
    case "active":
      return "text-green-600"
    case "warning":
      return "text-yellow-600"
    case "critical":
    case "failed":
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

// Mock function to check if user has permission
export function hasPermission(requiredRole: UserRole): boolean {
  const currentRole = getCurrentUserRole()

  const roleHierarchy: Record<UserRole, number> = {
    peon: 1,
    manager: 2,
    admin: 3,
    owner: 4,
  }

  return roleHierarchy[currentRole] >= roleHierarchy[requiredRole]
}

// Mock data functions
export async function listBreederBatches(): Promise<BreederBatch[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: "REP-001",
      name: "Lote Reproductoras A",
      galpon: 1,
      birds: 5000,
      startDate: new Date("2024-01-15"),
      age: 25,
      phase: "postura",
      genetics: "Ross",
      status: "active",
      weeklyMetrics: [
        {
          week: 20,
          weight: 2800,
          uniformity: 85,
          mortality: 2.1,
          eggProduction: 75,
          feedConsumption: 165,
          date: new Date("2024-06-01"),
        },
        {
          week: 21,
          weight: 2850,
          uniformity: 87,
          mortality: 2.3,
          eggProduction: 82,
          feedConsumption: 168,
          date: new Date("2024-06-08"),
        },
        {
          week: 22,
          weight: 2900,
          uniformity: 86,
          mortality: 2.5,
          eggProduction: 88,
          feedConsumption: 170,
          date: new Date("2024-06-15"),
        },
        {
          week: 23,
          weight: 2920,
          uniformity: 88,
          mortality: 2.7,
          eggProduction: 91,
          feedConsumption: 172,
          date: new Date("2024-06-22"),
        },
        {
          week: 24,
          weight: 2940,
          uniformity: 89,
          mortality: 2.9,
          eggProduction: 93,
          feedConsumption: 174,
          date: new Date("2024-06-29"),
        },
        {
          week: 25,
          weight: 2960,
          uniformity: 90,
          mortality: 3.1,
          eggProduction: 94,
          feedConsumption: 175,
          date: new Date("2024-07-06"),
        },
      ],
    },
    {
      id: "REP-002",
      name: "Lote Reproductoras B",
      galpon: 2,
      birds: 4800,
      startDate: new Date("2024-03-01"),
      age: 15,
      phase: "crianza",
      genetics: "Cobb",
      status: "active",
      weeklyMetrics: [
        { week: 10, weight: 1200, uniformity: 82, mortality: 1.5, feedConsumption: 85, date: new Date("2024-05-10") },
        { week: 11, weight: 1350, uniformity: 84, mortality: 1.7, feedConsumption: 92, date: new Date("2024-05-17") },
        { week: 12, weight: 1500, uniformity: 85, mortality: 1.9, feedConsumption: 98, date: new Date("2024-05-24") },
        { week: 13, weight: 1650, uniformity: 86, mortality: 2.1, feedConsumption: 105, date: new Date("2024-05-31") },
        { week: 14, weight: 1800, uniformity: 87, mortality: 2.3, feedConsumption: 112, date: new Date("2024-06-07") },
        { week: 15, weight: 1950, uniformity: 88, mortality: 2.5, feedConsumption: 118, date: new Date("2024-06-14") },
      ],
    },
  ]
}

export async function listHatchLoads(): Promise<HatchLoad[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    {
      id: "INC-001",
      loadDate: new Date("2024-06-01"),
      eggCount: 15000,
      breederBatch: "REP-001",
      expectedHatchDate: new Date("2024-06-22"),
      hatchability: 87.5,
      status: "hatched",
    },
    {
      id: "INC-002",
      loadDate: new Date("2024-06-08"),
      eggCount: 14500,
      breederBatch: "REP-001",
      expectedHatchDate: new Date("2024-06-29"),
      status: "incubating",
    },
    {
      id: "INC-003",
      loadDate: new Date("2024-06-15"),
      eggCount: 16000,
      breederBatch: "REP-002",
      expectedHatchDate: new Date("2024-07-06"),
      status: "incubating",
    },
  ]
}

export async function getTraceChain(params: { broilerBatchId?: string; breederBatchId?: string }): Promise<TraceChain> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const breederBatches = await listBreederBatches()
  const hatchLoads = await listHatchLoads()

  return {
    broilerBatch: {
      id: "PAR-001",
      name: "Lote Broilers A",
      galpon: 3,
      birds: 12000,
      startDate: new Date("2024-06-22"),
      age: 6,
      phase: "engorde",
      genetics: "Ross",
      status: "active",
    },
    breederBatch: breederBatches[0],
    hatchLoad: hatchLoads[0],
    events: [
      {
        id: "EVT-001",
        type: "vaccination",
        date: new Date("2024-06-23"),
        description: "Vacunación Newcastle + Bronquitis",
        batchId: "PAR-001",
      },
      {
        id: "EVT-002",
        type: "medication",
        date: new Date("2024-06-30"),
        description: "Tratamiento preventivo coccidiosis",
        batchId: "PAR-001",
      },
      {
        id: "EVT-003",
        type: "transfer",
        date: new Date("2024-06-22"),
        description: "Transferencia desde incubadora INC-001",
        batchId: "PAR-001",
      },
    ],
  }
}

export async function getCostData(): Promise<CostData[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))

  return [
    {
      batchId: "PAR-001",
      feedCost: 15420,
      medicationCost: 850,
      laborCost: 2100,
      utilitiesCost: 1200,
      totalCost: 19570,
      revenue: 24500,
      profit: 4930,
      fcr: 1.65,
      fep: 385,
    },
    {
      batchId: "PAR-002",
      feedCost: 16200,
      medicationCost: 920,
      laborCost: 2200,
      utilitiesCost: 1300,
      totalCost: 20620,
      revenue: 25800,
      profit: 5180,
      fcr: 1.62,
      fep: 392,
    },
    {
      batchId: "PAR-003",
      feedCost: 14800,
      medicationCost: 780,
      laborCost: 2000,
      utilitiesCost: 1100,
      totalCost: 18680,
      revenue: 23200,
      profit: 4520,
      fcr: 1.68,
      fep: 378,
    },
  ]
}
