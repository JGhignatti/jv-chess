import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DialogModule } from '@angular/cdk/dialog';

import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { SquareComponent } from './components/square/square.component';
import { SquareColorPipe } from './pipes/square-color.pipe';
import { PromoteDialogComponent } from './components/promote-dialog/promote-dialog.component';

@NgModule({
  imports: [
    BrowserModule,
    DialogModule,
  ],
  declarations: [
    AppComponent,
    BoardComponent,
    SquareComponent,
    SquareColorPipe,
    PromoteDialogComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
})
export class AppModule {
}
