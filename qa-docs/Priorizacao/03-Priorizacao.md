# 3 Priorização dos Testes

## Objetivo

O objetivo desta priorização é direcionar os esforços de teste para as funcionalidades que apresentam maior impacto para o negócio e maior risco operacional em caso de falha.

A classificação foi realizada considerando os seguintes critérios:

* Impacto para o negócio;
* Complexidade das regras de negócio;
* Dependência entre funcionalidades;
* Impacto na experiência do usuário;
* Probabilidade de ocorrência de falhas.

---

# Critérios de Priorização

## Prioridade Alta

Funcionalidades que impedem a execução do fluxo principal da aplicação ou comprometem diretamente a confiabilidade dos resultados apresentados.

## Prioridade Média

Funcionalidades importantes para o funcionamento do sistema, mas que não impedem completamente a execução do fluxo principal.

## Prioridade Baixa

Funcionalidades com menor impacto operacional e que não comprometem diretamente a finalidade principal do produto.

---

# Matriz de Priorização

| Funcionalidade                        | Prioridade | Justificativa                                                                                          |
| ------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| Ciclos                                | Alta       | Responsável pela configuração do processo de avaliação. Falhas podem impedir a geração das avaliações. |
| Geração de Avaliações                 | Alta       | Funcionalidade central do produto. Erros impactam diretamente todos os participantes do ciclo.         |
| Resposta das Avaliações               | Alta       | Permite a coleta dos dados utilizados para cálculo dos resultados.                                     |
| Relatórios                            | Alta       | Consolidam todas as informações do processo e servem de apoio para tomada de decisão.                  |
| Colaboradores                         | Média      | Impactam a geração das avaliações, mas possuem regras menos complexas.                                 |
| Times                                 | Média      | Influenciam a composição dos participantes dos ciclos.                                                 |
| Competências                          | Média      | São fundamentais para as avaliações, porém possuem regras simples de cadastro.                         |
| Ajustes visuais e textos da interface | Baixa      | Não comprometem a execução do fluxo principal do sistema.                                              |

---

# Justificativa da Priorização

## Prioridade Alta

As funcionalidades relacionadas a Ciclos, Avaliações e Relatórios receberam prioridade máxima por concentrarem as principais regras de negócio da aplicação.

Uma falha na criação ou ativação de um ciclo pode impedir completamente a execução do processo de avaliação.

Da mesma forma, inconsistências na geração das avaliações ou no cálculo dos resultados podem produzir informações incorretas nos relatórios finais, comprometendo a confiabilidade do sistema.

---

## Prioridade Média

As funcionalidades de Competências, Times e Colaboradores foram classificadas como prioridade média por serem dependências importantes do fluxo principal.

Embora erros nessas áreas possam impactar etapas posteriores, normalmente são identificados durante a configuração do processo e possuem menor complexidade operacional quando comparados às funcionalidades centrais.

---

## Prioridade Baixa

Itens relacionados à apresentação visual, textos informativos e melhorias de usabilidade possuem menor impacto para o objetivo principal da aplicação.

Esses itens podem afetar a experiência do usuário, porém não comprometem diretamente a execução do processo de avaliação de desempenho.

---

# Estratégia de Execução

Considerando um cenário com restrição de tempo, a ordem de execução dos testes seria:

1. Ciclos
2. Geração de Avaliações
3. Resposta das Avaliações
4. Relatórios
5. Colaboradores
6. Times
7. Competências

Essa abordagem garante que os fluxos mais críticos sejam validados primeiro, reduzindo o risco de defeitos relevantes chegarem às etapas finais do processo.
