import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { TextEditorComponent } from './text-editor/text-editor.component';


@NgModule({
  declarations: [
    AppComponent,
    TextEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
      {path:'text/:textId', component: TextEditorComponent},
      {path:'main', component: AppComponent},
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
