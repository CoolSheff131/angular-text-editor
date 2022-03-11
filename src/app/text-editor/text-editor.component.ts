import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {
  text = 'Hello'
  textId?: string;
  constructor(private webSocketService: WebsocketService,
    private route: Router) { }

    ngOnDestroy(): void {
      this.webSocketService.leaveRoom()
    }
  
    ngOnInit(): void {
      
      const callback = (payload: any) => {
        this.text = payload
      }
      this.route.events.subscribe((event)=>{
        if(event instanceof NavigationEnd){
          this.webSocketService.leaveRoom()
          this.textId = event.url.split('/').pop() || '1'
          console.log(this.textId );
          
          this.webSocketService.openWebSocket(callback, this.textId, 'aa' )
        }
        
      })

    }
  
    onChange(event: any){
      this.webSocketService.sendMessage(event.target.value)
    }

}
