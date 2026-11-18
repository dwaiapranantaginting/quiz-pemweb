import { dateFromNow } from '../utils/date';

/**
 * Data dummy awal aplikasi.
 * Struktur setiap tugas mengikuti kebutuhan REST API:
 * id, title, description, priority, deadline, status
 */
export const initialTodos = [
  {
    id: 'TD-001',
    title: 'Menyelesaikan laporan praktikum',
    description:
      'Rapikan hasil pengamatan, masukkan grafik, lalu susun kesimpulan pada laporan praktikum minggu ini.',
    priority: 'high',
    deadline: dateFromNow(1),
    status: 'progress',
  },
  {
    id: 'TD-002',
    title: 'Belajar React Hooks',
    description:
      'Pelajari kembali useState, useEffect, dan useMemo. Buat catatan kecil beserta contoh implementasinya.',
    priority: 'medium',
    deadline: dateFromNow(3),
    status: 'todo',
  },
  {
    id: 'TD-003',
    title: 'Review pull request tim frontend',
    description:
      'Periksa perubahan komponen navbar dan form login. Berikan catatan bila ada style atau logika yang perlu diperbaiki.',
    priority: 'high',
    deadline: dateFromNow(-1),
    status: 'todo',
  },
  {
    id: 'TD-004',
    title: 'Meeting koordinasi proyek',
    description:
      'Diskusikan pembagian tugas sprint berikutnya bersama tim, lalu catat hasil keputusan meeting.',
    priority: 'medium',
    deadline: dateFromNow(0),
    status: 'progress',
  },
  {
    id: 'TD-005',
    title: 'Merapikan dokumentasi API',
    description:
      'Lengkapi contoh request dan response untuk setiap endpoint, termasuk format error yang digunakan.',
    priority: 'low',
    deadline: dateFromNow(5),
    status: 'done',
  },
  {
    id: 'TD-006',
    title: 'Update portofolio dan CV',
    description:
      'Tambahkan proyek terbaru, perbarui skill, lalu sesuaikan desain CV dengan versi terbaru.',
    priority: 'low',
    deadline: dateFromNow(10),
    status: 'todo',
  },
  {
    id: 'TD-007',
    title: 'Olahraga pagi 30 menit',
    description:
      'Lakukan pemanasan, jogging ringan, dan pendinginan. Jangan lupa minum air yang cukup.',
    priority: 'medium',
    deadline: dateFromNow(0),
    status: 'done',
  },
];
