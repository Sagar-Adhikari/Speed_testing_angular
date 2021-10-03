import { Component, AfterViewInit, ViewChild, Input } from '@angular/core';
import { RadialGauge } from 'ng-canvas-gauges';
@Component({
  selector: 'app-gauge',
  templateUrl: './gauge.component.html',
  styleUrls: ['./gauge.component.scss']
})
export class GaugeComponent implements AfterViewInit {
  @ViewChild('gauge', { static: true }) public gauge: RadialGauge;

  private _width: number = 100;
  private _height: number = 100;
  private _units: string = "ms";
  private _majorTicks: number[] = [0, 20, 40, 60, 80, 100];
  private _minorTicks: number = 10;
  private _valueBox: boolean = false;

  @Input() get width() {
    return this._width;
  } set width(val: number) {
    this._width = val;
  }

  @Input() get height() {
    return this._height;
  } set height(val: number) {
    this._height = val;
  }

  @Input() get units() {
    return this._units;
  } set units(val: string) {
    this._units = val;
  }

  @Input() get majorTicks() {
    return this._majorTicks;
  } set majorTicks(val: number[]) {
    this._majorTicks = val;
  }

  @Input() get minorTicks() {
    return this._minorTicks;
  } set minorTicks(val: number) {
    this._minorTicks = val;
  }

  @Input() get valueBox() {
    return this._valueBox;
  } set valueBox(val: boolean) {
    this._valueBox = val;
  }


  ngAfterViewInit(): void {
    this.gauge.update({
      ...this.gauge.options,
      valueBox: this.valueBox,
      animateOnInit: false,
      height: this.height,
      width: this.width,
      title: this.title,
      majorTicks: this.majorTicks,
      minorTicks: this.minorTicks,
      maxValue: this.maximumValue,
      minValue: this.minimumValue,
      units: this.units ? this.units : '',
      animationDuration: 50,
    });

  }

  private _title = "%";

  @Input() get value() {
    return this.gauge.value;
  } set value(val: number) {
    this.gauge.value = val;
  }


  @Input() get maximumValue() {
    return this.majorTicks[this.majorTicks.length - 1]
  }


  @Input() get minimumValue() {
    return this.majorTicks[0];
  }

  @Input() set title(val: string) {
    this._title = val;
  } get title() {
    return this._title;
  }

  constructor() { }

}
