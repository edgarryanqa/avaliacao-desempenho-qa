# QA Automation

## Objetivo

Este diretório contém a automação de testes da aplicação de Avaliação de Desempenho, com foco nos principais fluxos de API e interface que a empresa solicitou.

O conjunto de testes cobre os módulos de:
- Competências
- Times
- Colaboradores
- Ciclos
- Avaliações
- Relatórios

## Estrutura do diretório

- ixtures/ : dados compartilhados e valores usados pelos testes.
- pages/ : Page Objects que abstraem a interação com a interface.
- 	ests/ : casos de teste Playwright.
- playwright.config.js : configuração do Playwright.
- 	est-results/ : resultados e relatórios gerados pelas execuções.

> Observação: o projeto usa o package.json raiz em c:\projeto_entrevista\avaliacao-desempenho para instalar dependências e executar os testes.

## Pré-requisitos

- Node.js 20+ (conforme especificado em package.json raiz)
- npm
- A aplicação deve estar rodando para testes de interface (frontend/backend)

## Instalação

No diretório raiz do projeto:

`powershell
npm install
`

Isso instalará o @playwright/test e demais dependências necessárias.

## Executando os testes

### 1. Executar todos os testes Playwright

No diretório raiz do projeto:

`powershell
npx playwright test --project=chromium
`

### 2. Executar um arquivo específico

`powershell
npx playwright test qa-automation/tests/SeuArquivo.spec.js
`

### 3. Gerar relatório HTML

O Playwright já gera relatórios em qa-automation/test-results/ quando a execução é feita com o comando padrão.

Para abrir o relatório após a execução:

`powershell
npx playwright show-report qa-automation/test-results
`

## Cobertura de testes solicitada pela empresa

A automação foi planejada para validar:

- CRUD de competências e validações negativas (nome vazio, exclusão em uso, atualização inválida).
- CRUD de times e hierarquia organizacional (time raiz, time filho, ciclo hierárquico, exclusão com vínculos).
- CRUD de colaboradores, incluindo gestor e validações de associação (time inexistente, gestor inválido, exclusão com subordinados/avaliações).
- Gestão de ciclos de avaliação, incluindo criação, ativação, regras de datas, validação de pesos, bloqueio de edição e encerramento.
- Geração e resposta de avaliações, incluindo autoavaliação, gestor, pares, validações de notas e regras de período.
- Relatórios analíticos, sintéticos e de resultados, incluindo parâmetros obrigatórios, ciclo inexistente, consistência de dados e aplicação de pesos.

## Mapeamento com o plano de testes

Os casos de API planejados pela empresa estão documentados em:
- qa-docs/Plano-API/CT-API-Competencias.md
- qa-docs/Plano-API/CT-API-Times.md
- qa-docs/Plano-API/CT-API-Colabores.md
- qa-docs/Plano-API/CT-API-Ciclos.md
- qa-docs/Plano-API/CT-API-Avaliações.md
- qa-docs/Plano-API/CT-Relatorios.md

A automação busca dar cobertura aos fluxos principais e aos cenários de borda definidos nesses arquivos.

## Passos recomendados para validação

1. Iniciar o backend:
   `powershell
   npm run dev --workspace backend
   `
2. Iniciar o frontend:
   `powershell
   npm run dev --workspace frontend
   `
3. Executar os testes Playwright na raiz:
   `powershell
   npx playwright test --project=chromium
   `

## Observações finais

- Caso queira rodar apenas os testes de API, selecione os testes que focam nos endpoints.
- Caso queira rodar apenas os testes de interface, utilize os arquivos que dependem dos Page Objects em qa-automation/pages/.
- Mantenha o aplicativo rodando para os testes de interface funcionarem corretamente.
