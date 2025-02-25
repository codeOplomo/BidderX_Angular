import { ProductVM } from "./product-vm";
import { ProfileVM } from "./profile";

export interface AuctionVm {
    id: string;  // UUID string
    title: string;
    description: string;
    startTime: string;
    endTime: string; 
    startingPrice: string;
    currentBid: string;
    product: ProductVM;
    reactionsCount: number;
    totalBidders: number;
    totalBids: number;
    likedByCurrentUser: boolean;
    bidders: ProfileVM[];
}
