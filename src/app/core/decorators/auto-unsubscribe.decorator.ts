import { Subscription } from 'rxjs';

/**
 * @description Decorador que limpia automáticamente las suscripciones activas.
 */
export function AutoUnsubscribe() {
  return function (constructor: Function) {
    const originalOnDestroy = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function () {
      // Iteramos sobre las propiedades de la instancia
      for (const key of Object.keys(this)) {
        const property = this[key];

        // Verificamos si es una instancia de Subscription o si tiene un método unsubscribe
        // Esto es mucho más seguro que verificar 'subscribe'
        if (
          property instanceof Subscription ||
          (property && typeof property.unsubscribe === 'function')
        ) {
          property.unsubscribe();
        }
      }

      // Ejecutar el ngOnDestroy original del componente si existe
      if (originalOnDestroy && typeof originalOnDestroy === 'function') {
        originalOnDestroy.apply(this, arguments);
      }
    };
  };
}
