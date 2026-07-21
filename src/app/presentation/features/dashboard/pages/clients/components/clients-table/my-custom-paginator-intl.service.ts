import { Injectable, OnDestroy, inject } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointService } from 'src/app/core/services/breakpoint.service';
import {
  spanishRangeLabel,
  SPANISH_PAGINATOR_LABELS,
} from './paginator-spanish-labels';

@Injectable()
export class MyCustomPaginatorIntl implements MatPaginatorIntl, OnDestroy {
  changes = new Subject<void>();
  private destroyed$ = new Subject<void>();
  private isMobileScreen = false;

  private breakpointService = inject(BreakpointService);

  get firstPageLabel(): string {
    return this.isMobileScreen ? '' : SPANISH_PAGINATOR_LABELS.firstPageLabel;
  }

  get lastPageLabel(): string {
    return this.isMobileScreen ? '' : SPANISH_PAGINATOR_LABELS.lastPageLabel;
  }

  get nextPageLabel(): string {
    return this.isMobileScreen ? '' : SPANISH_PAGINATOR_LABELS.nextPageLabel;
  }

  get previousPageLabel(): string {
    return this.isMobileScreen
      ? ''
      : SPANISH_PAGINATOR_LABELS.previousPageLabel;
  }

  get itemsPerPageLabel(): string {
    return this.isMobileScreen
      ? ''
      : SPANISH_PAGINATOR_LABELS.itemsPerPageLabel;
  }

  getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (this.isMobileScreen) {
      return ''; // Oculta el rango en móvil/tablet
    }
    return spanishRangeLabel(page, pageSize, length);
  };

  constructor() {
    this.breakpointService.isMobile$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((isMobile) => {
        if (this.isMobileScreen !== isMobile) {
          this.isMobileScreen = isMobile;
          this.changes.next();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
    this.changes.complete();
  }
}
