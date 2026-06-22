# API - Relatórios

## Objetivo

Validar os endpoints responsáveis pela geração dos relatórios gerenciais e resultados das avaliações, garantindo a consistência das informações apresentadas e o correto processamento dos dados do ciclo.

---

## API-078 - Consultar Relatório De Times

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/teams |
| Objetivo | Listar a estrutura hierárquica dos times |
| Resultado Esperado | Status 200 e retorno da árvore de times |

---

## API-079 - Consultar Relatório De Times A Partir De Um Time Específico

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/teams?team_id={id} |
| Objetivo | Retornar a hierarquia de um time específico |
| Resultado Esperado | Status 200 e retorno da subárvore correspondente |

---

## API-080 - Consultar Relatório De Colaboradores

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/employees |
| Objetivo | Listar a cadeia hierárquica de colaboradores |
| Resultado Esperado | Status 200 e retorno da estrutura organizacional |

---

## API-081 - Consultar Relatório De Colaboradores A Partir De Um Colaborador

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/employees?employee_id={id} |
| Objetivo | Retornar a cadeia hierárquica de um colaborador específico |
| Resultado Esperado | Status 200 e retorno da estrutura subordinada |

---

## API-082 - Consultar Relatório Analítico Válido

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/analytical?cycle_id={id} |
| Objetivo | Consultar relatório analítico das avaliações |
| Resultado Esperado | Status 200 e retorno dos dados analíticos do ciclo |

---

## API-083 - Consultar Relatório Analítico Sem Cycle_ID

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/analytical |
| Objetivo | Validar obrigatoriedade do parâmetro cycle_id |
| Resultado Esperado | Status 404 e erro "cycle_not_found" |

---

## API-084 - Consultar Relatório Analítico Com Ciclo Inexistente

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/analytical?cycle_id=9999 |
| Objetivo | Validar tratamento para ciclo inexistente |
| Resultado Esperado | Status 404 e erro "cycle_not_found" |

---

## API-085 - Consultar Relatório Sintético Válido

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/synthetic?cycle_id={id} |
| Objetivo | Consultar relatório sintético das avaliações |
| Resultado Esperado | Status 200 e retorno consolidado do ciclo |

---

## API-086 - Consultar Relatório Sintético Sem Cycle_ID

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/synthetic |
| Objetivo | Validar obrigatoriedade do parâmetro cycle_id |
| Resultado Esperado | Status 404 e erro "cycle_not_found" |

---

## API-087 - Consultar Relatório Sintético Com Ciclo Inexistente

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/synthetic?cycle_id=9999 |
| Objetivo | Validar tratamento para ciclo inexistente |
| Resultado Esperado | Status 404 e erro "cycle_not_found" |

---

## API-088 - Consultar Relatório De Resultados Válido

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/results?cycle_id={id} |
| Objetivo | Consultar resultado final das avaliações |
| Resultado Esperado | Status 200 e retorno dos resultados calculados |

---

## API-089 - Consultar Relatório De Resultados Sem Cycle_ID

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/results |
| Objetivo | Validar obrigatoriedade do parâmetro cycle_id |
| Resultado Esperado | Status 404 e erro "cycle_not_found" |

---

## API-090 - Consultar Relatório De Resultados Com Ciclo Inexistente

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/results?cycle_id=9999 |
| Objetivo | Validar tratamento para ciclo inexistente |
| Resultado Esperado | Status 404 e erro "cycle_not_found" |

---

## API-091 - Validar Consistência Dos Resultados

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/results?cycle_id={id} |
| Objetivo | Validar que as médias apresentadas correspondem às avaliações registradas |
| Resultado Esperado | Valores calculados corretamente |

---

## API-092 - Validar Aplicação Dos Pesos

| Campo | Valor |
|---------|---------|
| Método | GET |
| Endpoint | /reports/evaluations/results?cycle_id={id} |
| Pré-condição | Ciclo configurado com pesos habilitados |
| Objetivo | Garantir que os pesos sejam considerados no cálculo final |
| Resultado Esperado | Média ponderada calculada corretamente |