# API - Ciclos

## Objetivo

Validar os endpoints responsáveis pelo gerenciamento dos ciclos de avaliação, garantindo a consistência das configurações, regras de negócio, controle de status e geração automática das avaliações.

---

## API-038 - Listar Ciclos

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /cycles |
| Objetivo | Listar todos os ciclos cadastrados |
| Resultado Esperado | Status 200 e retorno da lista de ciclos |

---

## API-039 - Consultar Ciclo Existente

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /cycles/{id} |
| Objetivo | Consultar um ciclo específico |
| Resultado Esperado | Status 200 e retorno dos dados do ciclo |

---

## API-040 - Consultar Ciclo Inexistente

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /cycles/{id} |
| Pré-condição | Utilizar ID inexistente |
| Objetivo | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "cycle_not_found" |

---

## API-041 - Criar Ciclo Válido

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles |
| Objetivo | Criar ciclo com configuração válida |
| Resultado Esperado | Status 201 e ciclo criado em status Draft |

---

## API-042 - Criar Ciclo Sem Nome

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles |
| Objetivo | Validar obrigatoriedade do nome |
| Resultado Esperado | Status 422 e mensagem "name é obrigatório" |

---

## API-043 - Criar Ciclo Com Data Inicial Maior Que Data Final

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles |
| Objetivo | Validar consistência do período |
| Resultado Esperado | Status 422 e mensagem "start_date deve ser <= end_date" |

---

## API-044 - Criar Ciclo Com Formato De Data Inválido

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles |
| Objetivo | Validar formato das datas |
| Resultado Esperado | Status 422 e erro de validação |

---

## API-045 - Criar Ciclo Com Time Inexistente

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles |
| Objetivo | Validar referência para time inexistente |
| Resultado Esperado | Status 422 e erro "time inexistente" |

---

## API-046 - Criar Ciclo Com Competência Inexistente

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles |
| Objetivo | Validar referência para competência inexistente |
| Resultado Esperado | Status 422 e erro "competência inexistente" |

---

## API-047 - Criar Ciclo Com Pesos Habilitados E Weight Ausente

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles |
| Objetivo | Validar obrigatoriedade dos pesos |
| Resultado Esperado | Status 422 e erro de validação |

---

## API-048 - Atualizar Ciclo Em Draft

| Campo | Valor |
|---------|---------|
| Método | PUT |
| Endpoint | /cycles/{id} |
| Objetivo | Alterar ciclo em rascunho |
| Resultado Esperado | Status 200 e dados atualizados |

---

## API-049 - Atualizar Ciclo Inexistente

| Campo | Valor |
|---------|---------|
| Método | PUT |
| Endpoint | /cycles/{id} |
| Pré-condição | Utilizar ID inexistente |
| Objetivo | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "cycle_not_found" |

---

## API-050 - Atualizar Ciclo Active

| Campo | Valor |
|---------|---------|
| Método | PUT |
| Endpoint | /cycles/{id} |
| Pré-condição | Ciclo em status Active |
| Objetivo | Validar bloqueio de edição |
| Resultado Esperado | Status 409 e erro "cycle_not_draft" |

---

## API-051 - Iniciar Ciclo Válido

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles/{id}/start |
| Objetivo | Iniciar ciclo configurado corretamente |
| Resultado Esperado | Status 200, status Active e avaliações geradas |

---

## API-052 - Iniciar Ciclo Sem Times

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles/{id}/start |
| Pré-condição | Ciclo sem times participantes |
| Objetivo | Validar configuração mínima |
| Resultado Esperado | Status 422 e erro "invalid_cycle_config" |

---

## API-053 - Iniciar Ciclo Sem Competências

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles/{id}/start |
| Pré-condição | Ciclo sem competências |
| Objetivo | Validar configuração mínima |
| Resultado Esperado | Status 422 e erro "invalid_cycle_config" |

---

## API-054 - Iniciar Ciclo Com Soma Dos Pesos Igual A 99

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles/{id}/start |
| Pré-condição | Soma dos pesos diferente de 100 |
| Objetivo | Validar regra de pesos |
| Resultado Esperado | Status 422 e erro "a soma dos pesos deve ser exatamente 100" |

---

## API-055 - Iniciar Ciclo Com Soma Dos Pesos Igual A 101

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles/{id}/start |
| Pré-condição | Soma dos pesos diferente de 100 |
| Objetivo | Validar regra de pesos |
| Resultado Esperado | Status 422 e erro "a soma dos pesos deve ser exatamente 100" |

---

## API-056 - Iniciar Ciclo Já Iniciado

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles/{id}/start |
| Pré-condição | Ciclo em status Active |
| Objetivo | Impedir múltiplas inicializações |
| Resultado Esperado | Status 409 e erro "cycle_already_started" |

---

## API-057 - Encerrar Ciclo Active

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles/{id}/close |
| Objetivo | Encerrar ciclo ativo |
| Resultado Esperado | Status 200 e status Closed |

---

## API-058 - Encerrar Ciclo Não Active

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles/{id}/close |
| Pré-condição | Ciclo em Draft ou Closed |
| Objetivo | Validar bloqueio de encerramento |
| Resultado Esperado | Status 409 e erro "cycle_not_active" |

---

## API-059 - Encerrar Ciclo Inexistente

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /cycles/{id}/close |
| Pré-condição | Utilizar ID inexistente |
| Objetivo | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "cycle_not_found" |