import { Router } from 'express';
import db from '../db.js';
import { ApiError, handler, isValidDate, today } from '../util.js';
import { generateEvaluations } from '../services/generation.js';

const router = Router();

function loadCycle(id) {
  const cycle = db.prepare('SELECT * FROM cycle WHERE id = ?').get(id);
  if (!cycle) return null;
  cycle.team_ids = db
    .prepare('SELECT team_id FROM cycle_team WHERE cycle_id = ? ORDER BY team_id')
    .all(id)
    .map((r) => r.team_id);
  cycle.competencies = db
    .prepare(
      'SELECT competency_id, weight FROM cycle_competency WHERE cycle_id = ? ORDER BY competency_id'
    )
    .all(id);
  return cycle;
}

// Validações compartilhadas entre POST e PUT.
function validateConfig(body) {
  const { name, start_date, end_date, team_ids = [], competencies = [] } = body ?? {};
  const useWeights = body?.use_weights === true || body?.use_weights === 1;

  if (!name || typeof name !== 'string' || !name.trim()) {
    throw new ApiError(422, 'invalid_cycle', ['name é obrigatório']);
  }
  if (!isValidDate(start_date) || !isValidDate(end_date)) {
    throw new ApiError(422, 'invalid_cycle', ['start_date/end_date devem estar em YYYY-MM-DD']);
  }
  if (start_date > end_date) {
    throw new ApiError(422, 'invalid_cycle', ['start_date deve ser <= end_date']);
  }
  if (!Array.isArray(team_ids) || !Array.isArray(competencies)) {
    throw new ApiError(422, 'invalid_cycle', ['team_ids e competencies devem ser listas']);
  }
  for (const tid of team_ids) {
    if (!db.prepare('SELECT id FROM team WHERE id = ?').get(tid)) {
      throw new ApiError(422, 'invalid_cycle', [`time inexistente: ${tid}`]);
    }
  }
  for (const item of competencies) {
    if (!db.prepare('SELECT id FROM competency WHERE id = ?').get(item.competency_id)) {
      throw new ApiError(422, 'invalid_cycle', [`competência inexistente: ${item.competency_id}`]);
    }
    if (useWeights && !Number.isInteger(item.weight)) {
      throw new ApiError(422, 'invalid_cycle', [
        `weight inteiro é obrigatório para a competência ${item.competency_id} quando use_weights = true`,
      ]);
    }
  }
  return { name: name.trim(), start_date, end_date, useWeights, team_ids, competencies };
}

function persistConfig(cycleId, cfg) {
  db.prepare(
    'UPDATE cycle SET name = ?, start_date = ?, end_date = ?, use_weights = ? WHERE id = ?'
  ).run(cfg.name, cfg.start_date, cfg.end_date, cfg.useWeights ? 1 : 0, cycleId);

  db.prepare('DELETE FROM cycle_team WHERE cycle_id = ?').run(cycleId);
  const insTeam = db.prepare('INSERT INTO cycle_team (cycle_id, team_id) VALUES (?, ?)');
  for (const tid of cfg.team_ids) insTeam.run(cycleId, tid);

  db.prepare('DELETE FROM cycle_competency WHERE cycle_id = ?').run(cycleId);
  const insComp = db.prepare(
    'INSERT INTO cycle_competency (cycle_id, competency_id, weight) VALUES (?, ?, ?)'
  );
  for (const item of cfg.competencies) {
    insComp.run(cycleId, item.competency_id, cfg.useWeights ? item.weight : null);
  }
}

router.get(
  '/',
  handler((req, res) => {
    const cycles = db.prepare('SELECT * FROM cycle ORDER BY id').all();
    res.json(cycles.map((c) => loadCycle(c.id)));
  })
);

router.get(
  '/:id',
  handler((req, res) => {
    const cycle = loadCycle(Number(req.params.id));
    if (!cycle) throw new ApiError(404, 'cycle_not_found');
    res.json(cycle);
  })
);

router.post(
  '/',
  handler((req, res) => {
    const cfg = validateConfig(req.body);
    const id = db
      .prepare(
        `INSERT INTO cycle (name, start_date, end_date, use_weights, status)
         VALUES (?, ?, ?, ?, 'draft')`
      )
      .run(cfg.name, cfg.start_date, cfg.end_date, cfg.useWeights ? 1 : 0).lastInsertRowid;
    persistConfig(id, cfg);
    res.status(201).json(loadCycle(id));
  })
);

router.put(
  '/:id',
  handler((req, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM cycle WHERE id = ?').get(id);
    if (!existing) throw new ApiError(404, 'cycle_not_found');
    if (existing.status !== 'draft') {
      throw new ApiError(409, 'cycle_not_draft', ['edição só é permitida em ciclos draft']);
    }
    const cfg = validateConfig(req.body);
    persistConfig(id, cfg);
    res.json(loadCycle(id));
  })
);

router.post(
  '/:id/start',
  handler((req, res) => {
    const id = Number(req.params.id);
    const cycle = loadCycle(id);
    if (!cycle) throw new ApiError(404, 'cycle_not_found');
    if (cycle.status !== 'draft') {
      throw new ApiError(409, 'cycle_already_started', ['ciclo não está em draft']);
    }

    // Configuração mínima: ao menos 1 time e 1 competência.
    if (cycle.team_ids.length < 1 || cycle.competencies.length < 1) {
      throw new ApiError(422, 'invalid_cycle_config', [
        'ciclo precisa de ao menos 1 time e 1 competência',
      ]);
    }

    // Regra de pesos: soma deve ser exatamente 100.
    if (cycle.use_weights === 1) {
      const sum = cycle.competencies.reduce((s, c) => s + (c.weight ?? 0), 0);
      if (cycle.competencies.some((c) => !Number.isInteger(c.weight)) || sum !== 100) {
        throw new ApiError(422, 'invalid_cycle_config', ['a soma dos pesos deve ser exatamente 100']);
      }
    }

    const generated = generateEvaluations(id);
    db.prepare("UPDATE cycle SET status = 'active' WHERE id = ?").run(id);

    res.json({
      cycle_id: id,
      status: 'active',
      evaluations_generated: generated,
      started_at: today(),
    });
  })
);

router.post(
  '/:id/close',
  handler((req, res) => {
    const id = Number(req.params.id);
    const cycle = db.prepare('SELECT * FROM cycle WHERE id = ?').get(id);
    if (!cycle) throw new ApiError(404, 'cycle_not_found');
    if (cycle.status !== 'active') {
      throw new ApiError(409, 'cycle_not_active', ['só é possível encerrar um ciclo active']);
    }
    db.prepare("UPDATE cycle SET status = 'closed' WHERE id = ?").run(id);
    res.json({ cycle_id: id, status: 'closed' });
  })
);

export default router;
