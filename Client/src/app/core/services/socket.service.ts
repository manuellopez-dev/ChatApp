import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environments';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket | null = null;

  message$ = new Subject<any>();
  typing$  = new Subject<any>();
  online$  = new Subject<any[]>();
  currentRoomId: number | null = null;

  constructor(private auth: AuthService, private ngZone: NgZone) {}

  connect(): void {
    if (this.socket) return;

    this.socket = io(environment.socketUrl, {
      auth: { token: this.auth.getToken() },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => console.log('✅ Socket conectado:', this.socket?.id));
    this.socket.on('disconnect', () => console.log('❌ Socket desconectado'));

    this.socket.on('reconnect', () => {
      console.log('🔄 Socket reconectado');
      if (this.currentRoomId) {
        this.socket?.emit('room:join', this.currentRoomId);
      }
    });

    this.socket.on('message:received', (msg) => {
      this.ngZone.run(() => {
        console.log('📨 RAW socket event:', msg);
        this.message$.next(msg);
      });
    });

    this.socket.on('typing:update', (data) => {
      this.ngZone.run(() => this.typing$.next(data));
    });

    this.socket.on('users:online', (ids) => {
      this.ngZone.run(() => this.online$.next(ids));
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinRoom(roomId: number): void {
    this.currentRoomId = roomId;
    this.socket?.emit('room:join', roomId);
  }

  leaveRoom(roomId: number): void { this.socket?.emit('room:leave', roomId); }

  sendMessage(roomId: number, content: string): void {
    this.socket?.emit('message:send', { roomId, content });
  }

  startTyping(roomId: number): void { this.socket?.emit('typing:start', { roomId }); }
  stopTyping(roomId: number): void  { this.socket?.emit('typing:stop',  { roomId }); }

  onMessage()     { return this.message$.asObservable(); }
  onTyping()      { return this.typing$.asObservable(); }
  onUsersOnline() { return this.online$.asObservable(); }
}