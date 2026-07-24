import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreakpointService {
  private breakpointObserver = inject(BreakpointObserver);

  private readonly breakpoints = {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
  };

  public readonly isDesktop$ = this.breakpointObserver
    .observe([this.breakpoints.desktop])
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );

  public readonly isTablet$ = this.breakpointObserver
    .observe([this.breakpoints.tablet])
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );

  public readonly isMobile$ = this.breakpointObserver
    .observe([this.breakpoints.mobile])
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );
}
