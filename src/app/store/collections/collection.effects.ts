import { Actions, ofType, createEffect } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import * as CollectionActions from './collection.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CollectionsService } from '../../services/collections.service';
import { Store } from '@ngrx/store';

@Injectable()
export class CollectionEffects {
    private readonly actions$ = inject(Actions);
    private readonly collectionsService = inject(CollectionsService);


    loadCollection$ = createEffect(() =>
        this.actions$.pipe(
          ofType(CollectionActions.loadCollection),
          mergeMap((action) =>
            this.collectionsService.getCollectionById(action.id).pipe(
              map((apiResponse) => {
                const collection = apiResponse.data;
                console.log('Loaded collection:', collection); // Verify collection data
                return CollectionActions.loadCollectionSuccess({ collection });
              }),
              catchError((error) =>
                of(CollectionActions.loadCollectionFailure({ error }))
              )
            )
          )
        )
      );
      

  updateCollectionCoverImage$ = createEffect(() => 
    this.actions$.pipe(
      ofType(CollectionActions.updateCollectionCoverImage),
      switchMap(({ imageFile }) =>
        this.collectionsService.uploadShowcaseCoverImage(imageFile).pipe(
          map(response => CollectionActions.updateCollectionCoverImageSuccess({
            imageUrl: response.imageUrl,
          })),
          catchError(error => 
            of(CollectionActions.updateCollectionCoverImageFailure({ error }))
          )
        )
      )
    )
  );

}