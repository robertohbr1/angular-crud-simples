import { Component, EventEmitter, Input, Output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ColumnDefinition {
  key: string;
  label: string;
  ShowInGrid?: boolean;
  type?: string;
  required?: boolean;
  ShowInEdit?: boolean;
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.css'
})
export class GenericTableComponent {
  @Input() columns: ColumnDefinition[] = [];
  @Input() data: any[] = [];
  @Input() totalRecords = 0;
  @Input() pageSize = 20;
  
  get visibleColumns(): ColumnDefinition[] {
    return this.columns.filter(c => c.ShowInGrid !== false);
  }
  
  @Output() pageChange = new EventEmitter<number>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() create = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  currentPage = signal(0);

  /**
   * Se o backend não paginar (data.length > pageSize), nós paginamos no front.
   * Se o backend já paginou, data.length <= pageSize e o slice não afetará nada (desde que data seja apenas a página atual).
   */
  get paginatedData(): any[] {
    // Se a quantidade de dados for maior que o tamanho da página, 
    // assumimos que o backend retornou tudo e fazemos o slice no front.
    if (this.data.length > this.pageSize) {
      const start = this.currentPage() * this.pageSize;
      return this.data.slice(start, start + this.pageSize);
    }
    // Caso contrário, assumimos que os dados já são a página correta.
    return this.data;
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  onPageChange(page: number): void {
    if (page >= 0 && (page < this.totalPages || this.totalPages === 0)) {
      this.currentPage.set(page);
      this.pageChange.emit(page);
    }
  }
}
