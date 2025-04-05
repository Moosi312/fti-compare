import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DocumentItem } from '../../../shared/config';
import { ConfigStore } from '../../../shared/config.store';
import { ImageRepositoryStore } from '../../../shared/image-repository.store';

@Component({
  selector: 'app-document-view',
  imports: [],
  templateUrl: './document-view.component.html',
  styleUrl: './document-view.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewComponent {
  config = inject(ConfigStore).config;
  imageRepository = inject(ImageRepositoryStore);

  document = input.required<DocumentItem>();
  authors = computed(() => this.document().authors.map((a) => a.short));

  getImage(pdfName: string) {
    return this.imageRepository.getImage(pdfName);
  }
}
