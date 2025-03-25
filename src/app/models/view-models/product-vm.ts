import { Category } from "./category.model";
import { CollectionVM } from "./collection-vm";

export interface ProductVM {
    id?: string;
    title: string;
    description: string;
    condition: string;
    manufacturer: string;
    productionDate: string;
    category?: Category;
    ownerEmail?: string;
    auctionId?: string;
    imageUrl?: string;
    featuredImageUrls?: string[];
    featuredImages?: string[];

    currentBid?: string;
    collections?: CollectionVM[];
    collectionId?: string;
    categoryId?: string;
  }