import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagos } from '../../../models/Pagos';
import { PagosService } from '../../../core/services/pagos.service';
import { GestionEventoService } from '../../../core/services/gestion-evento.service';
import { CursosActivos } from '../../../models/CursosActivos';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pagos',
  imports: [CommonModule, FormsModule],
  templateUrl: './pagos.component.html',
  styleUrl: './pagos.component.css',
})
export class PagosComponent implements OnInit {
  public pagos!: Array<Pagos>;
  public cursos!: Array<CursosActivos>;
  public role$!: Observable<number | null>;
  constructor(private _pagosService: PagosService,
    private _gestionEvento: GestionEventoService,
    private _authService: AuthService
  ){
    this.role$ = this._authService.userRole$;
  }
  ngOnInit(): void {
    this._pagosService.GetPagos().subscribe(data => {
      this.pagos = data.map(pago => ({
        ...pago,
        estado: this.normalizarEstado(pago.estado)
      }));
    });
    this._gestionEvento.getCursosActivos().subscribe(response => {
      this.cursos = response;
    });
  }

  normalizarEstado(estado: string): string {
    const estadoLower = estado.toLowerCase().trim();
    if (estadoLower === 'pagado' || estadoLower === 'completado') {
      return 'Pagado';
    } else if (estadoLower === 'pendiente') {
      return 'Pendiente';
    } else if (estadoLower === 'sin pagar' || estadoLower === 'cancelado' || estadoLower === 'impagado') {
      return 'Sin Pagar';
    }
    return 'Pendiente'; // valor por defecto
  }

  onEstadoChange(pago: Pagos): void {
    this._pagosService.UpdatePagos(pago).subscribe({
      next: (response) => {
        console.log('Pago actualizado correctamente:', response);
      },
      error: (error) => {
        console.error('Error al actualizar el pago:', error);
      }
    });
  }

  onCantidadChange(pago: Pagos): void {
    this._pagosService.UpdatePagos(pago).subscribe({
      next: (response) => {
        console.log('Cantidad actualizada correctamente:', response);
      },
      error: (error) => {
        console.error('Error al actualizar la cantidad:', error);
      }
    });
  }

  getPagosPorCurso(idCurso: number): Pagos[] {
    if (!this.pagos) return [];
    return this.pagos.filter(pago => pago.idCurso === idCurso);
  }

  getTotalCantidadPorCurso(idCurso: number): number {
    const pagosCurso = this.getPagosPorCurso(idCurso);
    return pagosCurso.reduce((total, pago) => total + pago.cantidad, 0);
  }

  getTotalPagadoPorCurso(idCurso: number): number {
    const pagosCurso = this.getPagosPorCurso(idCurso);
    return pagosCurso
      .filter(pago => pago.estado.toLowerCase() === 'pagado')
      .reduce((total, pago) => total + pago.cantidad, 0);
  }

  getPendientePorCurso(idCurso: number): number {
    const pagosCurso = this.getPagosPorCurso(idCurso);
    return pagosCurso
      .filter(pago => pago.estado.toLowerCase() === 'pendiente' || pago.estado.toLowerCase() === 'sin pagar')
      .reduce((total, pago) => total + pago.cantidad, 0);
  }
}
