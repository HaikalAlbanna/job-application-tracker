# Job Tracker — Aplikasi Pencatatan Lamaran Kerja

Aplikasi web untuk mencatat, mengelola, dan memantau seluruh proses lamaran kerja. Berjalan sepenuhnya di browser, data tersimpan lokal (tanpa database online), dan mendukung import/export Excel.

## Menjalankan aplikasi

```bash
npm install        # atau: bun install
npm run dev        # buka http://localhost:8080
npm run build      # build produksi
```

## Library yang digunakan

| Library | Fungsi |
| --- | --- |
| React 19 + TanStack Start / Router | Framework & routing halaman |
| Tailwind CSS v4 | Styling (design token di `src/styles.css`) |
| xlsx (SheetJS) | Baca & tulis file Excel (.xlsx / .xls) |
| zod | Validasi form |
| sonner | Notifikasi toast |
| lucide-react | Ikon |
| Radix UI (alert-dialog) | Dialog konfirmasi hapus |

## Struktur folder

```
src/
  lib/
    applications.ts      # tipe data, daftar status, helper tanggal WIB, store localStorage (CRUD)
    excel.ts             # parse file Excel -> data lamaran, export Excel, template
  hooks/
    useApplications.ts   # hook reaktif ke store localStorage
  components/app/
    AppShell.tsx         # layout, navigasi, header halaman
    StatusBadge.tsx      # badge berwarna per status
    ApplicationForm.tsx  # form tambah/edit dengan validasi
    ApplicationTable.tsx # tabel data + konfirmasi hapus
  routes/
    index.tsx            # Dashboard (kartu statistik, diagram status, per bulan, terbaru)
    lamaran.index.tsx    # Daftar lamaran (cari, filter status, sort tanggal, export)
    lamaran.baru.tsx     # Tambah lamaran
    lamaran.$id.edit.tsx # Edit lamaran
    import.tsx           # Import Excel (upload, preview, validasi, konfirmasi)
    panduan.tsx          # Panduan penggunaan
  styles.css             # design system (warna, status, font)
```

## Penyimpanan data lokal

Aplikasi menggunakan **localStorage** browser dengan key `job-tracker:applications:v1`. Semua data disimpan sebagai array JSON. Data tetap ada setelah refresh atau browser ditutup.

Mengapa bukan file JSON di dalam project? Aplikasi yang berjalan di browser tidak dapat menulis file ke disk secara langsung — itu membutuhkan backend/filesystem server. localStorage memenuhi kebutuhan "lokal tanpa database online" dan tersedia di semua browser.

Keterbatasan: data terikat pada browser dan perangkat yang dipakai. Membersihkan data situs, memakai mode incognito, atau berpindah perangkat berarti data tidak ikut.

### Backup & restore
- **Backup:** halaman Daftar Lamaran → **Export Excel**. Semua data diunduh sebagai `.xlsx`.
- **Restore:** halaman Import Excel → pilih file hasil export. Data ditambahkan ke data yang ada.

## Format Excel untuk import

Baris pertama berisi judul kolom (urutan bebas, nama kolom tidak peka huruf besar/kecil). Sheet pertama yang dibaca. Template dapat diunduh dari halaman Import atau Panduan.

| Tempat / Perusahaan | Posisi | Link Pendaftaran | Status | Tanggal Pendaftaran | Catatan |
| --- | --- | --- | --- | --- | --- |
| PT ABC Indonesia | IT Staff | https://www.jobstreet.co.id/... | Menunggu Review | 01-09-2026 | Kontak HR: 0812xxxx |

- **Wajib:** Tempat / Perusahaan, Posisi. Sisanya opsional.
- **Status:** salah satu dari — Baru Didaftarkan, Menunggu Review, Lolos Screening, Tes / Assessment, Interview HR, Interview User, Offering, Diterima, Ditolak, Mengundurkan Diri, Tidak Ada Kabar, Lowongan Ditutup. Kosong → Baru Didaftarkan.
- **Tanggal:** DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, atau sel tanggal Excel. Kosong → hari ini (WIB).
- Baris yang tidak valid ditampilkan di preview beserta alasannya dan dilewati saat import.

## Panduan penggunaan singkat

1. **Tambah Lamaran** — isi perusahaan & posisi, pilih status, tanggal otomatis WIB (bisa diubah), catatan opsional.
2. **Daftar Lamaran** — cari berdasarkan perusahaan/posisi, filter status, urutkan terbaru/terlama, klik ikon pensil untuk edit atau tempat sampah untuk hapus (dengan konfirmasi).
3. **Dashboard** — kartu statistik (total, aktif, menunggu review, tes, interview, diterima, ditolak, mengundurkan diri), diagram per status & per bulan, daftar terbaru. Diperbarui otomatis.
4. **Import Excel** — pilih file, cek preview, klik *Tambahkan*. Notifikasi menampilkan jumlah berhasil/gagal.
5. **Export Excel** — untuk cadangan atau dipakai di aplikasi lain.
