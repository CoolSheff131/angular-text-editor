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
import Quill from 'quill';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';
import { ImageService } from '../services/image.service';
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
    };

    this.webSocketService.usersInRoom.subscribe((usersInRoom) => {
      this.usersInRoom = usersInRoom;
    });
    this.userService.getMe().subscribe((userData) => {
      this.userMe = userData;
      this.activateRoute.paramMap
        .pipe(switchMap((params) => params.getAll('id')))
        .subscribe((id) => {
          this.textService.getTextByIdToEdit(id).subscribe(
            (data) => {
              this.webSocketService.leaveRoom();
              const roomData = JSON.parse(data);
              this.text = roomData.data;
              this.titleCtrl.setValue(this.text?.title);
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
            (error) => {
              this.router.navigate(['textNotFound']);
            }
          );
        });
    });
  }

  ngOnInit(): void {
    window.onbeforeunload = () => this.ngOnDestroy();
  }

  saveChanges() {
    this.textService
      .updateTextById(
        this.text.id,
        this.titleCtrl.value,
        this.text.content || ''
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  share() {
    const dialogRef = this.dialog.open(DialogShareTextComponent, {
      data: {
        textId: this.text.id,
      },
    });
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.webSocketService.leaveRoom();
  }

  ContentChangedHandler(event: any) {
    if (event.source === 'user' && this.text.content) {
      this.webSocketService.sendMessage(this.text);
    }
  }
}
