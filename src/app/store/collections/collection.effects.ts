import { Actions, ofType, createEffect } from '@ngrx/effects';
import { inject, Injectable } from '@angular/core';
import * as CollectionActions from './collection.actions';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import { CollectionsService } from '../../services/collections.service';
import { Store } from '@ngrx/store';
import { Action } from '@ngrx/store';


@Injectable()
export class CollectionEffects {
    private readonly actions$ = inject(Actions);
    private readonly collectionsService = inject(CollectionsService);
    private destroy$ = new Subject<void>();


    loadCollection$ = createEffect(() =>
        this.actions$.pipe(
          ofType(CollectionActions.loadCollection),
          mergeMap((action) =>
            this.collectionsService.getCollectionById(action.id).pipe(
              map((apiResponse) => {
                const collection = apiResponse.data;
                console.log('Loaded collection:', collection); 
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
          switchMap(({ collectionId }) =>
            new Observable<Action>((observer) => {
              this.collectionsService.uploadShowcaseCoverImage(
                collectionId,
                this.destroy$,
                (imageUrl) => {
                  observer.next(CollectionActions.updateCollectionCoverImageSuccess({ 
                    imageUrl, 
                    collectionId 
                  }));
                  observer.next(CollectionActions.loadCollection({ id: collectionId }));
                  observer.complete();
                },
                (loading) => {
                  console.log('Loading state:', loading);
                }
              );
            }).pipe(
              catchError((error) =>
                of(CollectionActions.updateCollectionCoverImageFailure({ error }))
              )
            )
          )
        )
      );
      
      

}