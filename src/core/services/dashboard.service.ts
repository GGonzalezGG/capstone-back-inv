import { PrismaClient, RequestStatus } from "@prisma/client";
import { InventoryRepository } from "../../data/repositories/inventory.repository";

// DEFINIR LOS TIPOS DENTRO DEL BACKEND:
// Estos tipos definen el "contrato" de la API que el frontend espera.
type ActivityType = "request" | "alert" | "add" | "system";

interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
}

const prisma = new PrismaClient();

export class DashboardService {
  private inventoryRepository: InventoryRepository;

  constructor() {
    this.inventoryRepository = new InventoryRepository();
  }

  /**
   * Obtiene todos los KPIs y datos agregados para el dashboard principal.
   */
  async getDashboardSummary() {
    // --- 1. Consultas para los StatCards ---

    // StatCard 1: Stock Bajo
    // (Esto requiere una consulta un poco más compleja con 'whereRaw')
    // O un método en el repositorio. Vamos a añadirlo al repositorio.
    const lowStockCount = await this.inventoryRepository.getLowStockCount();

    // StatCard 2: Total de Insumos (activos)
    const totalItemsCount = await prisma.item.count({
      where: { isActive: true },
    });

    // StatCard 3: Peticiones Pendientes (PENDING o APPROVED)
    const pendingRequestsCount = await prisma.request.count({
      where: {
        status: { in: ["PENDING", "APPROVED"] },
      },
    });

    // --- 2. Consulta para el Gráfico de Inventario ---
    const topStockItems = await prisma.item.findMany({
      where: { isActive: true, quantityInStock: { gt: 0 } },
      orderBy: { quantityInStock: "desc" },
      take: 7, // Tomamos los 7 con más stock
      select: {
        name: true,
        quantityInStock: true,
      },
    });
    // Renombramos 'quantityInStock' a 'quantity' para que coincida con el frontend
    const chartData = topStockItems.map((item) => ({
      name: item.name,
      quantity: item.quantityInStock,
    }));

    // --- 3. Consulta para el Feed de Actividad Reciente ---
    const recentRequests = await prisma.request.findMany({
      take: 5, // Las 5 más recientes
      orderBy: { createdAt: "desc" },
      include: {
        requester: { select: { name: true } },
        patient: { select: { name: true } },
      },
    });

    // Formateamos los datos para que coincidan con el tipo 'ActivityItem'
    // Esta línea AHORA funciona porque 'ActivityItem' está definido localmente
    const recentActivities: ActivityItem[] = recentRequests.map((req) => ({
      id: req.id,
      type: "request", // Asumimos que la actividad reciente son peticiones
      description: `${req.requester.name} creó una petición para ${req.patient.name}.`,
      timestamp: req.createdAt.toISOString(),
    }));

    // --- 4. Devolver el objeto consolidado ---
    return {
      stats: {
        lowStock: lowStockCount,
        totalItems: totalItemsCount,
        pendingRequests: pendingRequestsCount,
      },
      chartData,
      recentActivities,
    };
  }
}
