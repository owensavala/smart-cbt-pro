'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Users,
  Layers,
  Settings,
  School,
  UserCheck,
  CreditCard,
  Sliders,
  LogOut,
  Lock,
  Palette,
  Database,
  CheckCircle2,
} from 'lucide-react';
import LoginView from '../components/LoginView';
import StudentPortal from '../components/StudentPortal';
import OperatorDashboard from '../components/OperatorDashboard';
import TeacherPortal from '../components/TeacherPortal';
import SuperAdminPortal from '../components/SuperAdminPortal';
import EssayGradingSimulator from '../components/EssayGradingSimulator';
import BrandingSettingsModal from '../components/BrandingSettingsModal';
import {
  MOCK_SUBJECTS,
  MOCK_TEACHERS,
  MOCK_STUDENTS,
  MOCK_EXAM_SCHEDULES,
  MOCK_STUDENT_SESSIONS,
  DEFAULT_BRANDING_SETTINGS,
  MOCK_CLASSES,
  MOCK_ROOMS,
  MOCK_SESSIONS,
} from '../lib/mock-data';
import {
  Student,
  Teacher,
  Subject,
  ExamSchedule,
  StudentSession,
  Role,
  Question,
  SchoolBrandingSettings,
  SchoolClass,
  ExamRoom,
  ExamSessionInfo,
} from '../lib/types';
import { getResolvedThemeColors } from '../lib/theme-palettes';
import {
  getStudentsAction,
  createStudentAction,
  updateStudentAction,
  deleteStudentAction,
  getStudentMasterDropdownsAction,
} from './actions/student-actions';
import {
  getTeachersAction,
  createTeacherAction,
  updateTeacherAction,
  deleteTeacherAction,
} from './actions/teacher-actions';
import {
  getClassesAction,
  createClassAction,
  updateClassAction,
  deleteClassAction,
} from './actions/class-actions';
import {
  getExamSchedulesAction,
  createExamScheduleAction,
  updateExamScheduleAction,
  deleteExamScheduleAction,
} from './actions/exam-actions';
import { getExamAttemptsAction, remoteUnlockAttemptAction } from './actions/attempt-actions';
import { getCurrentUserAction, logoutAction, setManualSessionAction } from './actions/auth-actions';
import { getSchoolBrandingAction, updateSchoolBrandingAction } from './actions/branding-actions';
import {
  getSubjectsAction,
  createSubjectAction,
  updateSubjectAction,
  deleteSubjectAction,
  getRoomsAction,
  createRoomAction,
  updateRoomAction,
  deleteRoomAction,
  getSessionsAction,
  createSessionAction,
  updateSessionAction,
  deleteSessionAction,
} from './actions/master-actions';

