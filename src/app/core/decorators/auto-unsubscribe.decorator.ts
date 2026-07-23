import { Subscription, Subject } from 'rxjs';

export interface AutoUnsubscribeConfig {
  blacklist?: string[];
}

export function AutoUnsubscribe(config?: AutoUnsubscribeConfig) {
  return function <T extends new (...args: any[]) => object>(
    constructor: T,
  ): T {
    const originalOnDestroy = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function () {
      const ctx = this as Record<string, any>;

      for (const key of Object.keys(ctx)) {
        if (config?.blacklist?.includes(key)) continue;

        const property = ctx[key];

        if (property instanceof Subject) {
          property.complete();
        } else if (property instanceof Subscription) {
          property.unsubscribe();
        } else if (Array.isArray(property)) {
          for (const item of property) {
            if (item instanceof Subject) {
              item.complete();
            } else if (item instanceof Subscription) {
              item.unsubscribe();
            } else if (item && typeof item.unsubscribe === 'function') {
              item.unsubscribe();
            }
          }
        } else if (property && typeof property.unsubscribe === 'function') {
          property.unsubscribe();
        }
      }

      if (typeof originalOnDestroy === 'function') {
        originalOnDestroy.apply(this, arguments);
      }
    };

    return constructor;
  };
}
