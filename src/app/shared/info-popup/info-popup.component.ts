import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonDirective, ButtonIcon } from 'primeng/button';
import { InfoCircleIcon } from 'primeng/icons';
import { Popover } from 'primeng/popover';

@Component({
  selector: 'app-info-popup',
  imports: [ButtonDirective, InfoCircleIcon, Popover, ButtonIcon],
  templateUrl: './info-popup.component.html',
  styleUrl: './info-popup.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoPopupComponent {}
