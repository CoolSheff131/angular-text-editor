import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateTextDialogComponent } from '../create-text-dialog/create-text-dialog.component';
import { Permission } from '../models/permission.model';
import { Text } from '../models/text.model';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { TextService } from '../services/text.service';
import { UserService } from '../services/user.service';

export interface SharedText {
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
    'user',
    'createdAt',
    'updatedAt',
    'actions',
  ];
  month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  dataSource: SharedText[] = [];
  sharedTexts: SharedText[] = [];
  isLoadingMe = true;
  isLoadingMineTexts = true;
  isLoadingSharedTexts = true;
  isErrorMe = false;
  isErrorMineTexts = false;
  isErrorSharedTexts = false;

  isViewTable = false;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly textService: TextService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
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
      next: (data: SharedText[]) => {
        this.dataSource = data;
        data.forEach((text) => {
          const date = new Date(text.text.updatedAt);

          text.text.updatedAt = `${date.getDay()} ${
            this.month[date.getMonth()]
          } ${date.getFullYear()}г.`;
        });
        console.log(data);

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
    this._snackBar.open(message, 'ok', { duration: 2000 });
  }

  getSharedTexts() {
    this.textService.getShared().subscribe({
      next: (data: SharedText[]) => {
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
    const dialogRef = this.dialog.open(CreateTextDialogComponent, {
      width: '450px',
      data: '',
    });
    dialogRef.afterClosed().subscribe((name) => {
      if (name) {
        this.textService.create(name, '').subscribe({
          next: (data) => {
            this.openSnackBar('Текст создан');
            this.getMineTexts();
          },
          error: (error) => {
            this.openSnackBar('Ошибка создания текста');
          },
        });
      }
    });
  }

  activate() {
    this.textService.activate(this.activateId).subscribe({
      next: (data) => {
        console.log(data);

        this.openSnackBar('Другой текст найден');
        this.getSharedTexts();
      },
      error: (error) => {
        console.log(error);
        if (error.status === 406) {
          return this.openSnackBar('Вы владец текста!');
        }
        if (error.status === 404) {
          return this.openSnackBar('Токена не существует!');
        }
        if (error.status === 403) {
          return this.openSnackBar('У вас уже есть доступ к тексту!');
        }
        this.openSnackBar('Ошибка активации');
      },
    });
  }
}
