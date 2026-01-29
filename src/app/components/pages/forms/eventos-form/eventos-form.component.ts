import {Component, OnInit} from '@angular/core';
import {EventosService} from '../../../../core/services/eventos.service';
import {Evento} from '../../../../models/Evento';
import {DatePipe, NgIf} from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-eventos-form',
  imports: [
    DatePipe,
    NgIf
  ],
  templateUrl: './eventos-form.component.html',
  styleUrl: './eventos-form.component.css',
})
export class EventosFormComponent implements OnInit {
  eventos!:Array<Evento>;
  constructor(private _eventosService: EventosService) {
  }

  ngOnInit() {

    this.getEventos();
  }

  getEventos(){
    this._eventosService.GetEventos().subscribe({
      next: (value) => {
        console.log(value);
        this.eventos = value;
      },
      error: error => {
        console.log(error);
      }
    })
  }

  borrarEventoPanic(idEvento:number){
    console.log("el id",idEvento)
    Swal.fire({
      title: "Estas seguro?",
      text: "Borraras todo relacionado con el evento",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("el id",idEvento)
        this._eventosService.eliminarEventoPanic(idEvento).subscribe({
        next: (value) => {
          Swal.fire({
            title: "Evento Borrado!",
            text: "",
            icon: "success"
          });
          this.getEventos();
        },
        error: error => {
          console.log(error);
          Swal.fire({
            title: "Ha ocurrido un error!",
            text: "",
            icon: "error"
          });
        }
        });

      }
    });



  }


}
