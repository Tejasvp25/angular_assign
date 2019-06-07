import { Subscription } from 'rxjs';
import { ApiReturnEnum } from './../../Models/Enums/ApireturnEnum';
import { SocketService } from './../../Services/socket-service/socket.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { JoinGroupResult } from 'src/app/Models/ChatModels/chatModels';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit, OnDestroy {
  closeResult: string;
  newRoomName: string;
  joinRoomId: any;
  isAlertOpen = true;

  socketNewRoomObs: Subscription;
  socketJoinRoomObs: Subscription;

  constructor(private modalService: NgbModal,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private socketService: SocketService,
    private router: Router) { }

  ngOnInit() {
    this.initSocketConnection();
  }

  ngOnDestroy(): void {
    this.removeSocketListeners();
  }

  removeSocketListeners() {
    this.socketNewRoomObs.unsubscribe();
    this.socketJoinRoomObs.unsubscribe();
  }

  createRoom(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 5000);

      this.closeResult = `Closed with: ${result}`;
      console.log(`RoomName: ${this.newRoomName}`);

      if (isNullOrUndefined(this.newRoomName) || this.newRoomName === '') {
        this.toastrService.warning('Please enter a valid roomName');
        return;
      }

      this.socketService.createRoom(this.newRoomName);

      this.newRoomName = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  joinRoom(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.spinner.show();
      setTimeout(() => {
        this.spinner.hide();
      }, 5000);

      this.closeResult = `Closed with: ${result}`;
      // console.log(`RoomId: ${this.joinRoomId}`);

      this.socketService.joinRoom(this.joinRoomId);

      this.joinRoomId = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private initSocketConnection(): void {
    this.socketService.initSocket();

    this.socketNewRoomObs = this.socketService.onRoomCreated().subscribe(res => {
      this.spinner.hide();
      if (res.retCode === ApiReturnEnum.Successful) {
        this.toastrService.success('Room created successfully');
        this.socketService.curGroupId = res.object;
        this.socketService.isNewRoom = true;
        this.navigateToChatRoom();
      } else {
        this.toastrService.error('Failed to create room. Please try again later');
      }
      // TODO Handle onRoomCreate
    }, err => {
      this.toastrService.error('Failed to create room. Please try again later');
    });

    this.socketJoinRoomObs = this.socketService.onRoomJoined().subscribe(res => {
      this.spinner.hide();
      if (res.retCode === ApiReturnEnum.Successful) {

        const joinGrpRes: JoinGroupResult = res.object;

        if (joinGrpRes.isValidGroup) {

          this.toastrService.success('Room joined successfully');
          this.socketService.curGroupId = joinGrpRes.groupId;
          this.navigateToChatRoom();

        } else {
          this.toastrService.error('Invalid room Id. <br> Please enter a valid room id', '', { enableHtml: true });
        }
      } else {
        this.toastrService.error('An error occurred. Please try again later');
      }
    }, err => {
      this.toastrService.error('An error occurred. Please try again later');
    });
  }

  private navigateToChatRoom() {
    this.router.navigateByUrl('/chatRoom');
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
