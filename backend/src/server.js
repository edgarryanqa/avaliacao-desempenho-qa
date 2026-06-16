import express from 'express';
import cors from 'cors';

import './db.js'; // cria schema + seed em memória ao iniciar
import competencies from './routes/competencies.js';
import teams from './routes/teams.js';
import employees from './routes/employees.js';
import cycles from './routes/cycles.js';
import evaluations from './routes/evaluations.js';
import reports from './routes/reports.js';
import { ApiError } from './util.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/competencies', competencies);
app.use('/api/teams', teams);
app.use('/api/employees', employees);
app.use('/api/cycles', cycles);
app.use('/api/evaluations', evaluations);
app.use('/api/reports', reports);

// 404 para rotas /api desconhecidas.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'not_found', details: [`rota não encontrada: ${req.method} ${req.originalUrl}`] });
});

// Middleware de erro — padroniza { error, details }.
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.code, details: err.details });
  }
  console.error(err);
  res.status(500).json({ error: 'internal_error', details: [err.message] });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend ouvindo em http://localhost:${PORT} (banco SQLite em memória, semeado)`);
});
