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
    this._socket.on('joinedRoom', (joinedUser: User[]) => {
      this._usersInRoom.next(joinedUser);
    });
    this._socket.on('leftRoom', (leftUser: User[]) => {
      this._usersInRoom.next(leftUser);
    });
  }

  public openWebSocket(callback: any, textId: string, user: User) {
    this.user = user;
    console.log(textId);

    this.textId = textId;
    this._socket.emit('joinRoom', { textId, user });
    this._socket.on('msgFromServer', callback);
    console.log(textId);

    this._socket.on('sendDataToJoinedUser', () => {
      console.log(this.textService.text);

      this._socket.emit('sendTextInRoom', {
        textId,
        text: this.textService.text,
      });
    });
    this._socket.once('getTextInRoom', (data) => {
      console.log(data);

      this.textService.text = data;
    });
  }

  public sendMessage(text: any) {
    this._socket.emit('msgToServer', { textId: this.textId, text });
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
