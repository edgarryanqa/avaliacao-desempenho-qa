import { useEffect, useState } from 'react';
import { api } from '../api.js';

const blank = {
  name: '',
  start_date: '',
  end_date: '',
  use_weights: false,
  team_ids: [],
  competencies: {}, // { [competency_id]: weight|'' }
};

export default function Cycles() {
  const [cycles, setCycles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [comps, setComps] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [cy, tm, cp] = await Promise.all([
        api.get('/cycles'), api.get('/teams'), api.get('/competencies'),
      ]);
      setCycles(cy);
      setTeams(tm);
      setComps(cp);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function reset() {
    setEditing(null);
    setForm(blank);
  }

  function toggleTeam(id) {
    setForm((f) => ({
      ...f,
      team_ids: f.team_ids.includes(id) ? f.team_ids.filter((x) => x !== id) : [...f.team_ids, id],
    }));
  }

  function toggleComp(id) {
    setForm((f) => {
      const next = { ...f.competencies };
      if (id in next) delete next[id];
      else next[id] = '';
      return { ...f, competencies: next };
    });
  }

  function setWeight(id, value) {
    setForm((f) => ({ ...f, competencies: { ...f.competencies, [id]: value } }));
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    const payload = {
      name: form.name,
      start_date: form.start_date,
      end_date: form.end_date,
      use_weights: form.use_weights,
      team_ids: form.team_ids,
      competencies: Object.entries(form.competencies).map(([cid, w]) => ({
        competency_id: Number(cid),
        weight: form.use_weights ? (w === '' ? null : Number(w)) : null,
      })),
    };
    try {
      if (editing) await api.put(`/cycles/${editing}`, payload);
      else await api.post('/cycles', payload);
      reset();
      load();
    } catch (e) {
      setError(`${e.message}${e.details?.length ? ' — ' + e.details.join('; ') : ''}`);
    }
  }

  function edit(cycle) {
    setEditing(cycle.id);
    setForm({
      name: cycle.name,
      start_date: cycle.start_date,
      end_date: cycle.end_date,
      use_weights: cycle.use_weights === 1,
      team_ids: cycle.team_ids,
      competencies: Object.fromEntries(
        cycle.competencies.map((c) => [c.competency_id, c.weight ?? ''])
      ),
    });
  }

  async function start(id) {
    setError('');
    setInfo('');
    try {
      const r = await api.post(`/cycles/${id}/start`);
      setInfo(`Ciclo iniciado: ${r.evaluations_generated} avaliações geradas.`);
      load();
    } catch (e) {
      setError(`${e.message}${e.details?.length ? ' — ' + e.details.join('; ') : ''}`);
    }
  }

  async function close(id) {
    setError('');
    setInfo('');
    try {
      await api.post(`/cycles/${id}/close`);
      setInfo('Ciclo encerrado.');
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  const weightSum = Object.values(form.competencies).reduce((s, w) => s + (Number(w) || 0), 0);

  return (
    <div>
      <h2>Ciclos</h2>
      {error && <div className="alert error">{error}</div>}
      {info && <div className="alert success">{info}</div>}

      <div className="panel">
        <h3>{editing ? `Editar ciclo #${editing}` : 'Novo ciclo'}</h3>
        <form onSubmit={submit}>
          <label>Nome</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex.: Avaliação Q2/2026" />
          <div className="row">
            <div>
              <label>Início</label>
              <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            </div>
            <div>
              <label>Fim</label>
              <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
            </div>
          </div>

          <label className="inline" style={{ marginTop: 14 }}>
            <input type="checkbox" style={{ width: 'auto' }} checked={form.use_weights}
              onChange={(e) => setForm({ ...form, use_weights: e.target.checked })} />
            Usar pesos por competência (soma deve ser 100)
          </label>

          <div className="row" style={{ marginTop: 12 }}>
            <div>
              <label>Times participantes</label>
              <div className="checkbox-list">
                {teams.length === 0 && <span className="muted">Nenhum time.</span>}
                {teams.map((t) => (
                  <label key={t.id}>
                    <input type="checkbox" checked={form.team_ids.includes(t.id)} onChange={() => toggleTeam(t.id)} />
                    {t.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label>Competências {form.use_weights && <span className="muted">(soma atual: {weightSum})</span>}</label>
              <div className="checkbox-list">
                {comps.length === 0 && <span className="muted">Nenhuma competência.</span>}
                {comps.map((c) => (
                  <label key={c.id}>
                    <input type="checkbox" checked={c.id in form.competencies} onChange={() => toggleComp(c.id)} />
                    {c.name}
                    {form.use_weights && c.id in form.competencies && (
                      <input className="score-input" type="number" min="0" max="100" placeholder="peso"
                        value={form.competencies[c.id]} onChange={(e) => setWeight(c.id, e.target.value)} />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="inline">
            <button className="btn" type="submit">{editing ? 'Salvar' : 'Cadastrar ciclo'}</button>
            {editing && <button type="button" className="btn secondary" onClick={reset}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="panel">
        <h3>Ciclos cadastrados</h3>
        {loading ? (
          <p className="muted">Carregando…</p>
        ) : cycles.length === 0 ? (
          <p className="empty">Nenhum ciclo cadastrado.</p>
        ) : (
          <table>
            <thead><tr><th>ID</th><th>Nome</th><th>Período</th><th>Pesos</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {cycles.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.start_date} → {c.end_date}</td>
                  <td>{c.use_weights === 1 ? 'Sim' : 'Não'}</td>
                  <td><span className={`badge ${c.status}`}>{c.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    {c.status === 'draft' && <button className="link" onClick={() => edit(c)}>editar</button>}
                    {c.status === 'draft' && <button className="link" onClick={() => start(c.id)}>iniciar</button>}
                    {c.status === 'active' && <button className="link danger" onClick={() => close(c.id)}>encerrar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
