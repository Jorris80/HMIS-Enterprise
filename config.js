/*
 * HMIS Enterprise — konfigurasi server (v2.3)
 * ------------------------------------------------------------------
 * Memakai SUPABASE: isi dua baris di bawah lalu commit. Semua perangkat (staf & pasien yang
 * memindai QR denah) otomatis terhubung ke Supabase — tidak perlu mengisi apa pun di HP.
 *
 *   supabaseUrl : Project URL   → Supabase › Project Settings › Data API (https://xxxx.supabase.co)
 *   supabaseKey : Publishable key (sb_publishable_…) atau legacy "anon" key
 *                 JANGAN PERNAH memakai secret key / service_role di sini (file ini publik).
 *
 * Memakai GOOGLE APPS SCRIPT: biarkan kosong (alamat /exec diisi di layar login atau lewat tautan ?api=).
 */
window.HMIS_CONFIG = {
  supabaseUrl: '',
  supabaseKey: ''
};
