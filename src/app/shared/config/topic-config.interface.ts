export type TopicConfig = { [key: string]: TopicConfigEntry };

export type TopicConfigEntry = {
  i: string[];
  wt: { [key: string]: string[] };
};
