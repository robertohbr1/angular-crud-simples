import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { GenericTableComponent, ColumnDefinition } from '../../../../shared/components/generic-table/generic-table.component';
import { GenericFormComponent, FieldConfig, FormMode } from '../../../../shared/components/generic-form/generic-form.component';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, GenericFormComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {
  private readonly clientService = inject(ClientService);

  clients = signal<Client[]>([]);
  totalRecords = signal(0);

  showForm = signal(false);
  formMode = signal<FormMode>('CREATE');
  selectedClient = signal<Client | null>(null);
  errorMessage = signal<string | null>(null);

  columns: ColumnDefinition[] = [
    { key: 'name', label: 'Nome' },
    { key: 'cnpj', label: 'CNPJ' },
    { key: 'phone', label: 'Telefone' }
  ];

  fields: FieldConfig[] = [
    { key: 'name', label: 'Nome / Razão Social', type: 'text', required: true },
    { key: 'cnpj', label: 'CNPJ', type: 'text', required: true },
    { key: 'address', label: 'Endereço', type: 'text', required: false },
    { key: 'phone', label: 'Telefone', type: 'text', required: true }
  ];

  ngOnInit(): void {
    // Pequeno atraso para garantir que o backend/proxy esteja pronto
    setTimeout(() => this.loadClients(), 300);
  }

  loadClients(): void {
    console.log('Solicitando clientes à API...');
    this.clientService.getAll().subscribe({
      next: (data) => {
        console.log(`Recebidos ${data.length} clientes.`);
        this.clients.set(data);
        this.totalRecords.set(data.length);
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        this.errorMessage.set('Não foi possível carregar os clientes. Verifique se a API está rodando.');
        this.clients.set([]);
        this.totalRecords.set(0);
      }
    });
  }

  onAdd(): void {
    this.errorMessage.set(null);
    this.selectedClient.set(null);
    this.formMode.set('CREATE');
    this.showForm.set(true);
  }

  onEdit(client: Client): void {
    this.errorMessage.set(null);
    this.selectedClient.set(client);
    this.formMode.set('EDIT');
    this.showForm.set(true);
  }

  onDelete(client: Client): void {
    this.errorMessage.set(null);
    this.selectedClient.set(client);
    this.formMode.set('DELETE');
    this.showForm.set(true);
  }

  onFormSubmit(data: any): void {
    this.errorMessage.set(null);
    const obs = this.formMode() === 'CREATE'
      ? this.clientService.create(data)
      : this.formMode() === 'EDIT'
        ? this.clientService.update(this.selectedClient()!.id!, data)
        : this.clientService.delete(this.selectedClient()!.id!);

    obs.subscribe({
      next: () => this.closeFormAndReload(),
      error: (err) => {
        console.error('Erro na operação:', err);
        this.errorMessage.set('Erro ao processar requisição. Verifique o console.');
      }
    });
  }

  onFormCancel(): void {
    this.showForm.set(false);
  }

  private closeFormAndReload(): void {
    this.showForm.set(false);
    this.loadClients();
  }
}
