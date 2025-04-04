export interface Config {
  files: {
    documents: string;
    topicConfig: string;
    labels: string;
  };
  documentsFolder: string;
  searches: SearchConfig[];
}

export interface SearchConfig {
  searchName: string;
  description: string;
  fileLocation: string;
}
