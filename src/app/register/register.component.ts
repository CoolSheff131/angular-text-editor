import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  fullname = '';
  email = '';
  password = '';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  register() {
    this.authService
      .register(this.fullname, this.email, this.password)
      .subscribe((data) => {
        console.log(data);
      });
  }
}
