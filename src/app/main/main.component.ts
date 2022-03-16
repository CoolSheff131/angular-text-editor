import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  fullname = '';
  constructor(
    private readonly userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.getMe();
  }

  ngOnInit(): void {}

  getMe() {
    this.userService.getMe().subscribe((data) => {
      console.log(data);
      this.fullname = data.fullname;
    });
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
