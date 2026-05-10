import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GenericLookupFieldComponent } from '../../shared/components/generic-lookup-field/generic-lookup-field.component';
import { GenericDatePeriodComponent } from '../../shared/components/generic-date-period/generic-date-period.component';

@Component({
  selector: 'app-test-lookup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericLookupFieldComponent, GenericDatePeriodComponent],
  templateUrl: './test-lookup.component.html',
  styleUrl: './test-lookup.component.css'
})
export class TestLookupComponent {
  fornecedorControl = new FormControl('');
  clienteControl = new FormControl('');
  produtoControl = new FormControl('');

  startEmissaoControl = new FormControl('');
  endEmissaoControl = new FormControl('');

  startFaturamentoControl = new FormControl('');
  endFaturamentoControl = new FormControl('');
}
