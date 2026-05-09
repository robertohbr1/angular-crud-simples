import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent, ColumnDefinition } from '../generic-table/generic-table.component';
import { GenericCrudService } from '../../../core/services/generic-crud.service';

@Component({
  selector: 'app-generic-lookup-modal',
  standalone: true,
  imports: [CommonModule, GenericTableComponent],
  templateUrl: './generic-lookup-modal.component.html',
  styleUrl: './generic-lookup-modal.component.css'
})
export class GenericLookupModalComponent implements OnInit {
  private readonly crudService = inject(GenericCrudService);

  @Input() endpoint!: string;
  @Input() columns: ColumnDefinition[] = [];
  
  @Output() selected = new EventEmitter<any>();
  @Output() closed = new EventEmitter<void>();

  records = signal<any[]>([]);
  totalRecords = signal(0);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    if (!this.endpoint) return;
    
    this.crudService.getAll(this.endpoint).subscribe({
      next: (data) => {
        this.records.set(data);
        this.totalRecords.set(data.length);
      },
      error: (err) => {
        console.error(`Erro ao carregar lookup data:`, err);
        this.errorMessage.set(`Não foi possível carregar os registros.`);
        this.records.set([]);
        this.totalRecords.set(0);
      }
    });
  }
}
