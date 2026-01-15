import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-seleccion-deportes',
  imports: [],
  templateUrl: './seleccion-deportes.component.html',
  styleUrl: './seleccion-deportes.component.css',
})
export class SeleccionDeportesComponent implements OnInit {
  public idEvento!: number;

  constructor(private _activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this._activeRoute.params.subscribe((parametros: Params) => {
      if (parametros['idEvento'] != null) {
        this.idEvento = Number(parametros['idEvento']);
        console.log('ID del evento:', this.idEvento);
      }
    });
  }
}
