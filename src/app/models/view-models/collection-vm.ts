import { ProductVM } from "./product-vm";

export interface CollectionVM {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    items: ProductVM[];
    // add other fields as needed
  }