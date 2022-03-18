import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Text } from '../models/text.model';
import { AuthService } from '../services/auth.service';
import { TextService } from '../services/text.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  fullname = '';
  texts?: Text[];

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly textService: TextService
  ) {
    this.getMe();
    this.getTexts();
  }

  ngOnInit(): void {}

  getMe() {
    this.userService.getMe().subscribe((data) => {
      console.log(data);
      this.fullname = data.fullname;
    });
  }

  getTexts() {
    this.textService.getMine().subscribe((data: any) => {
      this.texts = data;
      console.log(this.texts);
    });
  }

  deleteText(id: string) {
    this.textService.deleteById(id).subscribe((data) => {
      console.log(data);
      this.getTexts();
    });
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

  createText() {
    this.textService.create('test', '').subscribe((data) => {
      console.log(data);
    });
  }
}
