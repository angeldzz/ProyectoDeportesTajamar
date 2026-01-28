import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagos } from '../../../models/Pagos';
import { PagosService } from '../../../core/services/pagos.service';
import { GestionEventoService } from '../../../core/services/gestion-evento.service';
import { CursosActivos } from '../../../models/CursosActivos';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

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
  public showModal: boolean = false;
  public nuevoPago: Pagos = new Pagos(0, 0, 0, 0, 'Pendiente');
  
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
      },
      error: (error) => {
        console.error('Error al actualizar el pago:', error);
      }
    });
  }

  onCantidadChange(pago: Pagos): void {
    this._pagosService.UpdatePagos(pago).subscribe({
      next: (response) => {
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

  eliminarPago(pago: Pagos): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el pago ${pago.estado} con cantidad ${pago.cantidad}€`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._pagosService.DeletePagos(pago.idPago).subscribe({
          next: () => {
            this.pagos = this.pagos.filter(p => p.idPago !== pago.idPago);
            Swal.fire('¡Eliminado!', 'El pago ha sido eliminado.', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar el pago:', error);
            Swal.fire('Error', 'No se pudo eliminar el pago.', 'error');
          }
        });
      }
    });
  }

  abrirModalCrearPago(): void {
    this.nuevoPago = new Pagos(0, 0, 0, 0, 'Pendiente');
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
    this.nuevoPago = new Pagos(0, 0, 0, 0, 'Pendiente');
  }

  crearPago(): void {
    if (this.nuevoPago.idCurso === 0) {
      Swal.fire('Error', 'Debes seleccionar un curso', 'error');
      return;
    }

    if (this.nuevoPago.cantidad <= 0) {
      Swal.fire('Error', 'La cantidad debe ser mayor a 0', 'error');
      return;
    }

    // Convertir idCurso e idPrecioActividad a números
    const pagoParaCrear = {
      idPago: 0,
      idCurso: Number(this.nuevoPago.idCurso), // Convertir a número
      idPrecioActividad: Number(this.nuevoPago.idPrecioActividad), // Convertir a número
      cantidad: Number(this.nuevoPago.cantidad), // Asegurar que sea número
      estado: this.nuevoPago.estado.toUpperCase()
    };

    console.log('Datos enviados al backend:', pagoParaCrear);

    this._pagosService.CreatePagos(pagoParaCrear as Pagos).subscribe({
      next: (pagoCreado) => {
        console.log('Pago creado exitosamente:', pagoCreado);
        this.pagos.push({
          ...pagoCreado,
          estado: this.normalizarEstado(pagoCreado.estado)
        });
        Swal.fire('¡Éxito!', 'El pago ha sido creado correctamente', 'success');
        this.cerrarModal();
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error completo:', error);
        Swal.fire('Error', 'No se pudo crear el pago. Revisa la consola para más detalles.', 'error');
      }
    });
  }
}
