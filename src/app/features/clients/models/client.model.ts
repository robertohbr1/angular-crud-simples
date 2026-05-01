import { BaseEntity } from '../../../core/models/base-entity.model';

/**
 * Modelo de Cliente sincronizado com a API (Swagger).
 */
export interface Client extends BaseEntity {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  createdAt?: string;
}
