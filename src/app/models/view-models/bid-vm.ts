export interface BidVM {
    id?: string;
    auctionId: string;
    bidderEmail: string;
    bidAmount: number;
    bidTime: Date;
}