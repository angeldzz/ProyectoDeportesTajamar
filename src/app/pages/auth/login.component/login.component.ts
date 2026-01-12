import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../core/services/auth-service/auth.service';
import {FormsModule} from '@angular/forms';


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

  constructor(private _authService: AuthService) {

  }
   ngOnInit() {
    console.log("Arrancando")
   }
  login(){

    this.userName=this.cajaUserName.nativeElement.value;
    this.password=this.cajaPassword.nativeElement.value;

    console.log(this.userName);
    console.log(this.password);

    this._authService.login(this.userName,this.password).subscribe(value => {
      console.log(value);
    })
  }
}
