import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {UsuarioService} from '../../../../core/services/usuario.service';
import {switchMap} from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {

  public userName!:string;
  public password!: string;
  public showPassword: boolean = false;

  @ViewChild('cajaUser') cajaUserName !: ElementRef;
  @ViewChild('cajaPass') cajaPassword !: ElementRef;

  constructor(private _authService: AuthService,
              private _router: Router,
              private _usuarioService: UsuarioService,) {

  }
  ngOnInit(): void {

    if (this._authService.isLoggedInUser) {
      this._router.navigate(['']).then(r => {});
    }

  }

  login() {
    this.userName=this.cajaUserName.nativeElement.value+"@tajamar365.com";
    this.password=this.cajaPassword.nativeElement.value;

    this._authService.login(this.userName, this.password).pipe(

      switchMap((response) => {
        this._authService.storeToken(response.response);
        this._authService.storeRole(response.idrole);

        return this._usuarioService.getDatosUsuario();
      })
    ).subscribe({
      next: (userData) => {
        this._authService.storeNombre(userData.nombre);

        this._router.navigate(['']);
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: 'Error en el login o al recuperar datos del usuario',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}

