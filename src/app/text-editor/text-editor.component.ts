import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { TextService } from '../services/text.service';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogShareTextComponent } from '../dialog-share-text/dialog-share-text.component';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;

import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import ImageResize from 'quill-image-resize-module';
import html2canvas from 'html2canvas';
import QuillCursors from 'quill-cursors';
import { Permission } from '../models/permission.model';

Quill.register('modules/cursors', QuillCursors);
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
})
export class TextEditorComponent implements OnInit {
  usersInRoom: User[] = [];
  userMe!: User;
  modules: any;
  timeout: any = null;
  isLoadingText = true;
  isErrorText = false;
  isLoadingMe = true;
  isErrorMe = false;
  permission!: Permission;
  textSaving = false;
  editor: any;
  cursorsOne?: QuillCursors;
  firstUsers?: any;

  constructor(
    private webSocketService: WebsocketService,
    private activateRoute: ActivatedRoute,
    public textService: TextService,
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.modules = {
      toolbar: '#toolbar',
      imageHandler: {
        upload: (file) => {
          return this.textService.uploadImage(file);
        },
        accepts: ['png', 'jpg', 'jpeg', 'jfif'], // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
      } as Options,
      imageResize: true,
      cursors: true,
    };
  }

  titleUpdated() {
    this.webSocketService.updateTitle();
  }
  ngOnInit(): void {
    this.userService.getMe().subscribe({
      next: (userData) => {
        this.isLoadingMe = false;
        this.userMe = userData;

        this.webSocketService.usersInRoom.subscribe((usersInRoom) => {
          this.usersInRoom =
            usersInRoom.filter((user) => user.id !== this.userMe.id) || [];
        });

        this.activateRoute.paramMap
          .pipe(switchMap((params) => params.getAll('id')))
          .subscribe((id) => {
            this.textService.getTextByIdToEdit(id).subscribe({
              next: (data) => {
                this.isLoadingText = false;
                this.webSocketService.leaveRoom();
                const roomData = JSON.parse(data);
                this.permission = roomData.userPermission;

                console.log(this.textService.text);

                this.firstUsers = roomData.users;

                this.webSocketService.addUsers(roomData.users);
                this.webSocketService.openWebSocket(
                  (payload: any) => {
                    this.editor.editor.applyDelta(payload);
                  },
                  (payload) => {
                    this.cursorsOne?.moveCursor(payload.userId, payload.range);
                  },
                  (userEnter) => {
                    this.cursorsOne?.createCursor(
                      userEnter.id,
                      userEnter.fullname,
                      'blue'
                    );
                  },
                  (userLeft) => {
                    this.cursorsOne?.removeCursor(userLeft.id);
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

  onEditorCreated(editor: any): void {
    console.log('RABOTAET');

    this.editor = editor;
    this.cursorsOne = editor.getModule('cursors');

    this.firstUsers.forEach((user) => {
      this.cursorsOne?.createCursor(user.id, user.fullname, 'blue');
    });
  }

  async saveChanges() {
    const dateTextSaved = new Date();
    this.textSaving = true;
    this.textService.updateTextById().subscribe(async (data) => {
      const previewImg = await this.screenshot();
      this.textService
        .updateTextPreviewById(this.textService.text.id, previewImg)
        .subscribe((d) => {
          console.log(dateTextSaved);

          this.webSocketService.textSaved(dateTextSaved);
          this.textSaving = false;
        });
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
    this.dialog.open(DialogShareTextComponent, {
      data: {
        textId: this.textService.text.id,
      },
      width: '6000px',
    });
  }

  ngOnDestroy(): void {
    this.webSocketService.leaveRoom();
  }

  ContentChangedHandler(event: any) {
    if (this.permission == 'edit' || this.permission || 'owner') {
      //clearTimeout(this.timeout);
      if (
        event.source === 'user' &&
        this.textService.text.content !== undefined
      ) {
        //this.timeout = setTimeout(() => {
        this.webSocketService.sendMessage(event.delta.ops);
        //}, 1);
      }
    }
  }

  selectionChangeHandler({ range, source }) {
    if (source === 'user') {
      this.webSocketService.selectionChanged(this.userMe.id, range);
    }
  }
}
