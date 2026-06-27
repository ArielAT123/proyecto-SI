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

export interface Metrics {
  totalClientsToday: number;
  totalEarnings: number;
  averageOccupancy: number;
  hourlyData: { hour: string; count: number }[];
}
