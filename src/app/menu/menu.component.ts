import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Menubar } from 'primeng/menubar';
import { Button } from 'primeng/button';
import { LogoComponent } from './logo/logo.component';
import { MenuItem } from 'primeng/api';
import { ConfigStore } from '../shared/config.store';

@Component({
  selector: 'app-menu',
  imports: [Menubar, Button, LogoComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  configStore = inject(ConfigStore);

  isDarkMode = signal(false);
  baseUrl = computed(() => this.configStore.config()?.baseUrl);
  searches = computed(() => this.configStore.config()?.searches);
  menuItems = computed<MenuItem[]>(() => {
    const config = this.configStore.config();
    return [
      {
        label: 'Back',
        icon: 'pi pi-arrow-left',
        url: config?.baseUrl,
      },
      {
        label: 'Current FTI-Monitor',
        url: config?.ftiMonitor,
      },
      {
        label: 'FTI-Monitor with Search',
        url: config?.ftiMonitorWithSearch,
      },
      {
        label: 'Search Implementations',
        items: config?.searches.map((search) => ({
          label: search.searchName,
          url: config.baseUrl + search.path,
          tooltip: search.description,
        })),
      },
    ];
  });

  constructor() {
    this.keepTheme();
    const element = document.querySelector('html');
    this.isDarkMode.set(element?.classList.contains('app-dark-mode') ?? false);
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element?.classList.toggle('app-dark-mode');
    this.isDarkMode.set(element?.classList.contains('app-dark-mode') ?? false);
    localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
  }

  private keepTheme() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      this.setTheme(theme);
      return;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDark.matches) {
      this.setTheme('dark');
      return;
    }

    this.setTheme('light');
  }

  private setTheme(theme: string) {
    const element = document.querySelector('html');
    switch (theme) {
      case 'dark':
        element?.classList.add('app-dark-mode');
        return;
      case 'light':
        element?.classList.remove('app-dark-mode');
        return;
    }
  }
}
