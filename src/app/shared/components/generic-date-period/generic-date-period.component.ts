import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export type DatePeriodMode = 'DATE' | 'MONTH';

@Component({
  selector: 'app-generic-date-period',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generic-date-period.component.html',
  styleUrl: './generic-date-period.component.css'
})
export class GenericDatePeriodComponent {
  @Input() caption!: string;
  @Input() mode: DatePeriodMode = 'DATE';
  @Input() startControl!: FormControl;
  @Input() endControl!: FormControl;
  @Input() fieldIdPrefix: string = 'date-period';
  
  get inputType(): string {
    return this.mode === 'MONTH' ? 'month' : 'date';
  }
}
