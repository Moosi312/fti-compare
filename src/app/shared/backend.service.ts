import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from './config';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private httpClient = inject(HttpClient);

  getConfig(): Observable<Config> {
    return this.get<Config>('/config.json');
  }

  get<T>(url: string): Observable<T> {
    return this.httpClient.get<T>(url);
  }
}
