/**
 * SmartCBT Pro - Opaque Box Inspection & A11y Verification Helpers
 * Evaluates file structure, AST/markup patterns, entity escaping, and WCAG color contrast.
 */

import * as fs from 'fs';
import * as path from 'path';

export const PROJECT_ROOT = path.resolve(__dirname, '../../..');

export function readProjectFile(relativePath: string): string {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

export function countOccurrences(content: string, substring: string): number {
  if (!content || !substring) return 0;
  return content.split(substring).length - 1;
}

export function findFilesWithSubstring(dirRelativePath: string, substring: string, extensionRegex = /\.(tsx?|jsx?)$/): string[] {
  const fullDir = path.join(PROJECT_ROOT, dirRelativePath);
  const matchingFiles: string[] = [];

  function scan(currentDir: string) {
    if (!fs.existsSync(currentDir)) return;
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
          scan(entryPath);
        }
      } else if (entry.isFile() && extensionRegex.test(entry.name)) {
        const fileContent = fs.readFileSync(entryPath, 'utf8');
        if (fileContent.includes(substring)) {
          matchingFiles.push(path.relative(PROJECT_ROOT, entryPath));
        }
      }
    }
  }

  scan(fullDir);
  return matchingFiles;
}

/**
 * WCAG 2.1 Relative Luminance & Contrast Ratio Calculation
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '').trim();
  let r = 0, g = 0, b = 0;
  if (cleaned.length === 3) {
    r = parseInt(cleaned[0] + cleaned[0], 16);
    g = parseInt(cleaned[1] + cleaned[1], 16);
    b = parseInt(cleaned[2] + cleaned[2], 16);
  } else if (cleaned.length === 6) {
    r = parseInt(cleaned.slice(0, 2), 16);
    g = parseInt(cleaned.slice(2, 4), 16);
    b = parseInt(cleaned.slice(4, 6), 16);
  }
  return { r, g, b };
}

export function getRelativeLuminance(rgb: { r: number; g: number; b: number }): number {
  const sRGB = [rgb.r, rgb.g, rgb.b].map((val) => {
    const s = val / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

export function calculateContrastRatio(color1Hex: string, color2Hex: string): number {
  const lum1 = getRelativeLuminance(hexToRgb(color1Hex));
  const lum2 = getRelativeLuminance(hexToRgb(color2Hex));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 100) / 100;
}

/**
 * Tailwind Slate Color Palette Hex Values
 */
export const TAILWIND_COLORS: Record<string, string> = {
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e2e8f0',
  'slate-300': '#cbd5e1',
  'slate-400': '#94a3b8',
  'slate-500': '#64748b',
  'slate-600': '#475569',
  'slate-700': '#334155',
  'slate-800': '#1e293b',
  'slate-900': '#0f172a',
  'white': '#ffffff',
  'black': '#000000',
  'dark-card': '#131722',
  'dark-bg': '#14171f',
};
