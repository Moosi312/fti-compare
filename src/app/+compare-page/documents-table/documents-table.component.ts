import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
} from 'primeng/icons';
import { ButtonDirective, ButtonIcon, ButtonLabel } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DocumentViewComponent } from './document-view/document-view.component';
import {
  DocumentSearchByType,
  DocumentTypeEnum,
  SearchConfig,
} from '../../shared/config';
import { DataStore } from '../../shared/data.store';
import { tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteService } from '../../shared/activated-route.service';
import { InfoPopupComponent } from '../../shared/info-popup/info-popup.component';

type ExpandedRowType = { [key in DocumentTypeEnum]?: boolean };

@Component({
  selector: 'app-documents-table',
  imports: [
    TableModule,
    MultiSelect,
    FormsModule,
    PlusIcon,
    MinusIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ButtonDirective,
    ButtonIcon,
    Ripple,
    ButtonLabel,
    DocumentViewComponent,
    InfoPopupComponent,
  ],
  templateUrl: './documents-table.component.html',
  styleUrl: './documents-table.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsTableComponent {
  dataStore = inject(DataStore);
  activateRouteService = inject(ActivatedRouteService);
  destroyRef = inject(DestroyRef);

  readonly DOC_TYPE_ORDER = [
    DocumentTypeEnum.r,
    DocumentTypeEnum.c,
    DocumentTypeEnum.s,
    DocumentTypeEnum.l,
    DocumentTypeEnum.m,
    DocumentTypeEnum.d,
  ];

  documentsForIndicator = input.required<DocumentSearchByType | undefined>();
  availableSearches = input.required<SearchConfig[]>();
  selectedSearches = signal<string[]>([]);

  config = this.dataStore.config;

  availableSearchesOptions = computed(() =>
    this.availableSearches().map((search) => search.searchName),
  );
  tableValues = computed(() => {
    return Array(...(this.documentsForIndicator()?.entries() ?? []))
      .sort(
        (a, b) =>
          this.DOC_TYPE_ORDER.indexOf(a[0]) - this.DOC_TYPE_ORDER.indexOf(b[0]),
      )
      .map(([key, value]) => ({ documentType: key, searches: value }));
  });

  expandedRows: ExpandedRowType = {};

  constructor() {
    this.initSelectedSearches();
    this.initExpandedRows();
    this.initPrefetchImages();
  }

  expandAll() {
    this.expandedRows = this.tableValues().reduce(
      (acc, p) => (acc[p.documentType] = true) && acc,
      {} as ExpandedRowType,
    );
    this.updateExpandedRows();
  }

  collapseAll() {
    this.expandedRows = {};
    this.updateExpandedRows();
  }

  isRowExpanded(documentType: DocumentTypeEnum) {
    return this.expandedRows[documentType] === true;
  }

  updateExpandedRows() {
    this.activateRouteService.addQueryParams({
      types: Object.keys(this.expandedRows).join(','),
    });
  }

  getDocumentTypeLabel(type: DocumentTypeEnum): string {
    switch (type) {
      case DocumentTypeEnum.c:
        return 'Stellungnahmen';
      case DocumentTypeEnum.d:
        return 'Analyse';
      case DocumentTypeEnum.l:
        return 'Broschüre';
      case DocumentTypeEnum.m:
        return 'Broschüre';
      case DocumentTypeEnum.r:
        return 'Ratsempfehlungen';
      case DocumentTypeEnum.s:
        return 'Auftragsstudien';
      default:
        return type;
    }
  }

  getSearchDetails(search: string) {
    return this.availableSearches().find((s) => s.searchName === search);
  }

  private initSelectedSearches() {
    effect(() => {
      const availableSearches = this.availableSearches();
      untracked(() => {
        if (this.selectedSearches().length === 0) {
          this.selectedSearches.set(availableSearches.map((s) => s.searchName));
        }
      });
    });

    effect(() => {
      const searches = this.selectedSearches();
      this.activateRouteService.addQueryParams({
        search: searches.join(','),
      });
    });

    this.activateRouteService
      .getQueryParam$('search')
      .pipe(
        tap((searches) =>
          this.selectedSearches.set(
            searches !== '' ? (searches?.split(',') ?? []) : [],
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private initExpandedRows() {
    this.activateRouteService
      .getQueryParam$('types')
      .pipe(
        tap(
          (types) =>
            (this.expandedRows = Object.fromEntries(
              (types !== '' ? (types?.split(',') ?? []) : []).map((type) => [
                type,
                true,
              ]),
            )),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private initPrefetchImages() {
    effect(() => {
      const documents = this.documentsForIndicator();
      const documentsFolder = this.config()?.documentsFolder;
      documents?.forEach((search) =>
        search.forEach((docs) =>
          docs.forEach((doc) => {
            const img = new Image();
            img.src = documentsFolder + 'img/' + doc.file + '.png';
          }),
        ),
      );
    });
  }
}
