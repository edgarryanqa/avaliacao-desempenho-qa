import { useEffect, useState } from 'react';
import { api } from '../api.js';

const todayISO = () => new Date().toISOString().slice(0, 10);

const TYPE_LABEL = { self: 'Autoavaliação', manager: 'Gestor', peer: 'Par' };

export default function Answer() {
  const [employees, setEmployees] = useState([]);
  const [comps, setComps] = useState([]);
  const [cyclesById, setCyclesById] = useState({});
  const [evaluatorId, setEvaluatorId] = useState('');
  const [evaluations, setEvaluations] = useState([]);
  const [open, setOpen] = useState(null);
  const [scores, setScores] = useState({});
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [emps, cp, cy] = await Promise.all([
          api.get('/employees'), api.get('/competencies'), api.get('/cycles'),
        ]);
        setEmployees(emps);
        setComps(cp);
        setCyclesById(Object.fromEntries(cy.map((c) => [c.id, c])));
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  async function loadEvaluations(id) {
    if (!id) { setEvaluations([]); return; }
    setLoading(true);
    setError('');
    try {
      setEvaluations(await api.get(`/evaluations?evaluator_id=${id}&status=pending`));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function selectEvaluator(id) {
    setEvaluatorId(id);
    setOpen(null);
    setInfo('');
    loadEvaluations(id);
  }

  function openForm(ev) {
    setOpen(ev.id);
    setScores(Object.fromEntries((cyclesById[ev.cycle_id]?.competencies ?? []).map((c) => [c.competency_id, ''])));
    setInfo('');
    setError('');
  }

  async function submit(ev) {
    setError('');
    setInfo('');
    const answers = Object.entries(scores).map(([cid, s]) => ({
      competency_id: Number(cid),
      score: s === '' ? null : Number(s),
    }));
    try {
      await api.post(`/evaluations/${ev.id}/answer`, { evaluator_id: Number(evaluatorId), answers });
      setInfo('Avaliação respondida com sucesso.');
      setOpen(null);
      loadEvaluations(evaluatorId);
    } catch (e) {
      setError(`${e.message}${e.details?.length ? ' — ' + e.details.join('; ') : ''}`);
    }
  }

  const compName = (id) => comps.find((c) => c.id === id)?.name ?? `#${id}`;
  const evaluatedName = (ev) => ev.evaluated_name;
  const inPeriod = (ev) => todayISO() >= ev.start_date && todayISO() <= ev.end_date;

  return (
    <div>
      <h2>Responder avaliações</h2>
      {error && <div className="alert error">{error}</div>}
      {info && <div className="alert success">{info}</div>}

      <div className="panel">
        <h3>Colaborador atual (impersonação)</h3>
        <p className="muted">Sem login: escolha quem está respondendo. As avaliações pendentes desse avaliador aparecem abaixo.</p>
        <select value={evaluatorId} onChange={(e) => selectEvaluator(e.target.value)}>
          <option value="">— Selecione um colaborador —</option>
          {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      {evaluatorId && (
        <div className="panel">
          <h3>Avaliações pendentes</h3>
          {loading ? (
            <p className="muted">Carregando…</p>
          ) : evaluations.length === 0 ? (
            <p className="empty">Nenhuma avaliação pendente para este colaborador.</p>
          ) : (
            evaluations.map((ev) => (
              <div key={ev.id} style={{ borderBottom: '1px solid var(--border)', padding: '12px 0' }}>
                <div className="inline" style={{ justifyContent: 'space-between' }}>
                  <div>
                    <strong>{evaluatedName(ev)}</strong>{' '}
                    <span className="badge pending">{TYPE_LABEL[ev.type] || ev.type}</span>
                    <div className="muted">{ev.cycle_name} · {ev.start_date} → {ev.end_date}</div>
                  </div>
                  <button className="btn secondary" style={{ marginTop: 0 }} onClick={() => (open === ev.id ? setOpen(null) : openForm(ev))}>
                    {open === ev.id ? 'Fechar' : 'Responder'}
                  </button>
                </div>

                {open === ev.id && (
                  <div style={{ marginTop: 12 }}>
                    {!inPeriod(ev) && (
                      <div className="alert info">
                        Atenção: hoje ({todayISO()}) está fora do período do ciclo. O envio será bloqueado pela API (410).
                      </div>
                    )}
                    {(cyclesById[ev.cycle_id]?.competencies ?? []).map((c) => (
                      <div key={c.competency_id} className="inline" style={{ marginBottom: 8 }}>
                        <span style={{ width: 160 }}>{compName(c.competency_id)}</span>
                        <select className="score-input" value={scores[c.competency_id] ?? ''}
                          onChange={(e) => setScores({ ...scores, [c.competency_id]: e.target.value })}>
                          <option value="">—</option>
                          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    ))}
                    <button className="btn" onClick={() => submit(ev)}>Enviar respostas</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
