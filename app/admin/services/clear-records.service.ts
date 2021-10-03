import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClearRecordsService {

  constructor(private http: HttpClient) { }
  public clearRecords(date: any): Observable<any> {
    console.log(date);

    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'clear-complains';
    const params = new HttpParams()
      .set('fDate', date);
console.log(params)
    return this.http.delete(url, {params: params, headers: header})
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error)
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }


}
