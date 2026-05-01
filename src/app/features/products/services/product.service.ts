import { Injectable, inject } from '@angular/core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { Product } from '../models/product.model';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseCrudService<Product> {
  constructor() {
    const apiService = inject(ApiService);
    super(apiService, 'products');
  }
}
