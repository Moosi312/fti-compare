export interface Config {
  files: {
    documents: string;
    topicConfig: string;
    labels: string;
  };
  documentsFolder: string;
  searches: SearchConfig[];
  baseUrl: string;
  ftiMonitor: string;
  ftiMonitorWithSearch: string;
}

export interface SearchConfig {
  searchName: string;
  description: string;
  path: string;
  fileName: string;
}
