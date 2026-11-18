import Modal from './Modal';

export default function ConfirmDialog({ todo, onCancel, onConfirm }) {
  return (
    <Modal open onClose={onCancel} labelledBy="confirm-title" size="sm">
      <div className="modal__head">
        <h2 id="confirm-title">Hapus tugas?</h2>
      </div>

      <div className="modal__body">
        <p className="confirm-text">
          Tugas <strong>{todo.title}</strong> akan dihapus dan tidak bisa dikembalikan.
        </p>
      </div>

      <div className="modal__footer">
        <button type="button" className="btn btn--ghost" onClick={onCancel} data-autofocus>
          Batal
        </button>
        <div className="modal__footer-right">
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
}
