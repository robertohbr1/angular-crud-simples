import { ColumnDefinition } from './components/generic-table/generic-table.component';

export interface LookupConfig {
  linkRoute?: string;
  lookupEndpoint?: string;
  lookupKeyField?: string;
  lookupColumns?: ColumnDefinition[];
}

export const LOOKUPS_REGISTRY: Record<string, LookupConfig> = {
  'UF': {
    linkRoute: '/ufs',
    lookupEndpoint: 'ufs',
    lookupKeyField: 'id',
    lookupColumns: [
      { key: 'id', label: 'UF', ShowInGrid: true },
      { key: 'nome', label: 'Nome', ShowInGrid: true }
    ]
  },
  'CNAE': {
    linkRoute: '/cnaes',
    lookupEndpoint: 'cnaes',
    lookupKeyField: 'id',
    lookupColumns: [
      { key: 'id', label: 'CNAE', ShowInGrid: true },
      { key: 'nome', label: 'Nome', ShowInGrid: true }
    ]
  },
  'Fornecedores': {
    linkRoute: '/suppliers',
    lookupEndpoint: 'suppliers',
    lookupKeyField: 'id',
    lookupColumns: [
      { key: 'id', label: 'ID', ShowInGrid: true },
      { key: 'name', label: 'Nome Fantasia', ShowInGrid: true }
    ]
  },
  'Clientes': {
    linkRoute: '/clients',
    lookupEndpoint: 'clients',
    lookupKeyField: 'id',
    lookupColumns: [
      { key: 'id', label: 'ID', ShowInGrid: true },
      { key: 'name', label: 'Nome / Razão Social', ShowInGrid: true },
      { key: 'cnpj', label: 'CNPJ', ShowInGrid: true }
    ]
  },
  'Produtos': {
    linkRoute: '/products',
    lookupEndpoint: 'products',
    lookupKeyField: 'id',
    lookupColumns: [
      { key: 'id', label: 'ID', ShowInGrid: true },
      { key: 'name', label: 'Nome do Produto', ShowInGrid: true }
    ]
  }
};
