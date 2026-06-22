# API - Avaliações

## Objetivo

Validar os endpoints responsáveis pela consulta e resposta das avaliações, garantindo o cumprimento das regras do ciclo, validação das respostas e integridade do processo avaliativo.

---

## API-060 - Listar Avaliações

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /evaluations |
| Objetivo | Listar todas as avaliações cadastradas |
| Resultado Esperado | Status 200 e retorno da lista de avaliações |

---

## API-061 - Filtrar Avaliações Por Ciclo

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /evaluations?cycle_id={id} |
| Objetivo | Retornar avaliações de um ciclo específico |
| Resultado Esperado | Status 200 e retorno filtrado |

---

## API-062 - Filtrar Avaliações Por Avaliador

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /evaluations?evaluator_id={id} |
| Objetivo | Retornar avaliações de um avaliador específico |
| Resultado Esperado | Status 200 e retorno filtrado |

---

## API-063 - Filtrar Avaliações Por Avaliado

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /evaluations?evaluated_id={id} |
| Objetivo | Retornar avaliações de um colaborador específico |
| Resultado Esperado | Status 200 e retorno filtrado |

---

## API-064 - Filtrar Avaliações Por Status

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /evaluations?status=completed |
| Objetivo | Retornar avaliações conforme status informado |
| Resultado Esperado | Status 200 e retorno filtrado |

---

## API-065 - Consultar Avaliação Existente

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /evaluations/{id} |
| Objetivo | Consultar uma avaliação específica |
| Resultado Esperado | Status 200 e retorno completo da avaliação |

---

## API-066 - Consultar Avaliação Inexistente

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /evaluations/{id} |
| Pré-condição | Utilizar ID inexistente |
| Objetivo | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "evaluation_not_found" |

---

## API-067 - Responder Avaliação Válida

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Objetivo | Responder avaliação com todas as competências obrigatórias |
| Resultado Esperado | Status 200 e avaliação concluída com status Completed |

---

## API-068 - Responder Avaliação Inexistente

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Pré-condição | Utilizar ID inexistente |
| Objetivo | Validar tratamento para recurso inexistente |
| Resultado Esperado | Status 404 e erro "evaluation_not_found" |

---

## API-069 - Responder Avaliação Com Avaliador Incorreto

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Pré-condição | Informar evaluator_id diferente do esperado |
| Objetivo | Garantir que apenas o avaliador correto responda a avaliação |
| Resultado Esperado | Status 403 e erro "forbidden" |

---

## API-070 - Responder Avaliação Já Concluída

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Pré-condição | Avaliação já respondida |
| Objetivo | Impedir respostas duplicadas |
| Resultado Esperado | Status 409 e erro "already_answered" |

---

## API-071 - Responder Avaliação Fora Do Período Do Ciclo

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Pré-condição | Data atual fora do período do ciclo |
| Objetivo | Garantir que avaliações sejam respondidas apenas durante o ciclo |
| Resultado Esperado | Status 410 e erro "cycle_expired" |

---

## API-072 - Responder Avaliação Sem Lista De Respostas

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Payload | {"answers": null} |
| Objetivo | Validar obrigatoriedade da lista de respostas |
| Resultado Esperado | Status 422 e erro "missing_competencies" |

---

## API-073 - Responder Avaliação Sem Todas As Competências

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Pré-condição | Omitir uma ou mais competências obrigatórias |
| Objetivo | Garantir preenchimento completo da avaliação |
| Resultado Esperado | Status 422 e erro "missing_competencies" |

---

## API-074 - Responder Avaliação Com Nota Menor Que 1

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Payload | score = 0 |
| Objetivo | Validar limite inferior da nota |
| Resultado Esperado | Status 400 e erro "invalid_score" |

---

## API-075 - Responder Avaliação Com Nota Maior Que 5

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Payload | score = 6 |
| Objetivo | Validar limite superior da nota |
| Resultado Esperado | Status 400 e erro "invalid_score" |

---

## API-076 - Responder Avaliação Com Nota Não Inteira

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Payload | score = 4.5 |
| Objetivo | Validar que apenas números inteiros sejam aceitos |
| Resultado Esperado | Status 400 e erro "invalid_score" |

---

## API-077 - Validar Alteração De Status Após Resposta

| Campo | Valor |
|---------|---------|
| Método | POST |
| Endpoint | /evaluations/{id}/answer |
| Objetivo | Garantir alteração automática para status Completed |
| Resultado Esperado | Status da avaliação alterado para Completed |