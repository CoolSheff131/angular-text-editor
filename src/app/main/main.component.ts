import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {}

  getMe() {
    this.userService.getMe().subscribe((data) => {
      console.log(data);
    });
  }
}
