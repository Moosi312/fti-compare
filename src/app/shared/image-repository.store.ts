import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { DestroyRef, inject } from '@angular/core';
import { BackendService } from './backend.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

interface ImageRepositoryStoreState {
  images: { [key: string]: string };
}

export const ImageRepositoryStore = signalStore(
  withState<ImageRepositoryStoreState>({
    images: {},
  }),
  withMethods((store) => ({
    getImage: (id: string) => store.images()[id],
  })),
  withHooks((store) => ({
    onInit: () => {
      const backendService = inject(BackendService);
      const destroyRef = inject(DestroyRef);

      backendService
        .get<{ [key: string]: string }>('images-base64.json')
        .pipe(
          tap((images) => patchState(store, { images })),
          takeUntilDestroyed(destroyRef),
        )
        .subscribe();
    },
  })),
);
