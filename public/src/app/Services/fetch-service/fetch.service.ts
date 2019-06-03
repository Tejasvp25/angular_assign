import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class FetchService {

  constructor(private http: HttpClient,
    private toastrService: ToastrService) { }

  public getChatHistory(groupId): Observable<any> {
    const url = '/api/getChatHist/' + groupId;

    return this.http.get(url).pipe(
      tap(d => console.log(d)),
      catchError((e, r) => {
        this.toastrService.error('Failed to load Chat History. Please try again later');
        return of([]);
      }));
  }
}
