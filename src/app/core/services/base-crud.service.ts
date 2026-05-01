import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BaseEntity } from '../models/base-entity.model';

/**
 * Base abstract class for CRUD services.
 * Ensures consistent API interaction patterns across all features.
 */
export abstract class BaseCrudService<T extends BaseEntity> {
  constructor(
    protected readonly api: ApiService,
    protected readonly endpoint: string
  ) {}

  /**
   * Busca todos os registros da entidade. 
   * A paginação é tratada no frontend para simplificar a integração.
   */
  getAll(): Observable<T[]> {
    return this.api.get<T[]>(this.endpoint);
  }

  /**
   * Fetches a single record by ID.
   */
  getById(id: string | number): Observable<T> {
    return this.api.get<T>(`${this.endpoint}/${id}`);
  }

  /**
   * Creates a new record.
   */
  create(item: T): Observable<T> {
    return this.api.post<T>(this.endpoint, item);
  }

  /**
   * Updates an existing record.
   */
  update(id: string | number, item: T): Observable<T> {
    return this.api.put<T>(`${this.endpoint}/${id}`, item);
  }

  /**
   * Deletes a record.
   */
  delete(id: string | number): Observable<T> {
    return this.api.delete<T>(`${this.endpoint}/${id}`);
  }
}
