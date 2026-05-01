# Angular CRUD System - Maintainable & Scalable

Designing a robust Angular architecture optimized for AI maintenance, featuring a single configurable component for CRUD operations and a generic paginated list.

## User Review Required

> [!IMPORTANT]
> **Single Component for CRUD**: As requested, I will implement a `GenericFormComponent` that adapts its UI and logic based on the action (Create, Edit, Delete). This reduces code duplication but requires careful state management.
> **Styling**: I will implement a premium, modern design using Vanilla CSS (variables, glassmorphism) without external UI libraries to ensure maximum control and performance.

## Proposed Changes

### 1. Project Initialization
Initialize the Angular project with standalone components and Signals for modern, efficient state management.

### 2. Core Architecture
#### [NEW] [base-crud.service.ts](file:///c:/Projetos/ProjetoOff/angular/src/app/core/services/base-crud.service.ts)
Abstract service defining standard CRUD operations (`getAll`, `getById`, `create`, `update`, `delete`). This ensures all features follow the same pattern, making it easy for AI to add new entities.

#### [NEW] [api.service.ts](file:///c:/Projetos/ProjetoOff/angular/src/app/core/services/api.service.ts)
Wrapper around `HttpClient` to handle common headers, security (Interceptors), and error handling.

### 3. Shared Components
#### [NEW] [generic-table.component.ts](file:///c:/Projetos/ProjetoOff/angular/src/app/shared/components/generic-table/generic-table.component.ts)
A reusable table component with built-in pagination (20 records) and dynamic columns.

#### [NEW] [generic-form.component.ts](file:///c:/Projetos/ProjetoOff/angular/src/app/shared/components/generic-form/generic-form.component.ts)
The core configurable component. It will receive a configuration object defining fields and the current mode (CREATE, EDIT, DELETE).

### 4. Sample Feature: Products
#### [NEW] [product.model.ts](file:///c:/Projetos/ProjetoOff/angular/src/app/features/products/models/product.model.ts)
#### [NEW] [product.service.ts](file:///c:/Projetos/ProjetoOff/angular/src/app/features/products/services/product.service.ts)
#### [NEW] [product-list.component.ts](file:///c:/Projetos/ProjetoOff/angular/src/app/features/products/pages/product-list/product-list.component.ts)

## Verification Plan

### Automated Tests
- `npm test`: Run unit tests for the generic components and services.
- Ensure 100% coverage on the `BaseCrudService` logic.

### Manual Verification
- Use the browser tool to verify:
    1. Pagination loads 20 records at a time.
    2. Switching between Create/Edit/Delete modes in the generic component updates the UI correctly (e.g., Delete mode disables inputs and shows a "Confirm" button).
