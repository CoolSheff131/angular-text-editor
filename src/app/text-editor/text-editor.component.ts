import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Text } from '../models/text.model';
import { User } from '../models/user.model';
import { TextService } from '../services/text.service';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogShareTextComponent } from '../dialog-share-text/dialog-share-text.component';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;

import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import { ImageService } from '../services/image.service';
import ImageResize from 'quill-image-resize-module';
import html2canvas from 'html2canvas';
import { Permission } from '../models/permission.model';

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
})
export class TextEditorComponent implements OnInit {
  usersInRoom: User[] | undefined;
  userMe!: User;
  text!: Text;
  titleCtrl: FormControl;
  modules: any;
  timeout: any = null;
  isLoadingText = true;
  isErrorText = false;
  isLoadingMe = true;
  isErrorMe = false;
  permission!: Permission;

  constructor(
    private webSocketService: WebsocketService,
    private activateRoute: ActivatedRoute,
    private textService: TextService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog,
    private imageService: ImageService
  ) {
    this.titleCtrl = new FormControl();

    this.modules = {
      toolbar: '#toolbar',
      imageHandler: {
        upload: (file) => {
          return this.imageService.upload(file);
        },
        accepts: ['png', 'jpg', 'jpeg', 'jfif'], // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
      } as Options,
      imageResize: true,
    };

    this.webSocketService.usersInRoom.subscribe((usersInRoom) => {
      this.usersInRoom = usersInRoom;
    });
    this.userService.getMe().subscribe({
      next: (userData) => {
        this.isLoadingMe = false;
        this.userMe = userData;

        this.activateRoute.paramMap
          .pipe(switchMap((params) => params.getAll('id')))
          .subscribe((id) => {
            this.textService.getTextByIdToEdit(id).subscribe({
              next: (data) => {
                this.isLoadingText = false;
                this.webSocketService.leaveRoom();
                const roomData = JSON.parse(data);
                this.permission = roomData.userPermission;

                this.text = roomData.data;
                this.titleCtrl.setValue(this.text?.title);
                if (this.permission == 'read') {
                  this.titleCtrl.disable();
                }
                this.webSocketService.addUsers(roomData.users);
                this.webSocketService.openWebSocket(
                  (payload: any) => {
                    if (this.text) {
                      this.text = payload;
                    }
                  },
                  id,
                  this.userMe
                );
              },
              error: (error) => {
                this.isLoadingText = false;
                this.isErrorText = true;
                this.router.navigate(['textNotFound']);
              },
            });
          });
      },
      error: (error) => {
        this.isErrorMe = true;
        this.isLoadingMe = false;
      },
    });
  }

  ngOnInit(): void {
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  async saveChanges() {
    this.textService
      .updateTextById(
        this.text.id,
        this.titleCtrl.value,
        this.text.content || ''
      )
      .subscribe(async (data) => {
        const previewImg = await this.screenshot();

        this.textService
          .updateTextPreviewById(this.text.id, previewImg)
          .subscribe((d) => {});
      });
  }

  async screenshot() {
    let html = document.getElementById('textContainer');

    const canvas = await html2canvas(html!, {
      allowTaint: false,
      useCORS: true,
    });

    return new Promise<File>((resolve, reject) => {
      canvas.toBlob((blob) => {
        var file = new File([blob!], 'name');
        resolve(file);
      }, 'image/png');
    });
  }

  share() {
    const dialogRef = this.dialog.open(DialogShareTextComponent, {
      data: {
        textId: this.text.id,
      },
      width: '6000px',
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.leaveRoom();
  }

  ContentChangedHandler(event: any) {
    if (this.permission == 'edit' || this.permission || 'owner') {
      clearTimeout(this.timeout);
      if (event.source === 'user' && this.text.content !== undefined) {
        this.timeout = setTimeout(() => {
          this.webSocketService.sendMessage(this.text);
        }, 100);
      }
    }
  }
}
