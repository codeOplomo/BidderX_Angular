import { createReducer, on } from '@ngrx/store';
import * as CollectionActions from './collection.actions';
import { initialCollectionState } from './collection.state';

export const collectionReducer = createReducer(
  initialCollectionState,
  on(CollectionActions.loadCollection, state => ({...state, loading: true, error: null})),
  on(CollectionActions.loadCollectionSuccess, (state, { collection }) => {
    console.log('Reducer - Loaded Collection:', collection);  // This should log the updated collection data
    return {
      ...state,
      collection,
      loading: false,
      error: null,
    };
  }),
  
    on(CollectionActions.loadCollectionFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
  on(CollectionActions.updateCollectionCoverImage, state => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CollectionActions.updateCollectionCoverImageSuccess, (state, { imageUrl }) => ({
    ...state,
    imageUrl,
    loading: false,
    error: null,
  })),
  on(CollectionActions.updateCollectionCoverImageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
