import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-hb-switch',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="hb-switch-container" [class.checked]="value" [class.disabled]="disabled || isLoading" (click)="toggle($event)">
      <div class="hb-switch-handle">
        <i *ngIf="isLoading" class="fa fa-spinner fa-pulse hb-spinner"></i>
      </div>
    </div>
  `,
  styles: [`
    .hb-switch-container {
      width: 44px;
      height: 22px;
      background-color: #ccc;
      border-radius: 20px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.3s;
      display: inline-block;
      vertical-align: middle;
    }
    .hb-switch-container.checked {
      background-color: #3b71ca;
    }
    .hb-switch-container.disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    .hb-switch-handle {
      width: 18px;
      height: 18px;
      background-color: white;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: left 0.3s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hb-switch-container.checked .hb-switch-handle {
      left: 24px;
    }
    .hb-spinner {
      font-size: 10px;
      color: #3b71ca;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => HbSwitchComponent),
      multi: true
    }
  ]
})
export class HbSwitchComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() set checked(val: boolean) {
    this.value = val;
  }
  @Input() beforeChange: Observable<boolean> | null = null;
  @Input() isLoading = false;
  
  @Output() change = new EventEmitter<boolean>();

  value = false;

  private onChange: (val: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  toggle(event?: Event) {
    if (this.disabled || this.isLoading) return;
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (this.beforeChange) {
      this.isLoading = true;
      this.beforeChange.pipe(take(1)).subscribe(canChange => {
        this.isLoading = false;
        if (canChange) {
          this.commitChange();
        }
        this.cdr.markForCheck();
      }, () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      });
    } else {
      this.commitChange();
    }
  }

  private commitChange() {
    this.value = !this.value;
    this.onChange(this.value);
    this.change.emit(this.value);
    this.onTouched();
    this.cdr.markForCheck();
  }

  writeValue(val: any): void {
    if (val !== undefined) {
      this.value = !!val;
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }
}
