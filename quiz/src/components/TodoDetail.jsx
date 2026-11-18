import { PRIORITIES, STATUSES } from '../constants';
import { formatDate, getDueMeta } from '../utils/date';
import { IconClose } from './Icons';
import Modal from './Modal';

export default function TodoDetail({ todo, onClose, onEdit, onDelete, onToggle }) {
  const priority = PRIORITIES[todo.priority];
  const status = STATUSES[todo.status];
  const due = getDueMeta(todo.deadline, todo.status);
  const isDone = todo.status === 'done';

  return (
    <Modal open onClose={onClose} labelledBy="detail-title" size="md">
      <div className="modal__head">
        <h2 id="detail-title">Detail Tugas</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Tutup detail">
          <IconClose size={16} />
        </button>
      </div>

      <div className="modal__body">
        <h3 className="detail-title">{todo.title}</h3>

        <dl className="detail-list">
          <div>
            <dt>ID</dt>
            <dd>{todo.id}</dd>
          </div>
          <div>
            <dt>Prioritas</dt>
            <dd className={`priority priority--${todo.priority}`}>
              <span className="dot" />
              {priority.label}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{status.label}</dd>
          </div>
          <div>
            <dt>Deadline</dt>
            <dd>
              {formatDate(todo.deadline)}
              <span className={`due${due.tone === 'danger' ? ' due--late' : ''}`}>{due.label}</span>
            </dd>
          </div>
          <div className="detail-list__full">
            <dt>Deskripsi</dt>
            <dd className="detail-desc">{todo.description}</dd>
          </div>
        </dl>
      </div>

      <div className="modal__footer">
        <button type="button" className="btn btn--ghost btn--danger" onClick={onDelete}>
          Hapus
        </button>
        <div className="modal__footer-right">
          <button type="button" className="btn btn--ghost" onClick={onToggle}>
            {isDone ? 'Buka kembali' : 'Tandai selesai'}
          </button>
          <button type="button" className="btn btn--primary" onClick={onEdit}>
            Edit
          </button>
        </div>
      </div>
    </Modal>
  );
}
