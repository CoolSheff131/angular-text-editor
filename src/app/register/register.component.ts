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

  openSnackBar(message: string) {
    this._snackBar.open(message, 'ok', { duration: 2000 });
  }

  register() {
    if (this.fullnameCtrl.invalid) {
      this.openSnackBar('Введите корректный email');
      return;
    }
    if (this.emailCtrl.invalid) {
      this.openSnackBar('Введите корректный email');
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
          this.openSnackBar('Ошибка регистрации');
        }
      );
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }
}
