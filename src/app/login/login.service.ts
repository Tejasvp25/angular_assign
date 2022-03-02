import { ElementRef, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Login } from './Login';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  username = '';
  loginElement!: ElementRef;
  welcomeElement!: ElementRef;

  constructor(private http: HttpClient) {}

  // Makes a get request to the backend to fetch users data
  getUsers(): Observable<Login[]> {
    return this.http
      .get<Login[]>('./assets/users/users.json')
      .pipe(catchError(this.handleError));
  }

  // Invoked if an error is thrown in the get request
  private handleError(err: HttpErrorResponse) {
    console.error(err);
    return throwError(err.error() || 'Server error');
  }
}
