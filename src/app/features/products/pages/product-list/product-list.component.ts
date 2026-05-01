import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { GenericTableComponent, ColumnDefinition } from '../../../../shared/components/generic-table/generic-table.component';
import { GenericFormComponent, FieldConfig, FormMode } from '../../../../shared/components/generic-form/generic-form.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, GenericTableComponent, GenericFormComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  products = signal<Product[]>([]);
  totalRecords = signal(0);
  
  // UI State
  showForm = signal(false);
  formMode = signal<FormMode>('CREATE');
  selectedProduct = signal<Product | null>(null);
  errorMessage = signal<string | null>(null);

  columns: ColumnDefinition[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nome' },
    { key: 'description', label: 'Descrição' },
    { key: 'price', label: 'Preço' }
  ];

  fields: FieldConfig[] = [
    { key: 'name', label: 'Nome do Produto', type: 'text', required: true },
    { key: 'description', label: 'Descrição', type: 'text', required: false },
    { key: 'price', label: 'Preço (R$)', type: 'number', required: true }
  ];

  ngOnInit(): void {
    // Pequeno atraso para garantir que o backend/proxy esteja pronto
    setTimeout(() => this.loadProducts(), 300);
  }

  loadProducts(): void {
    console.log('Solicitando produtos à API...');
    this.productService.getAll().subscribe({
      next: (data) => {
        console.log(`Recebidos ${data.length} produtos.`);
        this.products.set(data);
        // Set total records to the length of data returned by the API
        this.totalRecords.set(data.length); 
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.errorMessage.set('Não foi possível carregar os produtos. Verifique se a API está rodando.');
        this.products.set([]);
        this.totalRecords.set(0);
      }
    });
  }

  onAdd(): void {
    this.errorMessage.set(null);
    this.selectedProduct.set(null);
    this.formMode.set('CREATE');
    this.showForm.set(true);
  }

  onEdit(product: Product): void {
    this.errorMessage.set(null);
    this.selectedProduct.set(product);
    this.formMode.set('EDIT');
    this.showForm.set(true);
  }

  onDelete(product: Product): void {
    this.selectedProduct.set(product);
    this.formMode.set('DELETE');
    this.showForm.set(true);
  }

  onFormSubmit(data: any): void {
    this.errorMessage.set(null);
    const obs = this.formMode() === 'CREATE' 
      ? this.productService.create(data)
      : this.formMode() === 'EDIT'
      ? this.productService.update(this.selectedProduct()!.id!, data)
      : this.productService.delete(this.selectedProduct()!.id!);

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
    this.loadProducts();
  }
}
