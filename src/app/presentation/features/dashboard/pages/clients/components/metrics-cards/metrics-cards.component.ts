import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Metrics } from 'src/app/core/interfaces/client-table.interface';

@Component({
  selector: 'app-metrics-cards',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './metrics-cards.component.html',
  styleUrls: ['./metrics-cards.component.scss'],
})
/**
 * @description Componente que muestra las tarjetas de métricas de los clientes.
 */
export class MetricsCardsComponent {
  /** @description Datos de métricas a mostrar en las tarjetas */
  @Input() metrics: Metrics | null = null;
}
