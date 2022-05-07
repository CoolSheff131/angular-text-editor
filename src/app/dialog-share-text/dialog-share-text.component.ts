import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Permission } from '../models/permission.model';
import { User } from '../models/user.model';
import { TextService } from '../services/text.service';

export interface DialogData {
  textId: string;
}

export interface Token {
  id: string;
  permission: Permission;
  token: string;
  isConstant: boolean;
}

export interface UserPermission {
  id: string;
  permission: Permission;
  user: User;
}
@Component({
  selector: 'app-dialog-share-text',
  templateUrl: './dialog-share-text.component.html',
  styleUrls: ['./dialog-share-text.component.css'],
})
export class DialogShareTextComponent implements OnInit {
  textId: string;
  tokens: Token[] = [];
  userPermissions: UserPermission[] = [];
  permissions: Permission[] = ['read', 'edit'];

  isErrorTokens = false;
  isLoadingTokens = true;
  isErrorUserPermission = false;
  isLoadingUserPermission = true;
  displayedColumnsToken: string[] = ['id', 'permission', 'actions'];
  displayedColumnsUser: string[] = ['permission', 'user', 'actions'];

  selectedPermission: Permission;
  ConstantEditToken = '';
  ConstantReadToken = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private textService: TextService,
    private _snackBar: MatSnackBar
  ) {
    this.textId = data.textId;
    this.getSingleSharedTokens();
    this.getUserPermissions();
    this.selectedPermission = this.permissions[0];
  }

  getSingleSharedTokens() {
    this.textService
      .getSingleSharedTokens(this.textId)
      .subscribe((data: Token[]) => {
        this.tokens = [];
        data.forEach((token) => {
          if (token.isConstant) {
            if (token.permission == 'edit') {
              this.ConstantEditToken = token.token;
            } else if (token.permission == 'read') {
              this.ConstantReadToken = token.token;
            }
          } else {
            this.tokens.push(token);
          }
        });

        console.log(data);

        this.isLoadingTokens = false;
      });
  }

  copyToken(token: string) {
    navigator.clipboard.writeText(token);
    this._snackBar.open('Скопировано!', 'ok', { duration: 2000 });
  }

  deleteSingleToken(token: string) {
    this.textService.deleteToken(token).subscribe((data) => {
      this.getSingleSharedTokens();
    });
  }

  deleteUserPermission(idPermission: string) {
    this.textService.deleteUserPermission(idPermission).subscribe((data) => {
      this.getUserPermissions();
    });
  }

  getUserPermissions() {
    this.textService.getPermissions(this.textId).subscribe((data: any) => {
      this.isLoadingUserPermission = false;
      this.userPermissions = data;
    });
  }

  generateSingleToken() {
    this.textService
      .share(this.textId, this.selectedPermission)
      .subscribe((data) => {
        this.getSingleSharedTokens();
      });
  }

  generateConstantToken(permission: Permission) {
    this.textService.share(this.textId, permission, true).subscribe((data) => {
      this.getSingleSharedTokens();
    });
  }

  ngOnInit(): void {}
}
