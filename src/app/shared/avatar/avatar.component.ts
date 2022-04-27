import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnInit {
  constructor() {}

  @Input() url: string | undefined;

  @Input() size = 40;

  ngOnInit(): void {}
}
