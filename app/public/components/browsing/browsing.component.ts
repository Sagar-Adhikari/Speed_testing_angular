import { Component, OnInit, Output, EventEmitter, Compiler } from '@angular/core';


@Component({
  selector: 'app-browsing',
  templateUrl: './browsing.component.html',
  styleUrls: ['./browsing.component.scss']
})
export class BrowsingComponent implements OnInit {
  @Output() private completed: EventEmitter<any> = new EventEmitter();
  // show = false;
  browsingDelay: number = 0;
  startOn = 0;
  private mainSrc = "https://nirekha.com/home";
  url: any = "about:blank";
  // randomValue=0;
  constructor(
    // private _compiler: Compiler

    ) { }

  ngOnInit() { }

  public start() {
    // this._compiler.clearCache();
    // this.randomValue=Math.random();
    this.url = this.mainSrc;
    let param = Math.random();
    this.startOn = new Date().getTime();
    this.url = `${this.mainSrc}?var=${param}`;
    // this.show = true;
  }
  public loaded() {
    this.browsingDelay = new Date().getTime() - this.startOn;
    this.completed.emit();
    this.url = "about:blank";
    // this.show = false;
  }

}
