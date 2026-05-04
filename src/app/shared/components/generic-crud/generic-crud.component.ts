import { Component, OnInit, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericCrudService } from '../../../core/services/generic-crud.service';
import { GenericTableComponent, ColumnDefinition } from '../generic-table/generic-table.component';
import { GenericFormComponent, FormMode } from '../generic-form/generic-form.component';

@Component({
  selector: 'app-generic-crud',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, GenericFormComponent],
  templateUrl: './generic-crud.component.html',
  styleUrl: './generic-crud.component.css'
})
export class GenericCrudComponent implements OnInit {
  private readonly crudService = inject(GenericCrudService);

  @Input() endpoint!: string;
  @Input() entityName: string = 'Registros';
  @Input() columns: ColumnDefinition[] = [];

  records = signal<any[]>([]);
  totalRecords = signal(0);
  
  showForm = signal(false);
  formMode = signal<FormMode>('CREATE');
  selectedRecord = signal<any | null>(null);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    if (!this.endpoint) {
      this.errorMessage.set('Endpoint não configurado para esta rota.');
      return;
    }
    setTimeout(() => this.loadRecords(), 300);
  }

  loadRecords(): void {
    console.log(`Solicitando ${this.entityName} à API...`);
    this.crudService.getAll(this.endpoint).subscribe({
      next: (data) => {
        console.log(`Recebidos ${data.length} registros de ${this.entityName}.`);
        this.records.set(data);
        this.totalRecords.set(data.length);
      },
      error: (err) => {
        console.error(`Erro ao carregar ${this.entityName}:`, err);
        this.errorMessage.set(`Não foi possível carregar os registros de ${this.entityName}. Verifique se a API está rodando.`);
        this.records.set([]);
        this.totalRecords.set(0);
      }
    });
  }

  onAdd(): void {
    this.errorMessage.set(null);
    this.selectedRecord.set(null);
    this.formMode.set('CREATE');
    this.showForm.set(true);
  }

  onEdit(record: any): void {
    this.errorMessage.set(null);
    this.selectedRecord.set(record);
    this.formMode.set('EDIT');
    this.showForm.set(true);
  }

  onDelete(record: any): void {
    this.errorMessage.set(null);
    this.selectedRecord.set(record);
    this.formMode.set('DELETE');
    this.showForm.set(true);
  }

  onFormSubmit(data: any): void {
    this.errorMessage.set(null);
    const obs = this.formMode() === 'CREATE'
      ? this.crudService.create(this.endpoint, data)
      : this.formMode() === 'EDIT'
        ? this.crudService.update(this.endpoint, this.selectedRecord().id, data)
        : this.crudService.delete(this.endpoint, this.selectedRecord().id);

    obs.subscribe({
      next: () => this.closeFormAndReload(),
      error: (err) => {
        console.error('Erro na operação:', err);
        this.errorMessage.set('Ocorreu um erro ao salvar os dados. Verifique a conexão com a API.');
      }
    });
  }

  onFormCancel(): void {
    this.showForm.set(false);
  }

  private closeFormAndReload(): void {
    this.showForm.set(false);
    this.loadRecords();
  }
}
