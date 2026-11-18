import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { exportToERaporExcel, exportToRDMExcel } from '@/lib/excel-export';
import { Student, StudentSession, ExamSchedule } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = (searchParams.get('format') || 'erapor').toLowerCase();
    const examId = searchParams.get('examId');

    // Fetch exam schedule
    let exam = examId ? await prisma.examSchedule.findUnique({
      where: { id: examId },
      include: { subject: true, teacher: { include: { user: true } } },
    }) : await prisma.examSchedule.findFirst({
      include: { subject: true, teacher: { include: { user: true } } },
    });

    // Fetch students
    const studentsDb = await prisma.student.findMany({
      include: { user: true, class: true, room: true, session: true },
      orderBy: { createdAt: 'asc' },
    });

    const students: Student[] = studentsDb.map((s) => ({
      id: s.id,
      noPeserta: s.noPeserta,
      name: s.user.name,
      nisn: s.nisn,
      nis: s.nis || '-',
      level: s.class?.level || 'VI',
      className: s.class?.name || 'VI-A',
      jurusan: s.class?.major || 'Madrasah Ibtidaiyah',
      username: s.user.username,
      passwordText: '••••••••',
      room: s.room?.name || 'Ruang 01',
      session: s.session?.name || 'Sesi 1',
      server: s.serverName || 'SERVER-01',
    }));

    // Fetch attempts
    const attempts = await prisma.studentExamAttempt.findMany({
      where: exam?.id ? { examId: exam.id } : undefined,
    });

    const studentSessions: StudentSession[] = attempts.map((att) => ({
      studentId: att.studentId,
      studentName: '',
      nisn: '',
      className: '',
      subjectName: exam?.title || 'Ujian CBT',
      status: att.status === 'SUBMITTED' ? 'SELESAI' : 'SEDANG_MENGERJAKAN',
      violationsCount: att.violationsCount,
      durationFormatted:
        att.startTime && att.submitTime
          ? `${Math.round((att.submitTime.getTime() - att.startTime.getTime()) / 60000)}m`
          : '0m',
      correctCount: att.totalCorrect,
      wrongCount: att.totalWrong,
      ipAddress: att.ipAddress || '127.0.0.1',
      answers: {},
      essayEvaluations: {},
      totalScore: att.totalScore,
      maxPossibleScore: att.maxPossibleScore,
      lastActive: att.updatedAt.toISOString(),
    }));

    const anyExam = exam as any;
    const examData: any = {
      id: exam?.id || 'exam_default',
      code: exam?.code || 'CBT-01',
      title: exam?.title || 'Asesmen Sumatif Akhir Semester',
      subjectId: exam?.subjectId || 'sub_1',
      subjectName: exam?.subject?.name || 'IPA Terpadu',
      subject: exam?.subject?.name || 'IPA Terpadu',
      level: anyExam?.level || 'VI',
      className: anyExam?.className || 'VI-A',
      teacherId: exam?.teacherId || 'tch_1',
      teacherName: exam?.teacher?.user?.name || 'Guru Pengampu',
      examDate: '18 Mei 2026',
      startTime: exam?.startTime || '07:30',
      endTime: exam?.endTime || '09:30',
      dayOfWeek: 'SENIN',
      durationMinutes: exam?.durationMinutes || 90,
      sessionNumber: 1,
      isActive: true,
      totalQuestions: 20,
      tokenRequired: exam?.tokenRequired ?? true,
      activeToken: exam?.activeToken || '36S7KS',
      proctorPin: exam?.proctorPin || '889900',
      questions: [],
    };

    const options = {
      students,
      studentSessions,
      exam: examData,
    };

    const binaryData =
      format === 'rdm' ? exportToRDMExcel(options) : exportToERaporExcel(options);

    const filename =
      format === 'rdm'
        ? `Rekap_Nilai_RDM_${Date.now()}.xlsx`
        : `Rekap_Nilai_eRapor_${Date.now()}.xlsx`;

    return new NextResponse(Buffer.from(binaryData), {
      status: 200,
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error('Export scores API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
