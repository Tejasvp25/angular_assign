import { ApiReturnEnum } from './../../Models/Enums/ApireturnEnum';
import { SocketService } from './../../Services/socket-service/socket.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  closeResult: string;
  newRoomName: string;
  joinRoomId: any;

  constructor(private modalService: NgbModal,
    private toastrService: ToastrService,
    private socketService: SocketService) { }

  ngOnInit() {
    this.initSocketConnection();
  }

  createRoom(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log(`RoomName: ${this.newRoomName}`);
      if (this.newRoomName === '') {
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
      this.closeResult = `Closed with: ${result}`;
      console.log(`RoomId: ${this.joinRoomId}`);

      this.socketService.joinRoom(this.joinRoomId);

      this.joinRoomId = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  private initSocketConnection(): void {
    this.socketService.initSocket();

    this.socketService.onRoomCreated().subscribe(res => {
      if (res.retCode === ApiReturnEnum.Successful) {
        this.toastrService.success('Room created successfully');
        console.log(res.object);
      } else {
        this.toastrService.error('Failed to create room. Please try again later');
      }
      // TODO Handle onRoomCreate
    }, err => {
      this.toastrService.error('Failed to create room. Please try again later');
    });

    this.socketService.onRoomJoined().subscribe(res => {
      if (res.retCode === ApiReturnEnum.Successful) {
        const isValidGroup: boolean = res.object;

        if (isValidGroup) {
          // TODO Handle onRoomJoin
          this.toastrService.success('Room joined successfully');


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


}
