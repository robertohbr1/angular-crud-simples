import { Injectable, inject } from '@angular/core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { Client } from '../models/client.model';
import { ApiService } from '../../../core/services/api.service';

/**
 * Serviço de Clientes. 
 */
@Injectable({
  providedIn: 'root'
})
export class ClientService extends BaseCrudService<Client> {
  constructor() {
    const api = inject(ApiService);
    super(api, 'clients');
  }
}
