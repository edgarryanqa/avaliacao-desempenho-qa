import { Router } from 'express';
import db from '../db.js';
import { ApiError, handler } from '../util.js';

const router = Router();

// Verifica se `ancestorId` é ancestral (ou igual) de `teamId` subindo por parent_team_id.
// Usado para impedir ciclo na hierarquia.
function wouldCreateCycle(teamId, parentId) {
  if (parentId == null) return false;
  if (parentId === teamId) return true;
  let current = parentId;
  const seen = new Set();
  while (current != null) {
    if (current === teamId) return true;
    if (seen.has(current)) break; // proteção contra dados já inconsistentes
    seen.add(current);
    const row = db.prepare('SELECT parent_team_id FROM team WHERE id = ?').get(current);
    current = row ? row.parent_team_id : null;
  }
  return false;
}

router.get(
  '/',
  handler((req, res) => {
    res.json(db.prepare('SELECT * FROM team ORDER BY id').all());
  })
);

router.post(
  '/',
  handler((req, res) => {
    const { name, parent_team_id = null } = req.body ?? {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new ApiError(422, 'invalid_team', ['name é obrigatório']);
    }
    if (parent_team_id != null) {
      const parent = db.prepare('SELECT id FROM team WHERE id = ?').get(parent_team_id);
      if (!parent) throw new ApiError(422, 'invalid_team', ['parent_team_id inexistente']);
    }
    const info = db
      .prepare('INSERT INTO team (name, parent_team_id) VALUES (?, ?)')
      .run(name.trim(), parent_team_id);
    res.status(201).json(db.prepare('SELECT * FROM team WHERE id = ?').get(info.lastInsertRowid));
  })
);

router.put(
  '/:id',
  handler((req, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM team WHERE id = ?').get(id);
    if (!existing) throw new ApiError(404, 'team_not_found');

    const { name = existing.name, parent_team_id = existing.parent_team_id } = req.body ?? {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new ApiError(422, 'invalid_team', ['name é obrigatório']);
    }
    if (parent_team_id != null) {
      const parent = db.prepare('SELECT id FROM team WHERE id = ?').get(parent_team_id);
      if (!parent) throw new ApiError(422, 'invalid_team', ['parent_team_id inexistente']);
      if (wouldCreateCycle(id, parent_team_id)) {
        throw new ApiError(422, 'team_hierarchy_cycle', ['um time não pode ser ancestral de si mesmo']);
      }
    }
    db.prepare('UPDATE team SET name = ?, parent_team_id = ? WHERE id = ?').run(
      name.trim(),
      parent_team_id,
      id
    );
    res.json(db.prepare('SELECT * FROM team WHERE id = ?').get(id));
  })
);

router.delete(
  '/:id',
  handler((req, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM team WHERE id = ?').get(id);
    if (!existing) throw new ApiError(404, 'team_not_found');

    const children = db.prepare('SELECT COUNT(*) AS n FROM team WHERE parent_team_id = ?').get(id);
    const members = db.prepare('SELECT COUNT(*) AS n FROM employee WHERE team_id = ?').get(id);
    if (children.n > 0 || members.n > 0) {
      throw new ApiError(409, 'team_in_use', ['time possui filhos ou colaboradores']);
    }
    db.prepare('DELETE FROM team WHERE id = ?').run(id);
    res.status(204).end();
  })
);

export default router;
