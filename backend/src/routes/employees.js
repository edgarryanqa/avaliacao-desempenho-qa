import { Router } from 'express';
import db from '../db.js';
import { ApiError, handler } from '../util.js';

const router = Router();

// Impede auto-gestão e ciclo na cadeia de gestão.
function wouldCreateManagerCycle(employeeId, managerId) {
  if (managerId == null) return false;
  if (managerId === employeeId) return true;
  let current = managerId;
  const seen = new Set();
  while (current != null) {
    if (current === employeeId) return true;
    if (seen.has(current)) break;
    seen.add(current);
    const row = db.prepare('SELECT manager_id FROM employee WHERE id = ?').get(current);
    current = row ? row.manager_id : null;
  }
  return false;
}

router.get(
  '/',
  handler((req, res) => {
    res.json(db.prepare('SELECT * FROM employee ORDER BY id').all());
  })
);

router.post(
  '/',
  handler((req, res) => {
    const { name, team_id, manager_id = null } = req.body ?? {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new ApiError(422, 'invalid_employee', ['name é obrigatório']);
    }
    if (team_id == null || !db.prepare('SELECT id FROM team WHERE id = ?').get(team_id)) {
      throw new ApiError(422, 'invalid_employee', ['team_id é obrigatório e deve existir']);
    }
    if (manager_id != null && !db.prepare('SELECT id FROM employee WHERE id = ?').get(manager_id)) {
      throw new ApiError(422, 'invalid_employee', ['manager_id inexistente']);
    }
    const info = db
      .prepare('INSERT INTO employee (name, team_id, manager_id) VALUES (?, ?, ?)')
      .run(name.trim(), team_id, manager_id);
    res.status(201).json(db.prepare('SELECT * FROM employee WHERE id = ?').get(info.lastInsertRowid));
  })
);

router.put(
  '/:id',
  handler((req, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM employee WHERE id = ?').get(id);
    if (!existing) throw new ApiError(404, 'employee_not_found');

    const {
      name = existing.name,
      team_id = existing.team_id,
      manager_id = existing.manager_id,
    } = req.body ?? {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new ApiError(422, 'invalid_employee', ['name é obrigatório']);
    }
    if (team_id == null || !db.prepare('SELECT id FROM team WHERE id = ?').get(team_id)) {
      throw new ApiError(422, 'invalid_employee', ['team_id é obrigatório e deve existir']);
    }
    if (manager_id != null) {
      if (!db.prepare('SELECT id FROM employee WHERE id = ?').get(manager_id)) {
        throw new ApiError(422, 'invalid_employee', ['manager_id inexistente']);
      }
      if (wouldCreateManagerCycle(id, manager_id)) {
        throw new ApiError(422, 'manager_cycle', [
          'colaborador não pode ser seu próprio ancestral de gestão',
        ]);
      }
    }
    db.prepare('UPDATE employee SET name = ?, team_id = ?, manager_id = ? WHERE id = ?').run(
      name.trim(),
      team_id,
      manager_id,
      id
    );
    res.json(db.prepare('SELECT * FROM employee WHERE id = ?').get(id));
  })
);

router.delete(
  '/:id',
  handler((req, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM employee WHERE id = ?').get(id);
    if (!existing) throw new ApiError(404, 'employee_not_found');

    const subordinates = db.prepare('SELECT COUNT(*) AS n FROM employee WHERE manager_id = ?').get(id);
    const evaluations = db
      .prepare('SELECT COUNT(*) AS n FROM evaluation WHERE evaluated_id = ? OR evaluator_id = ?')
      .get(id, id);
    if (subordinates.n > 0 || evaluations.n > 0) {
      throw new ApiError(409, 'employee_in_use', ['colaborador possui subordinados ou avaliações']);
    }
    db.prepare('DELETE FROM employee WHERE id = ?').run(id);
    res.status(204).end();
  })
);

export default router;
