# Módulo de Avaliação de Desempenho

Aplicação web (SaaS de RH) para gerenciar **competências, times, colaboradores e ciclos de avaliação**. Ao iniciar um ciclo, o sistema gera automaticamente as avaliações (autoavaliação, gestor e pares); os colaboradores respondem dentro do período do ciclo e, ao final, o sistema calcula médias e emite relatórios.

> Esta aplicação é o **ambiente-alvo de um teste técnico de QA**. Ela já sobe populada com um cenário de exemplo (Acme Corp) para que você possa explorá-la e produzir seus artefatos de teste.

---

## 1. Pré-requisitos

- **Node.js ≥ 20** (LTS recomendado; inclui o `npm`). Verifique com `node -v`.
  O projeto traz um arquivo `.nvmrc` (`20`) — quem usa `nvm` pode rodar `nvm use`.
- Nada além disso: **não há banco para instalar, nem Docker, nem serviços de nuvem**. O banco é SQLite **em memória** — é criado e populado a cada inicialização e **zerado** ao desligar o servidor.

> Há uma verificação automática de versão: se o Node for < 20, o `npm install`/`npm run dev` **para com uma mensagem clara** em vez de um erro de compilação.

## 2. Como executar (Windows, macOS e Linux)

Na pasta raiz do projeto:

```bash
npm install     # instala as dependências da raiz, do backend e do frontend
npm run dev     # sobe o backend (porta 3001) e o frontend (porta 5173) juntos
```

Abra **http://localhost:5173** no navegador.

- Frontend (UI): `http://localhost:5173`
- API (backend): `http://localhost:3001/api` (ex.: `http://localhost:3001/api/health`)

Para parar, use `Ctrl + C` no terminal. Ao subir de novo, os dados voltam ao estado inicial do seed.

> Funciona igual no **Windows** (PowerShell ou CMD), macOS e Linux — todos os scripts são multiplataforma.

### Solução de problemas (Windows)

- **`node -v` mostra versão < 20:** instale o Node 20 LTS em https://nodejs.org. Com `nvm`: `nvm install 20 && nvm use 20`.
- **Erro mencionando `better-sqlite3`, `node-gyp`, `Python` ou `Visual Studio`:** isso só acontece com Node < 20. Com Node ≥ 20 o `better-sqlite3` baixa um binário pronto e **não compila nada**. Corrija a versão do Node e rode `npm install` de novo.
- **Porta 3001 ou 5173 ocupada:** feche o processo que a usa ou rode com outra porta (`set PORT=3002 && npm run dev` no backend).

## 3. O que o sistema faz

Navegação lateral com 6 seções:

| Seção | Descrição |
|---|---|
| **Competências** | Cadastro/edição/exclusão de competências. |
| **Times** | Times hierárquicos (árvore com indentação) e seu time superior. |
| **Colaboradores** | Cadastro com time (obrigatório) e gestor (opcional). |
| **Ciclos** | Criação/configuração de ciclos (datas, pesos, times e competências). Botões **Iniciar** e **Encerrar**. |
| **Responder avaliações** | Selecione o "colaborador atual" (sem login) e responda as avaliações pendentes daquele avaliador. |
| **Relatórios** | 5 relatórios: Times, Colaboradores, Avaliações analítico, Avaliações sintético e Resultado. |

### Fluxo principal sugerido

1. Vá em **Ciclos** — o ciclo `Avaliação Q2/2026` já vem em status `draft`.
2. Clique em **iniciar**. O sistema gera as avaliações e o ciclo passa a `active`.
3. Vá em **Responder avaliações**, selecione um colaborador e responda as pendências.
4. Veja os números em **Relatórios**.
5. Volte em **Ciclos** e **encerre** o ciclo quando quiser.

## 4. Cenário de dados já carregado (Acme Corp)

- **Times:** `Tecnologia` (raiz) → `Back-end` e `Front-end`.
- **Competências:** `Comunicação`, `Entrega`, `Colaboração`.
- **Colaboradores:**
  - Back-end: **Ana** (sem gestor), **Bruno** (gestor: Ana), **Carlos** (gestor: Ana).
  - Front-end: **Diana** (sem gestor), **Eduardo** (gestor: Diana).
