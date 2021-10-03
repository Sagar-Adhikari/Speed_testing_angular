import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  public addUser(email: string, password: string, roleId: number, status: number): Observable<any> {
    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'user';
    return this.http.post(url, { email, password, roleId, status }, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public editUser(userId: string, email: string, roleId: number, status: number): Observable<any> {
    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + `user/${userId}`;
    return this.http.put(url, { email, roleId, status }, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getUser(userId: string) {
    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + `user/${userId}`;
    return this.http.get(url, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getUsersList(
    email: string,
    status: number,
    roleId: number,
    pageNo: number,
    pageSize: number,
    sortField: string,
    sortDirection: string
  ): Observable<any> {

    if (!pageNo) {
      pageNo = 0;
    }
    if (!pageSize) {
      pageSize = 10;
    }
    const start = pageNo * pageSize;
    let params = new HttpParams()
      .set('start', start.toString())
      .set('limit', pageSize.toString())
      .set('sortField', sortField)
      .set('sortDirection', sortDirection);


    if (email) {
      params = params.append('email', email);
    }
    if (roleId) {
      params = params.append('role', roleId.toString());
    }
    if (status !== undefined) {
      params = params.append('status', status.toString());
    }
    if (sortField) {
      params = params.set('sortField', sortField);
    } else {
      params = params.set('sortField', 'updated_at');
    }
    if (sortDirection) {
      params = params.set('sortDirection', sortDirection)
    } else {
      params = params.set('sortDirection', 'DESC')
    }


    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'report/users-list';

    return this.http.get(url, { headers: header, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse) {

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
