import { Component, OnInit } from '@angular/core';
import { Login } from './Login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  login: Login = new Login();
  name: string = 'Login';
  disabled: boolean = true;
  constructor() {}

  onChange() {
    if (this.login.userName === 'admin' && this.login.password === 'admin') {
      this.disabled = false;
    }
  }
}
