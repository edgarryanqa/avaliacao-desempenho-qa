## 1 Estratégia e Escopo de Testes

## Objetivo

O objetivo desta estratégia é garantir a qualidade do módulo de Avaliação de Desempenho, validando que as regras de negócio sejam executadas corretamente desde a configuração do ciclo até a geração dos relatórios finais.

Os testes serão direcionados para assegurar que:

* Os ciclos sejam configurados corretamente;
* As avaliações sejam geradas conforme as regras definidas;
* Os avaliadores corretos sejam associados aos colaboradores corretos;
* As respostas respeitem as regras de período e validação;
* Os cálculos de médias sejam consistentes;
* Os relatórios apresentem informações confiáveis para apoio à tomada de decisão.

Considerando que os relatórios finais podem ser utilizados para avaliações de desempenho dos colaboradores, qualquer inconsistência na geração das avaliações ou no cálculo das médias pode impactar diretamente a confiabilidade do processo de avaliação da organização.

---

# Estratégia de Testes

Após a exploração da aplicação foi identificado que o fluxo principal do produto está concentrado na execução de um ciclo de avaliação de desempenho, envolvendo a configuração do ciclo, geração automática das avaliações, preenchimento das respostas e emissão dos relatórios finais.

Dessa forma, a estratégia adotada foi baseada em risco de negócio, priorizando funcionalidades que impactam diretamente os resultados gerados pelo sistema.

O fluxo considerado crítico é:

Competências → Times → Colaboradores → Criação do Ciclo → Início do Ciclo → Geração das Avaliações → Resposta das Avaliações → Relatórios

Uma falha em qualquer uma dessas etapas pode comprometer a integridade do processo de avaliação de desempenho e gerar informações incorretas para gestores e colaboradores.

Por esse motivo, os testes serão concentrados principalmente nas funcionalidades relacionadas à geração automática das avaliações, validação das regras de período, cálculo das médias e geração dos relatórios.

---

# Escopo dos Testes

## Competências

### Objetivo

Validar que as competências possam ser cadastradas e utilizadas corretamente nos ciclos de avaliação.

### Validações previstas

* Cadastro de competência;
* Edição de competência;
* Exclusão de competência;
* Validação de campo obrigatório;
* Associação das competências aos ciclos.

### Risco mitigado

Competências incorretas ou ausentes podem comprometer todas as avaliações geradas posteriormente.

---

## Times

### Objetivo

Garantir que a estrutura hierárquica organizacional seja configurada corretamente.

### Validações previstas

* Criação de times;
* Associação de time superior;
* Hierarquia com múltiplos níveis;
* Integridade dos relacionamentos entre times.

### Risco mitigado

Estruturas hierárquicas incorretas podem afetar a seleção dos participantes dos ciclos e comprometer a geração das avaliações.

---

## Colaboradores

### Objetivo

Garantir a correta associação entre colaboradores, times e gestores.

### Validações previstas

* Cadastro de colaborador;
* Associação ao time;
* Associação ao gestor;
* Colaborador sem gestor;
* Integridade dos relacionamentos.

### Risco mitigado

Erros nessa configuração podem gerar avaliações incorretas ou impedir a geração de avaliações do gestor direto.

---

## Ciclos

### Objetivo

Validar a configuração do processo de avaliação.

### Validações previstas

* Criação de ciclo;
* Edição de ciclo em status Draft;
* Restrição de edição após ativação;
* Seleção de competências;
* Seleção de times participantes;
* Configuração de pesos;
* Alteração de status do ciclo.

### Risco mitigado

Falhas na configuração do ciclo podem inviabilizar a geração correta das avaliações ou impactar os resultados finais.

---

## Avaliações

### Objetivo

Validar a geração automática das avaliações e o processo de resposta.

### Validações previstas

* Autoavaliação;
* Avaliação do gestor;
* Avaliação entre pares;
* Restrições de período;
* Validação das notas;
* Integridade dos relacionamentos entre avaliador e avaliado.

