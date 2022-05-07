import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CreateTextDialogComponent } from '../create-text-dialog/create-text-dialog.component';
import { DialogActiveTokenComponent } from '../dialog-active-token/dialog-active-token.component';
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
  displayedColumns: string[] = ['title', 'user', 'updatedAt', 'actions'];
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
  isLoadingMe = true;
  isLoadingMineTexts = true;
  isErrorMe = false;
  isErrorMineTexts = false;
  searchedTitle = '';
  ownerFilter: 'all' | 'me' | 'shared' = 'all';

  isViewTable = true;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly textService: TextService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.getMe();
    this.getTexts();
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

        this.signOut();
      },
    });
  }

  filterByOwner() {
    switch (this.ownerFilter) {
      case 'me':
        this.dataSource = this.dataSource.filter(
          (text) => text.text.user.id === this.Me?.id
        );
        break;
      case 'shared':
        this.dataSource = this.dataSource.filter(
          (text) => text.text.user.id !== this.Me?.id
        );
        break;
    }
  }

  getTexts() {
    this.textService.getMine().subscribe({
      next: (data: SharedText[]) => {
        data.forEach((text) => {
          const date = new Date(text.text.updatedAt);

          text.text.updatedAt = `${date.getDay()} ${
            this.month[date.getMonth()]
          } ${date.getFullYear()}г.`;
        });
        this.dataSource = data;
        this.filterByOwner();
        this.isLoadingMineTexts = false;
      },
      error: (err) => {
        this.isLoadingMineTexts = false;
        this.isErrorMineTexts = true;
      },
    });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'ok', { duration: 2000 });
  }

  deleteText(id: string) {
    this.textService.deleteById(id).subscribe({
      next: (data) => {
        this.openSnackBar('Текст удален');
        this.getTexts();
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
            this.getTexts();
          },
          error: (error) => {
            this.openSnackBar('Ошибка создания текста');
          },
        });
      }
    });
  }

  activateToken() {
    this.dialog
      .open(DialogActiveTokenComponent)
      .afterClosed()
      .subscribe(() => {
        this.getTexts();
      });
  }

  onSearch(searchedTitle: string, isSearch = true) {
    if (isSearch) {
      this.searchedTitle = searchedTitle;
    }
    if (this.searchedTitle) {
      this.textService.search(this.searchedTitle).subscribe((searchedText) => {
        this.dataSource = searchedText;
        this.filterByOwner();
      });
    } else {
      this.getTexts();
    }
  }

  onAvatarSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.userService.uploadAvatar(formData).subscribe(() => [this.getMe()]);
    }
  }

  deleteAvatar() {
    this.userService.deleteAvatar().subscribe(() => {
      this.getMe();
    });
  }
}
