import { Collection } from "./collection.model";

export interface CollectionState {
    collection: Collection | null;
    loading: boolean;
    error: any;
  }
  
  export const initialCollectionState: CollectionState = {
    collection: null,
    loading: false,
    error: null,
  };