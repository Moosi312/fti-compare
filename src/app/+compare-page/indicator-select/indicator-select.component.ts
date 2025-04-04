import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
} from '@angular/core';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DataStore } from '../../shared/data.store';
import { SelectItem } from 'primeng/api';
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
  dataStore = inject(DataStore);

  selectedIndicator = model<string>();
  availableIndicators = computed<SelectItem<string>[]>(() =>
    this.dataStore.indicators().map((indicator) => ({
      label: this.dataStore.getName(indicator),
      value: indicator,
    })),
  );
}
