import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  fullnameCtrl: FormControl;
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  hide = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.fullnameCtrl = new FormControl();
    this.emailCtrl = new FormControl();
    this.passwordCtrl = new FormControl();
  }

  ngOnInit(): void {}

  register() {
    this.authService
      .register(
        this.fullnameCtrl.value,
        this.emailCtrl.value,
        this.passwordCtrl.value
      )
      .subscribe(
        (data: any) => {
          console.log(data);
          localStorage.setItem('token', data.token);
        },
        (error) => {
          console.log(error);
          this._snackBar.open('Ошибка регистрации', 'Закрыть', {
            duration: 3000,
          });
        }
      );
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