### Risco mitigado

Esta é a funcionalidade central do produto. Falhas nessa etapa comprometem diretamente os resultados apresentados nos relatórios.

---

## Relatórios

### Objetivo

Garantir que os resultados apresentados reflitam corretamente os dados respondidos durante o ciclo.

### Validações previstas

* Relatório Analítico;
* Relatório Sintético;
* Relatório de Resultado;
* Consistência das médias;
* Consistência da aplicação dos pesos.

### Risco mitigado

Relatórios incorretos podem levar gestores a tomar decisões baseadas em informações inconsistentes.

---

# Níveis de Teste

## Testes de Interface (Frontend)

Serão realizados testes através da interface da aplicação para validar a experiência do usuário e a correta execução dos fluxos de negócio.

### Principais verificações

* Navegação entre telas;
* Validação de formulários;
* Mensagens de erro;
* Mudanças de estado;
* Apresentação dos dados;
* Fluxos completos do usuário.

### Justificativa

A maior parte da interação dos usuários ocorre através da interface, tornando essencial a validação dos fluxos disponíveis.

---

## Testes de API

Serão realizados testes diretamente nos endpoints disponibilizados pela aplicação.

### Principais verificações

* Status HTTP;
* Estrutura das respostas;
* Integridade dos dados;
* Regras de negócio;
* Tratamento de erros.

### Justificativa

A API é responsável por sustentar toda a lógica de negócio da aplicação. Problemas nessa camada podem impactar simultaneamente todas as interfaces consumidoras.

---

# Tipos de Teste

## Testes Funcionais

Objetivo: validar que o sistema execute corretamente as regras de negócio definidas.

Exemplos:

* Criar ciclo;
* Iniciar ciclo;
* Gerar avaliações;
* Responder avaliações;
* Gerar relatórios.

---

## Testes Negativos

Objetivo: validar o tratamento adequado de entradas inválidas ou cenários não permitidos.

Exemplos:

* Nota fora do intervalo permitido;
* Ciclo sem competências;
* Ciclo sem times;
* Soma de pesos diferente de 100.

---

## Testes de Borda

Objetivo: validar comportamentos próximos aos limites das regras definidas.

Exemplos:

* Soma dos pesos igual a 99;
* Soma dos pesos igual a 101;
* Primeiro dia do ciclo;
* Último dia do ciclo;
* Colaborador sem gestor.

---

## Testes End-to-End

Objetivo: validar o fluxo completo do negócio sob a perspectiva do usuário.

Fluxo validado:

Criar Ciclo → Iniciar Ciclo → Gerar Avaliações → Responder Avaliações → Consultar Relatórios

### Justificativa

Permite validar a integração entre todas as funcionalidades envolvidas no processo principal do produto.

---

# Itens Fora de Escopo

## Testes de Performance e Carga

### Justificativa

O exercício não apresenta requisitos de volume, concorrência ou metas de desempenho que permitam uma avaliação adequada deste aspecto.

---

## Testes de Segurança

### Justificativa

Não foram identificados requisitos relacionados à autenticação, autorização ou proteção de dados no escopo disponibilizado.

---

## Compatibilidade entre Navegadores

### Justificativa

O desafio não estabelece requisitos específicos de suporte a navegadores ou plataformas.

---

## Testes de Acessibilidade

### Justificativa

Apesar de sua importância para produtos corporativos, não foi identificado como requisito do exercício e sua avaliação demandaria critérios específicos não fornecidos.

---

# Conclusão

A estratégia proposta concentra esforços nas funcionalidades que apresentam maior impacto para o negócio, priorizando a confiabilidade da geração das avaliações, dos cálculos realizados pelo sistema e dos relatórios emitidos ao final do ciclo. Dessa forma, busca-se maximizar a cobertura dos riscos mais relevantes dentro do escopo disponibilizado para o exercício técnico.
