import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ChatService, Room, Message } from '../../../core/services/chat.service';
import { SocketService } from '../../../core/services/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chat-home',
  templateUrl: './chat-home.component.html',
  styleUrls: ['./chat-home.component.css']
})
export class ChatHomeComponent implements OnInit, OnDestroy {
  rooms:        Room[]    = [];
  activeRoom:   Room | null = null;
  messages:     Message[] = [];
  onlineUsers: any[] = [];  
  loading       = false;
  showCreateRoom = false;
  newRoomName   = '';
  newRoomDesc   = '';
  typingUsers: { id: number; username: string }[] = [];
  typingTimeout: any;
  private destroy$ = new Subject<void>();

  constructor(
  public  auth:    AuthService,
  private chat:    ChatService,
  private socket:  SocketService,
  private snackBar: MatSnackBar,
  private cdr:     ChangeDetectorRef,
) {}

  ngOnInit(): void {
  this.socket.connect();
  this.listenSocket();
  this.loadRooms();
}

  ngOnDestroy(): void {
    if (this.activeRoom) this.socket.leaveRoom(this.activeRoom.id);
    this.socket.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

  get currentUser() { return this.auth.getUser(); }

  // ── Salas ─────────────────────────────────────────────────────
  loadRooms(): void {
    this.chat.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        if (rooms.length > 0) this.selectRoom(rooms[0]);
      },
      error: () => this.snackBar.open('Error al cargar salas', 'Cerrar', { duration: 3000 })
    });
  }

  selectRoom(room: Room): void {
    if (this.activeRoom?.id === room.id) return;
    if (this.activeRoom) this.socket.leaveRoom(this.activeRoom.id);
    this.typingUsers = [];

    this.activeRoom = room;
    this.messages   = [];
    this.loading    = true;

    this.socket.joinRoom(room.id);

    this.chat.getMessages(room.id).subscribe({
      next: (msgs) => { this.messages = msgs; this.loading = false; this.scrollToBottom(); },
      error: ()     => { this.loading = false; }
    });
  }

  createRoom(): void {
    if (!this.newRoomName.trim()) return;
    this.chat.createRoom({ name: this.newRoomName.trim(), description: this.newRoomDesc.trim() }).subscribe({
      next: (room) => {
        this.rooms.push(room);
        this.newRoomName  = '';
        this.newRoomDesc  = '';
        this.showCreateRoom = false;
        this.selectRoom(room);
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al crear sala';
        this.snackBar.open(msg, 'Cerrar', { duration: 3000 });
      }
    });
  }

  // ── Socket ────────────────────────────────────────────────────
  listenSocket(): void {
  this.socket.onMessage().pipe(takeUntil(this.destroy$)).subscribe(msg => {
    console.log('Mensaje recibido:', msg);
    console.log('Sala activa:', this.activeRoom?.id);
    if (msg.room_id === this.activeRoom?.id) {
      this.messages.push(msg);
      this.scrollToBottom();
      this.cdr.detectChanges();
    }
  });

  this.socket.onUsersOnline().pipe(takeUntil(this.destroy$)).subscribe(users => {
  this.onlineUsers = users;
  this.cdr.detectChanges();
});

  this.socket.onTyping().pipe(takeUntil(this.destroy$)).subscribe(data => {
  if (data.roomId !== this.activeRoom?.id) return;

  if (data.isTyping) {
    const exists = this.typingUsers.find(u => u.id === data.user.id);
    if (!exists) this.typingUsers.push(data.user);
  } else {
    this.typingUsers = this.typingUsers.filter(u => u.id !== data.user.id);
  }
  this.cdr.detectChanges();
});
}

  // ── Mensaje enviado desde MessageInput ───────────────────────
  onSendMessage(content: string): void {
    if (!this.activeRoom) return;
    this.socket.sendMessage(this.activeRoom.id, content);
  }

  // ── Helpers ───────────────────────────────────────────────────
  isOwn(msg: Message): boolean {
    return msg.user.id === this.currentUser?.id;
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const el = document.querySelector('.messages-list');
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }

  logout(): void { this.auth.logout(); }
}