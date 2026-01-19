import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ColoresService} from '../../../../core/services/colores.service';
import {Colores} from '../../../../models/Colores';
import Swal from 'sweetalert2';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-colores-form',
  templateUrl: './colores.component.html',
  styleUrl: './colores.component.css',
  imports: [
    FormsModule
  ]
})
export class ColoresComponent implements OnInit {

  public colores: Array<Colores> = [];
  public idEditando!: number;
  nombreColor!:String;
  @ViewChild('cajaNombre') cajaNombre!: ElementRef;

  @ViewChild('cajaId') cajaId!: ElementRef;
  @ViewChild('cajaNombreModal') cajaNombreModal!: ElementRef;

  constructor(private _coloresService: ColoresService) { }

  ngOnInit(): void {
   this._coloresService.getColores().subscribe(value => {
      this.colores = value;
   })
  }


  getVariableColor(nombre: string): string {
    if (!nombre) return 'var(--color-default)';

    // Pasamos a minúsculas y quitamos espacios para evitar errores
    const clave = nombre.toLowerCase().trim();

    // Retornamos la variable CSS correspondiente
    // Esto asume que si el back devuelve "Rojo", tú tienes "--color-rojo"
    return `var(--color-${clave}, var(--color-default))`;
  }

  cargarDatosEnModal(color: any): void {
    // Cuando pulsas editar, pasamos los datos del objeto a los inputs del modal
    this.cajaId.nativeElement.value = color.idColor;
    this.cajaNombreModal.nativeElement.value = color.nombreColor;
  }



  deleteColor(idColor:Number): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._coloresService.deleteColor(idColor).subscribe(value => {
          console.log(value);
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        });
      }
    });
  }

  crearColor(){


   this.nombreColor= this.cajaNombre.nativeElement.value;

   this._coloresService.createColor(this.nombreColor).subscribe(value => {
     console.log(value);
     window.location.reload();
   })
  }

  updateColor(){
    this.nombreColor=this.cajaNombreModal.nativeElement.value;
    this.idEditando=this.cajaId.nativeElement.value;


    this._coloresService.updateColor(this.idEditando,this.nombreColor).subscribe(value => {
      console.log(this.idEditando,this.nombreColor);
      window.location.reload();
    })
  }
}
