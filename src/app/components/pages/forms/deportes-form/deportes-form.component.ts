import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Deporte} from '../../../../models/Deportes';
import {HttpClient} from '@angular/common/http';
import {DeportesService} from '../../../../core/services/deportes.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-deportes-form',
  imports: [
    FormsModule
  ],
  templateUrl: './deportes-form.component.html',
  styleUrl: './deportes-form.component.css',
})

export class DeportesFormComponent implements OnInit {
  @ViewChild('cajaNombreAct') cajaNombreAct!: ElementRef;
  @ViewChild('cajaMinimo') cajaMinimo!: ElementRef;

  constructor(private _deportesService: DeportesService) { }
  actividades!: Array<Deporte>;
  ngOnInit(): void {
    this.cargarActividades();
  }

  cargarActividades(): void {
    this._deportesService.getActividades().subscribe(value => {
      this.actividades=value;
    })
  }
}
