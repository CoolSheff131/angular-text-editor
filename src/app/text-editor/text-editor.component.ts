import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import { untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, skip, Observable } from 'rxjs';
import { WebsocketService } from '../services/websocket.service';


@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {
  text = 'Hello'
  textId?: string;

  editorData: any;
  editor?: EditorJS;
  editorObserver?: MutationObserver;

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
        if(event instanceof NavigationStart){
          this.webSocketService.leaveRoom()
          this.textId = event.url.split('/').pop() || '1'
          this.webSocketService.openWebSocket(callback, this.textId, 'aa' )
        }
      })

    }

  
    onChange(event: any){
      this.webSocketService.sendMessage(event.target.value)
    }

}
