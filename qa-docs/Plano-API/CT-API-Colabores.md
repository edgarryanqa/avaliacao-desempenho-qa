# API - Colaboradores

## Objetivo

Validar os endpoints responsáveis pelo gerenciamento dos colaboradores, garantindo a integridade dos relacionamentos com times, gestores e avaliações.

---

## API-023 - Listar Colaboradores

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /employees |
| Objetivo | Listar todos os colaboradores cadastrados |
| Resultado Esperado | Status 200 e retorno da lista de colaboradores |

---

## API-024 - Criar Colaborador Válido

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /employees |
| Payload | {"name":"João Silva","team_id":1} |
| Objetivo | Criar colaborador sem gestor |
| Resultado Esperado | Status 201 e retorno do colaborador criado |

---

## API-025 - Criar Colaborador Com Gestor

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /employees |
| Payload | {"name":"Maria","team_id":1,"manager_id":2} |
| Objetivo | Criar colaborador associado a um gestor |
| Resultado Esperado | Status 201 e relacionamento salvo corretamente |

---

## API-026 - Criar Colaborador Sem Nome

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /employees |
| Payload | {"name":""} |
| Objetivo | Validar obrigatoriedade do nome |
| Resultado Esperado | Status 422 e mensagem "name é obrigatório" |

---

## API-027 - Criar Colaborador Sem Time

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /employees |
| Payload | {"name":"João"} |
| Objetivo | Validar obrigatoriedade do time |
| Resultado Esperado | Status 422 e erro "team_id é obrigatório e deve existir" |

---

## API-028 - Criar Colaborador Com Time Inexistente

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /employees |
| Payload | {"name":"João","team_id":9999} |
| Objetivo | Validar referência para time inexistente |
| Resultado Esperado | Status 422 e erro de validação |

---

## API-029 - Criar Colaborador Com Gestor Inexistente

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /employees |
| Payload | {"name":"João","team_id":1,"manager_id":9999} |
| Objetivo | Validar referência para gestor inexistente |
| Resultado Esperado | Status 422 e erro "manager_id inexistente" |

---

## API-030 - Atualizar Colaborador Existente

| Campo | Valor |
|---------|---------|
| Método | PUT |
| Endpoint | /employees/{id} |
| Payload | {"name":"João Atualizado"} |
| Objetivo | Atualizar informações do colaborador |
| Resultado Esperado | Status 200 e dados atualizados |

---

## API-031 - Atualizar Colaborador Inexistente

| Campo | Valor |
|---------|---------|
| Método | PUT |
| Endpoint | /employees/{id} |
| Pré-condição | Utilizar ID inexistente |
| Objetivo | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "employee_not_found" |

---

## API-032 - Criar Ciclo de Gestão

| Campo | Valor |
|---------|---------|
| Método | PUT |
| Endpoint | /employees/{id} |
| Cenário | Colaborador torna-se gestor de seu próprio gestor |
| Objetivo | Validar prevenção de ciclos na cadeia de gestão |
| Resultado Esperado | Status 422 e erro "manager_cycle" |

---

## API-033 - Definir Auto Gestão

| Campo | Valor |
|---------|---------|
| Método | PUT |
| Endpoint | /employees/{id} |
| Cenário | manager_id igual ao próprio id do colaborador |
| Objetivo | Garantir que um colaborador não possa ser seu próprio gestor |
| Resultado Esperado | Status 422 e erro "manager_cycle" |

---

## API-034 - Excluir Colaborador Existente

| Campo | Valor |
|---------|---------|
| Método | DELETE |
| Endpoint | /employees/{id} |
| Objetivo | Excluir colaborador sem vínculos |
| Resultado Esperado | Status 204 |

---

## API-035 - Excluir Colaborador Inexistente

| Campo | Valor |
|---------|---------|
| Método | DELETE |
| Endpoint | /employees/{id} |
| Pré-condição | Utilizar ID inexistente |
| Objetivo | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "employee_not_found" |

---

## API-036 - Excluir Colaborador Com Subordinados

| Campo | Valor |
|---------|---------|
| Método | DELETE |
| Endpoint | /employees/{id} |
| Pré-condição | Colaborador possui subordinados vinculados |
| Objetivo | Garantir integridade da estrutura hierárquica |
| Resultado Esperado | Status 409 e erro "employee_in_use" |

---

## API-037 - Excluir Colaborador Com Avaliações

| Campo | Valor |
|---------|---------|
| Método | DELETE |
| Endpoint | /employees/{id} |
| Pré-condição | Colaborador possui avaliações vinculadas |
| Objetivo | Garantir integridade dos dados históricos |
| Resultado Esperado | Status 409 e erro "employee_in_use" |