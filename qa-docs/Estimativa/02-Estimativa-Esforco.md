# 2 Estimativa de Esforço

## Objetivo

O objetivo desta estimativa é apresentar o esforço necessário para analisar, planejar, executar e documentar os testes do módulo de Avaliação de Desempenho.

A estimativa foi realizada com base na exploração da aplicação, nas funcionalidades disponibilizadas no desafio e considerando um único profissional de QA executando todas as atividades.

---

# Premissas Utilizadas

Para elaboração desta estimativa foram consideradas as seguintes premissas:

* Ambiente disponibilizado funcionando corretamente;
* Dados iniciais (seed) carregados conforme documentação;
* Escopo limitado ao módulo de Avaliação de Desempenho;
* Ausência de dependências externas para execução dos testes;
* Automação contemplando apenas os fluxos mais críticos do sistema.

---

# Critérios de Estimativa

A estimativa foi baseada na complexidade funcional de cada módulo, volume esperado de cenários de teste e risco associado ao negócio.

Os módulos responsáveis pela geração das avaliações, cálculo dos resultados e emissão dos relatórios receberam maior esforço devido ao impacto que possuem no processo de avaliação de desempenho.

---

# Estimativa por Atividade

| Atividade                                                 | Esforço |
| --------------------------------------------------------- | ------: |
| Análise da aplicação e entendimento das regras de negócio |      3h |
| Elaboração da estratégia de testes                        |      2h |
| Levantamento de riscos e ambiguidades                     |      1h |
| Criação dos casos de teste                                |      5h |
| Planejamento e execução dos testes de API                 |      3h |
| Execução dos testes funcionais                            |      4h |
| Registro de defeitos encontrados                          |      1h |
| Desenvolvimento da automação dos fluxos críticos          |      6h |
| Documentação e consolidação das evidências                |      2h |

**Total estimado: 27 horas**

---

# Estimativa por Funcionalidade

| Funcionalidade | Complexidade | Esforço |
| -------------- | ------------ | ------: |
| Competências   | Baixa        |      1h |
| Times          | Média        |      2h |
| Colaboradores  | Média        |      2h |
| Ciclos         | Alta         |      4h |
| Avaliações     | Alta         |      5h |
| Relatórios     | Alta         |      4h |

---

# Justificativa da Distribuição

## Competências

Possui regras simples de cadastro e associação aos ciclos, apresentando baixo risco técnico e baixo volume de validações.

## Times

Exige validação da estrutura hierárquica e dos relacionamentos entre os registros.

## Colaboradores

Possui dependências com times e gestores, impactando diretamente a geração das avaliações.

## Ciclos

Concentra diversas regras de negócio, incluindo período, participantes, competências e configuração de pesos.

## Avaliações

Representa o núcleo do produto, sendo responsável pela geração automática das avaliações e pelo processo de resposta.

## Relatórios

Consolidam todas as informações geradas durante o ciclo. Qualquer erro nas etapas anteriores pode ser refletido nesta funcionalidade.

---

# Riscos que Podem Impactar a Estimativa

* Descoberta de regras de negócio não documentadas;
* Necessidade de investigação de defeitos encontrados;
* Alterações de comportamento identificadas durante a exploração;
* Ajustes adicionais na automação;
* Dependências entre funcionalidades que exijam reexecução de testes.

---

# Conclusão

A estimativa apresentada busca equilibrar cobertura funcional, profundidade de validação e prazo disponível para execução do exercício. O maior esforço foi direcionado para as funcionalidades de Ciclos, Avaliações e Relatórios por representarem os componentes de maior impacto para o negócio e concentrarem as principais regras de negócio da aplicação.
