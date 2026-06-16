import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Competencies() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      setItems(await api.get('/competencies'));
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
    try {
      if (editing) await api.put(`/competencies/${editing}`, { name });
      else await api.post('/competencies', { name });
      setName('');
      setEditing(null);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function remove(id) {
    setError('');
    try {
      await api.del(`/competencies/${id}`);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      <h2>Competências</h2>
      {error && <div className="alert error">{error}</div>}

      <div className="panel">
        <h3>{editing ? 'Editar competência' : 'Nova competência'}</h3>
        <form onSubmit={submit}>
          <label>Nome</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Comunicação" />
          <div className="inline">
            <button className="btn" type="submit">{editing ? 'Salvar' : 'Cadastrar'}</button>
            {editing && (
              <button type="button" className="btn secondary" onClick={() => { setEditing(null); setName(''); }}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="panel">
        <h3>Cadastradas</h3>
        {loading ? (
          <p className="muted">Carregando…</p>
        ) : items.length === 0 ? (
          <p className="empty">Nenhuma competência cadastrada.</p>
        ) : (
          <table>
            <thead><tr><th>ID</th><th>Nome</th><th></th></tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="link" onClick={() => { setEditing(c.id); setName(c.name); }}>editar</button>
                    <button className="link danger" onClick={() => remove(c.id)}>excluir</button>
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
