import { AppService } from './../app-service/app.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class FetchService {

  baseUrl = this.appService.baseUrl;

  constructor(private http: HttpClient,
    private appService: AppService,
    private toastrService: ToastrService) { }

  public getChatHistory(groupId): Observable<any> {
    const url = this.baseUrl + '/api/getChatHist/' + groupId;

    return this.http.get(url).pipe(
      map(res => res['0']),
      catchError((e, r) => {
        this.toastrService.error('Failed to load Chat History. Please try again later');
        return of([]);
      }));
  }
}
