import { patchState, signalStore, withHooks, withState } from '@ngrx/signals';
import { Config } from './config';
import { DestroyRef, inject } from '@angular/core';
import { BackendService } from './backend.service';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ConfigStoreState {
  config: Config | undefined;
}

export const ConfigStore = signalStore(
  withState<ConfigStoreState>({ config: undefined }),

  withHooks({
    onInit: (store) => {
      const backendService = inject(BackendService);
      const destroyRef = inject(DestroyRef);

      backendService
        .getConfig()
        .pipe(
          tap((config) => patchState(store, { config })),
          takeUntilDestroyed(destroyRef),
        )
        .subscribe();
    },
  }),
);
