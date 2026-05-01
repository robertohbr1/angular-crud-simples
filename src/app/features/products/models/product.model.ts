import { BaseEntity } from '../../../core/models/base-entity.model';

export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  createdAt?: string;
}
