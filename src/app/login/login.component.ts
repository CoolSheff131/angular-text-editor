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

  login() {
    this.authService
      .login(this.emailCtrl.value, this.passwordCtrl.value)
      .subscribe(
        (data: any) => {
          localStorage.setItem('token', data.token);
          this.router.navigate(['/']);
        },
        (error) => {
          this._snackBar.open('Неправильный логин или пароль');
        }
      );
  }

  gotoRegister() {
    this.router.navigate(['/register']);
  }
}
