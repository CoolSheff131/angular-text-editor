import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permission } from '../models/permission.model';
import { Text } from '../models/text.model';
import { AuthService } from '../services/auth.service';
import { TextService } from '../services/text.service';
import { UserService } from '../services/user.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

interface SharedText {
  permission: Permission;
  text: Text;
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  fullname = '';

  activateId = '';
  displayedColumns: string[] = [
    'id',
    'title',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  dataSource: Text[] = [];
  sharedTexts: SharedText[] = [];

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly textService: TextService
  ) {
    this.getMe();
    this.getMineTexts();
    this.getSharedTexts();
  }

  ngOnInit(): void {}

  getMe() {
    this.userService.getMe().subscribe((data) => {
      console.log(data);
      this.fullname = data.fullname;
    });
  }

  getMineTexts() {
    this.textService.getMine().subscribe((data: any) => {
      this.dataSource = data;
      console.log(data);
    });
  }

  getSharedTexts() {
    this.textService.getShared().subscribe((data: any) => {
      this.sharedTexts = data;
      console.log('shared', data);
    });
  }

  deleteText(id: string) {
    this.textService.deleteById(id).subscribe((data) => {
      console.log(data);
      this.getMineTexts();
    });
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

  createText() {
    this.textService.create('test', '').subscribe((data) => {
      console.log(data);
      this.getMineTexts();
    });
  }

  activate() {
    this.textService.activate(this.activateId).subscribe((data) => {
      this.getSharedTexts();
    });
  }
}
