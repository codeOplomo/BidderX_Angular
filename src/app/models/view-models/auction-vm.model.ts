import { ProductVm } from "./product-vm.model";

export interface AuctionVm {
    id: string;  // UUID string
    title: string;
    description: string;
    startTime: string;  // ISO string for LocalDateTime
    endTime: string;    // ISO string for LocalDateTime
    startingPrice: string;
    currentPrice: string;
    product: ProductVm;
}
