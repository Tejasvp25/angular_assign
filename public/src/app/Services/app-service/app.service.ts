import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  baseUrl = 'http://localhost:3000';

  socketUrl = 'http://localhost:3000';
}
