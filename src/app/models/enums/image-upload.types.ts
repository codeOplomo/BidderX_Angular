export type ImageType = 'profile' | 'cover' | 'collection-cover';

export interface ImageUploadConfig {
    type: ImageType;
    collectionId?: string;
    onSuccess?: (imageUrl: string) => void;
    onError?: (error: any) => void;
    onLoadingChange?: (loading: boolean) => void;
  }