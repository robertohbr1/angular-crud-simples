import { Component, EventEmitter, Input, OnInit, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ColumnDefinition } from '../generic-table/generic-table.component';
import { GenericLookupModalComponent } from '../generic-lookup-modal/generic-lookup-modal.component';
import { LOOKUPS_REGISTRY, LookupConfig } from '../../lookups.registry';
import { ApiService } from '../../../core/services/api.service';
import { debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export type FormMode = 'CREATE' | 'EDIT' | 'DELETE';

@Component({
  selector: 'app-generic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, GenericLookupModalComponent],
  templateUrl: './generic-form.component.html',
  styleUrl: './generic-form.component.css'
})
export class GenericFormComponent implements OnInit {
  private readonly apiService = inject(ApiService);
  
  @Input() mode: FormMode = 'CREATE';
  @Input() columns: ColumnDefinition[] = [];
  @Input() initialData: any = {};
  
  get visibleFields(): ColumnDefinition[] {
    return this.columns.filter(f => f.ShowInEdit !== false);
  }
  
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  form: FormGroup = new FormGroup({});
  lookupLabels: Record<string, string> = {};

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

    this.columns.forEach(col => {
      const config = this.getLookupConfig(col);
      if (config?.lookupEndpoint) {
        const control = this.form.get(col.key);
        if (control) {
          control.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
          ).subscribe(val => {
            if (val) {
              this.fetchLookupName(col.key, config.lookupEndpoint!, val);
            } else {
              this.lookupLabels[col.key] = '';
            }
          });

          if (control.value) {
            this.fetchLookupName(col.key, config.lookupEndpoint!, control.value);
          }
        }
      }
    });
  }

  private fetchLookupName(fieldKey: string, endpoint: string, id: string): void {
    this.apiService.get<any>(`${endpoint}/${id}`).pipe(
      catchError(() => {
        this.lookupLabels[fieldKey] = 'Não encontrado';
        return of(null);
      })
    ).subscribe(res => {
      if (res && res.nome) {
        this.lookupLabels[fieldKey] = res.nome;
      } else if (res && res.name) {
        this.lookupLabels[fieldKey] = res.name;
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid || this.mode === 'DELETE') {
      // Return getRawValue because disabled fields are not included in value
      this.formSubmit.emit(this.form.getRawValue());
    }
  }

  activeLookupConfig = signal<LookupConfig | null>(null);
  activeLookupFieldKey = signal<string | null>(null);

  getLookupConfig(field: ColumnDefinition): LookupConfig | undefined {
    return field.lookupName ? LOOKUPS_REGISTRY[field.lookupName] : undefined;
  }

  openLookup(field: ColumnDefinition): void {
    const config = this.getLookupConfig(field);
    if (this.mode !== 'DELETE' && config?.lookupEndpoint) {
      this.activeLookupConfig.set(config);
      this.activeLookupFieldKey.set(field.key);
    }
  }

  closeLookup(): void {
    this.activeLookupConfig.set(null);
    this.activeLookupFieldKey.set(null);
  }

  onLookupSelected(record: any): void {
    const config = this.activeLookupConfig();
    const fieldKey = this.activeLookupFieldKey();
    if (config && fieldKey) {
      const key = config.lookupKeyField || 'id';
      const valueToSet = record[key];
      this.form.get(fieldKey)?.setValue(valueToSet);
      this.form.get(fieldKey)?.markAsDirty();
    }
    this.closeLookup();
  }
}
