export interface CreateAuctionVM {
    title: string;
    description: string;
    startTime: string; 
    startingPrice: string; 
    isInstantAuction: boolean;
    auctionDurationInHours: number; 

    // Product selection - either existingProductId or new product details
    existingProductId?: string; 

    // New product fields - all optional, used only when creating a new product
    productTitle?: string; 
    productDescription?: string; 
    condition?: string; 
    manufacturer?: string; 
    productionDate?: string; 
    productImageUrl?: string; 
    featuredImageUrls?: string;

    categoryId?: string; 
    collectionId?: string;
}
