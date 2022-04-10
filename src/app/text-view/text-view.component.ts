import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { TextService } from '../services/text.service';

@Component({
  selector: 'app-text-view',
  templateUrl: './text-view.component.html',
  styleUrls: ['./text-view.component.css'],
})
export class TextViewComponent implements OnInit {
  isLoadingText = true;
  isErrorText = false;
  text = '';
  title = '';
  constructor(
    private textService: TextService,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.paramMap
      .pipe(switchMap((params) => params.getAll('id')))
      .subscribe((id) => {
        textService.getTextById(id).subscribe({
          next: (text) => {
            const data = JSON.parse(text);
            this.text = data.content;
            this.title = data.title;
            this.isLoadingText = false;
          },
          error: (error) => {
            this.isLoadingText = false;
            this.isErrorText = true;
          },
        });
      });
  }

  ngOnInit(): void {}
}
