import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { Role } from '@prisma/client';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'smartcbt-super-secure-jwt-secret-key-2026-indonesia'
);

export const COOKIE_NAME = 'smartcbt_session';

export interface UserSessionPayload {
  userId: string;
  username: string;
  name: string;
  role: Role;
  studentId?: string;
  teacherId?: string;
  operatorId?: string;
  schoolId?: string | null;
}

// 1. SIGN JWT TOKEN
export async function signSessionToken(payload: UserSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}

// 2. VERIFY JWT TOKEN (Universal: Node.js & Edge Runtime Compatible)
export async function verifySessionToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

// 3. SET HTTP-ONLY SESSION COOKIE
export async function setSessionCookie(payload: UserSessionPayload) {
  const token = await signSessionToken(payload);
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 jam
    });
  } catch (err) {
    // Graceful fallback when cookies() is unavailable outside request context
  }
  return token;
}

// 4. CLEAR SESSION COOKIE (LOGOUT)
export async function clearSessionCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch (err) {}
}

// 5. GET CURRENT USER FROM SESSION
export async function getSession(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch (err) {
    return null;
  }
}

// 6. VERIFY CREDENTIALS FROM POSTGRESQL
export async function verifyCredentials(username: string, passwordPlain: string) {
  // Siswa bisa login menggunakan username, noPeserta, atau NISN
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: username },
        { email: username },
        { studentProfile: { noPeserta: username } },
        { studentProfile: { nisn: username } },
      ],
    },
    include: {
      studentProfile: true,
      teacherProfile: true,
      operatorProfile: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  // Bandingkan password bcrypt
  const isMatch = await bcrypt.compare(passwordPlain, user.password);
  if (!isMatch) {
    return null;
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  const sessionPayload: UserSessionPayload = {
    userId: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    studentId: user.studentProfile?.id,
    teacherId: user.teacherProfile?.id,
    operatorId: user.operatorProfile?.id,
    schoolId:
      user.studentProfile?.schoolId ||
      user.teacherProfile?.schoolId ||
      user.operatorProfile?.schoolId,
  };

  return sessionPayload;
}
