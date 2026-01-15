import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../../core/services/auth.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';


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

  constructor(private _authService: AuthService,private _router: Router) {

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


    this._authService.login(this.userName,this.password).subscribe({
      next: (response): void => {

        // this._authService.userRoleSubject.next(this.authService.getUserRole());
        //TODO CUANDO SE ACTIVE LA SEGURIDAD CORRECTAMENTE DEJAR DE GUARDAR EN LOCALSTORAGE EL ROL

        this._authService.storeToken(response.response);
        this._authService.storeRole(response.role);
        this._router.navigate([''])
          .then((r: boolean): void => {});
      },
      error: (err) => alert('Credenciales inválidas')
    });
  }
}

