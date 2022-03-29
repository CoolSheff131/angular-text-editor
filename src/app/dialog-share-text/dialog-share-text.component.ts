import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TextService } from '../services/text.service';

export interface DialogData {
  textId: string;
}

@Component({
  selector: 'app-dialog-share-text',
  templateUrl: './dialog-share-text.component.html',
  styleUrls: ['./dialog-share-text.component.css'],
})
export class DialogShareTextComponent implements OnInit {
  textId: string;
  singleLinks: string[] = [];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private textService: TextService
  ) {
    this.textId = data.textId;
    this.getSingleSharedLinks();
  }

  getSingleSharedLinks() {
    this.textService
      .getSingleSharedLinks(this.textId)
      .subscribe((data: any) => {
        this.singleLinks = data;
      });
  }

  deleteSingleLink(token: string) {
    console.log(token);

    this.textService.deleteToken(token).subscribe((data) => {
      console.log(data);
      this.getSingleSharedLinks();
    });
  }

  generateSingleLink() {
    this.textService.share(this.textId, 'edit').subscribe((data) => {
      this.getSingleSharedLinks();
    });
  }

  ngOnInit(): void {}
}
