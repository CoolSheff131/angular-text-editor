import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { TextEditorComponent } from './text-editor/text-editor.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TokenInterceptor } from './services/token.interceptor';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    AppComponent,
    TextEditorComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'text/:textId', component: TextEditorComponent },
      { path: 'main', component: AppComponent },
    ]),
    QuillModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
