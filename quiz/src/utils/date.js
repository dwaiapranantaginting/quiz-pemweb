const MS_PER_DAY = 1000 * 60 * 60 * 24;

const shortDate = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const longDate = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function toDate(value) {
  if (value instanceof Date) return value;
  return new Date(`${value}T00:00:00`);
}

export function formatDate(value) {
  if (!value) return '—';
  return shortDate.format(toDate(value));
}

export function formatToday() {
  return longDate.format(new Date());
}

export function toInputDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function dateFromNow(offsetDays) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);
  return toInputDate(date);
}

export function daysUntil(value) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const target = toDate(value);
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((targetStart - start) / MS_PER_DAY);
}

/**
 * Mengembalikan label + tone kecil untuk deadline.
 * tone: 'danger' | 'warning' | 'success' | 'muted'
 */
export function getDueMeta(deadline, status) {
  if (status === 'done') {
    return { label: 'Selesai', tone: 'success' };
  }

  const diff = daysUntil(deadline);

  if (diff < 0) {
    return { label: `Terlambat ${Math.abs(diff)} hari`, tone: 'danger' };
  }
  if (diff === 0) {
    return { label: 'Jatuh tempo hari ini', tone: 'warning' };
  }
  if (diff === 1) {
    return { label: 'Besok', tone: 'warning' };
  }
  if (diff <= 3) {
    return { label: `${diff} hari lagi`, tone: 'warning' };
  }
  return { label: `${diff} hari lagi`, tone: 'muted' };
}
