import { ProductVM } from "./product-vm";
import { ProfileVM } from "./profile";

export interface AuctionVm {
    id: string;  // UUID string
    code: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string; 
    duration: number;
    type: string;
    status: string;
    startingPrice: string;
    currentBid: number;
    product: ProductVM;
    reactionsCount: number;
    totalBidders: number;
    totalBids: number;
    likedByCurrentUser: boolean;
    bidders: ProfileVM[];
    winner: ProfileVM | null;
}
