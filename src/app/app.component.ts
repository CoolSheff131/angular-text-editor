import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-text-editor';
  text = 'Hello';
  constructor(private webSocketService: WebsocketService){}

  ngOnInit(): void {
    const callback = (payload: any) => {
      this.text = payload
    }

    this.webSocketService.openWebSocket(callback)
  }

  onChange(event: any){
    this.webSocketService.sendMessage(event.target.value)
  }
}
