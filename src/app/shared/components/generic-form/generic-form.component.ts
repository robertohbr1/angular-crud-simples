import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';

export type FormMode = 'CREATE' | 'EDIT' | 'DELETE';

export interface FieldConfig {
  key: string;
  label: string;
  type: string;
  required?: boolean;
}

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
export class GenericFormComponent implements OnInit {
  @Input() mode: FormMode = 'CREATE';
  @Input() fields: FieldConfig[] = [];
  @Input() initialData: any = {};
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  form: FormGroup = new FormGroup({});

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const group: any = {};
    this.fields.forEach(field => {
      group[field.key] = new FormControl(
        { value: this.initialData[field.key] || '', disabled: this.mode === 'DELETE' },
        field.required ? Validators.required : []
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
