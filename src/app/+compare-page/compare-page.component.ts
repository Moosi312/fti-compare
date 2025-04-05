import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CompareStore } from './compare-store';
import { DocumentSearchByType } from '../shared/config';
import { DocumentsTableComponent } from './documents-table/documents-table.component';
import { IndicatorSelectComponent } from './indicator-select/indicator-select.component';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteService } from '../shared/activated-route.service';

@Component({
  selector: 'app-compare-page',
  imports: [DocumentsTableComponent, IndicatorSelectComponent],
  templateUrl: './compare-page.component.html',
  styleUrl: './compare-page.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePageComponent {
  dataStore = inject(CompareStore);
  destroyRef = inject(DestroyRef);
  activateRouteService = inject(ActivatedRouteService);

  selectedIndicator = signal<string | undefined>(undefined);

  documentsForIndicator = computed<DocumentSearchByType | undefined>(() => {
    const selectedIndicator = this.selectedIndicator();
    const documentsMap = this.dataStore.documentsForIndicator();
    if (!documentsMap || !selectedIndicator) {
      return undefined;
    }
    return documentsMap.get(selectedIndicator);
  });
  availableSearches = computed(
    () => this.dataStore.searches()?.map((search) => search.config) ?? [],
  );

  constructor() {
    this.initSelectedIndicator();
    this.initSelectedSearches();
  }

  private initSelectedSearches() {}

  private initSelectedIndicator() {
    this.activateRouteService
      .getQueryParam$('indicator')
      .pipe(
        tap((indicator) => this.selectedIndicator.set(indicator)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    effect(() => {
      const indicator = this.selectedIndicator();
      this.activateRouteService.addQueryParams({ indicator: indicator });
    });
  }
}
