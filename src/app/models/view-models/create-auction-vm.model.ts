export interface CreateAuctionVm {
    title: string;
    description: string;
    startTime: string; // Matches LocalDateTime in backend
    startingPrice: string; // Matches BigDecimal in backend (use string for precision in JSON)
    isInstantAuction: boolean; // Matches boolean in backend
    auctionDurationInHours: number; // Matches Integer in backend

    // Product selection - either existingProductId or new product details
    existingProductId?: string; // Matches UUID in backend

    // New product fields - all optional, used only when creating a new product
    productTitle?: string; // Matches String in backend
    productDescription?: string; // Matches String in backend
    condition?: string; // Matches String in backend
    manufacturer?: string; // Matches String in backend
    productionDate?: string; // Matches Date in backend, sent as ISO string
    productImageUrl?: string; // Matches String in backend

    categoryId?: string; // Matches UUID in backend
}
