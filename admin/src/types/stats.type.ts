export interface StatsResponseType {
  activeUsers: number;
  totalOrders: number;
  totalProducts: number;
  orderedProductsThisMonth: number;
  earningsThisMonth: number;
}

export interface DailyStatsResponse {
  date: string;
  earnings: number;
  orders: number;
}
