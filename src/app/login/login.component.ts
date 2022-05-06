import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  emailCtrl: FormControl;
  passwordCtrl: FormControl;
  hide = true;
  constructor(
    private authService: AuthService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {
    this.emailCtrl = new FormControl();
    this.passwordCtrl = new FormControl();
  }

  ngOnInit(): void {}

  openSnackBar(message: string) {
    this._snackBar.open(message, 'ok', { duration: 2000 });
  }

  login() {
    if (this.emailCtrl.invalid) {
      this.openSnackBar('Введите корректный email');
      return;
    }
    if (this.passwordCtrl.invalid) {
      this.openSnackBar('Введите корректный пароль');
      return;
    }

    this.authService
      .login(this.emailCtrl.value, this.passwordCtrl.value)
      .subscribe(
        (data: any) => {
          localStorage.setItem('token', data.token);
          this.router.navigate(['/']);
        },
        (error) => {
          this.openSnackBar('Неправильный логин или пароль');
        }
      );
  }

  gotoRegister() {
    this.router.navigate(['/register']);
  }
}
