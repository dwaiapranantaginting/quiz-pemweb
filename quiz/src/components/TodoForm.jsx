import { useState } from 'react';
import { PRIORITIES, STATUSES } from '../constants';
import { dateFromNow } from '../utils/date';
import { IconClose } from './Icons';
import Modal from './Modal';

function createInitialValues(todo) {
  if (todo) {
    return {
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      deadline: todo.deadline,
      status: todo.status,
    };
  }

  return {
    title: '',
    description: '',
    priority: 'medium',
    deadline: dateFromNow(3),
    status: 'todo',
  };
}

export default function TodoForm({ todo, onClose, onSubmit }) {
  const isEdit = Boolean(todo);
  const [values, setValues] = useState(() => createInitialValues(todo));
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};
    const title = values.title.trim();
    const description = values.description.trim();

    if (!title) nextErrors.title = 'Judul tugas wajib diisi.';
    else if (title.length < 3) nextErrors.title = 'Judul minimal 3 karakter.';

    if (!description) nextErrors.description = 'Deskripsi tugas wajib diisi.';
    else if (description.length < 10) nextErrors.description = 'Deskripsi minimal 10 karakter.';

    if (!values.deadline) nextErrors.deadline = 'Batas waktu wajib ditentukan.';

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      const firstField = Object.keys(nextErrors)[0];
      document.getElementById(`todo-${firstField}`)?.focus();
      return;
    }

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      deadline: values.deadline,
      status: values.status,
    });
  };

  return (
    <Modal open onClose={onClose} labelledBy="form-title" size="md">
      <div className="modal__head">
        <h2 id="form-title">{isEdit ? 'Edit Tugas' : 'Tambah Tugas'}</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Tutup form">
          <IconClose size={16} />
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="modal__body form">
          <div className="field">
            <label htmlFor="todo-title">Judul tugas</label>
            <input
              id="todo-title"
              type="text"
              placeholder="Menyelesaikan laporan praktikum"
              value={values.title}
              maxLength={80}
              data-autofocus
              aria-invalid={Boolean(errors.title)}
              onChange={(event) => updateField('title', event.target.value)}
            />
            {errors.title && <p className="field__error">{errors.title}</p>}
          </div>

          <div className="field">
            <label htmlFor="todo-description">Deskripsi</label>
            <textarea
              id="todo-description"
              rows={4}
              placeholder="Tuliskan detail tugas yang perlu dikerjakan."
              value={values.description}
              maxLength={400}
              aria-invalid={Boolean(errors.description)}
              onChange={(event) => updateField('description', event.target.value)}
            />
            {errors.description && <p className="field__error">{errors.description}</p>}
          </div>

          <div className="form__row">
            <div className="field">
              <label htmlFor="todo-priority">Prioritas</label>
              <select
                id="todo-priority"
                value={values.priority}
                onChange={(event) => updateField('priority', event.target.value)}
              >
                {Object.entries(PRIORITIES).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="todo-deadline">Batas waktu</label>
              <input
                id="todo-deadline"
                type="date"
                value={values.deadline}
                aria-invalid={Boolean(errors.deadline)}
                onChange={(event) => updateField('deadline', event.target.value)}
              />
              {errors.deadline && <p className="field__error">{errors.deadline}</p>}
            </div>
          </div>

          <div className="field">
            <label htmlFor="todo-status">Status</label>
            <select
              id="todo-status"
              value={values.status}
              onChange={(event) => updateField('status', event.target.value)}
            >
              {Object.entries(STATUSES).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal__footer">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Batal
          </button>
          <div className="modal__footer-right">
            <button type="submit" className="btn btn--primary">
              {isEdit ? 'Simpan' : 'Tambah'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
