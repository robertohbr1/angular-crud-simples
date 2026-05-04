import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class GenericCrudService {
  private readonly api = inject(ApiService);

  getAll(endpoint: string): Observable<any[]> {
    return this.api.get<any[]>(endpoint);
  }

  getById(endpoint: string, id: string | number): Observable<any> {
    return this.api.get<any>(`${endpoint}/${id}`);
  }

  create(endpoint: string, item: any): Observable<any> {
    return this.api.post<any>(endpoint, item);
  }

  update(endpoint: string, id: string | number, item: any): Observable<any> {
    return this.api.put<any>(`${endpoint}/${id}`, item);
  }

  delete(endpoint: string, id: string | number): Observable<any> {
    return this.api.delete<any>(`${endpoint}/${id}`);
  }
}
