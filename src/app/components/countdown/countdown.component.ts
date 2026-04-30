import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit {

  @Input() seconds: string = '60';
  @Output() finished = new EventEmitter();

  countdown = 0;
  result = '00:00'
  intervalRef;

  constructor() { }

  ngOnInit(): void {
    this.initCounter();
  }

  initCounter() {
    this.countdown = parseInt(this.seconds, 10);
    this.createResult();
    this.intervalRef = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown == 0) {
        clearInterval(this.intervalRef);
        setTimeout(() => { this.finished.emit() }, 1000);
      }
      this.createResult()
    }, 1000);
  }

  createResult() {
    let m = Math.floor(this.countdown / 60).toString(),
      s = (this.countdown % 60).toString();
    if (m.length == 1) m = '0' + m;
    if (s.length == 1) s = '0' + s;
    this.result = m + ':' + s;
  }
}
