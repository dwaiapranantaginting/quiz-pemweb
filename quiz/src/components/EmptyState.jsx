export default function EmptyState({ hasFilters, onReset, onAdd }) {
  return (
    <div className="empty">
      <p className="empty__title">
        {hasFilters ? 'Tidak ada tugas yang cocok' : 'Belum ada tugas'}
      </p>
      <p className="empty__text">
        {hasFilters
          ? 'Ubah kata kunci atau filter yang sedang dipakai.'
          : 'Tambahkan tugas pertama untuk mulai.'}
      </p>
      {hasFilters ? (
        <button type="button" className="btn btn--ghost" onClick={onReset}>
          Reset filter
        </button>
      ) : (
        <button type="button" className="btn btn--primary" onClick={onAdd}>
          Tambah Tugas
        </button>
      )}
    </div>
  );
}
