import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ColumnDefinition } from '../generic-table/generic-table.component';

export type FormMode = 'CREATE' | 'EDIT' | 'DELETE';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
export class GenericFormComponent implements OnInit {
  @Input() mode: FormMode = 'CREATE';
  @Input() columns: ColumnDefinition[] = [];
  @Input() initialData: any = {};
  
  get visibleFields(): ColumnDefinition[] {
    return this.columns.filter(f => f.ShowInEdit !== false);
  }
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  form: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const group: any = {};
    this.columns.forEach(col => {
      group[col.key] = new FormControl(
        { value: this.initialData[col.key] || '', disabled: this.mode === 'DELETE' },
        col.required ? Validators.required : []
      );
    });
    this.form = new FormGroup(group);
  }

  onSubmit(): void {
    if (this.form.valid || this.mode === 'DELETE') {
      // Return getRawValue because disabled fields are not included in value
      this.formSubmit.emit(this.form.getRawValue());
    }
  }
}
