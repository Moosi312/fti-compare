import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { ConfigStore } from './shared/config.store';
import { CompareStore } from './+compare-page/compare-store';
import { ImageRepositoryStore } from './shared/image-repository.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  standalone: true,
  providers: [ConfigStore, CompareStore, ImageRepositoryStore],
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