- **Ciclo:** `Avaliação de Desempenho — Ciclo Atual`, sem pesos, com Back-end e Front-end e as 3 competências, em status `draft`. O **período é relativo à data de hoje** (hoje − 15 dias até hoje + 15 dias), garantindo que o fluxo de resposta funcione assim que você inicia o ciclo, em qualquer data.

## 5. Regras de negócio (resumo)

- **Geração de avaliações** (ao iniciar o ciclo), para cada colaborador dos times participantes:
  - 1 **autoavaliação** (sempre);
  - 1 **avaliação de gestor** (só se tiver gestor);
  - 1 **avaliação de par** para **cada colega do mesmo time direto**, exceto ele mesmo e exceto o gestor.
- **Responder** só é permitido com a **data atual dentro do período** do ciclo (`start_date ≤ hoje ≤ end_date`, inclusive).
- **Notas** são inteiros de **1 a 5**, uma por competência do ciclo.
- **Pesos** (opcional por ciclo): quando ativos, a soma dos pesos deve ser exatamente **100**.

> A tela de resposta usa a **data atual da sua máquina** para liberar/bloquear o envio. Como o ciclo do seed tem janela relativa a hoje, o envio fica liberado por padrão. Para exercitar o **bloqueio por período** (erro `410`), crie um ciclo com datas no passado (ex.: `2020-01-01` a `2020-01-31`).

## 6. Referência rápida da API

Base: `/api`. Respostas em JSON. Erros no formato `{ "error": "codigo", "details": [...] }`.

| Recurso | Rotas |
|---|---|
| Competências | `GET/POST /competencies`, `PUT/DELETE /competencies/:id` |
| Times | `GET/POST /teams`, `PUT/DELETE /teams/:id` |
| Colaboradores | `GET/POST /employees`, `PUT/DELETE /employees/:id` |
| Ciclos | `GET /cycles`, `GET /cycles/:id`, `POST /cycles`, `PUT /cycles/:id` |
| Iniciar/Encerrar | `POST /cycles/:id/start`, `POST /cycles/:id/close` |
| Avaliações | `GET /evaluations?cycle_id=&evaluator_id=&evaluated_id=&status=`, `GET /evaluations/:id`, `POST /evaluations/:id/answer` |
| Relatórios | `GET /reports/teams?team_id=`, `GET /reports/employees?employee_id=`, `GET /reports/evaluations/{analytical,synthetic,results}?cycle_id=` |

Principais códigos de erro: `400 invalid_score`, `403 forbidden`, `409 already_answered` / `cycle_already_started` / `*_in_use`, `410 cycle_expired`, `422 invalid_cycle_config` / `missing_competencies` / validações de cadastro.

## 7. O que se espera que você teste

Explore o sistema livremente e produza seus artefatos de teste (plano, casos, evidências, bugs). Sugestões de áreas a cobrir, **sem se limitar a elas**:

- Cadastros (CRUD) de competências, times e colaboradores, incluindo regras de exclusão e de hierarquia.
- Configuração de ciclos: datas, multiseleção de times/competências e pesos.
- **Geração de avaliações** ao iniciar um ciclo (quem recebe o quê).
- **Resposta de avaliações**: período, validação de notas, identidade do avaliador, reenvio.
- **Relatórios** e o cálculo das médias (com e sem pesos).
- Estados de UI: carregamento, erros vindos da API, listas vazias.

## 8. Estrutura do projeto

```
avaliacao-desempenho/
├── package.json          # scripts + concurrently (raiz)
├── .nvmrc                # versão de Node (20)
├── scripts/
│   └── check-node.mjs    # preflight: aborta com mensagem clara se Node < 20
├── README.md
├── backend/              # Node + Express + better-sqlite3 (:memory:)
│   └── src/
│       ├── server.js
│       ├── db.js         # schema + seed
│       ├── routes/       # competencies, teams, employees, cycles, evaluations, reports
│       └── services/     # geração de avaliações e cálculo de médias
└── frontend/             # React 18 + Vite (proxy /api -> :3001)
    └── src/pages/        # uma página por seção
```

## 9. Stack

- **Backend:** Node.js (≥ 20), Express, `better-sqlite3` em modo `:memory:`.
- **Frontend:** React 18 + Vite (SPA).
- **Orquestração:** `concurrently` (um único `npm run dev` sobe tudo).
