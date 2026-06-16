import db from '../db.js';

// Gera as avaliações de um ciclo (seção 4.5 da SPEC).
// Retorna a quantidade de avaliações geradas.
export function generateEvaluations(cycleId) {
  // Colaboradores dos times participantes (apenas team_id direto).
  const employees = db
    .prepare(
      `SELECT e.id, e.team_id, e.manager_id
         FROM employee e
         JOIN cycle_team ct ON ct.team_id = e.team_id
        WHERE ct.cycle_id = ?`
    )
    .all(cycleId);

  const insert = db.prepare(
    `INSERT INTO evaluation (cycle_id, evaluated_id, evaluator_id, type, status)
     VALUES (?, ?, ?, ?, 'pending')`
  );

  let count = 0;

  const run = db.transaction(() => {
    for (const emp of employees) {
      // 1. Autoavaliação — sempre gerada.
      insert.run(cycleId, emp.id, emp.id, 'self');
      count++;

      // 2. Avaliação do gestor — somente se houver manager_id.
      if (emp.manager_id != null) {
        insert.run(cycleId, emp.id, emp.manager_id, 'manager');
        count++;
      }

      // 3. Avaliações de pares — colegas do mesmo team_id direto (exceto o próprio).
      const peers = db
        .prepare(
          `SELECT id FROM employee
            WHERE team_id = ?
              AND id <> ?`
        )
        .all(emp.team_id, emp.id);

      for (const peer of peers) {
        insert.run(cycleId, emp.id, peer.id, 'peer');
        count++;
      }
    }
  });

  run();
  return count;
}
