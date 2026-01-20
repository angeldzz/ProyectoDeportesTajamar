import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {UsuarioService} from '../../../../core/services/usuario.service';
import {switchMap} from 'rxjs';


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

    console.log(this.userName);
    console.log(this.password);

    this._authService.login(this.userName, this.password).pipe(

      switchMap((response) => {
        this._authService.storeToken(response.response);
        this._authService.storeRole(response.idrole);

        return this._usuarioService.getDatosUsuario();
      })
    ).subscribe({
      next: (userData) => {
        console.log('Datos de usuario cargados:', userData);
        this._authService.storeNombre(userData.nombre);

        this._router.navigate(['']);
      },
      error: (err) => {
        console.error(err);
        alert('Error en el login o al recuperar datos del usuario');
      }
    });
  }
}

