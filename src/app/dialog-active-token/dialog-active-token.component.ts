import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData } from '../dialog-share-text/dialog-share-text.component';
import { TextService } from '../services/text.service';

@Component({
  selector: 'app-dialog-active-token',
  templateUrl: './dialog-active-token.component.html',
  styleUrls: ['./dialog-active-token.component.css'],
})
export class DialogActiveTokenComponent implements OnInit {
  tokenCtrl: FormControl;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _snackBar: MatSnackBar,
    private readonly textService: TextService,
    public dialogRef: MatDialogRef<DialogActiveTokenComponent>
  ) {
    this.tokenCtrl = new FormControl();
  }

  ngOnInit(): void {}

  openSnackBar(message: string) {
    this._snackBar.open(message, 'ok', { duration: 2000 });
  }

  activateToken() {
    this.textService.activateToken(this.tokenCtrl.value).subscribe({
      next: (data) => {
        this.openSnackBar('Другой текст найден');
        this.dialogRef.close();
      },
      error: (error) => {
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
