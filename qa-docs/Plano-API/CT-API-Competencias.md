# API - Competências

## Objetivo

Validar os endpoints responsáveis pelo gerenciamento de competências, garantindo o correto funcionamento das operações de consulta, criação, atualização e exclusão.

---

## API-001 - Listar Competências

| Campo              | Valor                                             |
| ------------------ | ------------------------------------------------- |
| Método             | GET                                               |
| Endpoint           | /competencies                                     |
| Objetivo           | Listar todas as competências cadastradas          |
| Resultado Esperado | Status 200 e retorno de uma lista de competências |

---

## API-002 - Criar Competência Válida

| Campo              | Valor                                      |
| ------------------ | ------------------------------------------ |
| Método             | POST                                       |
| Endpoint           | /competencies                              |
| Payload            | {"name":"Comunicação"}                     |
| Objetivo           | Criar uma nova competência                 |
| Resultado Esperado | Status 201 e retorno da competência criada |

---

## API-003 - Criar Competência Sem Nome

| Campo              | Valor                                      |
| ------------------ | ------------------------------------------ |
| Método             | POST                                       |
| Endpoint           | /competencies                              |
| Payload            | {"name":""}                                |
| Objetivo           | Validar obrigatoriedade do campo nome      |
| Resultado Esperado | Status 422 e mensagem "name é obrigatório" |

---

## API-004 - Atualizar Competência Existente

| Campo              | Valor                                      |
| ------------------ | ------------------------------------------ |
| Método             | PUT                                        |
| Endpoint           | /competencies/{id}                         |
| Payload            | {"name":"Liderança"}                       |
| Objetivo           | Atualizar uma competência existente        |
| Resultado Esperado | Status 200 e retorno dos dados atualizados |

---

## API-005 - Atualizar Competência Inexistente

| Campo              | Valor                                       |
| ------------------ | ------------------------------------------- |
| Método             | PUT                                         |
| Endpoint           | /competencies/{id}                          |
| Pré-condição       | Utilizar ID inexistente                     |
| Objetivo           | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "competency_not_found"    |

---

## API-006 - Atualizar Competência Com Nome Vazio

| Campo              | Valor                                                |
| ------------------ | ---------------------------------------------------- |
| Método             | PUT                                                  |
| Endpoint           | /competencies/{id}                                   |
| Payload            | {"name":""}                                          |
| Objetivo           | Validar obrigatoriedade do campo nome na atualização |
| Resultado Esperado | Status 422 e mensagem "name é obrigatório"           |

---

## API-007 - Excluir Competência Existente

| Campo              | Valor                             |
| ------------------ | --------------------------------- |
| Método             | DELETE                            |
| Endpoint           | /competencies/{id}                |
| Objetivo           | Excluir uma competência existente |
| Resultado Esperado | Status 204                        |

---

## API-008 - Excluir Competência Inexistente

| Campo              | Valor                                       |
| ------------------ | ------------------------------------------- |
| Método             | DELETE                                      |
| Endpoint           | /competencies/{id}                          |
| Pré-condição       | Utilizar ID inexistente                     |
| Objetivo           | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "competency_not_found"    |

---

## API-009 - Excluir Competência Vinculada a Ciclo

| Campo              | Valor                                   |
| ------------------ | --------------------------------------- |
| Método             | DELETE                                  |
| Endpoint           | /competencies/{id}                      |
| Pré-condição       | Competência vinculada a um ciclo        |
| Objetivo           | Validar regra de negócio de integridade |
| Resultado Esperado | Status 409 e erro "competency_in_use"   |
