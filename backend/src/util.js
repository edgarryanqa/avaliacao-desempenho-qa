// Erro de API com status HTTP e código padronizado.
export class ApiError extends Error {
  constructor(status, code, details = []) {
    super(code);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Envolve um handler async/sync e encaminha ApiError para o middleware de erro.
export function handler(fn) {
  return (req, res, next) => {
    try {
      Promise.resolve(fn(req, res, next)).catch(next);
    } catch (err) {
      next(err);
    }
  };
}

// Data atual no formato ISO YYYY-MM-DD (fuso local do servidor).
export function today() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDate(value) {
  return typeof value === 'string' && ISO_DATE.test(value);
}
