import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DataStore } from '../shared/data.store';
import { DocumentSearchByType } from '../shared/config';
import { DocumentsTableComponent } from './documents-table/documents-table.component';
import { IndicatorSelectComponent } from './indicator-select/indicator-select.component';

@Component({
  selector: 'app-compare-page',
  imports: [DocumentsTableComponent, IndicatorSelectComponent],
  templateUrl: './compare-page.component.html',
  styleUrl: './compare-page.component.scss',
  providers: [DataStore],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparePageComponent {
  dataStore = inject(DataStore);

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
    () =>
      this.dataStore.searches()?.map((search) => search.config.searchName) ??
      [],
  );
}
