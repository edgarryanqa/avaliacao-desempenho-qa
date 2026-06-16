import { Router } from 'express';
import db from '../db.js';
import { ApiError, handler, today } from '../util.js';

const router = Router();

// Monta a avaliação com dados de ciclo, avaliado, avaliador e (se houver) respostas.
function loadEvaluation(id) {
  const row = db
    .prepare(
      `SELECT ev.id, ev.cycle_id, ev.type, ev.status,
              ev.evaluated_id, evd.name AS evaluated_name,
              ev.evaluator_id, evr.name AS evaluator_name,
              c.name AS cycle_name, c.start_date, c.end_date
         FROM evaluation ev
         JOIN employee evd ON evd.id = ev.evaluated_id
         JOIN employee evr ON evr.id = ev.evaluator_id
         JOIN cycle c      ON c.id = ev.cycle_id
        WHERE ev.id = ?`
    )
    .get(id);
  if (!row) return null;
  row.answers = db
    .prepare(
      `SELECT a.competency_id, comp.name AS competency_name, a.score
         FROM evaluation_answer a
         JOIN competency comp ON comp.id = a.competency_id
        WHERE a.evaluation_id = ?
        ORDER BY a.competency_id`
    )
    .all(id);
  return row;
}

router.get(
  '/',
  handler((req, res) => {
    const { cycle_id, evaluator_id, evaluated_id, status } = req.query;
    const where = [];
    const params = [];
    if (cycle_id) { where.push('ev.cycle_id = ?'); params.push(Number(cycle_id)); }
    if (evaluator_id) { where.push('ev.evaluator_id = ?'); params.push(Number(evaluator_id)); }
    if (evaluated_id) { where.push('ev.evaluated_id = ?'); params.push(Number(evaluated_id)); }
    if (status) { where.push('ev.status = ?'); params.push(String(status)); }
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const rows = db
      .prepare(
        `SELECT ev.id, ev.cycle_id, ev.type, ev.status,
                ev.evaluated_id, evd.name AS evaluated_name,
                ev.evaluator_id, evr.name AS evaluator_name,
                c.name AS cycle_name, c.start_date, c.end_date
           FROM evaluation ev
           JOIN employee evd ON evd.id = ev.evaluated_id
           JOIN employee evr ON evr.id = ev.evaluator_id
           JOIN cycle c      ON c.id = ev.cycle_id
           ${clause}
          ORDER BY ev.id`
      )
      .all(...params);
    res.json(rows);
  })
);

router.get(
  '/:id',
  handler((req, res) => {
    const evaluation = loadEvaluation(Number(req.params.id));
    if (!evaluation) throw new ApiError(404, 'evaluation_not_found');
    res.json(evaluation);
  })
);

router.post(
  '/:id/answer',
  handler((req, res) => {
    const id = Number(req.params.id);
    const evaluation = db.prepare('SELECT * FROM evaluation WHERE id = ?').get(id);
    if (!evaluation) throw new ApiError(404, 'evaluation_not_found');

    const cycle = db.prepare('SELECT * FROM cycle WHERE id = ?').get(evaluation.cycle_id);
    const { evaluator_id, answers } = req.body ?? {};

    // 403 — avaliador não confere.
    if (Number(evaluator_id) !== evaluation.evaluator_id) {
      throw new ApiError(403, 'forbidden', ['evaluator_id não corresponde ao da avaliação']);
    }

    // 409 — já respondida.
    if (evaluation.status === 'completed') {
      throw new ApiError(409, 'already_answered', ['avaliação já respondida']);
    }

    // 410 — fora do período do ciclo (inclusivo nos dois extremos).
    const now = today();
    if (now < cycle.start_date || now > cycle.end_date) {
      throw new ApiError(410, 'cycle_expired', ['fora do período do ciclo']);
    }

    // Competências exigidas: todas as do ciclo.
    const required = db
      .prepare('SELECT competency_id FROM cycle_competency WHERE cycle_id = ?')
      .all(evaluation.cycle_id)
      .map((r) => r.competency_id);

    if (!Array.isArray(answers)) {
      throw new ApiError(422, 'missing_competencies', ['answers deve ser uma lista']);
    }

    const answeredIds = new Set(answers.map((a) => a.competency_id));
    const missing = required.filter((cid) => !answeredIds.has(cid));
    if (missing.length > 0) {
      throw new ApiError(422, 'missing_competencies', [
        `faltam respostas para as competências: ${missing.join(', ')}`,
      ]);
    }

    // 400 — score deve ser inteiro de 1 a 5.
    for (const a of answers) {
      if (!Number.isInteger(a.score) || a.score < 1 || a.score > 5) {
        throw new ApiError(400, 'invalid_score', [
          `score inválido para a competência ${a.competency_id} (deve ser inteiro de 1 a 5)`,
        ]);
      }
    }

    // Grava respostas (apenas as competências do ciclo) e conclui.
    const save = db.transaction(() => {
      const ins = db.prepare(
        'INSERT INTO evaluation_answer (evaluation_id, competency_id, score) VALUES (?, ?, ?)'
      );
      for (const a of answers) {
        if (required.includes(a.competency_id)) ins.run(id, a.competency_id, a.score);
      }
      db.prepare("UPDATE evaluation SET status = 'completed' WHERE id = ?").run(id);
    });
    save();

    res.json({ evaluation_id: id, status: 'completed' });
  })
);

export default router;
