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
    if (this.fullnameCtrl.invalid) {
      this._snackBar.open('Введите корректный email');
      return;
    }
    if (this.emailCtrl.invalid) {
      this._snackBar.open('Введите корректный email');
      return;
    }
    if (this.passwordCtrl.invalid) {
      this._snackBar.open('Введите корректный пароль');
      return;
    }

    this.authService
      .register(
        this.fullnameCtrl.value,
        this.emailCtrl.value,
        this.passwordCtrl.value
      )
      .subscribe(
        (data: any) => {
          localStorage.setItem('token', data.token);
          this.router.navigate(['/']);
        },
        (error) => {
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
