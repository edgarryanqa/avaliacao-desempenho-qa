# API - Times

## Objetivo

Validar os endpoints responsáveis pelo gerenciamento dos times, garantindo a integridade da hierarquia organizacional, a consistência dos relacionamentos e o correto tratamento das regras de negócio.

---

## API-010 - Listar Times

| Campo              | Valor                                  |
| ------------------ | -------------------------------------- |
| Método             | GET                                    |
| Endpoint           | /teams                                 |
| Objetivo           | Listar todos os times cadastrados      |
| Resultado Esperado | Status 200 e retorno da lista de times |

---

## API-011 - Criar Time Raiz

| Campo              | Valor                               |
| ------------------ | ----------------------------------- |
| Método             | POST                                |
| Endpoint           | /teams                              |
| Payload            | {"name":"Tecnologia"}               |
| Objetivo           | Criar um time sem time superior     |
| Resultado Esperado | Status 201 e retorno do time criado |

---

## API-012 - Criar Time Filho

| Campo              | Valor                                          |
| ------------------ | ---------------------------------------------- |
| Método             | POST                                           |
| Endpoint           | /teams                                         |
| Payload            | {"name":"QA","parent_team_id":1}               |
| Objetivo           | Criar um time associado a um time superior     |
| Resultado Esperado | Status 201 e relacionamento salvo corretamente |

---

## API-013 - Criar Time Sem Nome

| Campo              | Valor                                      |
| ------------------ | ------------------------------------------ |
| Método             | POST                                       |
| Endpoint           | /teams                                     |
| Payload            | {"name":""}                                |
| Objetivo           | Validar obrigatoriedade do nome            |
| Resultado Esperado | Status 422 e mensagem "name é obrigatório" |

---

## API-014 - Criar Time Com Parent Inexistente

| Campo              | Valor                                             |
| ------------------ | ------------------------------------------------- |
| Método             | POST                                              |
| Endpoint           | /teams                                            |
| Payload            | {"name":"QA","parent_team_id":9999}               |
| Objetivo           | Validar referência para time superior inexistente |
| Resultado Esperado | Status 422 e erro "parent_team_id inexistente"    |

---

## API-015 - Atualizar Time Existente

| Campo              | Valor                             |
| ------------------ | --------------------------------- |
| Método             | PUT                               |
| Endpoint           | /teams/{id}                       |
| Payload            | {"name":"Tecnologia Corporativa"} |
| Objetivo           | Atualizar informações do time     |
| Resultado Esperado | Status 200 e dados atualizados    |

---

## API-016 - Atualizar Time Inexistente

| Campo              | Valor                                       |
| ------------------ | ------------------------------------------- |
| Método             | PUT                                         |
| Endpoint           | /teams/{id}                                 |
| Pré-condição       | Utilizar ID inexistente                     |
| Objetivo           | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "team_not_found"          |

---

## API-017 - Atualizar Time Com Nome Vazio

| Campo              | Valor                                      |
| ------------------ | ------------------------------------------ |
| Método             | PUT                                        |
| Endpoint           | /teams/{id}                                |
| Payload            | {"name":""}                                |
| Objetivo           | Validar obrigatoriedade do nome            |
| Resultado Esperado | Status 422 e mensagem "name é obrigatório" |

---

## API-018 - Criar Ciclo Hierárquico

| Campo              | Valor                                                    |
| ------------------ | -------------------------------------------------------- |
| Método             | PUT                                                      |
| Endpoint           | /teams/{id}                                              |
| Cenário            | Tornar um time filho de um de seus próprios descendentes |
| Objetivo           | Validar prevenção de ciclos na hierarquia                |
| Resultado Esperado | Status 422 e erro "team_hierarchy_cycle"                 |

---

## API-019 - Excluir Time Existente

| Campo              | Valor                        |
| ------------------ | ---------------------------- |
| Método             | DELETE                       |
| Endpoint           | /teams/{id}                  |
| Objetivo           | Excluir um time sem vínculos |
| Resultado Esperado | Status 204                   |

---

## API-020 - Excluir Time Inexistente

| Campo              | Valor                                       |
| ------------------ | ------------------------------------------- |
| Método             | DELETE                                      |
| Endpoint           | /teams/{id}                                 |
| Pré-condição       | Utilizar ID inexistente                     |
| Objetivo           | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "team_not_found"          |

---

## API-021 - Excluir Time Com Filhos

| Campo              | Valor                             |
| ------------------ | --------------------------------- |
| Método             | DELETE                            |
| Endpoint           | /teams/{id}                       |
| Pré-condição       | Time possui times subordinados    |
| Objetivo           | Validar integridade da hierarquia |
| Resultado Esperado | Status 409 e erro "team_in_use"   |

---

## API-022 - Excluir Time Com Colaboradores

| Campo              | Valor                                |
| ------------------ | ------------------------------------ |
| Método             | DELETE                               |
| Endpoint           | /teams/{id}                          |
| Pré-condição       | Time possui colaboradores vinculados |
| Objetivo           | Validar integridade referencial      |
| Resultado Esperado | Status 409 e erro "team_in_use"      |
