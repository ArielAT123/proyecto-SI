export type Role = 'CLIENT' | 'OWNER' | 'ADMIN';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  balance: number;
  reservations?: Reservation[];
  createdAt: string;
}

export interface Restaurant {
  id: number;
  name: string;
  location: string;
  photo: string;
  foodType: string;
  tables?: Table[];
  ads?: Ad[];
  availableTablesCount?: number;
  totalTablesCount?: number;
  createdAt: string;
}

export interface Table {
  id: number;
  restaurantId: number;
  number: number;
  capacity: number;
  status: TableStatus;
  preview?: string | null;
  reservations?: Reservation[];
  restaurant?: Restaurant;
  createdAt: string;
}

export interface Reservation {
  id: number;
  userId: number;
  user?: User;
  tableId: number;
  table?: Table;
  startTime: string;
  endTime?: string | null;
  cost: number;
  createdAt: string;
}

export interface Ad {
  id: number;
  restaurantId: number;
  restaurant?: Restaurant;
  title: string;
  image: string;
  redirectUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface AdCampaignMetric {
  id: number;
  title: string;
  restaurantName: string;
  platform: string;
  reach: number;
  conversions: number;
  performancePercentage: number;
  iconType?: string;
}


export interface RestaurantOccupancyMetric {
  id: number;
  name: string;
  location: string;
  foodType: string;
  photo?: string;
  totalTables: number;
  occupiedTables: number;
  availableTables: number;
  occupancyPercentage: number;
}

export interface Metrics {
  totalTablesCount: number;
  occupiedTablesCount: number;
  availableTablesCount: number;
  averageOccupancy: number;
  occupancyByRestaurant?: RestaurantOccupancyMetric[];
  totalReservations: number;
  hourlyData: { hour: string; count: number; percentage?: number }[];
  totalClientsServed: number;
  totalClientsToday: number;
  totalEarnings: number;
  averageAdPerformance: number;
  campaigns?: AdCampaignMetric[];
  evolution?: {
    monthly: { labels: string[]; clients: number[]; revenue: number[] };
    weekly: { labels: string[]; clients: number[]; revenue: number[] };
    daily: { labels: string[]; clients: number[]; revenue: number[] };
  };
}

