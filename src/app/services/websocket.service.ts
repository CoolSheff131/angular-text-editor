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

  public openWebSocket(){
    this.socket = io("http://localhost:3000");

    this.socket.on("connect", () => {
      console.log('connected');
    });
    this.socket.on('a', ()=>{
      console.log('messs');
      
    })
    // this.subject = webSocket('ws://http://localhost:3000');
     
    // this.subject?.subscribe();
    
     
    


    // this.ws = new WebSocket('ws://localhost:3000/msg')
    // this.ws.onerror = (e) =>{
    //   console.log('err', e);
    // }
    // this.ws.onopen = (e) => {
    //   console.log('open ' + e);
    // }
    // this.ws.onmessage = (e) => {
    //      console.log(e);
    // }
    // this.ws.onclose = (e) => {
    //   console.log('close' + e);      
    // }
  }

  public sendMessage(){

    this.socket.emit('msg','asd')
    // this.subject?.next({message: 'some message'});
    //this.ws?.send('as')
  }
  
}
