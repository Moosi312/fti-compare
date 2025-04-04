import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivatedRouteService {
  activateRoute = inject(ActivatedRoute);
  router = inject(Router);

  getQueryParam$(param: string) {
    return this.activateRoute.queryParamMap.pipe(
      map((paramMap) => paramMap.get(param) ?? undefined),
    );
  }

  addQueryParams(params: { [key: string]: string | undefined }): void {
    const routeSnapshot = this.activateRoute.snapshot;
    console.log(params, routeSnapshot.queryParams, {
      ...params,
      ...routeSnapshot.queryParams,
    });
    console.log(location);
    this.router.navigate(['/'], {
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }
}
