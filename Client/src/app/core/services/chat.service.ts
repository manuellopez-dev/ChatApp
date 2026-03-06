import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

export interface Room {
  id:          number;
  name:        string;
  description: string;
  created_by:  number;
  creator:     { username: string; avatar: string };
}

export interface Message {
  id:         number;
  content:    string;
  room_id:    number;
  created_at: string;
  user: {
    id:       number;
    username: string;
    avatar:   string;
  };
}

@Injectable({ providedIn: 'root' })
export class ChatService {
  private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) {}

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  createRoom(data: { name: string; description?: string }): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, data);
  }

  getMessages(roomId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/${roomId}/messages`);
  }
}