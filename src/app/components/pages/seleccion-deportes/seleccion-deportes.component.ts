import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import {DeportesService} from '../../../core/services/deportes.service';
import {ActividadDeportes} from '../../../models/ActividadDeportes';
@Component({
  selector: 'app-seleccion-deportes',
  imports: [],
  templateUrl: './seleccion-deportes.component.html',
  styleUrl: './seleccion-deportes.component.css',
})
export class SeleccionDeportesComponent implements OnInit {
  public idEvento!: number;
  public deportes!: Array<ActividadDeportes>;
  constructor(private _activeRoute: ActivatedRoute,private _deportesService: DeportesService) {}

  ngOnInit(): void {
    this._activeRoute.params.subscribe((parametros: Params) => {
      if (parametros['idEvento'] != null) {

        this.idEvento = Number(parametros['idEvento']);
        console.log('ID del evento:', this.idEvento);

        this._deportesService.getDeportesEvento(this.idEvento).subscribe(value => {

          this.deportes= value;

          console.log(this.deportes);
        });
      }
    });
  }
}
