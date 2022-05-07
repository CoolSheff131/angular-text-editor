import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { TextService } from './text.service';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private _socket;
  private _usersInRoom: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
    []
  );
  public usersInRoom: Observable<User[]> = this._usersInRoom.asObservable();
  private userEnter: any;
  private userLeft: any;

  textId?: string;
  user?: User;
  constructor(public auth: AuthService, private textService: TextService) {
    this._socket = io('http://localhost:3000', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${this.auth.getToken()}`,
          },
        },
      },
    });
    this._socket.on('joinedRoom', ({ users, userJoined }) => {
      this._usersInRoom.next(users);
      this.userEnter(userJoined);
    });
    this._socket.on('leftRoom', ({ users, leftUser }) => {
      this._usersInRoom.next(users);
      this.userLeft(leftUser);
    });
  }

  public openWebSocket(
    callback: any,
    callback2: any,
    callback3: any,
    callback4: any,
    updateTitle: any,
    textId: string,
    user: User
  ) {
    this.userEnter = callback3;
    this.userLeft = callback4;
    this.user = user;
    console.log(textId);

    this.textId = textId;
    this._socket.emit('joinRoom', { textId, user });
    this._socket.on('msgFromServer', callback);
    this._socket.on('selectionChanged', callback2);

    this._socket.on('updatedTitle', (data) => {
      updateTitle(data);
    });
    console.log(textId);

    this._socket.on('sendDataToJoinedUser', () => {
      this._socket.emit('sendTextInRoom', {
        textId,
        text: this.textService.text,
      });
    });

    this._socket.once('getTextInRoom', (data) => {
      this.textService.text = data;
    });
  }

  public sendMessage(text: any) {
    this._socket.emit('msgToServer', { textId: this.textId, text });
  }

  public updateTitle(title: string) {
    this._socket.emit('updateTitle', { textId: this.textId, title });
  }

  public selectionChanged(userId: string, range: any) {
    this._socket.emit('rangeChange', { textId: this.textId, userId, range });
  }

  public addUsers(users: User[]) {
    this._usersInRoom.next(users);
  }

  public leaveRoom() {
    if (this.textId && this.user) {
      this._socket.emit('leaveRoom', { textId: this.textId, user: this.user });
    }
  }
}
