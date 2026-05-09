# Generic Crud Architecture - Angular Frontend

Esta aplicação utiliza uma arquitetura front-end baseada em componentes genéricos e rotas dinâmicas, desenhada para acelerar o desenvolvimento e facilitar a manutenção por Inteligência Artificial.

## Princípios Core

1. **DRY (Don't Repeat Yourself)**: Nenhuma tela de CRUD (tabela + formulário) é criada individualmente.
2. **Data-Driven UI**: A interface é gerada dinamicamente a partir de metadados definidos no roteador (`app.routes.ts`).
3. **Ponto Único de Manutenção**: Alterações no design, layout ou comportamento (como paginação e lookups) são feitas uma única vez nos componentes genéricos e refletidas em todo o sistema.

## Estrutura da Arquitetura

### 1. Configuração de Rotas (`app.routes.ts`)
O `app.routes.ts` é o coração do sistema. Nele, definimos as rotas apontando sempre para o `GenericCrudComponent` e passando os metadados via propriedade `data`:

- **`endpoint`**: A rota na API (ex: `products`).
- **`entityName`**: O nome da entidade para exibição (ex: `Produtos`).
- **`columns`**: Array de `ColumnDefinition` que define quais campos existem, se aparecem na grid, se são editáveis, obrigatoriedade, tipos, e se possuem dependências externas (Lookups).

### 2. Generic Crud Component (`generic-crud.component.ts`)
É o contêiner principal de uma página. Ele lê os metadados da rota atual, se comunica com o `BaseCrudService` e orquestra a troca entre a Tabela de Listagem e o Formulário de Edição/Criação.

### 3. Tabela Genérica (`generic-table.component.ts`)
Renderiza uma grid de dados baseada nas colunas que possuem `ShowInGrid: true`. Possui suporte nativo a paginação.

### 4. Formulário Genérico (`generic-form.component.ts`)
Gera inputs dinamicamente com base no array de colunas (`ShowInEdit: true`). 
- Valida obrigatoriedades.
- Desabilita campos no modo "Exclusão".
- Inclui ações extras (como pesquisa avançada) para chaves estrangeiras.

### 5. Lookups Registry (`lookups.registry.ts`)
O registro centralizado para campos que dependem de outras tabelas. Em vez de declarar toda a configuração de uma modal de busca a cada coluna, basta declarar:
`lookupName: 'UF'` no `app.routes.ts`.

O motor de formulários (`GenericFormComponent`) lerá o `LOOKUPS_REGISTRY` e automaticamente:
- Criará um botão de lupa (`🔍`) que abre o `GenericLookupModalComponent` listando os dados da API (ex: `/api/ufs`).
- Criará um botão de atalho (`↗️`) que abre a página de cadastro da entidade alvo em nova guia.
- **Resolução de Nomes Automática**: O formulário fará requisições de background para popular um *label* dinâmico à direita do campo, mostrando o nome descritivo do código informado.

## Como Adicionar uma Nova Entidade

Para adicionar, por exemplo, "Categorias":

1. Se a nova entidade precisar ser buscada como chave estrangeira por outros cadastros, adicione-a no `src/app/shared/lookups.registry.ts`.
2. Em `src/app/app.routes.ts`, adicione uma nova rota `/categories`, apontando para o `GenericCrudComponent`.
3. Defina os campos no array `columns` do `data`.
4. (Opcional) Adicione um link no header em `app.html` para acessar a nova rota.

Isso é o suficiente para ter Listagem, Paginação, Inclusão, Edição, Exclusão e Validação operando em conjunto com a API!
