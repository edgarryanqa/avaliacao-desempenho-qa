import { useState } from 'react';
import Competencies from './pages/Competencies.jsx';
import Teams from './pages/Teams.jsx';
import Employees from './pages/Employees.jsx';
import Cycles from './pages/Cycles.jsx';
import Answer from './pages/Answer.jsx';
import Reports from './pages/Reports.jsx';

const PAGES = [
  { key: 'competencies', label: 'Competências', Component: Competencies },
  { key: 'teams', label: 'Times', Component: Teams },
  { key: 'employees', label: 'Colaboradores', Component: Employees },
  { key: 'cycles', label: 'Ciclos', Component: Cycles },
  { key: 'answer', label: 'Responder avaliações', Component: Answer },
  { key: 'reports', label: 'Relatórios', Component: Reports },
];

export default function App() {
  const [page, setPage] = useState('competencies');
  const Current = PAGES.find((p) => p.key === page).Component;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">e</span>
          <span className="brand-name">elofy</span>
        </div>
        <nav className="topnav">
          {PAGES.map((p) => (
            <button
              key={p.key}
              className={page === p.key ? 'active' : ''}
              onClick={() => setPage(p.key)}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="content">
        <Current />
      </main>
    </div>
  );
}
