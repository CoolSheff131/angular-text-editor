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
  
  editorData: any;
  editor?: EditorJS;

  constructor(private webSocketService: WebsocketService,
    private route: Router,
    private textService: TextService) { }

    ngOnDestroy(): void {
      console.log('Destroyed');
      this.webSocketService.leaveRoom()
    }
  
    ngOnInit(): void {
      console.log('Init App');
      const onChangeHandler = (d1: any, d2: any) => {
        this.editor?.save().then((outputData) => {
          let blocks =  JSON.stringify(outputData);
          this.webSocketService.sendMessage(blocks)
        })
      }
      this.editor = new EditorJS(
        {
          holder: 'editorjs',
          onChange: onChangeHandler, 
        }
      )
  
      const callback = (payload: any) => {
        if(this.editorData != payload){
          this.editorData = payload
          let blocks = JSON.parse(payload)
          
          if(this.editor){
            this.editor.blocks.render(blocks)
          }
        }
      }
      this.webSocketService.openWebSocket(callback, 'test', 'aa' )
      this.textService.getTextData('test').subscribe((data: any) => {
        console.log(data);
        
        console.log('comes', JSON.stringify(data));
        
        this.editorData = JSON.stringify(data)
        this.editor?.isReady.then(()=>{
            if(this.editor){
            this.editor.blocks.render(data)
          }
          })
      })
    }

    saveEditorData() : void {
      this.editor?.blocks.clear()
    }
}
