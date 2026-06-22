# Teste Técnico QA - Elofy

## Sobre o Projeto

Este repositório contém a resolução do teste técnico para a vaga de **Analista de Qualidade Pleno** da Elofy.

A entrega contempla os artefatos solicitados no desafio, incluindo documentação de QA, plano de testes de API, coleção Postman e automação de testes utilizando Playwright.

---

## Estrutura da Entrega

```text
.
├── backend/
├── frontend/
├── qa-automation/
├── qa-docs/
├── postman/
└── README.md
```

### Diretórios

| Diretório     | Descrição                                         |
| ------------- | ------------------------------------------------- |
| backend       | API da aplicação fornecida no desafio             |
| frontend      | Interface da aplicação fornecida no desafio       |
| qa-automation | Automação de testes desenvolvida em Playwright    |
| qa-docs       | Documentação de QA solicitada no teste            |
| postman       | Coleção exportada para execução dos testes de API |

---

## Documentação Entregue

A pasta `qa-docs` contém:

* Estratégia de Testes
* Estimativa de Esforço
* Priorização de Testes
* Casos de Teste
* Plano de Testes de API
* Bug Report
* Evidências de Execução

---

## Automação

A automação foi desenvolvida utilizando **Playwright**.

### Cobertura

* Competências
* Times
* Colaboradores
* Ciclos
* Avaliações
* Relatórios

O detalhamento completo da automação está disponível em:

```text
qa-automation/README.md
```

---

## Coleção de API

A coleção Postman exportada encontra-se em:

```text
postman/
```

O fluxo cobre:

1. Criação de Competências
2. Criação de Times
3. Criação de Colaboradores
4. Criação de Ciclos
5. Início de Ciclo
6. Consulta de Avaliações
7. Resposta de Avaliações
8. Consulta de Relatórios

---

## Pré-requisitos

* Node.js 20+
* npm

---

## Instalação

Na raiz do projeto:

```bash
npm install
```

---

## Executando a Aplicação

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

API:

```text
http://localhost:3001/api
```

---

## Executando a Automação

Na raiz do projeto:

```bash
npx playwright test --project=chromium
```

Para visualizar o relatório:

```bash
npx playwright show-report
```

---

## Estratégia de Gestão de Estado

A aplicação utiliza SQLite em memória, portanto os dados são recriados a cada inicialização do servidor.

Para garantir previsibilidade dos resultados:

* Os testes utilizam o cenário inicial fornecido pelo seed da aplicação.
* Os cenários criam dados próprios quando necessário.
* Recomenda-se reiniciar a aplicação antes da execução completa da suíte.
* Os testes foram desenvolvidos para minimizar dependência de ordem de execução.

---

## Ferramentas Utilizadas

* Playwright
* JavaScript
* Postman
* Markdown
* Git / GitHub

---

## Autor

**Edgar Ryan Oliveira dos Santos**

Teste Técnico QA - Elofy
