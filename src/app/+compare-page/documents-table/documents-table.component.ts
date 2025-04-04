import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
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
import { DocumentSearchByType, DocumentTypeEnum } from '../../shared/config';
import { DataStore } from '../../shared/data.store';
import { DOCUMENT } from '@angular/common';

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
  ],
  templateUrl: './documents-table.component.html',
  styleUrl: './documents-table.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsTableComponent {
  dataStore = inject(DataStore);
  DOC_TYPE_ORDER = [
    DocumentTypeEnum.r,
    DocumentTypeEnum.c,
    DocumentTypeEnum.s,
    DocumentTypeEnum.l,
    DocumentTypeEnum.m,
    DocumentTypeEnum.d,
  ];

  documentsForIndicator = input.required<DocumentSearchByType | undefined>();
  availableSearches = input.required<string[]>();

  selectedSearches = signal<string[]>(['Text Search']);
  config = this.dataStore.config;

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
    effect(() => {
      this.selectedSearches.set(this.availableSearches());
    });

    // preload image otherwise it takes a while once the rows are expanded
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

  expandAll() {
    this.expandedRows = this.tableValues().reduce(
      (acc, p) => (acc[p.documentType] = true) && acc,
      {} as ExpandedRowType,
    );
  }

  collapseAll() {
    this.expandedRows = {};
  }
  isRowExpanded(documentType: DocumentTypeEnum) {
    return this.expandedRows[documentType] === true;
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
}
