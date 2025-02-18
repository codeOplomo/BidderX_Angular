export type ImageType = 'profile' | 'cover' | 'collection-cover' | 'product-main' | 'product-featured';

export interface ImageUploadConfig {
    type: ImageType;
    collectionId?: string;
    productId?: string;
    onSuccess?: (imageUrl: string) => void;
    onError?: (error: any) => void;
    onLoadingChange?: (loading: boolean) => void;
  }