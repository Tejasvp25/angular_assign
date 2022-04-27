import { isNullOrUndefined } from "util";
import { AppService } from "./../app-service/app.service";
import { Injectable } from "@angular/core";

import * as io from "socket.io-client";
import { Observable, observable } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { ResAPI } from "src/app/Models/Returns/ResAPI";
import { NewMessage } from "src/app/Models/ChatModels/chatModels";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket;
  public curGroupId = "";
  // public userName: string;
  public userName = "Anonymous";
  public isNewRoom = false;

  constructor(
    private appService: AppService,
    private toastrService: ToastrService
  ) {}

  public initSocket(): void {
    this.socket = io(this.appService.socketUrl);
  }

  // ---------------------------------------- Emmitting events------------------------------------
  public sendMessage(message: string): void {
    if (isNullOrUndefined(this.curGroupId) || this.curGroupId === "") {
      this.toastrService.warning("Please join a channel to start chatting:)");
      return;
    }

    if (isNullOrUndefined(this.userName) || this.userName === "") {
      this.toastrService.warning(
        "Please enter a valid username to start chatting:)"
      );
      return;
    }

    // const data = {
    //   'grpId': this.curGroupId,
    //   'message': message,
    //   'username': this.userName
    // };
    const data: NewMessage = {
      grpId: this.curGroupId,
      message: message,
      username: this.userName,
    };

    this.socket.emit("clientMsg", data);
  }

  public createRoom(groupName: string) {
    this.socket.emit("addGrp", groupName);
  }

  public joinRoom(grpId: string) {
    this.socket.emit("joinGrp", grpId);
  }

  public disconnectFromRoom() {
    this.socket.emit("disconnectFromRoom", {});
  }

  // ---------------------------------------- Emmitting events------------------------------------

  // ---------------------------------------- Socket On events------------------------------------

  public onNumUsersUpdate(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on("getUsers", (count) => observer.next(count));
    });
  }

  public onNewMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on("serverMsg", (message) => observer.next(message));
    });
  }

  public onRoomCreated(): Observable<ResAPI> {
    return new Observable<any>((observer) => {
      this.socket.on("grpCreated", (res) => observer.next(res));
    });
  }

  public onRoomJoined(): Observable<ResAPI> {
    return new Observable<any>((observer) => {
      this.socket.on("joinGrpResult", (res) => observer.next(res));
    });
  }

  // ---------------------------------------- Socket On events------------------------------------

  public clearCurrentDetails(): void {
    this.curGroupId = "";
    this.userName = "";
    this.isNewRoom = false;
  }
}
