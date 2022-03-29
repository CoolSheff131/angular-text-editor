import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Permission } from '../models/permission.model';
import { User } from '../models/user.model';
import { TextService } from '../services/text.service';

export interface DialogData {
  textId: string;
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
  singleLinks: string[] = [];
  userPermissions: UserPermission[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private textService: TextService
  ) {
    this.textId = data.textId;
    this.getSingleSharedLinks();
    this.getUserPermissions();
  }

  getSingleSharedLinks() {
    this.textService
      .getSingleSharedLinks(this.textId)
      .subscribe((data: any) => {
        this.singleLinks = data;
      });
  }

  deleteSingleLink(token: string) {
    console.log(token);

    this.textService.deleteToken(token).subscribe((data) => {
      console.log(data);
      this.getSingleSharedLinks();
    });
  }

  deleteUserPermission(idPermission: string) {
    this.textService.deleteUserPermission(idPermission).subscribe((data) => {
      console.log('deletedPermission', data);
      this.getUserPermissions();
    });
  }

  getUserPermissions() {
    this.textService.getPermissions(this.textId).subscribe((data: any) => {
      console.log(data);
      this.userPermissions = data;
    });
  }

  generateSingleLink() {
    this.textService.share(this.textId, 'edit').subscribe((data) => {
      this.getSingleSharedLinks();
    });
  }

  ngOnInit(): void {}
}
