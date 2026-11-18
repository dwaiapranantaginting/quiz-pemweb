import { useCallback, useMemo, useRef, useState } from 'react';
import ConfirmDialog from './components/ConfirmDialog';
import EmptyState from './components/EmptyState';
import { IconPlus } from './components/Icons';
import ToastStack from './components/Toast';
import TodoDetail from './components/TodoDetail';
import TodoForm from './components/TodoForm';
import TodoRow from './components/TodoRow';
import { PRIORITIES, SORT_OPTIONS, STATUSES } from './constants';
import { initialTodos } from './data/todos';
import { daysUntil, formatToday } from './utils/date';

function createTodoId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `TD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  }
  return `TD-${Date.now().toString(36).toUpperCase()}`;
}

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'todo', label: 'Belum mulai' },
  { key: 'progress', label: 'Dikerjakan' },
  { key: 'done', label: 'Selesai' },
];

export default function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');
  const [query, setQuery] = useState('');

  const [detailId, setDetailId] = useState(null);
  const [formTodo, setFormTodo] = useState(undefined); // undefined: tutup, null: tambah
  const [deleteId, setDeleteId] = useState(null);

  const [toasts, setToasts] = useState([]);
  const toastCounter = useRef(0);

  const pushToast = useCallback((message) => {
    const id = toastCounter.current + 1;
    toastCounter.current = id;
    setToasts((prev) => [...prev, { id, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const selectedTodo = todos.find((todo) => todo.id === detailId) || null;
  const deleteTodo = todos.find((todo) => todo.id === deleteId) || null;

  const counts = useMemo(
    () => ({
      all: todos.length,
      todo: todos.filter((todo) => todo.status === 'todo').length,
      progress: todos.filter((todo) => todo.status === 'progress').length,
      done: todos.filter((todo) => todo.status === 'done').length,
    }),
    [todos],
  );

  const overdue = useMemo(
    () => todos.filter((todo) => todo.status !== 'done' && daysUntil(todo.deadline) < 0).length,
    [todos],
  );

  const visibleTodos = useMemo(() => {
    const keyword = query.trim().toLowerCase();

    const filtered = todos.filter((todo) => {
      if (statusFilter !== 'all' && todo.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
      if (keyword) {
        const haystack = `${todo.title} ${todo.description}`.toLowerCase();
        if (!haystack.includes(keyword)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      // tugas selesai selalu di bawah
      const doneDiff = Number(a.status === 'done') - Number(b.status === 'done');
      if (doneDiff !== 0) return doneDiff;

      if (sortBy === 'priority') {
        const byPriority = PRIORITIES[a.priority].order - PRIORITIES[b.priority].order;
        if (byPriority !== 0) return byPriority;
        return a.deadline.localeCompare(b.deadline);
      }

      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'id');
      }

      return (
        a.deadline.localeCompare(b.deadline) ||
        PRIORITIES[a.priority].order - PRIORITIES[b.priority].order
      );
    });
  }, [todos, statusFilter, priorityFilter, query, sortBy]);

  const hasFilters = Boolean(query.trim()) || statusFilter !== 'all' || priorityFilter !== 'all';

  const resetFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const handleSubmit = (values) => {
    if (formTodo) {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === formTodo.id ? { ...todo, ...values } : todo)),
      );
      pushToast('Perubahan tugas disimpan.');
    } else {
      setTodos((prev) => [{ id: createTodoId(), ...values }, ...prev]);
      setStatusFilter('all');
      setPriorityFilter('all');
      setQuery('');
      pushToast('Tugas ditambahkan.');
    }
    setFormTodo(undefined);
  };

  const handleToggle = (todo) => {
    const nextStatus = todo.status === 'done' ? 'todo' : 'done';
    setTodos((prev) =>
      prev.map((item) => (item.id === todo.id ? { ...item, status: nextStatus } : item)),
    );
    pushToast(
      nextStatus === 'done' ? 'Tugas ditandai selesai.' : 'Tugas dibuka kembali.',
    );
  };

  const handleDeleteConfirm = () => {
    if (!deleteTodo) return;
    const { id } = deleteTodo;
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (detailId === id) setDetailId(null);
    setDeleteId(null);
    pushToast('Tugas dihapus.');
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Daftar Tugas</h1>
          <p className="header__sub">
            {formatToday()} · {counts.all} tugas · {counts.done} selesai
            {overdue > 0 && ` · ${overdue} melewati deadline`}
          </p>
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setFormTodo(null)}>
          <IconPlus size={16} />
          Tambah Tugas
        </button>
      </header>

      <div className="tabs" role="tablist" aria-label="Filter status">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={statusFilter === filter.key}
            className={`tab${statusFilter === filter.key ? ' tab--active' : ''}`}
            onClick={() => setStatusFilter(filter.key)}
          >
            {filter.label}
            <span className="tab__count">{counts[filter.key]}</span>
          </button>
        ))}
      </div>

      <div className="toolbar">
        <input
          type="search"
          className="input input--search"
          placeholder="Cari tugas..."
          aria-label="Cari tugas"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="input input--select"
          aria-label="Filter prioritas"
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
        >
          <option value="all">Semua prioritas</option>
          {Object.entries(PRIORITIES).map(([key, item]) => (
            <option key={key} value={key}>
              Prioritas {item.label.toLowerCase()}
            </option>
          ))}
        </select>
        <select
          className="input input--select"
          aria-label="Urutkan tugas"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          {Object.entries(SORT_OPTIONS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="list">
        {visibleTodos.length > 0 ? (
          visibleTodos.map((todo) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              onOpen={() => setDetailId(todo.id)}
              onEdit={() => setFormTodo(todo)}
              onDelete={() => setDeleteId(todo.id)}
              onToggle={() => handleToggle(todo)}
            />
          ))
        ) : (
          <EmptyState hasFilters={hasFilters} onReset={resetFilters} onAdd={() => setFormTodo(null)} />
        )}
      </div>

      <footer className="footer">
        Taskflow — Kuis Praktikum Pengembangan Frontend · React.js, data dummy tanpa backend
      </footer>

      {selectedTodo && (
        <TodoDetail
          todo={selectedTodo}
          onClose={() => setDetailId(null)}
          onEdit={() => {
            setDetailId(null);
            setFormTodo(selectedTodo);
          }}
          onDelete={() => {
            setDetailId(null);
            setDeleteId(selectedTodo.id);
          }}
          onToggle={() => handleToggle(selectedTodo)}
        />
      )}

      {formTodo !== undefined && (
        <TodoForm todo={formTodo} onClose={() => setFormTodo(undefined)} onSubmit={handleSubmit} />
      )}

      {deleteTodo && (
        <ConfirmDialog
          todo={deleteTodo}
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <ToastStack
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((toast) => toast.id !== id))}
      />
    </div>
  );
}
