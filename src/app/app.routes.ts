import { Routes } from '@angular/router';
import { GenericCrudComponent } from './shared/components/generic-crud/generic-crud.component';
import { ColumnDefinition } from './shared/components/generic-table/generic-table.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'products',
    component: GenericCrudComponent,
    data: {
      endpoint: 'products',
      entityName: 'Produtos',
      columns: [
        { key: 'id', label: 'ID', ShowInGrid: true, ShowInEdit: false },
        { key: 'name', label: 'Nome do Produto', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true },
        { key: 'description', label: 'Descrição', ShowInGrid: true, ShowInEdit: true, type: 'text', required: false },
        { key: 'price', label: 'Preço (R$)', ShowInGrid: true, ShowInEdit: true, type: 'number', required: true }
      ] as ColumnDefinition[]
    }
  },
  {
    path: 'clients',
    component: GenericCrudComponent,
    data: {
      endpoint: 'clients',
      entityName: 'Clientes',
      columns: [
        { key: 'name', label: 'Nome / Razão Social', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true },
        { key: 'cnpj', label: 'CNPJ', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true },
        { key: 'address', label: 'Endereço', ShowInGrid: false, ShowInEdit: true, type: 'text', required: false },
        { key: 'phone', label: 'Telefone', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true },
        {
          key: 'uf', label: 'UF', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true,
          lookupName: 'UF'
        },
        {
          key: 'cnae', label: 'CNAE', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true,
          lookupName: 'CNAE'
        }
      ] as ColumnDefinition[]
    }
  },
  {
    path: 'suppliers',
    component: GenericCrudComponent,
    data: {
      endpoint: 'suppliers',
      entityName: 'Fornecedores',
      columns: [
        { key: 'name', label: 'Nome Fantasia', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true },
        { key: 'razaoSocial', label: 'Razão Social', ShowInGrid: false, ShowInEdit: true, type: 'text', required: true },
        { key: 'cnpj', label: 'CNPJ', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true },
        { key: 'address', label: 'Endereço', ShowInGrid: false, ShowInEdit: true, type: 'text', required: false },
        { key: 'phone', label: 'Telefone', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true },
        {
          key: 'uf', label: 'UF', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true,
          lookupName: 'UF'
        },
        {
          key: 'cnae', label: 'CNAE', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true,
          lookupName: 'CNAE'
        }
      ] as ColumnDefinition[]
    }
  },
  {
    path: 'ufs',
    component: GenericCrudComponent,
    data: {
      endpoint: 'ufs',
      entityName: 'Unidades Federativas',
      columns: [
        { key: 'id', label: 'UF', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true },
        { key: 'nome', label: 'Nome', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true }
      ] as ColumnDefinition[]
    }
  },
  {
    path: 'cnaes',
    component: GenericCrudComponent,
    data: {
      endpoint: 'cnaes',
      entityName: 'CNAEs',
      columns: [
        { key: 'id', label: 'CNAE', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true },
        { key: 'nome', label: 'Nome', ShowInGrid: true, ShowInEdit: true, type: 'text', required: true }
      ] as ColumnDefinition[]
    }
  },
  {
    path: 'test-lookup',
    loadComponent: () => import('./features/test-lookup/test-lookup.component').then(m => m.TestLookupComponent)
  }
];
