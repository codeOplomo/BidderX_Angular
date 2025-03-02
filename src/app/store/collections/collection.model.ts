import { Category } from "../../models/view-models/category.model";


export interface CollectionItem {
    id?: string;
    title?: string;
    description?: string;
    condition?: string;
    manufacturer?: string;
    category?: Category;
    imageUrl?: string
}

export interface Collection {
    id?: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    owner?: {
        imageUrl?: string;
        name?: string;
      };
    items: CollectionItem[];
}