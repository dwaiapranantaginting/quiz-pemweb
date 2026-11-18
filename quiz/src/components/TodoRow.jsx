import { PRIORITIES, STATUSES } from '../constants';
import { formatDate, getDueMeta } from '../utils/date';
import { IconCheck } from './Icons';

export default function TodoRow({ todo, onOpen, onEdit, onDelete, onToggle }) {
  const priority = PRIORITIES[todo.priority];
  const status = STATUSES[todo.status];
  const due = getDueMeta(todo.deadline, todo.status);
  const isDone = todo.status === 'done';

  return (
    <div className={`row${isDone ? ' row--done' : ''}`} onClick={onOpen}>
      <button
        type="button"
        className={`checkbox${isDone ? ' checkbox--checked' : ''}`}
        aria-label={isDone ? 'Tandai belum selesai' : 'Tandai selesai'}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
      >
        {isDone && <IconCheck size={12} />}
      </button>

      <div className="row__main">
        <p className="row__title">{todo.title}</p>
        <p className="row__desc">{todo.description}</p>
      </div>

      <div className="row__meta">
        <span className={`priority priority--${todo.priority}`}>
          <span className="dot" />
          {priority.label}
        </span>
        <span className="status">{status.label}</span>
        <span className="date">{formatDate(todo.deadline)}</span>
        {(due.tone === 'danger' || due.tone === 'warning') && !isDone && (
          <span className={`due${due.tone === 'danger' ? ' due--late' : ''}`}>{due.label}</span>
        )}
      </div>

      <div className="row__actions">
        <button
          type="button"
          className="text-btn"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          Edit
        </button>
        <button
          type="button"
          className="text-btn text-btn--danger"
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}
