import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionState } from './collection.state';

export const selectCollectionState = createFeatureSelector<CollectionState>('collection');

export const selectCollectionCoverImage = createSelector(
  selectCollectionState,
  state => state.collection
);

export const selectCollectionLoading = createSelector(
  selectCollectionState,
  state => state.loading
);

export const selectCollectionError = createSelector(
  selectCollectionState,
  state => state.error
);
