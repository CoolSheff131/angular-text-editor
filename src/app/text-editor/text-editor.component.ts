import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Text } from '../models/text.model';
import { User } from '../models/user.model';
import { TextService } from '../services/text.service';
import { UserService } from '../services/user.service';
import { WebsocketService } from '../services/websocket.service';

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

  constructor(
    private webSocketService: WebsocketService,
    private activateRoute: ActivatedRoute,
    private textService: TextService,
    private userService: UserService
  ) {
    this.titleCtrl = new FormControl();
    this.webSocketService.usersInRoom.subscribe((usersInRoom) => {
      this.usersInRoom = usersInRoom;
    });
    this.userService.getMe().subscribe((userData) => {
      this.userMe = userData;
      this.activateRoute.paramMap
        .pipe(switchMap((params) => params.getAll('id')))
        .subscribe((id) => {
          this.textService.getTextByIdToEdit(id).subscribe((data) => {
            this.webSocketService.leaveRoom();
            const roomData = JSON.parse(data);
            this.text = roomData.data;
            this.titleCtrl.setValue(this.text?.title);
            console.log(roomData);
            this.webSocketService.addUsers(roomData.users);
            this.webSocketService.openWebSocket(
              (payload: any) => {
                if (this.text) {
                  console.log(payload);

                  this.text = payload;
                }
              },
              id,
              this.userMe
            );
          });
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
