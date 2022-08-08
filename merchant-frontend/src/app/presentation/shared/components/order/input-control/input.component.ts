import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

import { FormControl } from '@angular/forms';

@Component({

  selector: 'app-input',

  styleUrls: ['./input.component.scss'],

  templateUrl: './input.component.html'

})

export class InputComponent implements OnInit {

  _value: any;

  get value() {

    return this._value;

  }

  set value(val: any) {

    this._value = val;

    this.propagateChange(val);

  }

  @Input() label: string;

  @Input() requiredField: boolean;

  @Input() readonlyField = false;

  @Input() type: string;

  @Input() id: string;

  @Input() name: string;

  @Input() placeholder: string;

  @Input() formControl: FormControl;

  @Input() min: number;

  @Output() blur: EventEmitter<any> = new EventEmitter();

  isAPhoneInputField: boolean;

  ngOnInit(): void {

    this.isAPhoneInputField = this.name === 'phoneNumber';

  }

  get isInvalid() {

    return (this.formControl && this.formControl.invalid) && (!this.formControl.pristine);

  }

  propagateChange = (_: any) => { };

  writeValue(obj: any): void {

    this.value = obj;

    this.propagateChange(obj);

  }

  registerOnChange(fn: any): void {

    this.propagateChange = fn;

  }

  registerOnTouched(fn: any): void {

    fn();

  }

  onBlur(event: any): void {

    this.blur.emit(event);

  }

  setDisabledState?(isDisabled: boolean): void {

    isDisabled;

  }

}
