import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [emps, tms] = await Promise.all([api.get('/employees'), api.get('/teams')]);
      setEmployees(emps);
      setTeams(tms);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function reset() {
    setEditing(null);
    setName('');
    setTeamId('');
    setManagerId('');
  }

  async function submit(e) {
    e.preventDefault();
    setError('');
    const payload = {
      name,
      team_id: teamId ? Number(teamId) : null,
      manager_id: managerId ? Number(managerId) : null,
    };
    try {
      if (editing) await api.put(`/employees/${editing}`, payload);
      else await api.post('/employees', payload);
      reset();
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(id) {
    setError('');
    try {
      await api.del(`/employees/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  const teamName = (id) => teams.find((t) => t.id === id)?.name ?? '—';
  const empName = (id) => employees.find((e) => e.id === id)?.name ?? '—';

  return (
    <div>
      <h2>Colaboradores</h2>
      {error && <div className="alert error">{error}</div>}

      <div className="panel">
        <h3>{editing ? 'Editar colaborador' : 'Novo colaborador'}</h3>
        <form onSubmit={submit}>
          <label>Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Ana" />
          <div className="row">
            <div>
              <label>Time</label>
              <select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
                <option value="">— Selecione —</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label>Gestor (opcional)</label>
              <select value={managerId} onChange={(e) => setManagerId(e.target.value)}>
                <option value="">— Sem gestor —</option>
                {employees.filter((e) => e.id !== editing).map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="inline">
            <button className="btn" type="submit">{editing ? 'Salvar' : 'Cadastrar'}</button>
            {editing && <button type="button" className="btn secondary" onClick={reset}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="panel">
        <h3>Cadastrados</h3>
        {loading ? (
          <p className="muted">Carregando…</p>
        ) : employees.length === 0 ? (
          <p className="empty">Nenhum colaborador cadastrado.</p>
        ) : (
          <table>
            <thead><tr><th>ID</th><th>Nome</th><th>Time</th><th>Gestor</th><th></th></tr></thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.name}</td>
                  <td>{teamName(e.team_id)}</td>
                  <td>{e.manager_id ? empName(e.manager_id) : '—'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="link" onClick={() => { setEditing(e.id); setName(e.name); setTeamId(String(e.team_id)); setManagerId(e.manager_id ? String(e.manager_id) : ''); }}>editar</button>
                    <button className="link danger" onClick={() => remove(e.id)}>excluir</button>
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
