import { useEffect, useState } from 'react';
import { api } from '../api.js';

const TABS = [
  { key: 'teams', label: 'Times' },
  { key: 'employees', label: 'Colaboradores' },
  { key: 'analytical', label: 'Avaliações (analítico)' },
  { key: 'synthetic', label: 'Avaliações (sintético)' },
  { key: 'results', label: 'Resultado' },
];

export default function Reports() {
  const [tab, setTab] = useState('teams');
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [cycles, setCycles] = useState([]);

  const [teamFilter, setTeamFilter] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [cycleFilter, setCycleFilter] = useState('');

  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [tm, em, cy] = await Promise.all([
          api.get('/teams'), api.get('/employees'), api.get('/cycles'),
        ]);
        setTeams(tm);
        setEmployees(em);
        setCycles(cy);
        if (cy.length) setCycleFilter(String(cy[0].id));
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  async function run() {
    setError('');
    setLoading(true);
    setData(null);
    try {
      let path;
      if (tab === 'teams') path = `/reports/teams${teamFilter ? `?team_id=${teamFilter}` : ''}`;
      else if (tab === 'employees') path = `/reports/employees${employeeFilter ? `?employee_id=${employeeFilter}` : ''}`;
      else {
        if (!cycleFilter) { setError('Selecione um ciclo.'); setLoading(false); return; }
        path = `/reports/evaluations/${tab}?cycle_id=${cycleFilter}`;
      }
      setData(await api.get(path));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { setData(null); setError(''); }, [tab]);

  const compName = (row) => row.competency_name;

  return (
    <div>
      <h2>Relatórios</h2>
      {error && <div className="alert error">{error}</div>}

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? 'active' : ''} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      <div className="panel">
        <div className="row">
          {tab === 'teams' && (
            <div>
              <label>Time (opcional — raiz se vazio)</label>
              <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
                <option value="">— Topo (todas as raízes) —</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          )}
          {tab === 'employees' && (
            <div>
              <label>Colaborador (opcional — sem gestor se vazio)</label>
              <select value={employeeFilter} onChange={(e) => setEmployeeFilter(e.target.value)}>
                <option value="">— Topo (sem gestor) —</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>
          )}
          {['analytical', 'synthetic', 'results'].includes(tab) && (
            <div>
              <label>Ciclo</label>
              <select value={cycleFilter} onChange={(e) => setCycleFilter(e.target.value)}>
                <option value="">— Selecione —</option>
                {cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
        </div>
        <button className="btn" onClick={run}>Gerar relatório</button>
      </div>

      <div className="panel">
        {loading ? (
          <p className="muted">Carregando…</p>
        ) : data == null ? (
          <p className="empty">Clique em “Gerar relatório” para ver os resultados.</p>
        ) : data.length === 0 ? (
          <p className="empty">Sem dados para os filtros selecionados.</p>
        ) : (
          <ReportTable tab={tab} data={data} teams={teams} />
        )}
      </div>
    </div>
  );
}

function ReportTable({ tab, data, teams }) {
  const teamName = (id) => teams.find((t) => t.id === id)?.name ?? id;

  if (tab === 'teams') {
    return (
      <table>
        <thead><tr><th>ID</th><th>Time</th><th>Nível</th></tr></thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td><span style={{ paddingLeft: r.level * 20 }}>{r.level > 0 ? '↳ ' : ''}{r.name}</span></td>
              <td>{r.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (tab === 'employees') {
    return (
      <table>
        <thead><tr><th>ID</th><th>Colaborador</th><th>Time</th><th>Nível</th></tr></thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td><span style={{ paddingLeft: r.level * 20 }}>{r.level > 0 ? '↳ ' : ''}{r.name}</span></td>
              <td>{teamName(r.team_id)}</td>
              <td>{r.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (tab === 'analytical') {
    return (
      <table>
        <thead>
          <tr>
            <th>Avaliado</th><th>Avaliador</th><th>Tipo</th><th>Competência</th><th>Nota</th><th>Peso</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i}>
              <td>{r.evaluated_name}</td>
              <td>{r.evaluator_name}</td>
              <td>{r.type}</td>
              <td>{r.competency_name}</td>
              <td>{r.score}</td>
              <td>{r.weight ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (tab === 'synthetic') {
    const competencies = data[0]?.competencies ?? [];
    return (
      <table>
        <thead>
          <tr>
            <th>Avaliado</th>
            {competencies.map((c) => <th key={c.competency_id}>{c.competency_name}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.evaluated_id}>
              <td>{r.evaluated_name}</td>
              {r.competencies.map((c) => <td key={c.competency_id}>{c.average ?? '—'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // results
  return (
    <table>
      <thead>
        <tr><th>Avaliado</th><th>Autoavaliação</th><th>Gestor</th><th>Equipe (pares)</th></tr>
      </thead>
      <tbody>
        {data.map((r) => (
          <tr key={r.evaluated_id}>
            <td>{r.evaluated_name}</td>
            <td>{r.self_average ?? '—'}</td>
            <td>{r.manager_average ?? '—'}</td>
            <td>{r.team_average ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
