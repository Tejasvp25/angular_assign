import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  // baseUrl = 'http://localhost:3000';
  baseUrl = 'https://chat-room-alpha.herokuapp.com';

  // socketUrl = 'http://localhost:3000';
  socketUrl = 'https://chat-room-alpha.herokuapp.com';
}
