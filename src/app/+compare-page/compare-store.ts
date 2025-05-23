import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  DocumentBySearch,
  DocumentItem,
  DocumentLink,
  DocumentSearchByType,
  DocumentsForIndicator,
  DocumentTypeEnum,
  Labels,
  SearchItem,
  TopicConfig,
} from '../shared/config';
import { computed, DestroyRef, effect, inject } from '@angular/core';
import { BackendService } from '../shared/backend.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, map, tap } from 'rxjs';
import { ConfigStore } from '../shared/config.store';

interface DataStoreState {
  docs: DocumentItem[] | undefined;
  labels: Labels | undefined;
  topicConfig: TopicConfig | undefined;
  searches: SearchItem[] | undefined;
}

export const CompareStore = signalStore(
  withState<DataStoreState>({
    docs: undefined,
    labels: undefined,
    topicConfig: undefined,
    searches: undefined,
  }),
  withComputed((store) => ({
    indicatorsForTopic: computed(() => {
      const topicConfig = store.topicConfig();
      return new Map(
        Object.entries(topicConfig ?? {}).map(([topic, indicatorConfig]) => [
          topic,
          indicatorConfig.i,
        ]),
      );
    }),
    topicForIndicator: computed(() => {
      const topicConfig = store.topicConfig();
      const map = new Map<string, string[]>();
      Object.entries(topicConfig ?? {}).forEach(([topic, indicatorConfig]) => {
        indicatorConfig.i.forEach((indicator) =>
          map.set(indicator, (map.get(indicator) ?? []).concat(topic)),
        );
      });
      return map;
    }),
    indicators: computed(() => {
      const topicConfig = store.topicConfig();
      const set = new Set<string>();
      Object.values(topicConfig ?? {}).forEach((indicatorConfig) => {
        indicatorConfig.i.forEach((indicator) => set.add(indicator));
      });
      return [...set];
    }),
    documentsForIndicator: computed<DocumentsForIndicator | undefined>(() => {
      const docs = store.docs();
      const searches = store.searches();

      const map: DocumentsForIndicator = new Map<
        string,
        DocumentSearchByType
      >();

      if (!docs || !searches) {
        return map;
      }

      searches?.forEach((search) =>
        Object.entries(search.links).forEach(([indicator, documents]) =>
          documents.forEach((doc) => {
            const document = docs?.find((d) => d.file === doc);
            if (!document) {
              return;
            }

            const documentsForIndicator =
              map.get(indicator) ??
              new Map<DocumentTypeEnum, DocumentBySearch>(
                Object.values(DocumentTypeEnum).map((type) => [
                  type,
                  new Map<string, DocumentItem[]>(),
                ]),
              );

            const documentBySearch =
              documentsForIndicator.get(document.type) ??
              new Map<string, DocumentItem[]>();
            documentBySearch.set(
              search.config.searchName,
              (documentBySearch.get(search.config.searchName) ?? []).concat(
                document,
              ),
            );

            documentsForIndicator.set(document.type, documentBySearch);

            map.set(indicator, documentsForIndicator);
          }),
        ),
      );

      return map;
    }),
  })),
  withMethods((store) => {
    function getLabel(id: string) {
      const labels = store.labels();
      return labels?.[id];
    }

    function getName(id: string) {
      return getLabel(id)?.short;
    }

    return {
      getLabel,
      getName,
    };
  }),
  withHooks({
    onInit: (store) => {
      const backendService = inject(BackendService);
      const destroyRef = inject(DestroyRef);
      const configStore = inject(ConfigStore);

      effect(() => {
        const config = configStore.config();
        if (!config) {
          return;
        }

        forkJoin({
          docs: backendService.get<DocumentItem[]>(config.files.documents),
          labels: backendService.get<Labels>(config.files.labels),
          topicConfig: backendService.get<TopicConfig>(
            config.files.topicConfig,
          ),
        })
          .pipe(
            tap((data) => patchState(store, data)),
            takeUntilDestroyed(destroyRef),
          )
          .subscribe();

        forkJoin(
          config.searches.map((search) =>
            backendService
              .get<DocumentLink>(search.path + search.fileName)
              .pipe(map((links) => ({ config: search, links }))),
          ),
        )
          .pipe(
            tap((data) => patchState(store, { searches: data })),
            takeUntilDestroyed(destroyRef),
          )
          .subscribe();
      });
    },
  }),
);
