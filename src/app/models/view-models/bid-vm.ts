import { ProfileVM } from "./profile";

export interface BidVM {
    id?: string;
    auctionId: string;
    bidder: ProfileVM;
    bidderEmail: string;
    bidAmount: number;
    bidTime: Date;
}