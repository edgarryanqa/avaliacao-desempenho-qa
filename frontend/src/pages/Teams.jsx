import { useEffect, useState } from 'react';
import { api } from '../api.js';

// Ordena os times em árvore (indentação por nível) a partir das raízes.
function buildTree(teams) {
  const byParent = {};
  for (const t of teams) {
    const key = t.parent_team_id ?? 'root';
    (byParent[key] ??= []).push(t);
  }
  const out = [];
  function walk(parentKey, level) {
    for (const t of byParent[parentKey] ?? []) {
      out.push({ ...t, level });
      walk(t.id, level + 1);
    }
  }
  walk('root', 0);
  return out;
}

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setTeams(await api.get('/teams'));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    const payload = { name, parent_team_id: parent ? Number(parent) : null };
    try {
      if (editing) await api.put(`/teams/${editing}`, payload);
      else await api.post('/teams', payload);
      reset();
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  function reset() {
    setEditing(null);
    setName('');
    setParent('');
  }

  async function remove(id) {
    setError('');
    try {
      await api.del(`/teams/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  const tree = buildTree(teams);

  return (
    <div>
      <h2>Times</h2>
      {error && <div className="alert error">{error}</div>}

      <div className="panel">
        <h3>{editing ? 'Editar time' : 'Novo time'}</h3>
        <form onSubmit={submit}>
          <label>Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Back-end" />
          <label>Time superior</label>
          <select value={parent} onChange={(e) => setParent(e.target.value)}>
            <option value="">— Nenhum (time raiz) —</option>
            {teams.filter((t) => t.id !== editing).map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <div className="inline">
            <button className="btn" type="submit">{editing ? 'Salvar' : 'Cadastrar'}</button>
            {editing && <button type="button" className="btn secondary" onClick={reset}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className="panel">
        <h3>Hierarquia</h3>
        {loading ? (
          <p className="muted">Carregando…</p>
        ) : tree.length === 0 ? (
          <p className="empty">Nenhum time cadastrado.</p>
        ) : (
          <table>
            <thead><tr><th>ID</th><th>Time</th><th></th></tr></thead>
            <tbody>
              {tree.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td><span style={{ paddingLeft: t.level * 22 }}>{t.level > 0 ? '↳ ' : ''}{t.name}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="link" onClick={() => { setEditing(t.id); setName(t.name); setParent(t.parent_team_id ?? ''); }}>editar</button>
                    <button className="link danger" onClick={() => remove(t.id)}>excluir</button>
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
