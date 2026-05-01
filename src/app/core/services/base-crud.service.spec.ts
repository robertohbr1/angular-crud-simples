import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { BaseCrudService } from './base-crud.service';
import { BaseEntity } from '../models/base-entity.model';
import { Injectable, inject } from '@angular/core';

interface MockEntity extends BaseEntity {
  name: string;
}

@Injectable()
class MockService extends BaseCrudService<MockEntity> {
  constructor() {
    const api = inject(ApiService);
    super(api, 'mocks');
  }
}

describe('BaseCrudService', () => {
  let service: MockService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ApiService,
        MockService
      ]
    });

    service = TestBed.inject(MockService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all records with default pagination (size=20)', () => {
    const dummyData: MockEntity[] = [{ id: 1, name: 'Test' }];

    service.getAll().subscribe(data => {
      expect(data.length).toBe(1);
      expect(data).toEqual(dummyData);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/mocks?page=0&size=20');
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should create a new record via POST', () => {
    const newRecord: MockEntity = { name: 'New' };

    service.create(newRecord).subscribe(response => {
      expect(response).toEqual({ ...newRecord, id: 2 });
    });

    const req = httpMock.expectOne('http://localhost:5000/api/mocks');
    expect(req.request.method).toBe('POST');
    req.flush({ ...newRecord, id: 2 });
  });
});
