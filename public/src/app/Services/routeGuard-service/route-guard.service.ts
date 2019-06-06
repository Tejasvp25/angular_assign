import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SocketService } from '../socket-service/socket.service';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor(private socketService: SocketService,
    private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log('GroupId: ', this.socketService.curGroupId);
    // console.log('Username: ', this.socketService.userName);

    if (isNullOrUndefined(this.socketService.curGroupId) || this.socketService.curGroupId === '') {
      this.router.navigateByUrl('/');
      return false;
    }

    return true;
  }

}
