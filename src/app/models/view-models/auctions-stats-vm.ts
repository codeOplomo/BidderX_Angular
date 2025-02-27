export interface AuctionStats {
    totalAuctions: number;
    pendingRequests: number;
    activeUsers: number;  // You might want to get this from a different endpoint
    totalRevenue: number; // This might come from payment service
  }