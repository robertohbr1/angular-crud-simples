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
  }
};