export default function Home() {
  // Mode View Utama: 'LOGIN' | 'OPERATOR' | 'GURU' | 'SISWA' | 'SIMULATOR' | 'SUPERADMIN'
  const [currentView, setCurrentView] = useState<'LOGIN' | 'OPERATOR' | 'GURU' | 'SISWA' | 'SIMULATOR' | 'SUPERADMIN'>('LOGIN');
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);

  // Master State Data
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [schedules, setSchedules] = useState<ExamSchedule[]>(MOCK_EXAM_SCHEDULES);
  const [studentSessions, setStudentSessions] = useState<StudentSession[]>(MOCK_STUDENT_SESSIONS);
  const [classes, setClasses] = useState<SchoolClass[]>(MOCK_CLASSES);
  const [rooms, setRooms] = useState<ExamRoom[]>(MOCK_ROOMS);
  const [sessions, setSessions] = useState<ExamSessionInfo[]>(MOCK_SESSIONS);

  // White-Label School Branding Settings
  const [branding, setBranding] = useState<SchoolBrandingSettings>(DEFAULT_BRANDING_SETTINGS);
  const [isGlobalBrandingOpen, setIsGlobalBrandingOpen] = useState(false);

  // Resolved 4-Layer Dynamic Theme
  const theme = getResolvedThemeColors(branding);

  // Load branding & restore session from localStorage on client mount (Immediate restoration on refresh)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('smart_cbt_branding');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.schoolName) {
          setBranding(parsed);
        }
      }

      // Restore active session across page refreshes (F5)
      const savedUser = localStorage.getItem('smart_cbt_auth_user');
      const savedView = localStorage.getItem('smart_cbt_current_view') as any;
      const savedTeacherId = localStorage.getItem('smart_cbt_selected_teacher_id');
      const savedStudentId = localStorage.getItem('smart_cbt_selected_student_id');

      if (savedUser && savedView && savedView !== 'LOGIN') {
        const parsedUser = JSON.parse(savedUser);
        setAuthenticatedUser(parsedUser);
        setCurrentView(savedView);
        if (savedTeacherId) setSelectedTeacherId(savedTeacherId);
        if (savedStudentId) setSelectedStudentId(savedStudentId);
      }
    } catch {
      // LocalStorage fallback
    }
  }, []);

  // LOAD REAL DATA DARI DATABASE POSTGRESQL + CEK SESI LOGIN
  useEffect(() => {
    async function loadDatabaseData() {
      let isRestoredLocally = false;
      try {
        const localUser = localStorage.getItem('smart_cbt_auth_user');
        const localView = localStorage.getItem('smart_cbt_current_view');
        if (localUser && localView && localView !== 'LOGIN') {
          isRestoredLocally = true;
        }
      } catch {}

      try {
        // 0. Fetch school branding dari database PostgreSQL
        try {
          const brandRes = await getSchoolBrandingAction();
          if (brandRes.success && brandRes.data) {
            setBranding(brandRes.data);
            try {
              localStorage.setItem('smart_cbt_branding', JSON.stringify(brandRes.data));
            } catch {}
          }
        } catch (e) {
          console.warn('Gagal memuat branding dari DB:', e);
        }

        // 1. Cek sesi login saat ini dari cookie JWT
        const session = await getCurrentUserAction();
        if (session) {
          setAuthenticatedUser(session);
          if (session.role === 'SUPER_ADMIN') {
            setCurrentView('SUPERADMIN');
          } else if (session.role === 'TEACHER') {
            setCurrentView('GURU');
          } else if (session.role === 'STUDENT') {
            setCurrentView('SISWA');
          } else {
            setCurrentView('OPERATOR');
          }
          try {
            const activeViewStr = session.role === 'SUPER_ADMIN' ? 'SUPERADMIN' : session.role === 'TEACHER' ? 'GURU' : session.role === 'STUDENT' ? 'SISWA' : 'OPERATOR';
            localStorage.setItem('smart_cbt_current_view', activeViewStr);
            localStorage.setItem('smart_cbt_auth_user', JSON.stringify(session));
          } catch {}
        } else if (isRestoredLocally) {
          // Re-sync server session cookie from localStorage
          try {
            const rawUser = localStorage.getItem('smart_cbt_auth_user');
            if (rawUser) {
              const localUser = JSON.parse(rawUser);
              if (localUser && localUser.role) {
                await setManualSessionAction({
                  userId: localUser.id || localUser.userId || 'usr_default',
                  username: localUser.username || '',
                  name: localUser.name || '',
                  role: localUser.role,
                  teacherId: localUser.role === 'TEACHER' ? localUser.id : undefined,
                  studentId: localUser.role === 'STUDENT' ? localUser.id : undefined,
                  operatorId: (localUser.role === 'OPERATOR' || localUser.role === 'SUPER_ADMIN') ? localUser.id : undefined,
                });
              }
            }
          } catch {}
        } else {
          setAuthenticatedUser(null);
          setCurrentView('LOGIN');
        }

        // 2. Fetch data siswa asli dari PostgreSQL
        const studentRes = await getStudentsAction();
        if (studentRes.success && studentRes.data && studentRes.data.length > 0) {
          setStudents(studentRes.data as any);
          setIsDbConnected(true);
        }

        // 3. Fetch data master dropdown (Kelas, Ruangan, Sesi)
        const dropdownRes = await getStudentMasterDropdownsAction();
        if (dropdownRes.success && dropdownRes.data) {
          if (dropdownRes.data.classes.length > 0) setClasses(dropdownRes.data.classes as any);
          if (dropdownRes.data.rooms.length > 0) setRooms(dropdownRes.data.rooms as any);
          if (dropdownRes.data.sessions.length > 0) setSessions(dropdownRes.data.sessions as any);
        }

        // 4. Fetch data guru asli dari PostgreSQL
        const teacherRes = await getTeachersAction();
        if (teacherRes.success && teacherRes.data && teacherRes.data.length > 0) {
          setTeachers(teacherRes.data as any);
        }

        // 5. Fetch data kelas asli dari PostgreSQL
        const classRes = await getClassesAction();
        if (classRes.success && classRes.data && classRes.data.length > 0) {
          setClasses(classRes.data as any);
        }

        // 6. Fetch jadwal ujian asli dari PostgreSQL
        const examRes = await getExamSchedulesAction();
        if (examRes.success && examRes.data && examRes.data.length > 0) {
          setSchedules(examRes.data as any);
        }

        // 7. Fetch attempt & sesi nilai siswa asli dari PostgreSQL
        const attemptRes = await getExamAttemptsAction();
        if (attemptRes.success && attemptRes.data && attemptRes.data.length > 0) {
          const mappedSessions: StudentSession[] = attemptRes.data.map((att: any) => ({
            studentId: att.studentId,
            studentName: att.studentName,
            nisn: att.nisn,
            className: att.className,
            subjectName: att.subjectName,
            status: att.status === 'SUBMITTED' ? 'SELESAI' : att.status === 'LOCKED' ? 'TERKUNCI' : 'SEDANG_MENGERJAKAN',
            violationsCount: att.violationCount,
            durationFormatted: `${Math.round(att.durationSeconds / 60)}m`,
            correctCount: att.totalCorrect,
            wrongCount: att.totalWrong,
            ipAddress: '127.0.0.1',
            answers: {},
            essayEvaluations: {},
            totalScore: att.totalScore,
            maxPossibleScore: att.maxPossibleScore,
            lastActive: att.submitTime || new Date().toISOString(),
          }));
          setStudentSessions(mappedSessions);
        }
      } catch (err) {
        console.warn('Gagal memuat data dari PostgreSQL, menggunakan data cadangan lokal.', err);
      } finally {
        setIsAuthChecking(false);
      }
    }

    loadDatabaseData();
  }, []);

  const handleSaveBranding = async (newBranding: SchoolBrandingSettings) => {
    setBranding(newBranding);
    try {
      localStorage.setItem('smart_cbt_branding', JSON.stringify(newBranding));
    } catch {
      // LocalStorage fallback
    }
    try {
      await updateSchoolBrandingAction(newBranding);
    } catch (err) {
      console.warn('Gagal menyimpan branding ke PostgreSQL:', err);
    }
  };

  // UBK Global Settings
  const [tokenRequired, setTokenRequired] = useState(true);
  const [activeToken, setActiveToken] = useState('36S7KS');

  // Sesi Aktif Guru & Siswa
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(MOCK_TEACHERS[0].id);
  const currentTeacher =
    (authenticatedUser?.role === 'TEACHER' &&
      (teachers.find((t) => t.id === authenticatedUser.id || t.username?.toLowerCase() === authenticatedUser.username?.toLowerCase()) ||
       teachers.find((t) => t.username?.toLowerCase() === 'dermawanf727@gmail.com'))) ||
    teachers.find((t) => t.id === selectedTeacherId) ||
    teachers.find((t) => t.username?.toLowerCase() === 'dermawanf727@gmail.com') ||
    teachers[0];

  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS[0].id);
  const currentStudent =
    (authenticatedUser?.role === 'STUDENT' &&
      (students.find((s) => s.id === authenticatedUser.id || s.username?.toLowerCase() === authenticatedUser.username?.toLowerCase() || s.nisn === authenticatedUser.username) ||
       students.find((s) => s.username?.toLowerCase() === 'arjun'))) ||
    students.find((s) => s.id === selectedStudentId) ||
    students.find((s) => s.username?.toLowerCase() === 'arjun') ||
    students[0];

  // Prioritaskan jadwal aktif yang cocok dengan rombel/kelas siswa saat ini (e.g. 'VII A', 'X MIPA 1')
  const activeExam =
    schedules.find((s) => {
      if (!s.isActive || !currentStudent?.className) return false;
      const studentClass = currentStudent.className.trim().toLowerCase();
      const scheduleClasses = (s.className || '')
        .split(',')
        .map((c) => c.trim().toLowerCase());
      return (
        scheduleClasses.includes(studentClass) ||
        scheduleClasses.some((c) => c.includes('semua') || c === 'semua kelas') ||
        (s.className || '').toLowerCase().includes('semua')
      );
    }) ||
    schedules.find((s) => s.isActive) ||
    schedules[0];
  const activeStudentSession =
    studentSessions.find((s) => s.studentId === currentStudent?.id) || studentSessions[0];

  // Operator Actions - REAL POSTGRESQL CRUD FOR STUDENTS
  const handleAddStudent = async (newStudent: Student) => {
    // 1. Optimistic update
    setStudents((prev) => [...prev, newStudent]);

    // 2. Simpan ke database PostgreSQL via Server Action
    const matchedClass = classes.find((c) => c.name === newStudent.className) || classes[0];
    const matchedRoom = rooms.find((r) => r.name === newStudent.room || r.code === newStudent.room);
    const matchedSession = sessions.find((s) => s.name === newStudent.session);

    const res = await createStudentAction({
      name: newStudent.name,
      username: newStudent.username || newStudent.nisn,
      password: newStudent.passwordText || 'siswa123',
      noPeserta: newStudent.noPeserta,
      nisn: newStudent.nisn,
      nis: newStudent.nis,
      classId: matchedClass ? matchedClass.id : '',
      roomId: matchedRoom ? matchedRoom.id : undefined,
      sessionId: matchedSession ? matchedSession.id : undefined,
      serverName: newStudent.server || 'SERVER-01',
    });

    // 3. Re-fetch data segar dari database
    const refreshed = await getStudentsAction();
    if (refreshed.success && refreshed.data) {
      setStudents(refreshed.data as any);
      setIsDbConnected(true);
    }
  };

  const handleUpdateStudent = async (updated: Student) => {
    // 1. Optimistic update
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));

    // 2. Simpan ke database PostgreSQL via Server Action
    const matchedClass = classes.find((c) => c.name === updated.className);
    const matchedRoom = rooms.find((r) => r.name === updated.room || r.code === updated.room);
    const matchedSession = sessions.find((s) => s.name === updated.session);

    await updateStudentAction(updated.id, {
      name: updated.name,
      username: updated.username,
      password: updated.passwordText && !updated.passwordText.includes('•') ? updated.passwordText : undefined,
      noPeserta: updated.noPeserta,
      nisn: updated.nisn,
      nis: updated.nis,
      classId: matchedClass?.id,
      roomId: matchedRoom?.id,
      sessionId: matchedSession?.id,
      serverName: updated.server,
    });

    // 3. Re-fetch data segar dari database
    const refreshed = await getStudentsAction();
    if (refreshed.success && refreshed.data) {
      setStudents(refreshed.data as any);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    // 1. Optimistic update
    setStudents((prev) => prev.filter((s) => s.id !== id));

    // 2. Hapus dari database PostgreSQL via Server Action
    await deleteStudentAction(id);

    // 3. Re-fetch data segar dari database
    const refreshed = await getStudentsAction();
    if (refreshed.success && refreshed.data) {
      setStudents(refreshed.data as any);
    }
  };

  // Refresh data siswa setelah Bulk Import Excel
  const handleRefreshStudents = async () => {
    const refreshed = await getStudentsAction();
    if (refreshed.success && refreshed.data) {
      setStudents(refreshed.data as any);
      setIsDbConnected(true);
    }
  };

  // Teacher CRUD - POSTGRESQL CONNECTED
  const handleAddTeacher = async (newTeacher: Teacher) => {
    setTeachers((prev) => [...prev, newTeacher]);
    await createTeacherAction({
      name: newTeacher.name,
      nip: newTeacher.nip,
      username: newTeacher.username,
      password: newTeacher.passwordText,
      jabatan: newTeacher.jabatan,
      assignedSubjectIds: newTeacher.assignedSubjectIds,
    });
    const refreshed = await getTeachersAction();
    if (refreshed.success && refreshed.data) {
      setTeachers(refreshed.data as any);
    }
  };
  const handleUpdateTeacher = async (updated: Teacher) => {
    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    await updateTeacherAction(updated.id, {
      name: updated.name,
      nip: updated.nip,
      username: updated.username,
      password: updated.passwordText && !updated.passwordText.includes('•') ? updated.passwordText : undefined,
      jabatan: updated.jabatan,
      assignedSubjectIds: updated.assignedSubjectIds,
    });
    const refreshed = await getTeachersAction();
    if (refreshed.success && refreshed.data) {
      setTeachers(refreshed.data as any);
    }
  };
  const handleDeleteTeacher = async (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    await deleteTeacherAction(id);
    const refreshed = await getTeachersAction();
    if (refreshed.success && refreshed.data) {
      setTeachers(refreshed.data as any);
    }
  };

  // Subject CRUD - POSTGRESQL CONNECTED
  const handleAddSubject = async (newSubject: Subject) => {
    setSubjects((prev) => [...prev, newSubject]);
    await createSubjectAction({
      code: newSubject.code,
      name: newSubject.name,
      level: newSubject.level || 'X',
    });
    const refreshed = await getSubjectsAction();
    if (refreshed.success && refreshed.data) {
      setSubjects(refreshed.data as any);
    }
  };
  const handleUpdateSubject = async (updated: Subject) => {
    setSubjects((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    await updateSubjectAction(updated.id, {
      code: updated.code,
      name: updated.name,
      level: updated.level,
    });
    const refreshed = await getSubjectsAction();
    if (refreshed.success && refreshed.data) {
      setSubjects(refreshed.data as any);
    }
  };
  const handleDeleteSubject = async (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    await deleteSubjectAction(id);
    const refreshed = await getSubjectsAction();
    if (refreshed.success && refreshed.data) {
      setSubjects(refreshed.data as any);
    }
  };

  // Exam Schedule CRUD - POSTGRESQL CONNECTED (WITH RANDOMIZE SWITCHES)
  const handleAddSchedule = async (newSchedule: ExamSchedule) => {
    setSchedules((prev) => [...prev, newSchedule]);
    const matchedSubject = subjects.find((s) => s.id === newSchedule.subjectId || s.name === newSchedule.subjectName);
    await createExamScheduleAction({
      code: newSchedule.code,
      title: newSchedule.title,
      subjectId: matchedSubject?.id || newSchedule.subjectId,
      teacherId: newSchedule.teacherId,
      startTime: newSchedule.startTime,
      endTime: newSchedule.endTime,
      durationMinutes: newSchedule.durationMinutes,
      sessionNumber: newSchedule.sessionNumber,
      tokenRequired: newSchedule.tokenRequired,
      activeToken: newSchedule.activeToken,
      randomizeQuestions: newSchedule.randomizeQuestions ?? true,
      randomizeOptions: newSchedule.randomizeOptions ?? true,
      status: newSchedule.isActive ? 'ACTIVE' : 'SCHEDULED',
    });
    const refreshed = await getExamSchedulesAction();
    if (refreshed.success && refreshed.data) {
      setSchedules(refreshed.data as any);
    }
  };
  const handleUpdateSchedule = async (updated: ExamSchedule) => {
    setSchedules((prev) => prev.map((sch) => (sch.id === updated.id ? updated : sch)));
    await updateExamScheduleAction(updated.id, {
      code: updated.code,
      title: updated.title,
      subjectId: updated.subjectId,
      teacherId: updated.teacherId,
      startTime: updated.startTime,
      endTime: updated.endTime,
      durationMinutes: updated.durationMinutes,
      sessionNumber: updated.sessionNumber,
      tokenRequired: updated.tokenRequired,
      activeToken: updated.activeToken,
      randomizeQuestions: updated.randomizeQuestions,
      randomizeOptions: updated.randomizeOptions,
      status: updated.isActive ? 'ACTIVE' : 'SCHEDULED',
    });
    const refreshed = await getExamSchedulesAction();
    if (refreshed.success && refreshed.data) {
      setSchedules(refreshed.data as any);
    }
  };
  const handleDeleteSchedule = async (id: string) => {
    setSchedules((prev) => prev.filter((sch) => sch.id !== id));
    await deleteExamScheduleAction(id);
    const refreshed = await getExamSchedulesAction();
    if (refreshed.success && refreshed.data) {
      setSchedules(refreshed.data as any);
    }
  };

  // Class CRUD - POSTGRESQL CONNECTED
  const handleAddClass = async (newClass: SchoolClass) => {
    setClasses((prev) => [...prev, newClass]);
    await createClassAction({
      name: newClass.name,
      level: newClass.level,
      major: newClass.jurusan,
    });
    const refreshed = await getClassesAction();
    if (refreshed.success && refreshed.data) {
      setClasses(refreshed.data as any);
    }
  };
  const handleUpdateClass = async (updated: SchoolClass) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    await updateClassAction(updated.id, {
      name: updated.name,
      level: updated.level,
      major: updated.jurusan,
    });
    const refreshed = await getClassesAction();
    if (refreshed.success && refreshed.data) {
      setClasses(refreshed.data as any);
    }
  };
  const handleDeleteClass = async (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    await deleteClassAction(id);
    const refreshed = await getClassesAction();
    if (refreshed.success && refreshed.data) {
      setClasses(refreshed.data as any);
    }
  };

  // Room CRUD - POSTGRESQL CONNECTED
  const handleAddRoom = async (newRoom: ExamRoom) => {
    setRooms((prev) => [...prev, newRoom]);
    await createRoomAction({
      code: newRoom.code,
      name: newRoom.name,
      capacity: newRoom.capacity,
      proctorName: newRoom.proctorName,
      serverName: newRoom.serverName,
    });
    const refreshed = await getRoomsAction();
    if (refreshed.success && refreshed.data) {
      setRooms(refreshed.data as any);
    }
  };
  const handleUpdateRoom = async (updated: ExamRoom) => {
    setRooms((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    await updateRoomAction(updated.id, {
      code: updated.code,
      name: updated.name,
      capacity: updated.capacity,
      proctorName: updated.proctorName,
      serverName: updated.serverName,
    });
    const refreshed = await getRoomsAction();
    if (refreshed.success && refreshed.data) {
      setRooms(refreshed.data as any);
    }
  };
  const handleDeleteRoom = async (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    await deleteRoomAction(id);
    const refreshed = await getRoomsAction();
    if (refreshed.success && refreshed.data) {
      setRooms(refreshed.data as any);
    }
  };

  // Session CRUD - POSTGRESQL CONNECTED
  const handleAddSession = async (newSession: ExamSessionInfo) => {
    setSessions((prev) => [...prev, newSession]);
    await createSessionAction({
      sessionNumber: newSession.sessionNumber,
      name: newSession.name,
      startTime: newSession.startTime || '07:30',
      endTime: newSession.endTime || '09:30',
      description: newSession.description,
    });
    const refreshed = await getSessionsAction();
    if (refreshed.success && refreshed.data) {
      setSessions(refreshed.data as any);
    }
  };
  const handleUpdateSession = async (updated: ExamSessionInfo) => {
    setSessions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    await updateSessionAction(updated.id, {
      sessionNumber: updated.sessionNumber,
      name: updated.name,
      startTime: updated.startTime,
      endTime: updated.endTime,
      description: updated.description,
    });
    const refreshed = await getSessionsAction();
    if (refreshed.success && refreshed.data) {
      setSessions(refreshed.data as any);
    }
  };
  const handleDeleteSession = async (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    await deleteSessionAction(id);
    const refreshed = await getSessionsAction();
    if (refreshed.success && refreshed.data) {
      setSessions(refreshed.data as any);
    }
  };

  const handleGenerateToken = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let newToken = '';
    for (let i = 0; i < 6; i++) {
      newToken += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setActiveToken(newToken);
  };

  const handleResetStudent = async (studentId: string) => {
    setStudentSessions((prev) =>
      prev.map((std) =>
        std.studentId === studentId
          ? { ...std, status: 'SEDANG_MENGERJAKAN', violationsCount: 0 }
          : std
      )
    );

    // Buka kunci jarak jauh pada PostgreSQL & state attempt jika siswa sedang terkunci
    try {
      const attemptsRes = await getExamAttemptsAction();
      if (attemptsRes.success && attemptsRes.data) {
        const studentAttempt = attemptsRes.data.find(
          (a) => a.studentId === studentId && (a.status === 'LOCKED' || a.violationCount > 0)
        );
        if (studentAttempt) {
          await remoteUnlockAttemptAction(studentAttempt.attemptId, 'Reset oleh Operator / Pengawas Dashboard');
        }
      }
    } catch (err) {
      console.warn('Gagal remote unlock di DB:', err);
    }
  };

  // Guru Actions
  const handleUpdateExamQuestions = (updatedQuestions: Question[]) => {
    setSchedules((prev) =>
      prev.map((sch) =>
        sch.id === activeExam.id ? { ...sch, questions: updatedQuestions } : sch
      )
    );
  };

  const handleUpdateTeacherProfile = (updated: Teacher) => {
    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  // Siswa Actions
  const handleStudentViolation = (count: number) => {
    const maxLimit = branding?.maxViolationsAllowed || 5;
    setStudentSessions((prev) =>
      prev.map((std) => {
        if (std.studentId === currentStudent.id) {
          const isExceeded = count >= maxLimit;
          return {
            ...std,
            violationsCount: count,
            status: isExceeded ? 'TERKUNCI' : std.status,
          };
        }
        return std;
      })
    );
  };

  const handleStudentFinished = (score: number, maxScore: number) => {
    setStudentSessions((prev) =>
      prev.map((std) =>
        std.studentId === currentStudent.id
          ? {
              ...std,
              status: 'SELESAI',
              totalScore: score,
              maxPossibleScore: maxScore,
            }
          : std
      )
    );
  };

  // Login Handler terhubung ke session
  const handleLogin = async (role: Role, username: string, sessionUser?: any) => {
    const view =
      role === 'superadmin' || sessionUser?.role === 'SUPER_ADMIN'
        ? 'SUPERADMIN'
        : role === 'operator'
        ? 'OPERATOR'
        : role === 'guru'
        ? 'GURU'
        : 'SISWA';
    setCurrentView(view);

    const userToSave = sessionUser || {
      id:
        role === 'superadmin'
          ? 'usr_superadmin'
          : role === 'guru'
          ? 'tch_dermawan'
          : role === 'siswa'
          ? 'std_arjun'
          : 'op_ahmad',
      username: username,
      name:
        role === 'superadmin'
          ? 'Super Administrator'
          : role === 'guru'
          ? 'Dermawan Surya Kencana, S. Sos'
          : role === 'operator'
          ? 'Ahmad Fauzi, S.Kom.'
          : 'ARJUN',
      role:
        role === 'superadmin'
          ? 'SUPER_ADMIN'
          : role === 'operator'
          ? 'OPERATOR'
          : role === 'guru'
          ? 'TEACHER'
          : 'STUDENT',
      jabatan: role === 'superadmin' ? 'Super Administrator CBT' : undefined,
    };
    setAuthenticatedUser(userToSave);

    if (role === 'superadmin' || sessionUser?.role === 'SUPER_ADMIN') {
      try {
        localStorage.setItem('smart_cbt_current_view', 'SUPERADMIN');
        localStorage.setItem('smart_cbt_auth_user', JSON.stringify(userToSave));
        localStorage.setItem('smart_cbt_last_role', 'superadmin');
        localStorage.setItem('smart_cbt_login_mode', 'ADMIN_GURU');
      } catch {}
    } else if (role === 'operator') {
      try {
        localStorage.setItem('smart_cbt_current_view', 'OPERATOR');
        localStorage.setItem('smart_cbt_auth_user', JSON.stringify(userToSave));
        localStorage.setItem('smart_cbt_last_role', 'operator');
        localStorage.setItem('smart_cbt_login_mode', 'ADMIN_GURU');
      } catch {}
    } else if (role === 'guru') {
      const foundTeacher = teachers.find((t) => t.username.toLowerCase() === username.toLowerCase());
      const teacherId = foundTeacher ? foundTeacher.id : 'tch_dermawan';
      setSelectedTeacherId(teacherId);
      try {
        localStorage.setItem('smart_cbt_current_view', 'GURU');
        localStorage.setItem('smart_cbt_auth_user', JSON.stringify(userToSave));
        localStorage.setItem('smart_cbt_selected_teacher_id', teacherId);
        localStorage.setItem('smart_cbt_last_role', 'guru');
        localStorage.setItem('smart_cbt_login_mode', 'ADMIN_GURU');
      } catch {}
    } else {
      const cleanUsr = username.toLowerCase();
      let foundStudent = students.find(
        (s) =>
          s.username.toLowerCase() === cleanUsr ||
          s.name.toLowerCase() === cleanUsr ||
          s.noPeserta.toLowerCase() === cleanUsr ||
          (sessionUser && (s.id === sessionUser.id || s.name.toLowerCase() === (sessionUser.name || '').toLowerCase()))
      );
      if (!foundStudent && (cleanUsr === 'arjun' || (sessionUser && sessionUser.name === 'ARJUN'))) {
        foundStudent = students.find((s) => s.id === 'std_arjun') || MOCK_STUDENTS.find((s) => s.id === 'std_arjun');
      }
      const studentId = foundStudent ? foundStudent.id : 'std_arjun';
      setSelectedStudentId(studentId);
      try {
        localStorage.setItem('smart_cbt_current_view', 'SISWA');
        localStorage.setItem('smart_cbt_auth_user', JSON.stringify(userToSave));
        localStorage.setItem('smart_cbt_selected_student_id', studentId);
        localStorage.setItem('smart_cbt_last_role', 'siswa');
        localStorage.setItem('smart_cbt_login_mode', 'SISWA');
      } catch {}
    }

    // Set cookie di server agar terhubung dua arah
    await setManualSessionAction({
      userId: userToSave.id || userToSave.userId || 'usr_default',
      username: userToSave.username || username,
      name: userToSave.name || username,
      role:
        role === 'superadmin'
          ? 'SUPER_ADMIN'
          : role === 'operator'
          ? 'OPERATOR'
          : role === 'guru'
          ? 'TEACHER'
          : 'STUDENT',
      teacherId: role === 'guru' ? userToSave.id || 'tch_dermawan' : undefined,
      studentId: role === 'siswa' ? userToSave.id || 'std_arjun' : undefined,
      operatorId: (role === 'operator' || role === 'superadmin') ? userToSave.id || 'usr_superadmin' : undefined,
    });
  };

  // Switch View Handler (Persists session across page refreshes)
  const handleSwitchView = async (newView: 'LOGIN' | 'OPERATOR' | 'GURU' | 'SISWA' | 'SIMULATOR' | 'SUPERADMIN') => {
    setCurrentView(newView);
    try {
      localStorage.setItem('smart_cbt_current_view', newView);
      if (newView === 'SUPERADMIN') {
        const superUser = {
          id: 'usr_superadmin',
          username: 'superadmin',
          name: 'Super Administrator',
          role: 'SUPER_ADMIN',
          jabatan: 'Super Administrator CBT',
        };
        setAuthenticatedUser(superUser);
        localStorage.setItem('smart_cbt_auth_user', JSON.stringify(superUser));
        localStorage.setItem('smart_cbt_last_role', 'superadmin');
        localStorage.setItem('smart_cbt_login_mode', 'ADMIN_GURU');
        await setManualSessionAction({
          userId: 'usr_superadmin',
          username: 'superadmin',
          name: 'Super Administrator',
          role: 'SUPER_ADMIN',
          operatorId: 'usr_superadmin',
        });
      } else if (newView === 'GURU') {
        const teacherUser = {
          id: 'tch_dermawan',
          username: 'dermawanf727@gmail.com',
          name: 'Dermawan Surya Kencana, S. Sos',
          role: 'TEACHER',
          nip: '198403152009021004',
          jabatan: 'Guru Sosiologi & PPKn SMA',
        };
        setAuthenticatedUser(teacherUser);
        setSelectedTeacherId('tch_dermawan');
        localStorage.setItem('smart_cbt_auth_user', JSON.stringify(teacherUser));
        localStorage.setItem('smart_cbt_selected_teacher_id', 'tch_dermawan');
        localStorage.setItem('smart_cbt_last_role', 'guru');
        localStorage.setItem('smart_cbt_login_mode', 'ADMIN_GURU');
        await setManualSessionAction({
          userId: 'tch_dermawan',
          username: 'dermawanf727@gmail.com',
          name: 'Dermawan Surya Kencana, S. Sos',
          role: 'TEACHER',
          teacherId: 'tch_dermawan',
        });
      } else if (newView === 'OPERATOR') {
        const opUser = {
          id: 'op_ahmad',
          username: 'operator',
          name: 'Ahmad Fauzi, S.Kom.',
          role: 'OPERATOR',
        };
        setAuthenticatedUser(opUser);
        localStorage.setItem('smart_cbt_auth_user', JSON.stringify(opUser));
        localStorage.setItem('smart_cbt_last_role', 'operator');
        localStorage.setItem('smart_cbt_login_mode', 'ADMIN_GURU');
        await setManualSessionAction({
          userId: 'op_ahmad',
          username: 'operator',
          name: 'Ahmad Fauzi, S.Kom.',
          role: 'OPERATOR',
          operatorId: 'op_ahmad',
        });
      } else if (newView === 'SISWA') {
        const stdUser = {
          id: 'std_arjun',
          username: 'arjun',
          name: 'ARJUN',
          role: 'STUDENT',
          studentId: 'std_arjun',
        };
        setAuthenticatedUser(stdUser);
        setSelectedStudentId('std_arjun');
        localStorage.setItem('smart_cbt_auth_user', JSON.stringify(stdUser));
        localStorage.setItem('smart_cbt_selected_student_id', 'std_arjun');
        localStorage.setItem('smart_cbt_last_role', 'siswa');
        localStorage.setItem('smart_cbt_login_mode', 'SISWA');
        await setManualSessionAction({
          userId: 'std_arjun',
          username: 'arjun',
          name: 'ARJUN',
          role: 'STUDENT',
          studentId: 'std_arjun',
        });
      }
    } catch {}
  };

  // Logout Handler
  const handleLogout = async () => {
    await logoutAction();
    try {
      localStorage.removeItem('smart_cbt_current_view');
      localStorage.removeItem('smart_cbt_auth_user');
      localStorage.removeItem('smart_cbt_selected_teacher_id');
      localStorage.removeItem('smart_cbt_selected_student_id');
    } catch {}
    setAuthenticatedUser(null);
    setCurrentView('LOGIN');
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0d1017] flex flex-col items-center justify-center text-slate-300 font-sans">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-2xl animate-pulse mb-4">
          <School className="w-8 h-8" />
        </div>
        <p className="text-base font-bold tracking-wide text-white">SmartCBT Pro</p>
        <span className="text-xs text-slate-400 mt-1 font-mono">Memuat Sistem Asesmen CBT...</span>
      </div>
    );
  }

  // 1. JIKA BELUM LOGIN / TAMPILAN HALAMAN LOGIN (FULLSCREEN)
  if (currentView === 'LOGIN' || !authenticatedUser) {
    return <LoginView onLogin={handleLogin} branding={branding} />;
  }

  // 2. VIEW OPERATOR (FULLSCREEN EDGE-TO-EDGE TANPA CONTAINER / OUTER BAR)
  if (currentView === 'OPERATOR') {
    return (
      <div
        className="min-h-screen w-full font-sans transition-colors duration-300"
        style={{
          backgroundColor: theme.bgColor,
          color: theme.textColor,
        }}
      >
        <OperatorDashboard
          teachers={teachers}
          subjects={subjects}
          students={students}
          studentSessions={studentSessions}
          exam={activeExam}
          schedules={schedules}
          classes={classes}
          rooms={rooms}
          sessions={sessions}
          tokenRequired={tokenRequired}
          activeToken={activeToken}
          branding={branding}
          onSaveBranding={handleSaveBranding}
          onToggleToken={setTokenRequired}
          onGenerateToken={handleGenerateToken}
          onResetStudent={handleResetStudent}
          onAddTeacher={handleAddTeacher}
          onUpdateTeacher={handleUpdateTeacher}
          onDeleteTeacher={handleDeleteTeacher}
          onAddSubject={handleAddSubject}
          onUpdateSubject={handleUpdateSubject}
          onDeleteSubject={handleDeleteSubject}
          onAddStudent={handleAddStudent}
          onUpdateStudent={handleUpdateStudent}
          onDeleteStudent={handleDeleteStudent}
          onAddSchedule={handleAddSchedule}
          onUpdateSchedule={handleUpdateSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          onAddClass={handleAddClass}
          onUpdateClass={handleUpdateClass}
          onDeleteClass={handleDeleteClass}
          onAddRoom={handleAddRoom}
          onUpdateRoom={handleUpdateRoom}
          onDeleteRoom={handleDeleteRoom}
          onAddSession={handleAddSession}
          onUpdateSession={handleUpdateSession}
          onDeleteSession={handleDeleteSession}
          onUpdateExamQuestions={handleUpdateExamQuestions}
          onRefreshStudents={handleRefreshStudents}
          onLogout={handleLogout}
          currentUser={authenticatedUser}
          onSwitchView={handleSwitchView}
        />
        <BrandingSettingsModal
          isOpen={isGlobalBrandingOpen}
          onClose={() => setIsGlobalBrandingOpen(false)}
          branding={branding}
          onSaveBranding={handleSaveBranding}
        />
      </div>
    );
  }

  // 3. VIEW GURU (FULLSCREEN EDGE-TO-EDGE)
  if (currentView === 'GURU') {
    return (
      <div
        className="min-h-screen w-full font-sans transition-colors duration-300"
        style={{
          backgroundColor: theme.bgColor,
          color: theme.textColor,
        }}
      >
        <TeacherPortal
          currentTeacher={currentTeacher}
          teachers={teachers}
          subjects={subjects}
          exam={activeExam}
          schedules={schedules}
          classes={classes}
          rooms={rooms}
          sessions={sessions}
          students={students}
          studentSessions={studentSessions}
          branding={branding}
          activeToken={activeToken}
          tokenRequired={tokenRequired}
          onUpdateExamQuestions={handleUpdateExamQuestions}
          onUpdateTeacherProfile={handleUpdateTeacherProfile}
          onAddSchedule={handleAddSchedule}
          onUpdateSchedule={handleUpdateSchedule}
          onDeleteSchedule={handleDeleteSchedule}
          onResetStudent={handleResetStudent}
          onLogout={handleLogout}
          onSwitchView={handleSwitchView}
        />
      </div>
    );
  }

  // 4. VIEW SISWA (FULLSCREEN EXAM PLAYER)
  if (currentView === 'SISWA') {
    return (
      <div
        className="min-h-screen w-full font-sans transition-colors duration-300"
        style={{
          backgroundColor: theme.bgColor,
          color: theme.textColor,
        }}
      >
        <StudentPortal
          currentStudent={currentStudent}
          schedules={schedules}
          activeExam={activeExam}
          studentSession={activeStudentSession}
          tokenRequired={activeExam?.tokenRequired ?? tokenRequired}
          activeToken={activeExam?.activeToken || activeToken}
          branding={branding}
          onStudentFinished={handleStudentFinished}
          onViolationReported={handleStudentViolation}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // 5. VIEW SIMULATOR
  if (currentView === 'SIMULATOR') {
    return (
      <div
        className="min-h-screen w-full font-sans p-6 transition-colors duration-300"
        style={{
          backgroundColor: theme.bgColor,
          color: theme.textColor,
        }}
      >
        <div className="max-w-6xl mx-auto mb-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Laboratorium Formula Esai AI</h2>
          <button
            onClick={() => handleSwitchView('OPERATOR')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Kembali ke Dashboard Operator
          </button>
        </div>
        <div className="max-w-6xl mx-auto">
          <EssayGradingSimulator />
        </div>
      </div>
    );
  }

  // 6. VIEW SUPER ADMIN (FULLSCREEN COMMAND CENTER)
  if (currentView === 'SUPERADMIN') {
    return (
      <div
        className="min-h-screen w-full font-sans transition-colors duration-300"
        style={{
          backgroundColor: theme.bgColor,
          color: theme.textColor,
        }}
      >
        <SuperAdminPortal
          branding={branding}
          onSaveBranding={handleSaveBranding}
          onLogout={handleLogout}
          onSwitchView={handleSwitchView}
          currentUser={authenticatedUser}
          totalStudents={students.length}
          totalTeachers={teachers.length}
          totalClasses={classes.length}
          totalSubjects={subjects.length}
        />
      </div>
    );
  }

  return null;
}
