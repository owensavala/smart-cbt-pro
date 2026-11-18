import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET() {
  try {
    // 1. Data Template Contoh
    const templateData = [
      {
        'No. Peserta': 'U-2026-004',
        'Nama Lengkap': 'Fajar Hidayatullah',
        NISN: '0081234570',
        NIS: '26104',
        'Jenis Kelamin (L/P)': 'L',
        Kelas: 'X MIPA 1',
        Ruang: 'LAB-01',
        Sesi: '1',
        Username: 'fajar2026',
        Password: 'siswa123',
      },
      {
        'No. Peserta': 'U-2026-005',
        'Nama Lengkap': 'Aisyah Zahra Mardhiyah',
        NISN: '0081234571',
        NIS: '26105',
        'Jenis Kelamin (L/P)': 'P',
        Kelas: 'X MIPA 2',
        Ruang: 'LAB-02',
        Sesi: '1',
        Username: 'aisyah2026',
        Password: 'siswa123',
      },
      {
        'No. Peserta': 'U-2026-006',
        'Nama Lengkap': 'Dimas Bagus Ramadhan',
        NISN: '0081234572',
        NIS: '26106',
        'Jenis Kelamin (L/P)': 'L',
        Kelas: 'X MIPA 2',
        Ruang: 'LAB-02',
        Sesi: '2',
        Username: 'dimas2026',
        Password: 'siswa123',
      },
    ];

    // 2. Buat Workbook dan Sheet
    const worksheet = XLSX.utils.json_to_sheet(templateData);

    // Set Column Widths agar rapi
    worksheet['!cols'] = [
      { wch: 16 }, // No. Peserta
      { wch: 28 }, // Nama Lengkap
      { wch: 14 }, // NISN
      { wch: 10 }, // NIS
      { wch: 18 }, // Jenis Kelamin
      { wch: 14 }, // Kelas
      { wch: 12 }, // Ruang
      { wch: 8 },  // Sesi
      { wch: 16 }, // Username
      { wch: 14 }, // Password
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa CBT');

    // 3. Export ke Buffer binary XLSX
    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename="Template_Data_Siswa_SmartCBT.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error: any) {
    console.error('Template generator error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
