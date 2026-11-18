import { loginAction } from '../src/app/actions/auth-actions';
import { prisma } from '../src/lib/prisma';

async function testAll() {
  console.log('--- 1. Testing Auth Actions ---');
  const opRes = await loginAction('operator', 'operator123');
  console.log('Operator Login:', opRes.success, opRes.user?.name, opRes.user?.role);

  const guruRes = await loginAction('dermawanf727@gmail.com', 'guru123');
  console.log('Guru Login:', guruRes.success, guruRes.user?.name, guruRes.user?.role);

  const siswaRes = await loginAction('arjun', '12345678');
  console.log('Siswa Login:', siswaRes.success, siswaRes.user?.name, siswaRes.user?.role);

  console.log('--- 2. Testing Database State ---');
  const studentCount = await prisma.student.count();
  console.log('Total Students in DB:', studentCount);

  const classList = await prisma.class.findMany({ select: { name: true, major: true, level: true } });
  console.log('Classes in DB:', classList);

  const teacherList = await prisma.teacher.findMany({ select: { user: { select: { name: true, username: true } }, nip: true } });
  console.log('Teachers in DB:', teacherList);

  const operatorList = await prisma.user.findMany({ where: { role: 'OPERATOR' }, select: { name: true, username: true } });
  console.log('Operators in DB:', operatorList);

  const attemptCount = await prisma.studentExamAttempt.count();
  console.log('Attempts in DB:', attemptCount);

  await prisma.$disconnect();
}

testAll().catch(console.error);
