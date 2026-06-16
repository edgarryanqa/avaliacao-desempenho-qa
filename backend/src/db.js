import Database from 'better-sqlite3';

// Banco 100% em memória. Reiniciar o servidor zera e re-semeia os dados.
const db = new Database(':memory:');
db.pragma('foreign_keys = ON');

function createSchema() {
  db.exec(`
    CREATE TABLE competency (
      id   INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE team (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      name           TEXT NOT NULL,
      parent_team_id INTEGER REFERENCES team(id)
    );

    CREATE TABLE employee (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      team_id    INTEGER NOT NULL REFERENCES team(id),
      manager_id INTEGER REFERENCES employee(id)
    );

    CREATE TABLE cycle (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      start_date  TEXT NOT NULL,
      end_date    TEXT NOT NULL,
      use_weights INTEGER NOT NULL DEFAULT 0,
      status      TEXT NOT NULL DEFAULT 'draft'
    );

    CREATE TABLE cycle_team (
      cycle_id INTEGER NOT NULL REFERENCES cycle(id),
      team_id  INTEGER NOT NULL REFERENCES team(id),
      PRIMARY KEY (cycle_id, team_id)
    );

    CREATE TABLE cycle_competency (
      cycle_id      INTEGER NOT NULL REFERENCES cycle(id),
      competency_id INTEGER NOT NULL REFERENCES competency(id),
      weight        INTEGER,
      PRIMARY KEY (cycle_id, competency_id)
    );

    CREATE TABLE evaluation (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      cycle_id     INTEGER NOT NULL REFERENCES cycle(id),
      evaluated_id INTEGER NOT NULL REFERENCES employee(id),
      evaluator_id INTEGER NOT NULL REFERENCES employee(id),
      type         TEXT NOT NULL,
      status       TEXT NOT NULL DEFAULT 'pending'
    );

    CREATE TABLE evaluation_answer (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      evaluation_id INTEGER NOT NULL REFERENCES evaluation(id),
      competency_id INTEGER NOT NULL REFERENCES competency(id),
      score         INTEGER NOT NULL
    );
  `);
}

// Data local (YYYY-MM-DD) deslocada em `days` dias a partir de hoje.
function isoOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Cenário Acme Corp (seção 7 da SPEC).
function seed() {
  // Times
  const insTeam = db.prepare('INSERT INTO team (name, parent_team_id) VALUES (?, ?)');
  const tecnologia = insTeam.run('Tecnologia', null).lastInsertRowid;
  const backend = insTeam.run('Back-end', tecnologia).lastInsertRowid;
  const frontend = insTeam.run('Front-end', tecnologia).lastInsertRowid;

  // Competências
  const insComp = db.prepare('INSERT INTO competency (name) VALUES (?)');
  const comunicacao = insComp.run('Comunicação').lastInsertRowid;
  const entrega = insComp.run('Entrega').lastInsertRowid;
  const colaboracao = insComp.run('Colaboração').lastInsertRowid;

  // Colaboradores
  const insEmp = db.prepare('INSERT INTO employee (name, team_id, manager_id) VALUES (?, ?, ?)');
  const ana = insEmp.run('Ana', backend, null).lastInsertRowid;
  insEmp.run('Bruno', backend, ana);
  insEmp.run('Carlos', backend, ana);
  const diana = insEmp.run('Diana', frontend, null).lastInsertRowid;
  insEmp.run('Eduardo', frontend, diana);

  // Ciclo em draft. A janela é relativa a HOJE (hoje-15 .. hoje+15) para que o
  // fluxo de resposta funcione sempre que o app for iniciado, independente da
  // data do relógio da máquina (melhoria sobre a data fixa da SPEC).
  const cycleId = db
    .prepare(
      `INSERT INTO cycle (name, start_date, end_date, use_weights, status)
       VALUES (?, ?, ?, 0, 'draft')`
    )
    .run('Avaliação de Desempenho — Ciclo Atual', isoOffset(-15), isoOffset(15)).lastInsertRowid;

  const insCycleTeam = db.prepare('INSERT INTO cycle_team (cycle_id, team_id) VALUES (?, ?)');
  insCycleTeam.run(cycleId, backend);
  insCycleTeam.run(cycleId, frontend);

  const insCycleComp = db.prepare(
    'INSERT INTO cycle_competency (cycle_id, competency_id, weight) VALUES (?, ?, ?)'
  );
  insCycleComp.run(cycleId, comunicacao, null);
  insCycleComp.run(cycleId, entrega, null);
  insCycleComp.run(cycleId, colaboracao, null);
}

createSchema();
seed();

export default db;
