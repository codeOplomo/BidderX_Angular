import { createAction, props } from '@ngrx/store';
import { Collection } from './collection.model';

export const updateCollectionCoverImage = createAction(
  '[Collection] Update Cover Image',
  props<{ collectionId: string }>()
);

export const updateCollectionCoverImageSuccess = createAction(
  '[Collection] Update Cover Image Success',
  props<{ imageUrl: string, collectionId: string }>()
);
  
  export const updateCollectionCoverImageFailure = createAction(
    '[Collection] Update Cover Image Failure',
    props<{ error: any }>()
  );

  export const loadCollection = createAction(
    '[Collection] Load Collection',
    props<{ id: string }>()
  );
  
  export const loadCollectionSuccess = createAction(
    '[Collection] Load Collection Success',
    props<{ collection: Collection }>()
  );
  
  export const loadCollectionFailure = createAction(
    '[Collection] Load Collection Failure',
    props<{ error: any }>()
  );

  export const createCollection = createAction(
    '[Collection] Create Collection',
    props<{ collection: Partial<Collection> }>()
  );
  
  export const createCollectionSuccess = createAction(
    '[Collection] Create Collection Success',
    props<{ collection: Collection }>()
  );
  
  export const createCollectionFailure = createAction(
    '[Collection] Create Collection Failure',
    props<{ error: any }>()
  );
  
  export const updateCollection = createAction(
    '[Collection] Update Collection',
    props<{ id: string; collection: Partial<Collection> }>()
  );
  
  export const updateCollectionSuccess = createAction(
    '[Collection] Update Collection Success',
    props<{ collection: Collection }>()
  );
  
  export const updateCollectionFailure = createAction(
    '[Collection] Update Collection Failure',
    props<{ error: any }>()
  );