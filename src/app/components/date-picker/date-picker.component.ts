import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit {

  form: FormGroup;

  minDate = new Date(2013, 3, 29);
  maxDate = new Date();
  @Output() btnClick = new EventEmitter();
  cssClass = '/date-picker.component.css'
  buttonColor: 'Blue';

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      daterange: new FormGroup({
        start: new FormControl,
        end: new FormControl
      })
    });
  }

  onClick() {
    var times = [this.form.controls['daterange'].value['start'], this.form.controls['daterange'].value['end']];
    this.btnClick.emit(times);
  }


}
