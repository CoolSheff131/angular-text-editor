import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-text-editor';

  constructor(private webSocketService: WebsocketService){}

  ngOnInit(): void {
    this.webSocketService.openWebSocket()
  }

  sendMessage(){  
    this.webSocketService.sendMessage()
  }
}
