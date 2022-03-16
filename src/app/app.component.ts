import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './services/websocket.service';

import { Router } from '@angular/router';
import { Config, TextService } from './services/text.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'angular-text-editor';

  constructor() {}

  ngOnInit(): void {}
}
