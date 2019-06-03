import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable, observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor(private toastrService: ToastrService) { }

  public initSocket(): void {
    this.socket = io();
  }


  // ---------------------------------------- Emmitting events------------------------------------
  public sendMessage(message: string, username: string, currentGrpId: string): void {
    console.log(currentGrpId);
    if (currentGrpId === null || currentGrpId === undefined || currentGrpId === '') {
      this.toastrService.warning('Please join a channel to start chatting:)');
      return;
    }
    const data = {
      'grpId': currentGrpId,
      'message': message,
      'username': username
    };
    this.socket.emit('clientMsg', data);
  }

  public createRoom(groupName: string) {
    this.socket.emit('addGrp', groupName);
  }

  public joinRoom(grpId: string) {
    this.socket.emit('joinGrp', grpId);
  }

  // ---------------------------------------- Emmitting events------------------------------------

  // ---------------------------------------- Socket On events------------------------------------

  public onNumUsersUpdate(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('getUsers', (count) => observer.next(count));
    });
  }

  public onNewMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('serverMsg', (message) => observer.next(message));
    });
  }

  public onRoomCreated(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('grpCreated', (grpId) => observer.next(grpId));
    });
  }

  public onRoomJoined(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('joinGrpResult', (res) => observer.next(res));
    });
  }

  // ---------------------------------------- Socket On events------------------------------------


}
