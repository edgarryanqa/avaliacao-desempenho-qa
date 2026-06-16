import { Router } from 'express';
import db from '../db.js';
import { ApiError, handler } from '../util.js';

const router = Router();

router.get(
  '/',
  handler((req, res) => {
    res.json(db.prepare('SELECT * FROM competency ORDER BY id').all());
  })
);

router.post(
  '/',
  handler((req, res) => {
    const { name } = req.body ?? {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new ApiError(422, 'invalid_competency', ['name é obrigatório']);
    }
    const info = db.prepare('INSERT INTO competency (name) VALUES (?)').run(name.trim());
    res.status(201).json(db.prepare('SELECT * FROM competency WHERE id = ?').get(info.lastInsertRowid));
  })
);

router.put(
  '/:id',
  handler((req, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM competency WHERE id = ?').get(id);
    if (!existing) throw new ApiError(404, 'competency_not_found');

    const { name } = req.body ?? {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new ApiError(422, 'invalid_competency', ['name é obrigatório']);
    }
    db.prepare('UPDATE competency SET name = ? WHERE id = ?').run(name.trim(), id);
    res.json(db.prepare('SELECT * FROM competency WHERE id = ?').get(id));
  })
);

router.delete(
  '/:id',
  handler((req, res) => {
    const id = Number(req.params.id);
    const existing = db.prepare('SELECT * FROM competency WHERE id = ?').get(id);
    if (!existing) throw new ApiError(404, 'competency_not_found');

    const linked = db
      .prepare('SELECT COUNT(*) AS n FROM cycle_competency WHERE competency_id = ?')
      .get(id);
    if (linked.n > 0) {
      throw new ApiError(409, 'competency_in_use', ['competência vinculada a um ou mais ciclos']);
    }
    db.prepare('DELETE FROM competency WHERE id = ?').run(id);
    res.status(204).end();
  })
);

export default router;
