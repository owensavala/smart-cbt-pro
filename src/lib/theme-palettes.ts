import { SchoolBrandingSettings, ThemeColorKey } from './types';

export interface ThemePalettePreset {
  key: ThemeColorKey;
  name: string;
  badge: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  surfaceColor: string;
  themeMode: 'dark' | 'light' | 'navy' | 'forest' | 'custom';
}

export const THEME_PALETTES: ThemePalettePreset[] = [
  {
    key: 'blue',
    name: 'Kemdikbud Royal Blue & Gold',
    badge: 'Nuansa Resmi Kemdikbud',
    description: 'Biru resmi Tut Wuri Handayani dengan aksen emas cerah dan kanvas Navy malam.',
    primaryColor: '#2563eb',
    secondaryColor: '#f59e0b',
    bgColor: '#0a1128',
    surfaceColor: '#131d3b',
    themeMode: 'navy',
  },
  {
    key: 'emerald',
    name: 'Madrasah Emerald & Bronze Gold',
    badge: 'Nuansa Islami Kemenag',
    description: 'Hijau Zamrud Ikhlas Beramal dengan aksen emas perunggu dan latar kanvas Forest.',
    primaryColor: '#059669',
    secondaryColor: '#d97706',
    bgColor: '#061a11',
    surfaceColor: '#0d2d1e',
    themeMode: 'forest',
  },
  {
    key: 'indigo',
    name: 'Digital Tech Indigo & Neon Cyan',
    badge: 'Nuansa Cyber & High-Tech',
    description: 'Ungu Indigo futuristik dengan aksen Cyan elektrik di atas kanvas Midnight Cyber.',
    primaryColor: '#6366f1',
    secondaryColor: '#06b6d4',
    bgColor: '#0c0f1d',
    surfaceColor: '#161a33',
    themeMode: 'dark',
  },
  {
    key: 'rose',
    name: 'Crimson Bold & Sunset Amber',
    badge: 'Nuansa Berani & Dinamis',
    description: 'Merah Crimson bersemangat dengan aksen Amber hangat dan latar Ruby kegelapan.',
    primaryColor: '#e11d48',
    secondaryColor: '#f59e0b',
    bgColor: '#190b11',
    surfaceColor: '#2a121d',
    themeMode: 'dark',
  },
  {
    key: 'clean_light',
    name: 'Clean Modern Light (Mode Terang)',
    badge: 'Mode Siang Bebas Silau',
    description: 'Latar belakang putih bersih & abu-abu sejuk yang nyaman untuk mata di siang hari.',
    primaryColor: '#2563eb',
    secondaryColor: '#059669',
    bgColor: '#f1f5f9',
    surfaceColor: '#ffffff',
    themeMode: 'light',
  },
  {
    key: 'stealth_onyx',
    name: 'Onyx Stealth & Luxury Gold',
    badge: 'Dark Mode Minimalis Mewah',
    description: 'Hitam pekat Zinc 950 dengan sorotan emas elegan dan aksen biru es tajam.',
    primaryColor: '#eab308',
    secondaryColor: '#38bdf8',
    bgColor: '#09090b',
    surfaceColor: '#18181b',
    themeMode: 'dark',
  },
  {
    key: 'ocean_teal',
    name: 'Ocean Deep Teal & Coral Orange',
    badge: 'Nuansa Bahari Tropis',
    description: 'Hijau Toska Samudera dengan sentuhan oranye koral dan latar laut dalam.',
    primaryColor: '#0d9488',
    secondaryColor: '#f97316',
    bgColor: '#041517',
    surfaceColor: '#08282b',
    themeMode: 'dark',
  },
  {
    key: 'classic_espresso',
    name: 'Classic Espresso & Warm Bronze',
    badge: 'Nuansa Akademik Klasik',
    description: 'Cokelat kayu klasik perpustakaan dengan sentuhan emas hangat keemasan.',
    primaryColor: '#854d0e',
    secondaryColor: '#eab308',
    bgColor: '#1c1917',
    surfaceColor: '#292524',
    themeMode: 'dark',
  },
];

/**
 * Menghitung tingkat kecerahan warna (Luminance) untuk menentukan apakah
 * teks harus berwarna putih atau gelap slate.
 */
export function isColorDark(hex?: string): boolean {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return true;
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) || 0;
  const g = parseInt(c.substring(2, 4), 16) || 0;
  const b = parseInt(c.substring(4, 6), 16) || 0;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.55;
}

/**
 * Mendapatkan kombinasi 4 warna aktif dengan fallback yang aman.
 */
export function getResolvedThemeColors(branding?: Partial<SchoolBrandingSettings>) {
  // Cari preset yang cocok jika belum diset manual
  const matchedPreset =
    THEME_PALETTES.find((p) => p.key === branding?.themeColor) || THEME_PALETTES[0];

  const primaryColor = branding?.primaryColor || matchedPreset.primaryColor;
  const secondaryColor = branding?.secondaryColor || matchedPreset.secondaryColor;
  const bgColor = branding?.bgColor || matchedPreset.bgColor;
  const surfaceColor = branding?.surfaceColor || matchedPreset.surfaceColor;

  const isDark = isColorDark(bgColor);
  const isSurfaceDark = isColorDark(surfaceColor);

  return {
    primaryColor,
    secondaryColor,
    bgColor,
    surfaceColor,
    isDark,
    isSurfaceDark,
    textColor: isDark ? '#f8fafc' : '#0f172a',
    mutedTextColor: isDark ? '#94a3b8' : '#64748b',
    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
    cardBg: surfaceColor,
    headerBg: primaryColor,
  };
}
