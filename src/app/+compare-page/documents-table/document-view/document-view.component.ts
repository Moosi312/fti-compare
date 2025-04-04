import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { DocumentItem, DocumentTypeEnum } from '../../../shared/config';
import { DataStore } from '../../../shared/data.store';

@Component({
  selector: 'app-document-view',
  imports: [],
  templateUrl: './document-view.component.html',
  styleUrl: './document-view.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewComponent {
  document = input.required<DocumentItem>();
  config = inject(DataStore).config;
}
