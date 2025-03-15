export interface AuctionStats {
  totalAuctions: number;
  pendingRequests: number;
  activeAuctions: number;
  completedAuctions: number;
  averageWinningBid: number | null;
  averageBidSpread: number | null;
  revenuePerOwner: { [ownerEmail: string]: number };
  activeUsers: number;
  totalRevenue: number;
  ongoingAuctions: number;
  totalBids: number;
  todayRevenue: number;
  averageBidAmount: number;
  totalLikes: number;
}
