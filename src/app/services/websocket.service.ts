import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  ws?: WebSocket;
  subject: any;
  socket?: any;
  constructor() { }

  public openWebSocket(callback: any){
    this.socket = io("http://localhost:3000");

    this.socket.on("connect", () => {
      console.log('connected');
    });
    this.socket.on('msgFromServer', callback)
  }

  public sendMessage(text: String){
    this.socket.emit('msgToServer',text)
  }
  
}
