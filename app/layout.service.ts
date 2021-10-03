import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


interface ILayout{
  pageTitle: string,
  allowFooter: boolean
}
@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private pageTitleSource = new Subject<ILayout>();
  pageTitle$ = this.pageTitleSource.asObservable();

  constructor() { }

  setLayout(layout: ILayout){
    setTimeout(() => {
      this.pageTitleSource.next(layout);  
    });    
  }
}
