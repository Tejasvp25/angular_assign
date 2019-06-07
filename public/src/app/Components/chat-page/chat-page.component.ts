import { ChatHistoryResult, ChatHistoryMessage, NewMessage } from './../../Models/ChatModels/chatModels';
import { SocketService } from './../../Services/socket-service/socket.service';
import { Component, OnInit, HostListener, ViewChild, ElementRef, TemplateRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MessageProp } from 'src/app/Models/ChatModels/chatModels';
import { ToastrService } from 'ngx-toastr';
import { FetchService } from 'src/app/Services/fetch-service/fetch.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { isNullOrUndefined } from 'util';
import { Location } from '@angular/common';
import { SubscriptionLike, Subscription } from 'rxjs';

export enum KEY_CODE {
  ENTER = 13
}

export enum CustomModalDismissReasons {
  LOCATION_CHANGE = 2
}

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.css']
})
export class ChatPageComponent implements OnInit, AfterViewInit, OnDestroy {

  closeResult: string;
  messageList: MessageProp[] = [];

  messageInp: string;
  nicknameInp = '';

  username: string;
  currentGroupId: string;
  groupName = 'Group Room';
  numActiveUsers = 1;

  showNewRoomModal: boolean;
  showUserNameModal = true;
  showFriendsInvite = false;

  // ------------------------ Observables ----------------------------
  locationObs: SubscriptionLike;
  socketNewMsgObs: Subscription;
  socketUserCountObs: Subscription;
  // ------------------------ Observables ----------------------------

  @ViewChild('newRoomModal') newRoomModal: TemplateRef<any>;
  @ViewChild('userNameModal') userNameModal: TemplateRef<any>;

  constructor(private modalService: NgbModal,
    public socketService: SocketService,
    private fetchService: FetchService,
    private router: Router,
    private location: Location,
    private toastrService: ToastrService) { }

  ngOnInit() {

    this.currentGroupId = this.socketService.curGroupId;
    this.getChatHistoryAndRoomData();
    console.log('In chat room');
    if (isNullOrUndefined(this.currentGroupId) || this.currentGroupId === '') {
      this.navigateToLandingPage();
    }
    this.initSocketListeners();
    this.locationObs = this.location.subscribe(x => {
      this.modalService.dismissAll(CustomModalDismissReasons.LOCATION_CHANGE);
    });
  }

  ngAfterViewInit() {

    setTimeout(() => {
      if (this.socketService.isNewRoom) {
        this.openNewRoomModal();
      }

      if (!this.socketService.isNewRoom) {
        this.openUserNameModal();
      }

      this.socketService.isNewRoom = false;
    });

  }

  ngOnDestroy(): void {
    this.locationObs.unsubscribe();
    this.endSocketSession();
  }

  // Initialize all socket listeners here
  public initSocketListeners() {
    this.onNewMessage();
    this.onUserCountUpdate();
  }

  public endSocketSession() {
    // Unsubscribe all socket listeners here
    this.socketNewMsgObs.unsubscribe();
    this.socketUserCountObs.unsubscribe();

    this.socketService.clearCurrentDetails();
    this.socketService.disconnectFromRoom();
  }


  public getChatHistoryAndRoomData() {
    this.fetchService.getChatHistory(this.currentGroupId).subscribe(
      res => {
        console.log('Fetched chat history');
        this.onChatHistory(res);
      }
    );
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    // console.log(event);

    if (event.keyCode === KEY_CODE.ENTER) {
      this.sendMessage();
    }
  }

  public sendMessage() {
    const curMessage = new MessageProp();
    curMessage.message = this.messageInp;
    curMessage.userName = this.username;
    curMessage.isSent = true;

    if (isNullOrUndefined(curMessage.message) || curMessage.message === '') {
      return;
    }

    this.socketService.sendMessage(curMessage.message);

    this.messageList.push(curMessage);

    this.messageInp = '';
  }

  public receiveMessage(msg: string, userName: string) {
    if (isNullOrUndefined(msg) || msg.trim() === '') {
      return;
    }
    const curMessage = new MessageProp();
    curMessage.message = msg;
    curMessage.userName = userName;
    curMessage.isSent = false;

    this.messageList.push(curMessage);
  }

  // Listen for new messages
  public onNewMessage() {
    this.socketNewMsgObs = this.socketService.onNewMessage().subscribe(res => {
      const newMsg: NewMessage = res;
      const message = newMsg.message;
      const username = newMsg.username;

      this.receiveMessage(message, username);
    });
  }

  // Listen for number of active users
  public onUserCountUpdate() {
    this.socketUserCountObs = this.socketService.onNumUsersUpdate().subscribe(count => {
      console.log('onNumUsersUpdate:' + count);
      this.numActiveUsers = count;
    });
  }

  public onChatHistory(res) {
    const resObject: ChatHistoryResult = res;

    // Set room name and inital number of active users here
    this.groupName = resObject.groupName;
    this.numActiveUsers = resObject.userIdCount;

    resObject.messages.forEach((msgObj: ChatHistoryMessage) => {
      this.receiveMessage(msgObj.data, msgObj.userName);
    });
  }

  public navigateToLandingPage() {
    this.router.navigateByUrl('/');
  }

  openNewRoomModal() {
    this.modalService.open(this.newRoomModal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.openUserNameModal();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openUserNameModal() {
    this.modalService.open(this.userNameModal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (this.nicknameInp === '') {
        this.toastrService.warning('Please enter a valid username');
        this.openUserNameModal();
        return;
      }

      this.socketService.userName = this.nicknameInp;
      this.username = this.nicknameInp;
      this.showUserNameModal = false;
      // this.nicknameInp = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      if (reason === CustomModalDismissReasons.LOCATION_CHANGE) {
        return;
      }
      this.openUserNameModal();
    });
  }


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else if (reason === CustomModalDismissReasons.LOCATION_CHANGE) {
      return 'by changing route location';
    } else {
      return `with: ${reason}`;
    }
  }

  // Copy message to clipboard
  copyMessageToClipBoard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastrService.success('Copied Invite Id to clipboard!');
  }

}
