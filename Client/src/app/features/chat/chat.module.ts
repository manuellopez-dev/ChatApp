import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChatRoutingModule } from './chat-routing.module';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ChatHomeComponent } from './chat-home/chat-home.component';
import { MessageInputComponent } from './message-input/message-input.component';

@NgModule({
  declarations: [
    ChatHomeComponent,
    MessageInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ChatRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ]
})
export class ChatModule { }