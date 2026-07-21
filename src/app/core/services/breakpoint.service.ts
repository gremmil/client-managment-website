import { Injectable, OnDestroy, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, map, shareReplay, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root', // Global para toda la app
})
export class BreakpointService implements OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private destroy$ = new Subject<void>();

  // Definición de breakpoints alineados con Tailwind (md: 768px)
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

  public readonly isSmallScreen$ = this.breakpointObserver
    .observe([
      Breakpoints.Handset,
      Breakpoints.Tablet,
      this.breakpoints.mobile,
      this.breakpoints.tablet,
    ])
    .pipe(
      map((result) => result.matches),
      shareReplay(1),
    );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
