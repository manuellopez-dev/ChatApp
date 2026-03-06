import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-message-input',
  templateUrl: './message-input.component.html',
  styleUrls: ['./message-input.component.css']
})
export class MessageInputComponent implements OnDestroy {
  @Input()  roomName = '';
  @Input()  roomId!:  number;
  @Output() messageSent = new EventEmitter<string>();

  message  = '';
  typingTimeout: any;
  private destroy$ = new Subject<void>();

  constructor(private socket: SocketService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInput(): void {
    this.socket.startTyping(this.roomId);
    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.socket.stopTyping(this.roomId);
    }, 1000);
  }

  send(): void {
    if (!this.message.trim()) return;
    this.messageSent.emit(this.message.trim());
    this.message = '';
    this.socket.stopTyping(this.roomId);
    clearTimeout(this.typingTimeout);
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }
}