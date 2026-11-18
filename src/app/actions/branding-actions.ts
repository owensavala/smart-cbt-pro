'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { SchoolBrandingSettings, ThemeColorKey } from '@/lib/types';
import { DEFAULT_BRANDING_SETTINGS } from '@/lib/mock-data';
import { getResolvedThemeColors } from '@/lib/theme-palettes';

// Map database ThemeColor enum to ThemeColorKey
function mapDbThemeColor(dbColor: string): ThemeColorKey {
  const c = dbColor?.toLowerCase() || 'emerald';
  if (c === 'blue') return 'blue';
  if (c === 'indigo') return 'indigo';
  if (c === 'purple') return 'indigo';
  if (c === 'rose') return 'rose';
  if (c === 'amber') return 'amber';
  if (c === 'slate') return 'slate';
  return 'emerald';
}

// 1. GET SCHOOL BRANDING DARI DATABASE POSTGRESQL
export async function getSchoolBrandingAction(): Promise<{
  success: boolean;
  data: SchoolBrandingSettings;
}> {
  try {
    const school = await prisma.school.findFirst({
      include: {
        branding: true,
      },
    });

    if (!school) {
      return { success: true, data: DEFAULT_BRANDING_SETTINGS };
    }

    const branding = school.branding;
    const cfg = (branding?.backupConfigJson as any) || {};
    const fallbackTheme = branding ? mapDbThemeColor(branding.themeColor) : DEFAULT_BRANDING_SETTINGS.themeColor;
    const resolved = getResolvedThemeColors({
      themeColor: cfg.themeColor || fallbackTheme,
      primaryColor: cfg.primaryColor,
      secondaryColor: cfg.secondaryColor,
      bgColor: cfg.bgColor,
      surfaceColor: cfg.surfaceColor,
    });

    const mapped: SchoolBrandingSettings = {
      schoolName: school.name || DEFAULT_BRANDING_SETTINGS.schoolName,
      subName: school.subName || DEFAULT_BRANDING_SETTINGS.subName,
      npsn: school.npsn || DEFAULT_BRANDING_SETTINGS.npsn,
      jenjang:
        school.level === 'SMA_SMK_MA'
          ? 'MA/SMA/SMK'
          : school.level === 'SMP_MTS'
          ? 'MTs/SMP'
          : school.level === 'SD_MI'
          ? 'MI/SD'
          : 'UNIVERSITAS / UMUM',
      academicYear: school.academicYear || DEFAULT_BRANDING_SETTINGS.academicYear,
      semester: school.semester === 'GENAP' ? 'Genap' : 'Ganjil',
      kepalaSekolah: school.headmasterName || DEFAULT_BRANDING_SETTINGS.kepalaSekolah,
      nipKepalaSekolah: school.headmasterNip || DEFAULT_BRANDING_SETTINGS.nipKepalaSekolah,
      proktorName: school.proctorName || DEFAULT_BRANDING_SETTINGS.proktorName,
      nipProktor: school.proctorNip || DEFAULT_BRANDING_SETTINGS.nipProktor,
      logoType: (branding?.logoType?.toLowerCase() as any) || DEFAULT_BRANDING_SETTINGS.logoType,
      customLogoUrl: branding?.customLogoUrl || undefined,
      studentLoginLogoUrl: cfg.studentLoginLogoUrl || undefined,
      loginHeroImageUrl: cfg.loginHeroImageUrl || undefined,
      loginBgImageUrl: cfg.loginBgImageUrl || undefined,
      operatorLogoUrl: cfg.operatorLogoUrl || undefined,
      themeColor: cfg.themeColor || fallbackTheme,
      primaryColor: cfg.primaryColor || resolved.primaryColor,
      secondaryColor: cfg.secondaryColor || resolved.secondaryColor,
      bgColor: cfg.bgColor || resolved.bgColor,
      surfaceColor: cfg.surfaceColor || resolved.surfaceColor,
      themeMode: cfg.themeMode || (resolved.isDark ? 'dark' : 'light'),
      loginHeroText: branding?.loginHeroTitle || DEFAULT_BRANDING_SETTINGS.loginHeroText,
      loginSubText: branding?.loginHeroSubtitle || DEFAULT_BRANDING_SETTINGS.loginSubText,
      enableWatermark: branding?.enableWatermark ?? DEFAULT_BRANDING_SETTINGS.enableWatermark,
      watermarkOpacity: branding?.watermarkOpacity ?? DEFAULT_BRANDING_SETTINGS.watermarkOpacity,
      maxViolationsAllowed: branding?.maxViolationsAllowed ?? DEFAULT_BRANDING_SETTINGS.maxViolationsAllowed,
      enableFullscreenLock: branding?.enableFullscreenLock ?? DEFAULT_BRANDING_SETTINGS.enableFullscreenLock,
      enableAutoSave: branding?.enableAutoSave ?? DEFAULT_BRANDING_SETTINGS.enableAutoSave,
      allowTokenBypass: branding?.allowTokenBypass ?? DEFAULT_BRANDING_SETTINGS.allowTokenBypass,
      hideDemoLogin: cfg.hideDemoLogin ?? false,
    };

    return { success: true, data: mapped };
  } catch (error: any) {
    console.warn('getSchoolBrandingAction error, returning defaults:', error);
    return { success: true, data: DEFAULT_BRANDING_SETTINGS };
  }
}

