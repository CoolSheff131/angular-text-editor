import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Permission } from '../models/permission.model';
import { Text } from '../models/text.model';
import { User } from '../models/user.model';
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
  Me?: User;
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
  isLoadingMe = true;
  isLoadingMineTexts = true;
  isLoadingSharedTexts = true;
  isErrorMe = false;
  isErrorMineTexts = false;
  isErrorSharedTexts = false;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly textService: TextService,
    private _snackBar: MatSnackBar
  ) {
    this.getMe();
    this.getMineTexts();
    this.getSharedTexts();
  }

  ngOnInit(): void {}

  getMe() {
    this.userService.getMe().subscribe({
      next: (data) => {
        this.Me = data;
        this.isLoadingMe = false;
      },
      error: (error) => {
        this.isLoadingMe = false;
        this.isErrorMe = true;
      },
    });
  }

  getMineTexts() {
    this.textService.getMine().subscribe({
      next: (data: any) => {
        this.dataSource = data;
        this.isLoadingMineTexts = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoadingMineTexts = false;
        this.isErrorMineTexts = true;
      },
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message);
  }

  getSharedTexts() {
    this.textService.getShared().subscribe({
      next: (data: any) => {
        this.sharedTexts = data;
        this.isLoadingSharedTexts = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoadingSharedTexts = false;
        this.isErrorSharedTexts = true;
      },
    });
  }

  deleteText(id: string) {
    this.textService.deleteById(id).subscribe({
      next: (data) => {
        this.openSnackBar('Текст удален');
        this.getMineTexts();
      },
      error: (error) => {
        this.openSnackBar('Ошибка удаления текста');
      },
    });
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }

  createText() {
    this.textService.create('test', '').subscribe({
      next: (data) => {
        this.openSnackBar('Текст создан');
        this.getMineTexts();
      },
      error: (error) => {
        this.openSnackBar('Ошибка создания текста');
      },
    });
  }

  activate() {
    this.textService.activate(this.activateId).subscribe({
      next: (data) => {
        this.openSnackBar('Другой текст найден');
        this.getSharedTexts();
      },
      error: (error) => {
        this.openSnackBar('Ошибка активации');
      },
    });
  }
}
