

export interface CollectionItem {
    id?: string;
    name?: string;
    description?: string;
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