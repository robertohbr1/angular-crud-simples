import { Component, forwardRef, Input, OnInit, signal, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { of } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { LOOKUPS_REGISTRY, LookupConfig } from '../../lookups.registry';
import { GenericLookupModalComponent } from '../generic-lookup-modal/generic-lookup-modal.component';

@Component({
  selector: 'app-generic-lookup-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, GenericLookupModalComponent],
  templateUrl: './generic-lookup-field.component.html',
  styleUrl: './generic-lookup-field.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GenericLookupFieldComponent),
      multi: true
    }
  ],
  host: {
    '[class.horizontal]': "orientation === 'horizontal'"
  }
})
export class GenericLookupFieldComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() lookupName!: string;
  @Input() fieldLabel!: string;
  @Input() fieldId!: string;
  @Input() placeholder?: string;
  @Input() mode: 'CREATE' | 'EDIT' | 'DELETE' = 'CREATE';
  @Input() orientation: 'vertical' | 'horizontal' = 'vertical';

  private readonly apiService = inject(ApiService);
  private destroy$ = new Subject<void>();

  // Internal control to handle input reactivity
  internalControl = new FormControl({ value: '', disabled: false });
  lookupLabel = signal<string>('');
  
  // Modal state
  isModalOpen = signal<boolean>(false);

  // CVA implementations
  onChange: any = () => {};
  onTouched: any = () => {};

  get config(): LookupConfig | undefined {
    return this.lookupName ? LOOKUPS_REGISTRY[this.lookupName] : undefined;
  }

  ngOnInit(): void {
    if (!this.placeholder) {
      this.placeholder = 'Informe ' + this.fieldLabel;
    }

    this.internalControl.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(val => {
      this.onChange(val);
      this.onTouched();
      
      if (val) {
        this.fetchLookupName(val);
      } else {
        this.lookupLabel.set('');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // CVA Methods
  writeValue(value: any): void {
    this.internalControl.setValue(value, { emitEvent: false });
    if (value) {
      this.fetchLookupName(value);
    } else {
      this.lookupLabel.set('');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled || this.mode === 'DELETE') {
      this.internalControl.disable({ emitEvent: false });
    } else {
      this.internalControl.enable({ emitEvent: false });
    }
  }

  // Business Logic
  private fetchLookupName(id: string): void {
    const endpoint = this.config?.lookupEndpoint;
    if (!endpoint) return;

    this.apiService.get<any>(`${endpoint}/${id}`).pipe(
      catchError(() => {
        this.lookupLabel.set('Não encontrado');
        return of(null);
      })
    ).subscribe(res => {
      if (res && res.nome) {
        this.lookupLabel.set(res.nome);
      } else if (res && res.name) {
        this.lookupLabel.set(res.name);
      }
    });
  }

  openLookup(): void {
    if (this.mode !== 'DELETE' && this.config?.lookupEndpoint) {
      this.isModalOpen.set(true);
    }
  }

  closeLookup(): void {
    this.isModalOpen.set(false);
  }

  onLookupSelected(record: any): void {
    if (this.config) {
      const key = this.config.lookupKeyField || 'id';
      const valueToSet = record[key];
      this.internalControl.setValue(valueToSet);
      this.internalControl.markAsDirty();
    }
    this.closeLookup();
  }
}
