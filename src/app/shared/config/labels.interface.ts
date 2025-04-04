export type Labels = { [key: string]: Label };

export interface Label {
  short: string;
  source?: string;
  text: string;
  io?: 'i' | 'o';
  unit: string;
  unit_short: string;
  name_a: string;
}
