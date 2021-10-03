
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  YYYYMMDD = (date: Date) => {
    // debugger;
    let x = new Date(date);
    let y = x.getFullYear().toString();
    let m = (x.getMonth() + 1).toString();
    let d = x.getDate().toString();
    (d.length === 1) && (d = "0" + d);
    (m.length === 1) && (m = "0" + m);
    let yyyymmdd = `${y}-${m}-${d}`;
    return yyyymmdd;
  }

  constructor(private http: HttpClient) { }

  public getComplain(): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'complain';

    //  const params = new HttpParams()
    //   .set('site','0')
    //   .set('fDate','2010-01-01')
    //   .set('tDate','2020-01-01');

    return this.http.get(url, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getISPList(): Observable<any> {
    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'report/isp-list';
    return this.http.get(url, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getLocationList(ispName?: string): Observable<any> {
    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    let url = environment.api + 'report/location-list'; // + locationName? locationName:'';
    if (ispName) {
      const params = new HttpParams()
        .set('isp', ispName);
      return this.http.get(url, { headers: header, params: params })
        .pipe(
          catchError(this.handleError)
        );
    } else {
      return this.http.get(url, { headers: header })
        .pipe(
          catchError(this.handleError)
        );
    }
  }


  public getLatencyOfISP(
    fDate: Date,
    tDate: Date,
    site: number,
    isp: string,
    start: number,
    limit: number,
    location: string,
    bandwidth: number
  ): Observable<any> {

    const columns = 'averageLatency,averageJitter,loadedDownloadLatency, loadedDownloadJitter,loadedUploadLatency,loadedUploadJitter';
    const params = new HttpParams()
      .set('site', site.toString())
      .set('fDate', this.YYYYMMDD(fDate))
      .set('tDate', this.YYYYMMDD(tDate))
      .set('isp', isp)
      .set('location', location)
      .set('start', start.toString())
      .set('limit', limit.toString())
      .set('columns', columns)
      .set('bandwidth', bandwidth > 0 ? bandwidth.toString() : '');

    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/complain-of-isp';

    return this.http.get(url, { headers: header, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }
  public getSpeedOfISP(
    fDate: Date,
    tDate: Date,
    site: number,
    isp: string,
    start: number,
    limit: number,
    location: string,
    bandwidth: number
  ): Observable<any> {

    const columns = 'id, created_at, id, created_at, maximumDownloadRate,averageDownloadRate,maximumUploadRate, averageUploadRate';
    const params = new HttpParams()
      .set('site', site.toString())
      .set('fDate', this.YYYYMMDD(fDate))
      .set('tDate', this.YYYYMMDD(tDate))
      .set('isp', isp)
      .set('location', location)
      .set('start', start.toString())
      .set('limit', limit.toString())
      .set('columns', columns)
      .set('bandwidth', bandwidth > 0 ? bandwidth.toString() : '');

    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/complain-of-isp';

    return this.http.get(url, { headers: header, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getBrowsingOfISP(
    fDate: Date,
    tDate: Date,
    site: number,
    isp: string,
    start: number,
    limit: number,
    location: string,
    bandwidth: number,
  ): Observable<any> {

    const columns = 'id, created_at, browsingDelay';
    const params = new HttpParams()
      .set('site', site.toString())
      .set('fDate', this.YYYYMMDD(fDate))
      .set('tDate', this.YYYYMMDD(tDate))
      .set('isp', isp)
      .set('location', location)
      .set('start', start.toString())
      .set('limit', limit.toString())
      .set('columns', columns)
      .set('bandwidth', bandwidth > 0 ? bandwidth.toString() : '')
      ;

    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/complain-of-isp';

    return this.http.get(url, { headers: header, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getComplains(
    fDate: Date,
    tDate: Date,
    site: number,
    isp: string,
    location: string,
    bandwidth: number,
    pageNo: number,
    pageSize: number,
    sortField: string,
    sortDirection: string
  ): Observable<any> {

    const columns = `averageLatency,
      averageJitter,
      packetLoss,
      maximumDownloadRate,

      averageDownloadRate,
      loadedDownloadLatency, 
      loadedDownloadJitter,
      dataDownloadSuccessRate,
      maximumUploadRate,
      averageUploadRate,
      loadedUploadLatency,
      loadedUploadJitter,
      dataUploadSuccessRate,
      browsingDelay,
      lat,
      lng,
      clientName,
      bandWidth,
      mobileNo,
      email
      `;

    if (!pageNo) {
      pageNo = 0;
    }
    if (!pageSize) {
      pageSize = 10;
    }
    const start = pageNo * pageSize;
    const params = new HttpParams()
      .set('site', site.toString())
      .set('fDate', this.YYYYMMDD(fDate))
      .set('tDate', this.YYYYMMDD(tDate))
      .set('isp', isp)
      .set('location', location)
      .set('start', start.toString())
      .set('limit', pageSize.toString())
      .set('columns', columns)
      .set('bandwidth', bandwidth > 0 ? bandwidth.toString() : '')
      .set('sortField', sortField? sortField : 'created_at')
      .set('sortDirection', sortDirection? sortDirection : 'DESC');


      
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/complain-of-isp';

    return this.http.get(url, { headers: header, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }




  public getCountOfTest(
    fDate: Date,
    tDate: Date,
    location?: string,
  ): Observable<any> {

    const params = new HttpParams()

      .set('fDate', this.YYYYMMDD(fDate))
      .set('tDate', this.YYYYMMDD(tDate))
      .set('location', location);

    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/count-by-isp';

    return this.http.get(url, { headers: header, params: params })
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