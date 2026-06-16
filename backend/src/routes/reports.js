import { Router } from 'express';
import db from '../db.js';
import { ApiError, handler } from '../util.js';
import { analyticalReport, syntheticReport, resultsReport } from '../services/averages.js';

const router = Router();

// Relatório de times — CTE recursiva a partir do topo (ou de um time específico).
router.get(
  '/teams',
  handler((req, res) => {
    const teamId = req.query.team_id ? Number(req.query.team_id) : null;

    const rows = db
      .prepare(
        `WITH RECURSIVE tree(id, name, parent_team_id, level) AS (
            SELECT id, name, parent_team_id, 0
              FROM team
             WHERE (@root IS NULL AND parent_team_id IS NULL)
                OR (@root IS NOT NULL AND id = @root)
            UNION ALL
            SELECT t.id, t.name, t.parent_team_id, tree.level + 1
              FROM team t
              JOIN tree ON t.parent_team_id = tree.id
         )
         SELECT id, name, parent_team_id, level FROM tree
          ORDER BY level, name`
      )
      .all({ root: teamId });
    res.json(rows);
  })
);

// Relatório de colaboradores — CTE recursiva pela cadeia de gestão.
router.get(
  '/employees',
  handler((req, res) => {
    const employeeId = req.query.employee_id ? Number(req.query.employee_id) : null;

    const rows = db
      .prepare(
        `WITH RECURSIVE chain(id, name, team_id, manager_id, level) AS (
            SELECT id, name, team_id, manager_id, 0
              FROM employee
             WHERE (@root IS NULL AND manager_id IS NULL)
                OR (@root IS NOT NULL AND id = @root)
            UNION ALL
            SELECT e.id, e.name, e.team_id, e.manager_id, chain.level + 1
              FROM employee e
              JOIN chain ON e.manager_id = chain.id
         )
         SELECT id, name, team_id, manager_id, level FROM chain
          ORDER BY level, name`
      )
      .all({ root: employeeId });
    res.json(rows);
  })
);

function requireCycle(req) {
  const cycleId = Number(req.query.cycle_id);
  if (!cycleId || !db.prepare('SELECT id FROM cycle WHERE id = ?').get(cycleId)) {
    throw new ApiError(404, 'cycle_not_found', ['cycle_id é obrigatório e deve existir']);
  }
  return cycleId;
}

router.get(
  '/evaluations/analytical',
  handler((req, res) => {
    res.json(analyticalReport(requireCycle(req)));
  })
);

router.get(
  '/evaluations/synthetic',
  handler((req, res) => {
    res.json(syntheticReport(requireCycle(req)));
  })
);

router.get(
  '/evaluations/results',
  handler((req, res) => {
    res.json(resultsReport(requireCycle(req)));
  })
);

export default router;
