import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-rxjs-input',
  templateUrl: './rxjs-input.component.html',
  styleUrls: ['./rxjs-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RxjsInputComponent),
      multi: true
    }
  ]
})
export class RxjsInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() classes: string = 'form-control';
  @Input() placeholder: string;

  @Output() debounceinput = new EventEmitter();

  private subject = new Subject<any>()
  private subscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    this.subscription = this.subject.pipe(debounceTime(500)).subscribe(event => {
      this.propagateChange(event.target.value);
      this.debounceinput.emit(event)
    })
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe()
  }

  onChange(event) {
    this.propagateTouched(true)
    this.subject.next(event)
  }

  writeValue(obj: any): void {
    console.log('writeValue', obj);

  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  propagateChange(_: any) { };
  propagateTouched(_: any) { };

}
