import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Text } from '../models/text.model';
import { User } from '../models/user.model';
import { TextService } from '../services/text.service';
import { WebsocketService } from '../services/websocket.service';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css'],
})
export class TextEditorComponent implements OnInit {
  users: User[] | undefined;
  text!: Text;
  titleCtrl: FormControl;

  constructor(
    private webSocketService: WebsocketService,
    private activateRoute: ActivatedRoute,
    private textService: TextService
  ) {
    this.titleCtrl = new FormControl();
    this.activateRoute.paramMap
      .pipe(switchMap((params) => params.getAll('id')))
      .subscribe((id) => {
        this.textService.getTextById(id).subscribe((data) => {
          this.text = JSON.parse(data);
          this.titleCtrl.setValue(this.text?.title);
          console.log(this.text);
        });

        this.webSocketService.openWebSocket(
          (payload: any) => {
            if (this.text) {
              this.text.content = payload;
            }
          },
          'test',
          'aa'
        );
      });
  }

  ngOnInit(): void {}

  updateTitle() {
    this.textService
      .updateTextById(
        this.text.id,
        this.titleCtrl.value,
        this.text.content || ''
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
    this.webSocketService.leaveRoom();
  }

  ContentChangedHandler(event: any) {
    if (event.source === 'user' && this.text.content) {
      this.webSocketService.sendMessage(this.text.content);
    }
  }
}
