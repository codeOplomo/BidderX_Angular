import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollectionState } from './collection.state';
import { selectCurrentUserEmail } from '../user/user.selectors';

export const selectCollectionState = createFeatureSelector<CollectionState>('collection');

export const selectCollectionCoverImage = createSelector(
  selectCollectionState,
  state => state.collection
);

export const selectIsCurrentUserCollectionOwner = createSelector(
  selectCollectionCoverImage, 
  selectCurrentUserEmail,        
  (collection, userEmail) => {
    console.log('Owner Email:', collection?.owner?.email);
    console.log('Current User Email:', userEmail);
    return collection?.owner?.email && userEmail 
      ? collection.owner.email.toLowerCase() === userEmail.toLowerCase()
      : false;
  }
);

export const selectCollectionLoading = createSelector(
  selectCollectionState,
  state => state.loading
);

export const selectCollectionError = createSelector(
  selectCollectionState,
  state => state.error
);
