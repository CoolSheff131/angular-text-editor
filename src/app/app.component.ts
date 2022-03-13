import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

import { Router } from '@angular/router';
import EditorJS from '@editorjs/editorjs';
import { Config, TextService } from './services/text.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-text-editor';
  inText = 'asd'

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
        console.log('comes', JSON.stringify(data));
        this.inText = JSON.stringify(data)
      })
    }
    
    ContentChangedHandler(event: any ){ 
      if(event.source === 'user'){
        this.webSocketService.sendMessage(this.inText)
      }
    }
}
