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

  borrarActividad(idActividad:number){
    this._deportesService.deleteActividad(idActividad).subscribe(value => {

      console.log(value);
      this.cargarActividades();
    })
  }

  @ViewChild('cajaNombreAct') cajaNombre!: ElementRef;
  @ViewChild('cajaMinimo') cajaMin!: ElementRef;

    nombreActividad!:string;
    numMin!:number;
  crearActividad(){

    this.nombreActividad=this.cajaNombre.nativeElement.value;
    this.numMin=this.cajaMin.nativeElement.value;

    this._deportesService.crearActividad(this.nombreActividad,this.numMin).subscribe(value => {
      console.log(value);
      this.cargarActividades();
    })
  }


}
