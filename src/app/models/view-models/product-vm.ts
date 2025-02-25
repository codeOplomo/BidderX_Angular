import { CollectionVM } from "./collection-vm";

export interface ProductVM {
    id: string;
    title: string;
    description: string;
    condition: string;
    manufacturer: string;
    productionDate: string;
    categoryId: string;
    ownerEmail?: string;
    imageUrl: string;
    featuredImages?: string[];

    currentBid?: string;
    collections?: CollectionVM[];
  }