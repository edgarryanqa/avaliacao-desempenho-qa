import db from '../db.js';

// Arredonda para 2 casas, mantendo null quando não há dados.
export function round2(value) {
  if (value == null || Number.isNaN(value)) return null;
  return Math.round(value * 100) / 100;
}

// Competências do ciclo, com peso (quando use_weights = 1).
export function cycleCompetencies(cycleId) {
  return db
    .prepare(
      `SELECT cc.competency_id AS id, c.name, cc.weight
         FROM cycle_competency cc
         JOIN competency c ON c.id = cc.competency_id
        WHERE cc.cycle_id = ?
        ORDER BY cc.competency_id`
    )
    .all(cycleId);
}

// Notas registradas (apenas avaliações completed) do ciclo.
// Cada linha: evaluated_id, evaluator_id, type, competency_id, score.
function answeredScores(cycleId) {
  return db
    .prepare(
      `SELECT e.evaluated_id, e.evaluator_id, e.type, a.competency_id, a.score
         FROM evaluation e
         JOIN evaluation_answer a ON a.evaluation_id = e.id
        WHERE e.cycle_id = ?
          AND e.status = 'completed'`
    )
    .all(cycleId);
}

// Média por competência por tipo de avaliador, para cada avaliado (seção 4.7).
// Retorna: { evaluated_id: { type: { competency_id: avg } } }
function averagesByCompetencyAndType(cycleId) {
  const rows = answeredScores(cycleId);
  const acc = {};
  for (const r of rows) {
    acc[r.evaluated_id] ??= {};
    acc[r.evaluated_id][r.type] ??= {};
    acc[r.evaluated_id][r.type][r.competency_id] ??= { sum: 0, n: 0 };
    const bucket = acc[r.evaluated_id][r.type][r.competency_id];
    bucket.sum += r.score;
    bucket.n += 1;
  }
  const out = {};
  for (const [evaluated, types] of Object.entries(acc)) {
    out[evaluated] = {};
    for (const [type, comps] of Object.entries(types)) {
      out[evaluated][type] = {};
      for (const [compId, { sum, n }] of Object.entries(comps)) {
        out[evaluated][type][compId] = sum / n;
      }
    }
  }
  return out;
}

// Combina as médias por competência num número único, simples ou ponderado.
function combine(perCompetency, competencies, useWeights) {
  const entries = Object.entries(perCompetency);
  if (entries.length === 0) return null;

  if (useWeights) {
    let total = 0;
    for (const comp of competencies) {
      const avg = perCompetency[comp.id];
      if (avg == null) continue;
      total += avg * (comp.weight / 100);
    }
    return total;
  }

  const sum = entries.reduce((s, [, avg]) => s + avg, 0);
  return sum / entries.length;
}

// Relatório sintético: média por competência por colaborador avaliado.
export function syntheticReport(cycleId) {
  const competencies = cycleCompetencies(cycleId);
  const byType = averagesByCompetencyAndType(cycleId);
  const rows = answeredScores(cycleId);

  // Média por competência considerando TODAS as avaliações (todos os tipos).
  const acc = {};
  for (const r of rows) {
    acc[r.evaluated_id] ??= {};
    acc[r.evaluated_id][r.competency_id] ??= { sum: 0, n: 0 };
    acc[r.evaluated_id][r.competency_id].sum += r.score;
    acc[r.evaluated_id][r.competency_id].n += 1;
  }

  const employees = db
    .prepare(
      `SELECT DISTINCT e.evaluated_id AS id, emp.name
         FROM evaluation e
         JOIN employee emp ON emp.id = e.evaluated_id
        WHERE e.cycle_id = ?
        ORDER BY emp.name`
    )
    .all(cycleId);

  return employees.map((emp) => ({
    evaluated_id: emp.id,
    evaluated_name: emp.name,
    competencies: competencies.map((c) => {
      const bucket = acc[emp.id]?.[c.id];
      return {
        competency_id: c.id,
        competency_name: c.name,
        average: bucket ? round2(bucket.sum / bucket.n) : null,
      };
    }),
  }));
}

// Relatório de resultado: por colaborador, média de auto, gestor e equipe (pares).
export function resultsReport(cycleId) {
  const cycle = db.prepare('SELECT use_weights FROM cycle WHERE id = ?').get(cycleId);
  const useWeights = cycle ? cycle.use_weights === 1 : false;
  const competencies = cycleCompetencies(cycleId);
  const byType = averagesByCompetencyAndType(cycleId);

  const employees = db
    .prepare(
      `SELECT DISTINCT e.evaluated_id AS id, emp.name
         FROM evaluation e
         JOIN employee emp ON emp.id = e.evaluated_id
        WHERE e.cycle_id = ?
        ORDER BY emp.name`
    )
    .all(cycleId);

  return employees.map((emp) => {
    const types = byType[emp.id] ?? {};
    return {
      evaluated_id: emp.id,
      evaluated_name: emp.name,
      self_average: round2(combine(types.self ?? {}, competencies, useWeights)),
      manager_average: round2(combine(types.manager ?? {}, competencies, useWeights)),
      team_average: round2(combine(types.peer ?? {}, competencies, useWeights)),
    };
  });
}

// Relatório analítico: uma linha por (avaliação × competência) respondida.
export function analyticalReport(cycleId) {
  return db
    .prepare(
      `SELECT c.id            AS cycle_id,
              c.name          AS cycle_name,
              c.start_date,
              c.end_date,
              ev.id           AS evaluation_id,
              ev.type,
              evd.id          AS evaluated_id,
              evd.name        AS evaluated_name,
              evr.id          AS evaluator_id,
              evr.name        AS evaluator_name,
              comp.id         AS competency_id,
              comp.name       AS competency_name,
              a.score,
              cc.weight
         FROM evaluation ev
         JOIN cycle c            ON c.id = ev.cycle_id
         JOIN employee evd       ON evd.id = ev.evaluated_id
         JOIN employee evr       ON evr.id = ev.evaluator_id
         JOIN evaluation_answer a ON a.evaluation_id = ev.id
         JOIN competency comp     ON comp.id = a.competency_id
         LEFT JOIN cycle_competency cc
                ON cc.cycle_id = ev.cycle_id AND cc.competency_id = a.competency_id
        WHERE ev.cycle_id = ?
        ORDER BY evd.name, ev.type, evr.name, comp.id`
    )
    .all(cycleId);
}
