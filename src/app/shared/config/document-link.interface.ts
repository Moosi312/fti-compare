import { SearchConfig } from './config.interface';
import { DocumentItem, DocumentTypeEnum } from './document.interface';

export type DocumentLink = { [key: string]: string[] };

export type DocumentsForIndicator = Map<string, DocumentSearchByType>;

export type DocumentSearchByType = Map<DocumentTypeEnum, DocumentBySearch>;

export type DocumentBySearch = Map<string, DocumentItem[]>;

export interface SearchItem {
  config: SearchConfig;
  links: DocumentLink;
}
