import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

import { Router } from '@angular/router';
import { Config, TextService } from './services/text.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-text-editor';
  inText = ''

  constructor(private webSocketService: WebsocketService,
    private route: Router,
    private textService: TextService) { }

    ngOnDestroy(): void {
      console.log('Destroyed');
      this.webSocketService.leaveRoom()
    }
  
    ngOnInit(): void {
      console.log('Init App');
  
      const callback = (payload: any) => {
        this.inText = payload
      }
      this.webSocketService.openWebSocket(callback, 'test', 'aa' )
      this.textService.getTextData('test').subscribe((data: any) => {
        console.log(data);
        console.log('comes', data);
        this.inText = data
      })
    }
    
    ContentChangedHandler(event: any ){ 
      if(event.source === 'user'){
        this.webSocketService.sendMessage(this.inText)
      }
    }
}
