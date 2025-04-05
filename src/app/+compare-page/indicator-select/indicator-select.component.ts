import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
} from '@angular/core';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CompareStore } from '../compare-store';
import { SelectItemGroup } from 'primeng/api';
import { FloatLabel } from 'primeng/floatlabel';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-indicator-select',
  imports: [Select, FormsModule, FloatLabel, Card],
  templateUrl: './indicator-select.component.html',
  styleUrl: './indicator-select.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorSelectComponent {
  dataStore = inject(CompareStore);

  selectedIndicator = model<string | undefined>();
  availableIndicators = computed<SelectItemGroup<string>[]>(() =>
    Array(...(this.dataStore.indicatorsForTopic().entries() ?? [])).map(
      ([topic, indicators]) => ({
        label: this.dataStore.getName(topic) ?? topic,
        value: topic,
        items: indicators.map((indicator) => ({
          label: this.dataStore.getName(indicator) ?? indicator,
          value: indicator,
        })),
      }),
    ),
  );
  // ndicators = computed<SelectItem<string>[]>(() =>
  //   this.dataStore.indicators().map((indicator) => ({
  //     label: this.dataStore.getName(indicator),
  //     value: indicator,
  //   })),
  // );
}
