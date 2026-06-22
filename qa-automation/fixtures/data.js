function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function todayIso() {
  return formatLocalDate(new Date());
}

function offsetIso(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

export const teamNames = {
  tecnologia: 'Tecnologia',
  backend: 'Back-end',
  frontend: 'Front-end',
  qaAutomation: 'QA Automation',
  mobile: 'Mobile',
};

export const teamIds = {
  tecnologia: 1,
  backend: 2,
  frontend: 3,
};

export const employeeIds = {
  ana: 1,
  bruno: 2,
  carlos: 3,
  diana: 4,
  eduardo: 5,
};

export const competencyNames = {
  comunicacao: 'Comunicação',
  entrega: 'Entrega',
  colaboracao: 'Colaboração',
  lideranca: 'Liderança',
};

export const employeeNames = {
  ana: 'Ana',
  bruno: 'Bruno',
  carlos: 'Carlos',
  diana: 'Diana',
  eduardo: 'Eduardo',
};

export const initialData = {
  teams: [
    { id: 1, name: teamNames.tecnologia, parent_team_id: null },
    { id: 2, name: teamNames.backend, parent_team_id: 1 },
    { id: 3, name: teamNames.frontend, parent_team_id: 1 },
  ],
  competencies: [
    { id: 1, name: competencyNames.comunicacao },
    { id: 2, name: competencyNames.entrega },
    { id: 3, name: competencyNames.colaboracao },
  ],
  employees: [
    { id: 1, name: employeeNames.ana, team_id: 2, manager_id: null },
    { id: 2, name: employeeNames.bruno, team_id: 2, manager_id: 1 },
    { id: 3, name: employeeNames.carlos, team_id: 2, manager_id: 1 },
    { id: 4, name: employeeNames.diana, team_id: 3, manager_id: null },
    { id: 5, name: employeeNames.eduardo, team_id: 3, manager_id: 4 },
  ],
  cycle: {
    name: 'Avaliação de Desempenho — Ciclo Atual',
    start_date: offsetIso(-15),
    end_date: offsetIso(15),
    use_weights: false,
    status: 'draft',
    team_ids: [2, 3],
    competencies: [
      { competency_id: 1, weight: null },
      { competency_id: 2, weight: null },
      { competency_id: 3, weight: null },
    ],
  },
};

export function buildCyclePayload({ suffix = '', startDays = 0, endDays = 0, teams = [teamNames.backend], competencies = [competencyNames.comunicacao] } = {}) {
  const name = `Ciclo ${suffix || 'E2E'} ${Date.now()}`;
  return {
    nome: name,
    inicio: offsetIso(startDays),
    fim: offsetIso(endDays || startDays),
    times: teams,
    competencias: competencies,
  };
}

export function buildUniqueName(base) {
  return `${base} ${Date.now()}`;
}
