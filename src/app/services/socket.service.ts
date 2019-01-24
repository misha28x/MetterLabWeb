import { Injectable, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnInit {

  errors = this.socket.fromEvent<any>('error');

  constructor(private socket: Socket) { }

  ngOnInit(): void {
    this.errors.subscribe(next => console.log(next.err));
  }

  updateCounters(): void {
    this.socket.emit('change', 'something');
  }

  getErrors(): any {
    return this.errors;
  } 
}
