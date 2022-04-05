import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // subject: any
  private _socket;
  private _usersInRoom: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(
    []
  );
  public usersInRoom: Observable<User[]> = this._usersInRoom.asObservable();
  // private _text: BehaviorSubject<string> = new BehaviorSubject<string>('');
  // public text: Observable<string> = this._text.asObservable();

  textId?: string;
  user?: User;
  constructor() {
    this._socket = io('http://localhost:3000');
    this._socket.on('joinedRoom', (joinedUser: User[]) => {
      this._usersInRoom.next(joinedUser);
    });

    this._socket.on('leftRoom', (leftUser: User[]) => {
      this._usersInRoom.next(leftUser);
    });
  }

  public openWebSocket(callback: any, textId: string, user: User) {
    this.user = user;
    this.textId = textId;
    this._socket.emit('joinRoom', { textId, user });
    this._socket.on('msgFromServer', callback);
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
