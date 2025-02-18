export interface ProductVM {
    title: string;
    description: string;
    condition: string;
    manufacturer: string;
    productionDate: string;  // ISO string
    imageUrl: string;
    categoryId: string;
    ownerEmail?: string;
  }