// 2. UPDATE SCHOOL BRANDING OLEH SUPER ADMIN
export async function updateSchoolBrandingAction(branding: SchoolBrandingSettings): Promise<{
  success: boolean;
  message: string;
  data?: SchoolBrandingSettings;
}> {
  try {
    let school = await prisma.school.findFirst();

    if (!school) {
      school = await prisma.school.create({
        data: {
          npsn: branding.npsn || '60204321',
          name: branding.schoolName,
          subName: branding.subName,
          level:
            branding.jenjang === 'MA/SMA/SMK'
              ? 'SMA_SMK_MA'
              : branding.jenjang === 'MTs/SMP'
              ? 'SMP_MTS'
              : branding.jenjang === 'MI/SD'
              ? 'SD_MI'
              : 'SMA_SMK_MA',
          academicYear: branding.academicYear,
          semester: branding.semester === 'Genap' ? 'GENAP' : 'GANJIL',
          headmasterName: branding.kepalaSekolah,
          headmasterNip: branding.nipKepalaSekolah,
          proctorName: branding.proktorName,
          proctorNip: branding.nipProktor,
        },
      });
    } else {
      school = await prisma.school.update({
        where: { id: school.id },
        data: {
          name: branding.schoolName,
          subName: branding.subName,
          level:
            branding.jenjang === 'MA/SMA/SMK'
              ? 'SMA_SMK_MA'
              : branding.jenjang === 'MTs/SMP'
              ? 'SMP_MTS'
              : branding.jenjang === 'MI/SD'
              ? 'SD_MI'
              : 'SMA_SMK_MA',
          academicYear: branding.academicYear,
          semester: branding.semester === 'Genap' ? 'GENAP' : 'GANJIL',
          headmasterName: branding.kepalaSekolah,
          headmasterNip: branding.nipKepalaSekolah,
          proctorName: branding.proktorName,
          proctorNip: branding.nipProktor,
        },
      });
    }

    // Map themeColor key to ThemeColor Enum
    const upperColor = branding.themeColor.toUpperCase();
    const mappedThemeColor: any = ['BLUE', 'EMERALD', 'INDIGO', 'PURPLE', 'ROSE', 'AMBER', 'SLATE'].includes(upperColor)
      ? upperColor
      : 'EMERALD';

    // Map logoType to LogoType Enum
    const upperLogo = branding.logoType.toUpperCase();
    const mappedLogoType: any = ['MADRASAH', 'KEMDIKBUD', 'CUSTOM', 'PESANTREN', 'TECHNO'].includes(upperLogo)
      ? upperLogo
      : 'MADRASAH';

    const paletteConfig = {
      primaryColor: branding.primaryColor,
      secondaryColor: branding.secondaryColor,
      bgColor: branding.bgColor,
      surfaceColor: branding.surfaceColor,
      themeMode: branding.themeMode,
      themeColor: branding.themeColor,
      studentLoginLogoUrl: branding.studentLoginLogoUrl || null,
      loginHeroImageUrl: branding.loginHeroImageUrl || null,
      loginBgImageUrl: branding.loginBgImageUrl || null,
      operatorLogoUrl: branding.operatorLogoUrl || null,
      hideDemoLogin: branding.hideDemoLogin ?? false,
    };

    await prisma.schoolBranding.upsert({
      where: { schoolId: school.id },
      update: {
        appName: 'SmartCBT Pro',
        appSubName: branding.subName,
        themeColor: mappedThemeColor,
        logoType: mappedLogoType,
        customLogoUrl: branding.customLogoUrl || null,
        loginHeroTitle: branding.loginHeroText,
        loginHeroSubtitle: branding.loginSubText,
        enableWatermark: branding.enableWatermark,
        watermarkOpacity: branding.watermarkOpacity,
        enableFullscreenLock: branding.enableFullscreenLock,
        maxViolationsAllowed: branding.maxViolationsAllowed,
        enableAutoSave: branding.enableAutoSave,
        allowTokenBypass: branding.allowTokenBypass,
        backupConfigJson: paletteConfig,
      },
      create: {
        schoolId: school.id,
        appName: 'SmartCBT Pro',
        appSubName: branding.subName,
        themeColor: mappedThemeColor,
        logoType: mappedLogoType,
        customLogoUrl: branding.customLogoUrl || null,
        loginHeroTitle: branding.loginHeroText,
        loginHeroSubtitle: branding.loginSubText,
        enableWatermark: branding.enableWatermark,
        watermarkOpacity: branding.watermarkOpacity,
        enableFullscreenLock: branding.enableFullscreenLock,
        maxViolationsAllowed: branding.maxViolationsAllowed,
        enableAutoSave: branding.enableAutoSave,
        allowTokenBypass: branding.allowTokenBypass,
        backupConfigJson: paletteConfig,
      },
    });

    try {
      revalidatePath('/');
    } catch {
      // Ignore outside request context
    }
    return {
      success: true,
      message: 'Pengaturan identitas, warna, dan logo berhasil disimpan secara permanen.',
      data: branding,
    };
  } catch (error: any) {
    console.error('updateSchoolBrandingAction error:', error);
    return {
      success: false,
      message: 'Gagal menyimpan perubahan ke database: ' + (error?.message || 'Error tidak diketahui'),
    };
  }
}
