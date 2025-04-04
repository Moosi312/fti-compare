export enum DocumentTypeEnum {
  r = 'r',
  l = 'l',
  c = 'c',
  s = 's',
  m = 'm',
  d = 'd',
}

export interface DocumentItem {
  file: string;
  type: DocumentTypeEnum;
  name: string;
  year: string;
  topicIds: string[];
  authors: DocumentAuthor[];
}

export interface DocumentAuthor {
  name: string;
  short: string;
  city: string;
  country: string;
}
