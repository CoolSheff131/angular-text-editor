import { Injectable } from '@angular/core';
import { io } from "socket.io-client";
@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  subject: any
  socket = io("http://localhost:3000")
  textId?: string
  user?: string
  constructor() { }

  public openWebSocket(callback: any, textId: string, user: string){
    this.socket.on("connect", () => {
      console.log('connected');
    });

    this.textId = textId
    this.user = user
    this.socket.on('joinedRoom',(text:string)=>{
      console.log(text);
    })
    this.socket.on('leftRoom',(text:string)=>{
      console.log(text);
    })
    this.socket.emit('joinRoom',{textId, user})

    this.socket.on('msgFromServer', callback)
  }

  public sendMessage(text: String){

    this.socket.emit('msgToServer',{textId: this.textId, text})
  }

  public leaveRoom(){
    this.socket.emit('leaveRoom', {textId: this.textId, user: this.user})
  }
  
}
