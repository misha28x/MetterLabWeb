import { Injectable, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit {

  files = this.socket.fromEvent<any>('upload');

  constructor(private socket: Socket) { }

  ngOnInit(): void { }

  updateCounters(): void {
    this.socket.emit('change', 'something');
  }

  getFiles(): Observable<any> {
    return this.files;
  } 
}
